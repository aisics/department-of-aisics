---
title: "Probabilities - The Brain of AI"
description: "How probabilities enable artificial intelligence to make decisions under uncertainty and learn from data"
author: "Department of AIsiCs"
date: 2025-07-29
readingTime: 20
tags: ["probabilities", "bayes", "machine-learning", "statistics", "uncertainty"]
featured: false
difficulty: "beginner"
category: "Basics"
prerequisites: ["01-vectors-in-ai"]
relatedArticles: ["02-matrixes-in-ai"]
---

# Probabilities – How AI Deals with Uncertainty 🎲

Imagine you're playing chess against a computer. How does it decide which move to make? It can't know exactly what you'll do next, but it can estimate the probability of each of your possible moves. Probabilities enable AI to make intelligent decisions under uncertainty – from speech recognition to weather forecasting.

## What is Probability in the Context of AI?

**Probability** is a numerical measure of how likely an event is to occur. In the context of AI, probabilities allow models to:

* **Express uncertainty:** Instead of a categorical answer "this is a cat," the model says "with 92% probability this is a cat"
* **Learn from data:** Update their beliefs based on new observations
* **Make optimal decisions:** Choose actions that maximize expected utility

### Basic Concepts

* **Probability of an event P(A):** A number from 0 to 1, where:
  * P(A) = 0 means event A is impossible
  * P(A) = 1 means event A will definitely occur
  * P(A) = 0.7 means 70% chance that event A will occur

