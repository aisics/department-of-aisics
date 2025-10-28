---
title: "Train, Validate, Test - Splitting Your Data Right"
description: "Learn how to split your data properly to prevent overfitting and data leakage, with practical examples and best practices"
author: "Department of AIsiCs"
date: 2025-10-28
readingTime: 20
tags: ["train-test-split", "cross-validation", "overfitting", "data-leakage", "machine-learning", "validation"]
featured: false
difficulty: "beginner"
category: "Machine Learning"
subcategory: "02-data-fundamentals"
prerequisites: ["01-data-quality", "02-exploratory-data-analysis", "03-feature-engineering"]
relatedArticles: ["05-linear-regression", "06-model-evaluation"]
---

> **📌 New to Python?** This article uses Python code examples. If you haven't used Python before, start with our [Python Setup for ML](/article/tutorials-en-00-python-setup-basics) guide first!

# Train, Validate, Test - Splitting Your Data Right 🎯

Imagine you're preparing for a big exam. You study hard, practice problems, and feel confident. On exam day, you sit down and... wait, these are the EXACT same questions you practiced with! You get 100%. Amazing, right?

Wrong. You didn't actually learn - you just memorized the answers.

**This is exactly what happens when ML models "study" and "test" on the same data.**

Here's a shocking truth: **Most beginners make their models look amazing by accidentally cheating on the test.** They train on their full dataset, evaluate on the same dataset, and get incredible results... that completely fall apart in the real world.

**In this article, you'll learn:**
- Why we must split data before training
- How to do simple train/test splits (80/20, 70/30)
- When to use train/validation/test (3-way split)
- What is cross-validation and when to use it
- Special splitting for imbalanced and time series data
- Common mistakes that cause data leakage

Let's make sure your models actually work in production! 🚀

---

## The Overfitting Problem - Why We Split Data 🤔

### The Memorization Trap

Let's use our pizza restaurant example. You have data from January with these features:
- Temperature, day of week, hour, etc.
- Target: Number of pizzas sold

**Scenario 1: Training and testing on the same data** ❌

```python
# Train model on January data
model.fit(january_data)

# Test model on... January data again!
score = model.score(january_data)
# Score: 99% - Amazing! 🎉

# Deploy to production...
# February arrives...
# Model performance: 45% - Disaster! 😱
```

**What happened?** The model memorized January's specific patterns instead of learning general rules:
- "On Jan 15th at 7 PM, sell 23 pizzas" (memorized)
- vs
- "Friday evenings typically sell 20-25 pizzas" (learned)

The first is useless for February. The second is valuable knowledge.

### The Real-World Test

**Scenario 2: Training and testing on separate data** ✅

```python
# Train on January data
model.fit(january_data)

# Test on February data (model has NEVER seen this!)
score = model.score(february_data)
# Score: 78% - More realistic!

# Deploy to production...
# March arrives...
# Model performance: 76% - Consistent! ✅
```

Now the model learned actual patterns that generalize to new data.

### Types of Generalization

```
UNDERFITTING                GOOD FIT                OVERFITTING
(Too Simple)               (Just Right)            (Too Complex)

Training: 60%              Training: 85%           Training: 99%
Test: 58%                  Test: 82%               Test: 45%

Model too simple           Model learned           Model memorized
Can't capture patterns     generalizable rules     specific examples
```

**Our goal:** Find the sweet spot where the model performs well on BOTH training and test data.

---

## Simple Train/Test Split - The Foundation 📊

The most basic approach: split your data into two parts.

### The 80/20 Rule

```python
from sklearn.model_selection import train_test_split
import pandas as pd

# Our pizza data
data = pd.read_csv('pizza_orders_clean.csv')

# Features (X) and target (y)
X = data.drop('num_pizzas', axis=1)
y = data['num_pizzas']

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,      # 20% for testing
    random_state=42     # Reproducibility
)

print(f"Total samples: {len(X)}")
print(f"Training samples: {len(X_train)} ({len(X_train)/len(X)*100:.1f}%)")
print(f"Test samples: {len(X_test)} ({len(X_test)/len(X)*100:.1f}%)")
```

