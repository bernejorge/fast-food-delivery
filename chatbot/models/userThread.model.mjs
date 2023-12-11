export default (sequelize, DataTypes) => {
   const UserThread = sequelize.define('UserThread', {
     telfono: {
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