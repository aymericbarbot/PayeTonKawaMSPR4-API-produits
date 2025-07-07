import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database';

class Produit extends Model {}

Produit.init({
  id_produit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prix: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: {
        min: 0
    }
  },
  couleur: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 0
    }
  }
}, {
  sequelize,
  modelName: 'Produit',
  tableName: 'produits',
  timestamps: true
});

export default Produit;
