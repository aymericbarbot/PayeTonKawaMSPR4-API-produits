import { getAllProduits } from '../../src/controller/produitsController';
import { Request, Response } from 'express';
import Produit from '../../src/models/produitsModel'

// Mock du modèle produits
jest.mock('../../src/models/produitsModel')

describe('getAllproduits', () => {
  let req: Request;
  let res: Response;
  let mockJsonFn: jest.Mock;

  beforeEach(() => {

    jest.clearAllMocks();

    req = {} as Request;
    mockJsonFn = jest.fn();
    res = {
      json: mockJsonFn,
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
  });

  it('should return all products as JSON when findAll succeeds', async () => {
   
    const mockProduits = [
      {
        id_produit: 1,
        nom: 'Café Arabica',
        description: 'Un café doux et fruité',
        prix: 5.99,
        couleur: 'Marron',
        stock: 30,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id_produit: 2,
        nom: 'Café Robusta',
        description: 'Un café corsé et puissant',
        prix: 4.50,
        couleur: 'Noir',
        stock: 12,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-12'),
      }
    ];

    (Produit.findAll as jest.Mock).mockResolvedValue(mockProduits);

    
    await getAllProduits(req, res);

    
    expect(Produit.findAll).toHaveBeenCalledTimes(1);
    expect(Produit.findAll).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith(mockProduits);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no products exist', async () => {
   
    (Produit.findAll as jest.Mock).mockResolvedValue([]);

   
    await getAllProduits(req, res);

   
    expect(Produit.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 500 status with error message when Produit.findAll fails', async () => {
   
    const mockError = new Error('Database connection failed');
    (Produit.findAll as jest.Mock).mockRejectedValue(mockError);

    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    
    await getAllProduits(req, res);

    
    expect(Produit.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des produits:', mockError);

    
    consoleSpy.mockRestore();
  });

});
