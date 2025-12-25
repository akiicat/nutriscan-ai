
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FoodAnalysis, Language } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "The full name of the food product. Keep original language, append translation in parens if different.",
    },
    price: {
      type: Type.STRING,
      description: "The price of the product, if visible. E.g., '$4.99'. If not visible, return 'N/A'.",
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence overall summary of the product's healthiness, highlighting major pros and cons.",
    },
    ingredients: {
      type: Type.ARRAY,
      description: "A list of ingredients found on the nutrition label.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the ingredient. Keep original language, append translation in parens if different.",
          },
          rating: {
            type: Type.STRING,
            enum: ['GOOD', 'MODERATE', 'POOR', 'NEUTRAL'],
            description: "A simple health rating for the ingredient.",
          },
          reason: {
            type: Type.STRING,
            description: "A brief, one-sentence explanation for the ingredient's rating.",
          },
        },
        required: ["name", "rating", "reason"],
      },
    },
  },
  required: ["productName", "price", "summary", "ingredients"],
};

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  'zh-TW': 'Traditional Chinese',
  'zh-CN': 'Simplified Chinese',
  ja: 'Japanese'
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry API calls with exponential backoff
async function generateContentWithRetry(
  model: string, 
  params: any, 
  maxRetries: number = 3
) {
  let currentDelay = 2000; // Start with 2 seconds

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model,
        ...params
      });
    } catch (error: any) {
      // Check for Resource Exhausted (429) or Service Unavailable (503)
      const isQuotaError = 
        error.status === 429 || 
        error.code === 429 || 
        (error.message && (
          error.message.includes("RESOURCE_EXHAUSTED") || 
          error.message.includes("429")
        ));

      const isServiceUnavailable = 
        error.status === 503 || 
        error.code === 503;

      if ((isQuotaError || isServiceUnavailable) && attempt < maxRetries) {
        console.warn(`API Quota/Service issue (Attempt ${attempt + 1}/${maxRetries}). Retrying in ${currentDelay}ms...`);
        await delay(currentDelay);
        currentDelay *= 2; // Exponential backoff: 2s -> 4s -> 8s
        continue;
      }
      
      // If it's the last attempt or not a retryable error, throw it
      throw error;
    }
  }
}

export const analyzeFoodImage = async (base64Image: string, language: Language = 'en'): Promise<FoodAnalysis> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const targetLanguage = LANGUAGE_NAMES[language];

    const textPart = {
      text: `You are an expert nutritionist. Analyze this image of a food product. 
      Identify its name, price (if visible), and ingredients from the label. 
      Provide a health rating for each ingredient and an overall summary.
      
      IMPORTANT: Respond ONLY with a JSON object that strictly follows the provided schema. 
      
      Translation Rules for ${targetLanguage}:
      1. "productName": Keep the original name found on the packaging. If the target language (${targetLanguage}) is different from the packaging language, append the translation in parentheses.
      2. "ingredients.name": Keep the original ingredient name. If the target language is different, append the translation in parentheses.
      3. "summary" and "ingredients.reason": Translate these FULLY into ${targetLanguage}.
      
      Do not include markdown or any text outside the JSON object.`,
    };

    const response = await generateContentWithRetry(
      'gemini-2.5-flash',
      {
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      }
    );

    const jsonString = response?.text?.trim();
    if (!jsonString) throw new Error("Empty response from AI");
    
    const parsedJson = JSON.parse(jsonString);
    
    if (!parsedJson.productName || !Array.isArray(parsedJson.ingredients)) {
        throw new Error("Invalid JSON structure received from API.");
    }

    return parsedJson as FoodAnalysis;

  } catch (error: any) {
    console.error("Error analyzing food image:", error);
    let errorMessage = "Failed to analyze the food image. ";
    
    if (error.status === 429 || (error.message && error.message.includes("RESOURCE_EXHAUSTED"))) {
        errorMessage += "The service is currently busy due to high traffic. Please try again in a minute.";
    } else {
        errorMessage += "The AI model could not process the request. Please try a clearer image.";
    }
    throw new Error(errorMessage);
  }
};

export const analyzeFoodText = async (text: string, language: Language = 'en'): Promise<FoodAnalysis> => {
  try {
    const targetLanguage = LANGUAGE_NAMES[language];

    const prompt = `
      You are an expert nutritionist. Analyze the following text description of a food product (ingredients list, nutritional info, or name).
      
      Text to analyze:
      "${text}"

      Identify its name (if mentioned, otherwise infer or use 'Unknown Product'), price (if mentioned, otherwise 'N/A'), and ingredients.
      Provide a health rating for each ingredient and an overall summary.
      
      IMPORTANT: Respond ONLY with a JSON object that strictly follows the provided schema.
      
      Translation Rules for ${targetLanguage}:
      1. "productName": Keep the original name if evident. If the target language (${targetLanguage}) is different, append the translation in parentheses.
      2. "ingredients.name": Keep the original ingredient name. If the target language (${targetLanguage}) is different, append the translation in parentheses.
      3. "summary" and "ingredients.reason": Translate these FULLY into ${targetLanguage}.

      Do not include markdown or any text outside the JSON object.
    `;

    const response = await generateContentWithRetry(
      'gemini-2.5-flash',
      {
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      }
    );

    const jsonString = response?.text?.trim();
    if (!jsonString) throw new Error("Empty response from AI");
    
    const parsedJson = JSON.parse(jsonString);
    
    if (!parsedJson.productName || !Array.isArray(parsedJson.ingredients)) {
        throw new Error("Invalid JSON structure received from API.");
    }

    return parsedJson as FoodAnalysis;
  } catch (error: any) {
    console.error("Error analyzing food text:", error);
    let errorMessage = "Failed to analyze the text. ";
    if (error.status === 429 || (error.message && error.message.includes("RESOURCE_EXHAUSTED"))) {
        errorMessage += "The service is busy. Please wait a moment and try again.";
    } else {
        errorMessage += "Please provide more detailed product information.";
    }
    throw new Error(errorMessage);
  }
};

export const translateAnalysis = async (analysis: FoodAnalysis, language: Language): Promise<FoodAnalysis> => {
  try {
    const targetLanguage = LANGUAGE_NAMES[language];
    
    // We create a simplified prompt just for translation of the text fields
    const prompt = `
    You are a professional translator for a food nutrition app.
    Translate the following JSON content into ${targetLanguage}.

    Rules:
    1. "productName": Keep the original name if evident. If the target language (${targetLanguage}) is different, ensure there is a translation in parentheses.
    2. "ingredients[].name": Keep the original name if evident. If the target language (${targetLanguage}) is different, ensure there is a translation in parentheses.
    3. "summary": Translate this fully and naturally into ${targetLanguage}.
    4. "ingredients[].reason": Translate this fully and naturally into ${targetLanguage}.
    5. "price": Keep exactly as is.
    6. "rating": Keep exactly as is (GOOD, MODERATE, POOR, NEUTRAL).

    Input JSON:
    ${JSON.stringify(analysis)}

    Respond ONLY with the valid JSON object matching the schema.
    `;

    const response = await generateContentWithRetry(
      'gemini-2.5-flash',
      {
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      }
    );

    const jsonString = response?.text?.trim();
    if (!jsonString) throw new Error("Empty response from AI during translation");

    return JSON.parse(jsonString) as FoodAnalysis;
  } catch (error) {
    console.error("Translation error:", error);
    return analysis; // Return original if translation fails
  }
};
