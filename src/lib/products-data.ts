export interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    stock: number;
    status: string;
    description: string;
    image?: string;
    sku?: string;
    weight?: string;
    dimensions?: string;
    createdAt: string;
    updatedAt: string;
}

export const productCategories = ["Mesin", "Alat", "Produk", "Bahan Baku", "Aksesoris"];

export const initialProducts: Product[] = [
    {
        id: 1,
        name: "Mesin Pencacah Plastik",
        category: "Mesin",
        price: "15000000",
        stock: 5,
        status: "Tersedia",
        description: "Mesin pencacah plastik kapasitas besar untuk industri daur ulang. Dilengkapi dengan pisau pemotong berkualitas tinggi dan motor bertenaga besar.",
        sku: "MSN-001",
        weight: "250 kg",
        dimensions: "120 x 80 x 150 cm",
        createdAt: "2024-01-15",
        updatedAt: "2024-03-10",
    },
    {
        id: 2,
        name: "Komposter Organik",
        category: "Alat",
        price: "500000",
        stock: 20,
        status: "Tersedia",
        description: "Komposter untuk sampah organik rumah tangga. Desain kompak dan mudah digunakan.",
        sku: "ALT-001",
        weight: "5 kg",
        dimensions: "40 x 40 x 60 cm",
        createdAt: "2024-02-01",
        updatedAt: "2024-03-05",
    },
    {
        id: 3,
        name: "Tas Daur Ulang",
        category: "Produk",
        price: "50000",
        stock: 0,
        status: "Habis",
        description: "Tas ramah lingkungan dari bahan daur ulang. Kuat, tahan lama, dan stylish.",
        sku: "PRD-001",
        weight: "0.3 kg",
        dimensions: "35 x 10 x 40 cm",
        createdAt: "2024-01-20",
        updatedAt: "2024-02-28",
    },
    {
        id: 4,
        name: "Pupuk Kompos",
        category: "Produk",
        price: "25000",
        stock: 100,
        status: "Tersedia",
        description: "Pupuk organik dari sampah daur ulang. Cocok untuk tanaman hias dan pertanian.",
        sku: "PRD-002",
        weight: "5 kg",
        dimensions: "30 x 20 x 10 cm",
        createdAt: "2024-02-10",
        updatedAt: "2024-03-01",
    },
    {
        id: 5,
        name: "Mesin Press Kardus",
        category: "Mesin",
        price: "8000000",
        stock: 3,
        status: "Tersedia",
        description: "Mesin press untuk mengemas kardus bekas. Efisien dan hemat ruang penyimpanan.",
        sku: "MSN-002",
        weight: "180 kg",
        dimensions: "100 x 60 x 120 cm",
        createdAt: "2024-01-25",
        updatedAt: "2024-03-08",
    },
    {
        id: 6,
        name: "Tempat Sampah Pilah",
        category: "Alat",
        price: "150000",
        stock: 50,
        status: "Tersedia",
        description: "Tempat sampah 3 pilah untuk rumah tangga. Memudahkan pemilahan sampah organik dan anorganik.",
        sku: "ALT-002",
        weight: "3 kg",
        dimensions: "60 x 25 x 45 cm",
        createdAt: "2024-02-15",
        updatedAt: "2024-03-12",
    },
];
