export interface NewsItem {
    id: number;
    title: string;
    subtitle: string;
    category: string;
    author: string;
    status: "Published" | "Draft" | "Scheduled";
    date: string;
    views: number;
    content: string;
    thumbnail: string;
    tags: string[];
}

export const initialNews: NewsItem[] = [
    {
        id: 1,
        title: "Program Daur Ulang Baru di Jakarta",
        subtitle: "Inisiatif terbaru untuk meningkatkan tingkat daur ulang di ibu kota",
        category: "Program",
        author: "Admin",
        status: "Published",
        date: "2024-12-01",
        views: 1250,
        content: "<h2>Program Daur Ulang Terbaru</h2><p>Program daur ulang terbaru yang diluncurkan di Jakarta bertujuan untuk meningkatkan kesadaran masyarakat akan pentingnya pengolahan sampah.</p><p>Program ini melibatkan <strong>50 kelurahan</strong> di wilayah Jakarta Selatan dan Jakarta Timur.</p>",
        thumbnail: "",
        tags: ["daur ulang", "jakarta", "lingkungan"],
    },
    {
        id: 2,
        title: "Kerjasama dengan Pemerintah Daerah",
        subtitle: "MoU strategis untuk pengelolaan limbah berkelanjutan",
        category: "Kerjasama",
        author: "Editor",
        status: "Published",
        date: "2024-11-28",
        views: 890,
        content: "<h2>Kerjasama Strategis</h2><p>Kerjasama strategis dengan pemerintah daerah untuk mengelola limbah secara <em>berkelanjutan</em> dan ramah lingkungan.</p>",
        thumbnail: "",
        tags: ["kerjasama", "pemerintah"],
    },
    {
        id: 3,
        title: "Tips Memilah Sampah di Rumah",
        subtitle: "Panduan praktis untuk keluarga Indonesia",
        category: "Edukasi",
        author: "Admin",
        status: "Draft",
        date: "2024-11-25",
        views: 0,
        content: "<h2>Panduan Memilah Sampah</h2><p>Panduan lengkap memilah sampah di rumah untuk keluarga Indonesia.</p><ul><li>Sampah organik</li><li>Sampah anorganik</li><li>Sampah B3</li></ul>",
        thumbnail: "",
        tags: ["edukasi", "tips", "sampah"],
    },
    {
        id: 4,
        title: "Workshop Pengolahan Limbah Plastik",
        subtitle: "Pelatihan hands-on untuk komunitas lokal",
        category: "Event",
        author: "Editor",
        status: "Published",
        date: "2024-11-20",
        views: 567,
        content: "<h2>Workshop Limbah Plastik</h2><p>Workshop tentang pengolahan limbah plastik yang diselenggarakan untuk komunitas lokal.</p>",
        thumbnail: "",
        tags: ["workshop", "plastik", "event"],
    },
    {
        id: 5,
        title: "Penghargaan Lingkungan 2024",
        subtitle: "ResikPlus meraih penghargaan bergengsi dari Kementerian LHK",
        category: "Prestasi",
        author: "Admin",
        status: "Scheduled",
        date: "2024-12-15",
        views: 0,
        content: "<h2>Penghargaan Lingkungan</h2><p>ResikPlus meraih penghargaan lingkungan dari Kementerian Lingkungan Hidup dan Kehutanan.</p>",
        thumbnail: "",
        tags: ["penghargaan", "prestasi"],
    },
];

export const NEWS_CATEGORIES = ["Program", "Kerjasama", "Edukasi", "Event", "Prestasi"];
export const NEWS_AUTHORS = ["Admin", "Editor", "Kontributor"];
export const NEWS_STATUSES = ["Draft", "Published", "Scheduled"] as const;

export const getStatusColor = (status: string) => {
    switch (status) {
        case "Published":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "Draft":
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        case "Scheduled":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        default:
            return "bg-muted text-muted-foreground";
    }
};
