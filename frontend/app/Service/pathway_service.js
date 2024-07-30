import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

async function query(data) {
  const hugging = process.env.NEXT_PUBLIC__HUGGING_FACE_API_KEY;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      headers: {
        Authorization: `Bearer ${hugging}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return URL.createObjectURL(result);
}

export const Pathway_Service = async (inputValue) => {
  const secret_key = process.env.NEXT_PUBLIC__GEMINI_API_KEY;
  const chat = new ChatGoogleGenerativeAI({ apiKey: secret_key });

  const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
    "You are a helper who is aiding students in finding a pathway for the skills and technologies they want to learn. If you don't know an answer then simply say 'This is outside of my expertise'. Respond well and helpfully. Your answer should be in format of Months: new line, week: new line, content: -generated items newline and no punctuation marks"
  );

  const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
    `I want to learn ${inputValue.skill}. Give me an extremely detailed pathway including weeks and months across ${inputValue.num} ${inputValue.duration}. There should be a project with an example at the last week of each month. Don't provide urls or links, just a detailed description each week and month would suffice. Remove punctuation marks from titles.`
  );

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    humanMessagePrompt,
  ]);

  const formattedChatPrompt = await chatPrompt.formatMessages({
    input: inputValue,
  });

  const response = await chat.invoke(formattedChatPrompt);

  const imageURL = await query({
    inputs: `${response.content}, poster, non-realistic, cartoon, motivating`,
  });

  return {
    answer: response.content,
    image: imageURL,
  };
};
