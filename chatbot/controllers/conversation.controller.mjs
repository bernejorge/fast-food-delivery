import UserThreadController from "./assistants.controller.mjs";
import OpenAI from "openai";
import { ClientConversation } from "../assistants/models/assistant.mjs";
import { config } from "dotenv";

config();
const secret = process.env.OPENAI_API_KEY;
const assistantID = "asst_2yBS94XGvTBst4hHQFofEcKl";
//const assistantID = "asst_RYI3W4C95LeB5wT6CidQu2ZK";
const openai = new OpenAI({
   apiKey: secret,
});

const ConversationController = {
   sendMessage: async (message, phoneNumber) => {
      try {
         //TODO: recuperar el UserThread desde el UserThreadController y enviar el mensaje. Si no existe el threar guardar el que se crea
         const thread = await UserThreadController.getThreadByPhoneNumber(phoneNumber);
         let threadID;
         if (thread) threadID = thread.thread_id;
         const c = await ClientConversation.create(
            phoneNumber,
            assistantID,
            threadID,
            openai
         );
         if (!threadID) {
            await UserThreadController.create(phoneNumber, c.thread.id);
         };

         const rta = await c.sendMessage(message);
         return rta;

      } catch (error) { 
         console.log(error);
         return "Estamos experimentando un error en nuestro asistente virtual."
      }
   },
};

export default ConversationController;
