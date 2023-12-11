import OpenAI from "openai";

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
      const assistant = await ClientConversation.retrieveAssistant(openAIInstance, assistant_id);
      const thread = await ClientConversation.retrieveThread(openAIInstance, thread_id);
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
      //const openai = new OpenAI();
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
      const msg = await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: message,
      });

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
            const availableFunctions = {
              get_products_with_price: getPriceList,
              get_Business_Hours: getBusinessHours,
            }; // only one function in this example, but you can have multiple

            const toolCalls =
              actualRun.required_action?.submit_tool_outputs?.tool_calls;
            let toolOutputs = [];
            for (const toolCall of toolCalls) {
              const functionName = toolCall?.function.name;
              const functionToCall = availableFunctions[functionName];
              const args = JSON.parse(toolCall?.function?.arguments || "{}");
              try {
                //try to execute the function required by the assistance
                const functionResponse = functionToCall(args);

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
            actualRun = await openai.beta.threads.runs.cancel(this.thread.id, run.id);
            throw error;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        actualRun = await openai.beta.threads.runs.retrieve(this.thread.id, run.id);
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
