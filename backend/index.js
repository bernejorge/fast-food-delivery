const express = require("express");
const db = require("./models");
const cors = require('cors');

const app = express();
// Habilitar CORS para todos los orígenes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;


db.sequelize.sync({ alter: true }).then(() => {
   
   app.listen(port, () => {
     console.log(`listening on port ${port}`);
   });
 
   // Inicia la ejecución después de que Sequelize ha sincronizado.
   //executeAndSchedule();
 });
 