
import { Assessment } from './types';

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'mbti',
    title: 'شخصیت‌شناسی MBTI',
    description: 'تحلیل عمیق ترجیحات شخصیتی و نحوه تعامل با جهان اطراف.',
    questions: 60,
    duration: 12,
    category: 'شخصیت'
  },
  {
    id: 'beck-anxiety',
    title: 'سنجش اضطراب بک',
    description: 'ارزیابی دقیق سطح اضطراب فیزیولوژیک و شناختی.',
    questions: 21,
    duration: 5,
    category: 'بالینی'
  },
  {
    id: 'beck-depression',
    title: 'پرسشنامه افسردگی بک (BDI)',
    description: 'یکی از معتبرترین ابزارهای سنجش شدت افسردگی در بزرگسالان.',
    questions: 21,
    duration: 10,
    category: 'بالینی'
  },
  {
    id: 'neo-pi-r',
    title: 'تست شخصیت نئو (NEO PI-R)',
    description: 'ارزیابی جامع ۵ عامل بزرگ شخصیت: روان‌رنجوری، برون‌گرایی، گشودگی، توافق و وظیفه‌شناسی.',
    questions: 240,
    duration: 45,
    category: 'شخصیت'
  },
  {
    id: 'daily-mood',
    title: 'چکاپ روزانه خلق و خو',
    description: 'بررسی وضعیت احساسی امروز برای الگوسازی دقیق‌تر.',
    questions: 10,
    duration: 3,
    category: 'روزانه',
    completed: true
  }
];

export const INITIAL_ANALYSIS = {
  stressLevel: 45,
  anxietyLevel: 30,
  mood: 'متعادل',
  energy: 60,
  insight: 'شروع یک مسیر جدید برای خودشناسی.'
};
