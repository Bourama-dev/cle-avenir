export const debugMetierNavigation = (componentName, metier) => {
  if (!metier) {
    console.warn(`[${componentName}] debugMetierNavigation: metier object is null or undefined.`);
    return null;
  }

  const extractedCode = metier.code || metier.code_rome || metier.metierCode || metier.id;

  console.group(`[${componentName}] Metier Navigation Debug`);
  console.log("Full Metier Object:", metier);
  console.log("Possible ROME codes:");
  console.log("- metier.code:", metier.code);
  console.log("- metier.code_rome:", metier.code_rome);
  console.log("- metier.metierCode:", metier.metierCode);
  console.log("- metier.id (fallback):", metier.id);
  console.log("=> Extracted Code to use:", extractedCode);
  console.groupEnd();

  return extractedCode;
};