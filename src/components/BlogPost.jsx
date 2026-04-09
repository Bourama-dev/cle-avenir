import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageHelmet from "@/components/SEO/PageHelmet";
import { categoryPageSEO } from "@/components/SEO/seoPresets";
import Breadcrumbs from "@/components/Breadcrumbs";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Link as LinkIcon,
  ChevronUp,
  List,
  Sparkles,
  ExternalLink,
} from "lucide-react";

/**
 * Helpers
 */
const stripHtml = (html) =>
  (html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const estimateReadTime = (text) => {
  const words = (text || "").split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220)); // ~220 wpm
  return `${minutes} min`;
};

const buildShareUrls = (title, url) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    twitter: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
  };
};

const BlogPost = ({ onNavigate }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const articleRef = useRef(null);

  // Safe navigation fallback
  const handleNavigate = (path) => {
    if (onNavigate) onNavigate(path);
    else navigate(path);
  };

  const post = useMemo(() => blogPosts.find((p) => p.slug === slug), [slug]);

  // ===== UX States
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [toc, setToc] = useState([]); // { id, text, level }
  const [tocOpen, setTocOpen] = useState(true);

  // ===== Derived
  const plainText = useMemo(() => stripHtml(post?.content), [post]);
  const computedReadTime = useMemo(() => estimateReadTime(plainText), [plainText]);

  // Related posts (same category first)
  const related = useMemo(() => {
    if (!post) return [];
    const sameCategory = blogPosts
      .filter((p) => p.slug !== post.slug && p.category === post.category)
      .slice(0, 3);

    if (sameCategory.length >= 3) return sameCategory;

    const fallback = blogPosts
      .filter((p) => p.slug !== post.slug && p.category !== post.category)
      .slice(0, 3 - sameCategory.length);

    return [...sameCategory, ...fallback];
  }, [post]);

  // Build ToC from headings inside HTML content
  useEffect(() => {
    if (!post?.content) return;

    // Build a temporary container to parse headings
    const container = document.createElement("div");
    container.innerHTML = post.content;

    const headings = Array.from(container.querySelectorAll("h2, h3"));
    const items = headings.map((h, idx) => {
      const text = (h.textContent || "").trim();
      const level = h.tagName === "H2" ? 2 : 3;
      const id = `section-${idx}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
      return { id, text, level };
    });

    setToc(items);
  }, [post]);

  // Apply ids to real DOM headings after render
  useEffect(() => {
    if (!articleRef.current) return;
    const headings = articleRef.current.querySelectorAll("h2, h3");
    headings.forEach((h, idx) => {
      const text = (h.textContent || "").trim();
      const id = `section-${idx}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
      h.id = id;
      h.style.scrollMarginTop = "110px";
    });
  }, [toc]);

  // Reading progress + "back to top"
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // progress based on article element
      const total = el.scrollHeight - windowH;
      const scrolled = Math.min(Math.max(window.scrollY - el.offsetTop + 120, 0), total);
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;

      setProgress(pct);
      setShowTop(window.scrollY > 600);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Copy link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // fallback minimal sans toast (tu peux brancher ton useToast si tu veux)
      alert("Lien copié !");
    } catch {
      alert("Impossible de copier le lien.");
    }
  };

  const shareNative = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url: window.location.href });
      } else {
        await copyLink();
      }
    } catch {
      // ignore user cancel
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Article introuvable</h1>
          <p className="text-slate-500 mb-6">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
          <Button onClick={() => handleNavigate("/blog")} className="bg-primary hover:bg-primary/90">
            Retour au blog
          </Button>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareUrls = buildShareUrls(post.title, currentUrl);

  const blogPostSEO = categoryPageSEO({
    title: post.title,
    description: post.excerpt,
    image: post.image,
    category: post.category,
    categoryPath: `/blog/${post.slug}`
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHelmet {...blogPostSEO} schemaType="article" publishedTime={post.date} modifiedTime={post.updatedAt || post.date} author={post.author} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <div className="h-1 bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs
          items={[
            { label: "Blog", path: "/blog" },
            {
              label: post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title,
              path: `/blog/${post.slug}`,
            },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-4">
          {/* ===== Article */}
          <article className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Image */}
            <div className="relative h-64 md:h-96 w-full">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                <Badge className="bg-primary hover:bg-primary mb-4 border-none text-white px-3 py-1">
                  {post.category}
                </Badge>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-slate-100 font-medium">
                  <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <User className="w-4 h-4" /> {post.author}
                  </span>
                  <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Clock className="w-4 h-4" /> {post.readTime || computedReadTime} de lecture
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-12">
              <div className="max-w-3xl mx-auto">
                {/* Excerpt */}
                <p className="text-xl md:text-2xl font-serif text-slate-600 mb-10 italic leading-relaxed border-l-4 border-primary pl-6">
                  {post.excerpt}
                </p>

                {/* Main Body */}
                <div
                  ref={articleRef}
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:font-bold prose-headings:text-slate-900
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-li:text-slate-600 prose-ul:my-6
                    prose-a:text-primary hover:prose-a:text-primary/80
                    prose-strong:text-slate-800
                    prose-img:rounded-2xl prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA CléAvenir */}
                <Card className="mt-12 border-slate-200">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          Passe à l’action avec CléAvenir
                        </h3>
                        <p className="text-slate-600 mt-1">
                          Fais le test d’orientation et reçois un plan concret : métiers compatibles, étapes,
                          formations et prochaines actions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button className="bg-primary hover:bg-primary/90" onClick={() => handleNavigate("/test")}>
                            Faire le test
                          </Button>
                          <Button variant="outline" onClick={() => handleNavigate("/metiers")}>
                            Explorer les métiers
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Share bar */}
                <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate("/blog")}
                    className="border-slate-300 hover:bg-white hover:text-primary"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour au blog
                  </Button>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-500 mr-1">Partager :</span>

                    <Button variant="outline" size="icon" className="rounded-full" onClick={shareNative} title="Partager">
                      <Share2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={copyLink}
                      title="Copier le lien"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>

                    <a href={shareUrls.linkedin} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="rounded-full">
                        LinkedIn <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>

                    <a href={shareUrls.twitter} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="rounded-full">
                        X <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>

                    <a href={shareUrls.whatsapp} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="rounded-full">
                        WhatsApp <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ===== Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
            {/* Sommaire */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <List className="h-4 w-4 text-slate-500" /> Sommaire
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setTocOpen(!tocOpen)}>
                    {tocOpen ? "Masquer" : "Afficher"}
                  </Button>
                </div>

                {tocOpen && (
                  <div className="mt-3 space-y-2">
                    {toc.length === 0 ? (
                      <p className="text-sm text-slate-500">Aucun titre détecté.</p>
                    ) : (
                      toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm text-slate-700 hover:text-primary transition ${
                            item.level === 3 ? "pl-4" : ""
                          }`}
                        >
                          {item.text}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Articles liés */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="font-bold text-slate-900 mb-3">À lire ensuite</div>
                <div className="space-y-3">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/blog/${p.slug}`}
                      className="block p-3 rounded-2xl border border-slate-200 hover:border-primary/40 hover:bg-slate-50 transition"
                    >
                      <div className="text-xs text-slate-500 mb-1">{p.category}</div>
                      <div className="font-semibold text-slate-900 leading-snug">{p.title}</div>
                      <div className="text-sm text-slate-600 mt-1 line-clamp-2">{p.excerpt}</div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mini CTA */}
            <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-5">
                <div className="font-bold text-slate-900">Découvre ton métier</div>
                <p className="text-sm text-slate-600 mt-1">
                  Test IA + recommandations concrètes + plan d’action.
                </p>
                <Button className="mt-3 w-full bg-primary hover:bg-primary/90" onClick={() => handleNavigate("/test")}>
                  Lancer le test
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:text-primary transition z-40"
          title="Remonter"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default BlogPost;