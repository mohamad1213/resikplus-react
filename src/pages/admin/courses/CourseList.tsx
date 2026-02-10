import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  category: string; // level
  instructor: string;
  students: number; // students_count
  status: string;
  progress: number; // dummy for now or calculate from lessons
  lessons: number; // lessons_count
  description: string;
  price: string;
  thumbnail: string; // image
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses/");
      const data = response.data.results || response.data;
      if (Array.isArray(data)) {
        const mappedCourses = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle || "",
          category: c.level,
          instructor: c.instructor,
          students: c.students_count || 0,
          status: c.status,
          progress: 0, // Default 0 as backend doesn't track admin progress
          lessons: c.lessons_count || 0,
          description: c.description,
          price: c.price,
          thumbnail: c.image,
        }));
        setCourses(mappedCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Gagal memuat kursus");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleDelete = (course: Course) => {
    setDeleteCourse(course);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteCourse) {
      try {
        await api.delete(`/courses/${deleteCourse.id}/`);
        setCourses(courses.filter((c) => c.id !== deleteCourse.id));
        toast.success("Kursus berhasil dihapus");
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Gagal menghapus kursus");
      }
    }
    setIsDeleteOpen(false);
    setDeleteCourse(null);
  };

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
  const formatPrice = (price: string) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(parseFloat(price));

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
            <p className="text-xs text-muted-foreground">Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Terdaftar</p>
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
        {/* Placeholder for certificates or other metric */}
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
              <Link to="/admin/courses/create">
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Tambah Kursus
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Belum ada kursus. Silakan tambahkan kursus baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="h-12 w-12 text-gray-400" />
                    )}
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
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/courses/${course.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/courses/${course.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{course.subtitle || course.description}</p>
                    <p className="text-xs text-muted-foreground mb-3">By {course.instructor}</p>
                    <div className="font-bold text-primary mb-2">{formatPrice(course.price)}</div>

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
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kursus?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kursus "{deleteCourse?.title}" akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseList;
