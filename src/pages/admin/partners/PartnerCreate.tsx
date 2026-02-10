import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const PartnerCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        type: "Pengumpul",
        location: "",
        status: "Pending",
        phone: "",
        email: "",
        address: "",
        contactPerson: "",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.location.trim()) {
            toast.error("Nama mitra dan lokasi wajib diisi");
            return;
        }
        toast.success("Mitra berhasil ditambahkan");
        navigate("/admin/partners");
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
                    <h1 className="text-2xl font-bold tracking-tight">Tambah Mitra Baru</h1>
                    <p className="text-muted-foreground mt-1">Lengkapi informasi mitra untuk mendaftarkan rekanan baru</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
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
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        placeholder="Contoh: PT Plastik Sejahtera"
                                        className="h-11"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipe Mitra</Label>
                                        <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {partnerTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {partnerStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        placeholder="Jelaskan tentang mitra ini, kapasitas, layanan, dan keunggulannya..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Lokasi & Alamat
                                </CardTitle>
                                <CardDescription>Informasi lokasi dan alamat lengkap mitra</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Kota / Kabupaten <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => updateField("location", e.target.value)}
                                        placeholder="Contoh: Jakarta, Bandung, Surabaya"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat Lengkap</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => updateField("address", e.target.value)}
                                        placeholder="Masukkan alamat lengkap termasuk jalan, nomor, RT/RW, kelurahan, kecamatan"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Kontak
                                </CardTitle>
                                <CardDescription>Informasi kontak penanggung jawab</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Nama Kontak</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={(e) => updateField("contactPerson", e.target.value)}
                                            placeholder="Nama PIC"
                                            className="pl-9 h-11"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telepon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => updateField("phone", e.target.value)}
                                            placeholder="021-1234567"
                                            className="pl-9 h-11"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            placeholder="email@perusahaan.com"
                                            className="pl-9 h-11"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 space-y-3">
                                <Button type="submit" className="w-full gap-2 h-11">
                                    <Save className="h-4 w-4" />
                                    Simpan Mitra
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={() => navigate("/admin/partners")}
                                >
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

export default PartnerCreate;
