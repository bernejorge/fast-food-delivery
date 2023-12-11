import WhatsAppWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { config } from 'dotenv';
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
  if (message.body.toLowerCase().includes("ping")) {
    message.reply("pong");
  }
});

client.on('message', message => {
 
});


// Inicia la sesión de WhatsApp
//client.initialize();

export { client };