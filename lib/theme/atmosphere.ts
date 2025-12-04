export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type Festival = 'new_year' | 'mid_autumn' | 'none'

export interface Atmosphere {
    id: string
    season: Season
    festival: Festival
    element: string
    colors: {
        primary: string // 主色调 (用于按钮、强调)
        secondary: string // 辅助色 (用于图标、次要元素)
        background: string // 背景色 (Hero 区域背景)
        text: string // 文本颜色
        accent: string // 装饰色
    }
    pattern?: string // 可选的背景纹理类名
}

/**
 * 获取当前日期的氛围主题
 */
export function getAtmosphere(date: Date = new Date()): Atmosphere {
    const month = date.getMonth() + 1 // 1-12
    const day = date.getDate()

    // 1. 检查特殊节日
    // 春节 (粗略估算为 1月-2月)
    if (month === 1 || (month === 2 && day < 15)) {
        return THEMES.new_year
    }

    // 2. 检查季节
    // 春季 (3-5月)
    if (month >= 3 && month <= 5) {
        return THEMES.spring
    }
    // 夏季 (6-8月)
    if (month >= 6 && month <= 8) {
        return THEMES.summer
    }
    // 秋季 (9-11月)
    if (month >= 9 && month <= 11) {
        return THEMES.autumn
    }
    // 冬季 (12-2月)
    return THEMES.winter
}

export const THEMES: Record<string, Atmosphere> = {
    spring: {
        id: 'spring',
        season: 'spring',
        festival: 'none',
        element: 'wood',
        colors: {
            primary: '#8A9A5B', // Sage Green (保持品牌色)
            secondary: '#E8F5E9', // Very light green
            background: '#F1F8E9', // Pale Green
            text: '#2E4033', // Dark Green
            accent: '#F48FB1', // Soft Pink (花朵)
        },
    },
    summer: {
        id: 'summer',
        season: 'summer',
        festival: 'none',
        element: 'fire',
        colors: {
            primary: '#E57373', // Soft Red/Terracotta
            secondary: '#FFF3E0', // Light Orange
            background: '#FFF8E1', // Pale Yellow/Cream
            text: '#BF360C', // Deep Orange/Brown
            accent: '#4DB6AC', // Teal (清凉感)
        },
    },
    autumn: {
        id: 'autumn',
        season: 'autumn',
        festival: 'none',
        element: 'metal',
        colors: {
            primary: '#D4A373', // Muted Gold/Brown
            secondary: '#FAEBD7', // Antique White
            background: '#FEF5E7', // Warm Beige
            text: '#5D4037', // Dark Brown
            accent: '#C62828', // Deep Red (枫叶)
        },
    },
    winter: {
        id: 'winter',
        season: 'winter',
        festival: 'none',
        element: 'water',
        colors: {
            primary: '#78909C', // Blue Grey
            secondary: '#ECEFF1', // Very light grey
            background: '#F5F7FA', // Cool White/Grey
            text: '#37474F', // Dark Blue Grey
            accent: '#FFD54F', // Warm Yellow (冬日暖阳)
        },
    },
    new_year: {
        id: 'new_year',
        season: 'winter',
        festival: 'new_year',
        element: 'fire', // Simplified from Fire/Earth
        colors: {
            primary: '#C62828', // Festive Red
            secondary: '#FFEBEE', // Light Red
            background: '#FFF5F5', // Warm Red tint
            text: '#880E4F', // Dark Red/Purple
            accent: '#FFD700', // Gold
        },
    },
}
