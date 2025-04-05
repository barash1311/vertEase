import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = "AIzaSyD22qKGm7hgT3zdFtoQoW2k_EZufwPBOfU";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function sendChatMessage(message: string): Promise<string> {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create a simple prompt for chat interaction
    const prompt = `You are an educational assistant. Provide a helpful, informative response to: "${message}"
    Keep responses concise but thorough.`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error in chat:', error);
    return "Sorry, I couldn't process your request. Please try again.";
  }
}