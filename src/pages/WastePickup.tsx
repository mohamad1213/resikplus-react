import { useState, useMemo } from "react";
import { Truck, Recycle, MapPin, Phone, CheckCircle, Clock, Package, ArrowRight, Send, Weight, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { wasteTypes, pickupStatuses, type WastePickup } from "@/lib/waste-pickup-data";
import { getWastePickup, createWastePickup } from "@/lib/waste-pickup-api";
import { initialPartners } from "@/lib/partners-data"; // Currently static, can be API later
import { useToast } from "@/hooks/use-toast";

const WastePickup = () => {
    const { toast } = useToast();
    const [trackingId, setTrackingId] = useState("");
    const [trackedPickup, setTrackedPickup] = useState<WastePickup | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        address: "",
        wasteType: "",
        estimatedWeight: "",
        notes: "",
    });

    // Stats are currently hardcoded because we don't have an aggregation API yet.
    // In a real app, we would fetch these from an API endpoint.
    const stats = useMemo(() => {
        return { totalWeight: 1250, totalPickups: 45, partners: 12 };
    }, []);

    const activePartners = initialPartners.filter((p) => p.status === "Aktif");

    const handleTrack = async () => {
        if (!trackingId) return;
        try {
            setLoading(true);
            const data = await getWastePickup(Number(trackingId));
            setTrackedPickup(data);
        } catch (error) {
            toast({ title: "Tidak ditemukan", description: "ID angkutan tidak ditemukan. Pastikan ID yang dimasukkan benar.", variant: "destructive" });
            setTrackedPickup(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createWastePickup({
                ...form,
                estimatedWeight: Number(form.estimatedWeight),
                status: "pending",
                partnerId: null, // Let admin assign
                price: 0, // TBD
            } as any);
            toast({ title: "Permintaan Terkirim! 🎉", description: "Tim kami akan segera menghubungi Anda untuk konfirmasi jadwal penjemputan." });
            setForm({ customerName: "", customerPhone: "", customerEmail: "", address: "", wasteType: "", estimatedWeight: "", notes: "" });
            setShowForm(false);
        } catch (error) {
            console.error(error);
            toast({ title: "Gagal Mengirim", description: "Terjadi kesalahan saat mengirim permintaan.", variant: "destructive" });
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const getStatusInfo = (status: string) => pickupStatuses.find((s) => s.value === status);

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
                <div className="relative container-wide section-padding !py-0">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in-up">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
                                <Truck className="w-4 h-4 mr-2" />
                                Jasa Angkut Sampah
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Angkut Sampah Anda{" "}
                                <span className="text-gradient">Mudah & Terpercaya</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                Layanan penjemputan sampah profesional yang terafiliasi dengan mitra terpercaya. Lacak setiap kilogram sampah yang diangkut untuk masa depan yang lebih bersih.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" onClick={() => setShowForm(true)}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Ajukan Penjemputan
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" })}>
                                    Lacak Angkutan
                                </Button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4 animate-fade-in animation-delay-200">
                            <Card className="bg-card/80 backdrop-blur border-primary/10">
                                <CardContent className="p-5 text-center">
                                    <Weight className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <p className="text-3xl font-bold">{stats.totalWeight}</p>
                                    <p className="text-sm text-muted-foreground">kg Sampah Terangkut</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/80 backdrop-blur border-primary/10">
                                <CardContent className="p-5 text-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-3xl font-bold">{stats.totalPickups}</p>
                                    <p className="text-sm text-muted-foreground">Angkutan Selesai</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/80 backdrop-blur border-primary/10">
                                <CardContent className="p-5 text-center">
                                    <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                                    <p className="text-3xl font-bold">{stats.partners}</p>
                                    <p className="text-sm text-muted-foreground">Mitra Terpercaya</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/80 backdrop-blur border-primary/10">
                                <CardContent className="p-5 text-center">
                                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                    <p className="text-3xl font-bold">4.8</p>
                                    <p className="text-sm text-muted-foreground">Rating Layanan</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="section-padding bg-muted/30">
                <div className="container-wide">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3">Cara Kerja Layanan</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Proses sederhana dalam 4 langkah untuk mengangkut sampah Anda</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: Send, title: "Ajukan Permintaan", desc: "Isi formulir permintaan dengan detail sampah dan alamat penjemputan" },
                            { icon: CheckCircle, title: "Konfirmasi", desc: "Tim kami akan menghubungi Anda untuk mengonfirmasi jadwal penjemputan" },
                            { icon: Truck, title: "Penjemputan", desc: "Mitra kami datang ke lokasi Anda untuk mengangkut sampah" },
                            { icon: Recycle, title: "Proses Daur Ulang", desc: "Sampah diolah secara bertanggung jawab oleh mitra terafiliasi" },
                        ].map((step, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                                    <step.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                                    {i + 1}
                                </div>
                                <h3 className="font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tracking Section */}
            <section id="tracking" className="section-padding">
                <div className="container-wide max-w-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-3">Lacak Angkutan</h2>
                        <p className="text-muted-foreground">Masukkan ID angkutan untuk melihat status penjemputan</p>
                    </div>
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Masukkan ID angkutan (contoh: 1)"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handleTrack}>Lacak</Button>
                            </div>
                            {trackedPickup && (
                                <div className="bg-muted/50 rounded-xl p-5 space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">Angkutan #{trackedPickup.id}</h3>
                                        {(() => {
                                            const si = getStatusInfo(trackedPickup.status);
                                            return si ? <span className={`px-3 py-1 rounded-full text-xs font-medium ${si.color}`}>{si.label}</span> : null;
                                        })()}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Pelanggan</p>
                                            <p className="font-medium">{trackedPickup.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Mitra</p>
                                            <p className="font-medium">{trackedPickup.partnerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Jenis Sampah</p>
                                            <Badge variant="outline">{trackedPickup.wasteType}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Berat</p>
                                            <p className="font-medium">{trackedPickup.actualWeight ?? trackedPickup.estimatedWeight} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Jadwal</p>
                                            <p className="font-medium">{trackedPickup.scheduledDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Harga</p>
                                            <p className="font-medium text-primary">{formatCurrency(trackedPickup.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Partners */}
            <section className="section-padding bg-muted/30">
                <div className="container-wide">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-3">Mitra Terafiliasi</h2>
                        <p className="text-muted-foreground">Kami bekerja sama dengan mitra terpercaya untuk memastikan sampah Anda ditangani dengan baik</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activePartners.map((partner) => (
                            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Truck className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{partner.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {partner.location}
                                            </div>
                                            <Badge variant="secondary" className="mt-2 text-xs">{partner.type}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Request Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-primary" />
                                Ajukan Penjemputan Sampah
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Lengkap *</Label>
                                        <Input id="name" value={form.customerName} onChange={(e) => handleChange("customerName", e.target.value)} required placeholder="Nama Anda" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">No. Telepon *</Label>
                                        <Input id="phone" value={form.customerPhone} onChange={(e) => handleChange("customerPhone", e.target.value)} required placeholder="08xxxxxxxxxx" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={form.customerEmail} onChange={(e) => handleChange("customerEmail", e.target.value)} placeholder="email@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addr">Alamat Penjemputan *</Label>
                                    <Textarea id="addr" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required placeholder="Alamat lengkap..." rows={3} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Jenis Sampah *</Label>
                                        <Select value={form.wasteType} onValueChange={(v) => handleChange("wasteType", v)}>
                                            <SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
                                            <SelectContent>
                                                {wasteTypes.map((t) => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Estimasi Berat (kg) *</Label>
                                        <Input id="weight" type="number" min="1" value={form.estimatedWeight} onChange={(e) => handleChange("estimatedWeight", e.target.value)} required placeholder="0" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="note">Catatan Tambahan</Label>
                                    <Textarea id="note" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Info tambahan..." rows={2} />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" className="flex-1">
                                        <Send className="w-4 h-4 mr-2" />
                                        Kirim Permintaan
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* CTA */}
            <section className="section-padding">
                <div className="container-wide">
                    <Card className="overflow-hidden">
                        <div className="relative p-8 md:p-12 text-center" style={{ background: "var(--gradient-primary)" }}>
                            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Siap Untuk Mengangkut Sampah Anda?</h2>
                            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
                                Hubungi kami sekarang atau ajukan permintaan penjemputan. Tim kami siap membantu!
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button size="lg" variant="secondary" onClick={() => setShowForm(true)}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Ajukan Penjemputan
                                </Button>
                                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </Layout>
    );
};

export default WastePickup;
