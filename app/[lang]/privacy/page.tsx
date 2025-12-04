import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    const content = {
        en: {
            title: 'Privacy Policy',
            lastUpdated: 'Last updated: December 2024',
            intro: 'Silk & Sage ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process your information across our website and services.',
            sections: [
                {
                    title: '1. Information We Collect',
                    subsections: [
                        {
                            heading: 'Information You Provide:',
                            items: [
                                'Account Registration: Name, email address, password, profile preferences',
                                'Quiz Results: Your MBTI type, zodiac sign, inner element, and related responses',
                                'Interactions: Comments, ratings, favorites, and engagement with content',
                                'Communications: Messages, feedback, and support requests',
                            ],
                        },
                        {
                            heading: 'Automatically Collected Information:',
                            items: [
                                'Device Information: Type, operating system, browser type, IP address',
                                'Usage Data: Pages visited, time spent, clicks, search queries',
                                'Cookies & Tracking: Analytics cookies, preference cookies, session tokens',
                                'Location Data: Approximate location from IP address (not precise)',
                            ],
                        },
                        {
                            heading: 'From Third Parties:',
                            items: [
                                'Authentication Services: OAuth providers (if used for login)',
                                'Analytics Services: Aggregated usage statistics',
                            ],
                        },
                    ],
                },
                {
                    title: '2. How We Use Your Information',
                    subsections: [
                        {
                            heading: 'We use collected information to:',
                            items: [
                                'Provide and improve our services and personalized recommendations',
                                'Create and manage your account',
                                'Communicate with you regarding service updates, support, and announcements',
                                'Analyze usage patterns to enhance user experience',
                                'Prevent fraud and ensure platform security',
                                'Comply with legal obligations and enforce our terms',
                                'Send promotional content (with your consent)',
                            ],
                        },
                    ],
                },
                {
                    title: '3. Data Sharing & Disclosure',
                    subsections: [
                        {
                            heading: 'We may share your information with:',
                            items: [
                                'Service Providers: Hosting, analytics, payment processors (bound by confidentiality)',
                                'Legal Compliance: Law enforcement, courts, or regulatory bodies when required',
                                'Business Transfers: In case of merger, acquisition, or asset sale',
                                'With Your Consent: For partnerships or collaborations you explicitly approve',
                                'Public Data: Profile information and comments (if you choose to share publicly)',
                            ],
                        },
                        {
                            heading: 'We do NOT:',
                            items: [
                                'Sell your personal data to third parties for marketing',
                                'Share your quiz results without your explicit consent',
                                'Disclose sensitive information without legal basis',
                            ],
                        },
                    ],
                },
                {
                    title: '4. Data Retention',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                'Account Data: Retained as long as your account is active. You may request deletion anytime.',
                                'Quiz Results: Stored to personalize your experience; deletable upon request.',
                                'Usage Analytics: Aggregated data retained for service improvement; personally identifiable data deleted after 12 months.',
                                'Communications: Retained for service purposes; deleted upon request unless legally required.',
                            ],
                        },
                    ],
                },
                {
                    title: '5. Your Privacy Rights',
                    subsections: [
                        {
                            heading: 'Depending on your location, you may have the right to:',
                            items: [
                                'Access: Request a copy of your personal data',
                                'Correction: Update or correct inaccurate information',
                                'Deletion: Request erasure of your data ("Right to be Forgotten")',
                                'Portability: Receive your data in a portable format',
                                'Opt-Out: Withdraw consent for marketing communications',
                                'Restrict Processing: Limit how we use your information',
                                'Lodge Complaints: Contact your local data protection authority',
                            ],
                        },
                    ],
                },
                {
                    title: '6. Security Measures',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                'Encryption: Data transmitted via SSL/TLS encryption',
                                'Access Control: Limited employee access to personal data',
                                'Regular Audits: Security assessments and vulnerability testing',
                                'Password Security: Encrypted password storage using industry standards',
                                'Incident Response: Prompt notification of any breaches affecting you',
                            ],
                        },
                    ],
                },
                {
                    title: '7. Cookies & Tracking Technologies',
                    subsections: [
                        {
                            heading: 'We use:',
                            items: [
                                'Essential Cookies: Required for platform functionality',
                                'Analytics Cookies: Google Analytics to understand user behavior',
                                'Preference Cookies: Remember your language and theme settings',
                                'Marketing Cookies: Track interactions for personalized content (optional)',
                            ],
                        },
                        {
                            heading: 'You can:',
                            items: [
                                'Control cookies via browser settings',
                                'Opt-out of analytics tracking',
                                'Use "Do Not Track" browser signals (we respect DNT)',
                            ],
                        },
                    ],
                },
                {
                    title: '8. Third-Party Links',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                'Our platform may contain links to external websites and products.',
                                'We are not responsible for their privacy practices.',
                                'Review their privacy policies before sharing information.',
                            ],
                        },
                    ],
                },
                {
                    title: '9. Children\'s Privacy',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                'Silk & Sage is not directed to children under 13.',
                                'We do not knowingly collect data from children under 13.',
                                'If we discover such data, we will delete it immediately.',
                                'For users 13-18: Additional parental consent may be required in some jurisdictions.',
                            ],
                        },
                    ],
                },
                {
                    title: '10. Data Processing & Jurisdiction',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                'Data is processed and stored on secure servers.',
                                'For GDPR compliance (EU/UK): We rely on legal bases such as consent, legitimate interests, or contractual necessity.',
                                'For CCPA compliance (California): You have specific rights including opt-out and data sale disclosure.',
                                'For other jurisdictions: We comply with applicable local data protection laws.',
                            ],
                        },
                    ],
                },
                {
                    title: '11. Policy Updates',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                'We may update this policy to reflect legal changes or operational updates.',
                                'We will notify you of material changes via email or platform notification.',
                                'Continued use of our platform constitutes acceptance of updated policies.',
                            ],
                        },
                    ],
                },
                {
                    title: '12. Contact Us',
                    subsections: [
                        {
                            heading: 'For privacy concerns or requests:',
                            items: [
                                'Email: privacy@silkandsage.com',
                                'Mailing Address: [Your Company Address]',
                                'Response Time: We aim to respond within 30 days',
                                'Data Protection Officer: dpo@silkandsage.com (if applicable)',
                            ],
                        },
                    ],
                },
            ],
        },
        zh: {
            title: '隐私政策',
            lastUpdated: '最后更新：2024年12月',
            intro: '《丝语·智慧》（"我们"或"公司"）致力于保护您的隐私。本隐私政策说明我们如何在网站和服务中收集、使用、披露和处理您的信息。',
            sections: [
                {
                    title: '1. 我们收集的信息',
                    subsections: [
                        {
                            heading: '您主动提供的信息：',
                            items: [
                                '账户注册：姓名、邮箱、密码、个人资料偏好',
                                '测试结果：您的MBTI类型、星座、内在元素和相关回答',
                                '互动内容：评论、评分、收藏和内容参与',
                                '沟通信息：消息、反馈和支持请求',
                            ],
                        },
                        {
                            heading: '自动收集的信息：',
                            items: [
                                '设备信息：设备类型、操作系统、浏览器类型、IP地址',
                                '使用数据：访问的页面、停留时间、点击、搜索查询',
                                'Cookie和追踪：分析cookie、偏好cookie、会话令牌',
                                '位置数据：来自IP地址的近似位置（非精确定位）',
                            ],
                        },
                        {
                            heading: '来自第三方的信息：',
                            items: [
                                '身份验证服务：OAuth提供商（如用于登录）',
                                '分析服务：汇总的使用统计数据',
                            ],
                        },
                    ],
                },
                {
                    title: '2. 我们如何使用您的信息',
                    subsections: [
                        {
                            heading: '我们使用收集的信息来：',
                            items: [
                                '提供和改进我们的服务及个性化推荐',
                                '创建和管理您的账户',
                                '与您沟通有关服务更新、支持和公告',
                                '分析使用模式以增强用户体验',
                                '防止欺诈并确保平台安全',
                                '遵守法律义务并执行我们的条款',
                                '发送促销内容（征得您的同意）',
                            ],
                        },
                    ],
                },
                {
                    title: '3. 数据共享与披露',
                    subsections: [
                        {
                            heading: '我们可能与以下方面共享您的信息：',
                            items: [
                                '服务提供商：托管、分析、支付处理商（受保密协议约束）',
                                '法律合规：执法机构、法院或监管机构（在法律要求时）',
                                '业务转让：在合并、收购或资产出售的情况下',
                                '征得您的同意：用于您明确批准的合作伙伴关系',
                                '公开数据：个人资料和评论（如您选择公开分享）',
                            ],
                        },
                        {
                            heading: '我们不会：',
                            items: [
                                '将您的个人数据出售给第三方用于营销',
                                '未经明确同意而共享您的测试结果',
                                '在无法律基础的情况下披露敏感信息',
                            ],
                        },
                    ],
                },
                {
                    title: '4. 数据保留',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                '账户数据：只要您的账户保持活跃就保留。您可以随时请求删除。',
                                '测试结果：为个性化您的体验而保留；可根据您的要求删除。',
                                '使用分析：汇总数据为改进服务保留；个人身份数据在12个月后删除。',
                                '通信记录：为服务目的保留；根据您的要求删除，除非法律要求。',
                            ],
                        },
                    ],
                },
                {
                    title: '5. 您的隐私权',
                    subsections: [
                        {
                            heading: '根据您的位置，您可能拥有以下权利：',
                            items: [
                                '访问权：请求获取您个人数据的副本',
                                '更正权：更新或更正不准确的信息',
                                '删除权：请求删除您的数据（"被遗忘权"）',
                                '可携带权：以便携式格式接收您的数据',
                                '退出权：撤回营销通信同意',
                                '限制权：限制我们如何使用您的信息',
                                '投诉权：向当地数据保护机构投诉',
                            ],
                        },
                    ],
                },
                {
                    title: '6. 安全措施',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                '加密：通过SSL/TLS加密传输数据',
                                '访问控制：限制员工访问个人数据',
                                '定期审计：安全评估和漏洞测试',
                                '密码安全：使用行业标准加密存储密码',
                                '事件响应：及时通知影响您的任何数据泄露',
                            ],
                        },
                    ],
                },
                {
                    title: '7. Cookie和追踪技术',
                    subsections: [
                        {
                            heading: '我们使用：',
                            items: [
                                '必要Cookie：平台功能所需',
                                '分析Cookie：Google分析以了解用户行为',
                                '偏好Cookie：记住您的语言和主题设置',
                                '营销Cookie：追踪交互以提供个性化内容（可选）',
                            ],
                        },
                        {
                            heading: '您可以：',
                            items: [
                                '通过浏览器设置控制cookie',
                                '退出分析追踪',
                                '使用"不追踪"浏览器信号（我们尊重此设置）',
                            ],
                        },
                    ],
                },
                {
                    title: '8. 第三方链接',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                '我们的平台可能包含外部网站和产品的链接。',
                                '我们不对其隐私实践负责。',
                                '在共享信息前，请查看其隐私政策。',
                            ],
                        },
                    ],
                },
                {
                    title: '9. 儿童隐私',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                '《丝语·智慧》不针对13岁以下儿童。',
                                '我们不知情地收集13岁以下儿童的数据。',
                                '如果我们发现此类数据，将立即删除。',
                                '对于13-18岁用户：在某些司法管辖区可能需要额外的父母同意。',
                            ],
                        },
                    ],
                },
                {
                    title: '10. 数据处理与管辖权',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                '数据在安全服务器上处理和存储。',
                                'GDPR合规（欧盟/英国）：我们基于同意、合法利益或合同必要性进行处理。',
                                'CCPA合规（加州）：您拥有特定权利，包括退出和数据销售披露。',
                                '其他司法管辖区：我们遵守适用的本地数据保护法。',
                            ],
                        },
                    ],
                },
                {
                    title: '11. 政策更新',
                    subsections: [
                        {
                            heading: '',
                            items: [
                                '我们可能更新此政策以反映法律或运营变化。',
                                '我们将通过邮件或平台通知您重大更改。',
                                '继续使用我们的平台表示接受更新的政策。',
                            ],
                        },
                    ],
                },
                {
                    title: '12. 联系我们',
                    subsections: [
                        {
                            heading: '如有隐私疑问或请求：',
                            items: [
                                '邮箱：privacy@silkandsage.com',
                                '邮寄地址：[您的公司地址]',
                                '响应时间：我们力求在30天内回复',
                                '数据保护官：dpo@silkandsage.com（如适用）',
                            ],
                        },
                    ],
                },
            ],
        },
    }

    const pageContent = content[lang as keyof typeof content] || content.en

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                        {pageContent.title}
                    </h1>
                    <p className="text-sm text-gray-500">{pageContent.lastUpdated}</p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Intro */}
                <div className="mb-12 p-6 bg-sage/5 rounded-lg border border-sage/20">
                    <p className="text-lg text-gray-700 leading-relaxed">{pageContent.intro}</p>
                </div>

                {/* Sections */}
                <div className="space-y-12">
                    {pageContent.sections.map((section, sectionIndex) => (
                        <section key={sectionIndex}>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                {section.title}
                            </h2>

                            <div className="space-y-6">
                                {section.subsections.map((subsection, subIndex) => (
                                    <div key={subIndex}>
                                        {subsection.heading && (
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                {subsection.heading}
                                            </h3>
                                        )}
                                        <ul className="space-y-2 text-gray-700">
                                            {subsection.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex gap-3">
                                                    <span className="text-sage font-bold mt-1">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                        {lang === 'zh'
                            ? '本隐私政策符合GDPR、CCPA和其他国际数据保护标准。如有任何疑问，请随时联系我们。'
                            : 'This Privacy Policy complies with GDPR, CCPA, and other international data protection standards. For any questions, please contact us.'}
                    </p>
                </div>
            </div>
        </div>
    )
}
