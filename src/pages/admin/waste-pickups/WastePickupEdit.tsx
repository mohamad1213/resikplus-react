import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Truck, User, MapPin, Package, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateWastePickup, getWastePickup } from "@/lib/waste-pickup-api";
import { getPartners, type Partner } from "@/lib/partners-api";
import { wasteTypes, pickupStatuses, type WastePickup } from "@/lib/waste-pickup-data";
import { useToast } from "@/hooks/use-toast";

const WastePickupEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [pickup, setPickup] = useState<WastePickup | null>(null);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        address: "",
        wasteType: "",
        estimatedWeight: "",
        actualWeight: "",
        partnerId: "",
        scheduledDate: "",
        completedDate: "",
        status: "",
        price: "",
        notes: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Partners
                const partnersData = await getPartners();
                const partnersList = Array.isArray(partnersData) ? partnersData : (partnersData as any).results || [];
                setPartners(partnersList);

                // Fetch Pickup
                if (id) {
                    const data = await getWastePickup(Number(id));
                    setPickup(data);
                    setForm({
                        customerName: data.customerName,
                        customerPhone: data.customerPhone,
                        customerEmail: data.customerEmail || "",
                        address: data.address,
                        wasteType: data.wasteType,
                        estimatedWeight: String(data.estimatedWeight),
                        actualWeight: data.actualWeight != null ? String(data.actualWeight) : "",
                        partnerId: String(data.partnerId),
                        scheduledDate: data.scheduledDate || "",
                        completedDate: data.completedDate || "",
                        status: data.status,
                        price: String(data.price),
                        notes: data.notes || "",
                    });
                }
            } catch (error) {
                console.error(error);
                toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const activePartners = partners.filter((p) => p.status === "Aktif");

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    if (!pickup) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Data angkutan tidak ditemukan.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/waste-pickups")}>Kembali</Button>
            </div>
        );
    }

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateWastePickup(Number(id), {
                ...form,
                estimatedWeight: Number(form.estimatedWeight),
                actualWeight: form.actualWeight ? Number(form.actualWeight) : null,
                partnerId: Number(form.partnerId),
                price: Number(form.price),
            } as any);
            toast({ title: "Berhasil", description: "Data angkutan berhasil diperbarui." });
            navigate("/admin/waste-pickups");
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Gagal memperbarui data", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/waste-pickups")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Angkutan</h1>
                    <p className="text-sm text-muted-foreground">Perbarui data angkutan #{pickup.id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="w-5 h-5 text-primary" />
                                Informasi Pelanggan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customerName">Nama Pelanggan *</Label>
                                    <Input id="customerName" value={form.customerName} onChange={(e) => handleChange("customerName", e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customerPhone">No. Telepon *</Label>
                                    <Input id="customerPhone" value={form.customerPhone} onChange={(e) => handleChange("customerPhone", e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerEmail">Email</Label>
                                <Input id="customerEmail" type="email" value={form.customerEmail} onChange={(e) => handleChange("customerEmail", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Waste */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                                Detail Lokasi & Sampah
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat Penjemputan *</Label>
                                <Textarea id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required rows={3} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Jenis Sampah *</Label>
                                    <Select value={form.wasteType} onValueChange={(v) => handleChange("wasteType", v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {wasteTypes.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedWeight">Estimasi Berat (kg)</Label>
                                    <Input id="estimatedWeight" type="number" min="0" value={form.estimatedWeight} onChange={(e) => handleChange("estimatedWeight", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="actualWeight">Berat Aktual (kg)</Label>
                                    <Input id="actualWeight" type="number" min="0" value={form.actualWeight} onChange={(e) => handleChange("actualWeight", e.target.value)} placeholder="Isi setelah selesai" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan</Label>
                                <Textarea id="notes" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={2} />
                            </div>
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
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status Angkutan</Label>
                                <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {pickupStatuses.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Partner & Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="w-5 h-5 text-primary" />
                                Mitra & Jadwal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Mitra Pengangkut *</Label>
                                <Select value={form.partnerId} onValueChange={(v) => handleChange("partnerId", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {activePartners.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Tanggal Penjemputan</Label>
                                <Input id="scheduledDate" type="date" value={form.scheduledDate} onChange={(e) => handleChange("scheduledDate", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="completedDate">Tanggal Selesai</Label>
                                <Input id="completedDate" type="date" value={form.completedDate} onChange={(e) => handleChange("completedDate", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <DollarSign className="w-5 h-5 text-primary" />
                                Harga
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Rp)</Label>
                                <Input id="price" type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Perubahan
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/admin/waste-pickups")}>
                            Batal
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default WastePickupEdit;
