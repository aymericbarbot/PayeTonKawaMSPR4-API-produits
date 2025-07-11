import express from 'express';
import produitRoutes from './routes/produitRoutes';

const app = express();

app.use(express.json());
app.use('/products', produitRoutes); // <= Mets le bon préfixe

app.get('/', (_req, res) => {
  res.send('Hello, Express + TypeScript 👋');
});

export default app;
