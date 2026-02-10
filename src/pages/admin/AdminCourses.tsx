import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, GraduationCap, Users, BookOpen, Award } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  students: number;
  status: string;
  progress: number;
  lessons: number;
  description: string;
  price: string;
}

const initialCourses: Course[] = [
  { id: 1, title: "Dasar-Dasar Daur Ulang", category: "Pemula", instructor: "Dr. Ahmad", students: 245, status: "Aktif", progress: 100, lessons: 12, description: "Pelajari dasar-dasar daur ulang untuk pemula", price: "150000" },
  { id: 2, title: "Pengolahan Limbah Plastik", category: "Menengah", instructor: "Ir. Siti", students: 189, status: "Aktif", progress: 75, lessons: 18, description: "Teknik pengolahan limbah plastik modern", price: "250000" },
  { id: 3, title: "Manajemen Bank Sampah", category: "Lanjutan", instructor: "Prof. Budi", students: 0, status: "Draft", progress: 40, lessons: 8, description: "Kelola bank sampah secara profesional", price: "350000" },
  { id: 4, title: "Ekonomi Sirkular", category: "Menengah", instructor: "Dr. Maya", students: 156, status: "Aktif", progress: 100, lessons: 15, description: "Memahami konsep ekonomi sirkular", price: "200000" },
  { id: 5, title: "Teknologi Pengolahan Limbah", category: "Lanjutan", instructor: "Ir. Rudi", students: 98, status: "Aktif", progress: 90, lessons: 20, description: "Teknologi terkini dalam pengolahan limbah", price: "400000" },
  { id: 6, title: "Zero Waste Lifestyle", category: "Pemula", instructor: "Dra. Ani", students: 0, status: "Coming Soon", progress: 20, lessons: 10, description: "Gaya hidup bebas sampah", price: "100000" },
];

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Pemula",
    instructor: "",
    status: "Draft",
    lessons: 0,
    description: "",
    price: "",
  });

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Coming Soon":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pemula":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "Menengah":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Lanjutan":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatPrice = (price: string) => {
    return `Rp ${parseInt(price).toLocaleString("id-ID")}`;
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData({ title: "", category: "Pemula", instructor: "", status: "Draft", lessons: 0, description: "", price: "" });
    setIsFormOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      instructor: course.instructor,
      status: course.status,
      lessons: course.lessons,
      description: course.description,
      price: course.price,
    });
    setIsFormOpen(true);
  };

  const handleView = (course: Course) => {
    setViewCourse(course);
    setIsViewOpen(true);
  };

  const handleDelete = (course: Course) => {
    setDeleteCourse(course);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCourse) {
      setCourses(courses.filter((c) => c.id !== deleteCourse.id));
      toast.success("Kursus berhasil dihapus");
    }
    setIsDeleteOpen(false);
    setDeleteCourse(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.instructor) {
      toast.error("Judul dan instruktur wajib diisi");
      return;
    }

    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? { ...c, ...formData, progress: editingCourse.progress, students: editingCourse.students }
            : c
        )
      );
      toast.success("Kursus berhasil diperbarui");
    } else {
      const newCourse: Course = {
        id: Math.max(...courses.map((c) => c.id)) + 1,
        ...formData,
        students: 0,
        progress: 0,
      };
      setCourses([...courses, newCourse]);
      toast.success("Kursus berhasil ditambahkan");
    }
    setIsFormOpen(false);
  };

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Kursus</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">+3 bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pelajaran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">Di semua kursus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sertifikat</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">Diterbitkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>Daftar Kursus</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kursus..."
                  className="pl-9 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="gap-2" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Tambah Kursus
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="h-28 bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-primary/60" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-1 flex-wrap">
                      <Badge className={getStatusColor(course.status)} variant="secondary">
                        {course.status}
                      </Badge>
                      <Badge className={getCategoryColor(course.category)} variant="secondary">
                        {course.category}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleView(course)}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(course)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold line-clamp-2 mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">By {course.instructor}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress konten</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} peserta</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} pelajaran</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview Kursus</DialogTitle>
          </DialogHeader>
          {viewCourse && (
            <div className="space-y-4 py-4">
              <div className="h-32 bg-gradient-to-br from-primary/30 to-accent/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-primary/60" />
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(viewCourse.status)} variant="secondary">
                  {viewCourse.status}
                </Badge>
                <Badge className={getCategoryColor(viewCourse.category)} variant="secondary">
                  {viewCourse.category}
                </Badge>
              </div>
              <h2 className="text-xl font-bold">{viewCourse.title}</h2>
              <p className="text-muted-foreground">{viewCourse.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Instruktur</Label>
                  <p className="font-medium">{viewCourse.instructor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Harga</Label>
                  <p className="font-medium text-primary">{formatPrice(viewCourse.price)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Peserta</Label>
                  <p className="font-medium">{viewCourse.students}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Pelajaran</Label>
                  <p className="font-medium">{viewCourse.lessons}</p>
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
            <DialogTitle>{editingCourse ? "Edit Kursus" : "Tambah Kursus"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Perbarui informasi kursus" : "Masukkan data kursus baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Kursus</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul kursus"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemula">Pemula</SelectItem>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Lanjutan">Lanjutan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instruktur</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="Nama instruktur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Masukkan harga"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessons">Jumlah Pelajaran</Label>
              <Input
                id="lessons"
                type="number"
                value={formData.lessons}
                onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })}
                placeholder="Jumlah pelajaran"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi kursus"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              {editingCourse ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kursus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kursus "{deleteCourse?.title}"? 
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

export default AdminCourses;
