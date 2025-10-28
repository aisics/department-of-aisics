---
title: "Understanding Your Data - Exploratory Data Analysis (EDA)"
description: "How to discover patterns, relationships, and insights in your data through visualization and statistics before building ML models"
author: "Department of AIsiCs"
date: 2025-10-28
readingTime: 30
tags: ["eda", "data-analysis", "visualization", "statistics", "pandas", "practice"]
featured: false
difficulty: "beginner"
category: "Machine Learning"
subcategory: "02-data-fundamentals"
prerequisites: ["01-data-quality", "00-python-setup-basics"]
relatedArticles: ["03-feature-engineering"]
---

> **📌 New to Python?** This article uses Python code examples. If you haven't used Python before, start with our [Python Setup for ML](/article/tutorials-en-00-python-setup-basics) guide first! It takes 35 minutes and you'll be ready to run all the code here.

# Understanding Your Data - Exploratory Data Analysis (EDA) 📊

Imagine you're a detective arriving at a crime scene. Before making any conclusions, you carefully examine every detail: fingerprints, footprints, objects, timelines. You ask questions, test theories, and look for patterns. Only after this thorough investigation do you form hypotheses.

**Exploratory Data Analysis (EDA)** is exactly that - being a detective with your data! It's the critical step between cleaning your data and building models. You explore, visualize, question, and understand what your data is telling you.

Here's a shocking truth: **Most ML project failures happen because people skipped EDA.** They jumped straight to modeling without understanding their data. It's like trying to bake a cake without tasting the ingredients - you might use salt instead of sugar and wonder why it tastes terrible!

EDA is your chance to:
- 🔍 **Discover hidden patterns** you didn't know existed
- 🚨 **Spot data quality issues** cleaning missed
- 💡 **Generate feature ideas** for better models
- 🎯 **Understand relationships** between variables
- ⚠️ **Identify potential problems** before training

Let's learn how to become data detectives! 🕵️

## What is EDA? The Art of Data Investigation 🎨

### Definition

**Exploratory Data Analysis (EDA)** is the process of analyzing and visualizing datasets to summarize their main characteristics, discover patterns, spot anomalies, test hypotheses, and check assumptions - all BEFORE applying machine learning algorithms.

### The EDA Mindset

Think of EDA as a conversation with your data:

```
You: "Hey data, what can you tell me about yourself?"
Data: "Well, I have 10,000 rows and 15 columns..."

You: "Interesting! What's the average customer age?"
Data: "About 35 years old, but there's a weird spike at 99..."

You: "99? That sounds suspicious! Show me more!"
Data: "Those are probably default values for missing ages..."

You: "Aha! What else are you hiding?"
Data: "Well, my sales spike every Friday, and..."
```

EDA is about **asking questions** and **letting data answer**!

### Why EDA Matters

**Without EDA:**
```
❌ Train model on garbage data
❌ Miss obvious patterns
❌ Use irrelevant features
❌ Get surprised by poor results
❌ Waste weeks debugging
```

**With EDA:**
```
✅ Understand data deeply
✅ Catch problems early
✅ Create better features
✅ Set realistic expectations
✅ Build better models faster
```

## The EDA Workflow 🗺️

Here's the systematic approach we'll follow:

```
1. First Look
   ├─ Load data
   ├─ Check shape and types
   └─ Preview rows

2. Univariate Analysis (One variable at a time)
   ├─ Numerical: distributions, statistics, outliers
   └─ Categorical: frequencies, unique values

3. Bivariate Analysis (Two variables)
   ├─ Numerical vs Numerical: correlations, scatter plots
   ├─ Categorical vs Categorical: crosstabs, heatmaps
   └─ Numerical vs Categorical: grouped statistics, box plots

4. Multivariate Analysis (Multiple variables)
   ├─ Correlation matrices
   ├─ Pair plots
   └─ Complex relationships

5. Pattern Discovery
   ├─ Time series trends
   ├─ Seasonal patterns
   └─ Anomalies and outliers

6. Insights and Hypotheses
   ├─ Document findings
   ├─ Generate questions
   └─ Plan next steps
```

Let's dive into each step with a real example!

---

## Our Dataset: Pizza Restaurant Orders 🍕

Remember "Mama ML" pizzeria from our lifecycle article? They want to predict order volume. Let's explore their historical order data!

