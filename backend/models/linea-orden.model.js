'use strict';

module.exports = (sequelize, DataTypes) => {
  const LineaOrden = sequelize.define('LineaOrden', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_producto_ordenado: {
      type: DataTypes.INTEGER
    },
    cantidad: {
      type: DataTypes.INTEGER
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2)
    }
  }, {
    tableName: 'LineasOrden'
  });

  LineaOrden.associate = function(models) {
    LineaOrden.belongsTo(models.Orden, {
      foreignKey: 'ordenId',
      as: 'orden'
    });
    // Si es necesario, establece una relación con el modelo Producto aquí
    LineaOrden.belongsTo(models.Producto, {
      foreignKey: 'id_producto_ordenado',
      as: 'producto'
    });
  };

  return LineaOrden;
};
