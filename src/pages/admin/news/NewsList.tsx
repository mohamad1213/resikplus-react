import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Newspaper,
    Clock,
    CheckCircle,
    Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
    getStatusColor,
    NEWS_CATEGORIES,
} from "@/lib/news-data";

// Define interface matching backend + UI needs
interface NewsItem {
    id: number;
    title: string;
    subtitle?: string; // mapped from excerpt
    category: string;
    author: string;
    status: "Draft" | "Published" | "Scheduled";
    date: string; // mapped from created_at
    thumbnail?: string;
    views: number; // Placeholder
    tags: string[]; // Placeholder
}

const NewsList = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/education/articles/");
            const articles = Array.isArray(response.data) ? response.data : (response.data.results || []);
            const mappedNews: NewsItem[] = articles.map((item: any) => ({
                id: item.id,
                title: item.title,
                subtitle: item.excerpt,
                category: item.category,
                author: item.author,
                status: item.status,
                date: new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                thumbnail: item.thumbnail,
                views: 0, // Backend doesn't have views yet
                tags: [], // Backend doesn't have tags yet
            }));
            setNews(mappedNews);
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Gagal memuat berita");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const filteredNews = news.filter((item) => {
        const matchSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory =
            categoryFilter === "all" || item.category === categoryFilter;
        const matchStatus =
            statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchCategory && matchStatus;
    });

    const handleDelete = (item: NewsItem) => {
        setDeleteTarget(item);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteTarget) {
            try {
                await api.delete(`/education/articles/${deleteTarget.id}/`);
                setNews(news.filter((n) => n.id !== deleteTarget.id));
                toast.success("Berita berhasil dihapus");
            } catch (error) {
                console.error("Error deleting article:", error);
                toast.error("Gagal menghapus berita");
            }
        }
        setIsDeleteOpen(false);
        setDeleteTarget(null);
    };

    const publishedCount = news.filter((n) => n.status === "Published").length;
    const draftCount = news.filter((n) => n.status === "Draft").length;
    const totalViews = news.reduce((sum, n) => sum + n.views, 0);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Newspaper className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{news.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total artikel</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {publishedCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {news.length > 0 ? ((publishedCount / news.length) * 100).toFixed(0) : 0}% dari total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Draft</CardTitle>
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{draftCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Menunggu publikasi
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Eye className="h-5 w-5 text-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {totalViews.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            (Belum tersedia)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl">Daftar Berita</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola semua berita dan artikel
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berita..."
                                    className="pl-9 w-full sm:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {NEWS_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-36">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                className="gap-2"
                                onClick={() => navigate("/admin/news/create")}
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Berita
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredNews.length === 0 ? (
                        <div className="text-center py-16">
                            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold mb-1">
                                Tidak ada berita ditemukan
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Coba ubah filter atau kata kunci pencarian
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredNews.map((item) => (
                                <Card
                                    key={item.id}
                                    className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    onClick={() => navigate(`/admin/news/${item.id}`)}
                                >
                                    {/* Thumbnail */}
                                    <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Newspaper className="h-14 w-14 text-primary/30" />
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <Badge
                                                className={getStatusColor(item.status)}
                                                variant="secondary"
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-popover">
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/admin/news/${item.id}`)}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            navigate(`/admin/news/${item.id}/edit`)
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        {item.subtitle && (
                                            <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                                                {item.subtitle}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Badge variant="outline" className="text-xs">
                                                {item.category}
                                            </Badge>
                                            <span>•</span>
                                            <span>{item.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span className="font-medium">By {item.author}</span>
                                            <span>{item.views.toLocaleString()} views</span>
                                        </div>
                                        {item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {item.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Berita</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus berita "
                            {deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default NewsList;
