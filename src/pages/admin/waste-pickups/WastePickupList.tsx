import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Truck, Weight, CheckCircle2, Clock, XCircle, TrendingUp, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pickupStatuses, wasteTypes, type WastePickup } from "@/lib/waste-pickup-data";
import { getWastePickups, deleteWastePickup } from "@/lib/waste-pickup-api";
import { useToast } from "@/hooks/use-toast";

const WastePickupList = () => {
    const [pickups, setPickups] = useState<WastePickup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getWastePickups();
            setPickups(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Gagal mengambil data angkutan", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return pickups.filter((p) => {
            const matchSearch =
                p.customerName.toLowerCase().includes(search.toLowerCase()) ||
                p.partnerName.toLowerCase().includes(search.toLowerCase()) ||
                p.address.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "all" || p.status === statusFilter;
            const matchType = typeFilter === "all" || p.wasteType === typeFilter;
            return matchSearch && matchStatus && matchType;
        });
    }, [pickups, search, statusFilter, typeFilter]);

    const stats = useMemo(() => {
        const total = pickups.length;
        const completed = pickups.filter((p) => p.status === "completed").length;
        const inProgress = pickups.filter((p) => p.status === "in_progress" || p.status === "confirmed").length;
        const pending = pickups.filter((p) => p.status === "pending").length;
        const totalWeight = pickups
            .filter((p) => p.status === "completed")
            .reduce((sum, p) => sum + (p.actualWeight || 0), 0);
        const totalRevenue = pickups
            .filter((p) => p.status === "completed")
            .reduce((sum, p) => sum + p.price, 0);
        return { total, completed, inProgress, pending, totalWeight, totalRevenue };
    }, [pickups]);

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
        try {
            await deleteWastePickup(id);
            setPickups((prev) => prev.filter((p) => p.id !== id));
            toast({ title: "Berhasil", description: "Data angkutan berhasil dihapus." });
        } catch (error) {
            toast({ title: "Error", description: "Gagal menghapus data", variant: "destructive" });
        }
    };

    const getStatusBadge = (status: string) => {
        const s = pickupStatuses.find((ps) => ps.value === status);
        if (!s) return <Badge variant="secondary">{status}</Badge>;
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
    };

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

    return (
        <div className="space-y-6">
            {/* Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Truck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Angkutan</p>
                                <p className="text-xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Selesai</p>
                                <p className="text-xl font-bold">{stats.completed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Clock className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Dalam Proses</p>
                                <p className="text-xl font-bold">{stats.inProgress}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <XCircle className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Menunggu</p>
                                <p className="text-xl font-bold">{stats.pending}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/10">
                                <Weight className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Sampah</p>
                                <p className="text-xl font-bold">{stats.totalWeight} kg</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Pendapatan</p>
                                <p className="text-lg font-bold">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama, mitra, alamat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            {pickupStatuses.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Jenis Sampah" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            {wasteTypes.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button asChild>
                    <Link to="/admin/waste-pickups/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Angkutan
                    </Link>
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Mitra</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead className="text-right">Berat (kg)</TableHead>
                                <TableHead>Jadwal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Harga</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                        Tidak ada data angkutan ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{p.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{p.customerPhone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{p.partnerName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{p.wasteType}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {p.actualWeight ?? p.estimatedWeight}
                                            {!p.actualWeight && <span className="text-xs text-muted-foreground ml-1">(est)</span>}
                                        </TableCell>
                                        <TableCell className="text-sm">{p.scheduledDate}</TableCell>
                                        <TableCell>{getStatusBadge(p.status)}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(p.price)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={`/admin/waste-pickups/${p.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={`/admin/waste-pickups/${p.id}/edit`}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default WastePickupList;
