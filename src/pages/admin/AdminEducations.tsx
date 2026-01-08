import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getTopics } from "@/lib/education";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
}

interface Topic {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  articles: Article[];
}

const Education = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Edukasi Lingkungan</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-6 border rounded-xl hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-primary" />
              <h2 className="text-xl font-semibold">{topic.title}</h2>
            </div>

            <p className="text-muted-foreground mb-4">
              {topic.description}
            </p>

            <ul className="space-y-2">
              {topic.articles.map((article) => (
                <li key={article.id}>
                  <Link
                    to={`/education/${article.slug}`}
                    className="text-primary hover:underline"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
