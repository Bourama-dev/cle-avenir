export const formatUserRole = (role) => {
  switch (role) {
    case 'admin': return 'Administrateur';
    case 'teacher': return 'Enseignant';
    case 'student': return 'Étudiant';
    case 'viewer': return 'Observateur';
    default: return role;
  }
};

export const formatStatus = (status) => {
  switch (status) {
    case 'active': return 'Actif';
    case 'inactive': return 'Inactif';
    case 'invited': return 'Invité';
    default: return status;
  }
};

export const calculateCompletionRate = (tests) => {
  if (!tests || tests.length === 0) return 0;
  const completed = tests.filter(t => t.status === 'completed').length;
  return Math.round((completed / tests.length) * 100);
};

export const getActivityLabel = (action) => {
  const labels = {
    'user_added': 'Utilisateur ajouté',
    'user_removed': 'Utilisateur supprimé',
    'settings_updated': 'Paramètres mis à jour',
    'department_created': 'Département créé',
    'test_completed': 'Test terminé'
  };
  return labels[action] || action;
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};