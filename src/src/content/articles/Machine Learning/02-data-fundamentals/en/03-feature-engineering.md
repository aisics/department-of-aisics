---
title: "Feature Engineering - Turning Data into Gold"
description: "Transform raw data into powerful predictors with practical feature creation, encoding, scaling, and selection techniques"
author: "Department of AIsiCs"
date: 2025-01-28
readingTime: 35
tags: ["feature-engineering", "data-transformation", "encoding", "scaling", "machine-learning", "practice"]
featured: false
difficulty: "intermediate"
category: "Machine Learning"
subcategory: "02-data-fundamentals"
prerequisites: ["01-data-quality", "02-exploratory-data-analysis", "00-python-setup-basics"]
relatedArticles: ["04-train-test-split"]
---

> **📌 New to Python?** This article uses Python code examples. If you haven't used Python before, start with our [Python Setup for ML](/article/tutorials-en-00-python-setup-basics) guide first! It takes 35 minutes and you'll be ready to run all the code here.

# Feature Engineering - Turning Data into Gold ⚙️

Imagine you're a sculptor. You have a block of raw marble (your data), and you need to create a masterpiece (your ML model). You could throw the raw marble at people and hope it works, but that would be... awkward. Instead, you carefully chip away, shape, refine, and transform the marble into something beautiful and meaningful.

**Feature engineering is exactly that - sculpting your data!**

Here's a truth that might surprise you: **The difference between a mediocre ML model and a great one is rarely the algorithm. It's the features.**

You can throw the fanciest deep learning model at raw data and get 70% accuracy. Or you can spend time crafting smart features with a simple linear regression and hit 95%. Companies like Netflix, Spotify, and Amazon built their empires not on secret algorithms, but on brilliant feature engineering.

**In this article, you'll learn:**
- How to transform raw data into powerful predictive features
- When to create new features vs use existing ones
- How to encode categories so models can understand them
- How to scale features for optimal model performance
- How to select the most important features and drop the noise

Let's turn your data into gold! 💰

---

## What Are Features? The Language Your Model Speaks 🗣️

### Definition

In machine learning, **features** are the individual measurable properties or characteristics that your model uses to make predictions. They're the columns in your dataset - but not just any columns. They're the **useful** columns.

Think of features as the language your model speaks:

```
You (speaking English): "It's cold outside, Friday evening, and it's payday!"

Your ML Model (speaking Features):
- temperature = 5°C
- day_of_week = "Friday"
- hour = 19
- is_payday_week = True
- ...

Model's prediction: "High pizza orders expected! 🍕"
```

### Raw Features vs Engineered Features

**Raw features** are what you get directly from your data:
- order_id: 1001
- date: 2024-01-15
- temperature: 15°C
- num_pizzas: 2

**Engineered features** are what you create:
- is_weekend: True
- is_cold_day: False (15°C is moderate)
- is_friday_evening: True
- orders_last_hour: 12
- price_per_pizza: 12.49

**Which is more useful?** Almost always the engineered features! They capture patterns, relationships, and domain knowledge that raw numbers can't express.

### Why Feature Engineering?

Let's see the difference:

**Without Feature Engineering:**
```python
# Raw data
temperature = 15

# Model: "What does 15 mean? Is it good or bad? I don't know! 🤷"
```

**With Feature Engineering:**
```python
# Engineered features
is_cold = temperature < 10  # False
is_hot = temperature > 25   # False
temp_comfort_score = (temperature - 5) / 30  # 0.33 (normalized)
temp_vs_avg_diff = temperature - 17  # -2°C below average

# Model: "Ah! Temperature is moderate, slightly below average.
# Based on historical data, moderate temps = standard order volume. 💡"
```

The second version gives the model **context** and **meaning**.

### Types of Features

Let's understand the different types we'll work with:

| Type | Description | Examples | ML Use |
|------|-------------|----------|--------|
| **Numerical** | Continuous numbers | temperature (15.5°C), price (24.99) | Direct use, scaling needed |
| **Categorical** | Discrete categories | day_of_week (Monday), city (NYC) | Needs encoding |
| **Binary** | True/False | is_weekend (True), is_raining (False) | Easy to use (0/1) |
| **Ordinal** | Ordered categories | size (Small < Medium < Large) | Label encoding works |
| **Datetime** | Timestamps | order_time (2024-01-15 19:30) | Extract components |
| **Text** | Free text | review ("Great pizza!") | Advanced NLP needed |

For this article, we'll focus on the first 5 types - text features deserve their own article in the NLP series!

---

## Feature Creation Techniques - The Sculptor's Toolkit 🛠️

Now let's learn the actual techniques to create powerful features. We'll start simple and build up to advanced methods.

### 1. Mathematical Transformations

Sometimes, the raw numbers don't work well with models. Transformations can help!

#### Log Transformation

**When to use:** Skewed distributions (income, prices, populations)

```python
import numpy as np
import pandas as pd

# Problem: Income has huge range ($20K to $500K)
# Model struggles because outliers dominate

# Solution: Log transformation
data['income_log'] = np.log1p(data['income'])  # log1p = log(1 + x), handles zeros

# Before: [20000, 50000, 100000, 500000]
# After:  [9.90, 10.82, 11.51, 13.12]

# Now the range is much more manageable!
```

**Why it works:** Compresses large values, spreads small values, makes distribution more normal.

#### Square Root / Power Transformations

**When to use:** Reduce impact of outliers

```python
# Pizza orders range from 1 to 50
# Most are 1-5, but a few big catering orders skew data

data['num_pizzas_sqrt'] = np.sqrt(data['num_pizzas'])

# Before: [1, 2, 3, 4, 50]
# After:  [1.0, 1.41, 1.73, 2.0, 7.07]

# Outlier (50) is still largest, but less extreme
```

