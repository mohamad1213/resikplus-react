
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    Link as CKLink,
    List,
    Heading,
    BlockQuote,
    Indent,
} from "ckeditor5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import "ckeditor5/ckeditor5.css";

interface NewsFormProps {
    isEdit?: boolean;
}

const categories = ["Daur Ulang", "Keberlanjutan", "Teknologi", "Komunitas", "Kebijakan"];

const NewsForm = ({ isEdit = false }: NewsFormProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);

    const [formData, setFormData] = useState({
        title: "",
        category: "Keberlanjutan",
        author: "Tim ResikPlus",
        status: "Draft",
        is_featured: false,
        excerpt: "",
        content: "",
        thumbnail: null as File | null,
        thumbnailPreview: "" as string | null,
    });

    useEffect(() => {
        if (isEdit && id) {
            fetchArticle(id);
        }
    }, [isEdit, id]);

    const fetchArticle = async (articleId: string) => {
        try {
            const response = await api.get(`/education/articles/${articleId}/`);
            const data = response.data;
            setFormData({
                title: data.title,
                category: data.category,
                author: data.author,
                status: data.status,
                is_featured: data.is_featured,
                excerpt: data.excerpt || "",
                content: data.content || "",
                thumbnail: null,
                thumbnailPreview: data.thumbnail,
            });
        } catch (error) {
            console.error("Error fetching article:", error);
            toast.error("Gagal memuat data artikel");
            navigate("/admin/news");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({
                ...prev,
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error("Judul dan Konten wajib diisi");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("category", formData.category);
        data.append("author", formData.author);
        data.append("status", formData.status);
        data.append("is_featured", formData.is_featured ? "true" : "false");
        data.append("excerpt", formData.excerpt);
        data.append("content", formData.content);
        if (formData.thumbnail) {
            data.append("thumbnail", formData.thumbnail);
        }

        try {
            if (isEdit && id) {
                await api.put(`/education/articles/${id}/`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                }); // Use PATCH if partial update allowed, PUT replaces entirely
                toast.success("Berita berhasil diperbarui");
            } else {
                await api.post("/education/articles/", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Berita berhasil dibuat");
            }
            navigate("/admin/news");
        } catch (error) {
            console.error("Error saving article:", error);
            toast.error("Gagal menyimpan berita");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/news">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEdit ? "Edit Berita" : "Buat Berita Baru"}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {isEdit && id && (
                        <Link to={`/news/${id}`} target="_blank">
                            <Button variant="secondary">
                                <Eye className="mr-2 h-4 w-4" /> Preview
                            </Button>
                        </Link>
                    )}
                    <Button onClick={handleSubmit} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Menyimpan..." : "Simpan Berita"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Konten Utama</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input
                                    id="title"
                                    placeholder="Masukkan judul berita"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Konten Berita</Label>
                                <div className="prose-editor border rounded-md overflow-hidden min-h-[300px]">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            licenseKey: 'GPL',
                                            toolbar: {
                                                items: [
                                                    'undo', 'redo', '|',
                                                    'heading', '|',
                                                    'bold', 'italic', '|',
                                                    'link', 'insertImage', 'blockQuote', '|',
                                                    'bulletedList', 'numberedList', 'outdent', 'indent'
                                                ],
                                            },
                                            plugins: [
                                                Bold, Essentials, Italic, Mention, Paragraph, Undo, CKLink, Image, ImageToolbar, ImageCaption, ImageStyle, List, Heading, BlockQuote, Indent
                                            ],
                                            image: {
                                                toolbar: [
                                                    'imageTextAlternative',
                                                    'toggleImageCaption',
                                                    'imageStyle:inline',
                                                    'imageStyle:block',
                                                    'imageStyle:side'
                                                ]
                                            },
                                        }}
                                        data={formData.content}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            handleChange("content", data);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Ringkasan singkat untuk preview..."
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => handleChange("excerpt", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Akan ditampilkan di daftar berita dan meta description.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan & Publikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleChange("status", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Published">Published</SelectItem>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => handleChange("category", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author">Penulis</Label>
                                <Input
                                    id="author"
                                    placeholder="Nama penulis"
                                    value={formData.author}
                                    onChange={(e) => handleChange("author", e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) =>
                                        handleChange("is_featured", checked === true)
                                    }
                                />
                                <Label htmlFor="is_featured">Featured (Unggulan)</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Foto Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {formData.thumbnailPreview ? (
                                    <div className="relative aspect-video rounded-md overflow-hidden border">
                                        <img
                                            src={formData.thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={() => handleChange("thumbnailPreview", null)}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-muted/30 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}

                                <Label htmlFor="thumbnail" className="sr-only">Upload Thumbnail</Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: JPG, PNG, GIF. Max 2MB.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NewsForm;
