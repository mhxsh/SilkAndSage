'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendSageMessage, ChatMessage } from '@/lib/actions/chat'

interface SageChatProps {
    lang: 'zh' | 'en'
}

export default function SageChat({ lang }: SageChatProps) {
    const [isOpen, setIsOpen] = useState(false)
    // Add default initial message based on lang
    const initialMessage = {
        role: 'assistant',
        content: lang === 'zh'
            ? '你好，我是 Sage。此刻，你的内心感觉如何？'
            : 'Hello, I am Sage. How is your heart feeling right now?'
    } as ChatMessage

    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const newUserMsg: ChatMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Pass the conversation history + new message
            // Note: For MVP we might just pass recent context to save tokens, 
            // but the server action handles RAG injection.
            // Let's pass the last few messages to maintain conversation thread context + RAG
            const conversationHistory = [...messages, newUserMsg].slice(-6); // last 6 messages

            const reply = await sendSageMessage(conversationHistory, lang);

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: lang === 'zh' ? '抱歉，我似乎链接不到宇宙信号了...' : 'Sorry, I lost connection to the cosmic signal...' }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-sage/20 overflow-hidden flex flex-col"
                        style={{ height: '500px' }}
                    >
                        {/* Header */}
                        <div className="bg-sage p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
                                <span className="font-serif font-bold tracking-wide">Sage AI</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                                        ${msg.role === 'user'
                                                ? 'bg-sage text-white rounded-br-none'
                                                : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-bl-none'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm rounded-bl-none">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={lang === 'zh' ? '与 Sage 对话...' : 'Talk to Sage...'}
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/50 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="w-10 h-10 rounded-full bg-sage text-white flex items-center justify-center hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    ↑
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-white border-2 border-sage/20 shadow-lg flex items-center justify-center text-2xl overflow-hidden relative group"
            >
                {isOpen ? (
                    <span className="text-gray-500">✕</span>
                ) : (
                    <>
                        <span className="absolute inset-0 bg-gradient-to-tr from-sage/10 to-transparent group-hover:from-sage/20 transition-all"></span>
                        🧘‍♀️
                    </>
                )}
            </motion.button>
        </div>
    )
}
