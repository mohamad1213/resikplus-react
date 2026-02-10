import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Truck, User, MapPin, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { wasteTypes } from "@/lib/waste-pickup-data";
import { createWastePickup } from "@/lib/waste-pickup-api";
import { getPartners, type Partner } from "@/lib/partners-api";
import { useToast } from "@/hooks/use-toast";

const WastePickupCreate = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [form, setForm] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        address: "",
        wasteType: "",
        estimatedWeight: "",
        partnerId: "",
        scheduledDate: "",
        price: "",
        notes: "",
    });

    const [partners, setPartners] = useState<Partner[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const data = await getPartners();
                // Handle response format if backend uses pagination
                const list = Array.isArray(data) ? data : (data as any).results || [];
                setPartners(list);
            } catch (error) {
                console.error("Failed to fetch partners:", error);
                toast({ title: "Error", description: "Gagal memuat data mitra", variant: "destructive" });
            }
        };
        fetchPartners();
    }, []);

    const activePartners = partners.filter((p) => p.status === "Aktif");

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createWastePickup({
                ...form,
                estimatedWeight: Number(form.estimatedWeight),
                partnerId: Number(form.partnerId),
                price: Number(form.price),
                actualWeight: null, // Default
                status: "pending", // Default
            } as any);
            toast({ title: "Berhasil", description: "Data angkutan baru berhasil ditambahkan." });
            navigate("/admin/waste-pickups");
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Gagal menambahkan data", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/waste-pickups")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Tambah Angkutan Baru</h1>
                    <p className="text-sm text-muted-foreground">Buat pesanan jasa angkut sampah baru</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
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
                                    <Input id="customerName" value={form.customerName} onChange={(e) => handleChange("customerName", e.target.value)} required placeholder="Nama lengkap" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customerPhone">No. Telepon *</Label>
                                    <Input id="customerPhone" value={form.customerPhone} onChange={(e) => handleChange("customerPhone", e.target.value)} required placeholder="08xxxxxxxxxx" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerEmail">Email</Label>
                                <Input id="customerEmail" type="email" value={form.customerEmail} onChange={(e) => handleChange("customerEmail", e.target.value)} placeholder="email@example.com" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pickup Info */}
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
                                <Textarea id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required placeholder="Masukkan alamat lengkap..." rows={3} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="wasteType">Jenis Sampah *</Label>
                                    <Select value={form.wasteType} onValueChange={(v) => handleChange("wasteType", v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih jenis sampah" /></SelectTrigger>
                                        <SelectContent>
                                            {wasteTypes.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedWeight">Estimasi Berat (kg) *</Label>
                                    <Input id="estimatedWeight" type="number" min="1" value={form.estimatedWeight} onChange={(e) => handleChange("estimatedWeight", e.target.value)} required placeholder="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Catatan Tambahan</Label>
                                <Textarea id="notes" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Informasi tambahan mengenai sampah..." rows={2} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
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
                                <Label htmlFor="partnerId">Mitra Pengangkut *</Label>
                                <Select value={form.partnerId} onValueChange={(v) => handleChange("partnerId", v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih mitra" /></SelectTrigger>
                                    <SelectContent>
                                        {activePartners.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Tanggal Penjemputan *</Label>
                                <Input id="scheduledDate" type="date" value={form.scheduledDate} onChange={(e) => handleChange("scheduledDate", e.target.value)} required />
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
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Rp) *</Label>
                                <Input id="price" type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)} required placeholder="0" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Angkutan
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

export default WastePickupCreate;
