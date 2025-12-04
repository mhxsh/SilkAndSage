'use client'

import { useState } from 'react'

interface ShareButtonProps {
    url: string
    title: string
}

export default function ShareButton({ url, title }: ShareButtonProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [copied, setCopied] = useState(false)

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('复制失败', err)
        }
    }

    const shareToWeChat = () => {
        // 微信分享需要扫码
        alert('请使用微信扫一扫功能分享此页面')
    }

    const shareToWeibo = () => {
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(
            shareUrl
        )}&title=${encodeURIComponent(title)}`
        window.open(weiboUrl, '_blank', 'width=600,height=400')
    }

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
        )}&text=${encodeURIComponent(title)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
    }

    const shareToFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(fbUrl, '_blank', 'width=600,height=400')
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
                <span>分享</span>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                        onClick={handleCopyLink}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        <span>{copied ? '已复制！' : '复制链接'}</span>
                    </button>

                    <button
                        onClick={shareToWeChat}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                        <span className="text-xl">💬</span>
                        <span>微信</span>
                    </button>

                    <button
                        onClick={shareToWeibo}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                        <span className="text-xl">📱</span>
                        <span>微博</span>
                    </button>

                    <button
                        onClick={shareToTwitter}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                        <span className="text-xl">🐦</span>
                        <span>Twitter</span>
                    </button>

                    <button
                        onClick={shareToFacebook}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                        <span className="text-xl">📘</span>
                        <span>Facebook</span>
                    </button>
                </div>
            )}
        </div>
    )
}