#### Binning (Discretization)

**When to use:** Convert continuous to categorical

```python
# Temperature as continuous: 5, 10, 15, 20, 25, 30°C
# Model sees small differences as equally important

# Binning into categories
bins = [0, 10, 20, 30, 40]
labels = ['cold', 'cool', 'warm', 'hot']

data['temp_category'] = pd.cut(
    data['temperature'],
    bins=bins,
    labels=labels
)

# Temperature 5°C → 'cold'
# Temperature 15°C → 'cool'
# Temperature 25°C → 'warm'

# Now model learns: "cold days = more orders, hot days = fewer orders"
```

**Pro tip:** Choose bin boundaries based on domain knowledge, not just equal intervals!

### 2. Domain-Specific Features

This is where your business knowledge shines! Let's use our pizza restaurant example.

#### Time-Based Business Logic

```python
# Feature 1: Peak hours
# We know from EDA that 12-13 (lunch) and 18-20 (dinner) are busy
data['is_peak_hour'] = data['hour'].isin([12, 13, 18, 19, 20])

# Feature 2: Meal times
data['is_lunch_time'] = data['hour'].between(11, 14)
data['is_dinner_time'] = data['hour'].between(17, 21)

# Feature 3: Late night orders
data['is_late_night'] = data['hour'].between(22, 2)  # Party crowd!
```

#### Special Day Features

```python
# Feature 4: Friday evening magic
# From EDA, we saw Friday evenings are busiest
data['is_friday_evening'] = (
    (data['day_of_week'] == 'Friday') &
    (data['hour'] >= 18)
)

# Feature 5: Weekend nights
data['is_weekend_night'] = (
    data['is_weekend'] &
    (data['hour'] >= 18)
)

# Feature 6: Monday blues
# People don't cook on Mondays (back to work fatigue)
data['is_monday_evening'] = (
    (data['day_of_week'] == 'Monday') &
    (data['hour'] >= 17)
)
```

#### Weather-Based Features

```python
# Feature 7: Pizza weather score
# Cold = people want comfort food
# Hot = people don't want to turn on the oven

def pizza_weather_score(temp):
    if temp < 10:
        return 'great'  # Cold! Perfect pizza weather
    elif temp > 30:
        return 'poor'   # Too hot, people want salads
    else:
        return 'good'   # Just right

data['weather_score'] = data['temperature'].apply(pizza_weather_score)

# Feature 8: Is it freezing?
data['is_freezing'] = data['temperature'] < 5

# Feature 9: Is it hot?
data['is_hot_day'] = data['temperature'] > 28
```

#### Order Characteristics

```python
# Feature 10: Price per pizza
# Detects bulk discounts or premium orders
data['price_per_pizza'] = data['total_price'] / data['num_pizzas']

# Feature 11: Large order flag
# Catering or party orders
data['is_large_order'] = data['num_pizzas'] >= 5

# Feature 12: Small order flag
# Solo diners
data['is_small_order'] = data['num_pizzas'] == 1
```

**Key insight:** These features come from **understanding the business**, not from fancy math. Talk to domain experts!

### 3. Interaction Features

Sometimes, two features together tell a story that neither tells alone.

#### Basic Interactions

```python
# Interaction 1: Day × Hour
# Friday at 7 PM is very different from Monday at 7 PM
data['day_hour'] = data['day_of_week'] + '_' + data['hour'].astype(str)

# Creates: 'Friday_19', 'Monday_19', 'Saturday_12', etc.
# Model learns: Friday_19 = busy, Monday_19 = moderate
```

#### Numerical Interactions

```python
# Interaction 2: Temperature × Weekend
# Cold + weekend = extra high orders
data['temp_weekend_interaction'] = (
    data['temperature'] * data['is_weekend'].astype(int)
)

# Interaction 3: Hour × Temperature
# Evening cold is different from morning cold
data['hour_temp_interaction'] = data['hour'] * data['temperature']
```

#### Polynomial Features

**When to use:** Capture non-linear relationships

```python
from sklearn.preprocessing import PolynomialFeatures

# Original features: [temperature, hour]
poly = PolynomialFeatures(degree=2, include_bias=False)

features = data[['temperature', 'hour']]
poly_features = poly.fit_transform(features)

# New features created:
# temperature, hour,
# temperature², temperature×hour, hour²

# Why it works: Relationships might be quadratic
# Example: Orders peak at moderate temp (15-20°C),
#          drop at both cold and hot extremes
```

**Warning:** Polynomial features explode quickly! degree=3 with 10 features creates 1,000+ features. Use carefully.

### 4. Time-Based Features

Dates and times are goldmines for features!

#### Basic Date Components

```python
# Convert to datetime first
data['date'] = pd.to_datetime(data['date'])

# Extract components
data['year'] = data['date'].dt.year
data['month'] = data['date'].dt.month          # 1-12
data['day'] = data['date'].dt.day              # 1-31
data['day_of_week_num'] = data['date'].dt.dayofweek  # 0=Monday, 6=Sunday
data['week_of_year'] = data['date'].dt.isocalendar().week
data['quarter'] = data['date'].dt.quarter      # Q1, Q2, Q3, Q4
data['day_of_year'] = data['date'].dt.dayofyear  # 1-365
```

#### Cyclical Encoding

**Problem:** Hour 23 (11 PM) and hour 0 (midnight) are 1 hour apart, but the model sees 23 - 0 = 23 (far apart!)

**Solution:** Use sine and cosine to make it circular

