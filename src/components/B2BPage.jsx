import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SEOHead from '@/components/SEOHead';
import { BarChart, Users, Check, School } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const B2BPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', org: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Demande envoyée ! Nous vous recontacterons sous 24h.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead title="CléAvenir pour Établissements et Campus" description="Solution d'orientation pour lycées, universités et CFA. Réduisez le décrochage et améliorez l'insertion." />
      {/* Header removed */}

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Modernisez l'orientation de vos étudiants</h1>
            <p className="text-lg text-slate-300 mb-8">
              Offrez à vos élèves un outil puissant pour construire leur projet pro. Réduisez le stress des équipes pédagogiques.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">Demander une démo (15 min)</Button>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-xl mb-4">Reporting Établissement</h3>
            <div className="space-y-3">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="h-32 bg-slate-700 rounded w-full mt-4 flex items-center justify-center text-slate-500">Graphique Simulation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <BarChart className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Suivi & Reporting</h3>
            <p className="text-slate-600">Suivez l'avancement des vœux et projets de vos cohortes en temps réel.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Autonomie Élève</h3>
            <p className="text-slate-600">Les étudiants avancent à leur rythme grâce au coach IA, libérant du temps aux profs.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <School className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Marque Employeur</h3>
            <p className="text-slate-600">Montrez que votre établissement est à la pointe de l'innovation pédagogique.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Offres Établissements</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Établissement</CardTitle>
                <CardDescription>Pour lycées et petites écoles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">1 200€ <span className="text-sm font-normal text-slate-500">/an</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Jusqu'à 500 élèves</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Accès Premium pour tous</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Dashboard Admin</li>
                </ul>
              </CardContent>
              <CardFooter><Button className="w-full" variant="outline">Choisir</Button></CardFooter>
            </Card>

            <Card className="border-primary shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">Populaire</div>
              <CardHeader>
                <CardTitle>Campus</CardTitle>
                <CardDescription>Pour grandes écoles & CFA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">2 400€ <span className="text-sm font-normal text-slate-500">/an</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Jusqu'à 2000 étudiants</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Marque blanche partielle</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> API Connector</li>
                </ul>
              </CardContent>
              <CardFooter><Button className="w-full bg-primary hover:bg-primary/90">Choisir</Button></CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Territoire</CardTitle>
                <CardDescription>Régions & Académies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">9 900€ <span className="text-sm font-normal text-slate-500">/an</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Élèves illimités</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Déploiement sur mesure</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500"/> Formation équipes</li>
                </ul>
              </CardContent>
              <CardFooter><Button className="w-full" variant="outline">Contacter</Button></CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 container mx-auto px-4 max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Prendre rendez-vous</h2>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Nom complet" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <Input placeholder="Établissement" value={formData.org} onChange={e => setFormData({...formData, org: e.target.value})} required />
              </div>
              <Input type="email" placeholder="Email professionnel" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <Textarea placeholder="Votre besoin..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              <Button type="submit" className="w-full">Envoyer la demande</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default B2BPage;