### Loading the Data

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set plotting style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

# Load data
orders = pd.read_csv('pizza_orders.csv')

print("🍕 Mama ML Pizzeria - Order Data Analysis")
print("=" * 50)
```

---

## Step 1: First Look - Meeting Your Data 👋

### Check Shape and Structure

```python
# Basic information
print(f"Dataset shape: {orders.shape}")
print(f"Rows: {orders.shape[0]:,}")
print(f"Columns: {orders.shape[1]}")

# Output:
# Dataset shape: (10000, 8)
# Rows: 10,000
# Columns: 8
```

**What this tells us:** We have 10,000 orders with 8 different pieces of information about each.

### Preview the Data

```python
# First few rows
print("\nFirst 5 orders:")
print(orders.head())

# Last few rows
print("\nLast 5 orders:")
print(orders.tail())

# Random sample
print("\nRandom sample:")
print(orders.sample(5))
```

**Output:**

| index | order_id | date | day_of_week | hour | num_pizzas | total_price | is_weekend | temperature |
|-------|----------|------|-------------|------|------------|-------------|------------|-------------|
| 0 | 1001 | 2024-01-15 | Monday | 19 | 2 | 24.99 | False | 15 |
| 1 | 1002 | 2024-01-15 | Monday | 20 | 1 | 12.99 | False | 15 |
| 2 | 1003 | 2024-01-16 | Tuesday | 12 | 3 | 36.99 | False | 18 |
| 3 | 1004 | 2024-01-16 | Tuesday | 18 | 1 | 12.99 | False | 18 |
| 4 | 1005 | 2024-01-17 | Wednesday | 19 | 2 | 24.99 | False | 12 |

**Initial observations:**
- Orders have IDs, dates, time information
- Number of pizzas and prices vary
- Weather data (temperature) is included
- There's a weekend flag

### Data Types and Memory

```python
# Column information
print("\nColumn Information:")
print(orders.info())

# Data types
print("\nData Types:")
print(orders.dtypes)

