export const handleCVSaveError = (error, toast) => {
  console.error('[CV Save Error]', error);
  
  if (error?.code === '22P02' || error?.message?.includes('22P02') || error?.message?.includes('uuid')) {
    toast({
      variant: "destructive",
      title: "Erreur de validation",
      description: "Erreur lors de la sauvegarde du CV. Veuillez réessayer."
    });
    return true;
  }
  
  toast({
    variant: "destructive",
    title: "Erreur",
    description: error?.message || "Une erreur est survenue lors de la sauvegarde du CV."
  });
  return true;
};