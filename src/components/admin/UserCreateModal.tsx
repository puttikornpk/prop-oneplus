"use client";

import { useState } from 'react';
import { X, Save, User as UserIcon, Mail, Phone, MapPin, Lock, Shield } from 'lucide-react';

interface UserCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'USER',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.email || !formData.password) {
            alert("Please fill in email and password");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create user');
            }

            onSuccess();
            onClose();
            // Reset form? maybe next time
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <UserIcon size={20} className="text-brand-600" />
                        Add New User
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Login Info */}
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Shield size={16} /> Login Credentials
                        </h4>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input name="email" type="email" onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="user@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input name="password" type="password" onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
                                <select name="role" onChange={handleChange} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <UserIcon size={16} /> Profile Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                                <input name="firstName" type="text" onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="Somchai" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                                <input name="lastName" type="text" onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="Jai-dee" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input name="phone" type="tel" onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" placeholder="081-123-4567" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <textarea name="address" onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[80px]" placeholder="123 Sukhumvit Soi 1..." />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg shadow-lg shadow-brand-200 hover:shadow-brand-300 hover:bg-brand-700 transition-all flex items-center gap-2 selection:disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save size={18} />
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
}