**Output:**
```
Total samples: 10000
Training samples: 8000 (80.0%)
Test samples: 2000 (20.0%)
```

### Why This Works

| Set | Purpose | What the Model Knows |
|-----|---------|----------------------|
| **Training (80%)** | Learn patterns | Sees all features and labels |
| **Test (20%)** | Evaluate performance | NEVER seen during training |

**The test set simulates new, unseen data from production.**

### Choosing the Split Ratio

| Split | When to Use | Pros | Cons |
|-------|-------------|------|------|
| **80/20** | Standard choice | Good balance | Default for most cases |
| **70/30** | Smaller datasets (<1000 samples) | More test data for reliable evaluation | Less training data |
| **90/10** | Large datasets (>100,000 samples) | Maximize training data | Small test set might be less reliable |
| **60/20/20** | When you need validation set | Best practice for hyperparameter tuning | More complex (see next section) |

**Rule of thumb:** Start with 80/20 unless you have a specific reason to change it.

### The random_state Parameter

```python
# Without random_state - different results each time!
split1 = train_test_split(X, y, test_size=0.2)
split2 = train_test_split(X, y, test_size=0.2)
# Different splits!

# With random_state - reproducible results
split1 = train_test_split(X, y, test_size=0.2, random_state=42)
split2 = train_test_split(X, y, test_size=0.2, random_state=42)
# Exactly the same splits!
```

**Always set random_state** when experimenting so you can compare results fairly!

---

## Train/Validation/Test - The 3-Way Split 🎯

### The Hyperparameter Tuning Problem

**Problem:** You train a model, tune hyperparameters by testing different values, and pick the best one based on test performance.

**Wait... did you just overfit to the test set?**

Yes! By repeatedly testing on the test set to choose hyperparameters, you've "leaked" information from the test set into your model selection process.

**Solution:** Use three sets instead of two!

### The Three Sets Explained

```python
from sklearn.model_selection import train_test_split

# First split: separate out test set
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y,
    test_size=0.2,     # 20% for final testing
    random_state=42
)

# Second split: split remaining into train and validation
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp,
    test_size=0.25,    # 0.25 of 80% = 20% of original
    random_state=42
)

print(f"Training set: {len(X_train)} samples ({len(X_train)/len(X)*100:.0f}%)")
print(f"Validation set: {len(X_val)} samples ({len(X_val)/len(X)*100:.0f}%)")
print(f"Test set: {len(X_test)} samples ({len(X_test)/len(X)*100:.0f}%)")
```

**Output:**
```
Training set: 6000 samples (60%)
Validation set: 2000 samples (20%)
Test set: 2000 samples (20%)
```

### Purpose of Each Set

| Set | Purpose | Used For | Model Sees It? |
|-----|---------|----------|----------------|
| **Training** | Learn patterns | Fitting model parameters (weights, coefficients) | ✅ Yes - fully visible |
| **Validation** | Tune hyperparameters | Selecting best hyperparameters, early stopping | ❌ No - but influences decisions |
| **Test** | Final evaluation | One-time performance check before deployment | ❌ No - completely untouched |

### Complete Workflow Example

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Try different hyperparameters on validation set
best_mae = float('inf')
best_params = None

for n_trees in [50, 100, 200]:
    for max_depth in [10, 20, None]:
        # Train on training set
        model = RandomForestRegressor(
            n_estimators=n_trees,
            max_depth=max_depth,
            random_state=42
        )
        model.fit(X_train, y_train)

        # Evaluate on validation set
        val_pred = model.predict(X_val)
        mae = mean_absolute_error(y_val, val_pred)

        # Track best hyperparameters
        if mae < best_mae:
            best_mae = mae
            best_params = {'n_estimators': n_trees, 'max_depth': max_depth}

