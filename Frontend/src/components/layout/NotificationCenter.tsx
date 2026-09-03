import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, Droplet, Utensils, Zap, Info, ExternalLink, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationType } from '../../types/notification';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const renderTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'water_reminder':
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
            <Droplet className="w-4 h-4 fill-current" />
          </div>
        );
      case 'meal_reminder':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
        );
      case 'health_alert':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMin = Math.floor((now - time) / (1000 * 60));

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition flex items-center justify-center focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Top-Right Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold font-outfit text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAllAsReadHandler}
                  className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center space-x-1 font-medium transition"
                  title="Mark all read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 p-2 bg-slate-50 border-b border-slate-100 text-xs font-bold overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'water_reminder', label: 'Water 💧' },
              { id: 'meal_reminder', label: 'Meals 🍽️' },
              { id: 'health_alert', label: 'Alerts ⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium">No notifications in this section</p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  className={`p-3.5 flex items-start space-x-3 transition group relative ${
                    !item.isRead ? 'bg-cyan-50/50 hover:bg-cyan-50' : 'hover:bg-slate-50'
                  }`}
                >
                  {renderTypeIcon(item.type)}

                  <div className="flex-1 pr-6">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-outfit ${
                          !item.isRead ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>

                    {item.actionUrl && (
                      <a
                        href={item.actionUrl}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-cyan-600 hover:text-cyan-700 mt-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Minimize / Dismiss Notification X Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-70 group-hover:opacity-100 transition"
                    title="Minimize & remove notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  function markAllAllAsReadHandler() {
    markAllAsRead();
  }
};
