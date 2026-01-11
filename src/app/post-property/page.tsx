"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import { User, Flag, Settings, Home, Building2, Warehouse, Factory, Store, LandPlot, MapPin, X, Map, Info, UploadCloud, Trash2, Plus, Image as ImageIcon, Layout, Ruler, Hotel, ShoppingCart, Train, School, Hospital, Plane, Zap, Wifi, ArrowLeft, Save, Banknote, Percent, FileText, Wallet, Search, ArrowUp, Bath, BedDouble, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { LocationPickerModal } from "@/components/property/LocationPickerModal";
import { PageLoader } from "@/components/ui/PageLoader";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function PostPropertyPage() {
    return (
        <Suspense fallback={<PageLoader />}>
            <PostPropertyContent />
        </Suspense>
    );
}

function PostPropertyContent() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');
    const { t } = useLanguage();

    const [currentStep, setCurrentStep] = useState(1);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [listingStatus, setListingStatus] = useState<'owner' | 'agent' | ''>('');
    const [listingType, setListingType] = useState<string>('');

    const [propertyCategory, setPropertyCategory] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isMapEnabled, setIsMapEnabled] = useState<boolean>(true);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Step 3 State
    const [topic, setTopic] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    // Land Fields
    const [landSize, setLandSize] = useState({ rai: '', ngan: '', sqWah: '' });
    // Building Fields
    const [usableArea, setUsableArea] = useState<string>('');
    const [bedroom, setBedroom] = useState<string>('');
    const [bathroom, setBathroom] = useState<string>('');
    const [floors, setFloors] = useState<string>('');

    const [highlights, setHighlights] = useState<string[]>([]);
    const [nearbyPlaces, setNearbyPlaces] = useState<string[]>([]);
    const [facilities, setFacilities] = useState<string[]>([]);

    const toggleSelection = (item: string, setFunction: React.Dispatch<React.SetStateAction<string[]>>) => {
        setFunction(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    // Step 4 State
    const [price, setPrice] = useState<string>('');
    const [acceptAgent, setAcceptAgent] = useState<boolean>(true);
    const [commissionType, setCommissionType] = useState<string>('percent');
    const [commissionRate, setCommissionRate] = useState<string>('');
    const [note, setNote] = useState<string>('');

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Fetch Data for Edit
    useEffect(() => {
        if (editId && user) {
            const fetchProperty = async () => {
                try {
                    const res = await fetch(`/api/properties?id=${editId}`);
                    if (res.ok) {
                        const data = await res.json();
                        // Populate state
                        setPropertyId(data.id);
                        setListingStatus(data.listingStatus.toLowerCase() as 'owner' | 'agent'); // Cast carefully
                        setListingType(data.listingType.toLowerCase());
                        setPropertyCategory(data.category.toLowerCase());
                        setAddress(data.address);
                        setTopic(data.topic);
                        setDescription(data.description);
                        setPrice(data.price.toString());
                        setNote(data.note || '');

                        // Size
                        setLandSize({
                            rai: data.landRai.toString(),
                            ngan: data.landNgan.toString(),
                            sqWah: data.landSqWah.toString()
                        });
                        setUsableArea(data.usableArea ? data.usableArea.toString() : '');

                        // Specs
                        setBedroom(data.bedroom ? data.bedroom.toString() : '');
                        setBathroom(data.bathroom ? data.bathroom.toString() : '');
                        setFloors(data.floors ? data.floors.toString() : '');

                        // Commission
                        if (data.commissionType) {
                            setAcceptAgent(true);
                            setCommissionType(data.commissionType.toLowerCase());
                            setCommissionRate(data.commissionRate ? data.commissionRate.toString() : '');
                        } else {
                            setAcceptAgent(false);
                        }

                        // Images
                        if (data.images) {
                            setImages(data.images.map((img: any) => img.url));
                        }

                        // Facilities / Highlights / Nearby
                        if (data.facilities) {
                            const facilitiesData = data.facilities.map((f: any) => f.facility);

                            // Reverse Map for Nearby & Facilities
                            const reverseMap: { [key: string]: string } = {
                                'ใกล้ห้าง': 'mall', 'ใกล้รถไฟฟ้า': 'train', 'ใกล้สถานศึกษา': 'school',
                                'ใกล้โรงพยาบาล': 'hospital', 'ใกล้สนามบิน': 'airport',
                                'EV Charger': 'ev', 'Wi-Fi': 'wifi', 'ที่จอดรถ': 'parking', 'สระว่ายน้ำ': 'pool'
                            };

                            setHighlights(facilitiesData.filter((f: any) => f.type === 'HIGHLIGHT').map((f: any) => f.name));

                            const facs = facilitiesData
                                .filter((f: any) => f.type === 'FACILITY')
                                .map((f: any) => reverseMap[f.name] || f.name);
                            setFacilities(facs);

                            const nearby = facilitiesData
                                .filter((f: any) => f.type === 'NEARBY')
                                .map((f: any) => reverseMap[f.name] || f.name);
                            setNearbyPlaces(nearby);
                        }
                    } else {
                        console.error("Failed to fetch property details");
                    }
                } catch (error) {
                    console.error("Error fetching property", error);
                }
            };
            fetchProperty();
        }
    }, [editId, user]);

    const uploadFiles = async (files: File[]) => {
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                return data.success ? data.url : null;
            } catch (e) {
                console.error("Upload failed", e);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const validUrls = results.filter((url): url is string => url !== null);
        setImages(prev => [...prev, ...validUrls]);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await uploadFiles(Array.from(e.target.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await uploadFiles(Array.from(e.dataTransfer.files));
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        switch (step) {
            case 1:
                if (!listingStatus) {
                    newErrors.listingStatus = t('errListingStatus');
                    isValid = false;
                }
                if (!listingType) {
                    newErrors.listingType = t('errListingType');
                    isValid = false;
                }
                if (!propertyCategory) {
                    newErrors.propertyCategory = t('errCategory');
                    isValid = false;
                }
                if (!address.trim()) {
                    newErrors.address = t('errAddress');
                    isValid = false;
                }
                break;
            case 2:
                if (images.length < 5) {
                    newErrors.images = t('errImages');
                    isValid = false;
                }
                break;
            case 3:
                if (!topic.trim()) {
                    newErrors.topic = t('errTopic');
                    isValid = false;
                }
                if (!description.trim()) {
                    newErrors.description = t('errDescription');
                    isValid = false;
                }

                if (propertyCategory === 'land') {
                    // Land: Validation rule - At least 1 field
                    if (!landSize.rai && !landSize.ngan && !landSize.sqWah) {
                        newErrors.landSize = t('errLandSize');
                        isValid = false;
                    }
                } else {
                    // Building: Validation rule - All specs required
                    if (!usableArea) {
                        newErrors.usableArea = t('errUsableArea');
                        isValid = false;
                    }
                    if (!bedroom) {
                        newErrors.bedroom = t('errBedroom');
                        isValid = false;
                    }
                    if (!bathroom) {
                        newErrors.bathroom = t('errBathroom');
                        isValid = false;
                    }
                    if (!floors) {
                        newErrors.floors = t('errFloors');
                        isValid = false;
                    }
                }
                break;
            case 4:
                if (!price) {
                    newErrors.price = t('errPrice');
                    isValid = false;
                }
                if (acceptAgent) {
                    if (commissionType === 'percent' && !commissionRate) {
                        newErrors.commissionRate = t('commissionRateLabel');
                        isValid = false;
                    }
                    if (commissionType === 'fixed' && !commissionRate) {
                        newErrors.commissionRate = t('commissionAmountLabel');
                        isValid = false;
                    }
                }
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 4) {
                setCurrentStep(prev => prev + 1);
                window.scrollTo(0, 0);
            }
        }
    };

    const handlePublish = () => {
        if (validateStep(4)) {
            handleSave(true);
        }
    };

    const handleSave = async (isPublish: boolean = false) => {
        setIsSaving(true);
        try {
            const payload = {
                id: propertyId,
                isPublish,
                listingStatus: listingStatus.toUpperCase(),
                listingType: listingType.toUpperCase(),
                category: propertyCategory.toUpperCase(),
                address,
                topic,
                description,
                landSize,
                usableArea,
                bedroom,
                bathroom,
                floors,
                price,
                acceptAgent,
                commissionType: commissionType.toUpperCase(),
                commissionRate,
                note,
                images,
                highlights,
                facilities: facilities.map(id => {
                    const map: { [key: string]: string } = {
                        'ev': 'EV Charger', 'wifi': 'Wi-Fi', 'parking': 'ที่จอดรถ', 'pool': 'สระว่ายน้ำ'
                    };
                    return map[id] || id;
                }),
                nearbyPlaces: nearbyPlaces.map(id => {
                    const map: { [key: string]: string } = {
                        'mall': 'ใกล้ห้าง', 'train': 'ใกล้รถไฟฟ้า', 'school': 'ใกล้สถานศึกษา',
                        'hospital': 'ใกล้โรงพยาบาล', 'airport': 'ใกล้สนามบิน'
                    };
                    return map[id] || id;
                }),
            };

            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to save');

            if (data.success) {
                if (data.data.id) setPropertyId(data.data.id);

                if (isPublish) {
                    alert('ประกาศของคุณถูกเผยแพร่สำเร็จ!');
                    router.push(`/property/${data.data.id}`);
                } else {
                    // Draft saved
                    alert('บันทึกร่างสำเร็จเรียบร้อย');
                    router.push('/my-properties');
                }
            }
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !user) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-slate-100 sticky top-0 bg-white z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                                {user.profile?.firstName?.[0] || 'U'}
                            </div>
                            <span className="text-sm font-medium">{user.profile?.firstName}</span>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Stepper */}
                <div className="relative mb-12">
                    {/* Background Line */}
                    <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 rounded-full -z-10"></div>

                    {/* Progress Line */}
                    <div
                        className="absolute top-4 left-0 h-1 bg-brand-600 rounded-full -z-10 transition-all duration-500 ease-out"
                        style={{ width: `${(Math.max(currentStep - 1, 0) / 3) * 100}%` }}
                    >
                        {/* Arrow Head at the end of progress */}
                        {currentStep > 1 && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-brand-600 border-b-[6px] border-b-transparent"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-start relative">
                        {[
                            { id: 1, label: t('postPropStep1') },
                            { id: 2, label: t('postPropStep2') },
                            { id: 3, label: t('postPropStep3') },
                            { id: 4, label: t('postPropStep4') }
                        ].map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ${step.id === currentStep
                                        ? 'bg-brand-600 text-white ring-brand-100 shadow-lg shadow-brand-600/30 scale-110'
                                        : step.id < currentStep
                                            ? 'bg-brand-600 text-white ring-brand-50'
                                            : 'bg-slate-100 text-slate-400 ring-white'
                                        }`}
                                >
                                    {step.id < currentStep ? '✓' : step.id}
                                </div>
                                <span className={`text-sm font-medium transition-colors duration-300 ${step.id === currentStep ? 'text-brand-600' :
                                    step.id < currentStep ? 'text-slate-700' : 'text-slate-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Sections */}
                {currentStep === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. Listing Status */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <User size={20} className="text-slate-700" />
                                <h2 className="text-lg font-bold text-slate-800">{t('listingStatusLabel')} <span className="text-red-500">*</span></h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setListingStatus('owner')}
                                    className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${listingStatus === 'owner'
                                        ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {t('ownerAgent')}
                                </button>
                                <button
                                    onClick={() => setListingStatus('agent')}
                                    className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${listingStatus === 'agent'
                                        ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {t('professionalAgent')}
                                </button>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-brand-50/50 rounded-lg text-sm text-brand-600 border border-brand-100">
                                <div className="mt-0.5">ℹ️</div>
                                <p>กรุณาเลือกสถานะตามจริง หากมีผู้ส่งรายงานว่าท่านไม่ใช่ "เจ้าของ" ประกาศของท่านจะถูกนำออกจากระบบทันที เพื่อรอการตรวจสอบ</p>
                            </div>
                            {errors.listingStatus && (
                                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                    {errors.listingStatus}
                                </p>
                            )}
                        </div>

                        {/* 2. Listing Type */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Flag size={20} className="text-slate-700" />
                                <h2 className="text-lg font-bold text-slate-800">{t('listingTypeLabel')} <span className="text-red-500">*</span></h2>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {(
                                    [
                                        { id: 'sell', label: t('SELL') },
                                        { id: 'rent', label: t('RENT') },
                                        { id: 'sell_rent', label: t('SELL_RENT') },
                                        { id: 'lease', label: t('LEASE') },
                                        { id: 'down_payment', label: t('DOWN_PAYMENT') },
                                    ] as { id: string, label: string, tag?: string }[]
                                ).map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setListingType(type.id)}
                                        className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all relative ${listingType === type.id
                                            ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {type.label}
                                        {type.tag && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                                                {type.tag}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {errors.listingType && (
                                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                    {errors.listingType}
                                </p>
                            )}
                        </div>

                        {/* 3. Property Type */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Building2 size={20} className="text-slate-700" />
                                <h2 className="text-lg font-bold text-slate-800">{t('propertyCategoryLabel')} <span className="text-red-500">*</span></h2>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-500 mb-2">{t('residential')}</div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'condo', label: t('condo') },
                                        { id: 'apartment', label: 'Apartment' },
                                        { id: 'house', label: t('house') },
                                        { id: 'twin_house', label: 'Twin House' },
                                        { id: 'townhome', label: 'Townhome' },
                                        { id: 'home_office', label: 'Home Office' },
                                        { id: 'land', label: t('land') },
                                        { id: 'pool_villa', label: 'Pool Villa' },
                                    ].map((prop) => (
                                        <button
                                            key={prop.id}
                                            onClick={() => setPropertyCategory(prop.id)}
                                            className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${propertyCategory === prop.id
                                                ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {prop.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                <div className="text-sm font-medium text-slate-500 mb-2">{t('commercial')}</div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'co_working', label: 'Co-working Space' },
                                        { id: 'shop', label: 'Shop / Market' },
                                        { id: 'commercial', label: 'Commercial Building' },
                                        { id: 'office', label: 'Office' },
                                        { id: 'factory', label: 'Factory' },
                                        { id: 'showroom', label: 'Showroom' },
                                        { id: 'warehouse', label: 'Warehouse' },
                                        { id: 'hotel', label: 'Hotel & Resort' },
                                    ].map((prop) => (
                                        <button
                                            key={prop.id}
                                            onClick={() => setPropertyCategory(prop.id)}
                                            className={`py-3 px-4 rounded-xl border flex justify-center items-center transition-all ${propertyCategory === prop.id
                                                ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-sm ring-1 ring-brand-600'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {prop.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {errors.propertyCategory && (
                                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                    {errors.propertyCategory}
                                </p>
                            )}
                        </div>

                        {/* 4. Location */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={24} className="text-slate-700" />
                                    <h2 className="text-xl font-bold text-slate-800">{t('locationLabel')} <span className="text-red-500">*</span></h2>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder={t('locationPlaceholder')}
                                        className="w-full pl-6 pr-12 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-slate-700 text-lg placeholder:text-slate-300"
                                    />
                                    {address && (
                                        <button
                                            onClick={() => setAddress('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                        {errors.address}
                                    </p>
                                )}

                                <div className="flex items-start gap-3 p-4 bg-brand-50/50 rounded-xl text-sm text-brand-600 border border-brand-100">
                                    <div className="mt-0.5"><Info size={18} /></div>
                                    <p>ในกทม./ปริมณฑล เป็นกลุ่มทำเลให้เลือกทำเลที่ระบบแนะนำเพื่อการเห็นประกาศที่มากขึ้น</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Map size={24} className="text-slate-700" />
                                        <h2 className="text-xl font-bold text-slate-800">{t('pinLocationLabel')}</h2>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => setIsMapEnabled(!isMapEnabled)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${isMapEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isMapEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                                <p className="text-slate-500 text-sm">{t('pinLocationDesc')}</p>

                                {isMapEnabled && (
                                    <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mt-4 group">
                                        {/* Mock Map Image / Placeholder */}
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            marginHeight={0}
                                            marginWidth={0}
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(address || 'Bangkok')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                            className="absolute opacity-80 group-hover:opacity-100 transition-opacity"
                                            style={{
                                                width: 'calc(100% + 400px)',
                                                height: 'calc(100% + 400px)',
                                                marginLeft: '-200px',
                                                marginTop: '-200px'
                                            }}
                                        ></iframe>

                                        {/* Edit Map Button Overlay */}
                                        <div className="absolute bottom-4 right-4">
                                            <button
                                                onClick={() => setIsLocationModalOpen(true)}
                                                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-brand-600 px-4 py-2 rounded-lg shadow-lg border border-brand-200 text-sm font-medium transition-all transform hover:scale-105"
                                            >
                                                <div className="w-4 h-4 border-2 border-brand-600 rounded-[4px]"></div>
                                                {t('editPin')}
                                            </button>
                                        </div>

                                        {/* Mock Pin Overlay */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="relative">
                                                <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                            </div>
                                            {address && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap text-xs font-medium text-slate-700 border border-slate-100">
                                                    {address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-end pt-8">
                            <button
                                onClick={handleNext}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xl font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                            >
                                {t('next')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Add Media */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={24} className="text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-800">{t('imagesLabel')} <span className="text-red-500">*</span></h2>
                            </div>

                            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-start gap-3">
                                <Info className="text-brand-600 shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-brand-700 space-y-1">
                                    <p className="font-medium">{t('uploadGuideTitle')}</p>
                                    <ul className="list-disc list-inside space-y-0.5 opacity-90">
                                        <li>{t('uploadGuide1')}</li>
                                        <li>{t('uploadGuide2')}</li>
                                        <li>{t('uploadGuide3')}</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${isDragging
                                    ? 'border-brand-500 bg-brand-50 scale-[1.01]'
                                    : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex flex-col items-center gap-4 pointer-events-none">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <UploadCloud size={40} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-slate-700">
                                            {t('dragDropText')} <span className="text-brand-600">{t('clickToSelect')}</span>
                                        </h3>
                                        <p className="text-slate-500 text-sm">อัปโหลดได้สูงสุด 20 รูป</p>
                                    </div>
                                </div>
                            </div>
                            {errors.images && (
                                <p className="text-red-500 text-sm mt-2 text-center animate-in fade-in slide-in-from-top-1 font-medium">
                                    {errors.images}
                                </p>
                            )}

                            {/* Image Grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                                    {images.map((src, index) => (
                                        <div key={index} className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                            <img src={src} alt={`Upload ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-md shadow-sm">
                                                    {t('mainImage')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {/* Small Add Button in Grid */}
                                    <div className="relative border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center aspect-[4/3] hover:border-brand-300 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-brand-500">
                                            <Plus size={32} />
                                            <span className="text-xs font-medium">{t('addImage')}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-8 border-t border-slate-100">
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                            >
                                {t('back')}
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-12 py-3 rounded-xl bg-brand-600 text-white font-medium shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all active:scale-95"
                            >
                                {t('next')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Add Details */}
                {currentStep === 3 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. Topic */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Layout size={24} className="text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-800">{t('topicLabel')} <span className="text-red-500">*</span></h2>
                            </div>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder={t('topicPlaceholder')}
                                maxLength={100}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.topic ? 'border-red-500 focus:border-red-500 focus:ring-red-50' : 'border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50'} transition-all text-slate-700 placeholder:text-slate-300`}
                            />
                            {errors.topic && (
                                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                    {errors.topic}
                                </p>
                            )}
                        </div>

                        {/* 2. Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Info size={24} className="text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-800">{t('descriptionLabel')} <span className="text-red-500">*</span></h2>
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('descriptionPlaceholder')}
                                rows={8}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-50' : 'border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50'} transition-all text-slate-700 placeholder:text-slate-300 resize-none`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* 3. Specs / Size */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                                <Layout size={24} className="text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-800">{t('propertyDetailsLabel')} <span className="text-red-500">*</span></h2>
                            </div>

                            {/* Conditional Rendering based on Category */}
                            {propertyCategory === 'land' ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                                        <Ruler size={20} />
                                        <span>{t('landSize')}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="0"
                                                value={landSize.rai}
                                                onChange={(e) => setLandSize({ ...landSize, rai: e.target.value })}
                                                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-center font-bold text-lg text-slate-700 group-hover:border-brand-300"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{t('rai')}</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="0"
                                                value={landSize.ngan}
                                                onChange={(e) => setLandSize({ ...landSize, ngan: e.target.value })}
                                                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-center font-bold text-lg text-slate-700 group-hover:border-brand-300"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{t('ngan')}</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="0"
                                                value={landSize.sqWah}
                                                onChange={(e) => setLandSize({ ...landSize, sqWah: e.target.value })}
                                                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-center font-bold text-lg text-slate-700 group-hover:border-brand-300"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{t('sqwah')}</span>
                                        </div>
                                    </div>
                                    {errors.landSize && (
                                        <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                            ⚠️ {errors.landSize}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Usable Area */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Layout size={18} /> {t('usableArea')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-brand-50 transition-all h-[54px] bg-white ${errors.usableArea ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus-within:border-brand-500'}`}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={usableArea}
                                                    onChange={(e) => setUsableArea(e.target.value)}
                                                    className="flex-1 pl-4 py-3 h-full outline-none text-lg font-medium text-slate-700 placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
                                                    placeholder="0"
                                                />
                                                {/* Custom Spinner */}
                                                <div className="flex flex-col h-full border-l border-slate-200 w-8 bg-slate-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => setUsableArea(prev => String(Number(prev || 0) + 1))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors border-b border-slate-200 active:bg-slate-200"
                                                    >
                                                        <ChevronUp size={12} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setUsableArea(prev => String(Math.max(0, Number(prev || 0) - 1)))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors active:bg-slate-200"
                                                    >
                                                        <ChevronDown size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                {/* Unit */}
                                                <div className="px-4 text-sm text-slate-500 font-medium bg-slate-50 h-full flex items-center border-l border-slate-200 min-w-[3.5rem] justify-center">
                                                    {t('sqm')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floor */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <ArrowUp size={18} /> {t('floors')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-brand-50 transition-all h-[54px] bg-white ${errors.floors ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus-within:border-brand-500'}`}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={floors}
                                                    onChange={(e) => setFloors(e.target.value)}
                                                    className="flex-1 pl-4 py-3 h-full outline-none text-lg font-medium text-slate-700 placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
                                                    placeholder="0"
                                                />
                                                <div className="flex flex-col h-full border-l border-slate-200 w-8 bg-slate-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFloors(prev => String(Number(prev || 0) + 1))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors border-b border-slate-200 active:bg-slate-200"
                                                    >
                                                        <ChevronUp size={12} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFloors(prev => String(Math.max(0, Number(prev || 0) - 1)))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors active:bg-slate-200"
                                                    >
                                                        <ChevronDown size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                <div className="px-4 text-sm text-slate-500 font-medium bg-slate-50 h-full flex items-center border-l border-slate-200 min-w-[3.5rem] justify-center">
                                                    {t('floorC')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Bedroom */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <BedDouble size={18} /> {t('bedroom')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-brand-50 transition-all h-[54px] bg-white ${errors.bedroom ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus-within:border-brand-500'}`}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={bedroom}
                                                    onChange={(e) => setBedroom(e.target.value)}
                                                    className="flex-1 pl-4 py-3 h-full outline-none text-lg font-medium text-slate-700 placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
                                                    placeholder="0"
                                                />
                                                <div className="flex flex-col h-full border-l border-slate-200 w-8 bg-slate-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBedroom(prev => String(Number(prev || 0) + 1))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors border-b border-slate-200 active:bg-slate-200"
                                                    >
                                                        <ChevronUp size={12} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBedroom(prev => String(Math.max(0, Number(prev || 0) - 1)))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors active:bg-slate-200"
                                                    >
                                                        <ChevronDown size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                <div className="px-4 text-sm text-slate-500 font-medium bg-slate-50 h-full flex items-center border-l border-slate-200 min-w-[3.5rem] justify-center">
                                                    {t('room')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bathroom */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Bath size={18} /> {t('bathroom')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative flex items-center border rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-brand-50 transition-all h-[54px] bg-white ${errors.bathroom ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus-within:border-brand-500'}`}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={bathroom}
                                                    onChange={(e) => setBathroom(e.target.value)}
                                                    className="flex-1 pl-4 py-3 h-full outline-none text-lg font-medium text-slate-700 placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
                                                    placeholder="0"
                                                />
                                                <div className="flex flex-col h-full border-l border-slate-200 w-8 bg-slate-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBathroom(prev => String(Number(prev || 0) + 1))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors border-b border-slate-200 active:bg-slate-200"
                                                    >
                                                        <ChevronUp size={12} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBathroom(prev => String(Math.max(0, Number(prev || 0) - 1)))}
                                                        className="flex-1 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors active:bg-slate-200"
                                                    >
                                                        <ChevronDown size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                <div className="px-4 text-sm text-slate-500 font-medium bg-slate-50 h-full flex items-center border-l border-slate-200 min-w-[3.5rem] justify-center">
                                                    {t('room')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {(errors.usableArea || errors.floors || errors.bedroom || errors.bathroom) && (
                                        <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center justify-center gap-2">
                                            ⚠️ {t('errFillAll')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 4. Highlights */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">{t('highlightsLabel')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    'cornerRoom',
                                    'niceView',
                                    'beautifulDecor',
                                    'readyToMove',
                                    'petFriendly',
                                    'northFacing',
                                    'southFacing',
                                    'nearBTS'
                                ].map((key) => (
                                    <label key={key} className={`cursor-pointer border rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-all ${highlights.includes(key)
                                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={highlights.includes(key)}
                                            onChange={() => toggleSelection(key, setHighlights)}
                                        />
                                        {t(key as any)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 5. Nearby Places */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">{t('nearbyPlacesLabel')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'mall', label: t('nearMall'), icon: ShoppingCart },
                                    { id: 'train', label: t('nearTrain'), icon: Train },
                                    { id: 'school', label: t('nearSchool'), icon: School },
                                    { id: 'hospital', label: t('nearHospital'), icon: Hospital },
                                    { id: 'airport', label: t('nearAirport'), icon: Plane },
                                ].map((place) => (
                                    <label key={place.id} className={`cursor-pointer border rounded-lg px-4 py-3 flex flex-col items-center gap-2 transition-all h-24 justify-center ${nearbyPlaces.includes(place.id)
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                        }`}>
                                        <place.icon size={24} className={nearbyPlaces.includes(place.id) ? 'text-blue-600' : 'text-slate-400'} />
                                        <span className="text-sm font-medium">{place.label}</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={nearbyPlaces.includes(place.id)}
                                            onChange={() => toggleSelection(place.id, setNearbyPlaces)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 6. Facilities */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">{t('facilitiesLabel')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'ev', label: 'EV Charger', icon: Zap },
                                    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                                    { id: 'parking', label: t('parking'), icon: Warehouse },
                                    { id: 'pool', label: t('pool'), icon: Info },
                                ].map((fac) => (
                                    <label key={fac.id} className={`cursor-pointer border rounded-lg px-4 py-3 flex flex-col items-center gap-2 transition-all h-24 justify-center ${facilities.includes(fac.id)
                                        ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                        }`}>
                                        <fac.icon size={24} className={facilities.includes(fac.id) ? 'text-brand-600' : 'text-slate-400'} />
                                        <span className="text-sm font-medium">{fac.label}</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={facilities.includes(fac.id)}
                                            onChange={() => toggleSelection(fac.id, setFacilities)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                {t('back')}
                            </button>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={isSaving}
                                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    {isSaving ? t('saving') : t('saveDraft')}
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 rounded-xl bg-brand-600 text-white font-medium shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all active:scale-95"
                                >
                                    {t('next')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* Step 4: Publish */}
                {
                    currentStep === 4 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* 1. Selling Price */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Banknote size={24} className="text-slate-700" />
                                    <h2 className="text-xl font-bold text-slate-800">{t('priceLabel')} <span className="text-red-500">*</span></h2>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder={t('pricePlaceholder')}
                                        className="w-full pl-6 pr-16 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-xl font-medium text-slate-800 placeholder:text-slate-300"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                        {t('baht')}
                                    </div>
                                </div>
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* 2. Accept Agent */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User size={24} className="text-slate-700" />
                                        <h2 className="text-xl font-bold text-slate-800">{t('acceptAgentLabel')}</h2>
                                    </div>
                                    <button
                                        onClick={() => setAcceptAgent(!acceptAgent)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${acceptAgent ? 'bg-brand-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${acceptAgent ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                {acceptAgent && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-start gap-3 p-4 bg-brand-50 rounded-xl text-sm text-brand-700 border border-brand-100">
                                            <Info size={18} className="shrink-0 mt-0.5" />
                                            <p>{t('commissionWarning')}</p>
                                        </div>

                                        <div className="border border-brand-200 rounded-xl p-6 bg-white space-y-4 shadow-sm">
                                            <div className="flex items-center gap-2 text-brand-700 font-semibold mb-2">
                                                <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-xs">✓</div>
                                                {t('giveCommission')}
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <label className="flex-1 cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name="commissionType"
                                                            checked={commissionType === 'percent'}
                                                            onChange={() => setCommissionType('percent')}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="p-4 rounded-xl border border-slate-200 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all h-full flex items-center justify-center gap-3 hover:bg-slate-50">
                                                            <span className="text-slate-700 font-medium">{t('percent')} (%)</span>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label className="flex-1 cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name="commissionType"
                                                            checked={commissionType === 'fixed'}
                                                            onChange={() => setCommissionType('fixed')}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="p-4 rounded-xl border border-slate-200 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all h-full flex items-center justify-center gap-3 hover:bg-slate-50">
                                                            <span className="text-slate-700 font-medium">{t('amount')} ({t('baht')})</span>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label className="flex-1 cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="radio"
                                                            name="commissionType"
                                                            checked={commissionType === 'agreed'}
                                                            onChange={() => setCommissionType('agreed')}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="p-4 rounded-xl border border-slate-200 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all h-full flex items-center justify-center gap-3 hover:bg-slate-50">
                                                            <span className="text-slate-700 font-medium">{t('asAgreed')}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>

                                            {commissionType !== 'agreed' && (
                                                <div className="relative mt-2 animate-in fade-in slide-in-from-top-1">
                                                    <input
                                                        type="number"
                                                        value={commissionRate}
                                                        onChange={(e) => setCommissionRate(e.target.value)}
                                                        placeholder={commissionType === 'percent' ? t('percentPlaceholder') : t('amountPlaceholder')}
                                                        className={`w-full pl-6 pr-16 py-3 rounded-xl border ${errors.commissionRate ? 'border-red-500 focus:border-red-500 focus:ring-red-50' : 'border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50'} transition-all`}
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                                        {commissionType === 'percent' ? '%' : t('baht')}
                                                    </div>
                                                </div>
                                            )}
                                            {errors.commissionRate && commissionType !== 'agreed' && (
                                                <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 font-medium">
                                                    {errors.commissionRate}
                                                </p>
                                            )}

                                            {/* Calculation Display */}
                                            {commissionType === 'percent' && price && commissionRate && (
                                                <div className="flex justify-end items-center gap-2 text-brand-700 font-bold text-lg animate-in fade-in bg-brand-50 px-4 py-2 rounded-lg w-fit ml-auto">
                                                    <Wallet size={20} />
                                                    <span>{t('estimatedCommission')}: {((parseFloat(price) * parseFloat(commissionRate)) / 100).toLocaleString()} {t('baht')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Note */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 space-y-4">
                                <div className="flex items-center gap-2">
                                    <FileText size={24} className="text-slate-700" />
                                    <h2 className="text-xl font-bold text-slate-800">{t('noteLabel')}</h2>
                                </div>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={t('notePlaceholder')}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-slate-700 placeholder:text-slate-300 resize-none"
                                />
                                <div className="text-right text-xs text-slate-400">
                                    {note.length}/100
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                                <button
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 hover:shadow-md"
                                >
                                    <ArrowLeft size={20} />
                                    {t('back')}
                                </button>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleSave(false)}
                                        disabled={isSaving}
                                        className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 hover:shadow-md"
                                    >
                                        <Save size={20} />
                                        {isSaving ? t('saving') : t('saveDraft')}
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        disabled={isSaving}
                                        className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold shadow-lg hover:bg-brand-700 hover:shadow-brand-200 transition-all active:scale-95 flex items-center gap-2 shadow-brand-100"
                                    >
                                        {isSaving ? t('saving') : t('publish')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </main >

            <LocationPickerModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onConfirm={(newAddress) => setAddress(newAddress)}
                initialAddress={address}
            />
        </div >
    );
}
