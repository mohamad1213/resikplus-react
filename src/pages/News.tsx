import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import api from "@/lib/api";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  featured: boolean;
}

const categories = ["Semua", "Daur Ulang", "Keberlanjutan", "Teknologi", "Komunitas", "Kebijakan"];

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/education/articles/');
        // Filter only Published articles if logic requires, but backend returns all.
        // Assuming we want to show only Published ones:
        const publishedArticles = response.data.filter((item: any) => item.status === 'Published');

        const formattedData = publishedArticles.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.content ? item.content.substring(0, 150) + "..." : ""),
          category: item.category,
          author: item.author,
          date: new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
          }),
          featured: item.is_featured,
        }));
        setArticles(formattedData);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
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