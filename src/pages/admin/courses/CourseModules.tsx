import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
  Clock,
  Save
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

// Types
interface Lesson {
  id: number;
  title: string;
  type: "video" | "document" | "quiz" | "assignment";
  duration: string;
  content: string;
  order: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  modules: Module[];
}

const lessonTypeIcons = {
  video: Video,
  document: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
};

const lessonTypeLabels = {
  video: "Video",
  document: "Dokumen",
  quiz: "Quiz",
  assignment: "Tugas",
};

const CourseModulesPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Module form state
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });

  // Lesson form state
  const [isAddingLesson, setIsAddingLesson] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: number; lesson: Lesson } | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video" as Lesson["type"],
    duration: "",
    content: ""
  });

  // Delete state
  const [deleteModule, setDeleteModule] = useState<Module | null>(null);
  const [deleteLesson, setDeleteLesson] = useState<{ moduleId: number; lesson: Lesson } | null>(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${id}/`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Gagal memuat data kursus");
    } finally {
      setLoading(false);
    }
  };

  // Module handlers
  const handleAddModule = () => {
    setIsAddingModule(true);
    setModuleForm({ title: "", description: "" });
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({ title: module.title, description: module.description });
  };

  const handleSaveModule = async () => {
    if (!moduleForm.title) {
      toast.error("Judul modul wajib diisi");
      return;
    }

    try {
      if (editingModule) {
        // Update
        await api.patch(`/modules/${editingModule.id}/`, {
          title: moduleForm.title,
          description: moduleForm.description
        });
        toast.success("Modul berhasil diperbarui");
        setEditingModule(null);
      } else {
        // Create
        // Calculate order: last module order + 1
        const maxOrder = course?.modules.length ? Math.max(...course.modules.map(m => m.order)) : 0;
        await api.post(`/modules/`, {
          course: id,
          title: moduleForm.title,
          description: moduleForm.description,
          order: maxOrder + 1
        });
        toast.success("Modul berhasil ditambahkan");
        setIsAddingModule(false);
      }
      setModuleForm({ title: "", description: "" });
      fetchCourseData(); // Refresh data
    } catch (error) {
      console.error("Error saving module:", error);
      toast.error("Gagal menyimpan modul");
    }
  };

  const handleDeleteModule = async () => {
    if (deleteModule) {
      try {
        await api.delete(`/modules/${deleteModule.id}/`);
        toast.success("Modul berhasil dihapus");
        setDeleteModule(null);
        fetchCourseData();
      } catch (error) {
        console.error("Error deleting module:", error);
        toast.error("Gagal menghapus modul");
      }
    }
  };

  // Lesson handlers
  const handleAddLesson = (moduleId: number) => {
    setIsAddingLesson(moduleId);
    setLessonForm({ title: "", type: "video", duration: "", content: "" });
  };

  const handleEditLesson = (moduleId: number, lesson: Lesson) => {
    setEditingLesson({ moduleId, lesson });
    setLessonForm({
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      content: lesson.content
    });
  };

  const handleSaveLesson = async (moduleId: number) => {
    if (!lessonForm.title) {
      toast.error("Judul pelajaran wajib diisi");
      return;
    }

    try {
      if (editingLesson) {
        // Update
        await api.patch(`/lessons/${editingLesson.lesson.id}/`, lessonForm);
        toast.success("Pelajaran berhasil diperbarui");
        setEditingLesson(null);
      } else {
        // Create
        const module = course?.modules.find(m => m.id === moduleId);
        const maxOrder = module && module.lessons.length ? Math.max(...module.lessons.map(l => l.order)) : 0;

        await api.post(`/lessons/`, {
          module: moduleId,
          ...lessonForm,
          order: maxOrder + 1
        });
        toast.success("Pelajaran berhasil ditambahkan");
        setIsAddingLesson(null);
      }
      setLessonForm({ title: "", type: "video", duration: "", content: "" });
      fetchCourseData();
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Gagal menyimpan pelajaran");
    }
  };

  const handleDeleteLesson = async () => {
    if (deleteLesson) {
      try {
        await api.delete(`/lessons/${deleteLesson.lesson.id}/`);
        toast.success("Pelajaran berhasil dihapus");
        setDeleteLesson(null);
        fetchCourseData();
      } catch (error) {
        console.error("Error deleting lesson:", error);
        toast.error("Gagal menghapus pelajaran");
      }
    }
  };

  if (!course && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Kursus tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/admin/courses/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Kelola Modul</h1>
            <p className="text-muted-foreground">{course?.title}</p>
          </div>
        </div>
        <Button onClick={handleAddModule} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Modul
        </Button>
      </div>

      {/* Add/Edit Module Form */}
      {(isAddingModule || editingModule) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingModule ? "Edit Modul" : "Tambah Modul Baru"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul Modul *</Label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Contoh: Pengenalan Daur Ulang"
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Deskripsi singkat modul"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveModule}>
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </Button>
              <Button
                variant="outline"
                onClick={() => { setIsAddingModule(false); setEditingModule(null); }}
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      {course?.modules.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum Ada Modul</h3>
            <p className="text-muted-foreground mb-4">Mulai dengan menambahkan modul pertama untuk kursus ini</p>
            <Button onClick={handleAddModule}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Modul Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {course?.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={`module-${module.id}`} className="border rounded-lg bg-card">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-4 flex-1">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {moduleIndex + 1}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-medium">{module.title}</h4>
                    <p className="text-sm text-muted-foreground">{module.lessons.length} pelajaran</p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => handleEditModule(module)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteModule(module)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pl-12">
                  {module.description && (
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  )}

                  {/* Lessons */}
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const Icon = lessonTypeIcons[lesson.type];
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100" />
                          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {lessonTypeLabels[lesson.type]}
                              </Badge>
                              {lesson.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditLesson(module.id, lesson)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteLesson({ moduleId: module.id, lesson })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add/Edit Lesson Form */}
                  {(isAddingLesson === module.id || (editingLesson?.moduleId === module.id)) && (
                    <Card className="border-dashed">
                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Judul Pelajaran *</Label>
                            <Input
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                              placeholder="Judul pelajaran"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipe</Label>
                            <Select
                              value={lessonForm.type}
                              onValueChange={(value) => setLessonForm({ ...lessonForm, type: value as Lesson["type"] })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="document">Dokumen</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="assignment">Tugas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Durasi</Label>
                            <Input
                              value={lessonForm.duration}
                              onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                              placeholder="Contoh: 10:30 atau 5 menit baca"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Konten / URL</Label>
                          <Textarea
                            value={lessonForm.content}
                            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                            placeholder="URL video, teks konten, atau konfigurasi quiz"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveLesson(module.id)}>
                            <Save className="mr-2 h-3 w-3" />
                            Simpan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setIsAddingLesson(null); setEditingLesson(null); }}
                          >
                            Batal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddLesson(module.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Pelajaran
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Delete Module Dialog */}
      <AlertDialog open={!!deleteModule} onOpenChange={() => setDeleteModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Modul?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua pelajaran dalam modul "{deleteModule?.title}" juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lesson Dialog */}
      <AlertDialog open={!!deleteLesson} onOpenChange={() => setDeleteLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pelajaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Pelajaran "{deleteLesson?.lesson.title}" akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseModulesPage;
