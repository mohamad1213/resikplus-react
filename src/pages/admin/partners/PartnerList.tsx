import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Building2,
    CheckCircle2, Clock, XCircle, Users, ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Partner, partnerTypes } from "@/lib/partners-data";
import api from "@/lib/api";

const PartnerList = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletePartner, setDeletePartner] = useState<Partner | null>(null);

    const filteredPartners = partners.filter((partner) => {
        const name = partner.name || "";
        const location = partner.location || "";
        const contactPerson = partner.contactPerson || "";

        const matchSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "all" || partner.type === filterType;
        const matchStatus = filterStatus === "all" || partner.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    const activeCount = partners.filter((p) => p.status === "Aktif").length;
    const pendingCount = partners.filter((p) => p.status === "Pending").length;
    const inactiveCount = partners.filter((p) => p.status === "Nonaktif").length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Aktif":
                return (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Aktif
                    </Badge>
                );
            case "Pending":
                return (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 gap-1">
                        <Clock className="h-3 w-3" /> Pending
                    </Badge>
                );
            case "Nonaktif":
                return (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 gap-1">
                        <XCircle className="h-3 w-3" /> Nonaktif
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const fetchPartners = async () => {
        try {
            const response = await api.get("/partners/");
            const data = response.data.results || response.data;
            if (!Array.isArray(data)) {
                console.error("Data returned is not an array:", data);
                setPartners([]);
                return;
            }

            // Map backend snake_case to frontend camelCase
            const mappedPartners = data.map((p: any) => ({
                id: p.id,
                name: p.name || "",
                type: p.type || "Pengumpul",
                location: p.location || "",
                status: p.status || "Pending",
                phone: p.phone || "",
                email: p.email || "",
                address: p.address || "",
                contactPerson: p.contact_person || "",
                description: p.description || "",
                joinDate: p.join_date || p.created_at || new Date().toISOString(), // Fallback if join_date is empty
            }));
            setPartners(mappedPartners);
        } catch (error) {
            console.error("Error fetching partners:", error);
            toast.error("Gagal memuat data mitra");
        }
    };

    useEffect(() => {
        console.log("PartnerList mounted, fetching partners...");
        fetchPartners();
    }, []);

    const handleDelete = (partner: Partner) => {
        setDeletePartner(partner);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deletePartner) {
            try {
                await api.delete(`/partners/${deletePartner.id}/`);
                setPartners(partners.filter((p) => p.id !== deletePartner.id));
                toast.success("Mitra berhasil dihapus");
            } catch (error) {
                console.error("Error deleting partner:", error);
                toast.error("Gagal menghapus mitra");
            }
        }
        setIsDeleteOpen(false);
        setDeletePartner(null);
    };

    const infoCards = [
        {
            title: "Total Mitra",
            value: partners.length,
            subtitle: "Semua mitra terdaftar",
            icon: Building2,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Mitra Aktif",
            value: activeCount,
            subtitle: partners.length > 0 ? `${((activeCount / partners.length) * 100).toFixed(0)}% dari total` : "0% dari total",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            title: "Menunggu Verifikasi",
            value: pendingCount,
            subtitle: "Perlu ditinjau",
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            title: "Nonaktif",
            value: inactiveCount,
            subtitle: "Perlu ditindaklanjuti",
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50 dark:bg-red-900/20",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Mitra</h1>
                    <p className="text-muted-foreground mt-1">Kelola semua mitra dan rekanan bisnis Anda</p>
                </div>
                <Button className="gap-2 shadow-sm" onClick={() => navigate("/admin/partners/create")}>
                    <Plus className="h-4 w-4" />
                    Tambah Mitra
                </Button>
            </div>

            {/* Info Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {infoCards.map((card) => (
                    <Card key={card.title} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                                    <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters & Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <CardTitle className="text-lg">Daftar Mitra</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, lokasi, kontak..."
                                    className="pl-9 w-full sm:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    {partnerTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="Aktif">Aktif</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredPartners.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                            <p className="text-muted-foreground font-medium">Tidak ada mitra ditemukan</p>
                            <p className="text-sm text-muted-foreground mt-1">Coba ubah filter atau kata kunci pencarian</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">Mitra</TableHead>
                                        <TableHead className="font-semibold">Tipe</TableHead>
                                        <TableHead className="font-semibold">Lokasi</TableHead>
                                        <TableHead className="font-semibold">Kontak</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Bergabung</TableHead>
                                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPartners.map((partner) => (
                                        <TableRow
                                            key={partner.id}
                                            className="cursor-pointer group"
                                            onClick={() => navigate(`/admin/partners/${partner.id}`)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <Building2 className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium group-hover:text-primary transition-colors">{partner.name}</p>
                                                        <p className="text-xs text-muted-foreground">{partner.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal">{partner.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{partner.location}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm">{partner.contactPerson}</p>
                                                    <p className="text-xs text-muted-foreground">{partner.phone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(partner.status)}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(partner.joinDate).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-popover">
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/partners/${partner.id}`)}>
                                                            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/partners/${partner.id}/edit`)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(partner)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mitra</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus mitra "{deletePartner?.name}"?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PartnerList;
