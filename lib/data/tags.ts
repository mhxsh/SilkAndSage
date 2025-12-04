export const TAG_TRANSLATIONS: Record<string, string> = {
    // Elements
    '木': 'Wood',
    '火': 'Fire',
    '土': 'Earth',
    '金': 'Metal',
    '水': 'Water',
    '五行': 'Five Elements',

    // Lifestyle & Practices
    '生活方式': 'Lifestyle',
    '健康': 'Wellness',
    '养生': 'Wellness',
    '家居': 'Decor',
    '职场': 'Career',
    '人际关系': 'Relationships',
    '自我成长': 'Self Growth',
    '自我关怀': 'Self-care',
    '冥想': 'Meditation',
    '瑜伽': 'Yoga',
    '茶道': 'Tea Ceremony',
    '香道': 'Incense',
    '花道': 'Flower Arrangement',

    // Aesthetics & Styles
    '禅意': 'Zen',
    '侘寂风': 'Wabi-sabi',
    '极简': 'Minimalism',
    '极简主义': 'Minimalism',
    '风水': 'Feng Shui',
    '色彩心理学': 'Color Psychology',

    // Activities
    '护肤': 'Skincare',
    '穿搭': 'Fashion',
    '时尚': 'Style',
    '旅行': 'Travel',
    '美食': 'Food',
    '艺术': 'Art',
    '设计': 'Design',

    // Emotions & States
    '焦虑': 'Anxiety',
    '压力': 'Stress',
    '平衡': 'Balance',
    '和谐': 'Harmony',

    // Specific Items
    '卧室': 'Bedroom',
    '工作狂': 'Workaholic',
    '幸运色': 'Lucky Colors',

    // MBTI (保持小写或大写)
    'infj': 'INFJ',
    'intj': 'INTJ',
    'enfp': 'ENFP',
    'entp': 'ENTP',
    'infp': 'INFP',
    'intp': 'INTP',
    'enfj': 'ENFJ',
    'entj': 'ENTJ',
    'isfj': 'ISFJ',
    'istj': 'ISTJ',
    'esfp': 'ESFP',
    'estp': 'ESTP',
    'isfp': 'ISFP',
    'istp': 'ISTP',
    'esfj': 'ESFJ',
    'estj': 'ESTJ',

    // Zodiac
    '白羊座': 'Aries',
    '金牛座': 'Taurus',
    '双子座': 'Gemini',
    '巨蟹座': 'Cancer',
    '狮子座': 'Leo',
    '处女座': 'Virgo',
    '天秤座': 'Libra',
    '天蝎座': 'Scorpio',
    '射手座': 'Sagittarius',
    '摩羯座': 'Capricorn',
    '水瓶座': 'Aquarius',
    '双鱼座': 'Pisces',

    // Years
    '2025': '2025',

    // Keep as-is
    'wellness': 'Wellness'
}

export const REVERSE_TAG_TRANSLATIONS: Record<string, string> = Object.entries(TAG_TRANSLATIONS).reduce((acc, [key, value]) => {
    acc[value.toLowerCase()] = key
    return acc
}, {} as Record<string, string>)

export function translateTag(tag: string, locale: string): string {
    if (!tag) return ''
    if (locale === 'zh') return tag
    return TAG_TRANSLATIONS[tag] || tag
}

export function getOriginalTag(tag: string, locale: string): string {
    if (!tag) return ''
    if (locale === 'zh') return tag
    return REVERSE_TAG_TRANSLATIONS[tag.toLowerCase()] || tag
}
