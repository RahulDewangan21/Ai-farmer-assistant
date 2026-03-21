import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Chat with Gemini — text-only
 */
export const chatWithGemini = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert Indian agriculture advisor. Answer in clear, simple English.
Your role is to help Indian farmers with practical, easy-to-understand farming advice.
Be friendly, supportive, and give actionable suggestions.
If the question is not related to farming or agriculture, politely redirect the conversation to farming topics.

User's question: ${userMessage}

Respond in simple English with practical farming advice:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Chat Error:', error.message);
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
};

/**
 * Analyze crop image with Gemini Vision
 */
export const analyzeImageWithGemini = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert Indian agriculture advisor and crop disease specialist.
Analyze this crop/plant image carefully and provide your answer in clear English:

1. **Plant/Crop Identification** - What crop or plant is shown
2. **Disease/Problem** - Any disease or issue detected
3. **Symptoms Observed** - Visual symptoms you can see
4. **Treatment** - Both organic and chemical treatments
5. **Prevention** - How to prevent this in future
6. **Additional Advice** - Any extra farming tips

Be specific and practical. Use markdown formatting.
If the image is not of a crop/plant, politely tell the user to upload a crop image.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Vision Error:', error.message);
    throw new Error('Image analysis service is currently unavailable. Please try again later.');
  }
};

/**
 * Get weather-based farming advice
 */
export const getWeatherAdvice = async (weatherData, location) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert Indian agriculture advisor.
Based on the following weather data for ${location}, provide practical farming advice in clear English.

Weather Data:
- Temperature: ${weatherData.temp}°C
- Humidity: ${weatherData.humidity}%
- Weather: ${weatherData.description}
- Wind Speed: ${weatherData.windSpeed} m/s
- Pressure: ${weatherData.pressure} hPa

Provide advice covering:
1. **Today's Farming Advice** - What to focus on today
2. **Irrigation Advice** - Watering recommendations
3. **Crop Protection** - How to protect crops in this weather
4. **Do's and Don'ts** - Key actions and things to avoid

Be specific and practical for Indian farmers. Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Weather Advice Error:', error.message);
    throw new Error('Weather advice service is currently unavailable. Please try again later.');
  }
};
