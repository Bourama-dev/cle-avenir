import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EstablishmentForm from './EstablishmentForm';

const EstablishmentModal = ({ isOpen, onClose, establishment, onSave }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{establishment ? 'Modifier l\'établissement' : 'Ajouter un établissement'}</DialogTitle>
          <DialogDescription>
            {establishment ? 'Modifiez les informations ci-dessous.' : 'Remplissez les informations pour créer un nouvel établissement.'}
          </DialogDescription>
        </DialogHeader>
        <EstablishmentForm 
          initialData={establishment} 
          onSubmit={onSave} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EstablishmentModal;