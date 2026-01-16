import React, { useState, useRef } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { AlertModal } from '@/components/ui/AlertModal';

interface NoteData {
    topic: string;
    detail: string;
    images?: string[]; // URLs of existing images
}

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { topic: string; detail: string; images: File[]; existingImages: string[] }) => void;
    initialData?: NoteData | null;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onConfirm, initialData }) => {
    const [topic, setTopic] = useState('');
    const [detail, setDetail] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // URLs from DB
    const [showErrors, setShowErrors] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Alert State
    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onClose?: () => void;
    }>({ isOpen: false, title: '', message: '' });

    // Initialize state when opening
    React.useEffect(() => {
        if (isOpen) {
            setTopic(initialData?.topic || '');
            setDetail(initialData?.detail || '');
            setExistingImages(initialData?.images || []);
            setImages([]);
            setPreviewUrls([]);
            setShowErrors(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Validate Max 5 Images
            const totalImages = existingImages.length + images.length + newFiles.length;
            if (totalImages > 5) {
                setAlertConfig({
                    isOpen: true,
                    title: 'ข้อผิดพลาด',
                    message: 'อัปโหลดรูปได้ไม่เกิน 5 รูป',
                });
                // Reset input
                e.target.value = '';
                return;
            }

            // Validate File Size (Max 3MB)
            const invalidFiles = newFiles.filter(file => file.size > 3 * 1024 * 1024);
            if (invalidFiles.length > 0) {
                setAlertConfig({
                    isOpen: true,
                    title: 'ข้อผิดพลาด',
                    message: 'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 3MB',
                });
                // Reset input
                e.target.value = '';
                return;
            }

            setImages(prev => [...prev, ...newFiles]);

            const newUrls = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newUrls]);

            // Reset input so same file can be selected again if needed (though we just added it)
            // or to clear the UI state.
            e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!topic.trim() || !detail.trim()) {
            setShowErrors(true);
            return;
        }
        onConfirm({ topic, detail, images, existingImages });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-center border-b border-slate-100 relative">
                    <h2 className="text-lg font-bold text-slate-800">โน้ตประกาศ</h2>
                    {/* Close Button is implied by design to possibly be absent or specific, but good UX to have one or click outside. Design shows buttons at bottom. */}
                </div>

                {/* Scrollable Form */}
                <div className="p-6 overflow-y-auto">
                    {/* Topic */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            ชื่อหัวข้อ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                maxLength={30}
                                placeholder="ตั้งชื่อหัวข้อของคุณ"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors text-slate-700 placeholder:text-slate-400 ${showErrors && !topic.trim() ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
                                    }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                {topic.length}/30
                            </span>
                        </div>
                        {showErrors && !topic.trim() && (
                            <p className="text-xs text-red-500 mt-1">กรุณาระบุชื่อหัวข้อ</p>
                        )}
                    </div>

                    {/* Detail */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            รายละเอียด <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                maxLength={1000}
                                rows={4}
                                placeholder="เขียนประโยคที่คุณมักใช้ในรายละเอียด (เช่น ลายเซ็นของคุณ , ที่อยู่ติดต่อของคุณ)"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors text-slate-700 placeholder:text-slate-400 resize-none ${showErrors && !detail.trim() ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
                                    }`}
                            />
                            <span className="absolute right-3 bottom-3 text-xs text-slate-400">
                                {detail.length}/1000
                            </span>
                        </div>
                        {showErrors && !detail.trim() && (
                            <p className="text-xs text-red-500 mt-1">กรุณาระบุรายละเอียด</p>
                        )}
                    </div>

                    {/* Add Image */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            เพิ่มรูป <span className="text-slate-400 font-normal">(ถ้ามี)</span>
                        </label>

                        <div className="flex gap-3 flex-wrap">
                            {/* Existing Images (From DB) */}
                            {existingImages.map((url, index) => (
                                <div key={`exist-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group">
                                    <img
                                        src={url}
                                        alt="Existing"
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setExpandedImage(url)}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveExistingImage(index);
                                        }}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* New Upload Previews */}
                            {previewUrls.map((url, index) => (
                                <div key={`new-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group">
                                    <img
                                        src={url}
                                        alt="Preview"
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setExpandedImage(url)}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(index);
                                        }}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Add Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 rounded-xl border border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-brand-300 hover:text-brand-500 transition-all"
                            >
                                <Plus size={32} strokeWidth={1.5} />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-2 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200"
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>

            {/* Lightbox Preview */}
            {
                expandedImage && (
                    <div
                        className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setExpandedImage(null)}
                    >
                        <button
                            onClick={() => setExpandedImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={expandedImage}
                            alt="Full Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                    if (alertConfig.onClose) alertConfig.onClose();
                }}
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </div >
    );
};
