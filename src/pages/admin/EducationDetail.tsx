import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getArticleDetail } from "@/lib/education";

interface Article {
  title: string;
  content: string;
  topic: string;
  created_at: string;
}

const EducationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (slug) {
      getArticleDetail(slug).then(setArticle);
    }
  }, [slug]);

  if (!article) return <p>Loading...</p>;

  return (
    <section className="container py-10 max-w-3xl">
      <Link
        to="/education"
        className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Edukasi
      </Link>

      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {article.topic} • {new Date(article.created_at).toLocaleDateString()}
      </p>

      <article className="prose prose-lg max-w-none">
        {article.content}
      </article>
    </section>
  );
};

export default EducationDetail;
