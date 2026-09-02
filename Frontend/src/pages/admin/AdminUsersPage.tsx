import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  Trash2,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { User, HealthProfile } from '../../types';
import { adminService } from '../../services/admin.service';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UserProfileModal } from '../../components/admin/UserProfileModal';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext';

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedHealthProfile, setSelectedHealthProfile] = useState<HealthProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Delete Modal State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Action Loading State
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers({
        search: search.trim() || undefined,
        status: statusFilter,
        page,
        limit,
      });
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users list.');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // View Profile Action
  const handleViewProfile = async (user: User) => {
    setSelectedUser(user);
    setSelectedHealthProfile(null);
    setIsProfileModalOpen(true);
    setIsProfileLoading(true);

    try {
      const profileData = await adminService.getUserProfile(user.id);
      setSelectedHealthProfile(profileData.healthProfile);
    } catch (err: any) {
      showNotification('error', 'Failed to load user profile details.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Toggle Block / Unblock Action
  const handleToggleStatus = async (user: User) => {
    if (user.id === currentAdmin?.id) {
      showNotification('error', 'You cannot block your own active admin account.');
      return;
    }

    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    setActionLoadingId(user.id);

    try {
      const updatedUser = await adminService.updateUserStatus(user.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      showNotification(
        'success',
        `User ${user.name} has been successfully ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}.`
      );
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to update user access status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (user: User) => {
    if (user.id === currentAdmin?.id) {
      showNotification('error', 'You cannot delete your own admin account.');
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await adminService.deleteUser(userToDelete.id);
      showNotification('success', `User account ${userToDelete.name} deleted permanently.`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete user account.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate high level stats from current dataset
  const activeCount = users.filter((u) => u.status === 'active').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;
  const verifiedCount = users.filter((u) => u.isVerified).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> User Access Directory
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">User Account Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search registered users, inspect health vitals, and control account permissions.
          </p>
        </div>
        <button
          onClick={() => fetchUsers()}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700/80 flex items-center gap-2 shadow-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/60 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total System Users</span>
            <span className="text-2xl font-black text-white">{totalUsers}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Users (On Page)</span>
            <span className="text-2xl font-black text-emerald-400">{activeCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Blocked Users (On Page)</span>
            <span className="text-2xl font-black text-rose-400">{blockedCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Verified Email (On Page)</span>
            <span className="text-2xl font-black text-teal-400">{verifiedCount}</span>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/90 text-rose-300 border-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search user by name or email..."
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900 text-white">All Accounts</option>
              <option value="active" className="bg-slate-900 text-white">Active Only</option>
              <option value="blocked" className="bg-slate-900 text-white">Blocked Only</option>
            </select>
          </div>

          {(search || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPage(1);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* User Table Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Fetching user database...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-rose-400">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Users Found</h3>
            <p className="text-xs text-slate-500">
              No user account matching your filter parameters was located.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Access Status</th>
                  <th className="py-4 px-4">Email Verification</th>
                  <th className="py-4 px-4">Registered Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-slate-400 text-[11px]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={user.role} size="sm" />
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={user.status} size="sm" />
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={user.isVerified ? 'verified' : 'unverified'} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right space-x-1.5">
                      {/* View Health Profile */}
                      <button
                        onClick={() => handleViewProfile(user)}
                        title="View Stored Personal & Health Information"
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition border border-transparent hover:border-emerald-500/20"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Block / Unblock Toggle */}
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={actionLoadingId === user.id || user.id === currentAdmin?.id}
                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                        className={`p-2 rounded-lg transition border border-transparent disabled:opacity-30 ${
                          user.status === 'active'
                            ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20'
                            : 'text-rose-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                        }`}
                      >
                        {actionLoadingId === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.status === 'active' ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete User */}
                      <button
                        onClick={() => handleOpenDeleteModal(user)}
                        disabled={user.id === currentAdmin?.id}
                        title="Delete Account"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition border border-transparent hover:border-rose-500/20 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Showing <span className="font-semibold text-white">{users.length}</span> of{' '}
              <span className="font-semibold text-white">{totalUsers}</span> users
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300 transition disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300 transition disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
        healthProfile={selectedHealthProfile}
        isLoading={isProfileLoading}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
