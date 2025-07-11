import { createProduit } from '../../src/controller/produitsController';
import { Request, Response } from 'express';
import Produit from '../../src/models/produitsModel';

// Mock du modèle Produit
jest.mock('../../src/models/produitsModel');

describe('createProduit', () => {
  let req: Request;
  let res: Response;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJsonFn = jest.fn();
    mockStatusFn = jest.fn().mockReturnThis();
    res = {
      json: mockJsonFn,
      status: mockStatusFn
    } as unknown as Response;
  });

  it('should create produit and return 201 status when all data is valid', async () => {
   
    const produitData = {
      nom: 'Café Arabica',
      description: 'Un café doux et fruité',
      prix: 5.99,
      couleur: 'Marron',
      stock: 30
    };

    const mockCreatedProduit = {
      id_produit: 1,
      ...produitData,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    };

    req = {
      body: produitData
    } as unknown as Request;

    (Produit.create as jest.Mock).mockResolvedValue(mockCreatedProduit);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

   
    await createProduit(req, res);

    expect(Produit.create).toHaveBeenCalledTimes(1);
    expect(Produit.create).toHaveBeenCalledWith(produitData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreatedProduit);
    expect(console.log).toHaveBeenCalledWith('Produit créé avec succès:', mockCreatedProduit);

    consoleSpy.mockRestore();
  });

  // ---- Validation tests: champs manquants ou invalides ----

  it('should return 400 when nom is missing', async () => {
    req = {
      body: {
        prix: 5.99,
        stock: 20
      }
    } as unknown as Request;

    await createProduit(req, res);

    expect(Produit.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 when prix is missing', async () => {
    req = {
      body: {
        nom: 'Café Robusta',
        stock: 12
      }
    } as unknown as Request;

    await createProduit(req, res);

    expect(Produit.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 when stock is missing', async () => {
    req = {
      body: {
        nom: 'Café Robusta',
        prix: 3.50
      }
    } as unknown as Request;

    await createProduit(req, res);

    expect(Produit.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 when nom is empty string', async () => {
    req = {
      body: {
        nom: '',
        prix: 2.50,
        stock: 10
      }
    } as unknown as Request;

    await createProduit(req, res);

    expect(Produit.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 when prix is 0', async () => {
    req = {
      body: {
        nom: 'Café Zéro',
        prix: 0,
        stock: 10
      }
    } as unknown as Request;

    await createProduit(req, res);

    expect(Produit.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  it('should return 400 when stock is 0', async () => {
    req = {
      body: {
        nom: 'Café StockZéro',
        prix: 1.99,
        stock: 0
      }
    } as unknown as Request;

    await createProduit(req, res);

    expect(Produit.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Les champs "nom", "prix" et "stock" sont obligatoires'
    });
  });

  // ---- Test d'erreur serveur ----

  it('should return 500 status when Produit.create fails', async () => {
    // Arrange
    const mockError = new Error('Database error');
    const produitData = {
      nom: 'Café Robusta',
      description: 'Corsé',
      prix: 3.99,
      stock: 7
    };

    req = {
      body: produitData
    } as unknown as Request;

    (Produit.create as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Act
    await createProduit(req, res);

    // Assert
    expect(Produit.create).toHaveBeenCalledTimes(1);
    expect(Produit.create).toHaveBeenCalledWith(produitData);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la création du produit:', mockError);

    consoleSpy.mockRestore();
  });

});