print(f"Best hyperparameters: {best_params}")
print(f"Validation MAE: {best_mae:.2f}")

# Train final model with best hyperparameters on training data
final_model = RandomForestRegressor(**best_params, random_state=42)
final_model.fit(X_train, y_train)

# ONE-TIME evaluation on test set
test_pred = final_model.predict(X_test)
test_mae = mean_absolute_error(y_test, test_pred)

print(f"\n🎯 Final Test MAE: {test_mae:.2f} pizzas")
print("This is the performance we expect in production!")
```

**Key Rule:** **Touch the test set ONLY ONCE, at the very end!**

---

## K-Fold Cross-Validation - Getting More Reliable Estimates 🔄

### The Problem with Single Splits

With a single train/test split, your performance estimate depends on which samples ended up in the test set. You might get lucky (or unlucky)!

```python
# Different random splits give different scores!
for i in range(5):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=i
    )
    model = RandomForestRegressor(random_state=42)
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    print(f"Split {i+1}: R² = {score:.3f}")
```

**Output:**
```
Split 1: R² = 0.843
Split 2: R² = 0.871
Split 3: R² = 0.826
Split 4: R² = 0.889
Split 5: R² = 0.854
```

Which one is the "true" performance? 🤔

### How K-Fold Cross-Validation Works

**Idea:** Split data into K parts (folds), train K times, each time using a different fold as test set.

**Example: 5-Fold Cross-Validation**

```
Fold 1: [TEST] [train] [train] [train] [train]
Fold 2: [train] [TEST] [train] [train] [train]
Fold 3: [train] [train] [TEST] [train] [train]
Fold 4: [train] [train] [train] [TEST] [train]
Fold 5: [train] [train] [train] [train] [TEST]

Final score = average of all 5 test scores
```

**Each sample gets to be in the test set exactly once!**

### Implementation

```python
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestRegressor
import numpy as np

# Create model
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Perform 5-fold cross-validation
scores = cross_val_score(
    model, X, y,
    cv=5,                    # 5 folds
    scoring='r2'             # R² metric
)

print("Scores for each fold:", scores)
print(f"\nMean R²: {scores.mean():.3f}")
print(f"Std Dev: {scores.std():.3f}")
print(f"95% Confidence Interval: {scores.mean():.3f} ± {1.96*scores.std():.3f}")
```

**Output:**
```
Scores for each fold: [0.843 0.871 0.826 0.889 0.854]

Mean R²: 0.857
Std Dev: 0.023
95% Confidence Interval: 0.857 ± 0.045
```

**Interpretation:** The model's R² is approximately 0.857, with performance ranging from ~0.81 to 0.90.

### When to Use K-Fold Cross-Validation

**✅ Use K-Fold when:**
- Small to medium datasets (<10,000 samples)
- You want reliable performance estimates
- Comparing multiple models or hyperparameters
- You need confidence intervals

**❌ Don't use K-Fold when:**
- Very large datasets (too expensive computationally)
- Time series data (use time-based splits instead)
- Severe class imbalance (use stratified K-fold instead)

### Choosing K

| K Value | Pros | Cons | When to Use |
|---------|------|------|-------------|
| **K=5** | Fast, good balance | Less precise | Default choice, large datasets |
| **K=10** | More reliable estimate | Slower | Standard choice, medium datasets |
| **K=n (LOO)** | Maximum data for training | Very slow, high variance | Tiny datasets (<100 samples) |

**Rule of thumb:** Use K=5 for quick experiments, K=10 for final evaluation.

---

## Stratified Splitting - Handling Imbalanced Data ⚖️

### The Imbalance Problem

Imagine your pizza restaurant wants to predict whether an order will be "large" (5+ pizzas) or "regular" (1-4 pizzas).

```python
# Check class distribution
print(data['is_large_order'].value_counts())
```

**Output:**
```
False    9500  (95%)
True      500  (5%)
```

Only 5% of orders are large!

**Problem with random splitting:**

```python
# Random split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training set distribution:")
print(y_train.value_counts(normalize=True))
print("\nTest set distribution:")
print(y_test.value_counts(normalize=True))
```

**Output:**
```
Training set distribution:
False    0.951  (95.1%)
True     0.049  (4.9%)

