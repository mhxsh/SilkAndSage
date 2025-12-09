# -- ai_data_generator/config.py --

# --- AI Configuration ---
# Setting a specific, known-working model for ModelScope
AI_MODEL = "Qwen/Qwen3-235B-A22B-Instruct-2507" 

# --- Content Generation Topics ---
# CORRECTED: Each topic now includes a slug from identities.csv (e.g., 'capricorn', 'intp')
# This will allow the script to correctly map the identity_id.
TOPICS_TO_GENERATE = [
    "five-elements-theory-for-virgo-interior-design",
    "how-to-create-a-zen-workspace-for-a-capricorn",
    "the-art-of-tea-meditation-for-anxious-enfp-minds",
    "using-jade-and-silk-in-libra-skincare-rituals",
    "a-guide-to-minimalist-wardrobe-for-mbti-type-intp",
]

# --- Language Configuration ---
LANGUAGES = ["en", "zh"]

# --- Output Configuration ---
OUTPUT_DIR = "output"
PAGES_FILENAME = f"{OUTPUT_DIR}/generated_pages_rows.sql"
TRANSLATIONS_FILENAME = f"{OUTPUT_DIR}/generated_page_translations_rows.sql"
