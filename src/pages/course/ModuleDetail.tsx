import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle, Play,
  FileText, Video, Award, ChevronLeft, ChevronRight,
  Download, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import { useToast } from "@/hooks/use-toast";

// Course data (same as CourseModules)
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
        content: `
## Selamat Datang di Modul 1!

Dalam modul ini, Anda akan mempelajari dasar-dasar pengenalan sampah yang meliputi:

### Tujuan Pembelajaran
1. Memahami definisi dan klasifikasi sampah
2. Mengenali dampak lingkungan dari pengelolaan sampah yang buruk
3. Mengetahui regulasi nasional terkait pengelolaan sampah

### Gambaran Umum
Sampah adalah sisa kegiatan sehari-hari manusia dan/atau proses alam yang berbentuk padat. Pengelolaan sampah yang tepat sangat penting untuk menjaga kelestarian lingkungan dan kesehatan masyarakat.

Selesaikan semua pelajaran di modul ini untuk melanjutkan ke modul berikutnya.
        `,
        lessons: [
          {
            id: 1,
            title: "Definisi dan klasifikasi sampah",
            type: "video",
            duration: "45 menit",
            content: "Video pembelajaran tentang definisi dan berbagai jenis klasifikasi sampah berdasarkan sumbernya.",
            completed: false
          },
          {
            id: 2,
            title: "Dampak lingkungan",
            type: "video",
            duration: "30 menit",
            content: "Penjelasan mengenai dampak negatif sampah terhadap ekosistem dan kesehatan manusia.",
            completed: false
          },
          {
            id: 3,
            title: "Regulasi nasional",
            type: "document",
            duration: "20 menit",
            content: "Dokumen tentang UU No. 18 Tahun 2008 tentang Pengelolaan Sampah dan peraturan turunannya.",
            completed: false
          },
          {
            id: 4,
            title: "Quiz Modul 1",
            type: "quiz",
            duration: "15 menit",
            content: "Uji pemahaman Anda tentang materi pengenalan sampah.",
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: "Metode Pengumpulan",
        duration: "1 minggu",
        description: "Sistem dan teknologi pengumpulan sampah dari berbagai sumber",
        content: `
## Modul 2: Metode Pengumpulan

Modul ini membahas berbagai metode dan sistem pengumpulan sampah yang efektif.

### Tujuan Pembelajaran
1. Menguasai sistem pengumpulan sampah rumah tangga
2. Memahami pengumpulan sampah industri
3. Mengenal teknologi transportasi sampah modern
        `,
        lessons: [
          { id: 1, title: "Sistem pengumpulan rumah tangga", type: "video", duration: "40 menit", content: "", completed: false },
          { id: 2, title: "Pengumpulan industri", type: "video", duration: "35 menit", content: "", completed: false },
          { id: 3, title: "Teknologi transportasi", type: "document", duration: "25 menit", content: "", completed: false },
          { id: 4, title: "Quiz Modul 2", type: "quiz", duration: "15 menit", content: "", completed: false }
        ]
      },
      {
        id: 3,
        title: "Pengolahan Dasar",
        duration: "1 minggu",
        description: "Teknik dasar pengolahan dan pemrosesan sampah",
        content: `
## Modul 3: Pengolahan Dasar

Pelajari teknik-teknik dasar dalam mengolah dan memproses sampah.

### Tujuan Pembelajaran
1. Menguasai teknik sorting dan pemilahan
2. Memahami proses komposting dasar
3. Mengetahui sistem penimbunan saniter
        `,
        lessons: [
          { id: 1, title: "Sorting dan pemilahan", type: "video", duration: "50 menit", content: "", completed: false },
          { id: 2, title: "Komposting dasar", type: "video", duration: "45 menit", content: "", completed: false },
          { id: 3, title: "Penimbunan saniter", type: "document", duration: "30 menit", content: "", completed: false },
          { id: 4, title: "Quiz Modul 3", type: "quiz", duration: "15 menit", content: "", completed: false }
        ]
      },
      {
        id: 4,
        title: "Praktik & Sertifikasi",
        duration: "1 minggu",
        description: "Penerapan praktis dan persiapan ujian sertifikasi",
        content: `
## Modul 4: Praktik & Sertifikasi

Modul terakhir yang mempersiapkan Anda untuk mendapatkan sertifikasi.

### Tujuan Pembelajaran
1. Menganalisis studi kasus nyata
2. Mengerjakan proyek akhir
3. Lulus ujian sertifikasi
        `,
        lessons: [
          { id: 1, title: "Studi kasus", type: "video", duration: "60 menit", content: "", completed: false },
          { id: 2, title: "Proyek akhir", type: "assignment", duration: "120 menit", content: "", completed: false },
          { id: 3, title: "Ujian sertifikasi", type: "exam", duration: "90 menit", content: "", completed: false }
        ]
      }
    ]
  }
];