Test set distribution:
False    0.940  (94.0%)
True     0.060  (6.0%)
```

Test set has 6% large orders instead of 5% - not representative!

### Stratified Split to the Rescue

```python
# Stratified split - maintains class distribution
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,        # Maintain y's distribution
    random_state=42
)

print("Training set distribution:")
print(y_train.value_counts(normalize=True))
print("\nTest set distribution:")
print(y_test.value_counts(normalize=True))
```

**Output:**
```
Training set distribution:
False    0.950  (95.0%)
True     0.050  (5.0%)

Test set distribution:
False    0.950  (95.0%)
True     0.050  (5.0%)
```

Perfect! Both sets have exactly 5% large orders. ✅

### Stratified K-Fold

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

# Stratified K-Fold ensures each fold has same class distribution
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores = cross_val_score(
    model, X, y,
    cv=skf,
    scoring='f1'
)

print(f"Stratified K-Fold scores: {scores}")
print(f"Mean F1: {scores.mean():.3f} ± {scores.std():.3f}")
```

**When to use stratification:**
- Binary classification with imbalance
- Multi-class classification with unequal classes
- Regression with skewed target distribution

---

## Time Series Splitting - No Peeking Into the Future! 📅

### The Time Travel Problem

**DON'T DO THIS with time series data:** ❌

```python
# WRONG: Random split for time series
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Problem: Training set contains FUTURE data!
# Training: [Jan 5, Feb 20, Mar 15, ...]
# Test: [Jan 3, Feb 8, Mar 1, ...]

# You're predicting Jan 3 using data from Feb and Mar!
# This is time travel - cheating!
```

**In real production:** You can only use past data to predict the future.

### Sequential Splitting

```python
# Sort data by date first!
data = data.sort_values('date')

# Split sequentially - train on past, test on future
split_point = int(len(data) * 0.8)

train_data = data[:split_point]
test_data = data[split_point:]

print(f"Training period: {train_data['date'].min()} to {train_data['date'].max()}")
print(f"Test period: {test_data['date'].min()} to {test_data['date'].max()}")
```

**Output:**
```
Training period: 2024-01-01 to 2024-10-12
Test period: 2024-10-13 to 2024-12-31
```

**Key principle:** Train on past, test on future. No overlap!

### Time Series Cross-Validation

```python
from sklearn.model_selection import TimeSeriesSplit
import matplotlib.pyplot as plt

# Create time series splits
tscv = TimeSeriesSplit(n_splits=5)

# Visualize the splits
fig, ax = plt.subplots(figsize=(12, 6))

for i, (train_idx, test_idx) in enumerate(tscv.split(X)):
    # Plot train and test for each fold
    ax.scatter(train_idx, [i]*len(train_idx), c='blue', marker='s', s=10, label='Train' if i==0 else '')
    ax.scatter(test_idx, [i]*len(test_idx), c='red', marker='s', s=10, label='Test' if i==0 else '')

ax.set_xlabel('Sample Index (Time →)')
ax.set_ylabel('Fold')
ax.set_title('Time Series Cross-Validation')
ax.legend()
plt.tight_layout()
plt.show()
```

**How it works:**

```
Fold 1: [train              ] [test]
Fold 2: [train                    ] [test]
Fold 3: [train                          ] [test]
Fold 4: [train                                ] [test]
Fold 5: [train                                      ] [test]
```

**Training set grows** as we move forward in time - simulates real-world scenario!

### Implementation

