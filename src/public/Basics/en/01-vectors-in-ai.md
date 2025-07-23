# Lecture 1: Vectors – The Language of Artificial Intelligence 🤖

Imagine we need to "explain" to a computer how concepts like "sunny day" and "warm weather" are similar, or how to distinguish tea from coffee. Vectors serve as the universal language of numbers that describes object characteristics for their further mathematical processing and machine understanding.

**Vector concept and its interpretations**

* **What is a vector?**
    * Simplest definition: **A vector is an ordered set of numbers.** These numbers are called its **components** or **coordinates**.
    * Usually written in square brackets, for example:
        * $v = [3, -1, 5]$ — this is a three-dimensional vector with components 3, -1, and 5
        * $u = [u_1, u_2, ..., u_n]$ — this is an n-dimensional vector
* **Geometric interpretation (for 2D and 3D):**
    * In the case of a plane or space (in other words, 2D and 3D), a vector can be imagined as a **directed segment** – that is, an arrow.
    * This arrow has two key characteristics:
        1. **Direction:** Where it points.
        2. **Magnitude (Length):** How long it is.
    * **Example:** Vector $a = [4, 2]$ on a plane can be depicted as an arrow that starts at point $(0,0)$ and ends at point $(4,2)$. It shows movement of 4 units along the X-axis and 2 units along the Y-axis.
        
    * **Important:** A vector is defined precisely by direction and length, not by the starting point. An arrow from $(1,1)$ to $(5,3)$ represents the same vector $a = [4, 2]$, because the displacement along X is $5-1=4$, and along Y is $3-1=2$.
* **Interpretation in AI (Why this is important for us):**
    * In AI, vectors are used to represent **features** of objects in numerical form. The vector dimension (number of components) corresponds to the number of features we consider.

Imagine a point on a map. To determine its position, you need two coordinates: latitude and longitude. For example, $[49.83, 24.02]$ are the coordinates of Lviv. This is a two-dimensional vector.

Now imagine we want to describe not a point on a map, but some object, for example, a cat. What are its characteristics?

* **Weight (kg):** $4.5$  
* **Length (cm):** $46$  
* **Fluffiness level (from 0 to 1):** $0.9$  
* **Danger level (from 0 to 1):** $0.2$

By collecting these numbers into one ordered list, we get a vector that describes this cat:

$$\text{Cat Vector} = [4.5, 46, 0.9, 0.2]$$

In summary, **a vector is an ordered list of numbers** that describes some object or point in space. Each number in it is a **component** or coordinate along a certain "dimension" (weight, length, fluffiness, etc.). The number of numbers in a vector is called its **dimensionality**.

## Operations on Vectors

This is where the magic begins. By performing simple mathematical operations on vectors, AI can find complex dependencies in data.

### Scalar Multiplication

A **scalar** is simply one number (not a vector). Multiplying a vector by a scalar means multiplying each component of the vector by this number. This allows you to "scale" a vector – make it "stronger" or "weaker", "bigger" or "smaller".

#### **Example 1: Adjusting image brightness 🎨**

Each pixel on a color screen can be represented as a vector of three components: $[R, G, B]$ (red, green, blue), where values typically range from 0 to 255. Let's say we have a dark purple color with vector:

$$V = [60, 0, 80]$$

To make the color twice as bright, we multiply the vector by scalar $c = 2$:

$$\text{New } V = 2 \times [60, 0, 80] = [120, 0, 160]$$

We get a much brighter purple. Similarly, by multiplying by scalar 0.5, we would make the image darker. This is exactly how brightness sliders work in photo editors.

#### **Example 2: Changing serving portions in a recipe 🍰**

Imagine a cake recipe for 4 servings represented as an ingredient vector:

$$\text{Recipe 4 servings} = [500, 200, 4, 150]$$
$$(\text{flour (g), sugar (g), eggs (pcs), milk (ml)})$$

You want to bake a cake for 6 people. You need to scale the recipe:

$$\text{Coefficient (scalar)} = \frac{6}{4} = 1.5$$

$$\text{Recipe 6 servings} = 1.5 \times [500, 200, 4, 150] = [750, 300, 6, 225]$$

Now you have exact proportions for six servings.

### Vector Addition and Subtraction

These operations are only possible for vectors of the same dimensionality and are performed component-wise.

