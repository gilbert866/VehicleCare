export const formattingUtils = {
    formatBatteryLevel: (level: number | null): string => {
        if (level === null) return 'Loading...';
        return `${level}%`;
    },

    formatBatteryStatus: (level: number | null, isCharging?: boolean): string => {
        if (level === null) return 'Unknown';
        
        let status = '';
        if (isCharging) {
            status = 'Charging';
        } else if (level <= 20) {
            status = 'Low Battery';
        } else if (level <= 50) {
            status = 'Medium Battery';
        } else {
            status = 'Good Battery';
        }
        
        return `${status} (${level}%)`;
    },

    formatDistance: (meters: number): string => {
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        } else {
            return `${(meters / 1000).toFixed(1)}km`;
        }
    },

    formatPlaceName: (name: string, maxLength: number = 30): string => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    },

    formatTimeAgo: (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    },

    capitalizeFirst: (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    truncateText: (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
}; 