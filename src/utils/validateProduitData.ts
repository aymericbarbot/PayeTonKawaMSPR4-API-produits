interface ProduitInput {
//   nom?: string;
//   prenom?: string;
//   email?: string;
//   telephone?: string;
//   adresse?: string;
}

export function validateProduitData(data: ProduitInput): { valid: boolean; error?: string } {
//   const { nom, prenom, email, telephone, adresse } = data;

//   if (!nom || !prenom || !email || !telephone || !adresse) {
//     return {
//       valid: false,
//       error: 'Tous les champs sont obligatoires (nom, prenom, email, telephone, adresse)'
//     };
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return { valid: false, error: 'Format email invalide' };
//   }

//   const phoneRegex = /^\d{10,}$/;
//   if (!phoneRegex.test(telephone.replace(/\s/g, ''))) {
//     return { valid: false, error: 'Le téléphone doit contenir au moins 10 chiffres' };
//   }

  return { valid: true };
}
