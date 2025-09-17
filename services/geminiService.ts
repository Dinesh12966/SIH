import { GoogleGenAI, Type } from "@google/genai";
import { Priority, CategorizationResult, ImageAnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};


const textResponseSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: 'A refined, more specific category for the issue based on the user\'s initial selection and description (e.g., "Pothole Repair", "Missed Trash Collection", "Broken Streetlight").',
    },
    priority: {
      type: Type.STRING,
      enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH],
      description: 'The urgency of the issue.',
    },
    summary: {
      type: Type.STRING,
      description: 'A brief, one-sentence summary of the user\'s description.',
    },
  },
  required: ['category', 'priority', 'summary'],
};

const imageResponseSchema = {
    type: Type.OBJECT,
    properties: {
        issueDetected: {
            type: Type.BOOLEAN,
            description: 'A boolean indicating whether a clear civic issue (like a pothole, graffiti, overflowing trash, broken streetlight, etc.) is visible in the image.',
        },
        category: {
            type: Type.STRING,
            description: 'If an issue is detected, provide a specific category for it (e.g., "Pothole", "Graffiti", "Overflowing Bin", "Broken Streetlight"). If not, this should be an empty string.',
        },
        description: {
            type: Type.STRING,
            description: 'If an issue is detected, provide a detailed, objective description of what is visible in the image. If not, briefly state what the image contains (e.g., "A photo of a dog").',
        },
        priority: {
            type: Type.STRING,
            enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH],
            description: 'If an issue is detected, assess its priority. If not, default to "Low".',
        },
        summary: {
            type: Type.STRING,
            description: 'A brief, one-sentence summary of the issue. If no issue, this should be an empty string.',
        },
    },
    required: ['issueDetected', 'category', 'description', 'priority', 'summary'],
};


export const categorizeIssue = async (description: string, manualCategory: string, customCategory?: string): Promise<CategorizationResult> => {
  try {
    const selectedCategory = customCategory || manualCategory;
    const prompt = `
      You are an AI assistant for a civic issue reporting system. Your task is to analyze a citizen's report and classify it.
      The user has already categorized the issue under: "${selectedCategory}".
      
      Based on this category and the following detailed description, please determine a more specific, refined category, assign a priority level, and provide a short summary.

      Consider the potential for public safety hazards, environmental impact, and disruption to daily life when assigning priority.
      - HIGH: Poses an immediate threat to safety or health (e.g., "power line down", "major water leak", "sinkhole").
      - MEDIUM: Significant inconvenience or potential for minor harm (e.g., "large pothole on a busy street", "traffic light out").
      - LOW: Nuisance or minor issue (e.g., "graffiti", "overgrown park grass").
      
      User's description: "${description}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: textResponseSchema,
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText) as CategorizationResult;

    // Validate the priority enum
    if (!Object.values(Priority).includes(result.priority)) {
        console.warn(`Gemini returned invalid priority: ${result.priority}. Defaulting to Medium.`);
        result.priority = Priority.MEDIUM;
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API for text categorization:", error);
    throw new Error("Failed to categorize issue. Please try again.");
  }
};


export const analyzeIssueFromImage = async (file: File): Promise<ImageAnalysisResult> => {
    try {
        const base64Data = await fileToBase64(file);
        const imagePart = {
            inlineData: {
                mimeType: file.type,
                data: base64Data,
            },
        };

        const textPart = {
            text: `
                Analyze the attached image from a citizen. Your task is to identify if it depicts a civic issue.
                - If a civic issue is clearly visible (e.g., pothole, overflowing trash, graffiti, broken streetlight, fallen tree, etc.), set 'issueDetected' to true. Then, provide a specific 'category', a detailed 'description' of what you see, and a 'priority' based on potential danger or disruption.
                - If the image does not show a clear civic issue (e.g., it's a selfie, a pet, a landscape), set 'issueDetected' to false and briefly describe the image content in the 'description' field.
                - Follow the response schema precisely.
            `,
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: imageResponseSchema,
            },
        });
        
        const jsonText = response.text;
        const result = JSON.parse(jsonText) as ImageAnalysisResult;

        // Validate the priority enum
        if (result.issueDetected && !Object.values(Priority).includes(result.priority)) {
            console.warn(`Gemini returned invalid priority from image: ${result.priority}. Defaulting to Medium.`);
            result.priority = Priority.MEDIUM;
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API for image analysis:", error);
        throw new Error("Failed to analyze image. Please check the file and try again.");
    }
};