```python
from sklearn.model_selection import TimeSeriesSplit, cross_val_score

tscv = TimeSeriesSplit(n_splits=5)

scores = cross_val_score(
    model, X, y,
    cv=tscv,
    scoring='neg_mean_absolute_error'
)

# Note: negative because sklearn wants to maximize scores
mae_scores = -scores

print(f"MAE for each fold: {mae_scores}")
print(f"Average MAE: {mae_scores.mean():.2f} pizzas")
```

---

## Common Mistakes and How to Avoid Them 🚨

### Mistake 1: Data Leakage - Fitting Scaler on Full Dataset

**❌ WRONG:**

```python
from sklearn.preprocessing import StandardScaler

# Fit scaler on ALL data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # Uses test data statistics!

# Then split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)

# Problem: Model has seen test data statistics (mean, std)
```

**✅ RIGHT:**

```python
# Split FIRST
X_train, X_test, y_train, y_test = train_test_split(X, y)

# Fit scaler on training data ONLY
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # Learn from train
X_test_scaled = scaler.transform(X_test)        # Apply to test

# Test data is truly unseen!
```

**Key principle:** **Always split before any data transformation!**

### Mistake 2: Using Test Set Multiple Times

**❌ WRONG:**

```python
# Try model 1
model1 = RandomForest()
model1.fit(X_train, y_train)
score1 = model1.score(X_test, y_test)  # 0.85

# Not good enough, try model 2
model2 = XGBoost()
model2.fit(X_train, y_train)
score2 = model2.score(X_test, y_test)  # 0.87

# Still trying... model 3
model3 = NeuralNet()
model3.fit(X_train, y_train)
score3 = model3.score(X_test, y_test)  # 0.89

# Pick model 3 because it scored best on test set
# Problem: You've overfit to the test set!
```

**✅ RIGHT:**

```python
# Use validation set or cross-validation to compare models
for model in [RandomForest(), XGBoost(), NeuralNet()]:
    scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"{model.__class__.__name__}: {scores.mean():.3f}")

# Pick best model based on cross-validation

# Test ONCE on test set at the very end
final_model.fit(X_train, y_train)
final_score = final_model.score(X_test, y_test)
print(f"Final test score: {final_score:.3f}")
```

### Mistake 3: Not Shuffling Data

**❌ WRONG:**

```python
# Data is sorted by date or category
# Without shuffle, first 80% might be all January data
X_train, X_test = X[:8000], X[8000:]
```

**✅ RIGHT:**

```python
# Shuffle for random split (except for time series!)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    shuffle=True,     # Default is True
    random_state=42
)
```

### Mistake 4: Forgetting to Set random_state

**❌ WRONG:**

```python
# Different results every run!
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
# Can't reproduce results or compare fairly
```

**✅ RIGHT:**

```python
# Reproducible results
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42  # Any number, but keep it consistent
)
```

### Mistake 5: Testing on Training Data

**❌ WRONG:**

```python
model.fit(X_train, y_train)
score = model.score(X_train, y_train)  # Testing on training data!
print(f"Model accuracy: {score:.2f}")  # Always looks great!
```

**✅ RIGHT:**

```python
model.fit(X_train, y_train)
score = model.score(X_test, y_test)   # Testing on unseen data
print(f"Model accuracy: {score:.2f}") # Realistic estimate
```

---

## Putting It All Together - Complete Workflow 🏗️

Let's create a complete, production-ready workflow using everything we've learned!

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Step 1: Load and prepare data
print("🍕 Mama ML Pizza Restaurant - Complete ML Workflow\n")
data = pd.read_csv('pizza_orders_clean.csv')

# Features and target
X = data.drop(['num_pizzas', 'date', 'order_id'], axis=1)
y = data['num_pizzas']

print(f"Total samples: {len(X)}\n")

# Step 2: Initial train/test split (80/20)
# CRITICAL: Split BEFORE any preprocessing!
X_train_full, X_test, y_train_full, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    shuffle=True
)

print(f"Training set: {len(X_train_full)} samples")
print(f"Test set: {len(X_test)} samples (LOCKED AWAY 🔒)\n")

