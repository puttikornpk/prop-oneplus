"use client";

import { useState, useEffect } from 'react';
import { X, Save, User as UserIcon, Mail, Phone, MapPin } from 'lucide-react';

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onSuccess?: () => void;
}

export default function UserEditModal({ isOpen, onClose, user, onSuccess }: UserEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        role: 'USER'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.profile?.firstName || '',
                lastName: user.profile?.lastName || '',
                email: user.email || '',
                phone: user.profile?.phone || '',
                address: user.profile?.address || '',
                role: user.role || 'USER'
            });
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update user');
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            alert('Error updating user: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <UserIcon size={20} className="text-brand-600" />
                        Edit User Profile
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                            <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                            <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[80px]" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">User Role</span>
                            <select name="role" value={formData.role} onChange={handleChange} className="ml-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-sm">
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg shadow-lg shadow-brand-200 hover:shadow-brand-300 hover:bg-brand-700 transition-all flex items-center gap-2 selection:disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
