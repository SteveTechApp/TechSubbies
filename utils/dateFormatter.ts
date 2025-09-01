export const formatDisplayDate = (date: any): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    if (now.toDateString() === date.toDateString()) {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 86400; // days

    if (interval > 2) {
         return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    if (interval > 1) {
        return 'Yesterday';
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
        return Math.floor(interval) + "h ago";
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
        return Math.floor(interval) + "m ago";
    }
    return Math.floor(seconds) + "s ago";
};
