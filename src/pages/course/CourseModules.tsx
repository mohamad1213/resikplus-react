import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Clock, CheckCircle, Play,
  ChevronRight, FileText, Video, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import CustomerNavbar from "@/components/customer/CustomerNavbar";

// Course data with detailed modules
const coursesData = [
  {
    id: 1,
    title: "Dasar-Dasar Pengelolaan Sampah",
    modules: [
      {
        id: 1,
        title: "Pengenalan Sampah",
        duration: "1 minggu",
        description: "Memahami definisi, klasifikasi, dan dampak sampah terhadap lingkungan",
        lessons: [
          { id: 1, title: "Definisi dan klasifikasi sampah", type: "video", duration: "45 menit" },
          { id: 2, title: "Dampak lingkungan", type: "video", duration: "30 menit" },
          { id: 3, title: "Regulasi nasional", type: "document", duration: "20 menit" },
          { id: 4, title: "Quiz Modul 1", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 2,
        title: "Metode Pengumpulan",
        duration: "1 minggu",
        description: "Sistem dan teknologi pengumpulan sampah dari berbagai sumber",
        lessons: [
          { id: 1, title: "Sistem pengumpulan rumah tangga", type: "video", duration: "40 menit" },
          { id: 2, title: "Pengumpulan industri", type: "video", duration: "35 menit" },
          { id: 3, title: "Teknologi transportasi", type: "document", duration: "25 menit" },
          { id: 4, title: "Quiz Modul 2", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 3,
        title: "Pengolahan Dasar",
        duration: "1 minggu",
        description: "Teknik dasar pengolahan dan pemrosesan sampah",
        lessons: [
          { id: 1, title: "Sorting dan pemilahan", type: "video", duration: "50 menit" },
          { id: 2, title: "Komposting dasar", type: "video", duration: "45 menit" },
          { id: 3, title: "Penimbunan saniter", type: "document", duration: "30 menit" },
          { id: 4, title: "Quiz Modul 3", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 4,
        title: "Praktik & Sertifikasi",
        duration: "1 minggu",
        description: "Penerapan praktis dan persiapan ujian sertifikasi",
        lessons: [
          { id: 1, title: "Studi kasus", type: "video", duration: "60 menit" },
          { id: 2, title: "Proyek akhir", type: "assignment", duration: "120 menit" },
          { id: 3, title: "Ujian sertifikasi", type: "exam", duration: "90 menit" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Teknik Daur Ulang Industri",
    modules: [
      {
        id: 1,
        title: "Material Recovery",
        duration: "1 minggu",
        description: "Identifikasi dan pemulihan material bernilai dari sampah",
        lessons: [
          { id: 1, title: "Jenis material daur ulang", type: "video", duration: "40 menit" },
          { id: 2, title: "Teknologi identifikasi", type: "video", duration: "35 menit" },
          { id: 3, title: "Nilai ekonomi material", type: "document", duration: "25 menit" },
          { id: 4, title: "Quiz Modul 1", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 2,
        title: "Teknologi Pemrosesan",
        duration: "2 minggu",
        description: "Pengoperasian mesin dan peralatan daur ulang industri",
        lessons: [
          { id: 1, title: "Mesin pencacah", type: "video", duration: "50 menit" },
          { id: 2, title: "Mesin pres", type: "video", duration: "45 menit" },
          { id: 3, title: "Sistem conveyor", type: "video", duration: "40 menit" },
          { id: 4, title: "Praktik operasional", type: "assignment", duration: "120 menit" },
          { id: 5, title: "Quiz Modul 2", type: "quiz", duration: "20 menit" }
        ]
      },
      {
        id: 3,
        title: "Kontrol Kualitas",
        duration: "1 minggu",
        description: "Standar dan pengujian kualitas output daur ulang",
        lessons: [
          { id: 1, title: "Standar kualitas output", type: "video", duration: "35 menit" },
          { id: 2, title: "Pengujian material", type: "video", duration: "40 menit" },
          { id: 3, title: "Sertifikasi produk", type: "document", duration: "30 menit" },
          { id: 4, title: "Quiz Modul 3", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 4,
        title: "Keselamatan & Praktik",
        duration: "2 minggu",
        description: "Protokol K3 dan praktik lapangan di fasilitas daur ulang",
        lessons: [
          { id: 1, title: "K3 di fasilitas daur ulang", type: "video", duration: "45 menit" },
          { id: 2, title: "Praktik lapangan", type: "assignment", duration: "180 menit" },
          { id: 3, title: "Proyek akhir", type: "assignment", duration: "120 menit" },
          { id: 4, title: "Ujian sertifikasi", type: "exam", duration: "90 menit" }
        ]
      }
    ]
  }
];

// Get course data by ID, fallback to generating modules for other courses
const getCourseModules = (courseId: number) => {
  const course = coursesData.find(c => c.id === courseId);
  if (course) return course;

  // Generate default modules for courses not in detailed data
  return {
    id: courseId,
    title: `Kursus ${courseId}`,
    modules: [
      {
        id: 1,
        title: "Modul 1: Pengenalan",
        duration: "1 minggu",
        description: "Pengenalan dan dasar-dasar materi kursus",
        lessons: [
          { id: 1, title: "Pengenalan materi", type: "video", duration: "30 menit" },
          { id: 2, title: "Konsep dasar", type: "video", duration: "25 menit" },
          { id: 3, title: "Quiz Modul 1", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 2,
        title: "Modul 2: Pengembangan",
        duration: "1 minggu",
        description: "Pengembangan pemahaman lebih lanjut",
        lessons: [
          { id: 1, title: "Materi lanjutan", type: "video", duration: "35 menit" },
          { id: 2, title: "Studi kasus", type: "document", duration: "30 menit" },
          { id: 3, title: "Quiz Modul 2", type: "quiz", duration: "15 menit" }
        ]
      },
      {
        id: 3,
        title: "Modul 3: Praktik",
        duration: "1 minggu",
        description: "Penerapan praktis materi pembelajaran",
        lessons: [
          { id: 1, title: "Panduan praktik", type: "video", duration: "40 menit" },
          { id: 2, title: "Tugas praktik", type: "assignment", duration: "60 menit" },
          { id: 3, title: "Proyek akhir", type: "assignment", duration: "90 menit" }
        ]
      },
      {
        id: 4,
        title: "Modul 4: Sertifikasi",
        duration: "1 minggu",
        description: "Persiapan dan ujian sertifikasi",
        lessons: [
          { id: 1, title: "Review materi", type: "video", duration: "45 menit" },
          { id: 2, title: "Simulasi ujian", type: "quiz", duration: "30 menit" },
          { id: 3, title: "Ujian sertifikasi", type: "exam", duration: "60 menit" }
        ]
      }
    ]
  };
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'document':
      return <FileText className="w-4 h-4" />;
    case 'quiz':
    case 'exam':
      return <Award className="w-4 h-4" />;
    case 'assignment':
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Play className="w-4 h-4" />;
  }
};

const getLessonTypeBadge = (type: string) => {
  const typeConfig: Record<string, { label: string; className: string }> = {
    video: { label: "Video", className: "bg-blue-100 text-blue-700" },
    document: { label: "Dokumen", className: "bg-green-100 text-green-700" },
    quiz: { label: "Quiz", className: "bg-amber-100 text-amber-700" },
    exam: { label: "Ujian", className: "bg-red-100 text-red-700" },
    assignment: { label: "Tugas", className: "bg-purple-100 text-purple-700" }
  };
  const config = typeConfig[type] || { label: type, className: "bg-gray-100 text-gray-700" };
  return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
};

const CourseModules = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = Number(id);
  const course = getCourseModules(courseId);

  // Calculate total lessons and progress
  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const totalDuration = course.modules.reduce((acc, mod) => {
    return acc + mod.lessons.reduce((lessonAcc, lesson) => {
      const mins = parseInt(lesson.duration) || 0;
      return lessonAcc + mins;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />
      <section className="section-padding bg-gradient-to-b from-sky-light/50 to-background">
        <div className="container-wide">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Detail Kursus
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.modules.length} Modul
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {totalLessons} Pelajaran
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.floor(totalDuration / 60)} jam {totalDuration % 60} menit
              </span>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid gap-6">
            {course.modules.map((module, moduleIndex) => (
              <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Module Number */}
                    <div className="lg:w-24 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center p-6">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {moduleIndex + 1}
                        </span>
                      </div>
                    </div>

                    {/* Module Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {module.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {module.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {module.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {module.lessons.length} pelajaran
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/course/${courseId}/module/${module.id}`)}
                          className="shrink-0"
                        >
                          Buka Modul
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>

                      {/* Lessons Preview */}
                      <div className="border-t border-border pt-4">
                        <div className="grid gap-2">
                          {module.lessons.slice(0, 3).map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  {getLessonIcon(lesson.type)}
                                </div>
                                <span className="text-sm text-foreground">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getLessonTypeBadge(lesson.type)}
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                          {module.lessons.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              +{module.lessons.length - 3} pelajaran lainnya
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseModules;
