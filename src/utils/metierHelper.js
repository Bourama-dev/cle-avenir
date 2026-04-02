export const extractRomeCode = (metier, componentName = 'Unknown') => {
  if (!metier) {
    console.warn(`[${componentName}] extractRomeCode: metier object is null or undefined.`);
    return null;
  }

  // Handle both possible structures from different parts of the app
  const extractedCode = metier.code_rome || metier.code || metier.metierCode || metier.id;

  console.group(`[${componentName}] Metier Navigation Debug`);
  console.log("Full Metier Object:", metier);
  console.log("Extracted ROME code:", extractedCode);
  console.groupEnd();

  return extractedCode;
};