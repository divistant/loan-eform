/**
 * Map product name dari format UI ke format yang diharapkan API
 * API mengharapkan: "KPR", "KMG", atau "Mikro"
 */
export function mapProductNameToAPI(productName: string): string {
  // Extract short name dari format "KPR - Kredit Pemilikan Rumah"
  if (productName.includes("KPR")) {
    return "KPR";
  }
  if (productName.includes("KMG")) {
    return "KMG";
  }
  if (productName.includes("Mikro")) {
    return "Mikro";
  }
  
  // Fallback: return as is
  return productName;
}

