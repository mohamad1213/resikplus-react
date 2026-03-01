
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock, Users, Award, CheckCircle, ArrowRight, ArrowLeft,
  BookOpen, Target, GraduationCap, Play, Lock, Star,
  Calendar, Globe, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface RegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

interface Lesson {
  id: number;
  title: string;
  type: string;
  duration: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  students_count: number;
  price: string;
  features: string[] | string;
  type: string;
  modules: Module[];
  instructor: string;
  image: string;
  // Additional fields if available from backend, or mocked for now
  benefits?: string[];
  learningPath?: string[];
  requirements?: string[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'benefits' | 'instructor'>('curriculum');

  // Registration State
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}/`);
      setCourse(res.data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast({
        title: "Gagal memuat kursus",
        description: "Kursus tidak ditemukan atau terjadi kesalahan.",
        variant: "destructive"
      });
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const getFeatures = (features: any): string[] => {
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        return JSON.parse(features);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Mock data for UI placeholders if backend doesn't provide them yet
  const getBenefits = () => course?.benefits || [
    "Sertifikat resmi yang diakui industri",
    "Akses materi pembelajaran selamanya",
    "Networking dengan profesional lingkungan",
    "Peluang karir di sektor pengelolaan sampah",
    "Kontribusi nyata untuk lingkungan"
  ];

  const getRequirements = () => course?.requirements || [
    "Tidak ada persyaratan khusus",
    "Akses internet stabil",
    "Komitmen belajar mandiri"
  ];

  const getLearningPath = () => course?.learningPath || [
    "Memahami konsep dasar",
    "Mempelajari materi inti",
    "Mengerjakan kuis dan tugas",
    "Menyelesaikan proyek akhir",
    "Mendapatkan sertifikat"
  ];

  const getInstructor = () => ({
    name: course?.instructor || "Instruktur ResikPlus",
    role: "Expert",
    bio: "Profesional berpengalaman di bidang lingkungan dan pengelolaan sampah."
  });

  const handleOpenRegistration = () => {
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    setRegistrationForm({ fullName: "", email: "", phone: "", notes: "" });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    if (!registrationForm.fullName.trim() || !registrationForm.phone.trim() || !registrationForm.email.trim()) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi nama, email, dan nomor telepon.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save registration to backend
      const res = await api.post(`/courses/${course.id}/register/`, {
        full_name: registrationForm.fullName,
        email: registrationForm.email,
        phone: registrationForm.phone,
        notes: registrationForm.notes
      });
      const generatedPassword = res.data.generated_password;

      // 2. Construct WhatsApp Message
      const message = `Halo Admin ResikPlus, saya ingin mendaftar kursus berikut:\n\n` +
        `*Judul*: ${course.title}\n` +
        `*Harga*: ${formatPrice(course.price)}\n\n` +
        `*Data Diri*:\n` +
        `Nama: ${registrationForm.fullName}\n` +
        `Email: ${registrationForm.email}\n` +
        `No HP: ${registrationForm.phone}\n` +
        `Password Sementara: ${generatedPassword}\n` +
        `Catatan: ${registrationForm.notes || '-'}\n\n` +
        `Mohon info pembayaran selanjutnya. Terima kasih.`;

      const waUrl = `https://wa.me/6285156803370?text=${encodeURIComponent(message)}`;

      // 3. Close modal and redirect
      handleCloseRegistration();
      window.open(waUrl, '_blank');

