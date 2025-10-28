---
title: "Фіча-інженірінг - Перетворення даних на золото"
description: "Перетворюйте сирі дані у потужні предиктори за допомогою практичних методів створення, кодування, масштабування та відбору фіч"
author: "Кафедра ШІзики"
date: 2025-01-28
readingTime: 35
tags: ["фіча-інженірінг", "трансформація-даних", "кодування", "масштабування", "машинне-навчання", "практика"]
featured: false
difficulty: "intermediate"
category: "Machine Learning"
subcategory: "02-data-fundamentals"
prerequisites: ["01-data-quality", "02-exploratory-data-analysis", "00-python-setup-basics"]
relatedArticles: ["04-train-test-split"]
---

> **📌 Новачок у Python?** Ця стаття використовує приклади коду Python. Якщо ви раніше не працювали з Python, почніть з нашого посібника [Налаштування Python для ML](/article/tutorials-uk-00-python-setup-basics)! Це займе 35 хвилин, і ви будете готові запускати весь код звідси.

# Фіча-інженірінг - Перетворення даних на золото ⚙️

Уявіть, що ви скульптор. У вас є блок сирого мармуру (ваші дані), і вам потрібно створити шедевр (вашу ML модель). Ви могли б кидатись сирим мармуром у людей і сподіватися, що це спрацює, але це було б... незручно. Натомість ви ретельно відсікаєте, формуєте, шліфуєте і перетворюєте мармур на щось красиве й осмислене.

**Фіча-інженірінг - це саме те, що і скульптура ваших даних!**

Ось істина, яка може вас здивувати: **Різниця між посередньою ML моделлю та чудовою рідко полягає в алгоритмі. Вона в фічах.**

Ви можете застосувати найфантастичнішу модель глибокого навчання до сирих даних і отримати 70% точності. Або ви можете витратити час на створення розумних фіч з простою лінійною регресією та досягти 95%. Компанії як Netflix, Spotify та Amazon побудували свої імперії не на секретних алгоритмах, а на блискучому фіча-інженірінгу.

**У цій статті ви дізнаєтеся:**
- Як перетворити сирі дані на потужні предиктивні фічі
- Коли створювати нові фічі, а коли використовувати існуючі
- Як кодувати категорії, щоб моделі могли їх зрозуміти
- Як масштабувати фічі для оптимальної продуктивності моделі
- Як відбирати найважливіші фічі та відкидати шум

Давайте перетворимо ваші дані на золото! 💰

---

## Що таке фічі? Мова, якою розмовляє ваша модель 🗣️

### Визначення

У машинному навчанні **фічі** - це окремі вимірювані властивості або характеристики, які ваша модель використовує для прогнозування. Це колонки у вашому датасеті - але не просто будь-які колонки. Це **корисні** колонки.

Думайте про фічі як про мову, якою розмовляє ваша модель:

```
Ви (розмовляєте українською): "На вулиці холодно, п'ятничний вечір, і день зарплати!"

Ваша ML модель (розмовляє фічами):
- temperature = 5°C
- day_of_week = "Friday"
- hour = 19
- is_payday_week = True
- ...

Прогноз моделі: "Очікується високий рівень замовлень піци! 🍕"
```

### Сирі фічі проти інженерних фіч

**Сирі фічі** - це те, що ви отримуєте безпосередньо з ваших даних:
- order_id: 1001
- date: 2024-01-15
- temperature: 15°C
- num_pizzas: 2

**Інженерні фічі** - це те, що ви створюєте:
- is_weekend: True
- is_cold_day: False (15°C помірна)
- is_friday_evening: True
- orders_last_hour: 12
- price_per_pizza: 12.49

**Що більш корисне?** Майже завжди інженерні фічі! Вони фіксують патерни, зв'язки та доменні знання, які сирі числа не можуть виразити.

### Навіщо фіча-інженірінг?

Подивімося на різницю:

**Без фіча-інженірінгу:**
```python
# Сирі дані
temperature = 15

# Модель: "Що означає 15? Це добре чи погано? Я не знаю! 🤷"
```

**З фіча-інженірінгом:**
```python
# Інженерні фічі
is_cold = temperature < 10  # False
is_hot = temperature > 25   # False
temp_comfort_score = (temperature - 5) / 30  # 0.33 (нормалізовано)
temp_vs_avg_diff = temperature - 17  # -2°C нижче середнього

# Модель: "Ага! Температура помірна, трохи нижче середньої.
# На основі історичних даних, помірні температури = стандартний обсяг замовлень. 💡"
```

Друга версія дає моделі **контекст** і **значення**.

### Типи фіч

Давайте розберемо різні типи, з якими ми працюватимемо:

| Тип | Опис | Приклади | Використання в ML |
|-----|------|----------|-------------------|
| **Числові** | Безперервні числа | temperature (15.5°C), price (24.99) | Пряме використання, потрібне масштабування |
| **Категоріальні** | Дискретні категорії | day_of_week (Monday), city (NYC) | Потрібне кодування |
| **Бінарні** | Так/Ні | is_weekend (True), is_raining (False) | Легко використовувати (0/1) |
| **Порядкові** | Упорядковані категорії | size (Small < Medium < Large) | Працює label encoding |
| **Дата/час** | Мітки часу | order_time (2024-01-15 19:30) | Витягти компоненти |
| **Текст** | Вільний текст | review ("Great pizza!") | Потрібний продвинутий NLP |

У цій статті ми зосередимося на перших 5 типах - текстові фічі заслуговують на окрему статтю в серії NLP!

---

## Техніки створення фіч - Інструментарій скульптора 🛠️

Тепер давайте вивчимо конкретні техніки для створення потужних фіч. Почнемо з простих і перейдемо до просунутих методів.

### 1. Математичні перетворення

Іноді сирі числа не працюють добре з моделями. Перетворення можуть допомогти!

#### Логарифмічне перетворення

**Коли використовувати:** Скошені розподіли (дохід, ціни, населення)

```python
import numpy as np
import pandas as pd

# Проблема: Дохід має величезний діапазон ($20K до $500K)
# Модель має труднощі, бо викиди домінують

# Рішення: Логарифмічне перетворення
data['income_log'] = np.log1p(data['income'])  # log1p = log(1 + x), обробляє нулі

# До:   [20000, 50000, 100000, 500000]
# Після: [9.90, 10.82, 11.51, 13.12]

# Тепер діапазон набагато більш керований!
```

**Чому це працює:** Стискає великі значення, розширює малі, робить розподіл більш нормальним.

#### Квадратний корінь / Степеневі перетворення

**Коли використовувати:** Зменшення впливу викидів

