
import { GoogleGenAI } from "@google/genai";
import { PsychologicalAnalysis, AnalysisPreferences } from "../types";

// Always use a named parameter for apiKey and obtain it exclusively from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTherapistResponse = async (
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  userMessage: string,
  preferences?: AnalysisPreferences
) => {
  const model = "gemini-3-flash-preview";
  
  const focusText = {
    general: "تمرکز بر سلامت روان کلی و تعادل زندگی",
    career: "تمرکز ویژه بر چالش‌های شغلی، استرس کاری و موفقیت حرفه‌ای",
    relationships: "تمرکز ویژه بر روابط عاطفی، خانوادگی و مهارت‌های ارتباطی",
    anxiety: "تمرکز ویژه بر مدیریت اضطراب، حملات پانیک و آرام‌سازی ذهن"
  }[preferences?.focusArea || 'general'];

  const depthText = {
    detailed: "ارائه تحلیل‌های بسیار دقیق، موشکافانه و طولانی با ریشه‌یابی عمیق",
    balanced: "ارائه پاسخ‌های متعادل، همدلانه و با طول متوسط",
    concise: "ارائه پاسخ‌های کوتاه، کاربردی و مستقیم بدون حاشیه"
  }[preferences?.depth || 'balanced'];

  const systemInstruction = `
    شما یک روانشناس و درمانگر بالینی متخصص و مهربان هستید. نام شما "همراه خوب من 🌱" است.
    لحن شما باید کاملاً حرفه‌ای، همدلانه، آرام‌بخش و تحلیلی باشد.
    شما باید به زبان فارسی محاوره‌ای یا رسمی (بسته به لحن کاربر) صحبت کنید.
    
    تنظیمات فعلی شما:
    - اولویت تحلیل: ${focusText}
    - عمق پاسخگویی: ${depthText}
    
    وظایف شما:
    1. شنیدن فعالانه دغدغه‌های کاربر.
    2. پرسیدن سوالات دقیق برای ریشه‌یابی مشکلات.
    3. ارائه تحلیل روانشناختی از وضعیت کاربر در قالب JSON.
    
    بسیار مهم: شما حافظه گفتگوهای قبلی را دارید. از اطلاعاتی که کاربر قبلاً داده برای تحلیل دقیق‌تر استفاده کنید.
    
    پاسخ شما باید همیشه شامل دو بخش باشد که با جداکننده "---JSON---" از هم جدا شده‌اند:
    بخش اول: پاسخ متنی به کاربر.
    بخش دوم: یک شیء JSON حاوی تحلیل عددی از استرس (0-100)، اضطراب (0-100)، مود (یک کلمه فارسی)، انرژی (0-100) و یک بینش کوتاه (Insight).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      },
    });

    const fullText = response.text || "";
    const parts = fullText.split("---JSON---");
    
    let text = parts[0].trim();
    let analysis: PsychologicalAnalysis | undefined;

    if (parts[1]) {
      try {
        analysis = JSON.parse(parts[1].trim());
      } catch (e) {
        console.error("Failed to parse analysis JSON", e);
      }
    }

    return { text, analysis };
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return { text: "متأسفانه مشکلی در برقراری ارتباط با سرور پیش آمده است. لطفاً دوباره تلاش کنید.", analysis: undefined };
  }
};
