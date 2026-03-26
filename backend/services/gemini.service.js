import { GoogleGenAI } from '@google/genai';

/**
 * Initialize Gemini safely
 */
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

/**
 * Chat with Gemini — DETAILED + STRUCTURED RESPONSE
 */
export const chatWithGemini = async (userMessage) => {
  try {
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert Indian agriculture advisor.

Instructions:
- Answer in 15–20 lines
- Use simple and clear English
- Use headings with this format: ### Heading
- Use bullet points under headings
- Make it practical for farmers
- Avoid long paragraphs

Format:
### Problem
### Causes
### Solution
### Prevention Tips

Question: ${userMessage}
`,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.5,
      },
    });

    return response.text;

  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw new Error('AI service is currently unavailable.');
  }
};

/**
 * Analyze crop image — DETAILED STRUCTURED
 */
export const analyzeImageWithGemini = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an expert agriculture advisor.

Analyze this crop image and respond in structured format:

### Crop Identification
### Disease/Problem
### Symptoms
### Treatment
### Prevention Tips

- Use simple English
- Keep answer 15–20 lines
- Use bullet points
`,
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 450,
        temperature: 0.4,
      },
    });

    return response.text;

  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw new Error('Image analysis service is unavailable.');
  }
};

/**
 * Weather-based farming advice — STRUCTURED
 */
export const getWeatherAdvice = async (weatherData, location) => {
  try {
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert agriculture advisor.

Weather Data:
Location: ${location}
Temperature: ${weatherData.temp}°C
Humidity: ${weatherData.humidity}%
Condition: ${weatherData.description}

Provide advice in structured format:

### Farming Advice
### Irrigation Tips
### Crop Protection
### Do's and Don'ts

- Use simple English
- 12–18 lines
- Bullet points preferred
`,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.5,
      },
    });

    return response.text;

  } catch (error) {
    console.error('Gemini Weather Error:', error);
    throw new Error('Weather advice service unavailable.');
  }
};