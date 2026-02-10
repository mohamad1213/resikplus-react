import api from "./api";

export interface DashboardStats {
    total_users: number;
    total_products: number;
    total_partners: number;
    total_recycled: number;
    total_articles: number;
    total_courses: number;
}

export interface RecentActivity {
    id: string;
    action: string;
    user: string;
    time: string;
}

export interface TopPartner {
    name: string;
    recycled: string;
    percentage: number;
}

export const getDashboardStats = async () => {
    const response = await api.get<DashboardStats>("/dashboard/stats/");
    return response.data;
};

export const getRecentActivities = async () => {
    const response = await api.get<RecentActivity[]>("/dashboard/recent-activities/");
    return response.data;
};

export const getTopPartners = async () => {
    const response = await api.get<TopPartner[]>("/dashboard/top-partners/");
    return response.data;
};
