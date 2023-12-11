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
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['Pendiente', 'Confirmado', 'Cancelado', 'En Progreso', 'Preparado', 'En Transito', 'Entregado']
    },
    fechaConfirmado: {
      type: DataTypes.DATE,
      allowNull: true // Puede ser nulo hasta que el estado sea 'Confirmado'
    },
    fechaEnTransito: {
      type: DataTypes.DATE,
      allowNull: true // Puede ser nulo hasta que el estado sea 'En Transito'
    }
  }, {
    tableName: 'Ordenes'
  });

  Orden.associate = function(models) {
    Orden.hasMany(models.LineaOrden, {
      as: 'lineasOrden',
      foreignKey: 'ordenId',
      onDelete: 'CASCADE',
      hooks: true
    });
  };

  return Orden;
};
