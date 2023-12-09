'use strict';

module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false // No permite valores nulos
    }
  }, {
    tableName: 'Categorias'
  });

  Categoria.associate = function(models) {
   Categoria.hasMany(models.Producto, {
     foreignKey: 'categoriaId',
     as: 'productos'
   });
 };

  return Categoria;
};