* **Random variable:** A variable whose value depends on random events
  * **Discrete:** Can only take separate, distinct values that can be counted
    * Rolling a die: only 1, 2, 3, 4, 5, or 6 (can't be 2.5 or 3.7)
    * Number of website users: 0, 1, 2, 3... (can't have 2.3 users)
    * Classification result: "cat", "dog", "bird" (distinct categories)
  * **Continuous:** Can take any value within a range, including fractions
    * Temperature: can be 20°C, 20.1°C, 20.15°C, 20.157°C... (infinite precision)
    * Server response time: 1.234 sec, 1.2345 sec... (any precision)
    * Model probability: 0.7, 0.73, 0.7314... (any number from 0 to 1)

## Basic Rules of Probability

### 1. Sum Rule

For mutually exclusive events (those that cannot occur simultaneously):

```
P(A or B) = P(A) + P(B)
```

**Example in image recognition:**
If a model determines that a photo might contain:
* P(cat) = 0.6
* P(dog) = 0.3
* P(rabbit) = 0.1

Then the probability that it's a pet:
```
P(pet) = P(cat) + P(dog) + P(rabbit) = 0.6 + 0.3 + 0.1 = 1.0
```

### 2. Product Rule

For independent events:
```
P(A and B) = P(A) × P(B)
```

**Example in text processing:**
When generating text, if:
* P(next word = "artificial") = 0.2
* P(word after "artificial" = "intelligence") = 0.8

Then the probability of the phrase "artificial intelligence":
```
P("artificial intelligence") = 0.2 × 0.8 = 0.16
```

### 3. Conditional Probability

The probability of event A given that event B has already occurred:
```
P(A|B) = P(A and B) / P(B)
```

**Example in AI medical diagnostics:**
* P(positive test | disease) = 0.95 (test sensitivity)
* P(disease) = 0.01 (1% of population has the disease)
* P(positive test) = 0.05 (5% of all tests are positive)

What's the probability of disease given a positive test?
```
P(disease | positive test) = (0.95 × 0.01) / 0.05 = 0.19
```

So even with a positive test, the probability of disease is only 19%!

## Bayes' Theorem: The Heart of Probabilistic AI

Bayes' theorem is a fundamental tool that allows AI to update its beliefs based on new data.

### Bayes' Formula

```
P(H|E) = P(E|H) × P(H) / P(E)
```

Where:
* **P(H|E)** – posterior probability (probability of hypothesis after observation)
* **P(E|H)** – likelihood (probability of observation given hypothesis)
* **P(H)** – prior probability (initial probability of hypothesis)
* **P(E)** – probability of observation

### Real Example: Spam Filter 📧

Let's see how a Bayesian spam filter works. Suppose we received an email with the word "prize".

**Given:**
* P(spam) = 0.4 (40% of all emails are spam)
* P("prize" | spam) = 0.8 (80% of spam emails contain the word "prize")
* P("prize" | not spam) = 0.05 (5% of regular emails contain the word "prize")

**Find:** P(spam | "prize")

**Step 1:** Calculate P("prize")
```
P("prize") = P("prize" | spam) × P(spam) + P("prize" | not spam) × P(not spam)
P("prize") = 0.8 × 0.4 + 0.05 × 0.6 = 0.32 + 0.03 = 0.35
```

**Step 2:** Apply Bayes' theorem
```
P(spam | "prize") = P("prize" | spam) × P(spam) / P("prize")
P(spam | "prize") = 0.8 × 0.4 / 0.35 = 0.32 / 0.35 ≈ 0.914
```

**Conclusion:** An email with the word "prize" has a 91.4% probability of being spam!

## Probability Distributions in AI

A probability distribution describes how probability is distributed among possible values of a random variable.

### Normal Distribution (Gaussian Distribution) 🔔

The most important distribution in AI, describing many natural phenomena.

**Parameters:**
* **μ (mu)** – mean value (center of distribution)
* **σ (sigma)** – standard deviation (spread of data)

**Density formula:**
```
f(x) = (1 / (σ√(2π))) × e^(-(x-μ)²/(2σ²))
```

**Example in neural networks:**
When initializing neural network weights, we often use a normal distribution:
```
Weights ~ N(0, 0.01)  # Mean = 0, standard deviation = 0.01
```

This ensures that initial weights are:
* Small (close to 0)
* Diverse (not all the same)
* Symmetrically distributed

### Categorical Distribution

Used when we have several mutually exclusive categories.

**Example: Image Classification**
An animal recognition model outputs probabilities:
```
P(cat) = 0.7
P(dog) = 0.2
P(bird) = 0.08
P(other) = 0.02
```

Sum of all probabilities = 1.0

### Binomial Distribution

Describes the number of successes in a series of independent experiments.

**Formula:**
```
P(k successes in n trials) = C(n,k) × p^k × (1-p)^(n-k)
```

Where C(n,k) is the number of combinations of k from n.

**Example: A/B Testing of Models**
Testing two versions of a recommendation system. Version A has success probability p = 0.6. Out of 10 users, what's the probability that exactly 7 will be satisfied?

```
P(7 out of 10) = C(10,7) × 0.6^7 × 0.4^3
                = 120 × 0.0279936 × 0.064
                ≈ 0.215
```

## Softmax: From Numbers to Probabilities

Softmax is a function that transforms a vector of arbitrary numbers into a vector of probabilities.

### Softmax Formula

For a vector **z = [z₁, z₂, ..., zₙ]**:

```
softmax(zᵢ) = e^(zᵢ) / Σⱼ e^(zⱼ)
```

### Example: Emotion Recognition 😊😢😡

A neural network analyzes text and outputs "raw" scores for each emotion:

```
Raw scores = [2.0, 1.0, 0.1]  # [joy, sadness, anger]
```

**Apply softmax:**

1. Calculate exponentials:
   ```
   e^2.0 ≈ 7.39
   e^1.0 ≈ 2.72
   e^0.1 ≈ 1.11
   ```

2. Find the sum:
   ```
   Sum = 7.39 + 2.72 + 1.11 = 11.22
   ```

3. Divide each exponential by the sum:
   ```
   P(joy) = 7.39 / 11.22 ≈ 0.659
   P(sadness) = 2.72 / 11.22 ≈ 0.242
   P(anger) = 1.11 / 11.22 ≈ 0.099
   ```

**Result:** The text expresses joy with 65.9% probability!

## Entropy: Measure of Uncertainty

Entropy measures how unpredictable a probability distribution is.

### Entropy Formula

```
H(X) = -Σᵢ P(xᵢ) × log₂(P(xᵢ))
```

### Intuition Through Examples

**Example 1: Coin**
* Fair coin: P(heads) = 0.5, P(tails) = 0.5
  ```
  H = -0.5×log₂(0.5) - 0.5×log₂(0.5) = 1 bit
  ```
  
* Biased coin (defective or specially made): P(heads) = 0.9, P(tails) = 0.1
  ```
  H = -0.9×log₂(0.9) - 0.1×log₂(0.1) ≈ 0.47 bit
  ```

**Conclusion:** A fair coin has maximum entropy (greatest uncertainty).

**Example 2: Decision Trees in AI**

When building a decision tree, AI chooses features that maximally reduce entropy. For example, classifying fruits:

Initial entropy (50% apples, 50% oranges):
```
H = -0.5×log₂(0.5) - 0.5×log₂(0.5) = 1 bit
```

**Option 1: Split by color**
* Red: 90% apples, 10% oranges → H ≈ 0.47 bit
* Orange: 5% apples, 95% oranges → H ≈ 0.29 bit

Average entropy reduction: (0.5 × 0.47) + (0.5 × 0.29) = 0.38 bit

**Option 2: Split by shape**
* Round: 60% apples, 40% oranges → H ≈ 0.97 bit
* Not round: 40% apples, 60% oranges → H ≈ 0.97 bit

Average entropy reduction: (0.5 × 0.97) + (0.5 × 0.97) = 0.97 bit

**Conclusion:** Color reduces entropy to 0.38 bit, while shape only to 0.97 bit. Therefore, AI will choose color as the first splitting feature – it provides more information!

## Randomness in AI Training

### Stochastic Gradient Descent (SGD): How Randomness Helps Learning

**What is it?** SGD is an optimization method that AI uses for training. Instead of analyzing all data at once (which can be very slow), it randomly selects small portions of data and learns from them.

**Analogy with human learning:** Imagine you're learning to recognize dog breeds from 10,000 photos:
* **Regular approach:** View all 10,000 photos, draw conclusions, then all 10,000 again...
* **SGD approach:** Randomly take 32 photos, learn from them, take another 32, and so on

**How SGD works:**

```python
# Instead of this (full gradient descent):
for epoch in range(100):
    error = compute_on_all_10000_images()  # Very slow!
    update_model(error)

# SGD does this:
for epoch in range(100):
    shuffle(data)  # Randomness #1
    for mini_batch in split_into_groups_of_32(data):
        error = compute_on_32_images(mini_batch)  # Much faster!
        update_model(error)
```

**Why is randomness useful here?**

1. **Training speed:** 
   - Updates after every 32 images instead of 10,000
   - Model starts improving almost immediately

2. **Avoiding "getting stuck":**
   - Imagine you're descending a mountain in fog
   - Regular descent: you might get stuck in a pit (local minimum)
   - SGD: random "pushes" help escape from pits

3. **Better generalization:**
   - Random noise prevents the model from "memorizing" specific examples
   - Model becomes more flexible and universal

### Dropout: Learning Through Forgetting

Dropout is a technique where neurons are randomly "turned off" with a certain probability during training.

```
# During training
if training:
    mask = random_binary_vector(p=0.5)  # 50% probability of "turning off"
    output = input × mask / 0.5
else:
    output = input
```

**Effect:** The network becomes more robust because it can't rely on specific neurons.

## Practical Example: Naive Bayes Classifier

Let's see how to create a simple text sentiment classifier.

### Task: Determine if a Review is Positive

**Training data:**
```
Positive: ["great movie", "really liked it", "recommend"]
Negative: ["terrible movie", "didn't like it", "don't recommend"]
```

### Step 1: Calculate Word Probabilities

```
P("great" | positive) = 1/6 ≈ 0.167
P("movie" | positive) = 1/6 ≈ 0.167
P("really" | positive) = 1/6 ≈ 0.167
P("liked" | positive) = 1/6 ≈ 0.167
P("recommend" | positive) = 1/6 ≈ 0.167

P("terrible" | negative) = 1/7 ≈ 0.143
P("movie" | negative) = 1/7 ≈ 0.143
P("didn't" | negative) = 1/7 ≈ 0.143
P("like" | negative) = 1/7 ≈ 0.143
P("don't" | negative) = 1/7 ≈ 0.143
P("recommend" | negative) = 1/7 ≈ 0.143
```

### Step 2: Classify New Text

New review: "great really recommend"

```
P(positive | text) ∝ P(positive) × P("great"|pos) × P("really"|pos) × P("recommend"|pos)
                   = 0.5 × 0.167 × 0.167 × 0.167
                   ≈ 0.00232

P(negative | text) ∝ P(negative) × P("great"|neg) × P("really"|neg) × P("recommend"|neg)
                   = 0.5 × 0.001 × 0.001 × 0.143  # Smoothing for unknown words
                   ≈ 0.0000000715
```

**Result:** The review is positive with very high probability!

## Conclusion: Probabilities as the Foundation of Intelligent AI

Probabilities enable AI to:

1. **Model uncertainty:** The real world is full of uncertainty, and probabilities provide a mathematical way to represent it

2. **Learn from experience:** Through Bayesian updating, models can improve their predictions with each new observation

3. **Make optimal decisions:** By considering probabilities of different outcomes and their consequences

4. **Generate diversity:** Randomness helps create creative and unexpected results

From simple spam filters to complex language models – probabilities are the foundation on which AI's ability to understand and interact with the complex, unpredictable world is built.

> **💡 Key idea:** AI doesn't need absolute certainty to make useful decisions. It's enough to be able to correctly estimate and update probabilities!