```python
# Замовлення піци від 1 до 50
# Більшість 1-5, але кілька великих кейтерінгових замовлень викривляють дані

data['num_pizzas_sqrt'] = np.sqrt(data['num_pizzas'])

# До:   [1, 2, 3, 4, 50]
# Після: [1.0, 1.41, 1.73, 2.0, 7.07]

# Викид (50) все ще найбільший, але менш екстремальний
```

#### Біннінг (Дискретизація)

**Коли використовувати:** Перетворення безперервного в категоріальне

```python
# Температура як безперервна: 5, 10, 15, 20, 25, 30°C
# Модель бачить малі відмінності як однаково важливі

# Біннінг у категорії
bins = [0, 10, 20, 30, 40]
labels = ['холодно', 'прохолодно', 'тепло', 'спекотно']

data['temp_category'] = pd.cut(
    data['temperature'],
    bins=bins,
    labels=labels
)

# Температура 5°C → 'холодно'
# Температура 15°C → 'прохолодно'
# Температура 25°C → 'тепло'

# Тепер модель вчиться: "холодні дні = більше замовлень, спекотні дні = менше замовлень"
```

**Порада:** Вибирайте межі бінів на основі доменних знань, а не просто рівних інтервалів!

### 2. Доменно-специфічні фічі

Це де сяє ваше бізнес-знання! Давайте використаємо наш приклад піцерії.

#### Бізнес-логіка на основі часу

```python
# Фіча 1: Пікові години
# Ми знаємо з EDA, що 12-13 (обід) і 18-20 (вечеря) найзавантаженіші
data['is_peak_hour'] = data['hour'].isin([12, 13, 18, 19, 20])

# Фіча 2: Час прийому їжі
data['is_lunch_time'] = data['hour'].between(11, 14)
data['is_dinner_time'] = data['hour'].between(17, 21)

# Фіча 3: Пізні нічні замовлення
data['is_late_night'] = data['hour'].between(22, 2)  # Туса!
```

#### Фічі особливих днів

```python
# Фіча 4: П'ятничний вечір - магія
# З EDA ми бачили, що п'ятничні вечори найзавантаженіші
data['is_friday_evening'] = (
    (data['day_of_week'] == 'Friday') &
    (data['hour'] >= 18)
)

# Фіча 5: Вихідні ночі
data['is_weekend_night'] = (
    data['is_weekend'] &
    (data['hour'] >= 18)
)

# Фіча 6: Понеділкова меланхолія
# Люди не готують в понеділок (втома повернення на роботу)
data['is_monday_evening'] = (
    (data['day_of_week'] == 'Monday') &
    (data['hour'] >= 17)
)
```

#### Фічі на основі погоди

```python
# Фіча 7: Показник піцової погоди
# Холодно = люди хочуть комфортну їжу
# Спекотно = люди не хочуть вмикати піч

def pizza_weather_score(temp):
    if temp < 10:
        return 'відмінно'  # Холодно! Ідеальна піцова погода
    elif temp > 30:
        return 'погано'    # Занадто спекотно, люди хочуть салати
    else:
        return 'добре'     # Саме те

data['weather_score'] = data['temperature'].apply(pizza_weather_score)

# Фіча 8: Мороз?
data['is_freezing'] = data['temperature'] < 5

# Фіча 9: Спека?
data['is_hot_day'] = data['temperature'] > 28
```

#### Характеристики замовлення

```python
# Фіча 10: Ціна за піцу
# Виявляє оптові знижки або преміум замовлення
data['price_per_pizza'] = data['total_price'] / data['num_pizzas']

# Фіча 11: Прапорець великого замовлення
# Кейтерінг або вечірки
data['is_large_order'] = data['num_pizzas'] >= 5

# Фіча 12: Прапорець малого замовлення
# Поодинокі відвідувачі
data['is_small_order'] = data['num_pizzas'] == 1
```

**Ключовий інсайт:** Ці фічі походять з **розуміння бізнесу**, а не з фантазійної математики. Розмовляйте з експертами домену!

### 3. Фічі взаємодії

Іноді дві фічі разом розповідають історію, яку жодна не розповідає окремо.

#### Базові взаємодії

```python
# Взаємодія 1: День × Година
# П'ятниця о 19:00 дуже відрізняється від понеділка о 19:00
data['day_hour'] = data['day_of_week'] + '_' + data['hour'].astype(str)

# Створює: 'Friday_19', 'Monday_19', 'Saturday_12', тощо
# Модель вчиться: Friday_19 = завантажено, Monday_19 = помірно
```

#### Числові взаємодії

```python
# Взаємодія 2: Температура × Вихідні
# Холодно + вихідні = екстра високі замовлення
data['temp_weekend_interaction'] = (
    data['temperature'] * data['is_weekend'].astype(int)
)

# Взаємодія 3: Година × Температура
# Вечірній холод відрізняється від ранкового холоду
data['hour_temp_interaction'] = data['hour'] * data['temperature']
```

#### Поліноміальні фічі

**Коли використовувати:** Захоплення нелінійних зв'язків

```python
from sklearn.preprocessing import PolynomialFeatures

# Оригінальні фічі: [temperature, hour]
poly = PolynomialFeatures(degree=2, include_bias=False)

features = data[['temperature', 'hour']]
poly_features = poly.fit_transform(features)

# Створені нові фічі:
# temperature, hour,
# temperature², temperature×hour, hour²

# Чому це працює: Зв'язки можуть бути квадратичними
# Приклад: Замовлення досягають піку при помірній темп. (15-20°C),
#          падають і на холоді, і на спеці
```

**Попередження:** Поліноміальні фічі вибухають швидко! degree=3 з 10 фічами створює 1,000+ фіч. Використовуйте обережно.

### 4. Фічі на основі часу

Дати та час - золоті копальні для фіч!

#### Базові компоненти дати

```python
# Спочатку конвертуємо в datetime
data['date'] = pd.to_datetime(data['date'])

# Витягуємо компоненти
data['year'] = data['date'].dt.year
data['month'] = data['date'].dt.month          # 1-12
data['day'] = data['date'].dt.day              # 1-31
data['day_of_week_num'] = data['date'].dt.dayofweek  # 0=понеділок, 6=неділя
data['week_of_year'] = data['date'].dt.isocalendar().week
data['quarter'] = data['date'].dt.quarter      # Q1, Q2, Q3, Q4
data['day_of_year'] = data['date'].dt.dayofyear  # 1-365
```

#### Циклічне кодування

**Проблема:** Година 23 (23:00) і година 0 (північ) різняться на 1 годину, але модель бачить 23 - 0 = 23 (далеко один від одного!)

**Рішення:** Використовуйте синус і косинус, щоб зробити це циклічним

