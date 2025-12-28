"use client";

import { useEffect, useState } from 'react';
import { Users, UserPlus, Clock, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/dashboard');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Optional: Poll every 30s
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            title: 'Total Users',
            value: data?.stats?.totalUsers?.toLocaleString() || '-',
            change: '', // Real change calculation requires historical data not yet implemented
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Sessions',
            value: data?.stats?.activeSessions?.toString() || '-',
            change: '',
            icon: Clock,
            color: 'bg-green-500'
        },
        {
            title: 'New Today',
            value: data?.stats?.newUsersToday?.toString() || '-',
            change: '',
            icon: UserPlus,
            color: 'bg-purple-500'
        },
        {
            title: 'Admins',
            value: data?.stats?.admins?.toString() || '-',
            change: '',
            icon: ShieldCheck,
            color: 'bg-orange-500'
        },
    ];

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Dashboard Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            {/* <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                                {stat.change}
                            </span> */}
                        </div>
                        <h4 className="text-slate-500 text-sm font-medium">{stat.title}</h4>
                        <p className="text-2xl font-bold text-slate-800 mt-1">
                            {loading ? <span className="animate-pulse bg-slate-200 h-8 w-16 block rounded"></span> : stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4">Recent Activity</h4>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded"></div>)}
                            </div>
                        ) : data?.recentActivity?.length > 0 ? (
                            data.recentActivity.map((session: any) => (
                                <div key={session.id} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                        {(session.user?.profile?.firstName || session.user?.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {session.user?.profile?.firstName
                                                ? `${session.user.profile.firstName} logged in`
                                                : `${session.user?.email} logged in`}
                                        </p>
                                        <p className="text-xs text-slate-400">{formatTimeAgo(session.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-slate-500 text-center py-4">No recent activity</div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4">System Status</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-100">
                            <span className="text-green-700 font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                {data?.systemStatus?.database || 'Checking...'}
                            </span>
                            <span className="text-xs text-green-600">Stable</span>
                        </div>
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <span className="text-blue-700 font-medium">API Latency</span>
                            <span className="text-xs text-blue-600 text-bold">
                                {data?.systemStatus?.latency ? `${data.systemStatus.latency}ms` : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
