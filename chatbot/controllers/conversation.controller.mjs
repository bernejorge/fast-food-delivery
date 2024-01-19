import UserThreadController from "./assistants.controller.mjs";
import OpenAI from "openai";
import { ClientConversation } from "../assistants/models/assistant.mjs";
import { config } from "dotenv";
import path from "path";
import fs from "fs";

config();
const secret = process.env.OPENAI_API_KEY;
//const assistantID = "asst_P7rRRePOKTb4bIBc7pkzxIfg"; //asistente tipsy turno medico
const assistantID = "asst_2yBS94XGvTBst4hHQFofEcKl"; //assistente fast food
//const assistantID = "asst_RYI3W4C95LeB5wT6CidQu2ZK";
const openai = new OpenAI({
   apiKey: secret,
});


 async function retrieveThread( id) {
   try {
     const OpenAI = openai;
     let thread;
     if (id) {
       try {
         thread = await OpenAI.beta.threads.retrieve(id);
       } catch (error) {
         if(error.message.includes("No thread found")) {
           thread = await OpenAI.beta.threads.create();
           return thread;
         }    
       }
       if (!thread) {
         //create a new thread
         thread = await OpenAI.beta.threads.create();
       }else{
         //si ya tenia un hilo, buscar el mensaje mas nuevo.
         //si el mensaje tiene mas de 4 horas crear un nuevo hilo
         const threadMessages = await openai.beta.threads.messages.list(
            thread.id, 
            {
               order: 'desc'
            }
          );
          if (threadMessages.data.length > 0) {
             const last_timestamp = threadMessages.data[0].created_at;
             const now = Date.now();
             // Calcular la diferencia en horas
             const difference = (now - last_timestamp) / (1000 * 60 * 60);             
             // Comprobar si la diferencia es mayor que 4 horas
             if (difference > 4) {
               thread = await OpenAI.beta.threads.create();
             }

          }

       }
     } else {
       thread = await OpenAI.beta.threads.create();
     }
     return thread;
   } catch (error) {
     
     throw error;
   }
 }

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
         if (!threadID || threadID !== c.thread.id ) {
            await UserThreadController.create(phoneNumber, c.thread.id);
         };

         const rta = await c.sendMessage(message);
         return rta;

      } catch (error) { 
         console.log(error);
         return "Estamos experimentando un error en nuestro asistente virtual."
      }
   },
   transcribeAudioStream: async (audioStream)=> {
      try {
        const transcription = await openai.audio.transcriptions.create({
          file: audioStream,
          model: "whisper-1",
        });
    
        return transcription.text;
      } catch (error) {
        console.error("Error al transcribir el mensaje de audio:", error);
        return "Error al transcribir el mensaje de audio";
      }
    },
   text_to_speech: async (speech)=> {
      try {
         const speechFile = await path.resolve("./speech.mp3");
         const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "onyx",
            input: speech,
            speed: 1.2
          });
          console.log(speechFile);
          const buffer = Buffer.from(await mp3.arrayBuffer());
          await fs.promises.writeFile(speechFile, buffer);
          return speechFile;
      } catch (error) {
         console.error(error.message);
      }
   },
   askAboutImages: async (imageFilePath, prompt)=> {
      //const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const imagesContent = (() => {
        const imageAsBase64 = fs.readFileSync(imageFilePath, 'base64');
        return {
          type: 'image_url',
          image_url: `data:image/png;base64,${imageAsBase64}`,
        };
      });
      try {
         const c2= imagesContent();
         const response = await openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
              { role: 'system', content: `Eres un agente util, te llamas Jarvis. Debes responder de manera formal y dirigirte al usuario como Señor.` },
              {
                role: 'user',
                content: [
                   {
                      type: 'text',
                      text: prompt
                   },
                   c2,
                ],
              },
            ],
            max_tokens: 1000,
          });
          const textMsg = response.choices[0].message.content;
          console.log(textMsg);
          
          return textMsg;
      } catch (error) {
         console.error(error);
      }
     
      
    }
};
// (async () => {
//    await ConversationController.askAboutImages('../formucon.png', 'What is in this image?');
//  })();
export default ConversationController;
