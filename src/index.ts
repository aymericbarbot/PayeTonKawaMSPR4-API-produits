import express from 'express';
import produitRoutes from './routes/produitRoutes';
import sequelize from './database/database';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/customers', produitRoutes);

sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
  app.listen(port, () => {
    console.log(`API Produits prête sur http://localhost:${port}`);
  });
}).catch(console.error);

app.get('/', (_req, res) => {
  res.send('Hello, Express + TypeScript 👋');
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

export default app;