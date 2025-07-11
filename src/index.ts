import app from './app';
import sequelize from './database/database';

const port = process.env.PRODUIT_PORT || 3000;

sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
  app.listen(port, () => {
    console.log(`API Produits prête sur http://localhost:${port}`);
  });
}).catch(console.error);
