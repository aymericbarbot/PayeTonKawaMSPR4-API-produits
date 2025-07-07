import { Request, Response } from 'express';
import Produit from '../models/produitModel';
import { validateProduitData } from '../utils/validateProduitData.ts';

export const getAllProduits = async (_req: Request, res: Response) => {
  try {
    const produits = await Produit.findAll();
    res.json(produits);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getProduitById = async (req: Request, res: Response) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }
    res.json(produit);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createProduit = async (req: Request, res: Response) => {
  try {
    const validation = validateProduitData(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const produit = await Produit.create(req.body);
    console.log('Produit créé avec succès:', produit);
    res.status(201).json(produit);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateProduit = async (req: Request, res: Response) => {
  try {
    const validation = validateProduitData(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const [updated] = await Produit.update(req.body, {
      where: { id_produit: req.params.id }
    });

    if (updated === 0) {
      res.status(404).json({ error: 'Produit non trouvé ou données inchangées' });
      return
    }

    res.json({ updated });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


export const deleteProduit = async (req: Request, res: Response) => {
  try {
    const deleted = await Produit.destroy({
      where: { id_produit: req.params.id }
    });
    if (deleted === 0) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }
    res.json({ deleted });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }

};
