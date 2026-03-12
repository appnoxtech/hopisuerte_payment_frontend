export const formatLocalTime = (utcTimestamp) => {
    if (!utcTimestamp) return 'N/A';
    
    try {
        const date = new Date(utcTimestamp);
        
        // Check if date is valid
        if (isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleString(undefined, {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '-');
    } catch (e) {
        console.error("Date formatting error:", e);
        return utcTimestamp;
    }
};

export const formatLocalDate = (utcTimestamp) => {
    if (!utcTimestamp) return 'N/A';
    
    try {
        const date = new Date(utcTimestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleDateString(undefined, {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
    } catch (e) {
        return utcTimestamp;
    }
};
