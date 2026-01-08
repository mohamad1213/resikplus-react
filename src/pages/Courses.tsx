import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const courses = [
  {
    id: 1,
    title: "Dasar-Dasar Pengelolaan Sampah",
    description: "Pengenalan komprehensif tentang prinsip pengelolaan sampah, mencakup jenis sampah, metode pengumpulan, dan proses pengolahan dasar.",
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
  },
];

const Courses = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const handleRegister = (courseTitle: string) => {
    toast({
      title: "Pendaftaran Berhasil!",
      description: `Anda telah mendaftar untuk ${courseTitle}. Kami akan segera menghubungi Anda.`,
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-sky-light/50 to-background">
        <div className="container-wide">
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
                        <span>{course.students.toLocaleString()} peserta</span>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-2">
                      {course.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/30 p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border">
                    <div className="text-3xl font-bold text-foreground mb-2">{course.price}</div>
                    <p className="text-sm text-muted-foreground mb-6">Akses kursus penuh</p>
                    
                    <Button 
                      size="lg" 
                      className="w-full mb-3"
                      onClick={() => handleRegister(course.title)}
                    >
                      Daftar Sekarang
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      Pelajari Lebih Lanjut
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              Hubungi Kami <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;