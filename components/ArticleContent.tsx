import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleContentProps {
    content: any
    dict?: any
}

export default function ArticleContent({ content, dict }: ArticleContentProps) {
    // 假设 generated_text 是一个包含各部分的 JSON 对象
    const { hook, insight, solution, curation } = content

    return (
        <article className="prose prose-lg max-w-none">
            {hook && (
                <section className="mb-8">
                    <div className="text-lg text-gray-700 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{hook}</ReactMarkdown>
                    </div>
                </section>
            )}

            {insight && (
                <section className="mb-8 bg-sage/5 p-6 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold mb-4 text-sage">
                        {dict?.article?.insight_title || 'Eastern Insight'}
                    </h2>
                    <div className="text-gray-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{insight}</ReactMarkdown>
                    </div>
                </section>
            )}

            {solution && (
                <section className="mb-8">
                    <h2 className="text-2xl font-serif font-semibold mb-4">
                        {dict?.article?.solution_title || 'Lifestyle Solution'}
                    </h2>
                    <div className="text-gray-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{solution}</ReactMarkdown>
                    </div>
                </section>
            )}

            {curation && (
                <section className="mb-8 bg-cream/50 p-6 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold mb-4">
                        {dict?.article?.curation_title || 'Curated Items'}
                    </h2>
                    <div className="text-gray-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{curation}</ReactMarkdown>
                    </div>
                </section>
            )}
        </article>
    )
}
