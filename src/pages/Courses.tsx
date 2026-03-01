import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, Award, CheckCircle, ArrowRight, X } from "lucide-react";
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

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  students_count: number;
  price: string;
  features: string[] | string; // Can be array or JSON string depending on backend
  type: string;
  image: string;
}

const Courses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/");
      const data = res.data.results || res.data;
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({
        title: "Gagal memuat kursus",
        description: "Terjadi kesalahan saat mengambil data kursus.",
        variant: "destructive",
      });
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
  }

  const handleOpenRegistration = (course: Course) => {
    setSelectedCourse(course);
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    setSelectedCourse(null);
    setRegistrationForm({ fullName: "", email: "", phone: "", notes: "" });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) return;

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
      const res = await api.post(`/courses/${selectedCourse.id}/register/`, {
        full_name: registrationForm.fullName,
        email: registrationForm.email,
        phone: registrationForm.phone,
        notes: registrationForm.notes
      });
      const generatedPassword = res.data.generated_password;

      // 2. Construct WhatsApp Message
      const message = `Halo Admin ResikPlus, saya ingin mendaftar kursus berikut:\n\n` +
        `*Judul*: ${selectedCourse.title}\n` +
        `*Harga*: ${formatPrice(selectedCourse.price)}\n\n` +
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

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-sky-light/50 to-background">
        <div className="container-wide">
          {/* ... (Hero content same as before) ... */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/10 text-sky text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Pelatihan Profesional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Kursus Manajemen Lingkungan
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Dapatkan keahlian dalam pengelolaan sampah, daur ulang, dan keberlanjutan melalui
              program pelatihan bersertifikat kami yang dirancang oleh profesional industri.
            </p>
          </div>
        </div>
      </section>

      {/* Course Filters */}
      <section className="py-8 border-b border-border sticky top-[72px] bg-background z-40">
        <div className="container-wide">
          <div className="flex flex-wrap gap-3">
            {["Semua Kursus", "Pemula", "Menengah", "Lanjutan", "Online", "Offline"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  // Implement filtering logic if needed
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Belum ada kursus yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {courses.map((course) => (
                <div key={course.id} className="card-eco overflow-hidden">
                  <div className="grid lg:grid-cols-3">
                    <div className="lg:col-span-2 p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-leaf-light text-primary">
                          {course.level}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {course.type}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-foreground mb-3">{course.title}</h2>
                      <p className="text-muted-foreground mb-6">{course.description}</p>

                      <div className="flex flex-wrap gap-6 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{course.students_count.toLocaleString()} peserta</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2">
                        {getFeatures(course.features).slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-secondary/30 p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border">
                      <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(course.price)}</div>
                      <p className="text-sm text-muted-foreground mb-6">Akses kursus penuh</p>

                      <Button
                        size="lg"
                        className="w-full mb-3"
                        onClick={() => handleOpenRegistration(course)}
                      >
                        Daftar Sekarang
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        Pelajari Lebih Lanjut
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Pelatihan Khusus?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Kami menawarkan program pelatihan yang disesuaikan untuk organisasi. Hubungi kami untuk mendiskusikan kebutuhan Anda.
          </p>
          <Button variant="heroOutline" size="xl" asChild>
            <a href="https://wa.me/6285156803370" target="_blank" rel="noopener noreferrer">
              Hubungi Kami <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && selectedCourse && (
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
                <h3 className="font-semibold text-foreground mb-2">{selectedCourse.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>⏱ {selectedCourse.duration}</span>
                  <span>📊 {selectedCourse.level}</span>
                  <span>🎓 {selectedCourse.type}</span>
                </div>
                <div className="mt-2 text-lg font-bold text-primary">{formatPrice(selectedCourse.price)}</div>
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

export default Courses;