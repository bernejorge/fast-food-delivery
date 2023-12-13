'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserThread = sequelize.define('UserThread', {
    telefono: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    thread_id: {
      type: DataTypes.STRING,
      allowNull: true // No permite valores nulos
    }
  }, {
    tableName: 'Threads'
  });

  return UserThread;
};

