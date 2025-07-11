import { getProduitById } from '../../src/controller/produitsController';
import { Request, Response } from 'express';
import Produit from '../../src/models/produitsModel';

// Mock du modèle Produit
jest.mock('../../src/models/produitsModel');

describe('getProduitById', () => {
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

  it('should return produit by ID when produit exists', async () => {
    // Arrange
    const mockProduit = {
      id_produit: 1,
      nom: 'Café Arabica',
      description: 'Un café doux et fruité',
      prix: 5.99,
      couleur: 'Marron',
      stock: 30,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
    };

    req = {
      params: { id: '1' }
    } as unknown as Request;

    (Produit.findByPk as jest.Mock).mockResolvedValue(mockProduit);

    // Act
    await getProduitById(req, res);

    // Assert
    expect(Produit.findByPk).toHaveBeenCalledTimes(1);
    expect(Produit.findByPk).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(mockProduit);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 404 status when produit does not exist', async () => {
    // Arrange
    req = {
      params: { id: '999' }
    } as unknown as Request;

    (Produit.findByPk as jest.Mock).mockResolvedValue(null);

    // Act
    await getProduitById(req, res);

    // Assert
    expect(Produit.findByPk).toHaveBeenCalledTimes(1);
    expect(Produit.findByPk).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Produit non trouvé' });
  });

  it('should return 500 status with error message when Produit.findByPk fails', async () => {
    // Arrange
    const mockError = new Error('Database connection failed');
    req = {
      params: { id: '1' }
    } as unknown as Request;

    (Produit.findByPk as jest.Mock).mockRejectedValue(mockError);

    // Mock console.error pour éviter la pollution de la sortie des tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Act
    await getProduitById(req, res);

    // Assert
    expect(Produit.findByPk).toHaveBeenCalledTimes(1);
    expect(Produit.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération du produit:', mockError);

    // Restaure le comportement original de console.error
    consoleSpy.mockRestore();
  });

});
