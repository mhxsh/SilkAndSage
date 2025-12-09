# -- ai_data_generator/main.py --
import os
import json
import requests
import uuid
import csv
from dotenv import load_dotenv
from datetime import datetime, timezone

# Load configuration from the config file
import config

# --- HELPER FUNCTIONS ---

def load_identities_map(file_path: str) -> dict:
    """Loads the identities.csv file into a dictionary mapping slug -> id."""
    identities_map = {}
    try:
        with open(file_path, mode='r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            for row in reader:
                identities_map[row['slug']] = row['id']
        print(f"Successfully loaded {len(identities_map)} identities from {file_path}")
        return identities_map
    except FileNotFoundError:
        print(f"FATAL ERROR: Identities file not found at {file_path}. Cannot map identity_id.")
        return {}

def find_identity_id(topic_slug: str, identities_map: dict) -> str:
    """Finds the corresponding identity ID from the topic slug."""
    for identity_slug, identity_id in identities_map.items():
        if identity_slug in topic_slug:
            return identity_id
    # This warning is now less likely since we updated the topics in config.py
    print(f"WARNING: No matching identity found for topic '{topic_slug}'. A random UUID will be used.")
    return str(uuid.uuid4())

def get_image_from_unsplash(query: str) -> str:
    """Searches Unsplash and returns an optimized image URL."""
    unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not unsplash_access_key or unsplash_access_key == "your_unsplash_access_key":
        print(f"WARNING: UNSPLASH_ACCESS_KEY not configured. Using placeholder.")
        return "https://images.unsplash.com/photo-1542601904-86B062faf563?w=1200"

    api_url = f"https://api.unsplash.com/search/photos?query={query}&per_page=10&orientation=landscape"
    headers = {"Authorization": f"Client-ID {unsplash_access_key}"}
    
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        if data["results"]:
            image_url = data["results"][0]["urls"]["regular"]
            return f"{image_url.split('?')[0]}?w=1200"
        else:
            print(f"WARNING: No Unsplash image found for query: '{query}'.")
            return "https://images.unsplash.com/photo-1542601904-86B062faf563?w=1200"
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Failed to fetch image from Unsplash. {e}")
        return "https://images.unsplash.com/photo-1542601904-86B062faf563?w=1200"

def generate_content_with_ai(topic: str, lang: str) -> dict:
    """Generates structured content with a flexible, custom authentication header."""
    api_key = os.getenv("MOOD_AI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL")
    header_name = os.getenv("CUSTOM_AUTH_HEADER_NAME")
    header_prefix = os.getenv("CUSTOM_AUTH_HEADER_VALUE_PREFIX", "") # Defaults to empty string

    if not api_key or not base_url:
        raise ValueError("Required environment variables MOOD_AI_API_KEY or OPENAI_BASE_URL not set.")

    url = f"{base_url}/chat/completions"
    
    # Construct authentication header
    headers = {"Content-Type": "application/json"}

        # Fallback to standard OpenAI Bearer token
    headers["Authorization"] = f"Bearer {api_key}"
    print("Using standard auth: {'Authorization': 'Bearer [REDACTED]'}")


    system_prompt = """
You are a content creator for "Silk & Sage," a lifestyle brand blending Eastern wisdom with modern aesthetics. Your tone is insightful and sounds like a wise, trusted friend.
You will be given a TOPIC and a LANGUAGE. Generate a complete content package as a single JSON object.

The JSON object MUST have these top-level keys:
- "title": A beautiful, engaging title for the article.
- "image_search_query": A simple, effective 2-5 word English query for Unsplash.
- "tags": A JSON array of 5 relevant string tags.
- "generated_text": A nested JSON object containing the four parts of the article:
  - "hook": A short, relatable opening sentence or question (approx. 20-30 words).
  - "insight": The core philosophical insight connecting the user's identity/problem to an Eastern concept (approx. 80-100 words).
  - "curation": A list of 3-4 recommended product types or practices in Markdown list format, formatted as:### ENFP Exclusive Items\n\n- **Handmade Ceramic Tea Set**: Ritual of slowing down\n- **Sandalwood Incense**: Calming for sleep
  - "solution": Practical, actionable steps formatted as a Markdown list or with headings (approx. 150-200 words).
"""
    
    payload = {
        "model": config.AI_MODEL,
        "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": f"TOPIC: {topic}\nLANGUAGE: {lang}"}],
        "temperature": 0.8,
    }

    print(f"  -> Attempting to generate content for topic '{topic}' in '{lang}'...")
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=120)
        if response.status_code != 200:
            print(f"  -> FATAL AI ERROR: API returned status {response.status_code}. Details: {response.text}")
            return None

        response_data = response.json()
        content_json_str = response_data.get("choices", [{}])[0].get("message", {}).get("content")
        if not content_json_str:
            print(f"  -> FATAL AI ERROR: 'content' field not found. Full Response: {response_data}")
            return None
        
        print(f"  -> Successfully generated content for '{topic}' in '{lang}'.")
        return json.loads(content_json_str)
    except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
        print(f"  -> FATAL AI ERROR: {e.__class__.__name__}. Details: {e}")
        return None

