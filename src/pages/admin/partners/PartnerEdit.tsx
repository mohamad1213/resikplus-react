import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Building2, MapPin, Phone, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { partnerTypes, partnerStatuses } from "@/lib/partners-data";
import api from "@/lib/api";

const PartnerEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        type: "Pengumpul",
        location: "",
        status: "Aktif",
        phone: "",
        email: "",
        address: "",
        contactPerson: "",
        description: "",
    });

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const response = await api.get(`/partners/${id}/`);
                const data = response.data;
                setFormData({
                    name: data.name,
                    type: data.type,
                    location: data.location,
                    status: data.status,
                    phone: data.phone || "",
                    email: data.email || "",
                    address: data.address || "",
                    contactPerson: data.contact_person || "",
                    description: data.description || "",
                });
            } catch (error) {
                console.error("Error fetching partner:", error);
                toast.error("Gagal memuat data mitra");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.location.trim()) {
            toast.error("Nama mitra dan lokasi wajib diisi");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                location: formData.location,
                status: formData.status,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                contact_person: formData.contactPerson,
                description: formData.description
            };

            await api.patch(`/partners/${id}/`, payload);
            toast.success("Mitra berhasil diperbarui");
            navigate("/admin/partners");
        } catch (error) {
            console.error("Error updating partner:", error);
            toast.error("Gagal memperbarui mitra");
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/partners")} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Mitra</h1>
                    <p className="text-muted-foreground mt-1">Perbarui informasi {formData.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Informasi Dasar
                                </CardTitle>
                                <CardDescription>Data utama identitas mitra</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Mitra <span className="text-destructive">*</span></Label>
                                    <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="h-11" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tipe Mitra</Label>
                                        <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                                            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {partnerTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                                            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {partnerStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Deskripsi</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        placeholder="Deskripsi mitra..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Lokasi & Alamat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Kota / Kabupaten <span className="text-destructive">*</span></Label>
                                    <Input value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Alamat Lengkap</Label>
                                    <Textarea value={formData.address} onChange={(e) => updateField("address", e.target.value)} rows={3} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Kontak</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input value={formData.contactPerson} onChange={(e) => updateField("contactPerson", e.target.value)} className="pl-9 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Telepon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="pl-9 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="pl-9 h-11" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 space-y-3">
                                <Button type="submit" className="w-full gap-2 h-11">
                                    <Save className="h-4 w-4" />
                                    Simpan Perubahan
                                </Button>
                                <Button type="button" variant="outline" className="w-full h-11" onClick={() => navigate("/admin/partners")}>
                                    Batal
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PartnerEdit;