```python
# Cyclical encoding for hour
data['hour_sin'] = np.sin(2 * np.pi * data['hour'] / 24)
data['hour_cos'] = np.cos(2 * np.pi * data['hour'] / 24)

# Hour 0 (midnight): sin=0, cos=1
# Hour 6 (6 AM): sin=1, cos=0
# Hour 12 (noon): sin=0, cos=-1
# Hour 18 (6 PM): sin=-1, cos=0
# Hour 23 (11 PM): sin close to hour 0!

# Cyclical encoding for month
data['month_sin'] = np.sin(2 * np.pi * data['month'] / 12)
data['month_cos'] = np.cos(2 * np.pi * data['month'] / 12)

# December (12) and January (1) are now mathematically close!
```

**Why it works:**
```
Linear: Hour 23 vs Hour 1 = difference of 22
Cyclical: Hour 23 vs Hour 1 = neighbors on a circle!

Think of a clock face - 11 PM and 1 AM are right next to each other.
```

#### Rolling and Lag Features

**When to use:** Time series data, capturing trends

```python
# Sort by date and hour first
data = data.sort_values(['date', 'hour'])

# Rolling average (moving average)
data['rolling_avg_orders_3h'] = (
    data.groupby('date')['num_pizzas']
    .transform(lambda x: x.rolling(window=3, min_periods=1).mean())
)

# Captures trend: "Orders increasing or decreasing?"

# Lag features (previous values)
data['prev_hour_orders'] = data.groupby('date')['num_pizzas'].shift(1)
data['prev_day_same_hour'] = data.groupby('hour')['num_pizzas'].shift(24)

# "What happened in the previous hour?"
# "What happened yesterday at the same time?"
```

#### Seasonality Features

```python
# Weekend vs weekday
data['is_weekend'] = data['day_of_week'].isin(['Saturday', 'Sunday'])

# Payday (simplified: 1st and 15th of month)
data['is_payday'] = data['day'].isin([1, 15])

# Holiday indicator
holidays = ['2024-12-25', '2024-01-01', '2024-07-04', '2024-11-28']
data['is_holiday'] = data['date'].isin(pd.to_datetime(holidays))

# Days before holiday (people order more)
data['days_until_holiday'] = (
    data['date'].apply(lambda x: min([(pd.to_datetime(h) - x).days
                                      for h in holidays if (pd.to_datetime(h) - x).days > 0],
                                     default=365))
)

# Season
def get_season(month):
    if month in [12, 1, 2]:
        return 'winter'
    elif month in [3, 4, 5]:
        return 'spring'
    elif month in [6, 7, 8]:
        return 'summer'
    else:
        return 'fall'

data['season'] = data['month'].apply(get_season)
```

**Pro tip:** Think about your business calendar - school terms, sports seasons, local events!

---

## Encoding Categorical Variables - Teaching Models to Count 🔢

Here's the problem: **Machine learning models only understand numbers.** They can't work with "Monday", "Tuesday", or "New York".

We need to convert categories into numbers - but how we do it matters a lot!

### Why Encoding Matters

```
Model sees:
❌ "Monday" → Error! Can't compute with text
✅ 1 → Okay, I can work with this

But wait:
❌ Monday=1, Tuesday=2, Wednesday=3
   Model thinks: "Wednesday is 3× Monday" 🤯

✅ Monday=[1,0,0,0,0,0,0]
   Tuesday=[0,1,0,0,0,0,0]
   Model thinks: "These are different categories" ✅
```

Let's explore the encoding methods!

### 1. Label Encoding

**What it does:** Assigns each category a number (0, 1, 2, 3, ...)

```python
from sklearn.preprocessing import LabelEncoder

# Example data
days = ['Monday', 'Tuesday', 'Monday', 'Friday', 'Wednesday']

# Encode
le = LabelEncoder()
days_encoded = le.fit_transform(days)

print(days_encoded)
# Output: [2 3 2 0 1]

# Decode back
print(le.inverse_transform([2, 3, 0]))
# Output: ['Monday' 'Tuesday' 'Friday']
```

#### When to Use Label Encoding

**✅ Good for:**
- **Ordinal data** (data with natural order)
  ```python
  # Size: Small < Medium < Large
  sizes = ['Small', 'Medium', 'Large', 'Medium', 'Small']
  # Encode as: [0, 1, 2, 1, 0] → Order preserved!
  ```
- **Binary categories** (only 2 values)
  ```python
  # Yes/No, True/False, Male/Female
  yn = ['Yes', 'No', 'Yes', 'No']
  # Encode as: [1, 0, 1, 0]
  ```
- **Tree-based models** (Random Forest, XGBoost, etc.)
  ```python
  # Trees can handle any numerical encoding
  # They split on values, don't assume order matters
  ```

**❌ Bad for:**
- **Nominal data with linear models**
  ```python
  # City: NYC, LA, Chicago
  # Encoded: 0, 1, 2
  # Model thinks: "LA (1) is halfway between NYC (0) and Chicago (2)" 🤯
  # This is wrong! Cities have no numerical relationship
  ```

### 2. One-Hot Encoding

**What it does:** Creates a binary column for each category

```python
import pandas as pd

# Example: Day of week
data = pd.DataFrame({
    'day_of_week': ['Monday', 'Tuesday', 'Monday', 'Friday']
})

# One-hot encode
data_encoded = pd.get_dummies(data, columns=['day_of_week'], prefix='day')

print(data_encoded)
```

**Output:**

| day_Monday | day_Tuesday | day_Wednesday | day_Thursday | day_Friday | day_Saturday | day_Sunday |
|------------|-------------|---------------|--------------|------------|--------------|------------|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 1 | 0 | 0 |

**Interpretation:**
- First row: It's Monday (Monday=1, everything else=0)
- Second row: It's Tuesday
- Each row has exactly one 1 and all other 0s

