import { X, Send, Bell } from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Bell size={20} />
                            Send Notification
                        </h3>
                        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-brand-100 text-sm mt-1">Send a message to all users or specific groups.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Title</label>
                        <input type="text" placeholder="Notification Title" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Message</label>
                        <textarea placeholder="Type your message here..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[100px]" />
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                            <span>Send via Email</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" defaultChecked />
                            <span>Push Notification</span>
                        </label>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors">Cancel</button>
                    <button className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all flex items-center gap-2">
                        <Send size={16} />
                        Send Now
                    </button>
                </div>
            </div>
        </div>
    );
}
