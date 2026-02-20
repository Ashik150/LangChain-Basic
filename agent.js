import {config} from 'dotenv';
config();

import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {createReactAgent} from '@langchain/langgraph/prebuilt';
import {WikipediaQueryRun} from '@langchain/community/tools/wikipedia_query_run';
import {HumanMessage} from '@langchain/core/messages';
import {tool} from '@langchain/core/tools';
import {z} from 'zod';

const model = new ChatGoogleGenerativeAI({
    temperature: 0.7,
    maxOutputTokens: 2048,
    model: 'models/gemini-2.5-flash',
    apiKey: process.env.GOOGLE_API_KEY
});

// Custom calculator tool
const calculator = tool(
    async ({expression}) => {
        try {
            return String(eval(expression));
        } catch {
            return 'Invalid expression';
        }
    },
    {
        name: 'calculator',
        description: 'Useful for math calculations. Input should be a math expression like "2 + 2" or "100 * 5".',
        schema: z.object({expression: z.string().describe('The math expression to evaluate')}),
    }
);

// Wikipedia search tool
const wikipedia = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
});

const tools = [calculator, wikipedia];

const agent = createReactAgent({
    llm: model,
    tools: tools,
});

const res = await agent.invoke({
    messages: [new HumanMessage('Who is the current president of Bangladesh? Also what is 256 * 48?')]
});

console.log(res.messages[res.messages.length - 1].content);