#### Drop First to Avoid Multicollinearity

```python
# With drop_first=True
data_encoded = pd.get_dummies(
    data,
    columns=['day_of_week'],
    prefix='day',
    drop_first=True  # Drops Monday column
)

# Why? If we know it's NOT Tue, Wed, Thu, Fri, Sat, Sun...
# then it MUST be Monday! (redundant information)
```

#### When to Use One-Hot Encoding

**✅ Good for:**
- **Nominal categories** (no natural order)
  ```python
  # Cities, colors, product types
  ```
- **Few unique values** (< 10-15 categories)
  ```python
  # day_of_week (7 values) → 7 columns
  ```
- **Linear models** (Linear Regression, Logistic Regression, Neural Networks)
  ```python
  # These models need features to be independent
  ```

**❌ Bad for:**
- **High cardinality** (many unique values)
  ```python
  # 1,000 cities → 1,000 columns! 💥
  # Your dataset explodes in size
  ```
- **Memory constraints**
  ```python
  # Each category = new column
  # 100 categories × 1M rows = 100M values!
  ```

#### Handling High Cardinality

**Strategy 1: Group rare categories**

```python
# Problem: 1,000 unique cities, but 950 have < 10 orders

# Solution: Keep top N, group rest as "Other"
top_cities = data['city'].value_counts().nlargest(10).index

data['city_grouped'] = data['city'].apply(
    lambda x: x if x in top_cities else 'Other'
)

# Now only 11 categories: Top 10 + "Other"
data_encoded = pd.get_dummies(data, columns=['city_grouped'])
```

**Strategy 2: Frequency encoding**

```python
# Encode by how often each category appears
city_counts = data['city'].value_counts()
data['city_frequency'] = data['city'].map(city_counts)

# NYC (10,000 orders) → 10000
# Small Town (5 orders) → 5
```

### 3. Target Encoding (Mean Encoding)

**What it does:** Replaces category with the target variable's mean for that category

```python
# Example: Predict num_pizzas based on day_of_week

# Calculate mean num_pizzas for each day
target_means = data.groupby('day_of_week')['num_pizzas'].mean()

print(target_means)
# Friday      3.2  (highest!)
# Saturday    3.0
# Monday      1.8
# Tuesday     1.9
# ...

# Encode
data['day_target_encoded'] = data['day_of_week'].map(target_means)
```

**Result:**

| day_of_week | num_pizzas | day_target_encoded |
|-------------|------------|--------------------|
| Friday | 4 | 3.2 |
| Monday | 2 | 1.8 |
| Friday | 3 | 3.2 |
| Tuesday | 1 | 1.9 |

**Why it's powerful:** The encoding captures the relationship with the target variable!

#### When to Use Target Encoding

**✅ Good for:**
- **High cardinality categorical variables**
  ```python
  # 1,000 cities → just 1 column with target means
  ```
- **Strong relationship with target**
  ```python
  # City affects pizza orders significantly
  ```
- **Tree-based and linear models**

**⚠️ Warnings:**
- **Overfitting risk!** Encoding includes information from the target
- **Must use cross-validation or separate train/test**

#### Target Encoding Best Practices

```python
from category_encoders import TargetEncoder
from sklearn.model_selection import train_test_split

# Split first!
X_train, X_test, y_train, y_test = train_test_split(
    data.drop('num_pizzas', axis=1),
    data['num_pizzas'],
    test_size=0.2,
    random_state=42
)

# Fit encoder on training data only
encoder = TargetEncoder(cols=['city'])
encoder.fit(X_train, y_train)

# Transform both sets
X_train_encoded = encoder.transform(X_train)
X_test_encoded = encoder.transform(X_test)

# Test data uses training statistics (no leakage!)
```

### Encoding Method Comparison

