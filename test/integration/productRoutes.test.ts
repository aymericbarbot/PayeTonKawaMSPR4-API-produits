import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/database/database';

describe('Integration tests - /products', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('GET /products should return 200 and an array', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /products should fail with 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/products')
      .send({ nom: 'Test' }); // manque prix, stock
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /products should succeed with valid data', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        nom: 'Café Arabica',
        description: 'Un café doux',
        prix: 5.99,
        couleur: 'Marron',
        stock: 30
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_produit');
    expect(res.body.nom).toBe('Café Arabica');
  });

  it('GET /products/:id should return 200 and the product when exists', async () => {
    const createRes = await request(app)
      .post('/products')
      .send({
        nom: 'Test Produit',
        description: 'Description',
        prix: 10,
        couleur: 'Noir',
        stock: 100
      });
    const id = createRes.body.id_produit;
    const res = await request(app).get(`/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_produit', id);
    expect(res.body.nom).toBe('Test Produit');
  });

  it('GET /products/:id should return 404 if product does not exist', async () => {
    const res = await request(app).get('/products/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('PUT /products/:id should update product and return 200', async () => {
    // On crée d’abord le produit
    const postRes = await request(app)
      .post('/products')
      .send({
        nom: 'Ancien Produit',
        description: 'Desc',
        prix: 15,
        couleur: 'Vert',
        stock: 25
      });
    const id = postRes.body.id_produit;
    // On update
    const res = await request(app)
      .put(`/products/${id}`)
      .send({
        nom: 'Nouveau Produit',
        description: 'Desc modifiée',
        prix: 20,
        couleur: 'Rouge',
        stock: 12
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updated', 1);
  });

  it('PUT /products/:id should return 404 if product not found', async () => {
    const res = await request(app)
      .put('/products/99999')
      .send({
        nom: 'Fantôme',
        description: '...?',
        prix: 10,
        couleur: 'Inconnue',
        stock: 1
      });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /products/:id should delete product and return 200', async () => {
    const postRes = await request(app)
      .post('/products')
      .send({
        nom: 'À supprimer',
        description: 'Suppression',
        prix: 2,
        couleur: 'Noir',
        stock: 1
      });
    const id = postRes.body.id_produit;
    const res = await request(app).delete(`/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deleted', 1);
  });

  it('DELETE /products/:id should return 404 if product not found', async () => {
    const res = await request(app).delete('/products/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
