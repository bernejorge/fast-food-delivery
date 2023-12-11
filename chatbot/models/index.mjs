import { fileURLToPath } from 'url';
import path from 'path';
import { Sequelize } from 'sequelize';
import fs from 'fs/promises';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// Construir la URL del archivo JSON
const configPath = new URL('../config/config.json', import.meta.url);
const configRaw = await fs.readFile(configPath, 'utf8');

const config = JSON.parse(configRaw)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = await fs.readdir(__dirname);
for (const file of files) {
   if (file.indexOf('.') !== 0 && file !== basename && file.slice(-4) === '.mjs' && file.indexOf('.test.js') === -1) {
     // Construir la URL del archivo para importación dinámica
     const modelPath = new URL(file, import.meta.url);
     const { default: model } = await import(modelPath);
     db[model.name] = model(sequelize, Sequelize.DataTypes);
   }
 }

Object.keys(db).forEach(async modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;