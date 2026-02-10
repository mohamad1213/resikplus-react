import api from "./api";

export interface Partner {
    id: number;
    name: string;
    type: string;
    location: string;
    status: string;
    phone: string;
    email: string;
    address: string;
    contact_person: string;
    description: string;
    join_date: string;
}

export const getPartners = async () => {
    const response = await api.get<Partner[]>("/partners/");
    return response.data;
};
