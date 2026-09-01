export const EstablishmentActivationService = {
  // Only remaining consumer: EstablishmentEmailsManager.jsx (authorized-emails
  // feature). The rest of this service (code/password generation, hashing,
  // activation, login history) was never called by anything else in the app
  // — establishments are picked by search during signup (EstablishmentSearch.jsx),
  // not by entering a code — and was removed 2026-09-01 along with the
  // establishment_code_history/establishment_password_history tables it fed.
  validateEmailDomain(email) {
    if (!email) return false;
    const domain = email.split('@')[1];
    return domain === 'ac-versailles.fr'; // Specific requirement
  },
};