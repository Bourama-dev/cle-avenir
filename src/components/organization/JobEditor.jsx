import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const JobEditor = ({ isOpen, onClose, onSave, initialData = null, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        contract_type: 'CDI',
        salary_range: '',
        remote_policy: 'onsite',
        experience_level: 'junior',
        status: 'active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                location: initialData.location || '',
                contract_type: initialData.contract_type || 'CDI',
                salary_range: initialData.salary_range || '',
                remote_policy: initialData.remote_policy || 'onsite',
                experience_level: initialData.experience_level || 'junior',
                status: initialData.status || 'active'
            });
        } else {
            setFormData({
                title: '', description: '', location: '', contract_type: 'CDI',
                salary_range: '', remote_policy: 'onsite', experience_level: 'junior', status: 'active'
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Modifier l'annonce" : "Créer une nouvelle annonce"}</DialogTitle>
                    <DialogDescription>
                        Remplissez les détails du poste pour attirer les meilleurs talents.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Intitulé du poste</Label>
                        <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required placeholder="ex: Développeur React Senior" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contract">Type de contrat</Label>
                            <Select value={formData.contract_type} onValueChange={(val) => setFormData({...formData, contract_type: val})}>
                                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CDI">CDI</SelectItem>
                                    <SelectItem value="CDD">CDD</SelectItem>
                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                    <SelectItem value="Stage">Stage</SelectItem>
                                    <SelectItem value="Alternance">Alternance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Lieu</Label>
                            <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Paris, France" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salary">Fourchette Salaire</Label>
                            <Input id="salary" value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} placeholder="ex: 45k - 55k €" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="remote">Télétravail</Label>
                            <Select value={formData.remote_policy} onValueChange={(val) => setFormData({...formData, remote_policy: val})}>
                                <SelectTrigger><SelectValue placeholder="Politique" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="onsite">Sur site</SelectItem>
                                    <SelectItem value="hybrid">Hybride</SelectItem>
                                    <SelectItem value="remote">Full Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description du poste</Label>
                        <Textarea 
                            id="description" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            className="h-32" 
                            placeholder="Détaillez les missions, les compétences requises..." 
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Mettre à jour" : "Publier l'annonce"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JobEditor;