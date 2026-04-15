import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, FileText, Shield, Cookie, Scale, Globe,
  PenLine, Eye, Save, CheckCircle2, Loader2, Plus,
  Trash2, ArrowLeft, ExternalLink, Clock, Tag,
  ToggleLeft, ToggleRight, Search, Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminService } from '@/services/adminService';
import { getPublicBlogImageUrl } from '@/utils/blogImages';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { cn } from '@/lib/utils';

// ─── Section IDs ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'blog',
    label: 'Blog',
    icon: BookOpen,
    color: 'text-violet-600 bg-violet-50',
    description: 'Articles, actualités, conseils carrière',
  },
  {
    id: 'cgu',
    label: 'Conditions Générales',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50',
    description: 'CGU — Conditions Générales d\'Utilisation',
    legalKey: 'cgu',
    route: '/terms',
  },
  {
    id: 'cookies',
    label: 'Politique des Cookies',
    icon: Cookie,
    color: 'text-amber-600 bg-amber-50',
    description: 'Gestion et information sur les cookies',
    legalKey: 'cookies',
    route: '/legal/cookies',
  },
  {
    id: 'confidentialite',
    label: 'Politique de Confidentialité',
    icon: Shield,
    color: 'text-emerald-600 bg-emerald-50',
    description: 'Protection des données personnelles',
    legalKey: 'confidentialite',
    route: '/privacy',
  },
  {
    id: 'mentions',
    label: 'Mentions Légales',
    icon: Scale,
    color: 'text-rose-600 bg-rose-50',
    description: 'Éditeur, hébergeur, responsabilités',
    legalKey: 'mentions',
    route: '/legal',
  },
  {
    id: 'rgpd',
    label: 'RGPD',
    icon: Globe,
    color: 'text-indigo-600 bg-indigo-50',
    description: 'Droits des utilisateurs, DPO, traitements',
    legalKey: 'rgpd',
    route: '/preferences-rgpd',
  },
];

const LEGAL_DEFAULTS = {
  cgu: `# Conditions Générales d'Utilisation

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}

## 1. Objet
Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme CléAvenir.

## 2. Accès au service
L'accès à CléAvenir est réservé aux personnes physiques majeures ou, pour les mineurs, avec l'autorisation de leurs représentants légaux.

## 3. Création de compte
L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte et à les maintenir à jour.

## 4. Utilisation du service
CléAvenir offre des services d'orientation professionnelle, de tests, de recommandations de formation et d'offres d'emploi. Ces services sont fournis à titre indicatif.

## 5. Propriété intellectuelle
L'ensemble du contenu de CléAvenir (textes, images, algorithmes) est protégé par le droit d'auteur.

## 6. Responsabilité
CléAvenir ne saurait être tenu responsable des décisions professionnelles prises sur la base de ses recommandations.

## 7. Modification des CGU
CléAvenir se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email.`,

  cookies: `# Politique des Cookies

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}

## Qu'est-ce qu'un cookie ?
Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site web.

## Cookies utilisés par CléAvenir

### Cookies essentiels
Nécessaires au fonctionnement du site (session, authentification). Ne peuvent pas être désactivés.

### Cookies analytiques
Nous utilisons des outils d'analyse anonymisés pour améliorer l'expérience utilisateur.

### Cookies de personnalisation
Permettent de mémoriser vos préférences et de personnaliser votre parcours.

## Gestion des cookies
Vous pouvez gérer vos préférences via notre [centre de préférences](/gestion-cookies).

## Durée de conservation
Les cookies ont une durée de vie maximale de 13 mois conformément aux recommandations CNIL.`,

  confidentialite: `# Politique de Confidentialité

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}

## Responsable du traitement
CléAvenir SAS — contact@cleavenir.com

## Données collectées
- Données d'identification (nom, email)
- Données de profil professionnel
- Résultats de tests d'orientation
- Données de navigation anonymisées

## Finalités des traitements
- Fourniture du service d'orientation
- Personnalisation des recommandations
- Amélioration du service
- Communication (avec consentement)

## Base légale
Exécution du contrat, consentement, intérêt légitime.

## Durée de conservation
Les données sont conservées pendant la durée d'utilisation du compte + 3 ans.

## Vos droits
Accès, rectification, effacement, portabilité, opposition — contact@cleavenir.com

## Transferts internationaux
Aucun transfert hors UE sans garanties appropriées.`,

  mentions: `# Mentions Légales

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}

## Éditeur
CléAvenir SAS
Adresse : [À compléter]
Email : contact@cleavenir.com
N° SIRET : [À compléter]

## Directeur de la publication
[Nom du dirigeant]

## Hébergement
Vercel Inc. — 340 Pine Street, Suite 501, San Francisco, CA 94104, USA

## Supabase (Base de données)
Supabase Inc. — données hébergées en Europe (Frankfurt)

## Propriété intellectuelle
© 2024-2026 CléAvenir. Tous droits réservés.
Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.

## Médiation
En cas de litige, vous pouvez recourir à la médiation de la consommation.`,

  rgpd: `# RGPD — Vos Droits et Nos Engagements

**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}

## Notre engagement RGPD
CléAvenir s'engage à traiter vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).

## Délégué à la Protection des Données (DPO)
Email : dpo@cleavenir.com

## Vos droits

### Droit d'accès
Vous pouvez demander une copie de toutes vos données personnelles.

### Droit de rectification
Vous pouvez corriger vos données inexactes depuis votre profil.

### Droit à l'effacement
Vous pouvez demander la suppression de votre compte et de vos données.

### Droit à la portabilité
Vous pouvez exporter vos données dans un format lisible par machine.

### Droit d'opposition
Vous pouvez vous opposer au traitement de vos données à des fins marketing.

## Exercer vos droits
Par email : rgpd@cleavenir.com
Ou via votre espace personnel : [Mes préférences RGPD](/user/rgpd)

## Réclamation
Vous pouvez adresser une réclamation à la CNIL : www.cnil.fr`,
};