| Method | Pros | Cons | Best For | Output Columns |
|--------|------|------|----------|----------------|
| **Label Encoding** | Simple, compact | Implies false order | Ordinal data, tree models | 1 |
| **One-Hot Encoding** | No false order, interpretable | High dimensionality | Few categories, linear models | N (N = # categories) |
| **Target Encoding** | Handles high cardinality well, captures target relationship | Overfitting risk, needs careful validation | Many categories, strong target correlation | 1 |

---

## Feature Scaling and Normalization - Leveling the Playing Field ⚖️

### Why Scale Features?

Imagine you're comparing two students:
- Student A: Math score = 95/100, Height = 170 cm
- Student B: Math score = 85/100, Height = 180 cm

If you ask "who's better overall?", your model might think:
```
A: 95 + 170 = 265 points total
B: 85 + 180 = 265 points total
```

Wait, that's nonsense! You just added test scores to height! 🤦

**The problem:** Features on different scales confuse models.

```
Our pizza data:
- Temperature: -5°C to 35°C (range: 40)
- Price: $12.99 to $98.99 (range: 86)
- Hour: 10 to 23 (range: 13)
- num_pizzas: 1 to 8 (range: 7)

Without scaling:
Model thinks "price is 12× more important than num_pizzas" (because bigger numbers!)
```

**Models affected by scale:**
- Linear Regression, Logistic Regression
- Neural Networks
- Support Vector Machines (SVM)
- K-Nearest Neighbors (KNN)
- K-Means Clustering

**Models NOT affected:**
- Decision Trees, Random Forest, XGBoost (they split on values, not magnitudes)

### 1. Min-Max Scaling (Normalization)

**Formula:** `X_scaled = (X - X_min) / (X_max - X_min)`

**Result:** All values between 0 and 1

```python
from sklearn.preprocessing import MinMaxScaler

# Example: Temperature ranges from -5°C to 35°C
temps = np.array([[-5], [5], [15], [25], [35]])

scaler = MinMaxScaler()
temps_scaled = scaler.fit_transform(temps)

print(temps_scaled)
# Output:
# [0.0]   # -5°C → 0 (minimum)
# [0.25]  # 5°C  → 0.25
# [0.5]   # 15°C → 0.5
# [0.75]  # 25°C → 0.75
# [1.0]   # 35°C → 1 (maximum)
```

#### When to Use Min-Max Scaling

**✅ Good for:**
- **Neural Networks** (most activations work best with [0, 1] or [-1, 1])
- **Image data** (pixel values 0-255 → 0-1)
- **When you know the min/max bounds** (temperature, percentages)
- **Distance-based algorithms** (KNN, K-Means)

**❌ Bad for:**
- **Data with outliers**
  ```python
  # Data: [1, 2, 3, 4, 100]
  # Scaled: [0, 0.01, 0.02, 0.03, 1.0]
  # Everything squeezed near 0 because of outlier!
  ```
- **Unbounded features** (could go beyond trained range)

### 2. Standardization (Z-Score Normalization)

**Formula:** `X_scaled = (X - mean) / std`

**Result:** Mean = 0, Standard Deviation = 1

```python
from sklearn.preprocessing import StandardScaler

temps = np.array([[-5], [5], [15], [25], [35]])

scaler = StandardScaler()
temps_scaled = scaler.fit_transform(temps)

print(temps_scaled)
# Output:
# [-1.41]  # -5°C  → 1.41 std below mean
# [-0.71]  # 5°C   → 0.71 std below mean
# [0.0]    # 15°C  → exactly at mean
# [0.71]   # 25°C  → 0.71 std above mean
# [1.41]   # 35°C  → 1.41 std above mean
```

#### When to Use Standardization

**✅ Good for:**
- **Linear models** (Linear/Logistic Regression, SVM)
- **Data with outliers** (less sensitive than min-max)
- **Features that follow normal distribution**
- **When you don't know future min/max**

**✅ Most common choice** for general ML!

### 3. Robust Scaling

**Formula:** `X_scaled = (X - median) / IQR`

Where IQR = 75th percentile - 25th percentile

**Result:** Uses median and IQR instead of mean and std (robust to outliers!)

```python
from sklearn.preprocessing import RobustScaler

# Data with outliers
prices = np.array([[10], [12], [13], [15], [14], [13], [200]])  # 200 is outlier!

scaler = RobustScaler()
prices_scaled = scaler.fit_transform(prices)

print(prices_scaled)
# Output: Outlier still larger, but not as extreme
```

#### When to Use Robust Scaling

**✅ Good for:**
- **Data with many outliers**
- **Skewed distributions**
- **When you want stability**

### Scaling Comparison Example

Let's see how different methods handle outliers:

```python
# Data with outlier: [1, 2, 3, 4, 100]

# Min-Max Scaling:
# [0.0, 0.01, 0.02, 0.03, 1.0]
# → Everything squeezed near 0! 😱

# Standardization:
# [-0.5, -0.4, -0.3, -0.2, 2.8]
# → Outlier still dominates

# Robust Scaling:
# [-0.67, -0.33, 0.0, 0.33, 32.0]
# → More balanced spread
```

### Critical Warning: Avoid Data Leakage!

**❌ WRONG:** Fit on entire dataset, then split

```python
# DON'T DO THIS!
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)  # Uses ALL data
train, test = train_test_split(data_scaled)  # Split after scaling

# Problem: Test data influenced the scaler!
# Model has seen test statistics (mean, std) during training
```

**✅ RIGHT:** Split first, fit on training data only

```python
# DO THIS!
train, test = train_test_split(data)  # Split first

scaler = StandardScaler()
train_scaled = scaler.fit_transform(train)  # Learn from train only
test_scaled = scaler.transform(test)        # Apply train statistics

# Test data is truly unseen!
```

### Scaling in Practice: Pizza Example

```python
from sklearn.preprocessing import StandardScaler

# Features that need scaling
numerical_features = ['temperature', 'hour', 'price_per_pizza', 'rolling_avg_orders_3h']

# Split data first
X_train, X_test, y_train, y_test = train_test_split(
    data.drop('num_pizzas', axis=1),
    data['num_pizzas'],
    test_size=0.2,
    random_state=42
)

# Fit scaler on training data
scaler = StandardScaler()
X_train[numerical_features] = scaler.fit_transform(X_train[numerical_features])

# Apply to test data (using training statistics!)
X_test[numerical_features] = scaler.transform(X_test[numerical_features])

print("Training data scaled using its own statistics")
print("Test data scaled using training statistics (no leakage!)")
```

---

## Feature Selection - Quality Over Quantity 🎯

You've created 50 features. Awesome! But here's the thing: **more features ≠ better model.**

**Problems with too many features:**
- **Overfitting:** Model memorizes noise instead of patterns
- **Slow training:** More features = more computation
- **Curse of dimensionality:** Data becomes sparse in high dimensions
- **Harder to interpret:** Can't explain 50 features to stakeholders

**Solution:** Select only the most useful features!

### 1. Filter Methods (Fast, Model-Agnostic)

#### Remove Low-Variance Features

If a feature has the same value everywhere, it's useless!

```python
from sklearn.feature_selection import VarianceThreshold

# Remove features with very low variance
selector = VarianceThreshold(threshold=0.1)  # Adjust threshold
X_reduced = selector.fit_transform(X_train)

# Example: If 'is_holiday' is False 99.9% of the time,
# it has almost no variance → remove it!
```

#### Remove Highly Correlated Features

If two features are 99% correlated, keep one, drop the other.

```python
# Calculate correlation matrix
correlation_matrix = X_train.corr()

# Find highly correlated pairs
high_corr = (correlation_matrix.abs() > 0.95) & (correlation_matrix != 1.0)

# Example: total_price and num_pizzas have 0.985 correlation
# They say almost the same thing!
# Keep one (more predictive), drop the other

# Drop total_price, keep num_pizzas
X_train.drop('total_price', axis=1, inplace=True)
X_test.drop('total_price', axis=1, inplace=True)
```

### 2. Wrapper Methods (Slower, Model-Specific)

#### Recursive Feature Elimination (RFE)

Train model, find least important feature, remove it, repeat!

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LinearRegression

# Create model
model = LinearRegression()

# Select top 10 features
rfe = RFE(model, n_features_to_select=10, step=1)
rfe.fit(X_train, y_train)

# Get selected features
selected_features = X_train.columns[rfe.support_]

print(f"Top 10 features: {list(selected_features)}")

# Transform data
X_train_selected = X_train[selected_features]
X_test_selected = X_test[selected_features]
```

### 3. Embedded Methods (Best of Both Worlds)

#### Feature Importance from Tree-Based Models

Random Forests and XGBoost naturally calculate feature importance!

```python
from sklearn.ensemble import RandomForestRegressor
import matplotlib.pyplot as plt

# Train Random Forest
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Get feature importances
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 10 Most Important Features:")
print(feature_importance.head(10))

# Visualization
plt.figure(figsize=(10, 6))
plt.barh(feature_importance['feature'][:10],
         feature_importance['importance'][:10])
plt.xlabel('Importance Score')
plt.title('Top 10 Features for Pizza Order Prediction')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()
```

**Example output:**

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

**Insight:** `is_friday_evening` (domain feature!) is most important. Simple beats complex!

---

## Putting It All Together - Complete Pipeline 🏗️

Let's create a full feature engineering pipeline using our Mama ML pizzeria data!

### Step 1: Load Data

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import matplotlib.pyplot as plt
import seaborn as sns

# Load cleaned data from previous articles
orders = pd.read_csv('pizza_orders_clean.csv')

print("🍕 Mama ML Pizza Restaurant - Feature Engineering Pipeline")
print("=" * 60)
print(f"Dataset shape: {orders.shape}")
print(f"Date range: {orders['date'].min()} to {orders['date'].max()}")
```

### Step 2: Create Time-Based Features

```python
# Convert date
orders['date'] = pd.to_datetime(orders['date'])

# Extract basic components
orders['hour'] = orders['date'].dt.hour
orders['day_of_week'] = orders['date'].dt.day_name()
orders['month'] = orders['date'].dt.month
orders['day_of_month'] = orders['date'].dt.day
orders['is_weekend'] = orders['day_of_week'].isin(['Saturday', 'Sunday'])

# Cyclical encoding
orders['hour_sin'] = np.sin(2 * np.pi * orders['hour'] / 24)
orders['hour_cos'] = np.cos(2 * np.pi * orders['hour'] / 24)
orders['month_sin'] = np.sin(2 * np.pi * orders['month'] / 12)
orders['month_cos'] = np.cos(2 * np.pi * orders['month'] / 12)

print("\n✅ Time-based features created")
```

### Step 3: Create Domain-Specific Features

```python
# Peak hours (from EDA insights)
orders['is_peak_hour'] = orders['hour'].isin([12, 13, 18, 19, 20])
orders['is_lunch'] = orders['hour'].between(11, 14)
orders['is_dinner'] = orders['hour'].between(17, 21)

# Special day combinations
orders['is_friday_evening'] = (
    (orders['day_of_week'] == 'Friday') &
    (orders['hour'] >= 18)
)
orders['is_weekend_night'] = orders['is_weekend'] & (orders['hour'] >= 18)

# Weather features
orders['is_cold_day'] = orders['temperature'] < 10
orders['is_hot_day'] = orders['temperature'] > 28
orders['temp_category'] = pd.cut(
    orders['temperature'],
    bins=[-np.inf, 10, 20, np.inf],
    labels=['cold', 'moderate', 'warm']
)

# Order characteristics
orders['is_large_order'] = orders['num_pizzas'] >= 5
orders['price_per_pizza'] = orders['total_price'] / orders['num_pizzas']

print("✅ Domain-specific features created")
```

### Step 4: Create Lag Features

```python
# Sort by date for time series features
orders = orders.sort_values(['date'])

# Previous hour orders
orders['prev_hour_orders'] = orders.groupby(orders['date'].dt.date)['num_pizzas'].shift(1)

# Rolling average (3-hour window)
orders['rolling_avg_3h'] = (
    orders.groupby(orders['date'].dt.date)['num_pizzas']
    .transform(lambda x: x.rolling(window=3, min_periods=1).mean())
)

# Fill NaN from shift operation
orders['prev_hour_orders'].fillna(orders['num_pizzas'].mean(), inplace=True)

print("✅ Lag features created")
```

### Step 5: Encode Categorical Variables

```python
# One-hot encode categorical features
orders_encoded = pd.get_dummies(
    orders,
    columns=['day_of_week', 'temp_category'],
    prefix=['day', 'temp'],
    drop_first=True  # Avoid multicollinearity
)

print("✅ Categorical variables encoded")
print(f"Features after encoding: {orders_encoded.shape[1]}")
```

### Step 6: Split Data (Avoid Leakage!)

```python
# Define features and target
feature_cols = [col for col in orders_encoded.columns
                if col not in ['date', 'order_id', 'num_pizzas', 'total_price']]

X = orders_encoded[feature_cols]
y = orders_encoded['num_pizzas']

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\n✅ Data split:")
print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
```

### Step 7: Scale Numerical Features

```python
# Select numerical features that need scaling
numerical_features = [
    'temperature', 'hour', 'month', 'day_of_month',
    'price_per_pizza', 'prev_hour_orders', 'rolling_avg_3h',
    'hour_sin', 'hour_cos', 'month_sin', 'month_cos'
]

# Fit scaler on training data only
scaler = StandardScaler()
X_train[numerical_features] = scaler.fit_transform(X_train[numerical_features])

# Transform test data using training statistics
X_test[numerical_features] = scaler.transform(X_test[numerical_features])

print("✅ Numerical features scaled (no data leakage!)")
```

### Step 8: Train Model and Get Feature Importance

```python
# Train Random Forest
print("\n🤖 Training Random Forest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Evaluate
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"✅ Model trained!")
print(f"Training R²: {train_score:.3f}")
print(f"Test R²: {test_score:.3f}")

# Get predictions
y_pred = model.predict(X_test)

from sklearn.metrics import mean_absolute_error, mean_squared_error
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"MAE: {mae:.2f} pizzas")
print(f"RMSE: {rmse:.2f} pizzas")
```

### Step 9: Analyze Feature Importance

```python
# Create feature importance dataframe
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n📊 Top 15 Most Important Features:")
print(feature_importance.head(15).to_string(index=False))

# Visualize
plt.figure(figsize=(12, 8))
top_15 = feature_importance.head(15)
plt.barh(range(len(top_15)), top_15['importance'])
plt.yticks(range(len(top_15)), top_15['feature'])
plt.xlabel('Importance Score')
plt.title('Top 15 Features for Pizza Order Prediction')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()
```

### Step 10: Before vs After Comparison

Let's compare with a baseline model using only raw features!

```python
# Baseline: Only raw features (no engineering)
baseline_features = ['hour', 'temperature', 'is_weekend']
X_baseline_train = orders[baseline_features].loc[X_train.index]
X_baseline_test = orders[baseline_features].loc[X_test.index]

# Scale
scaler_baseline = StandardScaler()
X_baseline_train_scaled = scaler_baseline.fit_transform(X_baseline_train)
X_baseline_test_scaled = scaler_baseline.transform(X_baseline_test)

# Train
baseline_model = RandomForestRegressor(n_estimators=100, random_state=42)
baseline_model.fit(X_baseline_train_scaled, y_train)

# Evaluate
baseline_test_score = baseline_model.score(X_baseline_test_scaled, y_test)
baseline_pred = baseline_model.predict(X_baseline_test_scaled)
baseline_mae = mean_absolute_error(y_test, baseline_pred)

print("\n📈 BEFORE vs AFTER Feature Engineering:")
print("=" * 60)
```

**Results:**

| Metric | Before FE | After FE | Improvement |
|--------|-----------|----------|-------------|
| Number of Features | 3 | 23 | +667% |
| R² Score (Test) | 0.62 | 0.87 | +40% |
| MAE | 0.85 pizzas | 0.32 pizzas | -62% |
| Feature Quality | Raw only | Domain + Time + Interactions | Much better! |

```python
print(f"{'Metric':<25} {'Before FE':<15} {'After FE':<15} {'Improvement'}")
print("-" * 70)
print(f"{'Features':<25} {3:<15} {len(X_train.columns):<15} +{(len(X_train.columns)-3)/3*100:.0f}%")
print(f"{'R² Score':<25} {baseline_test_score:<15.3f} {test_score:<15.3f} +{(test_score-baseline_test_score)/baseline_test_score*100:.0f}%")
print(f"{'MAE (pizzas)':<25} {baseline_mae:<15.2f} {mae:<15.2f} {(mae-baseline_mae)/baseline_mae*100:.0f}%")
```

**Key Insights:**

```python
print("\n💡 KEY INSIGHTS:")
print("1. is_friday_evening (domain feature) is most important")
print("2. Cyclical encoding (hour_sin/cos) beats raw hour")
print("3. Interaction features capture complex patterns")
print("4. More features ≠ always better (diminishing returns after top 15)")
print("5. Domain knowledge > complex mathematics")
```

---

## Best Practices and Workflow Checklist 📋

### The Complete Feature Engineering Workflow

```
📋 FEATURE ENGINEERING CHECKLIST

1️⃣ UNDERSTAND YOUR DATA (From EDA)
   □ Review EDA findings and insights
   □ Identify patterns and relationships
   □ Note missing values and outliers
   □ Understand business context

2️⃣ CREATE FEATURES
   □ Time-based features (hour, day, month, cyclical encoding)
   □ Domain-specific features (business logic, special cases)
   □ Interaction features (feature × feature combinations)
   □ Mathematical transformations (log, sqrt, binning)
   □ Lag features and rolling averages (time series)

3️⃣ ENCODE CATEGORICAL VARIABLES
   □ Choose encoding method (label, one-hot, target)
   □ Handle high cardinality (group rare categories)
   □ Avoid data leakage (fit on train, transform test)

4️⃣ SPLIT DATA
   □ Split BEFORE scaling/encoding (critical!)
   □ Use stratification for imbalanced data
   □ Set random_state for reproducibility

5️⃣ SCALE NUMERICAL FEATURES
   □ Choose scaling method (StandardScaler usually best)
   □ Fit scaler on training data only
   □ Transform both train and test
   □ Save scaler for production

6️⃣ SELECT FEATURES
   □ Remove low-variance features
   □ Check correlation matrix (remove redundant)
   □ Use feature importance (tree-based models)
   □ Validate with cross-validation

7️⃣ VALIDATE AND DOCUMENT
   □ Test on hold-out set
   □ Check for data leakage
   □ Document all transformations
   □ Save preprocessing pipeline
   □ Write down feature definitions
```

### Common Mistakes to Avoid

```python
print("\n⚠️ FEATURE ENGINEERING MISTAKES TO AVOID:")
print("=" * 60)

print("\n❌ Mistake 1: Using test data for feature creation")
print("WRONG: mean = entire_dataset['age'].mean()")
print("RIGHT: mean = train_data['age'].mean()")
print("→ Always split FIRST, then create features")

print("\n❌ Mistake 2: Creating too many features blindly")
print("More features ≠ better model")
print("→ Start simple, add complexity gradually")
print("→ Monitor performance with each feature added")

print("\n❌ Mistake 3: Not handling missing values in new features")
print("New features can create new NaN values!")
print("→ Check for NaN after every transformation")
print("→ fillna() or impute appropriately")

print("\n❌ Mistake 4: Ignoring multicollinearity")
print("Highly correlated features confuse linear models")
print("→ Check correlation matrix")
print("→ Remove redundant features (correlation > 0.95)")

print("\n❌ Mistake 5: Not documenting transformations")
print("'What feature did I create last week?' 🤔")
print("→ Write down every feature definition")
print("→ Keep a feature engineering log")

print("\n❌ Mistake 6: Creating features from the target variable")
print("Data leakage! Model will cheat!")
print("→ NEVER use target to create features")
print("→ Example: Don't create 'avg_target_by_city' on full dataset")

print("\n❌ Mistake 7: Forgetting to save preprocessing objects")
print("Can't use model in production without scalers/encoders!")
print("→ Save scaler, encoder, feature names")
print("→ Use joblib or pickle")
```

### Feature Engineering Pipeline (Production-Ready)

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Define feature groups
numerical_features = ['temperature', 'hour', 'price_per_pizza']
categorical_features = ['day_of_week']

# Create transformers
numerical_transformer = Pipeline(steps=[
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'))
])

# Combine transformers
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ],
    remainder='passthrough'  # Keep other features
)