```python
# Циклічне кодування для години
data['hour_sin'] = np.sin(2 * np.pi * data['hour'] / 24)
data['hour_cos'] = np.cos(2 * np.pi * data['hour'] / 24)

# Година 0 (північ): sin=0, cos=1
# Година 6 (6 ранку): sin=1, cos=0
# Година 12 (полудень): sin=0, cos=-1
# Година 18 (6 вечора): sin=-1, cos=0
# Година 23 (11 вечора): sin близько до години 0!

# Циклічне кодування для місяця
data['month_sin'] = np.sin(2 * np.pi * data['month'] / 12)
data['month_cos'] = np.cos(2 * np.pi * data['month'] / 12)

# Грудень (12) і січень (1) тепер математично близькі!
```

**Чому це працює:**
```
Лінійно: Година 23 проти Години 1 = різниця в 22
Циклічно: Година 23 проти Години 1 = сусіди на колі!

Думайте про циферблат - 23:00 і 01:00 поруч один з одним.
```

#### Ковзні та лагові фічі

**Коли використовувати:** Дані часових рядів, захоплення трендів

```python
# Спочатку сортуємо по даті та годині
data = data.sort_values(['date', 'hour'])

# Ковзне середнє (moving average)
data['rolling_avg_orders_3h'] = (
    data.groupby('date')['num_pizzas']
    .transform(lambda x: x.rolling(window=3, min_periods=1).mean())
)

# Фіксує тренд: "Замовлення зростають чи зменшуються?"

# Лагові фічі (попередні значення)
data['prev_hour_orders'] = data.groupby('date')['num_pizzas'].shift(1)
data['prev_day_same_hour'] = data.groupby('hour')['num_pizzas'].shift(24)

# "Що сталося в попередню годину?"
# "Що сталося вчора в той же час?"
```

#### Фічі сезонності

```python
# Вихідні проти робочих днів
data['is_weekend'] = data['day_of_week'].isin(['Saturday', 'Sunday'])

# День зарплати (спрощено: 1-ше та 15-те число місяця)
data['is_payday'] = data['day'].isin([1, 15])

# Індикатор свята
holidays = ['2024-12-25', '2024-01-01', '2024-07-04', '2024-11-28']
data['is_holiday'] = data['date'].isin(pd.to_datetime(holidays))

# Дні до свята (люди замовляють більше)
data['days_until_holiday'] = (
    data['date'].apply(lambda x: min([(pd.to_datetime(h) - x).days
                                      for h in holidays if (pd.to_datetime(h) - x).days > 0],
                                     default=365))
)

# Сезон
def get_season(month):
    if month in [12, 1, 2]:
        return 'зима'
    elif month in [3, 4, 5]:
        return 'весна'
    elif month in [6, 7, 8]:
        return 'літо'
    else:
        return 'осінь'

data['season'] = data['month'].apply(get_season)
```

**Порада:** Думайте про ваш бізнес-календар - навчальні терміни, спортивні сезони, місцеві події!

---

## Кодування категоріальних змінних - Навчання моделей рахувати 🔢

Ось проблема: **Моделі машинного навчання розуміють лише числа.** Вони не можуть працювати з "понеділок", "вівторок" або "Нью-Йорк".

Нам потрібно конвертувати категорії в числа - але як ми це робимо, має велике значення!

### Чому кодування важливе

```
Модель бачить:
❌ "Monday" → Помилка! Не можу обчислити з текстом
✅ 1 → Окей, я можу з цим працювати

Але зачекайте:
❌ Monday=1, Tuesday=2, Wednesday=3
   Модель думає: "Wednesday у 3× Monday" 🤯

✅ Monday=[1,0,0,0,0,0,0]
   Tuesday=[0,1,0,0,0,0,0]
   Модель думає: "Це різні категорії" ✅
```

Давайте дослідимо методи кодування!

### 1. Label Encoding

**Що робить:** Присвоює кожній категорії число (0, 1, 2, 3, ...)

```python
from sklearn.preprocessing import LabelEncoder

# Приклад даних
days = ['Monday', 'Tuesday', 'Monday', 'Friday', 'Wednesday']

# Кодуємо
le = LabelEncoder()
days_encoded = le.fit_transform(days)

print(days_encoded)
# Вихід: [2 3 2 0 1]

# Декодуємо назад
print(le.inverse_transform([2, 3, 0]))
# Вихід: ['Monday' 'Tuesday' 'Friday']
```

#### Коли використовувати Label Encoding

**✅ Добре для:**
- **Порядкових даних** (дані з природним порядком)
  ```python
  # Розмір: Small < Medium < Large
  sizes = ['Small', 'Medium', 'Large', 'Medium', 'Small']
  # Кодуємо як: [0, 1, 2, 1, 0] → Порядок збережений!
  ```
- **Бінарних категорій** (лише 2 значення)
  ```python
  # Так/Ні, True/False, Чоловік/Жінка
  yn = ['Yes', 'No', 'Yes', 'No']
  # Кодуємо як: [1, 0, 1, 0]
  ```
- **Моделей на основі дерев** (Random Forest, XGBoost, тощо)
  ```python
  # Дерева можуть обробляти будь-яке числове кодування
  # Вони розбивають по значеннях, не припускають, що порядок має значення
  ```

**❌ Погано для:**
- **Номінальних даних з лінійними моделями**
  ```python
  # Місто: NYC, LA, Chicago
  # Закодовано: 0, 1, 2
  # Модель думає: "LA (1) посередині між NYC (0) та Chicago (2)" 🤯
  # Це неправильно! Міста не мають числового зв'язку
  ```

### 2. One-Hot Encoding

**Що робить:** Створює бінарну колонку для кожної категорії

```python
import pandas as pd

# Приклад: День тижня
data = pd.DataFrame({
    'day_of_week': ['Monday', 'Tuesday', 'Monday', 'Friday']
})

# One-hot кодування
data_encoded = pd.get_dummies(data, columns=['day_of_week'], prefix='day')

print(data_encoded)
```

**Вихід:**

| day_Monday | day_Tuesday | day_Wednesday | day_Thursday | day_Friday | day_Saturday | day_Sunday |
|------------|-------------|---------------|--------------|------------|--------------|------------|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 1 | 0 | 0 |

**Інтерпретація:**
- Перший рядок: Це понеділок (Monday=1, все інше=0)
- Другий рядок: Це вівторок
- Кожен рядок має рівно одну 1 і всі інші 0

#### Видалення першої колонки для уникнення мультиколінеарності

```python
# З drop_first=True
data_encoded = pd.get_dummies(
    data,
    columns=['day_of_week'],
    prefix='day',
    drop_first=True  # Видаляє колонку Monday
)

# Чому? Якщо ми знаємо, що це НЕ Вівт, Сер, Чет, П'ят, Суб, Нед...
# то це ОБОВ'ЯЗКОВО понеділок! (надлишкова інформація)
```

#### Коли використовувати One-Hot Encoding

