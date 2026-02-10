import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, Package, Calendar, Tag, Weight,
    Ruler, Hash, Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import api from "@/lib/api";

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}/`);
                const data = response.data;
                const mappedProduct: Product = {
                    id: data.id,
                    name: data.name,
                    category: data.category,
                    price: data.price,
                    stock: data.stock_quantity,
                    status: data.in_stock ? "Tersedia" : "Habis",
                    description: data.description || "",
                    sku: data.sku,
                    weight: data.weight,
                    dimensions: data.dimensions,
                    image: data.image,
                    createdAt: new Date(data.created_at).toLocaleDateString("id-ID"),
                    updatedAt: new Date(data.updated_at).toLocaleDateString("id-ID"),
                };
                setProduct(mappedProduct);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Gagal memuat detail produk");
                navigate("/admin/products");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/products/${id}/`);
            toast.success("Produk berhasil dihapus");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Gagal menghapus produk");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatPrice = (price: string) => `Rp ${parseInt(price).toLocaleString("id-ID")}`;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const details = [
        { icon: Hash, label: "SKU", value: product.sku || "-" },
        { icon: Tag, label: "Kategori", value: product.category },
        { icon: Box, label: "Stok", value: `${product.stock} unit` },
        { icon: Weight, label: "Berat", value: product.weight || "-" },
        { icon: Ruler, label: "Dimensi", value: product.dimensions || "-" },
        { icon: Calendar, label: "Ditambahkan", value: product.createdAt },
        { icon: Calendar, label: "Terakhir diperbarui", value: product.updatedAt },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={product.status === "Tersedia" ? "default" : "destructive"}>
                                {product.status}
                            </Badge>
                            <Badge variant="secondary">{product.category}</Badge>
                            {product.sku && (
                                <span className="text-sm text-muted-foreground font-mono">{product.sku}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate(`/admin/products/${id}/edit`)}
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Hapus
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus produk "{product.name}"?
                                    Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Menghapus..." : "Hapus"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Image */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="h-72 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="w-20 h-20 text-muted-foreground/20" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Deskripsi Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Harga</p>
                            <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Detail Produk</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {details.map((detail, index) => (
                                <div key={detail.label}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-muted/50">
                                            <detail.icon className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">{detail.label}</p>
                                            <p className="text-sm font-medium">{detail.value}</p>
                                        </div>
                                    </div>
                                    {index < details.length - 1 && <Separator className="mt-3" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
