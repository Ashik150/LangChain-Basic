import {config} from 'dotenv';
config();

import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {PromptTemplate} from '@langchain/core/prompts';

//setup model

const model = new ChatGoogleGenerativeAI({
    temperature: 0.7,
    maxOutputTokens: 2048,
    model: 'models/gemini-2.5-flash',
    apiKey: process.env.GOOGLE_API_KEY
});

const prompt = PromptTemplate.fromTemplate(
    'Who is {question}?'
);

// Modern approach using pipe operator (LCEL)
const chain = prompt.pipe(model);

const res = await chain.invoke({question: 'Shat-El-Shahriar Khan'});
    
console.log(res.content);


