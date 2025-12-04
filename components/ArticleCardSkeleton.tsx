export default function ArticleCardSkeleton() {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="h-56 bg-gray-200" />
            <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="flex gap-2 mb-3">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="flex gap-4 mt-4">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}

export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
            ))}
        </div>
    )
}
