'use strict';

module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false // No permite valores nulos
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false // No permite valores nulos
    },
    url_imagen: {
      type: DataTypes.STRING
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2), // Ajusta la precisión y escala según tus necesidades
      allowNull: false // No permite valores nulos
    }
  }, {
    tableName: 'Productos'
  });

  Producto.associate = function(models) {
   Producto.belongsTo(models.Categoria, {
     foreignKey: 'categoriaId',
     as: 'categoria'
   });
   Producto.hasMany(models.LineaOrden, {
      foreignKey: 'id_producto_ordenado',
      as: 'lineasOrden'
    });
 };

  return Producto;
};
