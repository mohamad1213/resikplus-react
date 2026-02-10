import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Calendar,
    User,
    Eye,
    Tag,
    Newspaper,
    Clock,
    ExternalLink,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getStatusColor } from "@/lib/news-data";

interface NewsItem {
    id: number;
    title: string;
    subtitle?: string; // mapped from excerpt
    category: string;
    author: string;
    status: "Draft" | "Published" | "Scheduled";
    date: string; // mapped from created_at
    thumbnail?: string;
    views: number;
    tags: string[];
    content: string;
}

const NewsDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get(`/education/articles/${id}/`);
                const data = response.data;
                setNewsItem({
                    id: data.id,
                    title: data.title,
                    subtitle: data.excerpt,
                    category: data.category,
                    author: data.author,
                    status: data.status,
                    date: new Date(data.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                    thumbnail: data.thumbnail,
                    views: 0,
                    tags: [],
                    content: data.content,
                });
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchNews();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p>Memuat berita...</p>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Newspaper className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Berita tidak ditemukan</h2>
                <p className="text-muted-foreground mb-4">
                    Artikel yang Anda cari tidak tersedia
                </p>
                <Button onClick={() => navigate("/admin/news")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Button>
            </div>
        );
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/education/articles/${id}/`);
            toast.success("Berita berhasil dihapus");
            navigate("/admin/news");
        } catch (error) {
            console.error("Error deleting article:", error);
            toast.error("Gagal menghapus berita");
        }
    };

    const statusIcon =
        newsItem.status === "Published" ? (
            <Eye className="h-4 w-4" />
        ) : newsItem.status === "Scheduled" ? (
            <Clock className="h-4 w-4" />
        ) : (
            <Edit className="h-4 w-4" />
        );

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/admin/news")}
                        className="rounded-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Detail Berita</h1>
                        <p className="text-sm text-muted-foreground">
                            Preview artikel sebelum dipublikasikan
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate(`/admin/news/${id}/edit`)}
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 className="h-4 w-4" />
                                Hapus
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Berita</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus berita "{newsItem.title}"?
                                    Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Thumbnail */}
                    <Card className="overflow-hidden">
                        <div className="h-64 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 flex items-center justify-center">
                            {newsItem.thumbnail ? (
                                <img
                                    src={newsItem.thumbnail}
                                    alt={newsItem.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <Newspaper className="h-16 w-16 mx-auto text-primary/30 mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada thumbnail
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Article Content */}
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge
                                    className={getStatusColor(newsItem.status)}
                                    variant="secondary"
                                >
                                    <span className="flex items-center gap-1.5">
                                        {statusIcon}
                                        {newsItem.status}
                                    </span>
                                </Badge>
                                <Badge variant="outline">{newsItem.category}</Badge>
                            </div>

                            <h1 className="text-3xl font-bold mb-2">{newsItem.title}</h1>
                            {newsItem.subtitle && (
                                <p className="text-lg text-muted-foreground mb-6">
                                    {newsItem.subtitle}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                <span className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    {newsItem.author}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {newsItem.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    {newsItem.views.toLocaleString()} views
                                </span>
                            </div>

                            <Separator className="mb-6" />

                            {/* Rendered HTML content */}
                            <div
                                className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: newsItem.content }}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Info */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold">Informasi Artikel</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">ID</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                                        #{newsItem.id}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge
                                        className={getStatusColor(newsItem.status)}
                                        variant="secondary"
                                    >
                                        {newsItem.status}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Kategori</span>
                                    <span>{newsItem.category}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Penulis</span>
                                    <span>{newsItem.author}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Tanggal</span>
                                    <span>{newsItem.date}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Views</span>
                                    <span>{newsItem.views.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {newsItem.tags.length > 0 && (
                        <Card>
                            <CardContent className="p-6 space-y-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {newsItem.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <Card>
                        <CardContent className="p-6 space-y-3">
                            <h3 className="font-semibold">Aksi Cepat</h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={() => navigate(`/admin/news/${id}/edit`)}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit Berita
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Lihat di Website
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
