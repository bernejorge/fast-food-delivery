import OpenAI from "openai";
import functions_to_call from "./functions.mjs";
//import functions_to_call from "./../../Tipsy/functions.mjs";

class ClientConversation {
  constructor(wa_number, assistant_id, thread, openAIInstance, assistant) {
    this.wa_number = wa_number; // Número de WhatsApp
    this.assistant_id = assistant_id; //  asistente
    this.thread = thread; //  hilo de conversación
    this.OpenAI = openAIInstance;
    this.assistant = assistant;
  }

  static async create(wa_number, assistant_id, thread_id, openAIInstance) {
    try {
      const assistant = await ClientConversation.retrieveAssistant(
        openAIInstance,
        assistant_id
      );
      const thread = await ClientConversation.retrieveThread(
        openAIInstance,
        thread_id
      );
      return new ClientConversation(
        wa_number,
        assistant_id,
        thread,
        openAIInstance,
        assistant
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //metodo para recupera el assistant por id
  static async retrieveAssistant(OpenAI, id) {
    try {
      //const openai = new OpenAI();
      let assistant;
      if (id) {
        assistant = await OpenAI.beta.assistants.retrieve(id);
        if (!assistant)
          throw new Error("No se pudo recuperar al Asistente Virtual");
      } else {
        throw new Error(
          "El identificar del asisten no se ha pasao como parametro"
        );
      }

      return assistant;
    } catch (error) {
      throw error;
    }
  }
  //metodo para recuperar el hilo (thread) de la conersacion
  static async retrieveThread(OpenAI, id) {
    try {
      //const OpenAI = openai;
      let thread;
      if (id) {
        try {
          thread = await OpenAI.beta.threads.retrieve(id);
        } catch (error) {
          if (error.message.includes("No thread found")) {
            thread = await OpenAI.beta.threads.create();
            return thread;
          }
        }
        if (!thread) {
          //create a new thread
          thread = await OpenAI.beta.threads.create();
        } else {
          //si ya tenia un hilo, buscar el mensaje mas nuevo.
          //si el mensaje tiene mas de 4 horas crear un nuevo hilo
          const threadMessages = await OpenAI.beta.threads.messages.list(
            thread.id,
            {
              order: "desc",
            }
          );
          if (threadMessages.data.length > 0) {
            const last_timestamp = threadMessages.data[0].created_at * 1000; // timestamp en milisec
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

  async sendMessage(message) {
    try {
      const openai = new OpenAI();
      try {
        //verificar que no existan ejecuciones del thread
        let filteredRuns;
        do {
          const runs = await openai.beta.threads.runs.list(this.thread.id, {
            order: "desc",
          });
  
          filteredRuns = runs.data.filter(
            (run) =>
              run.status === "queued" ||
              run.status === "in_progress" ||
              run.status === "requires_action"
          );
        } while (filteredRuns.length > 0);    

        const msg = await openai.beta.threads.messages.create(this.thread.id, {
          role: "user",
          content: message,
          //file_ids: ['file-Tj9NzH5yMJUTcFTPpqws8UWX'],
        });
      } catch (error) {
        const runs = await openai.beta.threads.runs.list(this.thread.id);
        for (let i = 0; i < runs.data.length; i++) {
          await openai.beta.threads.runs.cancel(
            this.thread.id,
            runs.data[i].id
          );
        }
      }

      const run = await openai.beta.threads.runs.create(this.thread.id, {
        assistant_id: this.assistant.id,
      });

      let actualRun = await openai.beta.threads.runs.retrieve(
        this.thread.id,
        run.id
      );
      // Polling mechanism to see if runStatus is completed
      // This should be made more robust.
      while (
        actualRun.status === "queued" ||
        actualRun.status === "in_progress" ||
        actualRun.status === "requires_action"
      ) {
        if (actualRun.status === "requires_action") {
          try {
            const availableFunctions = functions_to_call; // have multiple

            const toolCalls =
              actualRun.required_action?.submit_tool_outputs?.tool_calls;
            let toolOutputs = [];
            for (const toolCall of toolCalls) {
              const functionName = toolCall?.function.name;
              const functionToCall = availableFunctions[functionName];
              const args = JSON.parse(toolCall?.function?.arguments || "{}");
              try {
                //try to execute the function required by the assistance
                args.telefono = this.wa_number;
                const functionResponse = await functionToCall(args);

                //storage the response
                toolOutputs.push({
                  tool_call_id: toolCall?.id,
                  output: JSON.stringify(functionResponse),
                });
              } catch (error) {
                toolOutputs.push({
                  tool_call_id: toolCall?.id,
                  output: "Ha ocurrido un error inesperado!",
                });
              }
            }

            // we must submit the tool outputs to the run to continue
            await openai.beta.threads.runs.submitToolOutputs(
              this.thread.id,
              run.id,
              {
                tool_outputs: toolOutputs,
              }
            );
          } catch (error) {
            actualRun = await openai.beta.threads.runs.cancel(
              this.thread.id,
              run.id
            );
            throw error;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        actualRun = await openai.beta.threads.runs.retrieve(
          this.thread.id,
          run.id
        );
      }

      // Get the last assistant message from the messages array
      const messages = await openai.beta.threads.messages.list(this.thread.id);

      // Find the last message for the current run
      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      // If an assistant message is found, console.log() it
      if (lastMessageForRun) {
        console.log(`${lastMessageForRun.content[0].text.value} \n`);
        return `${lastMessageForRun.content[0].text.value} \n`;
      }

      return "Lo siento no pude recuperar tu respuesta.";
    } catch (error) {
      throw error;
    }
  }

  async resolve_accion() {}
}

export { ClientConversation };
