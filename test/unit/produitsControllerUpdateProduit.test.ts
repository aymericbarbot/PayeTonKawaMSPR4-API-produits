import { updateProduit } from '../../src/controller/produitsController';
import { Request, Response } from 'express';
import Produit from '../../src/models/produitsModel';

jest.mock('../../src/models/produitsModel');

describe('updateProduit', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: '1' },
      body: {
        nom: 'Café Arabica',
        description: 'Un café doux',
        prix: 5.99,
        couleur: 'Marron',
        stock: 30
      }
    } as unknown as Request;

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
  });

  it('should update produit and return result', async () => {
    (Produit.update as jest.Mock).mockResolvedValue([1]);

    await updateProduit(req, res);

    expect(Produit.update).toHaveBeenCalledWith(req.body, { where: { id_produit: '1' } });
    expect(res.json).toHaveBeenCalledWith({ updated: 1 });
  });

  it('should return 500 if update fails', async () => {
    const error = new Error('Database error');
    (Produit.update as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    await updateProduit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la mise à jour du produit:', error);

    consoleSpy.mockRestore();
  });

  it('should return 400 if nom is missing', async () => {
    delete req.body.nom;

    await updateProduit(req, res);

    expect(Produit.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 if prix is missing', async () => {
    delete req.body.prix;

    await updateProduit(req, res);

    expect(Produit.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 if stock is missing', async () => {
    delete req.body.stock;

    await updateProduit(req, res);

    expect(Produit.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 if nom is empty', async () => {
    req.body.nom = '';

    await updateProduit(req, res);

    expect(Produit.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 if prix is 0', async () => {
    req.body.prix = 0;

    await updateProduit(req, res);

    expect(Produit.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 if stock is 0', async () => {
    req.body.stock = 0;

    await updateProduit(req, res);

    expect(Produit.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 404 if no produit is updated', async () => {
    (Produit.update as jest.Mock).mockResolvedValue([0]);

    await updateProduit(req, res);

    expect(Produit.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Produit non trouvé ou données inchangées'
    });
  });

  it('should allow update when description is missing', async () => {
    delete req.body.description;

    (Produit.update as jest.Mock).mockResolvedValue([1]);

    await updateProduit(req, res);

    expect(Produit.update).toHaveBeenCalledWith(req.body, { where: { id_produit: '1' } });
    expect(res.json).toHaveBeenCalledWith({ updated: 1 });
  });

  it('should allow update when couleur is missing', async () => {
    delete req.body.couleur;

    (Produit.update as jest.Mock).mockResolvedValue([1]);

    await updateProduit(req, res);

    expect(Produit.update).toHaveBeenCalledWith(req.body, { where: { id_produit: '1' } });
    expect(res.json).toHaveBeenCalledWith({ updated: 1 });
  });
});