# Step 3: Create validation set from training data
X_train, X_val, y_train, y_val = train_test_split(
    X_train_full, y_train_full,
    test_size=0.25,  # 25% of 80% = 20% of total
    random_state=42
)

print(f"Final training set: {len(X_train)} samples (60%)")
print(f"Validation set: {len(X_val)} samples (20%)\n")

# Step 4: Preprocessing - fit on training data only!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)
X_test_scaled = scaler.transform(X_test)

print("✅ Data scaled (no leakage!)\n")

# Step 5: Hyperparameter tuning using validation set
print("🔧 Tuning hyperparameters on validation set...\n")

best_score = float('inf')
best_params = None

for n_estimators in [50, 100, 150]:
    for max_depth in [10, 20, 30]:
        model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train_scaled, y_train)
        val_pred = model.predict(X_val_scaled)
        mae = mean_absolute_error(y_val, val_pred)

        if mae < best_score:
            best_score = mae
            best_params = {
                'n_estimators': n_estimators,
                'max_depth': max_depth
            }

print(f"Best hyperparameters: {best_params}")
print(f"Validation MAE: {best_score:.2f} pizzas\n")

# Step 6: Cross-validation for more reliable estimate
print("📊 Cross-validation on full training set...\n")

final_model = RandomForestRegressor(**best_params, random_state=42, n_jobs=-1)

cv_scores = cross_val_score(
    final_model,
    scaler.fit_transform(X_train_full),
    y_train_full,
    cv=5,
    scoring='neg_mean_absolute_error'
)

cv_mae = -cv_scores.mean()
cv_std = cv_scores.std()

print(f"Cross-validation MAE: {cv_mae:.2f} ± {cv_std:.2f} pizzas\n")

# Step 7: Train final model on all training data
print("🎓 Training final model on full training set...\n")

final_model.fit(
    scaler.fit_transform(X_train_full),
    y_train_full
)

# Step 8: ONE-TIME evaluation on test set
print("🎯 FINAL TEST EVALUATION (one time only!):\n")
print("="*50)

test_pred = final_model.predict(X_test_scaled)
test_mae = mean_absolute_error(y_test, test_pred)
test_r2 = r2_score(y_test, test_pred)

print(f"Test MAE: {test_mae:.2f} pizzas")
print(f"Test R²: {test_r2:.3f}")
print("="*50)

print("\n💡 This is the performance we expect in production!")

# Step 9: Feature importance analysis
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': final_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n📊 Top 5 Most Important Features:")
print(feature_importance.head().to_string(index=False))

# Step 10: Save model and scaler for production
import joblib

joblib.dump(final_model, 'pizza_model.pkl')
joblib.dump(scaler, 'pizza_scaler.pkl')

print("\n✅ Model and scaler saved for production!")
print("\nWorkflow complete! 🎉")
```

**Expected Output:**

```
🍕 Mama ML Pizza Restaurant - Complete ML Workflow

Total samples: 10000

Training set: 8000 samples
Test set: 2000 samples (LOCKED AWAY 🔒)

Final training set: 6000 samples (60%)
Validation set: 2000 samples (20%)

✅ Data scaled (no leakage!)

🔧 Tuning hyperparameters on validation set...

Best hyperparameters: {'n_estimators': 100, 'max_depth': 20}
Validation MAE: 0.42 pizzas

📊 Cross-validation on full training set...

Cross-validation MAE: 0.45 ± 0.03 pizzas

🎓 Training final model on full training set...

🎯 FINAL TEST EVALUATION (one time only!):
==================================================
Test MAE: 0.47 pizzas
Test R²: 0.876
==================================================

💡 This is the performance we expect in production!

📊 Top 5 Most Important Features:
           feature  importance
 is_friday_evening      0.245
          hour_sin      0.187
       temperature      0.156
      is_peak_hour      0.128
  rolling_avg_3h         0.092

✅ Model and scaler saved for production!