# Full pipeline
from sklearn.ensemble import RandomForestRegressor

full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Train (one line!)
full_pipeline.fit(X_train, y_train)

# Predict (one line!)
predictions = full_pipeline.predict(X_test)

# Save for production
import joblib
joblib.dump(full_pipeline, 'pizza_model_pipeline.pkl')

print("✅ Full pipeline saved!")
print("   Load in production: joblib.load('pizza_model_pipeline.pkl')")
```

---

## Summary and Next Steps 🎯

### What You Learned

**1. The Power of Feature Engineering**
- Features matter more than algorithms
- Domain knowledge beats complex math
- Good features = simple models work great

**2. Feature Creation Techniques**
- Mathematical transformations (log, sqrt, binning)
- Domain-specific business logic features
- Time-based features (cyclical encoding, lags, rolling)
- Interaction features (combining multiple features)

**3. Encoding Categorical Variables**
- Label encoding (ordinal data, tree models)
- One-hot encoding (nominal data, linear models)
- Target encoding (high cardinality, careful validation)

**4. Feature Scaling**
- Min-Max scaling (0 to 1, neural nets)
- Standardization (mean=0, std=1, most common)
- Robust scaling (median/IQR, outliers)
- Always split first, then scale!

**5. Feature Selection**
- Filter methods (variance, correlation)
- Wrapper methods (RFE)
- Embedded methods (feature importance)
- Quality > quantity

**6. Production Best Practices**
- Document everything
- Avoid data leakage
- Use pipelines
- Save preprocessing objects

### The Data Journey So Far

```
Raw Data
    ↓
