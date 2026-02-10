import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Plus, Package, TrendingUp, AlertTriangle, BarChart3,
    MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/api";
import { type Product } from "@/lib/products-data";

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/products/");
            const data = Array.isArray(response.data) ? response.data : (response.data.results || []);

            const mappedProducts: Product[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                stock: item.stock_quantity,
                status: item.in_stock ? "Tersedia" : "Habis",
                description: item.description || "",
                sku: item.sku,
                weight: item.weight,
                dimensions: item.dimensions,
                image: item.image,
                createdAt: new Date(item.created_at).toLocaleDateString("id-ID"),
                updatedAt: new Date(item.updated_at).toLocaleDateString("id-ID"),
            }));
            setProducts(mappedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Gagal memuat produk");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const totalProducts = products.length;
    const availableProducts = products.filter((p) => p.status === "Tersedia").length;
    const outOfStock = products.filter((p) => p.status === "Habis").length;
    const totalValue = products.reduce((sum, p) => sum + parseInt(p.price) * p.stock, 0);

    const formatPrice = (price: string) => `Rp ${parseInt(price).toLocaleString("id-ID")}`;

    const handleDelete = (product: Product) => {
        setDeleteProduct(product);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteProduct) {
            try {
                await api.delete(`/products/${deleteProduct.id}/`);
                setProducts(products.filter((p) => p.id !== deleteProduct.id));
                toast.success("Produk berhasil dihapus");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Gagal menghapus produk");
            }
        }
        setIsDeleteOpen(false);
        setDeleteProduct(null);
    };

    const stats = [
        {
            label: "Total Produk",
            value: totalProducts,
            icon: Package,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            label: "Tersedia",
            value: availableProducts,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Stok Habis",
            value: outOfStock,
            icon: AlertTriangle,
            color: "text-destructive",
            bg: "bg-destructive/10",
        },
        {
            label: "Nilai Inventaris",
            value: `Rp ${totalValue.toLocaleString("id-ID")}`,
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari produk..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            <SelectItem value="Mesin">Mesin</SelectItem>
                            <SelectItem value="Alat">Alat</SelectItem>
                            <SelectItem value="Produk">Produk</SelectItem>
                            <SelectItem value="Bahan Baku">Bahan Baku</SelectItem>
                            <SelectItem value="Aksesoris">Aksesoris</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="Tersedia">Tersedia</SelectItem>
                            <SelectItem value="Habis">Habis</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex border rounded-lg overflow-hidden">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-none"
                        >
                            Grid
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className="rounded-none"
                        >
                            Tabel
                        </Button>
                    </div>
                    <Button className="gap-2" onClick={() => navigate("/admin/products/create")}>
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                    </Button>
                </div>
            </div>

            {/* Products Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50"
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                        >
                            <CardContent className="p-0">
                                {/* Product Image Placeholder */}
                                <div className="h-40 bg-muted/30 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-12 h-12 text-muted-foreground/30" />
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={product.status === "Tersedia" ? "default" : "destructive"}>
                                            {product.status}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary">{product.category}</Badge>
                                    </div>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                                    </div>
                                    {product.sku && (
                                        <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                                        <span className="text-sm text-muted-foreground">Stok: {product.stock}</span>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/products/${product.id}`);
                                            }}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Detail
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/products/${product.id}/edit`);
                                            }}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1 text-destructive hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(product);
                                            }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Products Table View */}
            {viewMode === "table" && (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">
                                        <div className="flex items-center gap-1">
                                            Produk <ArrowUpDown className="w-3.5 h-3.5" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/admin/products/${product.id}`)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-muted-foreground/50" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.status === "Tersedia" ? "default" : "destructive"}>
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{product.sku || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-popover">
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/products/${product.id}`);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/products/${product.id}/edit`);
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(product);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-1">
                        {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery
                            ? "Coba ubah filter atau kata kunci pencarian"
                            : "Mulai dengan menambahkan produk baru"}
                    </p>
                    <Button onClick={() => navigate("/admin/products/create")} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                    </Button>
                </div>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus produk "{deleteProduct?.name}"?
                            Tindakan ini tidak dapat dibatalkan.
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

export default ProductList;
