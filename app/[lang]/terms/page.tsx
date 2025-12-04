import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export default async function TermsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    const content = {
        en: {
            title: 'Terms of Service',
            lastUpdated: 'Last updated: December 2024',
            intro: 'Welcome to Silk & Sage. These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and services (collectively, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Platform.',
            sections: [
                {
                    title: '1. Use License',
                    content: [
                        'We grant you a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial purposes.',
                        'You agree not to:',
                        '• Modify, reproduce, distribute, or create derivative works from Platform content',
                        '• Use automated tools, bots, or scrapers to access the Platform',
                        '• Engage in any unlawful activities or violate applicable laws',
                        '• Harass, abuse, or defame other users',
                        '• Upload viruses, malware, or malicious code',
                        '• Attempt to gain unauthorized access to the Platform or its systems',
                    ],
                },
                {
                    title: '2. User Accounts',
                    content: [
                        'You are responsible for maintaining the confidentiality of your account credentials.',
                        'You agree to provide accurate, complete, and current information during registration.',
                        'You are liable for all activities conducted under your account.',
                        'We reserve the right to suspend or terminate accounts that violate these Terms.',
                        'You may delete your account at any time; however, we may retain certain data as required by law.',
                    ],
                },
                {
                    title: '3. Content Ownership & Rights',
                    content: [
                        'All Platform content (articles, images, designs, quiz results) is owned by Silk & Sage or its content providers.',
                        'You retain ownership of content you upload (comments, ratings, reviews).',
                        'By uploading content, you grant us a non-exclusive, royalty-free license to use, distribute, and modify such content for Platform purposes.',
                        'You represent and warrant that you own or have permission to share all content you upload.',
                        'We may remove content that violates these Terms or applicable laws.',
                    ],
                },
                {
                    title: '4. Intellectual Property',
                    content: [
                        'All trademarks, logos, and brand names displayed on the Platform are our property or those of our licensors.',
                        'You may not use our intellectual property without express written consent.',
                        'The Platform\'s design, layout, and compilation are protected by copyright law.',
                        'Fair use principles apply to non-commercial, educational use of Platform content with proper attribution.',
                    ],
                },
                {
                    title: '5. Quiz & Personality Results',
                    content: [
                        'Our quiz results (MBTI type, zodiac, inner element) are for entertainment and self-awareness purposes only.',
                        'They are not professional psychological diagnoses or recommendations.',
                        'We do not guarantee accuracy or applicability to your personal situation.',
                        'Results are based on your responses and may change if you retake the quiz.',
                        'You assume all responsibility for decisions made based on quiz results.',
                    ],
                },
                {
                    title: '6. Third-Party Content & Links',
                    content: [
                        'The Platform may contain links to third-party websites and products.',
                        'We are not responsible for the content, policies, or practices of third-party sites.',
                        'Your use of third-party services is governed by their own terms and policies.',
                        'We do not endorse third-party content unless explicitly stated.',
                    ],
                },
                {
                    title: '7. Disclaimer of Warranties',
                    content: [
                        'The Platform is provided "as is" without warranties of any kind.',
                        'We do not guarantee that the Platform will be error-free, uninterrupted, or secure.',
                        'We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.',
                        'Your use of the Platform is at your own risk.',
                    ],
                },
                {
                    title: '8. Limitation of Liability',
                    content: [
                        'To the fullest extent permitted by law, Silk & Sage shall not be liable for indirect, incidental, special, consequential, or punitive damages.',
                        'Our total liability for any claim shall not exceed the amount you paid us (if any) in the past 12 months.',
                        'Some jurisdictions do not allow liability limitations; in such cases, our liability is limited to the maximum extent permitted.',
                    ],
                },
                {
                    title: '9. User Conduct',
                    content: [
                        'You agree to use the Platform only for lawful purposes and in compliance with all applicable laws.',
                        'You agree not to:',
                        '• Post false, misleading, or defamatory content',
                        '• Engage in harassment, bullying, or abusive behavior',
                        '• Share spam, phishing attempts, or unsolicited promotions',
                        '• Violate anyone\'s rights (privacy, intellectual property, etc.)',
                        '• Access or interfere with the Platform\'s infrastructure',
                        'We reserve the right to investigate and take action against violations.',
                    ],
                },
                {
                    title: '10. Indemnification',
                    content: [
                        'You agree to indemnify and hold harmless Silk & Sage, its officers, employees, and agents from any claims, damages, losses, or expenses arising from:',
                        '• Your violation of these Terms',
                        '• Your use of the Platform',
                        '• Your content or user-generated data',
                        '• Your infringement of third-party rights',
                    ],
                },
                {
                    title: '11. Modifications to Service',
                    content: [
                        'We reserve the right to modify, suspend, or discontinue the Platform at any time.',
                        'We will attempt to provide notice of significant changes.',
                        'Your continued use of the Platform after changes constitutes acceptance of new Terms.',
                        'We are not liable for modifications or discontinuation of service.',
                    ],
                },
                {
                    title: '12. Termination',
                    content: [
                        'We may terminate your account and access to the Platform immediately if you violate these Terms.',
                        'You may terminate your account at any time by contacting us.',
                        'Upon termination, your right to use the Platform ceases immediately.',
                        'Survival clauses: Sections addressing intellectual property, liability, and indemnification survive termination.',
                    ],
                },
                {
                    title: '13. Dispute Resolution',
                    content: [
                        'These Terms are governed by the laws of [Your Jurisdiction].',
                        'Any disputes shall be resolved through binding arbitration or court proceedings as permitted by law.',
                        'You agree to attempt resolution through good-faith negotiation before initiating legal action.',
                        'Both parties waive the right to jury trial.',
                    ],
                },
                {
                    title: '14. Severability',
                    content: [
                        'If any provision of these Terms is found to be unenforceable, that provision shall be severed.',
                        'The remaining provisions shall continue in full force and effect.',
                    ],
                },
                {
                    title: '15. Entire Agreement',
                    content: [
                        'These Terms, along with our Privacy Policy, constitute the entire agreement between you and Silk & Sage.',
                        'They supersede all prior agreements, understandings, and negotiations.',
                        'No modification of these Terms is valid unless in writing and signed by both parties.',
                    ],
                },
                {
                    title: '16. Contact',
                    content: [
                        'For questions about these Terms, contact us at:',
                        'Email: legal@silkandsage.com',
                        'Mailing Address: [Your Company Address]',
                    ],
                },
            ],
        },
        zh: {
            title: '服务条款',
            lastUpdated: '最后更新：2024年12月',
            intro: '欢迎使用《丝语·智慧》。本服务条款（以下简称"条款"）管辖您对我们网站、移动应用和服务（统称为"平台"）的访问和使用。通过访问或使用该平台，您同意受这些条款的约束。如果您不同意这些条款的任何部分，请不要使用该平台。',
            sections: [
                {
                    title: '1. 使用许可',
                    content: [
                        '我们授予您有限的、非独占的、不可转让的许可，以个人、非商业目的访问和使用平台。',
                        '您同意不会：',
                        '• 修改、复制、分发或创建来自平台内容的衍生作品',
                        '• 使用自动化工具、机器人或网络爬虫访问平台',
                        '• 从事任何非法活动或违反适用法律',
                        '• 骚扰、滥用或诽谤其他用户',
                        '• 上传病毒、恶意软件或恶意代码',
                        '• 尝试未授权访问平台或其系统',
                    ],
                },
                {
                    title: '2. 用户账户',
                    content: [
                        '您有责任维护您的账户凭据的机密性。',
                        '您同意在注册时提供准确、完整和当前的信息。',
                        '您对在您账户下进行的所有活动负责。',
                        '我们保留暂停或终止违反这些条款的账户的权利。',
                        '您可以随时删除您的账户；但是，我们可能根据法律要求保留某些数据。',
                    ],
                },
                {
                    title: '3. 内容所有权和权利',
                    content: [
                        '所有平台内容（文章、图片、设计、测试结果）由《丝语·智慧》或其内容提供商拥有。',
                        '您保留您上传的内容（评论、评分、评论）的所有权。',
                        '通过上传内容，您授予我们非独占、免版税的许可，以便在平台目的上使用、分发和修改此类内容。',
                        '您声明并保证您拥有或有权共享您上传的所有内容。',
                        '我们可能会删除违反这些条款或适用法律的内容。',
                    ],
                },
                {
                    title: '4. 知识产权',
                    content: [
                        '平台上显示的所有商标、标志和品牌名称是我们或我们许可人的财产。',
                        '未经明确书面同意，您不得使用我们的知识产权。',
                        '平台的设计、布局和汇编受版权法保护。',
                        '公平使用原则适用于平台内容的非商业、教育使用，并附带适当的署名。',
                    ],
                },
                {
                    title: '5. 测试和个性结果',
                    content: [
                        '我们的测试结果（MBTI类型、星座、内在元素）仅供娱乐和自我意识之用。',
                        '它们不是专业心理学诊断或建议。',
                        '我们不保证准确性或对您个人情况的适用性。',
                        '结果基于您的回答，如果您重新参加测试，结果可能会改变。',
                        '您自行承担基于测试结果做出的决定的所有责任。',
                    ],
                },
                {
                    title: '6. 第三方内容和链接',
                    content: [
                        '平台可能包含指向第三方网站和产品的链接。',
                        '我们不对第三方网站的内容、政策或实践负责。',
                        '您对第三方服务的使用受其自身条款和政策的管辖。',
                        '除非明确说明，我们不认可第三方内容。',
                    ],
                },
                {
                    title: '7. 保证声明',
                    content: [
                        '平台按"原样"提供，不附带任何形式的担保。',
                        '我们不保证平台将无错误、不中断或安全。',
                        '我们拒绝所有明示或暗示的担保，包括适销性、特定用途适用性和非侵权性。',
                        '您使用平台的风险完全由您自己承担。',
                    ],
                },
                {
                    title: '8. 责任限制',
                    content: [
                        '在法律允许的最大范围内，《丝语·智慧》不对间接、附带、特殊、后果或惩罚性损害赔偿负责。',
                        '我们对任何索赔的总责任不得超过您在过去12个月内支付给我们的金额（如有）。',
                        '某些司法管辖区不允许责任限制；在这种情况下，我们的责任限制在法律允许的最大范围内。',
                    ],
                },
                {
                    title: '9. 用户行为',
                    content: [
                        '您同意仅出于合法目的使用平台，并遵守所有适用法律。',
                        '您同意不会：',
                        '• 发布虚假、误导或诽谤内容',
                        '• 从事骚扰、欺凌或辱骂行为',
                        '• 分享垃圾邮件、网络钓鱼尝试或未请求的促销',
                        '• 违反任何人的权利（隐私、知识产权等）',
                        '• 访问或干扰平台的基础设施',
                        '我们保留调查和采取行动反对违规的权利。',
                    ],
                },
                {
                    title: '10. 赔偿',
                    content: [
                        '您同意赔偿并保护《丝语·智慧》、其官员、员工和代理人免受因以下原因产生的任何索赔、损害赔偿、损失或费用：',
                        '• 您违反这些条款',
                        '• 您使用平台',
                        '• 您的内容或用户生成的数据',
                        '• 您侵犯第三方权利',
                    ],
                },
                {
                    title: '11. 对服务的修改',
                    content: [
                        '我们保留随时修改、暂停或停止平台的权利。',
                        '我们将尝试就重大更改提供通知。',
                        '您在更改后继续使用平台即表示接受新条款。',
                        '我们对服务的修改或停止不承担责任。',
                    ],
                },
                {
                    title: '12. 终止',
                    content: [
                        '如果您违反这些条款，我们可能会立即终止您的账户和平台访问权限。',
                        '您可以随时通过联系我们来终止您的账户。',
                        '终止后，您使用平台的权利立即停止。',
                        '生存条款：涉及知识产权、责任和赔偿的部分在终止后继续有效。',
                    ],
                },
                {
                    title: '13. 争议解决',
                    content: [
                        '这些条款受[您的司法管辖区]的法律管辖。',
                        '任何争议应通过具有约束力的仲裁或法律允许的诉讼程序解决。',
                        '您同意在启动法律诉讼之前尝试通过善意谈判解决问题。',
                        '双方放弃陪审团审判的权利。',
                    ],
                },
                {
                    title: '14. 可分割性',
                    content: [
                        '如果这些条款的任何条款被发现不可执行，该条款应被删除。',
                        '其余条款应继续完全有效。',
                    ],
                },
                {
                    title: '15. 整个协议',
                    content: [
                        '这些条款以及我们的隐私政策构成了您与《丝语·智慧》之间的完整协议。',
                        '它们取代所有先前的协议、理解和谈判。',
                        '对这些条款的修改无效，除非以书面形式并由双方签署。',
                    ],
                },
                {
                    title: '16. 联系',
                    content: [
                        '如有关于这些条款的问题，请联系我们：',
                        '邮箱：legal@silkandsage.com',
                        '邮寄地址：[您的公司地址]',
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
                <div className="space-y-10">
                    {pageContent.sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                                {section.title}
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className="leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                        {lang === 'zh'
                            ? '最后更新日期：2024年12月。这些条款可能不时更新。继续使用平台即表示您接受任何修改。'
                            : 'Last updated: December 2024. These Terms may be updated from time to time. Continued use of the Platform constitutes acceptance of any modifications.'}
                    </p>
                </div>
            </div>
        </div>
    )
}
