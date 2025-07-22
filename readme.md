# Кафедра ШІзики - Освітня платформа зі штучного інтелекту

Освітня платформа для вивчення штучного інтелекту з підтримкою двох мов (українська та англійська), створена на базі Astro.

## Як додати нову статтю

### Крок 1: Створіть файл статті

1. Створіть директорію для категорії (якщо не існує) в папці `src/public/`:
   ```
   src/public/[Назва Категорії]/[мова]/
   ```

2. Створіть markdown файл для статті:
   ```
   src/public/Basics/uk/introduction-to-ai.md
   src/public/Basics/en/introduction-to-ai.md
   ```

3. Додайте вміст статті в markdown форматі з front matter (опціонально):
   ```markdown
   ---
   title: Вступ до штучного інтелекту
   description: Комплексний посібник для розуміння основ ШІ
   author: Д-р Сара Чен
   date: 2024-01-15
   readingTime: 12
   tags:
     - штучний-інтелект
     - машинне-навчання
     - основи
   featured: true
   difficulty: beginner
   ---
   
   # Вступ до штучного інтелекту
   
   Тут ваш контент статті...
   ```

### Крок 2: Додайте метадані статті

Відредагуйте файл `src/src/data/metadata.json` та додайте інформацію про статтю:

```json
{
  "categories": [...],
  "articles": {
    "uk": [
      {
        "title": "Вступ до штучного інтелекту",
        "description": "Комплексний посібник для розуміння основ ШІ",
        "author": "Д-р Сара Чен",
        "date": "2024-01-15",
        "readingTime": 12,
        "tags": ["штучний-інтелект", "машинне-навчання", "основи"],
        "featured": true,
        "difficulty": "beginner",
        "category": "Basics",
        "slug": "basics-uk-introduction-to-ai",
        "filePath": "Basics/uk/introduction-to-ai.md",
        "prerequisites": [],
        "relatedArticles": []
      }
    ],
    "en": [
      {
        "title": "Introduction to Artificial Intelligence",
        "description": "A comprehensive guide to understanding AI fundamentals",
        "author": "Dr. Sarah Chen",
        "date": "2024-01-15",
        "readingTime": 12,
        "tags": ["artificial-intelligence", "machine-learning", "basics"],
        "featured": true,
        "difficulty": "beginner",
        "category": "Basics",
        "slug": "basics-en-introduction-to-ai",
        "filePath": "Basics/en/introduction-to-ai.md",
        "prerequisites": [],
        "relatedArticles": []
      }
    ]
  }
}
```

### Поля метаданих статті

| Поле | Тип | Опис |
|------|-----|------|
| `title` | string | Назва статті |
| `description` | string | Короткий опис статті (показується в списках) |
| `author` | string | Автор статті |
| `date` | string | Дата публікації (YYYY-MM-DD) |
| `readingTime` | number | Час читання в хвилинах |
| `tags` | string[] | Теги для пошуку та категоризації |
| `featured` | boolean | Чи є стаття рекомендованою (показується на головній) |
| `difficulty` | string | Рівень складності: "beginner", "intermediate", "advanced" |
| `category` | string | Категорія (має збігатися з path у categories) |
| `slug` | string | Унікальний ідентифікатор для URL |
| `filePath` | string | Шлях до файлу статті відносно src/public/ |
| `prerequisites` | string[] | Список slug'ів статей-передумов |
| `relatedArticles` | string[] | Список slug'ів пов'язаних статей |

### Доступні категорії

- **Basics** (`CATEGORY_BASICS`) - Базові поняття 📚
- **Neural Networks** (`CATEGORY_NEURAL_NETWORKS`) - Нейронні мережі 🧠
- **Machine Learning** (`CATEGORY_MACHINE_LEARNING`) - Машинне навчання 🤖
- **Deep Learning** (`CATEGORY_DEEP_LEARNING`) - Глибоке навчання 🌊
- **NLP** (`CATEGORY_NLP`) - Обробка природної мови 🗣️
- **CV** (`CATEGORY_CV`) - Комп'ютерний зір 👁️
- **Tutorials** (`CATEGORY_TUTORIALS`) - Туторіали 📝
- **Ethics** (`CATEGORY_ETHICS`) - Етика ⚖️

### Рівні складності

- **beginner** - Початківець (зелений бейдж)
- **intermediate** - Середній (жовтий бейдж)  
- **advanced** - Просунутий (червоний бейдж)

### Рекомендації

1. **Унікальні slug'и**: Використовуйте формат `category-lang-article-name`
2. **Двомовність**: Створюйте статті і українською, і англійською
3. **Послідовність**: Використовуйте prerequisites для створення логічної послідовності навчання
4. **Теги**: Додавайте релевантні теги для покращення пошуку
5. **Опис**: Пишіть зрозумілий опис (150-200 символів)

## Розробка

```bash
# Перейти до директорії src
cd src

# Встановити залежності
npm install

# Запустити сервер розробки
npm run dev

# Збірка для продакшену
npm run build

# Попередній перегляд збірки
npm run preview
```

## Структура проекту

```
src/
├── public/                 # Статичні файли
│   ├── [Category]/        # Директорії з контентом
│   │   ├── en/           # Англійські статті
│   │   └── uk/           # Українські статті
│   └── favicon.svg
├── src/
│   ├── components/        # Компоненти Astro
│   ├── data/             # Дані сайту
│   │   └── metadata.json # Головний файл з метаданими
│   ├── layouts/          # Шаблони сторінок
│   ├── pages/            # Сторінки сайту
│   ├── utils/            # Утиліти
│   └── locales/          # Переклади інтерфейсу
```

## Функції платформи

- ✅ Двомовна підтримка (українська/англійська)
- ✅ Автоматична навігація по категоріях
- ✅ Система тегів та пошук
- ✅ Рівні складності з візуальними індикаторами
- ✅ Рекомендовані статті
- ✅ Зв'язки між статтями (передумови/пов'язані)
- ✅ Адаптивний дизайн
- ✅ SEO оптимізація

## Підтримка

Для питань та проблем створіть issue в GitHub репозиторії.