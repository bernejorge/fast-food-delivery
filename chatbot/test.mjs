import WhatsAppWeb from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { config } from "dotenv";
import ConversationController from "./controllers/conversation.controller.mjs";
import fs from "fs";
import streamifier from "streamifier";

config();

// A continuación, puedes utilizar las exportaciones de WhatsAppWeb
const { Client, LocalAuth, Buttons, MessageMedia, List } = WhatsAppWeb;
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
  // // Verifica si el mensaje es "ping" y responde con "pong"
  // console.log(`Mensaje recibido (${message._data.notifyName}) =>  ${message.body}`);
  // //console.log("Mensjae recibido => " + message.body);
  // if(message.from ==="5493476643971@c.us"){
  //   if(message.body.length > 0) {
  //     ConversationController.sendMessage(message.body);
  //   }
  // };
  // if (message.fromMe){
  //   if(message.body.length > 0) {
  //     ConversationController.sendMessage(message.body);
  //   };
  // };
});

client.on("message_create", async (message) => {
  console.log(
    `Mensaje recibido (${message._data.notifyName}) =>  ${message.body}`
  );

  if (
    message.body.toLowerCase().includes("jarvis") &&
    message.from.includes("5493413500536@c.us")
  ) {
    try {
      if(message.hasMedia) {
        const media = await message.downloadMedia();
        // do something with the media data here
        if (media.mimetype === "image/jpeg" || media.mimetype === "image/png" ) {
          //TODO: descargar la imagen en la carpeta images, Para el nombre del archivo usar la fecha
          //TODO: declarar una variable y asignar el path del archivo descargado
          const filename = `images/${new Date().getTime()}.${media.mimetype.split('/')[1]}`;
          fs.writeFileSync(filename, media.data, 'base64');
          const filePath = filename;
          const respuesta = await ConversationController.askAboutImages(filePath,  message.body);
          message.reply(respuesta);
          return respuesta;
        }
        return;
    }
      const res = await ConversationController.sendMessage(
        message.body,
        message.from
      );
      message.reply(res);
    } catch (error) {
      message.reply("Estamos experimentando un error en nuestros sistemas.");
    }
  } else if (message.body.toLowerCase().includes("jarvis")) {
    message.reply(
      "Lo siento, mi protocolo solo me permite responder a solicitudes del telefono del Señor Jorge."
    );
  } else if (message.body === "!buttons") {
    let button = new Buttons(
      "Button body",
      [{ body: "bt1" }, { body: "bt2" }, { body: "bt3" }],
      "title",
      "footer"
    );
    client.sendMessage(message.from, button);
  } else if (message.body === "!list") {
    let sections = [
      {
        title: "sectionTitle",
        rows: [
          { title: "ListItem1", description: "desc" },
          { title: "ListItem2" },
        ],
      },
    ];
    let list = new List("List body", "btnText", sections, "Title", "footer");
    client.sendMessage(message.from, list);
  }

  // if (message.type == "ptt") {
  //   client.sendMessage(message.from, "Transcribiendo el mensaje...");
  //   const media = await message.downloadMedia();
  //   const audioBuffer = Buffer.from(media.data, "base64");

  //   // Crea un archivo temporal para almacenar el buffer
  //   const tmpFilePath = message.id.id + ".ogg";
  //   fs.writeFileSync(tmpFilePath, audioBuffer);

  //   // Crea un ReadStream a partir del archivo temporal
  //   const audioStream = await fs.createReadStream(tmpFilePath);

  //   // Llama a la función de transcripción y pasa el stream de audio
  //   const transcription = await ConversationController.transcribeAudioStream(
  //     audioStream
  //   );

  //   if (!transcription) {
  //     message.reply("No se pudo transcribir el audio.");
  //   }
  //   try {
  //     const res = await ConversationController.sendMessage(
  //       transcription,
  //       message.from
  //     );
  //     const rutamp3 = await ConversationController.text_to_speech(res);

  //     const media = MessageMedia.fromFilePath(rutamp3);

  //     client.sendMessage(message.from, media);

  //     message.reply(res);
  //   } catch (error) {
  //     message.reply("Estamos experimentando un error en nuestros sistemas.");
  //   }
  // }
});

client.on("message", (message) => {
  if (message.body.toLowerCase().includes("jarvis")) {
    message.sendMessage(
      message.from,
      "Lo siento, mi protocolo solo me permite responder a solicitudes del telefono del Señor Jorge."
    );
  }
});

// Inicia la sesión de WhatsApp
//client.initialize();

export { client };
