import { ClientConversation} from "./assistant.mjs";
import OpenAI from "openai";
import {config} from "dotenv";

config();
const secret = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
   apiKey: secret,
})

const c = await ClientConversation.create("3413500536", "asst_2yBS94XGvTBst4hHQFofEcKl","thread_K5kOELKkYNutNrXF4khNf4Wz" ,openai );

const rta = await c.sendMessage("Esta bien la pago en efectivo.");

console.log(rta);