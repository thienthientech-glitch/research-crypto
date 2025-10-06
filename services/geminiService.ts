import { GoogleGenAI, Type } from "@google/genai";
import type { CryptoProjectAnalysis } from '../types';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING, description: 'Tên đầy đủ và chính xác của dự án.' },
    strengths: { type: Type.STRING, description: 'Các điểm mạnh cốt lõi của dự án (công nghệ, đội ngũ, cộng đồng, v.v.).' },
    weaknesses: { type: Type.STRING, description: 'Các điểm yếu hoặc thiếu sót của dự án.' },
    potential: { type: Type.STRING, description: 'Tiềm năng tăng trưởng và phát triển trong tương lai.' },
    risks: { type: Type.STRING, description: 'Các rủi ro chính (cạnh tranh, pháp lý, kỹ thuật, v.v.).' },
    foundersAndTeam: { type: Type.STRING, description: 'Thông tin về nhà sáng lập và đội ngũ phát triển chính.' },
    tokenomics: { type: Type.STRING, description: 'Phân tích về mô hình kinh tế của token (phân phối, tiện ích, lạm phát/giảm phát).' },
    technology: { type: Type.STRING, description: 'Công nghệ nền tảng và các trường hợp sử dụng thực tế.' },
    community: { type: Type.STRING, description: 'Đánh giá về sức mạnh và sự tương tác của cộng đồng.' },
  },
  required: ['projectName', 'strengths', 'weaknesses', 'potential', 'risks', 'foundersAndTeam', 'tokenomics', 'technology', 'community']
};

export const analyzeCryptoProject = async (projectName: string, projectUrl: string, geminiApiKey: string): Promise<Omit<CryptoProjectAnalysis, 'id' | 'originalName'>> => {
  if (!geminiApiKey) {
    throw new Error("Gemini API Key is missing. Please configure it in the setup screen.");
  }
  
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  try {
    const prompt = `
      Phân tích sâu về dự án tiền điện tử sau đây để đánh giá tiềm năng đầu tư.
      Tên dự án: ${projectName}
      Trang web chính thức: ${projectUrl}

      Cung cấp một bản phân tích ngắn gọn, súc tích và khách quan cho từng mục trong schema JSON.
      Tập trung vào các thông tin quan trọng nhất mà một nhà đầu tư cần biết.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation
    if (!parsedData.projectName) {
        throw new Error("Invalid response format from API");
    }

    return parsedData as Omit<CryptoProjectAnalysis, 'id' | 'originalName'>;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};