// ─── Blog Section ────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const BLOG_CATEGORIES = ['Alternance', 'Conseils', 'Tendances', 'Métiers', 'Actualités', 'Orientation'];

const EMPTY_FORM = {
  title: '', category: 'Conseils', excerpt: '', content: '',
  featured_image: '', author: '', published: false,
};

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'edit'
  const [editingPost, setEditingPost] = useState(null); // null = new
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getBlogsList();
      setPosts(data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditingPost(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setView('edit');
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      category: post.category || 'Conseils',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      author: post.author || '',
      published: post.published || false,
    });
    setImageFile(null);
    setImagePreview(post.featured_image ? getPublicBlogImageUrl(post.featured_image) : null);
    setView('edit');
  };

  const backToList = () => {
    setView('list');
    setEditingPost(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleField = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Format invalide', description: 'JPEG, PNG, WEBP ou GIF uniquement.' });
      e.target.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ variant: 'destructive', title: 'Fichier trop lourd', description: 'Max 5 MB.' });
      e.target.value = '';
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // forcePublish: contourne le problème d'état async React lors de "Sauvegarder et publier"
  const saveArticle = async (forcePublish = null) => {
    if (!formData.title.trim()) { toast({ variant: 'destructive', title: 'Le titre est obligatoire.' }); return; }
    if (!formData.author.trim()) { toast({ variant: 'destructive', title: "L'auteur est obligatoire." }); return; }
    if (!formData.excerpt.trim()) { toast({ variant: 'destructive', title: 'La description courte est obligatoire.' }); return; }
    if (!formData.content.trim()) { toast({ variant: 'destructive', title: 'Le contenu est obligatoire.' }); return; }
    const publishedValue = forcePublish !== null ? forcePublish : formData.published;
    setSaving(true);
    try {
      let imagePath = formData.featured_image;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${ext}`;
        const filePath = `blog-covers/${fileName}`;
        const { error: upErr } = await supabase.storage.from('blog-images').upload(filePath, imageFile);
        if (upErr) throw new Error(`Upload échoué : ${upErr.message}`);
        imagePath = filePath;
      }
      const payload = {
        ...formData,
        published: publishedValue,
        featured_image: imagePath,
        published_at: publishedValue ? new Date().toISOString() : null,
      };
      if (editingPost) {
        await adminService.updateBlog(editingPost.id, payload);
        toast({ title: publishedValue ? 'Article mis à jour et publié !' : 'Article mis à jour !' });
      } else {
        await adminService.createBlog(payload);
        toast({ title: publishedValue ? 'Article créé et publié !' : 'Article créé en brouillon !' });
      }
      await load();
      backToList();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveArticle();
  };

  const togglePublish = async (post, e) => {
    e.stopPropagation();
    try {
      await adminService.updateBlog(post.id, { published: !post.published, published_at: !post.published ? new Date().toISOString() : null });
      toast({ title: post.published ? 'Article dépublié' : 'Article publié !' });
      load();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message });
    }
  };

  const deletePost = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer cet article définitivement ?')) return;
    try {
      await adminService.deleteBlog(id);
      toast({ title: 'Article supprimé' });
      load();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: err.message });
    }
  };

  const filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Editor view ──────────────────────────────────────────────────────────
  if (view === 'edit') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={backToList} className="text-slate-500 gap-1.5">
            <ArrowLeft size={15} /> Retour à la liste
          </Button>
          <span className="text-slate-300">|</span>
          <h3 className="font-semibold text-slate-800">
            {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
          </h3>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          {/* Title */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Titre <span className="text-red-500">*</span></Label>
            <Input
              value={formData.title}
              onChange={e => handleField('title', e.target.value)}
              placeholder="Titre de l'article…"
              className="text-slate-900 bg-white border-slate-200 text-base font-medium"
              required
            />
          </div>

          {/* Category + Author + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Catégorie</Label>
              <Select value={formData.category} onValueChange={v => handleField('category', v)}>
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Auteur <span className="text-red-500">*</span></Label>
              <Input
                value={formData.author}
                onChange={e => handleField('author', e.target.value)}
                placeholder="Nom de l'auteur"
                className="bg-white border-slate-200 text-slate-900"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Statut</Label>
              <Select value={formData.published ? 'published' : 'draft'} onValueChange={v => handleField('published', v === 'published')}>
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description courte <span className="text-red-500">*</span></Label>
            <Textarea
              value={formData.excerpt}
              onChange={e => handleField('excerpt', e.target.value)}
              rows={2}
              placeholder="Résumé affiché dans les listes d'articles…"
              className="bg-white border-slate-200 text-slate-900 resize-none"
              required
            />
          </div>

          {/* Content */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Contenu complet <span className="text-red-500">*</span></Label>
            <Textarea
              value={formData.content}
              onChange={e => handleField('content', e.target.value)}
              rows={14}
              placeholder="Contenu de l'article (Markdown supporté)…"
              className="bg-white border-slate-200 text-slate-900 font-mono text-sm resize-y"
              required
            />
            <p className="text-xs text-slate-400 mt-1.5">Markdown supporté : # Titre, **gras**, *italique*, - liste, [lien](url)</p>
          </div>

          {/* Cover image */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <ImageIcon size={14} /> Image de couverture <span className="text-slate-400 font-normal">(optionnel)</span>
            </Label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="bg-white text-slate-900 border-slate-200"
            />
            <p className="text-xs text-slate-400">JPEG, PNG, WEBP, GIF · Max 5 MB</p>
            {imagePreview && (
              <div className="flex items-start gap-3">
                <img src={imagePreview} alt="Aperçu" className="w-40 h-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 text-xs mt-1"
                  onClick={() => { setImageFile(null); setImagePreview(null); handleField('featured_image', ''); }}
                >
                  <Trash2 size={13} className="mr-1" /> Supprimer
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={backToList} disabled={saving}>
              Annuler
            </Button>
            <div className="flex gap-2">
              {!formData.published && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => saveArticle(true)}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <ToggleRight size={15} className="mr-1.5" /> Sauvegarder et publier
                </Button>
              )}
              <Button
                type="submit"
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Sauvegarde…</> : <><Save size={14} /> Sauvegarder</>}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par titre, catégorie, auteur…"
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5" onClick={openNew}>
          <Plus size={15} /> Nouvel article
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-violet-500 w-6 h-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">{search ? 'Aucun article trouvé.' : 'Aucun article pour l\'instant.'}</p>
          {!search && (
            <Button size="sm" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={openNew}>
              <Plus size={14} className="mr-1" /> Créer le premier article
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Titre</th>
                <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Catégorie</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Auteur</th>
                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="px-5 py-3 text-left font-semibold">Statut</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(post => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openEdit(post)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {post.featured_image ? (
                        <img
                          src={getPublicBlogImageUrl(post.featured_image)}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <BookOpen size={14} className="text-slate-300" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900 truncate max-w-[200px]">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {post.category && (
                      <Badge variant="outline" className="text-[10px]">
                        <Tag size={9} className="mr-1" />{post.category}
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs hidden md:table-cell">{post.author || '—'}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={e => togglePublish(post, e)}
                      title="Changer le statut"
                      className="hover:opacity-80 transition-opacity"
                    >
                      {post.published ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <ToggleRight size={18} /> Publié
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                          <ToggleLeft size={18} /> Brouillon
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {post.slug && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Voir l'article"
                        >
                          <Eye size={14} />
                        </a>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(post); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <PenLine size={14} />
                      </button>
                      <button
                        onClick={e => deletePost(post.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
            {filtered.length} article{filtered.length > 1 ? 's' : ''} · {posts.filter(p => p.published).length} publié{posts.filter(p => p.published).length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Legal Document Editor ────────────────────────────────────────────────────
const LegalEditor = ({ section }) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('edit'); // 'edit' | 'preview'
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('legal_documents')
        .select('content')
        .eq('doc_key', section.legalKey)
        .maybeSingle();
      setContent(data?.content ?? LEGAL_DEFAULTS[section.legalKey] ?? '');
      setLoading(false);
    };
    load();
  }, [section.legalKey]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('legal_documents')
      .upsert({
        doc_key: section.legalKey,
        content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'doc_key' });
    setSaving(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    } else {
      setSaved(true);
      toast({ title: '✓ Document sauvegardé', description: 'Les modifications sont enregistrées.' });
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          {['edit', 'preview'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                tab === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {t === 'edit' ? <><PenLine size={14} className="inline mr-1.5" />Éditer</> : <><Eye size={14} className="inline mr-1.5" />Aperçu</>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {section.route && (
            <a
              href={section.route}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <ExternalLink size={13} /> Voir la page publique
            </a>
          )}
          <Button
            onClick={save}
            disabled={saving}
            size="sm"
            className={cn(
              'gap-1.5 text-sm',
              saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-violet-600 hover:bg-violet-700'
            )}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> :
             saved  ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saving ? 'Sauvegarde…' : saved ? 'Sauvegardé' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Editor / Preview */}
      <AnimatePresence mode="wait">
        {tab === 'edit' ? (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); setSaved(false); }}
              className="w-full h-[480px] font-mono text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-5 resize-none focus:ring-2 focus:ring-violet-300 outline-none leading-relaxed"
              placeholder="Entrez le contenu en Markdown…"
              spellCheck={false}
            />
            <p className="text-xs text-slate-400 mt-2">
              Supporte la syntaxe Markdown : # Titre, ## Sous-titre, **gras**, - liste
            </p>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <iframe
              src={section.route}
              className="w-full h-[480px] rounded-xl border border-slate-200"
              title={`Aperçu — ${section.label}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ContentManagementPage = () => {
  const [activeSection, setActiveSection] = useState('blog');
  const navigate = useNavigate();
  const current = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-slate-500">
            <ArrowLeft size={16} className="mr-1" /> Dashboard
          </Button>
          <div className="h-5 w-px bg-slate-200" />
          <h1 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
            <BookOpen size={20} className="text-violet-600" /> Gestion de contenu
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-7">
          {/* Left nav */}
          <aside className="w-56 shrink-0">
            <nav className="space-y-1 sticky top-24">
              {SECTIONS.map(section => {
                const Icon = section.icon;
                const isActive = section.id === activeSection;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                      isActive
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900',
                    )}
                  >
                    <span className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                      isActive ? 'bg-white/20' : section.color,
                    )}>
                      <Icon size={15} />
                    </span>
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content area */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Section header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center', current?.color)}>
                      {current && <current.icon size={18} />}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">{current?.label}</h2>
                  </div>
                  <p className="text-slate-500 text-sm ml-12">{current?.description}</p>
                </div>

                {/* Section body */}
                {activeSection === 'blog' ? (
                  <BlogSection />
                ) : (
                  <LegalEditor section={current} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;
