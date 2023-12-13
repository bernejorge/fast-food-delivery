import WhatsAppWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { config } from 'dotenv';
import ConversationController from './controllers/conversation.controller.mjs'
import fs from 'fs';
import streamifier from 'streamifier';

config();

// A continuación, puedes utilizar las exportaciones de WhatsAppWeb
const { Client, LocalAuth, Buttons,MessageMedia  } = WhatsAppWeb;
// Crea una instancia de WhatsApp Web client
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  // Muestra el código QR en la terminal para autenticación
  console.log("Escanear el código QR con la aplicación de WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Cliente de WhatsApp listo");
});

client.on("message", async (message) => {
  // Verifica si el mensaje es "ping" y responde con "pong"
  console.log(`Mensaje recibido (${message._data.notifyName}) =>  ${message.body}`); 
  //console.log("Mensjae recibido => " + message.body);

  if(message.from ==="5493476643971@c.us"){
    if(message.body.length > 0) {
      ConversationController.sendMessage(message.body);
    }
  };

  if (message.fromMe){
    if(message.body.length > 0) {
      ConversationController.sendMessage(message.body);
    };
  };
});

client.on('message_create', async (message) => {
  console.log(`Mensaje recibido (${message._data.notifyName}) =>  ${message.body}`); 

  if(message.body.toLowerCase().includes("jarvis")){
    try {
      const res =  await ConversationController.sendMessage( message.body, message.from);
      message.reply(res )
    }
    catch (error) {
      message.reply("Estamos experimentando un error en nuestros sistemas.")
    }
  }

});

client.on('message', message => {
  if(message.body.toLowerCase().includes("jarvis")){
    message.sendMessage(message.from, "Lo siento, mi protocolo solo me permite responder a solicitudes del telefono del Señor Jorge.")
  }
});


// Inicia la sesión de WhatsApp
//client.initialize();

export { client };