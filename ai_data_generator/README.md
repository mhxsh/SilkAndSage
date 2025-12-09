# AI Data Generator for Silk & Sage

This tool automates the creation of content for the Silk & Sage project. It uses an AI model (compatible with OpenAI's API) to generate articles and fetches matching images from Unsplash. The final output is saved as SQL `INSERT` statements.

## Setup Instructions

### 1. Create a Virtual Environment
It's recommended to use a virtual environment to keep dependencies isolated.

```bash
# In the root of the 'SilkAndSage' directory
python -m venv venv
```

### 2. Activate the Environment
- **On Windows:**
  ```bash
  .\venv\Scripts\activate
  ```
- **On macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```
Navigate into the generator directory:
```bash
cd ai_data_generator
```

### 3. Install Dependencies
Install the required Python libraries.

```bash
pip install -r requirements.txt
```

### 4. Configure API Keys
The script needs API keys for the AI service and Unsplash.

- Rename the `.env.example` file to `.env`.
- Open the `.env` file and add your actual API keys.

```dotenv
# .env

# For standard OpenAI, the default URL is fine.
# For other services, update the OPENAI_BASE_URL.
OPENAI_API_KEY="your_real_openai_or_compatible_api_key"
OPENAI_BASE_URL="https://api.openai.com/v1"

# Get a free key from the Unsplash Developer portal
UNSPLASH_ACCESS_KEY="your_real_unsplash_access_key"
```

### 5. Customize Your Content
Open `config.py` to control what content gets generated:
- `AI_MODEL`: Change the model if you're using a different one (e.g., `"gpt-4-turbo"`).
- `TOPICS_TO_GENERATE`: Edit this Python list to add the article themes you want.
- `LANGUAGES`: Add or remove language codes (e.g., `"en"`, `"zh"`).
- `STARTING_PAGE_ID`: Set this to a number higher than the last `id` in your `pages` table to avoid conflicts.

## How to Run

Once everything is configured, simply run the `main.py` script from within the `ai_data_generator` directory:

```bash
python main.py
```

The script will:
1. Create an `output` directory if it doesn't exist.
2. For each topic in `config.py`:
   - Generate a new entry in `output/generated_pages.sql`.
   - For each language, generate a corresponding entry in `output/generated_page_translations.sql` with AI-generated text and an image from Unsplash.

## Important Notes
- **Append Mode:** The script appends to the `.sql` files. If you want to start fresh, delete the files in the `output` directory before running the script.
- **Review Output:** Always review the generated `.sql` files before running them on your database to ensure the content is correct.
- **SQL Escaping:** The script includes a basic function to escape single quotes in the generated text. However, always be cautious when executing scripts that modify your database.
