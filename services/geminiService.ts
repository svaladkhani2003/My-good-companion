
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PsychologicalAnalysis, AnalysisPreferences, MediaPart, ThemeSettings } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Text Generation - Handles Thinking, Search, and Multimodal Analysis
 */
export const getTherapistResponse = async (
  history: { role: 'user' | 'model', parts: any[] }[],
  userMessageParts: any[],
  preferences?: AnalysisPreferences,
  theme?: ThemeSettings
) => {
  const ai = getAI();
  const isThinking = preferences?.thinkingEnabled;
  const isSearch = preferences?.searchEnabled;
  const modelSpeed = preferences?.modelSpeed || 'balanced';
  const depth = preferences?.depth || 'balanced';
  const focus = preferences?.focusArea || 'general';
  const tone = preferences?.responseTone || 'balanced';

  // Choose model based on complexity/speed preference
  let modelName = 'gemini-3-flash-preview';
  if (modelSpeed === 'fast') modelName = 'gemini-flash-lite-latest';
  if (modelSpeed === 'pro' || isThinking) modelName = 'gemini-3-pro-preview';

  const personalityPrompt = theme?.personalityMode === 'kind' 
    ? "شما یک همراه بسیار دلسوز، مهربان و با محبت هستید."
    : "شما یک روانشناس بالینی حرفه‌ای و دقیق هستید.";

  const tonePrompt = tone === 'empathetic'
    ? "پاسخ‌های شما باید به شدت همدلانه، گرم و سرشار از درک عاطفی باشد."
    : tone === 'direct'
    ? "پاسخ‌های شما باید صریح، مستقیم، بدون حاشیه و کاملاً منطقی باشد."
    : "پاسخ‌های شما باید تعادلی میان همدلی و منطق برقرار کند.";

  const depthPrompt = depth === 'detailed' 
    ? "تحلیل‌های بسیار عمیق، ریشه‌ای و مفصل ارائه دهید." 
    : depth === 'concise' ? "پاسخ‌های کوتاه، چکیده و متمرکز ارائه دهید." : "پاسخ‌های استاندارد و متعادل ارائه دهید.";

  const focusPrompt = focus === 'career' ? "تمرکز شما بر جنبه‌های شغلی و حرفه‌ای باشد."
    : focus === 'relationships' ? "تمرکز شما بر روابط عاطفی و اجتماعی باشد."
    : focus === 'anxiety' ? "تمرکز شما بر مهار اضطراب و مدیریت استرس باشد."
    : "تمرکز شما بر تمامی ابعاد سلامت روان باشد.";

  const config: any = {
    systemInstruction: `شما "همراه خوب من" هستید. ${personalityPrompt} ${tonePrompt} ${depthPrompt} ${focusPrompt}
    پاسخ خود را به زبان فارسی ارائه دهید. 
    همیشه در انتهای پاسخ خود، بعد از جداکننده "---JSON---"، یک آبجکت JSON شامل تحلیل وضعیت روانی کاربر ارائه دهید:
    { "stressLevel": number (0-100), "anxietyLevel": number (0-100), "mood": string, "energy": number (0-100), "insight": string }`,
    temperature: 0.8,
  };

  if (isThinking && modelName.includes('pro')) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  if (isSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [...history, { role: 'user', parts: userMessageParts }],
      config,
    });

    const fullText = response.text || "";
    const [text, jsonPart] = fullText.split("---JSON---");
    
    let analysis: PsychologicalAnalysis | undefined;
    if (jsonPart) {
      try {
        analysis = JSON.parse(jsonPart.trim());
      } catch (e) {
        console.error("Failed to parse analysis JSON", e);
      }
    }

    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "منبع",
      uri: chunk.web?.uri
    })).filter((c: any) => c.uri) || [];

    return { text: text.trim(), analysis, grounding };
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return { text: "متأسفانه در پردازش پیام مشکلی پیش آمد.", grounding: [] };
  }
};

/**
 * Dynamic Assessment Helper - Returns structured question and options
 */
export const getAssessmentQuestion = async (testTitle: string, history: any[], previousAnswer?: string) => {
  const ai = getAI();
  const prompt = previousAnswer 
    ? `کاربر پاسخ داد: "${previousAnswer}". بر اساس این پاسخ، سوال بعدی آزمون "${testTitle}" را بپرس. پاسخ باید دقیقاً در قالب JSON باشد شامل یک سوال و چهار گزینه پاسخ.`
    : `اولین سوال آزمون روانشناختی "${testTitle}" را طراحی کن. پاسخ باید دقیقاً در قالب JSON باشد شامل یک سوال و چهار گزینه پاسخ.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Must be exactly 4 realistic multiple-choice options."
            }
          },
          required: ["question", "options"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Assessment Error:", error);
    return { question: "خطایی رخ داد. لطفاً دوباره تلاش کنید.", options: ["تلاش مجدد"] };
  }
};

/**
 * Image Generation
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any } },
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (error) { return null; }
};

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      },
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (error) { return null; }
};

export const generateVideo = async (prompt: string, imageBase64?: string) => {
  const ai = getAI();
  try {
    const payload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    };
    if (imageBase64) payload.image = { imageBytes: imageBase64.split(',')[1], mimeType: 'image/png' };
    let operation = await ai.models.generateVideos(payload);
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error) { return null; }
};

export const speakText = async (text: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (error) {}
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
