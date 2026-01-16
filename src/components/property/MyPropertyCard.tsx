import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Settings, FileText, MapPin, Trash2 } from 'lucide-react';
import { CreateNoteModal } from './CreateNoteModal';
import { useLanguage } from '@/context/LanguageContext';
import { AlertModal } from '@/components/ui/AlertModal';
import { PageLoader } from '@/components/ui/PageLoader';

// Minimal interface to satisfy TypeScript for now.
// In a real app, importing Prisma types or a shared DTO is better.
interface PropertyData {
    id: string;
    topic: string | null;
    price: number | null;
    address: string | null;
    listingStatus: string | null;
    status: string;
    createdAt: Date;
    images?: { url: string }[];
    landRai?: number | null;
    landNgan?: number | null;
    landSqWah?: number | null;
    noteTopic?: string | null;
    note?: string | null;
    noteImages?: any;
}

interface MyPropertyCardProps {
    property: PropertyData;
    onRefresh?: () => void;
}

export const MyPropertyCard: React.FC<MyPropertyCardProps> = ({ property, onRefresh }) => {
    const router = useRouter();
    const { t, formatDate } = useLanguage();

    // Fallback image
    const imageUrl = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60';

    const formatPrice = (price?: number | null) => {
        return price ? `฿${price.toLocaleString()}` : t('notSpecified');
    };

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isNoteOpen, setIsNoteOpen] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Alert State
    const [alertConfig, setAlertConfig] = React.useState<{
        isOpen: boolean;
        title: string;
        message: string;
        actionLabel?: string;
        showCancel?: boolean;
        cancelLabel?: string;
        onConfirm?: () => void;
        onClose?: () => void;
    }>({ isOpen: false, title: '', message: '' });

    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCreateNote = async (data: { topic: string; detail: string; images: File[]; existingImages: string[] }) => {
        try {
            setIsProcessing(true);
            // 1. Upload Images
            let imageUrls: string[] = [];
            if (data.images.length > 0) {
                const uploadPromises = data.images.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const result = await res.json();
                        return result.success ? result.url : null;
                    } catch (e) {
                        console.error("Upload failed", e);
                        return null;
                    }
                });
                const results = await Promise.all(uploadPromises);
                imageUrls = results.filter((url): url is string => url !== null);
            }

            // 2. Save Note
            const res = await fetch('/api/properties/note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId: property.id,
                    topic: data.topic,
                    detail: data.detail,
                    images: [...data.existingImages, ...imageUrls]
                })
            });

            if (res.ok) {
                setAlertConfig({
                    isOpen: true,
                    title: 'สำเร็จ',
                    message: 'บันทึกโน้ตเรียบร้อย',
                    onClose: () => {
                        setIsNoteOpen(false);
                        if (onRefresh) onRefresh();
                    }
                });

            } else {
                const text = await res.text();
                try {
                    const err = JSON.parse(text);
                    console.error("Save note error:", err);
                    setAlertConfig({
                        isOpen: true,
                        title: 'เกิดข้อผิดพลาด',
                        message: `Failed to save note: ${err.details || err.error || 'Unknown error'}`
                    });
                } catch (e) {
                    console.error("Save note non-JSON error:", text);
                    setAlertConfig({
                        isOpen: true,
                        title: 'เกิดข้อผิดพลาด',
                        message: `Failed to save note: ${res.status} ${res.statusText}`
                    });
                }
            }

        } catch (error) {
            console.error("Error saving note:", error);
            setAlertConfig({
                isOpen: true,
                title: 'เกิดข้อผิดพลาด',
                message: "An error occurred while saving the note"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const executeDelete = async () => {
        try {
            setIsProcessing(true);
            const res = await fetch(`/api/properties?id=${property.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setAlertConfig({ isOpen: false, title: '', message: '' }); // Close confirm modal
                if (onRefresh) {
                    onRefresh();
                } else {
                    window.location.reload();
                }
            } else {
                const errorData = await res.json();
                setAlertConfig({
                    isOpen: true,
                    title: 'เกิดข้อผิดพลาด',
                    message: `Failed to delete: ${res.status} ${res.statusText} - ${errorData.error}`
                });
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            setAlertConfig({
                isOpen: true,
                title: 'เกิดข้อผิดพลาด',
                message: `An error occurred: ${String(error)}`
            });
        } finally {
            setIsProcessing(false);
        }
    }

    const handleDelete = async () => {
        setAlertConfig({
            isOpen: true,
            title: t('confirmDeleteTitle') || 'ยืนยันการลบ',
            message: t('confirmDelete') || 'คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?',
            actionLabel: 'ลบประกาศ',
            showCancel: true,
            onConfirm: executeDelete
        });
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row h-auto md:h-52">
            {/* Image Section */}
            <div className="relative w-full md:w-72 h-48 md:h-full bg-slate-100 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={property.topic || 'Property Image'}
                    fill
                    className="object-cover"
                />

                {/* Top Banner (Expiry Mockup) */}
                <div className="absolute top-0 left-0 right-0 bg-brand-50/90 text-brand-700 text-[10px] py-1 px-2 flex items-center justify-between backdrop-blur-sm z-10">
                    <span className="flex items-center gap-1 font-medium">
                        {t('expiredAt')} 04 ก.พ. 2569 (25 วัน)
                    </span>
                </div>

                {/* Status Badges */}
                <div className="absolute top-8 left-2 flex gap-1 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-brand-500 text-white rounded">
                        {t(property.listingStatus as any) || property.listingStatus}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-brand-100 text-brand-700 rounded">
                        {t('hand1')}
                    </span>
                    {/* Status Badge from DB */}
                    {property.status && property.status !== 'ACTIVE' && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-500 text-white rounded">
                            {t(property.status as any)}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <div className='flex gap-2 items-center text-xs text-slate-500 mb-1'>
                            <MapPin size={12} />
                            <span>{property.address || t('addressNotSpecified')}</span>
                        </div>
                        <button
                            onClick={() => setIsNoteOpen(true)}
                            className="text-slate-400 hover:text-brand-600 flex items-center gap-1 text-xs border border-slate-200 rounded px-1.5 py-0.5"
                        >
                            <FileText size={12} /> {t('note')}
                        </button>
                    </div>

                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 mb-1">{property.topic || t('noTopic')}</h3>

                    <div className="text-slate-900 font-bold text-xl">
                        {formatPrice(property.price)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {property.landRai ? `${property.landRai} ${t('rai')} ` : ''}
                        {property.landNgan ? `${property.landNgan} ${t('ngan')} ` : ''}
                        {Number(property.landSqWah) ? `${Number(property.landSqWah)} ${t('sqwah')}` : ''}
                    </p>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 relative">
                    <div className="text-xs text-slate-400">
                        {t('draftedAt')} {property.createdAt ? formatDate(property.createdAt) : '-'}
                    </div>

                    <div className="flex gap-2">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`flex items-center gap-1 px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isMenuOpen
                                    ? 'border-brand-600 text-brand-600 bg-brand-50'
                                    : 'border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Settings size={14} />
                                {t('manage')}
                            </button>

                            {/* Popup Overlay */}
                            {isMenuOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                                        onClick={() => setIsMenuOpen(false)}
                                    />

                                    {/* Modal */}
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm pointer-events-auto overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                                            {/* Header */}
                                            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                                <h3 className="font-bold text-slate-800">{t('manage')}</h3>
                                                <button
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                                >
                                                    <span className="text-xl leading-none">&times;</span>
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-2">
                                                <button
                                                    onClick={() => router.push(`/post-property?id=${property.id}`)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-semibold">{t('edit')}</div>
                                                        <div className="text-xs text-slate-400">{t('editDetail')}</div>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsNoteOpen(true);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-semibold">{t('note')}</div>
                                                        <div className="text-xs text-slate-400">{t('addNote')}</div>
                                                    </div>
                                                </button>
                                                <div className="h-px bg-slate-100 my-1 mx-4"></div>
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                                                        <Trash2 size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-semibold">{t('delete')}</div>
                                                        <div className="text-xs text-red-400">{t('deleteDesc')}</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            disabled={property.status === 'ACTIVE'}
                            onClick={async () => {
                                try {
                                    const res = await fetch(`/api/properties?id=${property.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'ACTIVE' })
                                    });

                                    if (res.ok) {
                                        router.push(`/property/${property.id}`);
                                    } else {
                                        const err = await res.json();
                                        setAlertConfig({
                                            isOpen: true,
                                            title: 'เกิดข้อผิดพลาด',
                                            message: `Failed to publish: ${err.error || 'Unknown error'}`
                                        });
                                    }
                                } catch (e) {
                                    console.error("Publish error:", e);
                                    setAlertConfig({
                                        isOpen: true,
                                        title: 'เกิดข้อผิดพลาด',
                                        message: "An error occurred while publishing."
                                    });
                                }
                            }}
                            className={`flex items-center gap-1 px-6 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm ${property.status === 'ACTIVE'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-brand-600 text-white hover:bg-brand-700'
                                }`}
                        >
                            {t('publish')}
                        </button>
                    </div>
                </div>
            </div>
            {/* Note Modal */}
            <CreateNoteModal
                isOpen={isNoteOpen}
                onClose={() => setIsNoteOpen(false)}
                onConfirm={handleCreateNote}
                initialData={{
                    topic: property.noteTopic || '',
                    detail: property.note || '',
                    images: property.noteImages as string[] || []
                }}
            />

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                    if (alertConfig.onClose) alertConfig.onClose();
                }}
                title={alertConfig.title}
                message={alertConfig.message}
                actionLabel={alertConfig.actionLabel}
                showCancel={alertConfig.showCancel}
                cancelLabel={alertConfig.cancelLabel}
                onConfirm={alertConfig.onConfirm}
            />

            {isProcessing && <PageLoader />}
        </div>
    );
};
