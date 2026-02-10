import api from "./api";
import { WastePickup } from "./waste-pickup-data";

export const getWastePickups = async (params?: any) => {
    const response = await api.get<WastePickup[]>("/waste-pickups/", { params });
    return response.data;
};

export const getWastePickup = async (id: number) => {
    const response = await api.get<WastePickup>(`/waste-pickups/${id}/`);
    return response.data;
};

export const createWastePickup = async (data: Partial<WastePickup>) => {
    const response = await api.post<WastePickup>("/waste-pickups/", data);
    return response.data;
};

export const updateWastePickup = async (id: number, data: Partial<WastePickup>) => {
    const response = await api.put<WastePickup>(`/waste-pickups/${id}/`, data);
    return response.data;
};

export const deleteWastePickup = async (id: number) => {
    await api.delete(`/waste-pickups/${id}/`);
};
