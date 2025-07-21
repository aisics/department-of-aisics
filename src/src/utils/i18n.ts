export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

let translations: Translations = {};

// Configure your GitHub repository here
const GITHUB_OWNER = 'aisics';
const GITHUB_REPO = 'department-of-aisics';
const GITHUB_BRANCH = 'main';

export async function loadTranslations(): Promise<void> {
  try {
    // Load Ukrainian translations
    const ukResponse = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/locales/uk.json`
    );
    
    // Load English translations
    const enResponse = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/locales/en.json`
    );
    
    if (ukResponse.ok && enResponse.ok) {
      const ukTranslations = await ukResponse.json();
      const enTranslations = await enResponse.json();
      
      translations = {
        uk: ukTranslations,
        en: enTranslations
      };
    } else {
      console.error('Failed to load translations from GitHub');
      // Fallback to default translations
      translations = getDefaultTranslations();
    }
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to default translations
    translations = getDefaultTranslations();
  }
}

function getDefaultTranslations(): Translations {
  return {
    uk: {
      // Header
      'site.title': 'Освіта ШІ',
      'site.subtitle': 'Вивчай • Досліджуй • Відкривай',
      'search.placeholder': 'Пошук статей...',
      
      // Navigation
      'nav.home': 'Головна',
      'nav.categories': 'Категорії',
      'nav.chooseJourney': 'Обери свій шлях і розвивайся',
      
      // Homepage
      'hero.title': 'Опануй штучний інтелект',
      'hero.description': 'Комплексні статті та підручники, що охоплюють все від основ машинного навчання до передових методів глибокого навчання. Почни свою подорож у світ ШІ сьогодні.',
      
      // Features
      'features.title': 'Чому варто вивчати ШІ?',
      'features.description': 'Штучний інтелект змінює світ. Приєднуйся до революції та стань частиною майбутнього.',
      'features.comprehensive.title': 'Всебічне навчання',
      'features.comprehensive.description': 'Від базових концепцій до передових технік - все що потрібно для опанування ШІ.',
      'features.practical.title': 'Практичні приклади',
      'features.practical.description': 'Реальні проекти та код, які можна використати у власних розробках.',
      'features.expert.title': 'Експертні знання',
      'features.expert.description': 'Матеріали від провідних фахівців галузі з багаторічним досвідом.',
      
      // Learning Path
      'path.title': 'Твій шлях до майстерності',
      'path.description': 'Структурований підхід до вивчення штучного інтелекту від новачка до експерта.',
      'path.step1.title': 'Основи',
      'path.step1.description': 'Вивчи фундаментальні концепції ШІ та машинного навчання.',
      'path.step2.title': 'Практика',
      'path.step2.description': 'Застосуй знання на реальних проектах та завданнях.',
      'path.step3.title': 'Спеціалізація',
      'path.step3.description': 'Обери напрямок: NLP, комп\'ютерний зір, або глибоке навчання.',
      'path.step4.title': 'Майстерність',
      'path.step4.description': 'Стань експертом та створюй власні ШІ-рішення.',
      
      // Motivation
      'motivation.title': 'Майбутнє вже тут',
      'motivation.description': 'ШІ не просто технологія - це інструмент, який дозволить тобі вирішувати найскладніші проблеми людства та створювати неймовірні речі.',
      'motivation.future.title': 'Майбутнє',
      'motivation.future.description': 'Будь частиною технологічної революції',
      'motivation.innovation.title': 'Інновації',
      'motivation.innovation.description': 'Створюй рішення, які змінюють світ',
      'motivation.impact.title': 'Вплив',
      'motivation.impact.description': 'Роби різницю в житті мільйонів людей',
      
      // CTA Section
      'cta.startLearning': 'Почати навчання',
      'cta.exploreContent': 'Дослідити контент',
      'cta.github': 'Слідкувати на GitHub',
      
      // Sorry Popup
      'popup.sorry.title': 'Вибачте!',
      'popup.sorry.message': 'У цій категорії поки що немає контенту. Ми працюємо над додаванням нових статей!',
      'popup.sorry.button': 'Зрозуміло',
      
      // Article page
      'article.home': 'Головна',
      'article.helpful': 'Чи була ця стаття корисною?',
      'article.thumbsUp': 'Корисно',
      'article.thumbsDown': 'Не корисно'
    },
    en: {
      // Header
      'site.title': 'AI Education',
      'site.subtitle': 'Learn • Explore • Discover',
      'search.placeholder': 'Search articles...',
      
      // Navigation
      'nav.home': 'Home',
      'nav.categories': 'Categories',
      'nav.chooseJourney': 'Choose your journey and empower',
      
      // Homepage
      'hero.title': 'Master Artificial Intelligence',
      'hero.description': 'Comprehensive articles and tutorials covering everything from machine learning basics to advanced deep learning techniques. Start your AI journey today.',
      
      // Features
      'features.title': 'Why Learn AI?',
      'features.description': 'Artificial Intelligence is transforming the world. Join the revolution and become part of the future.',
      'features.comprehensive.title': 'Comprehensive Learning',
      'features.comprehensive.description': 'From basic concepts to advanced techniques - everything you need to master AI.',
      'features.practical.title': 'Practical Examples',
      'features.practical.description': 'Real projects and code that you can use in your own developments.',
      'features.expert.title': 'Expert Knowledge',
      'features.expert.description': 'Materials from leading industry experts with years of experience.',
      
      // Learning Path
      'path.title': 'Your Path to Mastery',
      'path.description': 'A structured approach to learning artificial intelligence from beginner to expert.',
      'path.step1.title': 'Fundamentals',
      'path.step1.description': 'Learn the fundamental concepts of AI and machine learning.',
      'path.step2.title': 'Practice',
      'path.step2.description': 'Apply knowledge to real projects and challenges.',
      'path.step3.title': 'Specialization',
      'path.step3.description': 'Choose your direction: NLP, computer vision, or deep learning.',
      'path.step4.title': 'Mastery',
      'path.step4.description': 'Become an expert and create your own AI solutions.',
      
      // Motivation
      'motivation.title': 'The Future is Here',
      'motivation.description': 'AI is not just technology - it\'s a tool that will allow you to solve humanity\'s most complex problems and create incredible things.',
      'motivation.future.title': 'Future',
      'motivation.future.description': 'Be part of the technological revolution',
      'motivation.innovation.title': 'Innovation',
      'motivation.innovation.description': 'Create solutions that change the world',
      'motivation.impact.title': 'Impact',
      'motivation.impact.description': 'Make a difference in millions of lives',
      
      // CTA Section
      'cta.startLearning': 'Start Learning',
      'cta.exploreContent': 'Explore Content',
      'cta.github': 'Follow on GitHub',
      
      // Sorry Popup
      'popup.sorry.title': 'Sorry!',
      'popup.sorry.message': 'This category doesn\'t have any content yet. We\'re working on adding more articles soon!',
      'popup.sorry.button': 'Got it',
      
      // Article page
      'article.home': 'Home',
      'article.helpful': 'Was this article helpful?',
      'article.thumbsUp': 'Helpful',
      'article.thumbsDown': 'Not helpful'
    }
  };
}

export function getTranslation(lang: string, key: string): string {
  // Handle nested keys like 'categories.basics'
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }
  
  // If not found in current language, try English
  if (value === undefined) {
    value = translations['en'];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
  }
  
  return value || key;
}

export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'uk';
  }
  return 'uk';
}

export function setLanguage(lang: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    window.location.reload();
  }
}