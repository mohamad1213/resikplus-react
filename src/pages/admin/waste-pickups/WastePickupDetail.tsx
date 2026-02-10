import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, User, MapPin, Truck, Package, DollarSign, Calendar, Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { pickupStatuses, type WastePickup } from "@/lib/waste-pickup-data";
import { getWastePickup } from "@/lib/waste-pickup-api";
import { useToast } from "@/hooks/use-toast";

const WastePickupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [pickup, setPickup] = useState<WastePickup | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getWastePickup(Number(id))
                .then(setPickup)
                .catch(() => toast({ title: "Error", description: "Gagal memuat detail angkutan.", variant: "destructive" }))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    if (!pickup) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Data angkutan tidak ditemukan.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/waste-pickups")}>Kembali</Button>
            </div>
        );
    }

    const statusInfo = pickupStatuses.find((s) => s.value === pickup.status);
    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/waste-pickups")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Detail Angkutan #{pickup.id}</h1>
                        <p className="text-sm text-muted-foreground">Dibuat pada {pickup.createdAt}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link to={`/admin/waste-pickups/${pickup.id}/edit`}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="w-5 h-5 text-primary" />
                                Informasi Pelanggan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Nama</p>
                                    <p className="font-medium">{pickup.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Telepon</p>
                                    <p className="font-medium">{pickup.customerPhone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium">{pickup.customerEmail}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Waste */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                                Lokasi & Detail Sampah
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Alamat Penjemputan</p>
                                <p className="font-medium">{pickup.address}</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Jenis Sampah</p>
                                    <Badge variant="outline" className="mt-1">{pickup.wasteType}</Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Estimasi Berat</p>
                                    <p className="font-medium">{pickup.estimatedWeight} kg</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Berat Aktual</p>
                                    <p className="font-medium">{pickup.actualWeight != null ? `${pickup.actualWeight} kg` : "Belum ditimbang"}</p>
                                </div>
                            </div>
                            {pickup.notes && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Catatan</p>
                                        <p className="text-sm bg-muted/50 rounded-lg p-3">{pickup.notes}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="w-5 h-5 text-primary" />
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {statusInfo && (
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                </span>
                            )}
                        </CardContent>
                    </Card>

                    {/* Partner */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="w-5 h-5 text-primary" />
                                Mitra Pengangkut
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{pickup.partnerName}</p>
                            <p className="text-xs text-muted-foreground mt-1">ID Mitra: {pickup.partnerId}</p>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="w-5 h-5 text-primary" />
                                Jadwal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Tanggal Penjemputan</p>
                                <p className="font-medium">{pickup.scheduledDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Tanggal Selesai</p>
                                <p className="font-medium">{pickup.completedDate || "Belum selesai"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <DollarSign className="w-5 h-5 text-primary" />
                                Harga
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(pickup.price)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WastePickupDetail;
