'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void
    maxImages?: number
    lang: 'zh' | 'en'
}

export default function ImageUpload({ onUploadComplete, maxImages = 9, lang }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newFiles = Array.from(files).slice(0, maxImages - images.length)
        if (newFiles.length === 0) return

        setUploading(true)

        try {
            const uploadPromises = newFiles.map(async (file) => {
                // Create preview
                const preview = URL.createObjectURL(file)
                setPreviews(prev => [...prev, preview])

                // Upload file
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/ugc/upload', {
                    method: 'POST',
                    body: formData
                })

                if (!res.ok) {
                    throw new Error('Upload failed')
                }

                const result = await res.json()
                return result.url
            })

            const urls = await Promise.all(uploadPromises)
            const newImages = [...images, ...urls]
            setImages(newImages)
            onUploadComplete(newImages)
        } catch (error) {
            console.error('Error uploading images:', error)
            alert(lang === 'zh' ? '上传失败，请重试' : 'Upload failed, please try again')
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)
        setImages(newImages)
        setPreviews(newPreviews)
        onUploadComplete(newImages)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                ))}
                {images.length < maxImages && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-sage transition-colors disabled:opacity-50"
                    >
                        {uploading
                            ? (lang === 'zh' ? '上传中...' : 'Uploading...')
                            : (lang === 'zh' ? '+ 添加图片' : '+ Add Image')}
                    </button>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    )
}

