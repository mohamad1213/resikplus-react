import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    Save,
    Eye,
    Send,
    Clock,
    Tag,
    X,
} from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/admin/news/RichTextEditor";
import ThumbnailUpload from "@/components/admin/news/ThumbnailUpload";
import { NEWS_CATEGORIES, NEWS_AUTHORS } from "@/lib/news-data";

const NewsCreate = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        category: "Edukasi",
        author: "Admin",
        status: "Draft" as "Draft" | "Published" | "Scheduled",
        content: "",
        thumbnail: "",
        tags: [] as string[],
        scheduledDate: "",
    });

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: [...formData.tags, tag] });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    const handleSave = async (publishStatus?: "Draft" | "Published" | "Scheduled") => {
        if (!formData.title.trim()) {
            toast.error("Judul berita wajib diisi");
            return;
        }
        if (!formData.content.trim() || formData.content === "<p></p>") {
            toast.error("Konten berita wajib diisi");
            return;
        }

        setIsSaving(true);
        // Simulating save
        await new Promise((r) => setTimeout(r, 800));

        const status = publishStatus || formData.status;
        const statusLabel =
            status === "Published"
                ? "dipublikasikan"
                : status === "Scheduled"
                    ? "dijadwalkan"
                    : "disimpan sebagai draft";

        toast.success(`Berita berhasil ${statusLabel}`);
        setIsSaving(false);
        navigate("/admin/news");
    };

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
                        <h1 className="text-2xl font-bold">Tulis Berita Baru</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat artikel berita yang menarik dan informatif
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleSave("Draft")}
                        disabled={isSaving}
                    >
                        <Save className="h-4 w-4" />
                        Simpan Draft
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleSave("Scheduled")}
                        disabled={isSaving}
                    >
                        <Clock className="h-4 w-4" />
                        Jadwalkan
                    </Button>
                    <Button
                        className="gap-2"
                        onClick={() => handleSave("Published")}
                        disabled={isSaving}
                    >
                        <Send className="h-4 w-4" />
                        Publikasikan
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Subtitle */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold">
                                    Judul Berita <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Tulis judul berita yang menarik..."
                                    className="text-lg h-12 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subtitle" className="text-sm font-semibold">
                                    Subjudul
                                </Label>
                                <Input
                                    id="subtitle"
                                    value={formData.subtitle}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subtitle: e.target.value })
                                    }
                                    placeholder="Deskripsi singkat atau ringkasan berita..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thumbnail */}
                    <Card>
                        <CardContent className="p-6">
                            <Label className="text-sm font-semibold mb-3 block">
                                Thumbnail / Cover Image
                            </Label>
                            <ThumbnailUpload
                                value={formData.thumbnail}
                                onChange={(url) =>
                                    setFormData({ ...formData, thumbnail: url })
                                }
                            />
                        </CardContent>
                    </Card>

                    {/* Rich Text Editor */}
                    <Card>
                        <CardContent className="p-6">
                            <Label className="text-sm font-semibold mb-3 block">
                                Konten Berita <span className="text-destructive">*</span>
                            </Label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) =>
                                    setFormData({ ...formData, content })
                                }
                                placeholder="Tulis konten berita yang menarik dan informatif..."
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right */}
                <div className="space-y-6">
                    {/* Status & Publish */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Pengaturan Publikasi
                            </h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-sm">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v) =>
                                            setFormData({
                                                ...formData,
                                                status: v as "Draft" | "Published" | "Scheduled",
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                                                    Draft
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Published">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    Published
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Scheduled">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                    Scheduled
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.status === "Scheduled" && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Tanggal Publikasi</Label>
                                        <Input
                                            type="datetime-local"
                                            value={formData.scheduledDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    scheduledDate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-sm">Penulis</Label>
                                    <Select
                                        value={formData.author}
                                        onValueChange={(v) =>
                                            setFormData({ ...formData, author: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {NEWS_AUTHORS.map((author) => (
                                                <SelectItem key={author} value={author}>
                                                    {author}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold">Kategori</h3>
                            <Select
                                value={formData.category}
                                onValueChange={(v) =>
                                    setFormData({ ...formData, category: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {NEWS_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Tags
                            </h3>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Tambah tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                />
                                <Button variant="outline" size="sm" onClick={addTag}>
                                    Tambah
                                </Button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="gap-1 pr-1"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 h-4 w-4 rounded-full hover:bg-destructive/20 flex items-center justify-center"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* SEO Preview */}
                    <Card>
                        <CardContent className="p-6 space-y-3">
                            <h3 className="font-semibold">Preview SEO</h3>
                            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                                <p className="text-primary text-sm font-medium line-clamp-1">
                                    {formData.title || "Judul Berita"}
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-400">
                                    resikplus.com/news/...
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {formData.subtitle || "Deskripsi berita akan muncul di sini..."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NewsCreate;
