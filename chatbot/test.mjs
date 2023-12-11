import WhatsAppWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { transcribeAudioStream, translateAudioStream, chatCompletion } from './transcription.mjs';
import { config } from 'dotenv';
import fs from 'fs';
import streamifier from 'streamifier';

import pkg from './woocommerce.js';
const { getProductsWithPrice } = pkg;

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

client.on("message", async (message) => {
  const messageText = message.body.toLowerCase();

  // Verifica si el mensaje incluye las palabras clave "precios," "precio," o "lista" (sin importar mayúsculas o minúsculas)
  if (messageText.includes("precios") || messageText.includes("precio") || messageText.includes("lista")) {
    try {
        // Llama a la función getProductsWithPrice desde 'woocommerce.js'
        const productsWithPrice = await getProductsWithPrice();
        
        // Convierte la lista de productos en una cadena
        const productList = productsWithPrice.join("\n");

      // Responde al mensaje con la lista de productos
      message.reply(`Lista de productos con precios:\n${productList}`);

      // Puedes realizar acciones adicionales con los productos y precios obtenidos
      console.log("Productos y precios:", productsWithPrice);
    } catch (error) {
      console.error("Error al obtener la lista de productos con precios:", error);
      // Maneja el error de manera adecuada
    }
  }
});

// Resto de tu código...


// client.on("message", async (message) => {
//   if (message.type == "ptt" || message.type == "audio") {
//     client.sendMessage(message.from, "Hola! soy un transcriptor automático. Voy a intenrtar transcribir tu mensaje");
//     const media = await message.downloadMedia();
//     const audioBuffer = Buffer.from(media.data, 'base64');

//     // Crea un archivo temporal para almacenar el buffer
//     const tmpFilePath = message.id.id + '.ogg' ;
//     fs.writeFileSync(tmpFilePath, audioBuffer); 

//     // Crea un ReadStream a partir del archivo temporal
//     const audioStream = await fs.createReadStream(tmpFilePath);

//     // Llama a la función de transcripción y pasa el stream de audio
//     const transcription = await transcribeAudioStream(audioStream);
//     console.log("Transcripción del mensaje de audio:", transcription);

    
//     message.reply('La transcripción de tu mensaje es \n"' + transcription + '".');
//     // Borra el archivo temporal después de su uso
//     fs.unlinkSync(tmpFilePath); 
//   }
// });

client.on("message", async (message) => {
  if (message.type == "ptt" || message.type == "audio") {
    client.sendMessage(message.from, 'Hola! se esta ejecutando un transcriptor automatico que estoy desarrollando, tener en cuenta que puede que no sea yo el de las respuetas, si no un bot con inteligencia artificial que hace "Alucianciones"');
    const media = await message.downloadMedia();
    const audioBuffer = Buffer.from(media.data, 'base64');

    // Crea un archivo temporal para almacenar el buffer
    const tmpFilePath = message.id.id + '.ogg' ;
    fs.writeFileSync(tmpFilePath, audioBuffer); 

    // Crea un ReadStream a partir del archivo temporal
    const audioStream = await fs.createReadStream(tmpFilePath);

    // Llama a la función de transcripción y pasa el stream de audio
    const transcription = await transcribeAudioStream(audioStream);
    console.log("Transcripción del mensaje de audio:", transcription);

    const res = await chatCompletion(transcription);
    if(res){
      message.reply(res);
    }
    
    fs.unlinkSync(tmpFilePath); 
  }
});

client.on('message', message => {
  if(message.body.toLowerCase() === 'hola') {
      sendGreetingOptions(message.from);
  }
});

function sendGreetingOptions(chatId) {
  const buttonList = [
      { id: 'yes', body: 'Sí' },
      { id: 'no', body: 'No' }
  ];

  const button = new Buttons(
      '¿Es un buen día?', // body
      buttonList, // buttons
      'Saludos', // title
      '¿Qué piensas?' // footer
  );

  client.sendMessage(chatId, button);
}


client.on('message_create', (msg) => {
  if (msg.fromMe && msg.type === 'buttons_response') {
      handleButtonResponse(msg);
  }
});


function handleButtonResponse(msg) {
  if (msg.selectedButtonId === 'yes') {
      client.sendMessage(msg.to, '¡Fantástico!');
  } else if (msg.selectedButtonId === 'no') {
      client.sendMessage(msg.to, 'Lo lamento mucho.');
  }
}

client.on('message', message => {
  console.log('message from', message.from)
  if (message.body === "!button") {

      let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
      client.sendMessage(message.from, button);

  }
});

// Inicia la sesión de WhatsApp
client.initialize();
