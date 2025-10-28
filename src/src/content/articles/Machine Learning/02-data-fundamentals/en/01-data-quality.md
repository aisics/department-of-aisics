---
title: "Data Quality - The Foundation of Good ML"
description: "Why 80% of machine learning work is data cleaning, and how to do it right with practical techniques and real examples"
author: "Department of AIsiCs"
date: 2025-10-28
readingTime: 25
tags: ["data-quality", "data-cleaning", "data-preparation", "machine-learning", "practice"]
featured: false
difficulty: "beginner"
category: "Machine Learning"
subcategory: "02-data-fundamentals"
prerequisites: ["02-ml-lifecycle", "00-python-setup-basics"]
relatedArticles: ["02-exploratory-data-analysis"]
---

> **📌 New to Python?** This article uses Python code examples. If you haven't used Python before, start with our [Python Setup for ML](/article/tutorials-en-00-python-setup-basics) guide first! It takes 35 minutes and you'll be ready to run all the code here.

# Data Quality - The Foundation of Good ML 🧹

There's a saying in machine learning: **"Garbage in, garbage out."**

Feed your model messy data with typos, missing values, and weird outliers - and you'll get predictions that are just as messy. It's like trying to bake a cake with spoiled ingredients. No matter how expensive your oven (algorithm) is, the cake will taste terrible.

Here's the uncomfortable truth: **data scientists spend 80% of their time cleaning and preparing data**, not building fancy models. Yes, you read that right. Most of ML work isn't about neural networks or gradient boosting - it's about fixing typos, filling missing values, and making sense of chaos.

But here's the good news: **clean data with a simple model beats dirty data with a complex model every time.** Master data quality, and you're already halfway to ML success!

## The Harsh Reality: Your Data is Messy 🤯

### Story: The Dating App Disaster

Imagine a dating app trying to build a recommendation system. They collected data from user profiles:

```
User #1:
Age: 25
Height: 170 cm
Location: New York
Interests: "hiking, reading, coffee"

User #2:
Age: 999
Height: -5 cm
Location: "ur mom's house lol"
Interests: [empty]

User #3:
Age: 18
Height: 6'2"
Location: NYC
Interests: "hiking coffee COFFEE hiking reading hiking"

User #4:
Age: 0
Height: null
Location: "New York City, NY, USA, Earth"
Interests: "😎🏖️💪🎮"
```

**What went wrong?**

- User #2: Obviously fake data (joker or bot)
- User #3: Different units (feet vs cm), duplicate interests
- User #4: Invalid age, missing height, over-detailed location, emoji instead of text

And this is **after** users filled out forms! Imagine if you're scraping data from the wild internet. 😱

### The 80/20 Rule of Machine Learning

In every ML project, time is typically split like this:

```
📊 Project Time Breakdown:

80% Data Work:
├─ 30% Finding and collecting data
├─ 25% Cleaning and fixing problems
├─ 15% Feature engineering
└─ 10% Understanding what you have

20% Everything Else:
├─ 10% Training models
├─ 5% Tuning hyperparameters
└─ 5% Deployment and monitoring
```

Most beginners think ML is about algorithms. **Wrong!** ML is about data. Algorithms are the easy part - sklearn does that in 3 lines of code. The hard part is making your data usable.

## Types of Data Quality Issues 🚨

