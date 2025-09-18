import React, { useState, useMemo, useRef, useEffect } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';
import { Bell, Briefcase, Mail, Star } from './Icons';
import { Notification, NotificationType } from '../types';
import { formatTimeAgo } from '../utils/dateFormatter';

const getIconForType = (type: NotificationType) => {
    switch (type) {
        case NotificationType.NEW_JOB_MATCH: return <Briefcase size={18} className="text-blue-500" />;
        case NotificationType.JOB_OFFER: return <Star size={18} className="text-yellow-500" />;
        case NotificationType.MESSAGE: return <Mail size={18} className="text-green-500" />;
        default: return <Bell size={18} className="text-gray-500" />;
    }
};

export const Notifications = () => {
    const { user, notifications, markNotificationsAsRead } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const unreadCount = useMemo(() => {
        if (!user) return 0;
        return notifications.filter(n => n.userId === user.id && !n.isRead).length;
    }, [notifications, user]);

    const userNotifications = useMemo(() => {
         if (!user) return [];
        return notifications
            .filter(n => n.userId === user.id)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
    }, [notifications, user]);

    const handleToggle = () => {
        if (!isOpen && user) {
            markNotificationsAsRead(user.id);
        }
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-full hover:bg-gray-100"
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                <Bell className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-3 border-b font-bold text-gray-800">Notifications</div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {userNotifications.length > 0 ? (
                            userNotifications.map(n => (
                                <div key={n.id} className={`p-3 border-b border-gray-100 flex items-start gap-3 transition-colors hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50' : ''}`}>
                                    <div className="flex-shrink-0 mt-1">{getIconForType(n.type)}</div>
                                    <div>
                                        <p className="text-sm text-gray-700">{n.text}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(n.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-gray-500">No notifications yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};