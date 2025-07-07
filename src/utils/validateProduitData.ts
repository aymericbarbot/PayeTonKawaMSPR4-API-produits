interface ProduitInput {
  nom?: string;
  description?: string;
  prix?: number;
  couleur?: string;
  stock?: number;
}

export function validateProduitData(data: ProduitInput): { valid: boolean; error?: string } {
  const { nom, prix, stock } = data;

  if (!nom || !prix || !stock) {
    return {
      valid: false,
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    };
  }

  return { valid: true };
}