Let's explore the most common problems you'll face (spoiler: you'll face ALL of them).

### 1. Missing Values - The Silent Killer 🕳️

**Definition:** Data that should be there... but isn't.

#### Real Example: E-commerce Customer Data

| customer_id | age | income | previous_purchases | churn |
|-------------|-----|--------|-------------------|-------|
| 1001 | 32 | 75000 | 5 | No |
| 1002 | NaN | 120000 | 12 | No |
| 1003 | 45 | NaN | 3 | Yes |
| 1004 | 28 | 65000 | NaN | No |
| 1005 | NaN | NaN | 0 | Yes |

**Why does this happen?**

- Users skip optional form fields
- Data collection system crashed
- Privacy restrictions (users don't want to share income)
- New feature added recently (old records don't have it)
- Integration failed between systems

**The problem for ML:**

Most algorithms **can't handle NaN/null** values. They'll crash with errors like:
```
ValueError: Input contains NaN, infinity or a value too large
```

You must decide: delete these rows? Fill with something? Use a special algorithm that handles missing data?

#### Handling Strategies

**Strategy 1: Delete the Row (Listwise Deletion)**

```python
# Drop rows with ANY missing value
clean_data = data.dropna()

✅ Pros: Simple, clean dataset
❌ Cons: Might lose 50%+ of your data!
```

**When to use:** If missing data is rare (<5%) and random

**Strategy 2: Delete the Column**

```python
# Drop column if >30% values are missing
clean_data = data.drop('income', axis=1)

✅ Pros: Keep all rows
❌ Cons: Lose potentially valuable feature
```

**When to use:** When one column has mostly missing data

**Strategy 3: Fill with Statistics**

```python
# Fill with mean (for numerical data)
data['age'].fillna(data['age'].mean(), inplace=True)

# Fill with median (better for outliers)
data['income'].fillna(data['income'].median(), inplace=True)

# Fill with mode (for categorical data)
data['city'].fillna(data['city'].mode()[0], inplace=True)

✅ Pros: Keep all data
❌ Cons: Might hide patterns ("why is this missing?")
```

**When to use:** For numerical features with <20% missing

**Strategy 4: Create "Missing" Category**

```python
# For categorical data, make "missing" a valid category
data['city'].fillna('Unknown', inplace=True)

✅ Pros: Preserves the "missingness" signal
❌ Cons: Creates artificial category
```

**When to use:** When missingness itself is meaningful

**Strategy 5: Predictive Imputation**

```python
# Use other features to predict missing values
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=5)
data_imputed = imputer.fit_transform(data)

✅ Pros: Smart, uses patterns in data
❌ Cons: Computationally expensive, can be overconfident
```

**When to use:** When you have time and missingness is correlated with other features

---

### 2. Duplicates - The Copy-Paste Monster 📋

**Definition:** Same data appearing multiple times (intentionally or not).

#### Real Example: User Registration Database

| email | name | signup_date | notes |
|-------|------|-------------|-------|
| john@email.com | John Smith | 2024-01-15 | |
| john@email.com | John Smith | 2024-01-15 | Exact duplicate |
| john@email.com | Johnny Smith | 2024-02-20 | Same person, different name? |
| JOHN@EMAIL.COM | John Smith | 2024-01-15 | Case difference |
| john@email.com | John Smth | 2024-01-15 | Typo in name |

**Why does this happen?**

- User clicked "Submit" multiple times (impatient!)
- System bug during data import
- Merging data from multiple sources
- No unique constraint in database
- Bot attacks

**The problem for ML:**

- **Overrepresents** certain data points
- **Biases** model toward duplicated examples
- **Inflates** dataset size artificially
- **Messes up** train/test split (same data in both!)

#### Handling Strategies

**Strategy 1: Exact Duplicates**

```python
# Remove exact duplicates
data_clean = data.drop_duplicates()

# Or just in specific columns
data_clean = data.drop_duplicates(subset=['email'])

✅ Simple and safe
```

**Strategy 2: Fuzzy Duplicates (Approximate Matching)**

```python
# For text similarity
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio() > 0.9

# Find similar names
for i in range(len(data)):
    for j in range(i+1, len(data)):
        if similar(data['name'][i], data['name'][j]):
            print(f"Possible duplicate: {data['name'][i]} ≈ {data['name'][j]}")

⚠️ Requires manual review
```

**When to use:** Text data with typos, different formats

**Best Practice:**

```python
# Before removing duplicates
print(f"Original size: {len(data)}")
print(f"Unique emails: {data['email'].nunique()}")

# Remove
data_clean = data.drop_duplicates(subset=['email'], keep='first')

print(f"After deduplication: {len(data_clean)}")
print(f"Removed: {len(data) - len(data_clean)} duplicates ({100*(len(data)-len(data_clean))/len(data):.1f}%)")
```

Always **log what you removed** for auditability!

---

### 3. Inconsistent Formatting - The Chaos King 👑

**Definition:** Same information stored in different ways.

#### Real Example: Product Categories

```python
product          | category
Laptop Pro 15"   | Electronics
iPhone 14        | electronics  # lowercase
Samsung TV       | ELECTRONICS  # uppercase
iPad Air         | Electronics > Tablets  # hierarchy
AirPods Pro      | Consumer Electronics  # verbose
MacBook          | Tech / Electronics  # alternative separator
Smart Watch      | Wearables, Electronics  # multiple categories
```

**Seven different ways to say "Electronics"!** 🤦‍♂️

#### More Examples

**Dates:**

```python
2024-01-15      # ISO format
01/15/2024      # US format
15/01/2024      # European format
15-Jan-2024     # Text month
Jan 15, 2024    # Full text
1705276800      # Unix timestamp
```

**Phone Numbers:**

```python
+1 (202) 555-1234
+12025551234
202-555-1234
2025551234
(202) 555-1234
```

**Addresses:**

```python
123 Main St, New York, NY 10001
123 Main Street, New York City, New York, 10001
123 main st, nyc, ny, 10001
```

**The problem for ML:**

The model sees these as **completely different** values, even though they mean the same thing!

#### Handling Strategies

**Strategy 1: Standardization**

```python
# Convert to lowercase
data['category'] = data['category'].str.lower()

# Remove extra spaces
data['category'] = data['category'].str.strip()

# Replace synonyms
category_map = {
    'electronics': 'electronics',
    'tech': 'electronics',
    'consumer electronics': 'electronics',
    'electronic': 'electronics'
}
data['category'] = data['category'].map(category_map).fillna(data['category'])

✅ Creates consistent format
```

**Strategy 2: Parsing and Reformatting**

```python
import pandas as pd

# Dates: convert everything to datetime
data['date'] = pd.to_datetime(data['date'], infer_datetime_format=True)

# Then format consistently
data['date_str'] = data['date'].dt.strftime('%Y-%m-%d')

# Phone numbers: remove all non-digits
data['phone'] = data['phone'].str.replace(r'[^0-9]', '', regex=True)

✅ Handles multiple input formats
```

**Strategy 3: Validation and Rejection**

```python
# Define valid categories
VALID_CATEGORIES = ['electronics', 'clothing', 'food', 'books']

# Flag invalid entries
data['category_valid'] = data['category'].isin(VALID_CATEGORIES)

# Handle invalid
data.loc[~data['category_valid'], 'category'] = 'other'

✅ Enforces data quality at input
```

---

### 4. Outliers and Errors - The Troublemakers 🎭

**Definition:** Values that are technically possible but practically nonsense.

#### Real Example: Ride-Sharing App

| trip_id | distance_km | duration_min | fare_usd | speed_kmh | notes |
|---------|-------------|--------------|----------|-----------|-------|
| 1 | 5.2 | 18 | 12.50 | 17.3 | Normal trip |
| 2 | 0.1 | 45 | 8.00 | 0.13 | Stuck in traffic? |
| 3 | 850 | 120 | 15.00 | 425 | Supersonic car?! |
| 4 | -3.2 | 10 | 5.00 | -19.2 | Negative distance? |
| 5 | 12.5 | 0 | 22.00 | ∞ | Teleportation? |

**Why does this happen?**

- **GPS errors:** Tunnels, signal loss, urban canyons
- **System bugs:** Division by zero, data type overflow
- **Human error:** Manual data entry mistakes
- **Testing data:** Engineers forgot to delete test records
- **Fraud:** Drivers/users gaming the system

**The problem for ML:**

- **Skews** statistics (mean, standard deviation)
- **Distorts** model learning (treats errors as patterns)
- **Breaks** algorithms (infinity, negative values where impossible)

#### Handling Strategies

**Strategy 1: Statistical Detection**

```python
import numpy as np

# Method 1: Z-score (how many standard deviations away)
from scipy import stats

z_scores = np.abs(stats.zscore(data['fare_usd']))
outliers = z_scores > 3  # Beyond 3 standard deviations

print(f"Found {outliers.sum()} outliers")

# Method 2: IQR (Interquartile Range)
Q1 = data['fare_usd'].quantile(0.25)
Q3 = data['fare_usd'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = (data['fare_usd'] < lower_bound) | (data['fare_usd'] > upper_bound)

✅ Works for normally distributed data
❌ Might flag valid extreme values
```

**Strategy 2: Domain Knowledge Rules**

```python
# Based on business logic
invalid_trips = (
    (data['distance_km'] < 0) |           # Negative distance impossible
    (data['distance_km'] > 500) |         # 500km is too far for city ride
    (data['duration_min'] <= 0) |         # Zero time impossible
    (data['fare_usd'] < 2.50) |           # Minimum fare
    (data['fare_usd'] > 1000) |           # Suspiciously expensive
    (data['speed_kmh'] > 120)             # Speed limit is 100
)

print(f"Found {invalid_trips.sum()} invalid trips")

# Flag them
data['is_valid'] = ~invalid_trips

✅ Uses business logic
✅ Explainable
```

**Strategy 3: Visualization**

```python
import matplotlib.pyplot as plt

# Box plot to see outliers
data['fare_usd'].plot(kind='box')
plt.title('Fare Distribution')
plt.show()

# Scatter plot for relationships
plt.scatter(data['distance_km'], data['fare_usd'])
plt.xlabel('Distance (km)')
plt.ylabel('Fare (USD)')
plt.title('Distance vs Fare')
plt.show()

✅ Visual inspection catches weird patterns
```

**What to Do with Outliers:**

1. **Delete them** - If clearly errors
2. **Cap them** - Replace with maximum reasonable value
3. **Keep them** - If genuinely interesting (like Black Friday sales spike)
4. **Investigate** - Might reveal bugs or fraud

```python
# Capping (Winsorization)
upper_limit = data['fare_usd'].quantile(0.99)
data['fare_usd_capped'] = data['fare_usd'].clip(upper=upper_limit)
```

---

### 5. Data Type Issues - The Type Confusion 🔢

**Definition:** Data stored in wrong format or type.

#### Real Example: Age Field

```python
age
25
"32"        # String instead of number
"forty-two" # Text
None        # Missing
25.5        # Decimal (ages are usually integers)
"25 years"  # With units
-5          # Negative (error)
999         # Default value for missing?
```

**The problem:**

- Can't do math on strings
- Can't categorize numbers
- Algorithms expect specific types

#### Handling Strategies

```python
# Convert types
data['age'] = pd.to_numeric(data['age'], errors='coerce')  # Non-numeric → NaN

# Then clean
data = data[data['age'] > 0]          # Remove negative
data = data[data['age'] < 120]        # Remove impossible
data['age'] = data['age'].astype(int) # Convert to integer

# For categorical
data['category'] = data['category'].astype('category')

✅ Ensures type consistency
```

---

## The Data Quality Checklist ✅

Before training ANY model, go through this checklist:

### 1. Completeness

```python
# Check missing values
print(data.isnull().sum())
print(f"Missing percentage:\n{data.isnull().mean() * 100}")

# Check empty strings
print((data == '').sum())
```

**Action items:**
- [ ] No column has >30% missing values
- [ ] Missing values are handled (deleted/imputed)
- [ ] Documented why values are missing

### 2. Uniqueness

```python
# Check duplicates
print(f"Total rows: {len(data)}")
print(f"Unique rows: {len(data.drop_duplicates())}")
print(f"Duplicates: {len(data) - len(data.drop_duplicates())}")

# Check ID uniqueness
print(f"Unique IDs: {data['id'].nunique()} out of {len(data)}")
```

**Action items:**
- [ ] Duplicates removed or justified
- [ ] ID columns are actually unique
- [ ] No test data mixed with real data

### 3. Consistency

```python
# Check data types
print(data.dtypes)

# Check value formats
print(data['phone'].value_counts()[:10])  # See format variations
print(data['date'].value_counts()[:10])
```

**Action items:**
- [ ] All dates in same format
- [ ] All text in same case (usually lowercase)
- [ ] Categorical values standardized
- [ ] Units consistent (all km, not mix of km/miles)

### 4. Validity

```python
# Check ranges
print(data.describe())

# Check for impossible values
print(f"Negative ages: {(data['age'] < 0).sum()}")
print(f"Future dates: {(data['date'] > pd.Timestamp.now()).sum()}")
```

**Action items:**
- [ ] No impossible values (negative ages, future dates)
- [ ] Values within expected ranges
- [ ] No placeholder values (999, -1, "N/A")

### 5. Accuracy

```python
# Sample random rows and manually verify
print(data.sample(10))

# Check against known truth
# (e.g., total sales should match accounting records)
```

**Action items:**
- [ ] Spot-checked random samples
- [ ] Aggregates match known totals
- [ ] Cross-validated with other data sources

---

## Real-World Case Study: Cleaning Messy Customer Data 📊

### The Situation

A subscription box company has customer data from 3 years. They want to predict churn (cancellations). Let's clean their data!

### Raw Data (First 5 Rows)

| customer_id | signup_date | age | city | plan | monthly_fee | status | notes |
|-------------|-------------|-----|------|------|-------------|--------|-------|
| 1001 | 2021-15-03 | 32 | new york | premium | 29.99 | active | |
| 1001 | 2021-15-03 | 32 | new york | premium | 29.99 | active | duplicate |
| 1002 | 15/03/2021 | NaN | NEW YORK | basic | $14.99 | active | |
| 1003 | 2021-03-15 | 150 | los angeles | Premium | 29.99 | canceled | |
| 1004 | null | 28 | sf | basic | null | active | |

### Step-by-Step Cleaning

**Step 1: Load and Inspect**

```python
import pandas as pd

# Load data
data = pd.read_csv('customers.csv')

print(f"Shape: {data.shape}")
print(f"\nInfo:")
print(data.info())
print(f"\nMissing values:")
print(data.isnull().sum())
print(f"\nDuplicates: {data.duplicated().sum()}")
```

**Step 2: Remove Exact Duplicates**

```python
before = len(data)
data = data.drop_duplicates()
after = len(data)

print(f"Removed {before - after} duplicates ({100*(before-after)/before:.1f}%)")
```

**Step 3: Fix Dates**

```python
# Convert all date formats to datetime
data['signup_date'] = pd.to_datetime(data['signup_date'], errors='coerce')

# Remove invalid dates
data = data[data['signup_date'].notnull()]

print(f"Kept {len(data)} rows with valid dates")
```

**Step 4: Clean Age**

```python
# Fill missing ages with median
median_age = data['age'].median()
data['age'].fillna(median_age, inplace=True)

# Fix outliers (cap at reasonable range)
data.loc[data['age'] < 18, 'age'] = 18
data.loc[data['age'] > 100, 'age'] = 100

print(f"Age range: {data['age'].min()} - {data['age'].max()}")
```

**Step 5: Standardize Text**

```python
# City: lowercase and map common variations
data['city'] = data['city'].str.lower().str.strip()

city_map = {
    'nyc': 'new york',
    'ny': 'new york',
    'la': 'los angeles',
    'sf': 'san francisco'
}
data['city'] = data['city'].replace(city_map)

# Plan: standardize case
data['plan'] = data['plan'].str.lower()

# Status: standardize
data['status'] = data['status'].str.lower()

print(f"\nUnique cities: {data['city'].unique()}")
print(f"Unique plans: {data['plan'].unique()}")
```

**Step 6: Fix Monetary Values**

```python
# Remove $ and convert to float
data['monthly_fee'] = data['monthly_fee'].replace('[\$,]', '', regex=True)
data['monthly_fee'] = pd.to_numeric(data['monthly_fee'], errors='coerce')

# Fill missing fees based on plan
plan_fees = data.groupby('plan')['monthly_fee'].median()
data['monthly_fee'] = data.groupby('plan')['monthly_fee'].transform(
    lambda x: x.fillna(x.median())
)

print(f"\nFees by plan:\n{plan_fees}")
```

**Step 7: Final Validation**

```python
# Create data quality report
print("\n=== DATA QUALITY REPORT ===")
print(f"Total rows: {len(data)}")
print(f"Date range: {data['signup_date'].min()} to {data['signup_date'].max()}")
print(f"Age range: {data['age'].min()} to {data['age'].max()}")
print(f"Missing values:\n{data.isnull().sum()}")
print(f"\nValue distributions:")
print(f"Cities:\n{data['city'].value_counts()}")
print(f"\nPlans:\n{data['plan'].value_counts()}")
print(f"\nStatus:\n{data['status'].value_counts()}")
```

**Step 8: Save Clean Data**

```python
# Save cleaned version
data.to_csv('customers_clean.csv', index=False)

print("\n✅ Data cleaning complete!")
print(f"Clean data saved to customers_clean.csv")
```

---

## Common Mistakes to Avoid ⚠️

### 1. Cleaning Before Splitting

```python
# ❌ WRONG: Clean entire dataset first
data_clean = clean_data(data)
train, test = split(data_clean)

# ✅ RIGHT: Split first, then clean train and test separately
train, test = split(data)
train_clean = clean_data(train)
test_clean = clean_data(test)
```

**Why?** Cleaning decisions (like mean imputation) should only use training data to avoid data leakage!

### 2. Deleting Too Much Data

```python
# ❌ Deleting any row with ANY missing value
data_clean = data.dropna()  # Lost 80% of data!

# ✅ Smarter approach
# Drop columns with >50% missing
cols_to_keep = data.columns[data.isnull().mean() < 0.5]
data = data[cols_to_keep]

# Then impute remaining missing values
data = impute(data)
```

### 3. Not Documenting Changes

```python
# ❌ Just cleaning silently
data['age'].fillna(30, inplace=True)

# ✅ Document everything
log_cleaning_step("age", "filled missing", f"used median: {data['age'].median()}")
data['age'].fillna(data['age'].median(), inplace=True)
```

### 4. Ignoring Domain Knowledge

```python
# ❌ Blindly using statistical methods
data = data[data['income'] < data['income'].quantile(0.99)]  # Cap at 99th percentile

# ✅ Use business logic
data = data[data['income'] < 500000]  # No customer earns >500k (we're selling pizza, not yachts!)
```

---

## The Golden Rules of Data Quality 🏆

1. **Start with data quality, not algorithms**
   - A simple model on clean data beats a complex model on dirty data

2. **Visualize before and after**
   - Always plot your data before and after cleaning
   - Helps catch mistakes

3. **Document everything**
   - Every cleaning decision should be logged
   - Future you will thank present you

4. **Never delete original data**
   - Keep raw data unchanged
   - Create cleaned version separately

5. **Automate the pipeline**
   - Turn cleaning steps into reusable functions
   - You'll run this many times

6. **Validate continuously**
   - Check data quality at every stage
   - Set up automatic alerts for bad data in production

---

## Tools and Libraries 🛠️

### Python Libraries

```python
# Core
import pandas as pd
import numpy as np

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Advanced cleaning
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.preprocessing import StandardScaler

# Specialized
import missingno as msno  # Visualize missing data
import pandas_profiling  # Automatic data quality report
```

### Quick Data Quality Report

```python
# Install: pip install pandas-profiling
from pandas_profiling import ProfileReport

profile = ProfileReport(data, title='Data Quality Report')
profile.to_file("data_quality_report.html")

# Opens an interactive HTML report with:
# - Missing values visualization
# - Correlation matrix
# - Distribution plots
# - Duplicate detection
# - and much more!
```

---

## Summary: Your Data Cleaning Workflow 🎯

```
1. Load and Inspect
   ├─ Check shape and types
   ├─ Look at first/last rows
   ├─ Get summary statistics
   └─ Count missing values

2. Handle Duplicates
   ├─ Remove exact duplicates
   ├─ Identify fuzzy duplicates
   └─ Document removal

3. Fix Missing Values
   ├─ Understand why missing
   ├─ Decide strategy per column
   └─ Impute or delete

4. Standardize Formats
   ├─ Dates → datetime
   ├─ Text → lowercase
   ├─ Categories → standard names
   └─ Numbers → proper types

5. Handle Outliers
   ├─ Detect with statistics/visualization
   ├─ Investigate cause
   └─ Cap, remove, or keep

6. Validate
   ├─ Check ranges
   ├─ Verify consistency
   ├─ Sample manual review
   └─ Create quality report

7. Document and Save
   ├─ Log all transformations
   ├─ Save cleaning pipeline
   └─ Export clean data
```

---

## What's Next? 🚀

Now that your data is clean, you're ready to **understand** it deeply! In the next article, we'll explore **Exploratory Data Analysis (EDA)** - the art of discovering patterns, relationships, and insights hidden in your data through visualization and statistics.

**Remember:** Clean data is the foundation. Everything else is built on top of it. Spend time here, and your models will thank you later!

Good luck cleaning! 🧹✨
