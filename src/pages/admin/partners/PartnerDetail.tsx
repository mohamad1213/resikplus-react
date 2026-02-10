import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, Edit, Trash2, Building2, MapPin, Phone, Mail,
    User, Calendar, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import { Partner, initialPartners } from "@/lib/partners-data"; // initialPartners kept for fallback if needed, but likely removed usage
import api from "@/lib/api";
import { toast } from "sonner";

const PartnerDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const response = await api.get(`/partners/${id}/`);
                const data = response.data;
                const mappedPartner: Partner = {
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    location: data.location,
                    status: data.status,
                    phone: data.phone || "-",
                    email: data.email || "-",
                    address: data.address || "-",
                    contactPerson: data.contact_person || "-",
                    description: data.description || "",
                    joinDate: data.join_date || data.created_at,
                };
                setPartner(mappedPartner);
            } catch (error) {
                console.error("Error fetching partner:", error);
                toast.error("Gagal memuat detail mitra");
                navigate("/admin/partners");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchPartner();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!partner) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Building2 className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-semibold">Mitra tidak ditemukan</h2>
                <p className="text-muted-foreground mt-1">Data mitra yang Anda cari tidak tersedia</p>
                <Button className="mt-4" onClick={() => navigate("/admin/partners")}>Kembali ke Daftar</Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Aktif":
                return (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 gap-1 text-sm px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                    </Badge>
                );
            case "Pending":
                return (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 gap-1 text-sm px-3 py-1">
                        <Clock className="h-3.5 w-3.5" /> Pending
                    </Badge>
                );
            case "Nonaktif":
                return (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 gap-1 text-sm px-3 py-1">
                        <XCircle className="h-3.5 w-3.5" /> Nonaktif
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const infoItems = [
        { icon: Building2, label: "Tipe Mitra", value: partner.type },
        { icon: MapPin, label: "Lokasi", value: partner.location },
        { icon: User, label: "Penanggung Jawab", value: partner.contactPerson },
        { icon: Phone, label: "Telepon", value: partner.phone },
        { icon: Mail, label: "Email", value: partner.email },
        {
            icon: Calendar,
            label: "Tanggal Bergabung",
            value: new Date(partner.joinDate).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
            }),
        },
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/partners")} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{partner.name}</h1>
                            {getStatusBadge(partner.status)}
                        </div>
                        <p className="text-muted-foreground mt-1">{partner.type} • {partner.location}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => navigate(`/admin/partners/${partner.id}/edit`)}>
                        <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" /> Hapus
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Tentang Mitra</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {partner.description || "Belum ada deskripsi untuk mitra ini."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Alamat Lengkap
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{partner.address || "Belum ada alamat lengkap."}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Informasi Detail</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0">
                            {infoItems.map((item, idx) => (
                                <div key={item.label}>
                                    <div className="flex items-start gap-3 py-3">
                                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                            <item.icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                                            <p className="font-medium mt-0.5">{item.value || "-"}</p>
                                        </div>
                                    </div>
                                    {idx < infoItems.length - 1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetail;
