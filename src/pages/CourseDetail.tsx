import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, Users, Award, CheckCircle, ArrowRight, ArrowLeft, 
  BookOpen, Target, GraduationCap, Play, Lock, Star,
  Calendar, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  students: number;
  price: string;
  features: string[];
  type: string;
  curriculum: {
    module: string;
    lessons: string[];
    duration: string;
  }[];
  learningPath: string[];
  benefits: string[];
  requirements: string[];
  instructor: {
    name: string;
    role: string;
    bio: string;
  };
}

const coursesData: Course[] = [
  {
    id: 1,
    title: "Dasar-Dasar Pengelolaan Sampah",
    description: "Pengenalan komprehensif tentang prinsip pengelolaan sampah, mencakup jenis sampah, metode pengumpulan, dan proses pengolahan dasar. Kursus ini dirancang untuk memberikan pemahaman fundamental yang kuat tentang industri pengelolaan sampah.",
    duration: "4 minggu",
    level: "Pemula",
    students: 1250,
    price: "Rp 1.500.000",
    features: [
      "Memahami kategori sampah",
      "Metode pengumpulan dan transportasi",
      "Proses pengolahan dasar",
      "Kepatuhan regulasi",
      "Sertifikat setelah selesai",
    ],
    type: "Online",
    curriculum: [
      {
        module: "Modul 1: Pengenalan Sampah",
        lessons: ["Definisi dan klasifikasi sampah", "Dampak lingkungan", "Regulasi nasional"],
        duration: "1 minggu"
      },
      {
        module: "Modul 2: Metode Pengumpulan",
        lessons: ["Sistem pengumpulan rumah tangga", "Pengumpulan industri", "Teknologi transportasi"],
        duration: "1 minggu"
      },
      {
        module: "Modul 3: Pengolahan Dasar",
        lessons: ["Sorting dan pemilahan", "Komposting dasar", "Penimbunan saniter"],
        duration: "1 minggu"
      },
      {
        module: "Modul 4: Praktik & Sertifikasi",
        lessons: ["Studi kasus", "Proyek akhir", "Ujian sertifikasi"],
        duration: "1 minggu"
      }
    ],
    learningPath: [
      "Memahami konsep dasar pengelolaan sampah",
      "Mempelajari metode pengumpulan dan transportasi",
      "Menguasai teknik pengolahan dasar",
      "Mengerjakan proyek praktik",
      "Mendapatkan sertifikasi"
    ],
    benefits: [
      "Sertifikat resmi yang diakui industri",
      "Akses materi pembelajaran selamanya",
      "Networking dengan profesional lingkungan",
      "Peluang karir di sektor pengelolaan sampah",
      "Kontribusi nyata untuk lingkungan"
    ],
    requirements: [
      "Tidak ada persyaratan khusus",
      "Akses internet stabil",
      "Komitmen belajar 5-7 jam per minggu"
    ],
    instructor: {
      name: "Dr. Ahmad Sustani",
      role: "Environmental Specialist",
      bio: "20+ tahun pengalaman di bidang pengelolaan lingkungan"
    }
  },
  {
    id: 2,
    title: "Teknik Daur Ulang Industri",
    description: "Pelajari metode daur ulang tingkat lanjut yang digunakan dalam lingkungan industri, termasuk pemulihan material, teknologi pemrosesan, dan kontrol kualitas.",
    duration: "6 minggu",
    level: "Menengah",
    students: 856,
    price: "Rp 2.500.000",
    features: [
      "Identifikasi dan pemilahan material",
      "Pengoperasian peralatan pemrosesan",
      "Standar kontrol kualitas",
      "Protokol keselamatan",
      "Sesi praktik langsung",
    ],
    type: "Hybrid",
    curriculum: [
      {
        module: "Modul 1: Material Recovery",
        lessons: ["Jenis material daur ulang", "Teknologi identifikasi", "Nilai ekonomi material"],
        duration: "1 minggu"
      },
      {
        module: "Modul 2: Teknologi Pemrosesan",
        lessons: ["Mesin pencacah", "Mesin pres", "Sistem conveyor"],
        duration: "2 minggu"
      },
      {
        module: "Modul 3: Kontrol Kualitas",
        lessons: ["Standar kualitas output", "Pengujian material", "Sertifikasi produk"],
        duration: "1 minggu"
      },
      {
        module: "Modul 4: Keselamatan & Praktik",
        lessons: ["K3 di fasilitas daur ulang", "Praktik lapangan", "Proyek akhir"],
        duration: "2 minggu"
      }
    ],
    learningPath: [
      "Menguasai identifikasi material",
      "Mempelajari teknologi pemrosesan",
      "Memahami standar kualitas",
      "Praktik di fasilitas nyata",
      "Sertifikasi profesional"
    ],
    benefits: [
      "Sertifikat profesional tingkat menengah",
      "Praktik langsung di fasilitas mitra",
      "Koneksi dengan industri daur ulang",
      "Peluang magang di perusahaan partner",
      "Update materi setiap tahun"
    ],
    requirements: [
      "Pemahaman dasar pengelolaan sampah",
      "Usia minimal 18 tahun",
      "Bersedia mengikuti sesi praktik offline"
    ],
    instructor: {
      name: "Ir. Budi Recycling",
      role: "Industrial Recycling Expert",
      bio: "Mantan direktur operasional perusahaan daur ulang nasional"
    }
  },
  {
    id: 3,
    title: "Strategi Ekonomi Sirkular",
    description: "Kuasai prinsip ekonomi sirkular dan pelajari cara menerapkan model bisnis berkelanjutan yang meminimalkan sampah.",
    duration: "8 minggu",
    level: "Lanjutan",
    students: 428,
    price: "Rp 3.500.000",
    features: [
      "Desain model bisnis sirkular",
      "Penilaian siklus hidup",
      "Optimisasi rantai pasok",
      "Keterlibatan pemangku kepentingan",
      "Workshop studi kasus",
    ],
    type: "Online",
    curriculum: [
      {
        module: "Modul 1: Prinsip Ekonomi Sirkular",
        lessons: ["Konsep dan framework", "Perbandingan ekonomi linear", "Studi kasus global"],
        duration: "2 minggu"
      },
      {
        module: "Modul 2: Life Cycle Assessment",
        lessons: ["Metodologi LCA", "Software LCA", "Interpretasi hasil"],
        duration: "2 minggu"
      },
      {
        module: "Modul 3: Circular Business Model",
        lessons: ["Product-as-a-Service", "Sharing economy", "Remanufacturing"],
        duration: "2 minggu"
      },
      {
        module: "Modul 4: Implementasi & Strategi",
        lessons: ["Stakeholder engagement", "Change management", "Proyek implementasi"],
        duration: "2 minggu"
      }
    ],
    learningPath: [
      "Memahami framework ekonomi sirkular",
      "Menguasai Life Cycle Assessment",
      "Merancang circular business model",
      "Menyusun strategi implementasi",
      "Mempresentasikan proyek akhir"
    ],
    benefits: [
      "Sertifikat tingkat lanjutan",
      "Akses ke komunitas profesional eksklusif",
      "Mentoring personal dari ahli",
      "Template dan tools business model",
      "Rekomendasi untuk posisi manajerial"
    ],
    requirements: [
      "Pengalaman minimal 2 tahun di bidang terkait",
      "Lulus kursus menengah atau setara",
      "Kemampuan bahasa Inggris pasif"
    ],
    instructor: {
      name: "Prof. Circular Economy",
      role: "Circular Economy Consultant",
      bio: "Konsultan ekonomi sirkular untuk perusahaan Fortune 500"
    }
  },
  {
    id: 4,
    title: "Program Keberlanjutan UMKM",
    description: "Program khusus untuk usaha kecil dan menengah yang ingin menerapkan praktik berkelanjutan dan strategi pengurangan sampah.",
    duration: "5 minggu",
    level: "Pemula",
    students: 672,
    price: "Rp 2.000.000",
    features: [
      "Penilaian keberlanjutan",
      "Strategi pengurangan sampah",
      "Analisis biaya-manfaat",
      "Peta jalan implementasi",
      "Dukungan berkelanjutan",
    ],
    type: "Online",
    curriculum: [
      {
        module: "Modul 1: Sustainability Assessment",
        lessons: ["Audit lingkungan UMKM", "Identifikasi peluang", "Baseline measurement"],
        duration: "1 minggu"
      },
      {
        module: "Modul 2: Strategi Pengurangan",
        lessons: ["3R untuk UMKM", "Supplier engagement", "Customer education"],
        duration: "1.5 minggu"
      },
      {
        module: "Modul 3: Business Case",
        lessons: ["Cost-benefit analysis", "ROI sustainability", "Funding options"],
        duration: "1 minggu"
      },
      {
        module: "Modul 4: Implementasi",
        lessons: ["Action planning", "Monitoring & evaluation", "Continuous improvement"],
        duration: "1.5 minggu"
      }
    ],
    learningPath: [
      "Melakukan penilaian keberlanjutan",
      "Merancang strategi pengurangan sampah",
      "Menyusun business case",
      "Mengimplementasikan program",
      "Mengukur dan melaporkan hasil"
    ],
    benefits: [
      "Sertifikat UMKM Berkelanjutan",
      "Template dokumen siap pakai",
      "Konsultasi gratis 3 bulan",
      "Akses ke jaringan UMKM hijau",
      "Bantuan akses pasar ramah lingkungan"
    ],
    requirements: [
      "Pemilik atau pengelola UMKM",
      "UMKM sudah beroperasi minimal 6 bulan",
      "Komitmen untuk implementasi"
    ],
    instructor: {
      name: "Ibu Sustainability",
      role: "SME Sustainability Advisor",
      bio: "Pendamping 500+ UMKM menuju praktik berkelanjutan"
    }
  },
  {
    id: 5,
    title: "Petugas Kepatuhan Lingkungan",
    description: "Pelatihan komprehensif untuk profesional yang bertanggung jawab atas kepatuhan lingkungan dan manajemen regulasi.",
    duration: "10 minggu",
    level: "Lanjutan",
    students: 312,
    price: "Rp 5.000.000",
    features: [
      "Regulasi lingkungan",
      "Audit dan pelaporan",
      "Manajemen risiko",
      "Perencanaan tindakan korektif",
      "Sertifikasi profesional",
    ],
    type: "Hybrid",
    curriculum: [
      {
        module: "Modul 1: Regulasi Lingkungan",
        lessons: ["UU & PP Lingkungan Hidup", "Peraturan sektoral", "Standar internasional"],
        duration: "2 minggu"
      },
      {
        module: "Modul 2: Audit Lingkungan",
        lessons: ["ISO 14001", "Teknik audit", "Dokumentasi"],
        duration: "2.5 minggu"
      },
      {
        module: "Modul 3: Manajemen Risiko",
        lessons: ["Risk assessment", "Mitigasi", "Emergency response"],
        duration: "2 minggu"
      },
      {
        module: "Modul 4: Pelaporan & Compliance",
        lessons: ["Sustainability reporting", "Proper & Adipura", "Legal compliance"],
        duration: "2 minggu"
      },
      {
        module: "Modul 5: Sertifikasi",
        lessons: ["Review materi", "Simulasi ujian", "Ujian sertifikasi"],
        duration: "1.5 minggu"
      }
    ],
    learningPath: [
      "Menguasai regulasi lingkungan",
      "Melakukan audit lingkungan",
      "Mengelola risiko lingkungan",
      "Menyusun laporan kepatuhan",
      "Mendapatkan sertifikasi profesional"
    ],
    benefits: [
      "Sertifikasi Petugas Kepatuhan Lingkungan",
      "Pengakuan oleh Kementerian LHK",
      "Akses ke database regulasi terupdate",
      "Jaringan profesional compliance officer",
      "Jaminan penempatan kerja"
    ],
    requirements: [
      "S1 Lingkungan/Teknik atau setara",
      "Pengalaman kerja minimal 3 tahun",
      "Rekomendasi dari perusahaan/institusi"
    ],
    instructor: {
      name: "Dr. Legal Compliance",
      role: "Environmental Law Expert",
      bio: "Mantan pejabat Kementerian LHK dan konsultan hukum lingkungan"
    }
  },
  {
    id: 6,
    title: "Workshop Daur Ulang Komunitas",
    description: "Pelajari cara mengorganisir dan menjalankan program daur ulang yang efektif di komunitas Anda dengan workshop praktis ini.",
    duration: "2 minggu",
    level: "Pemula",
    students: 2100,
    price: "Rp 750.000",
    features: [
      "Strategi keterlibatan komunitas",
      "Perencanaan program",
      "Manajemen sumber daya",
      "Pengukuran dampak",
      "Peluang networking",
    ],
    type: "Offline",
    curriculum: [
      {
        module: "Hari 1-3: Perencanaan",
        lessons: ["Community mapping", "Stakeholder analysis", "Program design"],
        duration: "3 hari"
      },
      {
        module: "Hari 4-7: Implementasi",
        lessons: ["Mobilisasi komunitas", "Setup collection points", "Training volunteers"],
        duration: "4 hari"
      },
      {
        module: "Hari 8-10: Operasional",
        lessons: ["Daily operations", "Troubleshooting", "Quality control"],
        duration: "3 hari"
      },
      {
        module: "Hari 11-14: Evaluasi",
        lessons: ["Impact measurement", "Reporting", "Sustainability planning"],
        duration: "4 hari"
      }
    ],
    learningPath: [
      "Merencanakan program komunitas",
      "Melaksanakan mobilisasi",
      "Mengelola operasional harian",
      "Mengukur dampak program",
      "Menyusun rencana keberlanjutan"
    ],
    benefits: [
      "Sertifikat Fasilitator Daur Ulang Komunitas",
      "Starter kit untuk program komunitas",
      "Pendampingan 6 bulan pasca workshop",
      "Akses ke platform komunitas nasional",
      "Pengalaman praktik langsung"
    ],
    requirements: [
      "Berdomisili di area workshop",
      "Aktif di kegiatan komunitas",
      "Bersedia menjadi volunteer setelah lulus"
    ],
    instructor: {
      name: "Kak Community",
      role: "Community Organizer",
      bio: "Founder bank sampah terbesar di Indonesia Timur"
    }
  }
];

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'benefits' | 'instructor'>('curriculum');

  const course = coursesData.find(c => c.id === Number(id));

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/course/${id}`
      }
    });
    
    if (error) {
      toast({
        title: "Login Gagal",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleRegister = () => {
    if (!course) return;
    
    const message = `Halo Resikplus! 👋

