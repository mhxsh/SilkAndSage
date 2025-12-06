'use client'

import { useState } from 'react'
import EditProfileModal from './EditProfileModal'

interface ProfileCardClientProps {
    profile: any
    lang: string
    children: React.ReactNode
}

export default function ProfileCardClient({ profile, lang, children }: ProfileCardClientProps) {
    const [showEditModal, setShowEditModal] = useState(false)

    return (
        <>
            <div className="relative">
                {children}
                <button
                    onClick={() => setShowEditModal(true)}
                    className="absolute top-4 right-4 px-4 py-2 text-sm bg-sage/10 hover:bg-sage/20 text-sage rounded-lg transition-colors"
                >
                    {lang === 'zh' ? '✏️ 编辑资料' : '✏️ Edit Profile'}
                </button>
            </div>

            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    lang={lang}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    )
}