**✅ Добре для:**
- **Номінальних категорій** (без природного порядку)
  ```python
  # Міста, кольори, типи продуктів
  ```
- **Кількох унікальних значень** (< 10-15 категорій)
  ```python
  # day_of_week (7 значень) → 7 колонок
  ```
- **Лінійних моделей** (Linear Regression, Logistic Regression, Neural Networks)
  ```python
  # Цим моделям потрібні незалежні фічі
  ```

**❌ Погано для:**
- **Високої кардинальності** (багато унікальних значень)
  ```python
  # 1,000 міст → 1,000 колонок! 💥
  # Ваш датасет вибухає за розміром
  ```
- **Обмежень пам'яті**
  ```python
  # Кожна категорія = нова колонка
  # 100 категорій × 1M рядків = 100M значень!
  ```

#### Обробка високої кардинальності

**Стратегія 1: Групування рідкісних категорій**

```python
# Проблема: 1,000 унікальних міст, але 950 мають < 10 замовлень

# Рішення: Залишити топ N, згрупувати решту як "Other"
top_cities = data['city'].value_counts().nlargest(10).index

data['city_grouped'] = data['city'].apply(
    lambda x: x if x in top_cities else 'Other'
)

# Тепер лише 11 категорій: Топ 10 + "Other"
data_encoded = pd.get_dummies(data, columns=['city_grouped'])
```

**Стратегія 2: Кодування частоти**

```python
# Кодуємо за тим, як часто з'являється кожна категорія
city_counts = data['city'].value_counts()
data['city_frequency'] = data['city'].map(city_counts)

# NYC (10,000 замовлень) → 10000
# Small Town (5 замовлень) → 5
```

### 3. Target Encoding (Mean Encoding)

**Що робить:** Замінює категорію середнім значенням цільової змінної для цієї категорії

```python
# Приклад: Прогнозуємо num_pizzas на основі day_of_week

# Обчислюємо середнє num_pizzas для кожного дня
target_means = data.groupby('day_of_week')['num_pizzas'].mean()

print(target_means)
# Friday      3.2  (найвищий!)
# Saturday    3.0
# Monday      1.8
# Tuesday     1.9
# ...

# Кодуємо
data['day_target_encoded'] = data['day_of_week'].map(target_means)
```

**Результат:**

| day_of_week | num_pizzas | day_target_encoded |
|-------------|------------|--------------------|
| Friday | 4 | 3.2 |
| Monday | 2 | 1.8 |
| Friday | 3 | 3.2 |
| Tuesday | 1 | 1.9 |

**Чому це потужно:** Кодування захоплює зв'язок з цільовою змінною!

#### Коли використовувати Target Encoding

**✅ Добре для:**
- **Високої кардинальності категоріальних змінних**
  ```python
  # 1,000 міст → лише 1 колонка із середніми цілі
  ```
- **Сильного зв'язку з ціллю**
  ```python
  # Місто значно впливає на замовлення піци
  ```
- **Моделей на основі дерев і лінійних моделей**

**⚠️ Попередження:**
- **Ризик перенавчання!** Кодування включає інформацію з цілі
- **Потрібна крос-валідація або окремі train/test**

#### Найкращі практики Target Encoding

```python
from category_encoders import TargetEncoder
from sklearn.model_selection import train_test_split

# Спочатку розділяємо!
X_train, X_test, y_train, y_test = train_test_split(
    data.drop('num_pizzas', axis=1),
    data['num_pizzas'],
    test_size=0.2,
    random_state=42
)

# Фітуємо енкодер лише на тренувальних даних
encoder = TargetEncoder(cols=['city'])
encoder.fit(X_train, y_train)

# Трансформуємо обидва набори
X_train_encoded = encoder.transform(X_train)
X_test_encoded = encoder.transform(X_test)

# Тестові дані використовують тренувальну статистику (без витоку!)
```

### Порівняння методів кодування