Saya ingin mendaftar kursus:

📚 *${course.title}*
⏱ Durasi: ${course.duration}
📊 Level: ${course.level}
💰 Biaya: ${course.price}

*Data Pendaftar:*
👤 Nama: ${user?.user_metadata?.full_name || user?.email}
📧 Email: ${user?.email}

Mohon informasi lebih lanjut mengenai jadwal dan pembayaran. Terima kasih!`;

    const whatsappUrl = `https://wa.me/6281288866107?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Pendaftaran Dikirim!",
      description: "Anda akan diarahkan ke WhatsApp untuk konfirmasi.",
    });
  };

  if (!course) {
    return (
      <Layout>
        <div className="section-padding container-wide text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Kursus Tidak Ditemukan</h1>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kursus
          </Button>
        </div>
      </Layout>
    );
  }

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
                  <span>{course.students.toLocaleString()} peserta</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>{course.curriculum.length} modul</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>{course.type}</span>
                </div>
              </div>
            </div>
            
            {/* Pricing Card */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 h-fit sticky top-24">
              <div className="text-3xl font-bold text-foreground mb-2">{course.price}</div>
              <p className="text-sm text-muted-foreground mb-6">Akses kursus penuh + sertifikat</p>
              
              {user ? (
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleRegister}
                  >
                    Daftar Sekarang via WhatsApp
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/course/${id}/modules`)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lihat Modul Kursus
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Login dengan Google untuk Daftar"}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/course/${id}/modules`)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Preview Modul Kursus
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Masuk dengan akun Google untuk proses pendaftaran yang lebih aman dan cepat
                  </p>
                </div>
              )}
              
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <h4 className="font-semibold text-foreground mb-3">Yang Anda Dapatkan:</h4>
                {course.features.map((feature, index) => (
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key 
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
                    {course.learningPath.map((step, index) => (
                      <div key={index} className="relative pb-8 last:pb-0">
                        <div className="absolute left-0 top-0 w-6 h-6 -translate-x-1/2 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        {index !== course.learningPath.length - 1 && (
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
                    {course.curriculum.map((module, index) => (
                      <div key={index} className="border border-border rounded-xl overflow-hidden">
                        <div className="bg-secondary/50 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Play className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{module.module}</h3>
                              <p className="text-xs text-muted-foreground">{module.duration}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{module.lessons.length} pelajaran</span>
                        </div>
                        <div className="p-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                              {user ? (
                                <CheckCircle className="w-4 h-4 text-primary" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                              <span>{lesson}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Requirements */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Persyaratan</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
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
                  {course.benefits.map((benefit, index) => (
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
                    Bergabung dengan {course.students.toLocaleString()}+ peserta lain yang sudah mengikuti kursus ini.
                  </p>
                  {user ? (
                    <Button size="lg" onClick={handleRegister}>
                      Daftar Sekarang
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleGoogleLogin} disabled={loading}>
                      {loading ? "Memproses..." : "Login dengan Google untuk Daftar"}
                    </Button>
                  )}
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
                    <h3 className="text-xl font-bold text-foreground">{course.instructor.name}</h3>
                    <p className="text-primary font-medium mb-2">{course.instructor.role}</p>
                    <p className="text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
                    <div className="text-3xl font-bold text-primary">{course.students.toLocaleString()}+</div>
                    <p className="text-sm text-muted-foreground">Peserta Terlatih</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
                    <div className="text-3xl font-bold text-primary">4.8</div>
                    <p className="text-sm text-muted-foreground">Rating Rata-rata</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
                    <div className="text-3xl font-bold text-primary">{course.curriculum.length}</div>
                    <p className="text-sm text-muted-foreground">Modul Pembelajaran</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetail;
