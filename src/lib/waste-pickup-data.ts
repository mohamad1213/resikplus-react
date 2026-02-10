export interface WastePickup {
    id: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: string;
    wasteType: string;
    estimatedWeight: number;
    actualWeight: number | null;
    partnerId: number;
    partnerName: string;
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
    scheduledDate: string;
    completedDate: string | null;
    price: number;
    notes: string;
    createdAt: string;
}

export const wasteTypes = [
    "Plastik",
    "Kertas/Kardus",
    "Logam",
    "Kaca",
    "Elektronik",
    "Organik",
    "B3 (Bahan Berbahaya)",
    "Campuran",
];

export const pickupStatuses = [
    { value: "pending", label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Dikonfirmasi", color: "bg-blue-100 text-blue-800" },
    { value: "in_progress", label: "Dalam Proses", color: "bg-purple-100 text-purple-800" },
    { value: "completed", label: "Selesai", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Dibatalkan", color: "bg-red-100 text-red-800" },
];

export const initialWastePickups: WastePickup[] = [
    {
        id: 1,
        customerName: "Andi Wijaya",
        customerPhone: "081234567890",
        customerEmail: "andi.wijaya@gmail.com",
        address: "Jl. Sudirman No. 45, Jakarta Selatan",
        wasteType: "Plastik",
        estimatedWeight: 50,
        actualWeight: 48,
        partnerId: 1,
        partnerName: "PT Plastik Sejahtera",
        status: "completed",
        scheduledDate: "2024-06-15",
        completedDate: "2024-06-15",
        price: 240000,
        notes: "Plastik botol PET, sudah dipilah",
        createdAt: "2024-06-10",
    },
    {
        id: 2,
        customerName: "Sari Dewi",
        customerPhone: "082345678901",
        customerEmail: "sari.dewi@yahoo.com",
        address: "Jl. Gatot Subroto No. 12, Bandung",
        wasteType: "Kertas/Kardus",
        estimatedWeight: 100,
        actualWeight: 95,
        partnerId: 2,
        partnerName: "CV Daur Ulang Mandiri",
        status: "completed",
        scheduledDate: "2024-06-18",
        completedDate: "2024-06-18",
        price: 285000,
        notes: "Kardus bekas dan kertas HVS",
        createdAt: "2024-06-12",
    },
    {
        id: 3,
        customerName: "Budi Prasetyo",
        customerPhone: "083456789012",
        customerEmail: "budi.p@gmail.com",
        address: "Jl. Ahmad Yani No. 33, Surabaya",
        wasteType: "Logam",
        estimatedWeight: 30,
        actualWeight: null,
        partnerId: 3,
        partnerName: "UD Sampah Berkah",
        status: "confirmed",
        scheduledDate: "2024-07-01",
        completedDate: null,
        price: 450000,
        notes: "Besi dan aluminium campuran",
        createdAt: "2024-06-25",
    },
    {
        id: 4,
        customerName: "Lisa Permata",
        customerPhone: "084567890123",
        customerEmail: "lisa.permata@outlook.com",
        address: "Jl. Pemuda No. 78, Semarang",
        wasteType: "Elektronik",
        estimatedWeight: 20,
        actualWeight: null,
        partnerId: 4,
        partnerName: "PT Eco Recycling",
        status: "in_progress",
        scheduledDate: "2024-06-28",
        completedDate: null,
        price: 600000,
        notes: "Komputer bekas dan printer",
        createdAt: "2024-06-20",
    },
    {
        id: 5,
        customerName: "Rudi Hartono",
        customerPhone: "085678901234",
        customerEmail: "rudi.h@gmail.com",
        address: "Jl. Malioboro No. 55, Yogyakarta",
        wasteType: "Campuran",
        estimatedWeight: 75,
        actualWeight: null,
        partnerId: 5,
        partnerName: "Koperasi Hijau Lestari",
        status: "pending",
        scheduledDate: "2024-07-05",
        completedDate: null,
        price: 375000,
        notes: "Campuran plastik, kertas, dan kaca",
        createdAt: "2024-06-28",
    },
    {
        id: 6,
        customerName: "Nina Agustina",
        customerPhone: "086789012345",
        customerEmail: "nina.a@gmail.com",
        address: "Jl. Diponegoro No. 22, Medan",
        wasteType: "Kaca",
        estimatedWeight: 40,
        actualWeight: 42,
        partnerId: 6,
        partnerName: "PT Green Indonesia",
        status: "completed",
        scheduledDate: "2024-06-20",
        completedDate: "2024-06-20",
        price: 210000,
        notes: "Botol kaca dan pecahan kaca aman",
        createdAt: "2024-06-14",
    },
    {
        id: 7,
        customerName: "Dedi Kurniawan",
        customerPhone: "087890123456",
        customerEmail: "dedi.k@gmail.com",
        address: "Jl. Asia Afrika No. 10, Bandung",
        wasteType: "Organik",
        estimatedWeight: 200,
        actualWeight: null,
        partnerId: 2,
        partnerName: "CV Daur Ulang Mandiri",
        status: "cancelled",
        scheduledDate: "2024-06-22",
        completedDate: null,
        price: 400000,
        notes: "Dibatalkan oleh pelanggan",
        createdAt: "2024-06-15",
    },
];