| Метод | Переваги | Недоліки | Найкраще для | Вихідні колонки |
|-------|----------|----------|--------------|-----------------|
| **Label Encoding** | Простий, компактний | Передбачає хибний порядок | Порядкові дані, моделі дерев | 1 |
| **One-Hot Encoding** | Без хибного порядку, зрозумілий | Висока розмірність | Кілька категорій, лінійні моделі | N (N = # категорій) |
| **Target Encoding** | Добре обробляє високу кардинальність, захоплює зв'язок з ціллю | Ризик перенавчання, потрібна обережна валідація | Багато категорій, сильна кореляція з ціллю | 1 |

---

## Масштабування та нормалізація фіч - Вирівнювання ігрового поля ⚖️

### Навіщо масштабувати фічі?

Уявіть, що ви порівнюєте двох студентів:
- Студент A: Оцінка з математики = 95/100, Зріст = 170 см
- Студент B: Оцінка з математики = 85/100, Зріст = 180 см

Якщо ви запитаєте "хто кращий загалом?", ваша модель може подумати:
```
A: 95 + 170 = 265 балів загалом
B: 85 + 180 = 265 балів загалом
```

Зачекайте, це нісенітниця! Ви щойно додали тестові бали до зросту! 🤦

**Проблема:** Фічі на різних шкалах плутають моделі.

```
Наші дані піцерії:
- Temperature: -5°C до 35°C (діапазон: 40)
- Price: $12.99 до $98.99 (діапазон: 86)
- Hour: 10 до 23 (діапазон: 13)
- num_pizzas: 1 до 8 (діапазон: 7)

Без масштабування:
Модель думає "price у 12× важливіша за num_pizzas" (бо більші числа!)
```

**Моделі, на які впливає масштаб:**
- Linear Regression, Logistic Regression
- Neural Networks
- Support Vector Machines (SVM)
- K-Nearest Neighbors (KNN)
- K-Means Clustering

**Моделі, на які НЕ впливає:**
- Decision Trees, Random Forest, XGBoost (вони розбивають по значеннях, а не величинах)

### 1. Min-Max масштабування (Нормалізація)

**Формула:** `X_scaled = (X - X_min) / (X_max - X_min)`

**Результат:** Всі значення між 0 і 1

```python
from sklearn.preprocessing import MinMaxScaler

# Приклад: Температура від -5°C до 35°C
temps = np.array([[-5], [5], [15], [25], [35]])

scaler = MinMaxScaler()
temps_scaled = scaler.fit_transform(temps)

print(temps_scaled)
# Вихід:
# [0.0]   # -5°C → 0 (мінімум)
# [0.25]  # 5°C  → 0.25
# [0.5]   # 15°C → 0.5
# [0.75]  # 25°C → 0.75
# [1.0]   # 35°C → 1 (максимум)
```

#### Коли використовувати Min-Max масштабування

**✅ Добре для:**
- **Neural Networks** (більшість активацій працюють краще з [0, 1] або [-1, 1])
- **Зображень** (значення пікселів 0-255 → 0-1)
- **Коли ви знаєте межі min/max** (температура, відсотки)
- **Алгоритмів на основі відстаней** (KNN, K-Means)

**❌ Погано для:**
- **Даних з викидами**
  ```python
  # Дані: [1, 2, 3, 4, 100]
  # Масштабовано: [0, 0.01, 0.02, 0.03, 1.0]
  # Все стиснуто біля 0 через викид!
  ```
- **Необмежених фіч** (може вийти за межі тренованого діапазону)

### 2. Стандартизація (Z-Score нормалізація)

**Формула:** `X_scaled = (X - mean) / std`

**Результат:** Середнє = 0, Стандартне відхилення = 1

```python
from sklearn.preprocessing import StandardScaler

temps = np.array([[-5], [5], [15], [25], [35]])

scaler = StandardScaler()
temps_scaled = scaler.fit_transform(temps)

print(temps_scaled)
# Вихід:
# [-1.41]  # -5°C  → 1.41 std нижче середнього
# [-0.71]  # 5°C   → 0.71 std нижче середнього
# [0.0]    # 15°C  → точно на середньому
# [0.71]   # 25°C  → 0.71 std вище середнього
# [1.41]   # 35°C  → 1.41 std вище середнього
```

#### Коли використовувати стандартизацію

**✅ Добре для:**
- **Лінійних моделей** (Linear/Logistic Regression, SVM)
- **Даних з викидами** (менш чутливо ніж min-max)
- **Фіч, що слідують нормальному розподілу**
- **Коли ви не знаєте майбутній min/max**

**✅ Найпоширеніший вибір** для загального ML!

### 3. Робастне масштабування

**Формула:** `X_scaled = (X - median) / IQR`

Де IQR = 75-й персентиль - 25-й персентиль

**Результат:** Використовує медіану та IQR замість середнього та std (стійке до викидів!)

```python
from sklearn.preprocessing import RobustScaler

# Дані з викидами
prices = np.array([[10], [12], [13], [15], [14], [13], [200]])  # 200 викид!

scaler = RobustScaler()
prices_scaled = scaler.fit_transform(prices)

print(prices_scaled)
# Вихід: Викид все ще більший, але не такий екстремальний
```

#### Коли використовувати робастне масштабування

**✅ Добре для:**
- **Даних з багатьма викидами**
- **Скошених розподілів**
- **Коли ви хочете стабільності**

### Приклад порівняння масштабування

Подивімося, як різні методи обробляють викиди:

```python
# Дані з викидом: [1, 2, 3, 4, 100]

# Min-Max масштабування:
# [0.0, 0.01, 0.02, 0.03, 1.0]
# → Все стиснуто біля 0! 😱

# Стандартизація:
# [-0.5, -0.4, -0.3, -0.2, 2.8]
# → Викид все ще домінує

# Робастне масштабування:
# [-0.67, -0.33, 0.0, 0.33, 32.0]
# → Більш збалансований розподіл
```

### Критичне попередження: Уникайте витоку даних!

**❌ НЕПРАВИЛЬНО:** Фітуємо на весь датасет, потім розділяємо

```python
# НЕ РОБІТЬ ТАК!
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)  # Використовує ВСІ дані
train, test = train_test_split(data_scaled)  # Розділяємо після масштабування

# Проблема: Тестові дані вплинули на скейлер!
# Модель бачила тестову статистику (середнє, std) під час тренування
```

**✅ ПРАВИЛЬНО:** Спочатку розділяємо, фітуємо лише на тренувальних даних

```python
# РОБІТЬ ТАК!
train, test = train_test_split(data)  # Спочатку розділяємо

scaler = StandardScaler()
train_scaled = scaler.fit_transform(train)  # Вчимося лише з train
test_scaled = scaler.transform(test)        # Застосовуємо train статистику

# Тестові дані справді невидимі!
```

### Масштабування на практиці: Приклад піцерії

```python
from sklearn.preprocessing import StandardScaler

# Фічі, які потребують масштабування
numerical_features = ['temperature', 'hour', 'price_per_pizza', 'rolling_avg_orders_3h']

# Спочатку розділяємо дані
X_train, X_test, y_train, y_test = train_test_split(
    data.drop('num_pizzas', axis=1),
    data['num_pizzas'],
    test_size=0.2,
    random_state=42
)

# Фітуємо скейлер на тренувальних даних
scaler = StandardScaler()
X_train[numerical_features] = scaler.fit_transform(X_train[numerical_features])

# Застосовуємо до тестових даних (використовуючи тренувальну статистику!)
X_test[numerical_features] = scaler.transform(X_test[numerical_features])

print("Тренувальні дані масштабовані використовуючи власну статистику")
print("Тестові дані масштабовані використовуючи тренувальну статистику (без витоку!)")
```

---

## Відбір фіч - Якість понад кількість 🎯

Ви створили 50 фіч. Чудово! Але ось річ: **більше фіч ≠ краща модель.**

**Проблеми з занадто великою кількістю фіч:**
- **Перенавчання:** Модель запам'ятовує шум замість патернів
- **Повільне тренування:** Більше фіч = більше обчислень
- **Прокляття розмірності:** Дані стають розрідженими у високих вимірах
- **Складніше інтерпретувати:** Не можна пояснити 50 фіч стейкхолдерам

**Рішення:** Відбирайте лише найкорисніші фічі!

### 1. Фільтр-методи (Швидкі, незалежні від моделі)

#### Видалення фіч з низькою варіацією

Якщо фіча має те саме значення скрізь, вона марна!

```python
from sklearn.feature_selection import VarianceThreshold

# Видаляємо фічі з дуже низькою варіацією
selector = VarianceThreshold(threshold=0.1)  # Налаштуйте поріг
X_reduced = selector.fit_transform(X_train)

# Приклад: Якщо 'is_holiday' False у 99.9% випадків,
# вона має майже нульову варіацію → видаляємо!
```

#### Видалення високо корельованих фіч

Якщо дві фічі корельовані на 99%, залиште одну, видаліть іншу.

```python
# Обчислюємо матрицю кореляції
correlation_matrix = X_train.corr()

# Знаходимо високо корельовані пари
high_corr = (correlation_matrix.abs() > 0.95) & (correlation_matrix != 1.0)

# Приклад: total_price та num_pizzas мають кореляцію 0.985
# Вони говорять майже те саме!
# Залишаємо одну (більш предиктивну), видаляємо іншу

# Видаляємо total_price, залишаємо num_pizzas
X_train.drop('total_price', axis=1, inplace=True)
X_test.drop('total_price', axis=1, inplace=True)
```

### 2. Wrapper-методи (Повільніші, специфічні для моделі)

#### Рекурсивне видалення фіч (RFE)

Тренуємо модель, знаходимо найменш важливу фічу, видаляємо її, повторюємо!

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LinearRegression

# Створюємо модель
model = LinearRegression()

# Вибираємо топ 10 фіч
rfe = RFE(model, n_features_to_select=10, step=1)
rfe.fit(X_train, y_train)

# Отримуємо вибрані фічі
selected_features = X_train.columns[rfe.support_]

print(f"Топ 10 фіч: {list(selected_features)}")

# Трансформуємо дані
X_train_selected = X_train[selected_features]
X_test_selected = X_test[selected_features]
```

### 3. Вбудовані методи (Кращі з обох світів)

#### Важливість фіч з моделей на основі дерев

Random Forests та XGBoost природно обчислюють важливість фіч!

```python
from sklearn.ensemble import RandomForestRegressor
import matplotlib.pyplot as plt

# Тренуємо Random Forest
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Отримуємо важливість фіч
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nТоп 10 найважливіших фіч:")
print(feature_importance.head(10))

# Візуалізація
plt.figure(figsize=(10, 6))
top_10 = feature_importance.head(10)
plt.barh(range(len(top_10)), top_10['importance'])
plt.yticks(range(len(top_10)), top_10['feature'])
plt.xlabel('Показник важливості')
plt.title('Топ 10 фіч для прогнозування замовлень піци')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()
```

**Приклад виходу:**

| feature | importance |
|---------|-----------|
| is_friday_evening | 0.245 |
| hour_sin | 0.187 |
| temperature | 0.156 |
| is_peak_hour | 0.128 |
| rolling_avg_orders_3h | 0.092 |
| price_per_pizza | 0.071 |
| is_weekend | 0.054 |
| day_target_encoded | 0.037 |
| month_sin | 0.019 |
| is_cold_day | 0.011 |

**Інсайт:** `is_friday_evening` (доменна фіча!) найважливіша. Просте перемагає складне!

---

## Зібрати все разом - Повний пайплайн 🏗️

Давайте створимо повний пайплайн фіча-інженірінгу, використовуючи дані піцерії Мама ML!

### Крок 1: Завантаження даних

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import matplotlib.pyplot as plt
import seaborn as sns

# Завантажуємо очищені дані з попередніх статей
orders = pd.read_csv('pizza_orders_clean.csv')

print("🍕 Піцерія Мама ML - Пайплайн фіча-інженірінгу")
print("=" * 60)
print(f"Форма датасету: {orders.shape}")
print(f"Діапазон дат: {orders['date'].min()} до {orders['date'].max()}")
```

### Крок 2: Створення фіч на основі часу

```python
# Конвертуємо дату
orders['date'] = pd.to_datetime(orders['date'])

# Витягуємо базові компоненти
orders['hour'] = orders['date'].dt.hour
orders['day_of_week'] = orders['date'].dt.day_name()
orders['month'] = orders['date'].dt.month
orders['day_of_month'] = orders['date'].dt.day
orders['is_weekend'] = orders['day_of_week'].isin(['Saturday', 'Sunday'])

# Циклічне кодування
orders['hour_sin'] = np.sin(2 * np.pi * orders['hour'] / 24)
orders['hour_cos'] = np.cos(2 * np.pi * orders['hour'] / 24)
orders['month_sin'] = np.sin(2 * np.pi * orders['month'] / 12)
orders['month_cos'] = np.cos(2 * np.pi * orders['month'] / 12)

print("\n✅ Фічі на основі часу створено")
```

### Крок 3: Створення доменно-специфічних фіч

```python
# Пікові години (з інсайтів EDA)
orders['is_peak_hour'] = orders['hour'].isin([12, 13, 18, 19, 20])
orders['is_lunch'] = orders['hour'].between(11, 14)
orders['is_dinner'] = orders['hour'].between(17, 21)

# Спеціальні комбінації днів
orders['is_friday_evening'] = (
    (orders['day_of_week'] == 'Friday') &
    (orders['hour'] >= 18)
)
orders['is_weekend_night'] = orders['is_weekend'] & (orders['hour'] >= 18)

# Фічі погоди
orders['is_cold_day'] = orders['temperature'] < 10
orders['is_hot_day'] = orders['temperature'] > 28
orders['temp_category'] = pd.cut(
    orders['temperature'],
    bins=[-np.inf, 10, 20, np.inf],
    labels=['холодно', 'помірно', 'тепло']
)

# Характеристики замовлення
orders['is_large_order'] = orders['num_pizzas'] >= 5
orders['price_per_pizza'] = orders['total_price'] / orders['num_pizzas']

print("✅ Доменно-специфічні фічі створено")
```

### Крок 4: Створення лагових фіч

```python
# Сортуємо по даті для фіч часових рядів
orders = orders.sort_values(['date'])

# Замовлення попередньої години
orders['prev_hour_orders'] = orders.groupby(orders['date'].dt.date)['num_pizzas'].shift(1)

# Ковзне середнє (вікно 3 години)
orders['rolling_avg_3h'] = (
    orders.groupby(orders['date'].dt.date)['num_pizzas']
    .transform(lambda x: x.rolling(window=3, min_periods=1).mean())
)

# Заповнюємо NaN від shift операції
orders['prev_hour_orders'].fillna(orders['num_pizzas'].mean(), inplace=True)

print("✅ Лагові фічі створено")
```

### Крок 5: Кодування категоріальних змінних

```python
# One-hot кодування категоріальних фіч
orders_encoded = pd.get_dummies(
    orders,
    columns=['day_of_week', 'temp_category'],
    prefix=['day', 'temp'],
    drop_first=True  # Уникаємо мультиколінеарності
)

print("✅ Категоріальні змінні закодовано")
print(f"Фічі після кодування: {orders_encoded.shape[1]}")
```

### Крок 6: Розділення даних (Уникаємо витоку!)

```python
# Визначаємо фічі та ціль
feature_cols = [col for col in orders_encoded.columns
                if col not in ['date', 'order_id', 'num_pizzas', 'total_price']]

X = orders_encoded[feature_cols]
y = orders_encoded['num_pizzas']

# Розділяємо: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\n✅ Дані розділено:")
print(f"Тренувальні зразки: {len(X_train)}")
print(f"Тестові зразки: {len(X_test)}")
```

### Крок 7: Масштабування числових фіч

```python
# Вибираємо числові фічі, які потребують масштабування
numerical_features = [
    'temperature', 'hour', 'month', 'day_of_month',
    'price_per_pizza', 'prev_hour_orders', 'rolling_avg_3h',
    'hour_sin', 'hour_cos', 'month_sin', 'month_cos'
]

# Фітуємо скейлер лише на тренувальних даних
scaler = StandardScaler()
X_train[numerical_features] = scaler.fit_transform(X_train[numerical_features])

# Трансформуємо тестові дані використовуючи тренувальну статистику
X_test[numerical_features] = scaler.transform(X_test[numerical_features])

print("✅ Числові фічі масштабовано (без витоку даних!)")
```

### Крок 8: Тренування моделі та отримання важливості фіч

```python
# Тренуємо Random Forest
print("\n🤖 Тренуємо модель Random Forest...")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Оцінюємо
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"✅ Модель натреновано!")
print(f"Тренувальний R²: {train_score:.3f}")
print(f"Тестовий R²: {test_score:.3f}")

# Отримуємо прогнози
y_pred = model.predict(X_test)

from sklearn.metrics import mean_absolute_error, mean_squared_error
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"MAE: {mae:.2f} піц")
print(f"RMSE: {rmse:.2f} піц")
```

### Крок 9: Аналіз важливості фіч

```python
# Створюємо датафрейм важливості фіч
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n📊 Топ 15 найважливіших фіч:")
print(feature_importance.head(15).to_string(index=False))

# Візуалізуємо
plt.figure(figsize=(12, 8))
top_15 = feature_importance.head(15)
plt.barh(range(len(top_15)), top_15['importance'])
plt.yticks(range(len(top_15)), top_15['feature'])
plt.xlabel('Показник важливості')
plt.title('Топ 15 фіч для прогнозування замовлень піци')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()
```

### Крок 10: Порівняння до і після

Давайте порівняємо з базовою моделлю, використовуючи лише сирі фічі!

```python
# Базова лінія: Лише сирі фічі (без інженірінгу)
baseline_features = ['hour', 'temperature', 'is_weekend']
X_baseline_train = orders[baseline_features].loc[X_train.index]
X_baseline_test = orders[baseline_features].loc[X_test.index]

# Масштабуємо
scaler_baseline = StandardScaler()
X_baseline_train_scaled = scaler_baseline.fit_transform(X_baseline_train)
X_baseline_test_scaled = scaler_baseline.transform(X_baseline_test)

# Тренуємо
baseline_model = RandomForestRegressor(n_estimators=100, random_state=42)
baseline_model.fit(X_baseline_train_scaled, y_train)

# Оцінюємо
baseline_test_score = baseline_model.score(X_baseline_test_scaled, y_test)
baseline_pred = baseline_model.predict(X_baseline_test_scaled)
baseline_mae = mean_absolute_error(y_test, baseline_pred)

print("\n📈 ДО vs ПІСЛЯ фіча-інженірінгу:")
print("=" * 60)
```

**Результати:**

| Метрика | До FE | Після FE | Покращення |
|---------|-------|----------|------------|
| Кількість фіч | 3 | 23 | +667% |
| R² Score (Test) | 0.62 | 0.87 | +40% |
| MAE | 0.85 піц | 0.32 піц | -62% |
| Якість фіч | Лише сирі | Домен + Час + Взаємодії | Набагато краще! |

```python
print(f"{'Метрика':<25} {'До FE':<15} {'Після FE':<15} {'Покращення'}")
print("-" * 70)
print(f"{'Фічі':<25} {3:<15} {len(X_train.columns):<15} +{(len(X_train.columns)-3)/3*100:.0f}%")
print(f"{'R² Score':<25} {baseline_test_score:<15.3f} {test_score:<15.3f} +{(test_score-baseline_test_score)/baseline_test_score*100:.0f}%")
print(f"{'MAE (піц)':<25} {baseline_mae:<15.2f} {mae:<15.2f} {(mae-baseline_mae)/baseline_mae*100:.0f}%")
```

**Ключові інсайти:**

```python
print("\n💡 КЛЮЧОВІ ІНСАЙТИ:")
print("1. is_friday_evening (доменна фіча) найважливіша")
print("2. Циклічне кодування (hour_sin/cos) перемагає сиру hour")
print("3. Фічі взаємодії захоплюють складні патерни")
print("4. Більше фіч ≠ завжди краще (зменшувальна віддача після топ 15)")
print("5. Доменні знання > складна математика")
```

---

## Найкращі практики та контрольний список робочого процесу 📋

### Повний робочий процес фіча-інженірінгу

```
📋 КОНТРОЛЬНИЙ СПИСОК ФІЧА-ІНЖЕНІРІНГУ

1️⃣ РОЗУМІЙТЕ ВАШІ ДАНІ (З EDA)
   □ Переглянути результати та інсайти EDA
   □ Визначити патерни та зв'язки
   □ Відзначити відсутні значення та викиди
   □ Зрозуміти бізнес-контекст

2️⃣ СТВОРИТИ ФІЧІ
   □ Фічі на основі часу (година, день, місяць, циклічне кодування)
   □ Доменно-специфічні фічі (бізнес-логіка, спеціальні випадки)
   □ Фічі взаємодії (комбінації фіча × фіча)
   □ Математичні перетворення (log, sqrt, binning)
   □ Лагові фічі та ковзні середні (часові ряди)

3️⃣ ЗАКОДУВАТИ КАТЕГОРІАЛЬНІ ЗМІННІ
   □ Вибрати метод кодування (label, one-hot, target)
   □ Обробити високу кардинальність (згрупувати рідкісні категорії)
   □ Уникнути витоку даних (fit на train, transform test)

4️⃣ РОЗДІЛИТИ ДАНІ
   □ Розділити ПЕРЕД масштабуванням/кодуванням (критично!)
   □ Використовувати стратифікацію для незбалансованих даних
   □ Встановити random_state для відтворюваності

5️⃣ МАСШТАБУВАТИ ЧИСЛОВІ ФІЧІ
   □ Вибрати метод масштабування (StandardScaler зазвичай найкращий)
   □ Фітувати скейлер лише на тренувальних даних
   □ Трансформувати обидва train і test
   □ Зберегти скейлер для продакшену

6️⃣ ВІДІБРАТИ ФІЧІ
   □ Видалити фічі з низькою варіацією
   □ Перевірити матрицю кореляції (видалити надлишкові)
   □ Використати важливість фіч (моделі на основі дерев)
   □ Валідувати з крос-валідацією

7️⃣ ВАЛІДУВАТИ ТА ДОКУМЕНТУВАТИ
   □ Протестувати на відкладеному наборі
   □ Перевірити на витік даних
   □ Документувати всі трансформації
   □ Зберегти пайплайн попередньої обробки
   □ Записати визначення фіч
```

### Поширені помилки, яких слід уникати

```python
print("\n⚠️ ПОМИЛКИ ФІЧА-ІНЖЕНІРІНГУ, ЯКИХ СЛІД УНИКАТИ:")
print("=" * 60)

print("\n❌ Помилка 1: Використання тестових даних для створення фіч")
print("НЕПРАВИЛЬНО: mean = entire_dataset['age'].mean()")
print("ПРАВИЛЬНО: mean = train_data['age'].mean()")
print("→ Завжди розділяйте СПОЧАТКУ, потім створюйте фічі")

print("\n❌ Помилка 2: Створення занадто багатьох фіч наосліп")
print("Більше фіч ≠ краща модель")
print("→ Починайте просто, додавайте складність поступово")
print("→ Моніторте продуктивність з кожною доданою фічею")

print("\n❌ Помилка 3: Не обробка відсутніх значень у нових фічах")
print("Нові фічі можуть створити нові NaN значення!")
print("→ Перевіряйте на NaN після кожної трансформації")
print("→ fillna() або імпутуйте відповідно")

print("\n❌ Помилка 4: Ігнорування мультиколінеарності")
print("Високо корельовані фічі плутають лінійні моделі")
print("→ Перевіряйте матрицю кореляції")
print("→ Видаляйте надлишкові фічі (кореляція > 0.95)")

print("\n❌ Помилка 5: Не документування трансформацій")
print("'Яку фічу я створив минулого тижня?' 🤔")
print("→ Записуйте кожне визначення фічі")
print("→ Ведіть лог фіча-інженірінгу")

print("\n❌ Помилка 6: Створення фіч з цільової змінної")
print("Витік даних! Модель буде шахраювати!")
print("→ НІКОЛИ не використовуйте ціль для створення фіч")
print("→ Приклад: Не створюйте 'avg_target_by_city' на повному датасеті")

print("\n❌ Помилка 7: Забування зберегти об'єкти попередньої обробки")
print("Не можна використати модель у продакшені без скейлерів/енкодерів!")
print("→ Збережіть скейлер, енкодер, назви фіч")
print("→ Використовуйте joblib або pickle")
```

### Пайплайн фіча-інженірінгу (готовий до продакшену)

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Визначаємо групи фіч
numerical_features = ['temperature', 'hour', 'price_per_pizza']
categorical_features = ['day_of_week']

# Створюємо трансформери
numerical_transformer = Pipeline(steps=[
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'))
])

# Комбінуємо трансформери
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ],
    remainder='passthrough'  # Залишити інші фічі
)

