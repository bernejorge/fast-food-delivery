import db from './models/index.mjs';
import { client } from './test.mjs';

db.sequelize.sync().then(() => {
   client.initialize();
});