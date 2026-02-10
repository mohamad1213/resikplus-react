import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Edit2,
  Shield,
  Bell,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

const CustomerProfile = () => {
  const { user } = useUserRole();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    promotions: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: "",
        address: "",
        bio: "",
      });
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        setProfile({
          fullName: data.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
        });

      if (error) throw error;

      toast({
        title: "Profil Disimpan",
        description: "Perubahan profil berhasil disimpan.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const userName = profile.fullName || user?.email?.split("@")[0] || "User";
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Profil Saya</h2>
        <p className="text-muted-foreground">
          Kelola informasi pribadi dan preferensi akun Anda
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold">{userName}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  Akun Terverifikasi
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Menyimpan..." : "Simpan"}
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profil
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informasi Pribadi
          </CardTitle>
          <CardDescription>
            Informasi dasar yang ditampilkan di profil Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                disabled={!isEditing}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="Contoh: 081234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
                placeholder="Kota/Kabupaten, Provinsi"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Ceritakan sedikit tentang diri Anda..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pengaturan Notifikasi
          </CardTitle>
          <CardDescription>
            Atur preferensi notifikasi yang Anda terima
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifikasi Email</p>
              <p className="text-sm text-muted-foreground">
                Terima update melalui email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Update Kursus</p>
              <p className="text-sm text-muted-foreground">
                Notifikasi saat ada materi baru
              </p>
            </div>
            <Switch
              checked={notifications.courseUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, courseUpdates: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Promosi & Penawaran</p>
              <p className="text-sm text-muted-foreground">
                Terima info promo dan diskon
              </p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, promotions: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Bahaya</CardTitle>
          <CardDescription>
            Tindakan ini tidak dapat dibatalkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Hapus Akun
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Hubungi admin untuk menghapus akun Anda
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;