      toast({
        title: "Pendaftaran Berhasil",
        description: "Anda akan dialihkan ke WhatsApp untuk konfirmasi pembayaran.",
      });

    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.email?.[0] || "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast({
        title: "Pendaftaran Gagal",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!course) return null; // Should have redirected

  const instructor = getInstructor();
  const features = getFeatures(course.features);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-sky-light/50 to-background">
        <div className="container-wide">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/courses')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kursus
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-leaf-light text-primary">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {course.type}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  4.8 Rating
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{course.students_count.toLocaleString()} peserta</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>{course.modules?.length || 0} modul</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>{course.type}</span>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 h-fit sticky top-24">
              <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(course.price)}</div>
              <p className="text-sm text-muted-foreground mb-6">Akses kursus penuh + sertifikat</p>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleOpenRegistration}
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {/* 
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/course/${id}/modules`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Preview Modul
                </Button>
                */}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <h4 className="font-semibold text-foreground mb-3">Yang Anda Dapatkan:</h4>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 border-b border-border sticky top-[72px] bg-background z-40">
        <div className="container-wide">
          <div className="flex gap-1 bg-secondary rounded-lg p-1 w-fit">
            {[
              { key: 'curriculum', label: 'Kurikulum', icon: BookOpen },
              { key: 'benefits', label: 'Manfaat', icon: Award },
              { key: 'instructor', label: 'Instruktur', icon: GraduationCap },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-4xl">
            {activeTab === 'curriculum' && (
              <div className="space-y-8">
                {/* Learning Path */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Alur Pembelajaran
                  </h2>
                  <div className="relative pl-8">
                    {getLearningPath().map((step, index) => (
                      <div key={index} className="relative pb-8 last:pb-0">
                        <div className="absolute left-0 top-0 w-6 h-6 -translate-x-1/2 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        {index !== getLearningPath().length - 1 && (
                          <div className="absolute left-0 top-6 w-0.5 h-full -translate-x-1/2 bg-border" />
                        )}
                        <p className="text-foreground ml-4">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Detail Kurikulum
                  </h2>
                  <div className="space-y-4">
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((module, index) => (
                        <div key={index} className="border border-border rounded-xl overflow-hidden">
                          <div className="bg-secondary/50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Play className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{module.title}</h3>
                                {/* <p className="text-xs text-muted-foreground">{module.duration}</p> */}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{module.lessons.length} pelajaran</span>
                          </div>
                          <div className="p-4 space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Lock className="w-4 h-4" />
                                <span>{lesson.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Belum ada modul yang tersedia.</p>
                    )}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Persyaratan</h2>
                  <ul className="space-y-2">
                    {getRequirements().map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Manfaat Mengikuti Kursus Ini
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {getBenefits().map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-sky/10 rounded-2xl p-8 mt-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Siap Memulai Perjalanan Anda?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Bergabung dengan {course.students_count.toLocaleString()}+ peserta lain yang sudah mengikuti kursus ini.
                  </p>
                  <Button size="lg" onClick={handleOpenRegistration}>
                    Daftar Sekarang
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Tentang Instruktur
                </h2>

                <div className="flex items-start gap-6 p-6 rounded-2xl bg-secondary/30 border border-border">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{instructor.name}</h3>
                    <p className="text-primary font-medium mb-2">{instructor.role}</p>
                    <p className="text-muted-foreground">{instructor.bio}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
                    <div className="text-3xl font-bold text-primary">{course.students_count.toLocaleString()}+</div>
                    <p className="text-sm text-muted-foreground">Peserta Terlatih</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
                    <div className="text-3xl font-bold text-primary">4.8</div>
                    <p className="text-sm text-muted-foreground">Rating Rata-rata</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
                    <div className="text-3xl font-bold text-primary">10+</div>
                    <p className="text-sm text-muted-foreground">Tahun Pengalaman</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Form Pendaftaran Kursus</h2>
              <button
                onClick={handleCloseRegistration}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-6">
              {/* Course Summary */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>⏱ {course.duration}</span>
                  <span>📊 {course.level}</span>
                  <span>🎓 {course.type}</span>
                </div>
                <div className="mt-2 text-lg font-bold text-primary">{formatPrice(course.price)}</div>
              </div>

              {/* Registration Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    placeholder="Masukkan nama lengkap Anda"
                    value={registrationForm.fullName}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, fullName: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@contoh.com"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Pertanyaan atau catatan tambahan..."
                    value={registrationForm.notes}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, notes: e.target.value })}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={handleCloseRegistration} disabled={isSubmitting}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Daftar via WhatsApp"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail;

