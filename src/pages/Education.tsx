import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Leaf, Recycle, Trash2, RefreshCw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const educationTopics = [
  {
    icon: Leaf,
    title: "Kebersihan Lingkungan",
    description: "Pelajari dasar-dasar menjaga lingkungan yang bersih dan dampaknya terhadap kesehatan masyarakat dan ekosistem.",
    articles: [
      "Pentingnya Kebersihan Lingkungan",
      "Bagaimana Polusi Mempengaruhi Kehidupan Sehari-hari",
      "Langkah Sederhana Menjaga Kebersihan Sekitar",
      "Praktik Terbaik Bersih-Bersih Komunitas",
    ],
  },
  {
    icon: Trash2,
    title: "Pemilahan & Pengelolaan Sampah",
    description: "Kuasai seni pemilahan sampah yang tepat dan pahami siklus hidup pengelolaan sampah.",
    articles: [
      "Memahami Kategori Sampah",
      "Cara Memilah Sampah di Rumah",
      "Panduan Pengelolaan Limbah Industri",
      "Perjalanan Sampah: Dari Tong ke Fasilitas",
    ],
  },
  {
    icon: Recycle,
    title: "Proses Daur Ulang",
    description: "Temukan bagaimana material daur ulang diproses dan diubah menjadi produk baru.",
    articles: [
      "Penjelasan Proses Daur Ulang",
      "Jenis-Jenis Material yang Dapat Didaur Ulang",
      "Dari Sampah ke Sumber Daya: Kisah Sukses",
      "Memulai Inisiatif Daur Ulang",
    ],
  },
  {
    icon: RefreshCw,
    title: "Ekonomi Sirkular",
    description: "Jelajahi prinsip-prinsip ekonomi sirkular dan bagaimana menciptakan model bisnis berkelanjutan.",
    articles: [
      "Apa Itu Ekonomi Sirkular?",
      "Model Bisnis untuk Keberlanjutan",
      "Mengurangi Sampah Melalui Desain",
      "Studi Kasus: Perusahaan Sirkular yang Sukses",
    ],
  },
];

const Education = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-leaf-light/50 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Edukasi Lingkungan
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pelajari Tentang Keberlanjutan Lingkungan
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jelajahi sumber daya edukasi komprehensif kami tentang kebersihan lingkungan, 
              pengelolaan sampah, daur ulang, dan ekonomi sirkular.
            </p>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="space-y-16">
            {educationTopics.map((topic, index) => (
              <div key={index} className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:sticky lg:top-24">
                  <div className="w-16 h-16 rounded-2xl bg-leaf-light flex items-center justify-center mb-4">
                    <topic.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{topic.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{topic.description}</p>
                </div>
                
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
                  {topic.articles.map((article, articleIndex) => (
                    <Link
                      key={articleIndex}
                      to={`/education/${topic.title.toLowerCase().replace(/\s+/g, "-")}/${article.toLowerCase().replace(/\s+/g, "-")}`}
                      className="group card-eco p-6 hover:-translate-y-1"
                    >
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {article}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Baca artikel</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="card-eco overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto bg-primary/10 flex items-center justify-center">
                <Globe className="w-24 h-24 text-primary/30" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-sm text-primary font-medium mb-2">Artikel Unggulan</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Masa Depan Pengelolaan Sampah di Indonesia
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Temukan bagaimana teknologi inovatif dan inisiatif komunitas mengubah 
                  praktik pengelolaan sampah di seluruh Indonesia, menciptakan peluang baru 
                  untuk keberlanjutan dan pertumbuhan ekonomi.
                </p>
                <Button size="lg" className="w-fit">
                  Baca Artikel Lengkap <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Belajar Lebih Banyak?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Daftar kursus profesional kami dan dapatkan sertifikasi dalam manajemen lingkungan.
          </p>
          <Button variant="heroOutline" size="xl" asChild>
            <Link to="/courses">Jelajahi Kursus</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Education;