# Повний пайплайн
from sklearn.ensemble import RandomForestRegressor

full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Тренуємо (один рядок!)
full_pipeline.fit(X_train, y_train)

# Прогнозуємо (один рядок!)
predictions = full_pipeline.predict(X_test)

# Зберігаємо для продакшену
import joblib
joblib.dump(full_pipeline, 'pizza_model_pipeline.pkl')

print("✅ Повний пайплайн збережено!")
print("   Завантажити у продакшені: joblib.load('pizza_model_pipeline.pkl')")
```

---

## Підсумок та наступні кроки 🎯

### Що ви навчилися

**1. Сила фіча-інженірінгу**
- Фічі важливіші за алгоритми
- Доменні знання перемагають складну математику
- Хороші фічі = прості моделі працюють чудово

**2. Техніки створення фіч**
- Математичні перетворення (log, sqrt, binning)
- Доменно-специфічні фічі бізнес-логіки
- Фічі на основі часу (циклічне кодування, лаги, ковзні)
- Фічі взаємодії (комбінування кількох фіч)

**3. Кодування категоріальних змінних**
- Label encoding (порядкові дані, моделі дерев)
- One-hot encoding (номінальні дані, лінійні моделі)
- Target encoding (висока кардинальність, обережна валідація)

**4. Масштабування фіч**
- Min-Max масштабування (від 0 до 1, нейронні мережі)
- Стандартизація (середнє=0, std=1, найпоширеніше)
- Робастне масштабування (медіана/IQR, викиди)
- Завжди спочатку розділяйте, потім масштабуйте!

**5. Відбір фіч**
- Фільтр-методи (варіація, кореляція)
- Wrapper-методи (RFE)
- Вбудовані методи (важливість фіч)
- Якість > кількість

**6. Найкращі практики для продакшену**
- Документуйте все
- Уникайте витоку даних
- Використовуйте пайплайни
- Зберігайте об'єкти попередньої обробки

### Подорож даними досі

```
Сирі дані
    ↓
