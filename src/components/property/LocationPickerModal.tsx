const libraries: ("places" | "geometry")[] = ["places", "geometry"];

import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { useCallback, useRef, useState, useEffect } from "react";
import { X, Search, Info, Crosshair } from "lucide-react";

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (address: string) => void;
    initialAddress: string;
}

export function LocationPickerModal({ isOpen, onClose, onConfirm, initialAddress }: LocationPickerModalProps) {
    const [searchQuery, setSearchQuery] = useState(initialAddress);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 13.7563, lng: 100.5018 }); // Bangkok
    const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
    const [isLocating, setIsLocating] = useState(false);

    const mapRef = useRef<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries
    });

    useEffect(() => {
        setSearchQuery(initialAddress);
    }, [initialAddress, isOpen]);

    // Initialize geocoder when map is loaded
    useEffect(() => {
        if (isLoaded && !geocoderRef.current) {
            geocoderRef.current = new google.maps.Geocoder();
        }
    }, [isLoaded]);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMapCenter({ lat, lng });
                mapRef.current?.panTo({ lat, lng });
                mapRef.current?.setZoom(17);

                if (place.formatted_address) {
                    setSearchQuery(place.formatted_address);
                }
            } else {
                console.log("No details available for input: '" + place.name + "'");
            }
        }
    };

    const handleConfirm = () => {
        onConfirm(searchQuery);
        onClose();
    };

    const reverseGeocode = (lat: number, lng: number) => {
        if (geocoderRef.current) {
            geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    setSearchQuery(results[0].formatted_address);
                } else {
                    console.error("Geocoder failed due to: " + status);
                    setSearchQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                }
            });
        }
    };

    const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMapCenter({ lat, lng });
            reverseGeocode(lat, lng);
        }
    };

    const handleCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newCenter = { lat: latitude, lng: longitude };
                    setMapCenter(newCenter);
                    mapRef.current?.panTo(newCenter);
                    mapRef.current?.setZoom(17);
                    reverseGeocode(latitude, longitude);
                    setIsLocating(false);
                },
                () => {
                    alert("Unable to retrieve your location");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLocating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">ค้นหาทำเลที่ตั้ง</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Top Controls (Search & Info) - Moved outside map */}
                <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col gap-3 z-20">
                    {/* Search Bar */}
                    <div className="relative w-full shadow-sm z-50"> {/* High z-index for Autocomplete dropdown */}
                        {isLoaded ? (
                            <Autocomplete
                                onLoad={onAutocompleteLoad}
                                onPlaceChanged={onPlaceChanged}
                            >
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="ค้นหาตำแหน่งที่คุณต้องการ"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-700 text-lg transition-all"
                                    />
                                </div>
                            </Autocomplete>
                        ) : (
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Search size={20} />
                                </div>
                                <input disabled placeholder="Loading Maps..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
                            </div>
                        )}
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 text-blue-700 text-sm flex items-center gap-2 w-full">
                        <Info size={18} className="shrink-0" />
                        <span>ลากหมุดสีแดงเพื่อระบุตำแหน่งที่แม่นยำ ระบบจะค้นหาที่อยู่อัตโนมัติ</span>
                    </div>
                </div>

                {/* Map Content */}
                <div className="flex-1 flex flex-col relative bg-slate-50 overflow-hidden">

                    {/* Map Controls */}
                    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md border border-slate-100 p-1 flex">
                        <button
                            onClick={() => setMapType('roadmap')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mapType === 'roadmap' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            แผนที่
                        </button>
                        <button
                            onClick={() => setMapType('satellite')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mapType === 'satellite' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            ดาวเทียม
                        </button>
                    </div>

                    {/* Interactive Map View */}
                    <div className="w-full h-full relative bg-[#e5e7eb]">
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={mapCenter}
                                zoom={15}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                                mapTypeId={mapType}
                                options={{
                                    mapTypeControl: false,
                                    streetViewControl: false,
                                    fullscreenControl: false,
                                }}
                            >
                                {/* Draggable Marker */}
                                <Marker
                                    position={mapCenter}
                                    draggable={true}
                                    onDragEnd={onMarkerDragEnd}
                                    animation={google.maps.Animation.DROP}
                                />
                            </GoogleMap>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">Loading Map...</div>
                        )}

                        {/* Current Location Button */}
                        <button
                            onClick={handleCurrentLocation}
                            className="absolute bottom-8 right-4 z-10 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 text-sm font-medium transition-all flex items-center gap-2"
                        >
                            {isLocating ? (
                                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Crosshair size={18} />
                            )}
                            ใช้ตำแหน่งปัจจุบัน
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                    <button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto bg-[#1FB992] hover:bg-[#199d7b] text-white text-lg font-medium py-3 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
}
