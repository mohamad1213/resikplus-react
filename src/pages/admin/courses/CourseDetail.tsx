import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Layers,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";
import React from "react";
import api from "@/lib/api";

interface Lesson {
  id: number;
  title: string;
  type: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  instructor: string;
  students: number;
  status: string;
  progress: number;
  lessons: number;
  description: string;
  price: string;
  thumbnail: string;
  type: string;
  duration: string;
  modules: Module[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}/`);
        const data = response.data;
        let totalLessons = 0;
        if (data.modules && Array.isArray(data.modules)) {
          data.modules.forEach((m: any) => {
            if (m.lessons) totalLessons += m.lessons.length;
          });
        }

        setCourse({
          id: data.id,
          title: data.title,
          subtitle: data.subtitle || "",
          category: data.level,
          instructor: data.instructor,
          students: data.students_count || 0,
          status: data.status,
          progress: 0,
          lessons: totalLessons || data.lessons_count || 0,
          description: data.description,
          price: data.price,
          thumbnail: data.image,
          type: data.type,
          duration: data.duration,
          modules: data.modules || []
        });
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Kursus tidak ditemukan</p>
      </div>
    );
  }

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
    return `Rp ${parseFloat(price).toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detail Kursus</h1>
            <p className="text-muted-foreground">Informasi lengkap kursus</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/admin/courses/${id}/modules`}>
            <Button variant="outline" className="gap-2">
              <Layers className="h-4 w-4" />
              Kelola Modul
            </Button>
          </Link>
          <Link to={`/admin/courses/${id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Kursus
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-lg relative overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <CardContent className="pt-6">
              <div className="flex gap-2 mb-4">
                <Badge className={getStatusColor(course.status)} variant="secondary">
                  {course.status}
                </Badge>
                <Badge className={getCategoryColor(course.category)} variant="secondary">
                  {course.category}
                </Badge>
                <Badge variant="outline">{course.type}</Badge>
              </div>

              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-lg text-muted-foreground mb-4">{course.subtitle}</p>

              <Separator className="my-4" />

              <div>
                <h3 className="font-semibold mb-2">Deskripsi</h3>
                <p className="text-muted-foreground whitespace-pre-line">{course.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Modules Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Modul Kursus</span>
                <Badge variant="secondary">{course.modules.length} Modul</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada modul</p>
                  <Link to={`/admin/courses/${id}/modules`}>
                    <Button variant="link" className="mt-2">Tambah Modul</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">{module.lessons ? module.lessons.length : 0} pelajaran</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Peserta</p>
                  <p className="text-lg font-semibold">{course.students}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pelajaran</p>
                  <p className="text-lg font-semibold">{course.lessons}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Modul</p>
                  <p className="text-lg font-semibold">{course.modules.length}</p>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress Konten</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Instruktur</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Harga</p>
                <p className="text-lg font-bold text-primary">{formatPrice(course.price)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Durasi</p>
                <p className="font-medium">{course.duration}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
