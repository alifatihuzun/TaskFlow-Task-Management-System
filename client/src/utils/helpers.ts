export const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'Critical': return '#ef4444';
        case 'High': return '#f97316';
        case 'Medium': return '#eab308';
        case 'Low': return '#22c55e';
        default: return '#6b7280';
    }
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Todo': return '#6366f1';
        case 'InProgress': return '#3b82f6';
        case 'Done': return '#22c55e';
        case 'Cancelled': return '#ef4444';
        default: return '#6b7280';
    }
};

export const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'Todo': return 'Yapılacak';
        case 'InProgress': return 'Devam Ediyor';
        case 'Done': return 'Tamamlandı';
        case 'Cancelled': return 'İptal Edildi';
        default: return status;
    }
};

export const getPriorityLabel = (priority: string): string => {
    switch (priority) {
        case 'Low': return 'Düşük';
        case 'Medium': return 'Orta';
        case 'High': return 'Yüksek';
        case 'Critical': return 'Kritik';
        default: return priority;
    }
};
