const express = require("express");
const db = require("./src/models");
const cors = require('cors');
const categoria = require('./src/routes/categorias.routes')
const producto = require('./src/routes/productos.routes');

const app = express();
// Habilitar CORS para todos los orígenes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/categorias', categoria);
app.use('/api/productos', producto);
const port = 3000;


db.sequelize.sync({ alter: true }).then(() => {
   
   app.listen(port, () => {
     console.log(`listening on port ${port}`);
   });
 
   // Inicia la ejecución después de que Sequelize ha sincronizado.
   //executeAndSchedule();
 });
 