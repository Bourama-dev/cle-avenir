import { supabase } from '@/lib/customSupabaseClient';

export const adminService = {
  // BLOGS
  async getBlogsList() {
    const { data, error } = await supabase.from('blog_articles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createBlog(blogData) {
    const { data, error } = await supabase.from('blog_articles').insert([{...blogData, slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}]).select();
    if (error) throw error;
    return data[0];
  },
  async updateBlog(id, blogData) {
    const { data, error } = await supabase.from('blog_articles').update(blogData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  async deleteBlog(id) {
    const { error } = await supabase.from('blog_articles').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // FORMATIONS
  async getFormationsList() {
    const { data, error } = await supabase.from('formations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createFormation(formationData) {
    const { data, error } = await supabase.from('formations').insert([{...formationData, slug: formationData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}]).select();
    if (error) throw error;
    return data[0];
  },
  async updateFormation(id, formationData) {
    const { data, error } = await supabase.from('formations').update(formationData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  async deleteFormation(id) {
    const { error } = await supabase.from('formations').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // METIERS (Professions)
  async getMetiersList() {
    const { data, error } = await supabase.from('professions').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createMetier(metierData) {
    const { data, error } = await supabase.from('professions').insert([metierData]).select();
    if (error) throw error;
    return data[0];
  },
  async updateMetier(id, metierData) {
    const { data, error } = await supabase.from('professions').update(metierData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  async deleteMetier(id) {
    const { error } = await supabase.from('professions').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // OFFRES (Job Offers)
  async getOffresList() {
    const { data, error } = await supabase.from('job_offers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async createOffre(offreData) {
    const { data, error } = await supabase.from('job_offers').insert([{...offreData, slug: offreData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}]).select();
    if (error) throw error;
    return data[0];
  },
  async updateOffre(id, offreData) {
    const { data, error } = await supabase.from('job_offers').update(offreData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  async deleteOffre(id) {
    const { error } = await supabase.from('job_offers').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};