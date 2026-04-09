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
 * Get language instruction string
 */
const getLangInstruction = (language) => {
  if (language === 'hi') {
    return '- Answer in Hindi (Devanagari script)\n- Use simple Hindi that farmers can understand';
  }
  return '- Answer in simple and clear English';
};

/**
 * Chat with Gemini — DETAILED + STRUCTURED RESPONSE
 */
export const chatWithGemini = async (userMessage, language = 'en') => {
  try {
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert Indian agriculture advisor.

Instructions:
- Answer in 15–20 lines
${getLangInstruction(language)}
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
        maxOutputTokens: 500,
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
export const analyzeImageWithGemini = async (base64Image, mimeType = 'image/jpeg', language = 'en') => {
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

${getLangInstruction(language)}
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
        maxOutputTokens: 500,
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
export const getWeatherAdvice = async (weatherData, location, language = 'en') => {
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

${getLangInstruction(language)}
- 12–18 lines
- Bullet points preferred
`,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.5,
      },
    });

    return response.text;

  } catch (error) {
    console.error('Gemini Weather Error:', error);
    throw new Error('Weather advice service unavailable.');
  }
};

/**
 * Crop Advisory — recommend crops based on weather + season
 */
export const getCropAdvisory = async (weatherData, location, month, language = 'en') => {
  try {
    const ai = getGenAI();

    const seasonMap = {
      1: 'Rabi (Winter)', 2: 'Rabi (Winter)', 3: 'Rabi (Spring)',
      4: 'Zaid (Summer)', 5: 'Zaid (Summer)', 6: 'Kharif (Monsoon)',
      7: 'Kharif (Monsoon)', 8: 'Kharif (Monsoon)', 9: 'Kharif (Monsoon)',
      10: 'Rabi (Autumn)', 11: 'Rabi (Winter)', 12: 'Rabi (Winter)',
    };
    const season = seasonMap[month] || 'Unknown';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert Indian agriculture advisor specializing in crop planning.

Current Data:
- Location: ${location}
- Month: ${month} (${season} season)
- Temperature: ${weatherData.temp}°C
- Humidity: ${weatherData.humidity}%
- Weather Condition: ${weatherData.description}

Based on the above weather, season, and region, recommend the BEST crops to grow RIGHT NOW.

Respond in this structured format:

### 🌾 Current Season: ${season}

### ✅ Recommended Crops (Top 5-6)
For each crop provide:
- Crop name
- Why suitable for this weather/season
- Expected sowing period
- Expected harvest time
- Key tip

### 🌱 Soil Preparation Tips

### ⚠️ Crops to Avoid This Season

### 💡 Pro Tips for ${location} Farmers

${getLangInstruction(language)}
- Keep answer 25–35 lines
- Use bullet points
- Be specific to the region and current weather
`,
      generationConfig: {
        maxOutputTokens: 700,
        temperature: 0.5,
      },
    });

    return response.text;

  } catch (error) {
    console.error('Gemini Crop Advisory Error:', error);
    throw new Error('Crop advisory service unavailable.');
  }
};