import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import api from "@/lib/api";

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    author: string;
    created_at: string;
    thumbnail: string | null;
}

const NewsDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/education/articles/${id}/`);
                setArticle(response.data);
            } catch (err) {
                console.error("Error fetching article:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchArticle();
        }
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            </Layout>
        );
    }

    if (error || !article) {
        return (
            <Layout>
                <div className="container-wide py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
                    <Link to="/news">
                        <Button>Kembali ke Berita</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="pt-24 pb-12 bg-secondary/30">
                <div className="container max-w-4xl">
                    <Link to="/news">
                        <Button variant="ghost" className="mb-6 gap-2 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
                        </Button>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.created_at).toLocaleDateString("id-ID", {
                                day: "numeric", month: "long", year: "numeric"
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {article.author}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                        {article.title}
                    </h1>

                    {article.thumbnail && (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
                            <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </section>
        </Layout>
    );
};

export default NewsDetail;
