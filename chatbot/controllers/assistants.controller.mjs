import db from "../models/index.mjs";
const UserThread = db.sequelize.models.UserThread;

const UserThreadController = {
  create: async (phoneNumber, threadId) => {
    try {
      // Buscar un UserThread existente con el mismo número de teléfono
      const existingThread = await UserThread.findOne({
        where: { telefono: phoneNumber },
      });

      if (existingThread) {
        // Si existe, actualizar el thread_id
        await existingThread.update({ thread_id: threadId });
        return existingThread;
      } else {
        // Si no existe, crear uno nuevo
        const newThread = await UserThread.create({
          telefono: phoneNumber,
          thread_id: threadId,
        });
        return newThread;
      }
    } catch (error) {
      console.error("Error al crear o actualizar UserThread:", error);
      throw error;
    }
  },
  getAllThreads: async () => {
    try {
      const threads = await UserThread.findAll();
      return threads;
    } catch (error) {
      console.error("Error al recuperar UserThreads:", error);
      throw error;
    }
  },
  getThreadByPhoneNumber: async (phoneNumber) => {
    try {
      const thread = await UserThread.findOne({
        where: { telefono: phoneNumber },
      });
      return thread;
    } catch (error) {
      console.error("Error al buscar UserThread por teléfono:", error);
      throw error;
    }
  },
};
