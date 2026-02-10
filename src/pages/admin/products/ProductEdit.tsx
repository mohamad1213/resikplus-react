import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Package, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { productCategories } from "@/lib/products-data";
import api from "@/lib/api";

const ProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "Tersedia",
        description: "",
        sku: "",
        weight: "",
        dimensions: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}/`);
                const data = response.data;

                setFormData({
                    name: data.name,
                    category: data.category,
                    price: data.price ? String(data.price).split('.')[0] : "", // Remove decimal if present
                    stock: String(data.stock_quantity),
                    status: data.in_stock ? "Tersedia" : "Habis",
                    description: data.description || "",
                    sku: data.sku || "",
                    weight: data.weight || "",
                    dimensions: data.dimensions || "",
                });

                if (data.image) {
                    setThumbnail(data.image);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Gagal memuat produk");
                navigate("/admin/products");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnail(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.category) {
            toast.error("Nama, kategori, dan harga produk wajib diisi");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("stock_quantity", formData.stock || "0");
            // Simplified status logic: "Tersedia" -> in_stock=True
            data.append("in_stock", formData.status === "Tersedia" ? "true" : "false");
            data.append("description", formData.description);
            data.append("sku", formData.sku);
            data.append("weight", formData.weight);
            data.append("dimensions", formData.dimensions);

            if (imageFile) {
                data.append("image", imageFile);
            }

            await api.patch(`/products/${id}/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Produk berhasil diperbarui");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Gagal memperbarui produk");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Edit Produk</h1>
                    <p className="text-muted-foreground">Perbarui informasi produk "{formData.name}"</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Produk *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Masukkan nama produk"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            placeholder="Contoh: PRD-001"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Kategori *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {productCategories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi Produk</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Jelaskan detail produk..."
                                        rows={5}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Foto Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {thumbnail ? (
                                    <div className="relative group">
                                        <img src={thumbnail} alt="Preview" className="w-full h-64 object-cover rounded-xl border" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                setThumbnail(null);
                                                setImageFile(null);
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                                        <Upload className="w-10 h-10 text-muted-foreground/50 mb-3" />
                                        <p className="text-sm font-medium text-muted-foreground">Klik untuk upload foto produk</p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (Max. 5MB)</p>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} disabled={isSubmitting} />
                                    </label>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Spesifikasi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Berat</Label>
                                        <Input
                                            id="weight"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            placeholder="Contoh: 5 kg"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dimensions">Dimensi</Label>
                                        <Input
                                            id="dimensions"
                                            value={formData.dimensions}
                                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                            placeholder="P x L x T (cm)"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Harga & Stok</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga (Rp) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="Masukkan harga"
                                        disabled={isSubmitting}
                                    />
                                    {formData.price && (
                                        <p className="text-sm text-muted-foreground">
                                            Rp {parseInt(formData.price || "0").toLocaleString("id-ID")}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="Jumlah stok"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Tersedia">Tersedia</SelectItem>
                                        <SelectItem value="Habis">Habis</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="mt-3">
                                    <Badge variant={formData.status === "Tersedia" ? "default" : "destructive"}>
                                        {formData.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                                <Save className="w-4 h-4" />
                                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                            <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/admin/products")} disabled={isSubmitting}>
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductEdit;
