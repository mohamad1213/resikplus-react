import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Bell, Send, Users, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  target: string;
  status: string;
  sentAt: string;
  readCount: number;
  totalRecipients: number;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Selamat Datang!", message: "Selamat bergabung di ResikPlus. Mulai perjalanan daur ulang Anda sekarang.", type: "Welcome", target: "Semua User", status: "Terkirim", sentAt: "2024-12-01 10:00", readCount: 450, totalRecipients: 500 },
  { id: 2, title: "Promo Akhir Tahun", message: "Diskon 20% untuk semua kursus hingga 31 Desember 2024.", type: "Promo", target: "Customer", status: "Terkirim", sentAt: "2024-11-28 14:30", readCount: 320, totalRecipients: 400 },
  { id: 3, title: "Update Sistem", message: "Sistem akan mengalami maintenance pada tanggal 5 Januari 2025.", type: "System", target: "Semua User", status: "Terjadwal", sentAt: "2024-12-20 08:00", readCount: 0, totalRecipients: 500 },
  { id: 4, title: "Kursus Baru Tersedia", message: "Kursus 'Zero Waste Lifestyle' sudah dapat diakses!", type: "Info", target: "Customer", status: "Terkirim", sentAt: "2024-11-25 09:00", readCount: 280, totalRecipients: 400 },
  { id: 5, title: "Reminder Pembayaran", message: "Jangan lupa selesaikan pembayaran kursus Anda.", type: "Reminder", target: "Customer", status: "Draft", sentAt: "-", readCount: 0, totalRecipients: 50 },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [deleteNotification, setDeleteNotification] = useState<Notification | null>(null);
  const [viewNotification, setViewNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Info",
    target: "Semua User",
    status: "Draft",
  });

  const filteredNotifications = notifications.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terkirim":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Terjadwal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Welcome":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "Promo":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "System":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Reminder":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCreate = () => {
    setEditingNotification(null);
    setFormData({ title: "", message: "", type: "Info", target: "Semua User", status: "Draft" });
    setIsFormOpen(true);
  };

  const handleEdit = (item: Notification) => {
    setEditingNotification(item);
    setFormData({
      title: item.title,
      message: item.message,
      type: item.type,
      target: item.target,
      status: item.status,
    });
    setIsFormOpen(true);
  };

  const handleView = (item: Notification) => {
    setViewNotification(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item: Notification) => {
    setDeleteNotification(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteNotification) {
      setNotifications(notifications.filter((n) => n.id !== deleteNotification.id));
      toast.success("Notifikasi berhasil dihapus");
    }
    setIsDeleteOpen(false);
    setDeleteNotification(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      toast.error("Judul dan pesan wajib diisi");
      return;
    }

    if (editingNotification) {
      setNotifications(
        notifications.map((n) =>
          n.id === editingNotification.id
            ? { ...n, ...formData }
            : n
        )
      );
      toast.success("Notifikasi berhasil diperbarui");
    } else {
      const newNotification: Notification = {
        id: Math.max(...notifications.map((n) => n.id)) + 1,
        ...formData,
        sentAt: formData.status === "Terkirim" ? new Date().toISOString().replace("T", " ").slice(0, 16) : "-",
        readCount: 0,
        totalRecipients: formData.target === "Semua User" ? 500 : formData.target === "Customer" ? 400 : 100,
      };
      setNotifications([...notifications, newNotification]);
      toast.success("Notifikasi berhasil ditambahkan");
    }
    setIsFormOpen(false);
  };

  const handleSend = (item: Notification) => {
    setNotifications(
      notifications.map((n) =>
        n.id === item.id
          ? { ...n, status: "Terkirim", sentAt: new Date().toISOString().replace("T", " ").slice(0, 16) }
          : n
      )
    );
    toast.success("Notifikasi berhasil dikirim");
  };

  const sentCount = notifications.filter(n => n.status === "Terkirim").length;
  const draftCount = notifications.filter(n => n.status === "Draft").length;
  const totalReads = notifications.reduce((sum, n) => sum + n.readCount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Notifikasi</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Semua notifikasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Terkirim</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentCount}</div>
            <p className="text-xs text-muted-foreground">Sudah dikirim</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">Menunggu dikirim</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Dibaca</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Oleh pengguna</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>Daftar Notifikasi</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari notifikasi..."
                  className="pl-9 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="gap-2" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Buat Notifikasi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dikirim</TableHead>
                  <TableHead>Dibaca</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(item.type)} variant="secondary">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.target}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.sentAt}</TableCell>
                    <TableCell>
                      {item.status === "Terkirim" ? `${item.readCount}/${item.totalRecipients}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => handleView(item)}>
                            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          {item.status === "Draft" && (
                            <DropdownMenuItem onClick={() => handleSend(item)}>
                              <Send className="mr-2 h-4 w-4" /> Kirim
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item)}>
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
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Notifikasi</DialogTitle>
          </DialogHeader>
          {viewNotification && (
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Badge className={getStatusColor(viewNotification.status)} variant="secondary">
                  {viewNotification.status}
                </Badge>
                <Badge className={getTypeColor(viewNotification.type)} variant="secondary">
                  {viewNotification.type}
                </Badge>
              </div>
              <h2 className="text-xl font-bold">{viewNotification.title}</h2>
              <p className="text-muted-foreground">{viewNotification.message}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Target</Label>
                  <p className="font-medium">{viewNotification.target}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dikirim</Label>
                  <p className="font-medium">{viewNotification.sentAt}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Penerima</Label>
                  <p className="font-medium">{viewNotification.totalRecipients}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dibaca</Label>
                  <p className="font-medium">{viewNotification.readCount}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNotification ? "Edit Notifikasi" : "Buat Notifikasi"}</DialogTitle>
            <DialogDescription>
              {editingNotification ? "Perbarui notifikasi" : "Buat notifikasi baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul notifikasi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Welcome">Welcome</SelectItem>
                  <SelectItem value="Promo">Promo</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Penerima</Label>
              <Select value={formData.target} onValueChange={(value) => setFormData({ ...formData, target: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua User">Semua User</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Mitra">Mitra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Terkirim">Kirim Sekarang</SelectItem>
                  <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Pesan</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tulis pesan notifikasi..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              {editingNotification ? "Simpan" : "Buat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Notifikasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus notifikasi "{deleteNotification?.title}"? 
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

export default AdminNotifications;
