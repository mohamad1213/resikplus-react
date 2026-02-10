export interface Partner {
    id: number;
    name: string;
    type: string; // "Pengumpul" | "Pengolah"
    location: string;
    status: string; // "Aktif" | "Pending" | "Nonaktif"
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
    description: string;
    joinDate: string;
}

export const partnerTypes = ["Pengumpul", "Pengolah"];
export const partnerStatuses = ["Aktif", "Pending", "Nonaktif"];

export const initialPartners: Partner[] = []; // empty dummy as we use API now