[Стаття 1: Очищення даних] ✅
    ↓
[Стаття 2: EDA] ✅
    ↓
[Стаття 3: Фіча-інженірінг] ✅ (Ви тут!)
    ↓
ML-готові дані
    ↓
[Стаття 4: Train/Test розділення] → Далі!
    ↓
[Тренування моделі]
    ↓
[Продакшен]
```

### Що далі?

У **Статті 4: Train, Validate, Test - Правильне розділення даних**, ми навчимося:
- Навіщо потрібні окремі train/validation/test набори
- Як правильно розділяти дані (уникнення витоку)
- Техніки крос-валідації
- Розділення часових рядів (без підглядання в майбутнє!)
- Стратифіковане семплування для незбалансованих даних

Тепер у вас є чудово інженерні фічі. Далі ми навчимося, як правильно їх розділити, щоб наші моделі справді узагальнювалися на нові дані!

### Практичні вправи

**Вправа 1: Створіть власні фічі**
```python
# Використовуючи датасет піци, створіть:
# 1. Фічу для "ранкових замовлень" (6:00 - 11:00)
# 2. Фічу, що комбінує температуру та is_weekend
# 3. Циклічне кодування для day_of_month (1-31)
```

**Вправа 2: Виклик кодування**
```python
# У вас є колонка 'customer_city' з 500 унікальними містами
# Лише 20 міст мають > 100 замовлень
# Як би ви це закодували? (Підказка: Стратегія з Розділу 4)
```

**Вправа 3: Відбір фіч**
```python
# Ви створили 40 фіч
# Натренуйте Random Forest і залиште лише фічі з важливістю > 0.01
# Скільки фіч залишається?
# Який R² score до і після відбору?
```

### Подальше читання

**Книги:**
- "Feature Engineering for Machine Learning" by Alice Zheng & Amanda Casari
- "Hands-On Machine Learning" by Aurélien Géron (Розділ 4)

**Документація:**
- scikit-learn preprocessing: https://scikit-learn.org/stable/modules/preprocessing.html
- pandas datetime: https://pandas.pydata.org/docs/user_guide/timeseries.html
- category_encoders: https://contrib.scikit-learn.org/category_encoders/

**Kaggle:**
- Feature Engineering туторіали
- Переможні рішення змагань (фіча-інженірінг часто секретний інгредієнт!)

---

**Готові перетворити ваші дані на золото?** Починайте експериментувати з цими техніками на ваших власних датасетах!

Пам'ятайте: **Починайте просто, ітеруйте та завжди валідуйте**. Фіча-інженірінг - це стільки ж мистецтво, скільки й наука. 🎨

Щасливого інженірінгу! 💪✨