// Default module generator for other courses
const getModuleData = (courseId: number, moduleId: number) => {
  const course = coursesData.find(c => c.id === courseId);
  if (course) {
    const module = course.modules.find(m => m.id === moduleId);
    if (module) return { course, module };
  }

  // Return default data
  return {
    course: {
      id: courseId,
      title: `Kursus ${courseId}`,
      modules: [
        { id: moduleId, title: `Modul ${moduleId}`, duration: "1 minggu", description: "Deskripsi modul", content: "# Konten Modul\n\nSelamat datang di modul ini.", lessons: [] }
      ]
    },
    module: {
      id: moduleId,
      title: `Modul ${moduleId}`,
      duration: "1 minggu",
      description: "Deskripsi modul pembelajaran",
      content: `
## Modul ${moduleId}

Selamat datang di modul ini. Silakan pelajari materi yang tersedia.

### Tujuan Pembelajaran
1. Memahami konsep dasar
2. Menerapkan dalam praktik
3. Mengerjakan evaluasi
      `,
      lessons: [
        { id: 1, title: "Pengenalan materi", type: "video", duration: "30 menit", content: "Video pengenalan", completed: false },
        { id: 2, title: "Konsep dasar", type: "video", duration: "25 menit", content: "Video konsep dasar", completed: false },
        { id: 3, title: "Materi pendukung", type: "document", duration: "20 menit", content: "Dokumen pendukung", completed: false },
        { id: 4, title: "Quiz", type: "quiz", duration: "15 menit", content: "Quiz evaluasi", completed: false }
      ]
    }
  };
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />;
    case 'document': return <FileText className="w-4 h-4" />;
    case 'quiz':
    case 'exam': return <Award className="w-4 h-4" />;
    case 'assignment': return <BookOpen className="w-4 h-4" />;
    default: return <Play className="w-4 h-4" />;
  }
};

const ModuleDetail = () => {
  const { id, moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const courseId = Number(id);
  const modId = Number(moduleId);

  const { course, module } = getModuleData(courseId, modId);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [notes, setNotes] = useState("");

  const currentLesson = module.lessons[activeLesson];
  const progress = (completedLessons.length / module.lessons.length) * 100;

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(activeLesson)) {
      setCompletedLessons([...completedLessons, activeLesson]);
      toast({
        title: "Pelajaran Selesai!",
        description: `${currentLesson.title} telah ditandai selesai.`,
      });
    }

    if (activeLesson < module.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const handlePrevLesson = () => {
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1);
    }
  };

  const handleNextLesson = () => {
    if (activeLesson < module.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const handlePrevModule = () => {
    if (modId > 1) {
      navigate(`/course/${courseId}/module/${modId - 1}`);
    }
  };

  const handleNextModule = () => {
    navigate(`/course/${courseId}/module/${modId + 1}`);
  };

  return (
    <>
      <CustomerNavbar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="container-wide py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/course/${courseId}/modules`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <div className="h-6 w-px bg-border hidden lg:block" />
                <div>
                  <p className="text-sm text-muted-foreground">{course.title}</p>
                  <h1 className="text-lg font-bold text-foreground">{module.title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <Progress value={progress} className="w-32 h-2" />
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-wide py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video/Content Area */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-t-lg">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        {getLessonIcon(currentLesson?.type || 'video')}
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {currentLesson?.title || 'Pilih Pelajaran'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentLesson?.type === 'video' ? 'Video akan dimuat di sini' :
                          currentLesson?.type === 'document' ? 'Dokumen akan ditampilkan' :
                            currentLesson?.type === 'quiz' ? 'Quiz akan dimulai' :
                              currentLesson?.type === 'exam' ? 'Ujian akan dimulai' :
                                'Tugas akan ditampilkan'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          Pelajaran {activeLesson + 1} dari {module.lessons.length}
                        </Badge>
                        <h2 className="text-xl font-bold text-foreground">
                          {currentLesson?.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{currentLesson?.duration}</span>
                        </div>
                      </div>
                      {completedLessons.includes(activeLesson) && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Selesai
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevLesson}
                        disabled={activeLesson === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Sebelumnya
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCompleteLesson}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Tandai Selesai & Lanjutkan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextLesson}
                        disabled={activeLesson === module.lessons.length - 1}
                      >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                  <TabsTrigger value="resources">Materi</TabsTrigger>
                  <TabsTrigger value="notes">Catatan</TabsTrigger>
                  <TabsTrigger value="discussion">Diskusi</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <Card>
                    <CardContent className="p-6 prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: module.content?.replace(/\n/g, '<br>').replace(/##/g, '<h2>').replace(/###/g, '<h3>') || '' }} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Materi Pendukung</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <span>Slide Presentasi - {module.title}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <span>Handout Materi</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Catatan Pribadi</h3>
                      <Textarea
                        placeholder="Tulis catatan Anda di sini..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <Button className="mt-4" size="sm">
                        Simpan Catatan
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussion" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Forum Diskusi</h3>
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Belum ada diskusi untuk pelajaran ini.</p>
                        <Button variant="outline" className="mt-4">
                          Mulai Diskusi Baru
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Lessons List */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Daftar Pelajaran</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {module.lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(index)}
                        className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${activeLesson === index ? 'bg-secondary' : ''
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${completedLessons.includes(index)
                              ? 'bg-green-100 text-green-600'
                              : activeLesson === index
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground'
                            }`}>
                            {completedLessons.includes(index) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${activeLesson === index ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Module Navigation */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-3">Navigasi Modul</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handlePrevModule}
                      disabled={modId <= 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Modul {modId - 1}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleNextModule}
                    >
                      Modul {modId + 1}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleDetail;