[Article 1: Data Cleaning] ✅
    ↓
[Article 2: EDA] ✅
    ↓
[Article 3: Feature Engineering] ✅ (You are here!)
    ↓
ML-Ready Data
    ↓
[Article 4: Train/Test Split] → Next!
    ↓
[Model Training]
    ↓
[Production]
```

### What's Next?

In **Article 4: Train, Validate, Test - Splitting Your Data Right**, we'll learn:
- Why we need separate train/validation/test sets
- How to split data properly (avoiding leakage)
- Cross-validation techniques
- Time series splitting (no peeking into the future!)
- Stratified sampling for imbalanced data

You now have beautifully engineered features. Next, we'll learn how to split them properly so our models actually generalize to new data!

### Practice Exercises

**Exercise 1: Create Your Own Features**
```python
# Using the pizza dataset, create:
# 1. A feature for "morning orders" (6 AM - 11 AM)
# 2. A feature combining temperature and is_weekend
# 3. A cyclical encoding for day_of_month (1-31)
```

**Exercise 2: Encoding Challenge**
```python
# You have a 'customer_city' column with 500 unique cities
# Only 20 cities have > 100 orders
# How would you encode this? (Hint: Strategy from Section 4)
```

**Exercise 3: Feature Selection**
```python
# You created 40 features
# Train a Random Forest and keep only features with importance > 0.01
# How many features remain?
# What's the R² score before and after selection?
```

### Further Reading

**Books:**
- "Feature Engineering for Machine Learning" by Alice Zheng & Amanda Casari
- "Hands-On Machine Learning" by Aurélien Géron (Chapter 4)

**Documentation:**
- scikit-learn preprocessing: https://scikit-learn.org/stable/modules/preprocessing.html
- pandas datetime: https://pandas.pydata.org/docs/user_guide/timeseries.html
- category_encoders: https://contrib.scikit-learn.org/category_encoders/

**Kaggle:**
- Feature Engineering tutorials
- Competition winning solutions (feature engineering is often the secret sauce!)

---

**Ready to turn your data into gold?** Start experimenting with these techniques on your own datasets!

Remember: **Start simple, iterate, and always validate**. Feature engineering is as much art as science. 🎨

Happy engineering! 💪✨
