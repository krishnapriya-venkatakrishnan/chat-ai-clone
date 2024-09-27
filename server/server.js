import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { GoogleGenerativeAI } from "@google/generative-ai";

/*
* Install the Generative AI SDK
*
* $ npm install @google/generative-ai
*/

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.listen(5000, ()=> {
    console.log("AI server started on http://localhost:5000")
})

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello there!"
    })
})

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        async function run() {
            const chatSession = model.startChat({
                generationConfig,
            // safetySettings: Adjust safety settings
            // See https://ai.google.dev/gemini-api/docs/safety-settings
                history: [
                ],
            });

            const result = await chatSession.sendMessage(`${prompt}`);
            console.log(result.response.text());
            res.status(200).send({
                bot: result.response.text()
            })
        }

        run();

    } catch(err) {
        console.error(err)
        res.status(500).send(err || 'Something went wrong')
    } 

})