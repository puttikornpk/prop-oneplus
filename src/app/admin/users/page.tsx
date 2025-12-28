"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import UserEditModal from "@/components/admin/UserEditModal";
import UserCreateModal from "@/components/admin/UserCreateModal";

export default function UsersPage() {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Sorting
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, roleFilter, statusFilter, sortColumn, sortDirection]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (roleFilter) params.append('role', roleFilter);
            if (statusFilter) params.append('status', statusFilter);
            if (sortColumn) {
                params.append('sort', sortColumn);
                params.append('order', sortDirection);
            }

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (column: string) => {
        if (sortColumn !== column) return <ArrowUpDown size={14} className="text-slate-400 ml-1 inline" />;
        return sortDirection === 'asc'
            ? <ArrowUp size={14} className="text-brand-600 ml-1 inline" />
            : <ArrowDown size={14} className="text-brand-600 ml-1 inline" />;
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm">Manage user access and profiles.</p>
                </div>
                <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-brand-300 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    <span>Add New User</span>
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">
                    <div className="relative max-w-sm w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                            <option value="">All Roles</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
                            <tr>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        User {renderSortIcon('name')}
                                    </div>
                                </th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                    onClick={() => handleSort('lastLogin')}
                                >
                                    <div className="flex items-center">
                                        Last Login {renderSortIcon('lastLogin')}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{user.lastLogin}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                    <span>{users.length} results</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            <UserEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={selectedUser} onSuccess={fetchUsers} />
            <UserCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchUsers} />
        </div>
    );
}