def escape_sql_string(value) -> str:
    """Escapes single quotes for SQL insertion and handles various types."""
    if value is None: return "NULL"
    if isinstance(value, (dict, list)): value = json.dumps(value, ensure_ascii=False)
    return f"'{str(value).replace("'", "''")}'"

# --- MAIN EXECUTION ---
def main():
    load_dotenv()
    print("--- Starting AI Data Generator (Schema-Corrected & ID-Mapped) ---")
    
    # Construct path to identities.csv relative to this script's location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    identities_csv_path = os.path.join(script_dir, 'identities.csv')
    
    identities_map = load_identities_map(identities_csv_path)
    if not identities_map: return

    # Construct path for the output directory relative to the script's location
    output_dir_path = os.path.join(script_dir, config.OUTPUT_DIR)
    pages_filename_path = os.path.join(script_dir, config.PAGES_FILENAME)
    translations_filename_path = os.path.join(script_dir, config.TRANSLATIONS_FILENAME)

    if not os.path.exists(output_dir_path): os.makedirs(output_dir_path)

    with open(pages_filename_path, 'w', encoding='utf-8') as f: f.write('')
    with open(translations_filename_path, 'w', encoding='utf-8') as f: f.write('')

    translation_id_counter = 1

    with open(pages_filename_path, 'a', encoding='utf-8') as pages_file, \
         open(translations_filename_path, 'a', encoding='utf-8') as translations_file:
        
        print(f"Generating SQL for {len(config.TOPICS_TO_GENERATE)} topics...")

        for topic in config.TOPICS_TO_GENERATE:
            page_uuid = str(uuid.uuid4())
            page_slug = topic.lower().replace(" ", "-")
            
            identity_id = find_identity_id(page_slug, identities_map)

            primary_lang = config.LANGUAGES[0] if config.LANGUAGES else 'en'
            ai_content = generate_content_with_ai(topic, primary_lang)

            if not ai_content:
                print(f"FATAL: Could not generate primary content for topic '{topic}'. Skipping.")
                continue
            
            image_url = get_image_from_unsplash(ai_content.get("image_search_query", topic))
            tags_list = ai_content.get("tags", [])
            tags_sql_array = "{" + ",".join([f'"{tag}"' for tag in tags_list]) + "}"
            now_utc = datetime.now(timezone.utc).isoformat()

            page_sql = (
                f'INSERT INTO "public"."generated_pages" ("id", "slug", "identity_id", "generated_image_url", "tags", "views_count", "comments_count", "ratings_count", "average_score", "status", "published_at", "created_at") '
                f"VALUES ('{page_uuid}', '{page_slug}', '{identity_id}', '{image_url}', '{tags_sql_array}', 0, 0, 0, 0, 'published', '{now_utc}', '{now_utc}');\n"
            )
            pages_file.write(page_sql)
            print(f"Generated SQL for page '{page_slug}' (Identity: {identity_id})")

            for lang in config.LANGUAGES:
                current_content = ai_content if lang == primary_lang else generate_content_with_ai(topic, lang)
                
                if not current_content:
                    print(f"Skipping translation for '{topic}' in '{lang}'.")
                    continue

                title_sql = escape_sql_string(current_content.get("title"))
                generated_text_sql = escape_sql_string(current_content.get("generated_text"))
                tags_sql_array_lang = "{" + ",".join([f'"{tag}"' for tag in current_content.get("tags", [])]) + "}"

                translation_sql = (
                    f'INSERT INTO "public"."generated_page_translations" ("id", "page_id", "language_code", "title", "generated_text", "tags") '
                    f"VALUES ('{translation_id_counter}', '{page_uuid}', '{lang}', {title_sql}, {generated_text_sql}, '{tags_sql_array_lang}');\n"
                )
                translations_file.write(translation_sql)
                print(f"  -> Generated translation in '{lang}'")
                translation_id_counter += 1

    print(f"\n--- Generation Complete ---\nSQL files saved in '{output_dir_path}'.")

if __name__ == "__main__":
    main()