# Memory usage
print(f"\nMemory usage: {orders.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```

**Output:**
```
<class 'pandas.DataFrame'>
RangeIndex: 10000 entries, 0 to 9999
Data columns (total 8 columns):
 #   Column        Non-Null Count  Dtype
---  ------        --------------  -----
 0   order_id      10000 non-null  int64
 1   date          10000 non-null  object
 2   day_of_week   10000 non-null  object
 3   hour          10000 non-null  int64
 4   num_pizzas    10000 non-null  int64
 5   total_price   10000 non-null  float64
 6   is_weekend    10000 non-null  bool
 7   temperature   9850 non-null   float64
dtypes: bool(1), float64(2), int64(3), object(2)
memory usage: 0.55 MB
```

**Key findings:**
- ✅ No missing values except temperature (150 missing)
- ⚠️ Date is stored as 'object' (string) - should convert to datetime
- ✅ Appropriate data types for most columns

### Missing Values Check

```python
# Missing values
print("\nMissing Values:")
missing = orders.isnull().sum()
missing_pct = (missing / len(orders)) * 100

missing_df = pd.DataFrame({
    'Missing Count': missing,
    'Percentage': missing_pct
})
print(missing_df[missing_df['Missing Count'] > 0])
```

**Output:**

| column | Missing Count | Percentage |
|--------|---------------|------------|
| temperature | 150 | 1.5% |

**Action:** 1.5% missing is acceptable. We'll handle this later.

---

## Step 2: Univariate Analysis - One Variable at a Time 🔍

### Numerical Variables

Let's analyze each numerical column individually.

#### Basic Statistics

```python
# Summary statistics
print("\n📊 Numerical Variables Summary:")
print(orders.describe())
```

**Output:**

| statistic | order_id | hour | num_pizzas | total_price | temperature |
|-----------|----------|------|------------|-------------|-------------|
| count | 10000.00 | 10000.00 | 10000.00 | 10000.00 | 9850.00 |
| mean | 5500.50 | 15.34 | 2.15 | 26.44 | 16.85 |
| std | 2886.90 | 4.12 | 0.99 | 12.35 | 8.23 |
| min | 1001.00 | 10.00 | 1.00 | 12.99 | -5.00 |
| 25% | 3250.75 | 12.00 | 1.00 | 12.99 | 10.00 |
| 50% | 5500.50 | 15.00 | 2.00 | 24.99 | 17.00 |
| 75% | 7750.25 | 19.00 | 3.00 | 36.99 | 23.00 |
| max | 11000.00 | 23.00 | 8.00 | 98.99 | 35.00 |

**Key insights:**

🕐 **Hour:**
- Orders come in between 10 AM and 11 PM
- Median is 3 PM (15:00)
- Peak hours likely around evening

🍕 **Number of Pizzas:**
- Average: 2.15 pizzas per order
- Range: 1 to 8 pizzas
- Most orders are 1-3 pizzas (25th to 75th percentile)

💰 **Total Price:**
- Average: $26.44
- Min: $12.99 (probably 1 pizza)
- Max: $98.99 (party order!)
- Large variation (std = $12.35)

🌡️ **Temperature:**
- Average: 17°C (about 63°F)
- Range: -5°C to 35°C
- Covers winter to summer

#### Distributions - Histograms

```python
# Plot distributions
fig, axes = plt.subplots(2, 2, figsize=(15, 10))

# Hour distribution
orders['hour'].hist(bins=14, ax=axes[0,0], edgecolor='black')
axes[0,0].set_title('Orders by Hour of Day', fontsize=14, fontweight='bold')
axes[0,0].set_xlabel('Hour')
axes[0,0].set_ylabel('Number of Orders')
axes[0,0].axvline(orders['hour'].median(), color='red', linestyle='--', label='Median')
axes[0,0].legend()

# Number of pizzas distribution
orders['num_pizzas'].hist(bins=8, ax=axes[0,1], edgecolor='black', color='orange')
axes[0,1].set_title('Pizzas per Order', fontsize=14, fontweight='bold')
axes[0,1].set_xlabel('Number of Pizzas')
axes[0,1].set_ylabel('Number of Orders')

# Price distribution
orders['total_price'].hist(bins=30, ax=axes[1,0], edgecolor='black', color='green')
axes[1,0].set_title('Order Price Distribution', fontsize=14, fontweight='bold')
axes[1,0].set_xlabel('Total Price ($)')
axes[1,0].set_ylabel('Number of Orders')

# Temperature distribution
orders['temperature'].hist(bins=20, ax=axes[1,1], edgecolor='black', color='skyblue')
axes[1,1].set_title('Temperature Distribution', fontsize=14, fontweight='bold')
axes[1,1].set_xlabel('Temperature (°C)')
axes[1,1].set_ylabel('Frequency')

plt.tight_layout()
plt.show()
```

**Findings from distributions:**

📊 **Hour Distribution:**
- Bimodal distribution (two peaks!)
- Peak 1: Around lunch (12-2 PM)
- Peak 2: Around dinner (6-8 PM)
- Very few orders late night or early morning
- **Insight:** Staff scheduling should focus on lunch and dinner rushes

📊 **Number of Pizzas:**
- Right-skewed distribution
- Most common: 2 pizzas per order
- Decreases rapidly for larger orders
- **Insight:** Optimize delivery for 1-3 pizza orders

📊 **Price Distribution:**
- Multiple peaks at $12.99, $24.99, $36.99
- Suggests menu pricing strategy (1 pizza, 2 pizzas, 3 pizzas)
- Few orders above $50
- **Insight:** Standard pricing tiers work well

📊 **Temperature:**
- Roughly normal distribution (bell curve)
- Centered around 17°C
- Full range from cold (-5°C) to hot (35°C)
- **Insight:** Temperature likely affects order volume

#### Box Plots - Finding Outliers

```python
# Box plots for outlier detection
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Number of pizzas
orders.boxplot(column='num_pizzas', ax=axes[0])
axes[0].set_title('Pizzas per Order - Outlier Detection')
axes[0].set_ylabel('Number of Pizzas')

# Price
orders.boxplot(column='total_price', ax=axes[1])
axes[1].set_title('Price - Outlier Detection')
axes[1].set_ylabel('Total Price ($)')

# Temperature
orders.boxplot(column='temperature', ax=axes[2])
axes[2].set_title('Temperature - Outlier Detection')
axes[2].set_ylabel('Temperature (°C)')

plt.tight_layout()
plt.show()
```

**Box plot interpretation:**

```
Box Plot Components:
┌─────────┐
│  Box:   │  50% of data (25th to 75th percentile)
│─────────│  ← Median line
│  Box:   │
└─────────┘
    │
  Whisker (extends to 1.5 × IQR)
    ●  ← Outliers (points beyond whiskers)
```

**Outliers detected:**
- 🍕 **Pizzas:** A few orders with 6-8 pizzas (parties/events)
- 💰 **Price:** Several orders above $60 (bulk orders)
- 🌡️ **Temperature:** No outliers (all values reasonable)

**Decision:** Keep the outliers - they're legitimate large orders, not errors!

---

### Categorical Variables

#### Day of Week

```python
# Value counts
print("\n📅 Orders by Day of Week:")
day_counts = orders['day_of_week'].value_counts()
print(day_counts)

# Percentage
print("\nPercentage:")
print((day_counts / len(orders) * 100).round(2))

# Visualization
plt.figure(figsize=(10, 6))
day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
day_counts = orders['day_of_week'].value_counts().reindex(day_order)
day_counts.plot(kind='bar', color='steelblue', edgecolor='black')
plt.title('Orders by Day of Week', fontsize=16, fontweight='bold')
plt.xlabel('Day')
plt.ylabel('Number of Orders')
plt.xticks(rotation=45)
plt.axhline(day_counts.mean(), color='red', linestyle='--', label=f'Average: {day_counts.mean():.0f}')
plt.legend()
plt.tight_layout()
plt.show()
```

**Output:**
```
Friday       1850  (18.50%)
Saturday     1720  (17.20%)
Sunday       1520  (15.20%)
Thursday     1450  (14.50%)
Wednesday    1280  (12.80%)
Tuesday      1090  (10.90%)
Monday       1090  (10.90%)
```

**Major findings:**
- 🎉 **Friday is pizza day!** Highest orders (18.5%)
- 📈 **Weekend surge:** Friday-Sunday account for 51% of all orders
- 📉 **Monday/Tuesday slump:** Lowest days (~11% each)
- **Insight:** Weekend staffing is critical; Monday/Tuesday could use promotions

#### Weekend vs Weekday

```python
# Weekend analysis
print("\n🗓️ Weekend vs Weekday:")
weekend_split = orders['is_weekend'].value_counts()
print(weekend_split)

# Pie chart
plt.figure(figsize=(8, 8))
plt.pie(weekend_split, labels=['Weekday', 'Weekend'], autopct='%1.1f%%',
        colors=['lightcoral', 'lightgreen'], startangle=90)
plt.title('Order Distribution: Weekend vs Weekday', fontsize=16, fontweight='bold')
plt.show()
```

**Finding:**
- Weekend: 42% of orders
- Weekday: 58% of orders
- **But** weekend days have higher average (1,697 vs 1,140 orders/day)

---

## Step 3: Bivariate Analysis - Relationships Between Variables 🔗

Now let's see how variables relate to each other!

### Numerical vs Numerical

#### Correlation Analysis

```python
# Correlation matrix
print("\n🔗 Correlation Matrix:")
numerical_cols = ['hour', 'num_pizzas', 'total_price', 'temperature']
correlations = orders[numerical_cols].corr()
print(correlations.round(3))

# Heatmap visualization
plt.figure(figsize=(10, 8))
sns.heatmap(correlations, annot=True, cmap='coolwarm', center=0,
            square=True, linewidths=1, fmt='.3f')
plt.title('Correlation Heatmap', fontsize=16, fontweight='bold')
plt.show()
```

**Output:**

| variable | hour | num_pizzas | total_price | temperature |
|----------|------|------------|-------------|-------------|
| hour | 1.000 | -0.050 | -0.043 | 0.080 |
| num_pizzas | -0.050 | 1.000 | 0.985 | -0.120 |
| total_price | -0.043 | 0.985 | 1.000 | -0.115 |
| temperature | 0.080 | -0.120 | -0.115 | 1.000 |

**Key correlations:**

🔥 **Strong Positive (0.985): num_pizzas ↔ total_price**
- Makes perfect sense! More pizzas = higher price
- Nearly perfect correlation

❄️ **Weak Negative (-0.120): temperature ↔ num_pizzas**
- Colder weather = slightly more pizzas per order
- People order more when cold
- **Insight:** Winter promotions might work well!

🤷 **Weak/No Correlation: hour ↔ everything else**
- Time of day doesn't strongly affect order size or price
- **Insight:** Promotions can work at any hour

#### Scatter Plots

```python
# Price vs Number of Pizzas
plt.figure(figsize=(12, 6))

plt.subplot(1, 2, 1)
plt.scatter(orders['num_pizzas'], orders['total_price'], alpha=0.5)
plt.xlabel('Number of Pizzas')
plt.ylabel('Total Price ($)')
plt.title('Price vs Number of Pizzas')
plt.grid(True, alpha=0.3)

# Add trendline
z = np.polyfit(orders['num_pizzas'], orders['total_price'], 1)
p = np.poly1d(z)
plt.plot(orders['num_pizzas'], p(orders['num_pizzas']),
         "r--", linewidth=2, label=f'Trend: ${z[0]:.2f} per pizza')
plt.legend()

plt.subplot(1, 2, 2)
plt.scatter(orders['temperature'], orders['num_pizzas'], alpha=0.5, color='orange')
plt.xlabel('Temperature (°C)')
plt.ylabel('Number of Pizzas')
plt.title('Pizzas Ordered vs Temperature')
plt.grid(True, alpha=0.3)

# Add trendline
z = np.polyfit(orders['temperature'].dropna(),
               orders.loc[orders['temperature'].notna(), 'num_pizzas'], 1)
p = np.poly1d(z)
temp_range = np.linspace(orders['temperature'].min(), orders['temperature'].max(), 100)
plt.plot(temp_range, p(temp_range), "r--", linewidth=2, label='Trend')
plt.legend()

plt.tight_layout()
plt.show()
```

**Findings:**
- 📊 Clear linear relationship: each pizza adds ~$12 to price
- 🌡️ Slight downward trend: warmer weather = fewer pizzas per order
- **Insight:** Temperature is a useful feature for prediction!

---

### Categorical vs Numerical

#### Orders by Day and Time

```python
# Average statistics by day
print("\n📊 Statistics by Day of Week:")
day_stats = orders.groupby('day_of_week').agg({
    'num_pizzas': ['mean', 'median', 'sum'],
    'total_price': ['mean', 'median', 'sum']
}).round(2)

print(day_stats)

# Box plot: Pizzas by day of week
plt.figure(figsize=(12, 6))
day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
sns.boxplot(data=orders, x='day_of_week', y='num_pizzas', order=day_order)
plt.title('Number of Pizzas by Day of Week', fontsize=16, fontweight='bold')
plt.xlabel('Day')
plt.ylabel('Pizzas per Order')
plt.xticks(rotation=45)
plt.show()
```

**Insights:**
- Weekend orders are slightly larger (2.3 pizzas) vs weekday (2.1 pizzas)
- Friday has highest total revenue
- Order size distribution is consistent across days

#### Temperature Impact by Season

```python
# Create season categories
def get_season(temp):
    if temp < 10:
        return 'Winter'
    elif temp < 20:
        return 'Spring/Fall'
    else:
        return 'Summer'

orders['season'] = orders['temperature'].apply(get_season)

# Average orders by season
print("\n🌡️ Orders by Season:")
season_stats = orders.groupby('season').agg({
    'num_pizzas': 'mean',
    'total_price': 'mean',
    'order_id': 'count'
}).round(2)
season_stats.columns = ['Avg Pizzas', 'Avg Price', 'Order Count']
print(season_stats)

# Visualization
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
season_order = ['Winter', 'Spring/Fall', 'Summer']
season_stats['Avg Pizzas'].reindex(season_order).plot(kind='bar', color=['skyblue', 'lightgreen', 'orange'])
plt.title('Average Pizzas per Order by Season')
plt.ylabel('Average Pizzas')
plt.xticks(rotation=0)

plt.subplot(1, 2, 2)
season_stats['Order Count'].reindex(season_order).plot(kind='bar', color=['skyblue', 'lightgreen', 'orange'])
plt.title('Total Orders by Season')
plt.ylabel('Number of Orders')
plt.xticks(rotation=0)

plt.tight_layout()
plt.show()
```

**Findings:**
- ❄️ **Winter (< 10°C):** Highest pizzas per order (2.4), fewer total orders
- 🌸 **Spring/Fall (10-20°C):** Balanced - most orders, average size
- ☀️ **Summer (> 20°C):** Smallest orders (1.9 pizzas), moderate total orders

**Insight:** Cold weather drives larger orders but fewer customers. Warm weather brings more customers but smaller orders. Plan inventory accordingly!

---

## Step 4: Time-Based Patterns ⏰

### Hourly Patterns

```python
# Orders by hour
hourly_orders = orders.groupby('hour').size()

plt.figure(figsize=(14, 6))
hourly_orders.plot(kind='line', marker='o', linewidth=2, markersize=8)
plt.title('Order Volume by Hour of Day', fontsize=16, fontweight='bold')
plt.xlabel('Hour')
plt.ylabel('Number of Orders')
plt.grid(True, alpha=0.3)
plt.xticks(range(10, 24))

# Highlight peak hours
peak_hour = hourly_orders.idxmax()
plt.axvline(peak_hour, color='red', linestyle='--', alpha=0.7, label=f'Peak Hour: {peak_hour}:00')
plt.axhspan(hourly_orders.mean() - 50, hourly_orders.mean() + 50,
            alpha=0.2, color='green', label='Normal Range')
plt.legend()
plt.show()

print(f"\n⏰ Peak Hour: {peak_hour}:00 ({hourly_orders[peak_hour]} orders)")
print(f"Slowest Hour: {hourly_orders.idxmin()}:00 ({hourly_orders.min()} orders)")
```

**Finding:**
- 🍽️ **Lunch rush:** 12-2 PM (700+ orders/hour)
- 🍕 **Dinner peak:** 6-8 PM (900+ orders/hour) ← BUSIEST!
- 🌙 **Late night:** After 10 PM (< 200 orders/hour)
- **Insight:** Staff heavily during 6-8 PM, consider closing earlier

### Day Patterns - Heatmap

```python
# Create hour-day heatmap
hourly_day = orders.groupby(['day_of_week', 'hour']).size().unstack()

plt.figure(figsize=(16, 8))
sns.heatmap(hourly_day, cmap='YlOrRd', annot=True, fmt='d',
            cbar_kws={'label': 'Number of Orders'})
plt.title('Order Heatmap: Day vs Hour', fontsize=16, fontweight='bold')
plt.xlabel('Hour of Day')
plt.ylabel('Day of Week')
plt.tight_layout()
plt.show()
```

**Pattern discovered:**
- 🔥 **Hotspot:** Friday 7-8 PM (peak of peaks!)
- ❄️ **Cold zone:** Monday-Tuesday 10-11 AM
- 📈 **Consistent:** Dinner rush (6-8 PM) strong every day
- **Actionable:** Friday evening needs extra staff and inventory

---

## Step 5: Insights and Hypotheses 💡

### Key Discoveries Summary

```python
print("\n" + "="*60)
print("🎯 KEY INSIGHTS FROM EDA")
print("="*60)

print("\n1️⃣ TIMING PATTERNS:")
print("   • Peak hour: 7 PM (evening dinner)")
print("   • Peak day: Friday")
print("   • Hottest slot: Friday 7-8 PM")
print("   • Slowest: Monday/Tuesday mornings")

print("\n2️⃣ ORDER CHARACTERISTICS:")
print(f"   • Average order: {orders['num_pizzas'].mean():.2f} pizzas, ${orders['total_price'].mean():.2f}")
print(f"   • Most common: {orders['num_pizzas'].mode()[0]} pizzas")
print(f"   • Price per pizza: ~$12.50")
print(f"   • Large orders (5+ pizzas): {(orders['num_pizzas'] >= 5).sum()} ({(orders['num_pizzas'] >= 5).sum()/len(orders)*100:.1f}%)")

print("\n3️⃣ WEATHER IMPACT:")
print(f"   • Cold days (< 10°C): {orders[orders['temperature'] < 10]['num_pizzas'].mean():.2f} pizzas/order")
print(f"   • Warm days (> 20°C): {orders[orders['temperature'] > 20]['num_pizzas'].mean():.2f} pizzas/order")
print("   • Conclusion: Cold weather → larger orders")

print("\n4️⃣ WEEKEND EFFECT:")
weekend_avg = orders[orders['is_weekend']]['num_pizzas'].mean()
weekday_avg = orders[~orders['is_weekend']]['num_pizzas'].mean()
print(f"   • Weekend orders: {weekend_avg:.2f} pizzas/order")
print(f"   • Weekday orders: {weekday_avg:.2f} pizzas/order")
print(f"   • Difference: {((weekend_avg - weekday_avg) / weekday_avg * 100):.1f}% larger on weekends")

print("\n5️⃣ DATA QUALITY:")
print(f"   • Missing values: {orders.isnull().sum().sum()} ({orders.isnull().sum().sum()/orders.size*100:.2f}%)")
print(f"   • Outliers: {(orders['num_pizzas'] > 5).sum()} large orders (kept - legitimate)")
print("   • Data types: ✅ All appropriate")
print("   • Date range: {orders['date'].min()} to {orders['date'].max()}")
```

### Hypotheses for Modeling

```python
print("\n" + "="*60)
print("🧠 HYPOTHESES FOR ML MODEL")
print("="*60)

print("\n📊 IMPORTANT FEATURES (likely predictive):")
print("   1. day_of_week - Strong signal (Friday highest)")
print("   2. hour - Clear peaks at lunch/dinner")
print("   3. is_weekend - Affects order patterns")
print("   4. temperature - Inverse relationship with order size")
print("   5. [NEW] hour_x_day interaction - Friday evening is special")

print("\n🗑️ LESS IMPORTANT FEATURES:")
print("   • order_id - Just an identifier")
print("   • date - Captured by day_of_week already")

print("\n🆕 FEATURE ENGINEERING IDEAS:")
print("   • is_peak_hour - Binary: 1 if hour in [12-14, 18-20]")
print("   • is_friday_evening - Binary: Friday AND peak hour")
print("   • temp_category - Categorical: Cold/Moderate/Warm")
print("   • rolling_avg_3h - Moving average of orders")
print("   • day_hour_interaction - Combined feature")

print("\n⚠️ POTENTIAL ISSUES:")
print("   • Missing temperature values (1.5%) - impute with daily average")
print("   • High correlation price-pizzas (0.985) - might cause multicollinearity")
print("   • Need to check for seasonality (year-long trends)")
print("   • Consider external factors: holidays, weather events, sports games")
```

---

## EDA Best Practices ✅

### The EDA Checklist

```python
def eda_checklist():
    checklist = """
    📋 COMPREHENSIVE EDA CHECKLIST

    ✅ 1. FIRST LOOK
       □ Load data successfully
       □ Check shape (rows × columns)
       □ Preview first/last/random rows
       □ Check data types
       □ Check memory usage

    ✅ 2. DATA QUALITY
       □ Count missing values
       □ Identify duplicates
       □ Check for placeholder values (999, -1, "Unknown")
       □ Validate data ranges
       □ Check for data entry errors

    ✅ 3. UNIVARIATE ANALYSIS
       □ Summary statistics (mean, median, std, min, max)
       □ Distributions (histograms)
       □ Outlier detection (box plots)
       □ Categorical value counts
       □ Unique value counts

    ✅ 4. BIVARIATE ANALYSIS
       □ Correlation matrix
       □ Scatter plots (numerical vs numerical)
       □ Box plots (categorical vs numerical)
       □ Crosstabs (categorical vs categorical)

    ✅ 5. MULTIVARIATE ANALYSIS
       □ Pair plots
       □ Correlation heatmaps
       □ Multiple variables on same plot

    ✅ 6. PATTERNS & TRENDS
       □ Time series analysis
       □ Seasonal patterns
       □ Cyclical patterns
       □ Anomaly detection

    ✅ 7. DOMAIN-SPECIFIC
       □ Apply business logic
       □ Validate against known facts
       □ Check for data leakage
       □ Consider external factors

    ✅ 8. DOCUMENTATION
       □ Document key findings
       □ List hypotheses
       □ Note data quality issues
       □ Plan feature engineering
       □ Save visualizations
    """
    return checklist

print(eda_checklist())
```

### Common EDA Mistakes to Avoid

```python
print("\n⚠️ COMMON EDA MISTAKES:")
print("\n❌ 1. Skipping EDA entirely")
print("   'I'll just train the model and see...'")
print("   → Result: Garbage model, wasted time")

print("\n❌ 2. Only looking at summary statistics")
print("   .describe() is not enough!")
print("   → Always visualize - Anscombe's Quartet proves this")

print("\n❌ 3. Ignoring outliers without investigation")
print("   Not all outliers are errors!")
print("   → Investigate before deleting")

print("\n❌ 4. Forgetting domain knowledge")
print("   Pure statistics can mislead")
print("   → Ask: 'Does this make business sense?'")

print("\n❌ 5. Not documenting findings")
print("   You'll forget what you discovered")
print("   → Write it down immediately")

print("\n❌ 6. Looking for patterns that aren't there")
print("   Correlation ≠ Causation")
print("   → Be skeptical of spurious correlations")

print("\n❌ 7. Not checking data leakage")
print("   Including future data in training")
print("   → Validate time-based splits carefully")
```

---

## EDA Tools and Libraries 🛠️

### Essential Python Stack

```python
# Data manipulation
import pandas as pd
import numpy as np

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px  # Interactive plots

# Statistical analysis
from scipy import stats
from statsmodels.tsa.seasonal import seasonal_decompose

# Automated EDA
import pandas_profiling
import sweetviz
import autoviz

# Quick automated report
profile = pandas_profiling.ProfileReport(orders, title='Pizza Orders EDA')
profile.to_file("eda_report.html")
```

### Quick EDA Functions

```python
def quick_eda(df):
    """
    Perform quick EDA on any dataframe
    """
    print("="*60)
    print("QUICK EDA SUMMARY")
    print("="*60)

    # Shape
    print(f"\n📏 Shape: {df.shape[0]:,} rows × {df.shape[1]} columns")

    # Missing values
    missing = df.isnull().sum()
    if missing.sum() > 0:
        print(f"\n⚠️ Missing Values:")
        print(missing[missing > 0])
    else:
        print("\n✅ No missing values")

    # Duplicates
    dups = df.duplicated().sum()
    print(f"\n🔄 Duplicates: {dups}")

    # Data types
    print(f"\n🔤 Data Types:")
    print(df.dtypes.value_counts())

    # Numerical summary
    print(f"\n📊 Numerical Summary:")
    print(df.describe())

    # Categorical summary
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    if len(cat_cols) > 0:
        print(f"\n📝 Categorical Variables:")
        for col in cat_cols:
            print(f"\n{col}: {df[col].nunique()} unique values")
            print(df[col].value_counts().head())

# Use it
quick_eda(orders)
```

---

## Summary: Your EDA Journey 🗺️

### What We Learned

1. **EDA is detective work** - Ask questions, explore, discover
2. **Always start with EDA** - Never skip to modeling
3. **Visualize everything** - Numbers lie, plots reveal
4. **Look for patterns** - Time trends, correlations, outliers
5. **Document findings** - Future you will be grateful
6. **Generate hypotheses** - EDA informs feature engineering

### The EDA-to-Modeling Pipeline

```
Raw Data
    ↓
[ Data Cleaning ]  ← Article 1
    ↓
[ EDA ]  ← You are here (Article 2)
    ↓
Insights + Hypotheses
    ↓
[ Feature Engineering ]  ← Article 3
    ↓
[ Model Training ]
    ↓
[ Evaluation ]
    ↓
Production Model
```

### Key Takeaways

```python
print("\n🎯 KEY TAKEAWAYS:")
print("1. EDA reveals what your data can (and can't) tell you")
print("2. Visualization is more powerful than statistics alone")
print("3. Domain knowledge + data exploration = powerful insights")
print("4. Every dataset tells a story - your job is to listen")
print("5. Good EDA leads to better features, better models, better results")
```

---

## What's Next? 🚀

Now that you deeply understand your data, you're ready for **Feature Engineering** - the art of transforming raw data into powerful features that make your ML models shine!

In the next article, we'll take the insights from this EDA and create features like:
- `is_peak_hour` (binary flag for lunch/dinner rushes)
- `friday_evening_boost` (interaction feature)
- `temp_category` (cold/moderate/warm buckets)
- Rolling averages and time-based features

Remember: **Good EDA → Great features → Excellent models** ✨

Happy exploring! 📊🔍
