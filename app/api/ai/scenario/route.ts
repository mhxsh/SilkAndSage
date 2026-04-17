import { NextRequest, NextResponse } from 'next/server';
import { generateScenarioReason } from '../../../lib/ai/scenario-generator';
import { getPageBySlug } from '../../../lib/data/pages';
import { getProduct } from '../../../lib/shopify';

/**
 * POST /api/ai/scenario
 * 
 * Body: {
 *   tcmType: string,
 *   articleSlug: string,
 *   productId: string (Shopify handle)
 * }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tcmType, articleSlug, productId } = body;

        if (!tcmType || !articleSlug || !productId) {
            return NextResponse.json(
                { error: 'Missing required parameters: tcmType, articleSlug, productId' },
                { status: 400 }
            );
        }

        // 1. 获取文章数据以提取意境
        const article = await getPageBySlug(articleSlug, 'zh');
        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // 提取文章标题和部分内容作为意境参考
        const articleTheme = `${article.translations.title}. ${article.translations.generated_text?.summary || ''}`;

        // 2. 获取商品数据
        const product = await getProduct(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const productTitle = product.title;
        const productVettingReport = product.parsedMetafields?.ss_vetting_report || product.descriptionHtml || '';

        // 3. 调用 AI 生成场景理由
        const reason = await generateScenarioReason(
            tcmType,
            articleTheme,
            productTitle,
            productVettingReport,
            'zh'
        );

        return NextResponse.json({
            tcmType,
            articleTitle: article.translations.title,
            productTitle,
            reason
        });

    } catch (error: any) {
        console.error('Error in scenario API:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