Workflow complete! 🎉
```

---

## Quick Reference Guide 📋

### Data Splitting Cheat Sheet

```python
# 1. Simple 80/20 Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 2. Three-Way Split (60/20/20)
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42)

# 3. Stratified Split (for imbalanced data)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 4. K-Fold Cross-Validation
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)

# 5. Stratified K-Fold
from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=skf)

# 6. Time Series Split
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)
scores = cross_val_score(model, X, y, cv=tscv)
```

### Decision Tree: Which Split Should I Use?

```
Is this time series data?
├─ YES → Use TimeSeriesSplit or sequential split
└─ NO
    └─ Is the dataset imbalanced?
        ├─ YES → Use stratified split / StratifiedKFold
        └─ NO
            └─ Need hyperparameter tuning?
                ├─ YES → Use train/val/test (60/20/20)
                └─ NO
                    └─ Small dataset (<1000 samples)?
                        ├─ YES → Use K-Fold cross-validation (K=5 or 10)
                        └─ NO → Use simple train/test split (80/20)
```

### The Golden Rules

1. **Always split BEFORE preprocessing** (scaling, encoding, etc.)
2. **Set random_state for reproducibility**
3. **Use stratification for imbalanced data**
4. **Never use test set for model selection**
5. **Touch test set ONLY ONCE, at the very end**
6. **For time series: train on past, test on future**
7. **Use cross-validation for reliable estimates**

---

## Summary and Next Steps 🎯

### What You Learned

**1. Why Data Splitting is Critical**
- Prevent overfitting by testing on unseen data
- Simulate real-world deployment conditions
- Get honest performance estimates

**2. Simple Train/Test Split**
- 80/20 rule as default
- Always set random_state
- Test set simulates production data

**3. Train/Validation/Test Split**
- Use validation set for hyperparameter tuning
- Keep test set completely untouched
- Touch test set only once

**4. K-Fold Cross-Validation**
- More reliable performance estimates
- Each sample used for both training and testing
- Standard choice: K=5 or K=10

**5. Special Cases**
- Stratified splitting for imbalanced data
- Time series splitting (no future peeking!)
- Sequential validation for temporal data

**6. Common Pitfalls**
- Data leakage from preprocessing before splitting
- Using test set multiple times
- Random splitting for time series

### The Data Journey So Far

```
Raw Data
    ↓
[Article 1: Data Quality] ✅ Clean the data
    ↓
[Article 2: EDA] ✅ Understand patterns
    ↓
[Article 3: Feature Engineering] ✅ Create ML-ready features
    ↓
[Article 4: Train/Test Split] ✅ Split data properly (You are here!)
    ↓
Ready to train models!
    ↓
[Article 5: Linear Regression] → Next!
```

### What's Next?

In **Article 5: Your First ML Model - Linear Regression**, we'll finally train a model:
- Understanding linear relationships
- Training your first algorithm
- Interpreting model parameters
- Making predictions on new data
- Evaluating model performance

You now know how to split your data correctly. Next, we'll use that knowledge to train and evaluate your first machine learning model!

### Practice Exercises

**Exercise 1: Basic Splitting**
```python
# Given a dataset with 1000 samples, create:
# 1. An 80/20 train/test split with random_state=42
# 2. Verify the sizes are correct
# 3. Check if random_state gives reproducible results
```

**Exercise 2: Three-Way Split**
```python
# Create a 60/20/20 train/validation/test split
# Print the size of each set
# Verify they sum to 100% of original data
```

**Exercise 3: Identify the Mistake**
```python
# What's wrong with this code?
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test = train_test_split(X_scaled, test_size=0.2)
```

**Exercise 4: Time Series**
```python
# You have pizza orders from Jan-Dec 2024
# Create a proper time series split:
# - Train: Jan-Sep
# - Test: Oct-Dec
# Make sure there's no data leakage!
```

---

**Ready to train your first model?** With properly split data, your models will actually work in the real world! 🚀

Remember: **Split first, train second, test last!** 🎯

Happy splitting! 💪✨