* **Vector Addition:**
    * **Rule:** To add two vectors of the same dimensionality, you simply **add their corresponding components**.
    * **Formula:** For vectors $a = [a_1, a_2, ..., a_n]$ and $b = [b_1, b_2, ..., b_n]$:
        $$a + b = [a_1 + b_1, a_2 + b_2, ..., a_n + b_n]$$
    * **Example (2D):** Let $a = [1, 3]$ (1 step right, 3 up) and $b = [4, -1]$ (4 steps right, 1 down). Then:
        $$a + b = [1+4, 3+(-1)] = [5, 2]$$
    * **Geometrically:** This is like performing two movements sequentially. If you place the beginning of vector `b` at the end of vector `a`, then the sum vector `a+b` connects the beginning of `a` with the end of `b`. Or you can use the "parallelogram rule".
    * **In AI:** Addition can mean combining features. For example, if a vector represents a set of skills, then the sum of vectors of two people can (conditionally) represent their combined skills.

![Vector Addition](https://github.com/aisics/department-of-aisics/blob/main/assets/Basics/vector-plus.png?raw=true)

* **Vector Subtraction:**
    * **Rule:** Similar to addition, **subtract corresponding components**.
    * **Formula:**
        $$a - b = [a_1 - b_1, a_2 - b_2, ..., a_n - b_n]$$
    * **Example (2D):** For the same $a = [1, 3]$ and $b = [4, -1]$:
        $$a - b = [1-4, 3-(-1)] = [-3, 4]$$
    * **Geometrically:** Vector `a - b` is the vector that needs to be added to `b` to get `a`. It points from the end of vector `b` to the end of vector `a` (if they start from the same point).
    * **In AI:** Subtraction is often used to find **differences** or **direction of changes** between two states or objects.

![Vector Subtraction](https://github.com/aisics/department-of-aisics/blob/main/assets/Basics/vector-minus.png?raw=true)

#### **Example "King - Man + Woman = Queen" 👑**

This is a classic example from language processing that demonstrates how vector operations capture semantic relationships.

* **Step 1: Building vectors.** An AI model analyzes huge texts (say Wikipedia) and creates vectors for words based on their context. Words used in similar contexts get similar vectors. For illustration, let's imagine a simplified 3-dimensional "meaning space": `[Royal power, Male gender, Female gender]`.

* **Step 2: Approximate vectors.**

  $$\text{Vector}("\text{King}")  ≈ [0.95, 0.85, 0.0]$$
  $$(\text{high royal power, strong association with male gender})$$
  
  $$\text{Vector}("\text{Man}")   ≈ [0.10, 0.90, 0.0]$$
  $$(\text{low royal power, very strong association with male gender})$$
  
  $$\text{Vector}("\text{Woman}") ≈ [0.10, 0.00, 0.9]$$
  $$(\text{low royal power, strong association with female gender})$$

* **Step 3: Operation.**

  $$\text{Result} = \text{Vector}("\text{King}") - \text{Vector}("\text{Man}") + \text{Vector}("\text{Woman}")$$
  
  $$= [0.95, 0.85, 0.0] - [0.10, 0.90, 0.0] + [0.10, 0.00, 0.9]$$
  
  $$= [0.95, -0.05, 0.9]$$

* **Step 4: Finding the closest word.** AI searches in its "library" for a word whose vector is closest to the obtained result: $[0.95, -0.05, 0.9]$. This vector has high "royal power", almost zero "male gender" and high "female gender". The best candidate turns out to be **"Queen"**.

## Vector Similarity: Dot Product and Cosine Similarity

This is probably the most important concept for AI. How do you determine how similar two objects (two vectors) are? For example, how similar is the text of your search query to the content of a web page?

Here **dot product** comes to our aid, but not by itself, but as part of **cosine similarity**.

> **🎯 Idea:** Vector similarity is not about their length, but about their **direction**. If two vectors point in the same direction, they are very similar. If they are perpendicular – they are not similar at all.

Cosine similarity measures the cosine of the angle between two vectors and always gives a result from -1 to 1:

* **1**: Vectors point in the same direction (maximum similarity).  
* **0**: Vectors are perpendicular (no similarity).  
* **-1**: Vectors point in opposite directions (maximum opposition).

The formula looks like this:

$$\text{Similarity}(A,B) = \cos(\theta) = \frac{A \cdot B}{||A|| \times ||B||}$$

**Where:**

* $A \cdot B$ is the **dot product** of vectors A and B (sum of pairwise products of their components).  
* $||A||$ and $||B||$ are the **lengths (norms)** of vectors A and B. 

**The length of vector** $[x, y, z]$ is calculated as:
$$||V|| = \sqrt{x² + y² + z²}$$

### **Real example: Movie recommendation system 🎬**

Imagine Netflix wants to recommend a movie to you. It represents your preferences and other users' preferences as vectors. For simplicity, let's take only 3 movies: "Dune", "Barbie", "Oppenheimer". Your ratings (from 1 to 5) are your vector.

$$\text{Your Vector}  = [5, 1, 4]  \text{  # You love "Dune" and "Oppenheimer", but not "Barbie"}$$
$$\text{Anna Vector}  = [4, 2, 5]  \text{  # Likes "Dune", loves "Oppenheimer", but not very excited about "Barbie"}$$
$$\text{Peter Vector} = [2, 5, 1]  \text{  # Loves "Barbie", doesn't like "Dune" and "Oppenheimer"}$$

**Let's find who is "closer" to you – Anna or Peter?**

#### 1. Similarity between you and Anna:

**Dot product:**
$$A \cdot B = (5 \times 4) + (1 \times 2) + (4 \times 5) = 20 + 2 + 20 = 42$$

**Vector lengths:**
$$||\text{Your}|| = \sqrt{5² + 1² + 4²} = \sqrt{25 + 1 + 16} = \sqrt{42} ≈ 6.48$$
$$||\text{Anna}|| = \sqrt{4² + 2² + 5²} = \sqrt{16 + 4 + 25} = \sqrt{45} ≈ 6.71$$

**Cosine similarity:**
$$\cos(\theta) = \frac{42}{6.48 \times 6.71} ≈ \frac{42}{43.48} ≈ 0.97$$

> **✨ This number is very close to 1. Your tastes are very similar!**

#### 2. Similarity between you and Peter:

**Dot product:**
$$A \cdot B = (5 \times 2) + (1 \times 5) + (4 \times 1) = 10 + 5 + 4 = 19$$

**Vector lengths:**
$$||\text{Your}||  ≈ 6.48  \text{  (already calculated)}$$
$$||\text{Peter}|| = \sqrt{2² + 5² + 1²} = \sqrt{4 + 25 + 1} = \sqrt{30} ≈ 5.48$$

**Cosine similarity:**
$$\cos(\theta) = \frac{19}{6.48 \times 5.48} ≈ \frac{19}{35.51} ≈ 0.53$$

> **⚠ This number is significantly smaller. Your tastes are not very similar.**

**Conclusion:** Since your similarity with Anna (0.97) is much higher than with Peter (0.53), the system will likely recommend a movie that Anna liked but you haven't seen yet.

## Vector Normalization: Bringing to a Common Denominator

We already saw that to calculate cosine similarity we divide by vector lengths. This process of "removing" length has its name – **normalization**.

### What is normalization?

Normalization is the process of transforming a vector so that its length (norm) equals **1**, but its direction remains unchanged. The result is called a **unit vector**.

**Formula:**

$$\text{Normalized } V = \frac{V}{||V||}$$

That is, we simply divide each component of the vector by its length.

### What is this used for?

Normalization allows comparing vectors while ignoring their magnitude (scale). This is critically important when magnitude can be misleading.

#### **Example: Analyzing texts of different lengths 📄**

Imagine we want to determine how similar two documents are by topic, counting key words "AI" and "data" in them.

* **Document A (short news):** contains "AI" 10 times, "data" 5 times.
  $$\text{Vector A} = [10, 5]$$

* **Document B (long scientific article):** contains "AI" 100 times, "data" 50 times.
  $$\text{Vector B} = [100, 50]$$

Without normalization, Vector_B has a much greater length, and direct comparison would be incorrect. But intuitively we understand that both documents have the same ratio of keywords (2:1) and probably tell about the same thing. Let's check this using normalization.

#### 1. Normalize Vector_A:

**Length:**
$$||A|| = \sqrt{10² + 5²} = \sqrt{100 + 25} = \sqrt{125} ≈ 11.18$$

**Normalized vector:**
$$\text{Norm A} = \left[\frac{10}{11.18}, \frac{5}{11.18}\right] ≈ [0.894, 0.447]$$

#### 2. Normalize Vector_B:

**Length:**
$$||B|| = \sqrt{100² + 50²} = \sqrt{10000 + 2500} = \sqrt{12500} ≈ 111.8$$

**Normalized vector:**
$$\text{Norm B} = \left[\frac{100}{111.8}, \frac{50}{111.8}\right] ≈ [0.894, 0.447]$$

> **📊 Conclusion:** After normalization we got **identical** vectors!
> 
> $$\text{Norm A} = \text{Norm B} = [0.894, 0.447]$$
> 
> This proves that both documents have the same "direction" (topic), despite the huge difference in length. Cosine similarity = 1.0 ✨

This is exactly how, using simple geometry and arithmetic, search engines, recommendation systems and many other AI tools work. They convert data into vectors and look for similarity between them.