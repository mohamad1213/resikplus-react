import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const categories = ["Semua", "Daur Ulang", "Keberlanjutan", "Teknologi", "Komunitas", "Kebijakan"];

const articles = [
  {
    id: 1,
    title: "Indonesia Luncurkan Inisiatif Daur Ulang Nasional 2025",
    excerpt: "Pemerintah mengumumkan program daur ulang komprehensif yang menargetkan pengurangan sampah 70% pada tahun 2030.",
    category: "Kebijakan",
    author: "Tim ResikPlus",
    date: "2 Januari 2025",
    featured: true,
  },
  {
    id: 2,
    title: "Bagaimana AI Mengubah Teknologi Pemilahan Sampah",
    excerpt: "Sistem kecerdasan buatan baru merevolusi cara fasilitas daur ulang memilah dan memproses material.",
    category: "Teknologi",
    author: "Dr. Andi Wijaya",
    date: "28 Desember 2024",
    featured: false,
  },
  {
    id: 3,
    title: "Kisah Sukses Komunitas: Kawasan Zero-Waste Jakarta",
    excerpt: "Bagaimana satu lingkungan mencapai pengurangan sampah yang luar biasa melalui keterlibatan komunitas dan edukasi.",
    category: "Komunitas",
    author: "Siti Nurhaliza",
    date: "25 Desember 2024",
    featured: false,
  },
  {
    id: 4,
    title: "Kebangkitan Ekonomi Sirkular di Asia Tenggara",
    excerpt: "Bisnis regional mengadopsi prinsip ekonomi sirkular untuk mengurangi sampah dan meningkatkan profitabilitas.",
    category: "Keberlanjutan",
    author: "Tim ResikPlus",
    date: "20 Desember 2024",
    featured: false,
  },
  {
    id: 5,
    title: "Teknologi Daur Ulang Plastik Baru Janjikan Pemulihan 95%",
    excerpt: "Teknologi terobosan memungkinkan pemulihan material plastik yang hampir sempurna untuk penggunaan kembali.",
    category: "Daur Ulang",
    author: "Prof. Bambang Susilo",
    date: "18 Desember 2024",
    featured: false,
  },
  {
    id: 6,
    title: "Memahami Extended Producer Responsibility",
    excerpt: "Penjelasan mendalam tentang regulasi EPR dan artinya bagi produsen dan konsumen.",
    category: "Kebijakan",
    author: "Tim ResikPlus",
    date: "15 Desember 2024",
    featured: false,
  },
];

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Berita & Wawasan Lingkungan
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Dapatkan informasi terbaru tentang berita, riset, dan tren dalam 
              keberlanjutan lingkungan dan pengelolaan sampah.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-border sticky top-[72px] bg-background z-40">
        <div className="container-wide">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && selectedCategory === "Semua" && !searchQuery && (
        <section className="section-padding bg-background">
          <div className="container-wide">
            <Link to={`/news/${featuredArticle.id}`} className="block group">
              <div className="card-eco overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto bg-leaf-light/50 flex items-center justify-center">
                    <div className="text-primary/30 text-8xl font-bold">📰</div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                        Unggulan
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-leaf-light text-primary">
                        {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{featuredArticle.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredArticle.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="group card-eco overflow-hidden hover:-translate-y-1"
              >
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  <div className="text-primary/20 text-6xl">📄</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">{article.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {regularArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada artikel yang sesuai dengan kriteria Anda.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Muat Lebih Banyak <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;