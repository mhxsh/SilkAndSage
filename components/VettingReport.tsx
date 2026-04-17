'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { TCMBodyType } from '@/types/tcm'

interface VettingReportProps {
  tcmType?: string | null
  productTags?: string[]
  vettingReport?: string
  curatorNote?: string
  lang?: string
}

export default function VettingReport({
  tcmType,
  productTags = [],
  vettingReport,
  curatorNote,
  lang = 'zh'
}: VettingReportProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 匹配逻辑：如果用户体质在产品标签中，则视为完美匹配
  const isMatch = tcmType && productTags.includes(tcmType)
  
  const title = lang === 'zh' ? 'Sage 睿选审计报告' : 'Why it fits you'
  
  // 匹配描述文案
  const getMatchDescription = () => {
    if (!tcmType) {
      return lang === 'zh' 
        ? '完成元素测试，解锁专属契合度分析' 
        : 'Complete the quiz to unlock personalized matching analysis'
    }

    if (isMatch) {
      return lang === 'zh'
        ? `✨ 此商品与您的 ${tcmType}质 完美契合，能够有效平衡您的内在能量。`
        : `✨ This item is a perfect match for your ${tcmType} constitution, helping to balance your inner energy.`
    }

    return lang === 'zh'
      ? `此商品适合：${productTags.join('、')}。作为 ${tcmType}质，它也能为您带来独特的审美体验。`
      : `Recommended for: ${productTags.join(', ')}. As a ${tcmType} person, it also offers a unique aesthetic experience.`
  }

  if (!vettingReport && !curatorNote && !tcmType) return null

  return (
    <div className="mt-4 border border-[#D4AF37]/30 rounded-lg overflow-hidden bg-[#8A9A5B]/5 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#8A9A5B]/10 transition-colors"
      >
        <span className="text-sm font-medium text-[#8A9A5B] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[#8A9A5B]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4">
              {/* 匹配描述 */}
              <div className="text-xs text-gray-700 bg-white/50 p-2 rounded border border-[#8A9A5B]/10">
                {getMatchDescription()}
              </div>

              {/* 审计报告 */}
              {vettingReport && (
                <div className="prose prose-sm max-w-none text-xs text-gray-600 prose-headings:text-sage prose-strong:text-sage">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1 font-bold">
                    {lang === 'zh' ? '材质与审美审计' : 'Material & Aesthetic Audit'}
                  </h4>
                  <ReactMarkdown>{vettingReport}</ReactMarkdown>
                </div>
              )}

              {/* 主编感悟 */}
              {curatorNote && (
                <div className="pt-2 border-t border-[#D4AF37]/20">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-2 font-bold">
                    {lang === 'zh' ? '主编感悟' : 'Curator\'s Note'}
                  </h4>
                  <div className="relative">
                    <span className="absolute -left-1 -top-2 text-2xl text-[#D4AF37]/30 font-serif opacity-50">“</span>
                    <p className="font-serif italic text-gray-700 text-sm pl-3 leading-relaxed">
                      {curatorNote}
                    </p>
                    <span className="absolute -right-1 bottom-0 text-2xl text-[#D4AF37]/30 font-serif opacity-50">”</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
