'use strict';

module.exports = (sequelize, DataTypes) => {
  const Orden = sequelize.define('Orden', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    telefono: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.DATE
    },
    importe: {
      type: DataTypes.DECIMAL(10, 2)
    }
  }, {
    tableName: 'Ordenes'
  });

  Orden.associate = function(models) {
    Orden.hasMany(models.LineaOrden, {
      foreignKey: 'ordenId',
      as: 'lineasOrden'
    });
  };

  return Orden;
};
