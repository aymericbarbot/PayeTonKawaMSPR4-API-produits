import { deleteProduit } from '../../src/controller/produitsController';
import { Request, Response } from 'express';
import Produit from '../../src/models/produitsModel';

jest.mock('../../src/models/produitsModel');

describe('deleteProduit', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: '1' }
    } as unknown as Request;

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
  });

  it('should delete produit and return result', async () => {
    // Arrange
    (Produit.destroy as jest.Mock).mockResolvedValue(1); // 1 ligne supprimée

    // Act
    await deleteProduit(req, res);

    // Assert
    expect(Produit.destroy).toHaveBeenCalledWith({
      where: { id_produit: '1' }
    });
    expect(res.json).toHaveBeenCalledWith({ deleted: 1 });
  });

  it('should return 500 if deletion fails', async () => {
    // Arrange
    const error = new Error('Database failure');
    (Produit.destroy as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Act
    await deleteProduit(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la suppression du produit:', error);

    // Cleanup
    consoleSpy.mockRestore();
  });

  it('should return 404 if no produit was deleted', async () => {
    // Arrange
    (Produit.destroy as jest.Mock).mockResolvedValue(0); // Aucun produit supprimé

    // Act
    await deleteProduit(req, res);

    // Assert
    expect(Produit.destroy).toHaveBeenCalledWith({
      where: { id_produit: '1' }
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Produit non trouvé'
    });
  });
});
