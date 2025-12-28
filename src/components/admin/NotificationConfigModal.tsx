import { X, Save, Sliders, BellRing } from 'lucide-react';

interface NotificationConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationConfigModal({ isOpen, onClose }: NotificationConfigModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sliders size={20} className="text-brand-600" />
                        Notification Settings
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600">
                            <BellRing size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">System Alerts</h4>
                            <p className="text-xs text-slate-500 mt-1">Receive notifications about system status, updates, and maintenance.</p>
                            <div className="mt-3 flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                                    <span className="ml-2 text-sm font-medium text-slate-600">Email</span>
                                </label>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                                    <span className="ml-2 text-sm font-medium text-slate-600">Push</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">New User Registrations</h4>
                            <p className="text-xs text-slate-500 mt-1">Get notified whenever a new user registers on the platform.</p>
                            <div className="mt-3 flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                                    <span className="ml-2 text-sm font-medium text-slate-600">Email</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Close</button>
                    <button className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2">
                        <Save size={18} />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

import { Users } from 'lucide-react';
