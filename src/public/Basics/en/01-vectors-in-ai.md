### Lecture 1: Vectors – The Language of Artificial Intelligence 🤖

Hello! Today we're laying the foundation for understanding artificial intelligence, and this foundation is vectors. Forget complex algorithms for a moment. At the core of almost everything modern AI does lies a simple idea of a vector.

#### What is a vector?

Imagine a point on a map. To determine its position, you need two coordinates: latitude and longitude. For example, [49.83, 24.02] are the coordinates of Lviv. This is a two-dimensional vector.

Now imagine we want to describe not a point on a map, but some object, for example, a cat. What are its characteristics?

* Weight (kg): 4.5  
* Length (cm): 46  
* Fluffiness level (from 0 to 1): 0.9  
* Danger level (from 0 to 1): 0.2

By collecting these numbers into one ordered list, we get a vector that describes this cat: [4.5, 46, 0.9, 0.2].

So, **a vector is an ordered list of numbers** that describes some object or point in space. Each number in it is a **component** or coordinate along a certain "dimension" (weight, length, fluffiness, etc.). The number of numbers in a vector is called its **dimensionality**.

**Key idea:** Vectors translate any information – images, sound, text, statistical data – into a numerical format that a computer can process.

### Operations on Vectors

This is where the magic begins. By performing simple mathematical operations on vectors, AI can find complex dependencies in data.

#### Scalar Multiplication

A **scalar** is simply one number (not a vector). Multiplying a vector by a scalar means multiplying each component of the vector by this number. This allows you to "scale" a vector – make it "stronger" or "weaker", "bigger" or "smaller".

**Example 1: Adjusting image brightness 🎨**

Each pixel on a color screen can be represented as a vector of three components: [R, G, B] (red, green, blue), where values typically range from 0 to 255. Let's say we have a dark purple color with vector V = [60, 0, 80].

To make the color twice as bright, we multiply the vector by scalar c = 2:  
New_V = 2 * [60, 0, 80] = [120, 0, 160]  
We get a much brighter purple. Similarly, by multiplying by scalar 0.5, we would make the image darker. This is exactly how brightness sliders work in photo editors.

**Example 2: Changing serving portions in a recipe 🍰**

Imagine a cake recipe for 4 servings represented as an ingredient vector:  
Recipe_4_servings = [500, 200, 4, 150] (flour (g), sugar (g), eggs (pcs), milk (ml))  
You want to bake a cake for 6 people. You need to scale the recipe. The coefficient (scalar) will be 6 / 4 = 1.5.  
Recipe_6_servings = 1.5 * [500, 200, 4, 150] = [750, 300, 6, 225]  
Now you have exact proportions for six servings.

#### Vector Addition and Subtraction

These operations are only possible for vectors of the same dimensionality and are performed component-wise.

**Example "King - Man + Woman = Queen" 👑**

This is a classic example from language processing that demonstrates how vector operations capture semantic relationships.

* **Step 1: Building vectors.** An AI model (e.g., Word2Vec) analyzes huge texts (like Wikipedia) and creates vectors for words based on their context. Words used in similar contexts get similar vectors. For illustration, let's imagine a simplified 4-dimensional "meaning space": [Royal power, Male gender, Female gender, General authority].  
* **Step 2: Approximate vectors.**  
  * Vector("King") ≈ [0.95, 0.85, 0.0, 0.9] (high royal power, strong association with male gender)  
  * Vector("Man") ≈ [0.10, 0.90, 0.0, 0.4] (low royal power, very strong association with male gender)  
  * Vector("Woman") ≈ [0.10, 0.00, 0.9, 0.35] (low royal power, strong association with female gender)  
* Step 3: Operation.  
  Result = Vector("King") - Vector("Man") + Vector("Woman")  
  [0.95, 0.85, 0.0, 0.9] - [0.10, 0.90, 0.0, 0.4] + [0.10, 0.00, 0.9, 0.35] = [0.95, -0.05, 0.9, 0.85]  
* **Step 4: Finding the closest word.** AI searches in its "library" for a word whose vector is closest to the obtained result [0.95, -0.05, 0.9, 0.85]. This vector has high "royal power", almost zero "male gender" and high "female gender". The best candidate turns out to be **"Queen"**.

### Vector Similarity: Dot Product and Cosine Similarity

This is probably the most important concept for AI. How do you determine how similar two objects (two vectors) are? For example, how similar is the text of your search query to the content of a web page?

Here **dot product** comes to our aid, but not by itself, but as part of **cosine similarity**.

**Idea:** Vector similarity is not about their length (pixel brightness, number of ingredients), but about their **direction**. If two vectors point in the same direction, they are very similar. If they are perpendicular – they are not similar at all.

Cosine similarity measures the cosine of the angle between two vectors and always gives a result from -1 to 1:

* **1**: Vectors point in the same direction (maximum similarity).  
* **0**: Vectors are perpendicular (no similarity).  
* **-1**: Vectors point in opposite directions (maximum opposition).

The formula looks like this:

Similarity(A,B) = cos(θ) = (A⋅B) / (‖A‖‖B‖)

Where:

* A⋅B is the **dot product** of vectors A and B (sum of pairwise products of their components).  
* ‖A‖ and ‖B‖ are the **lengths (norms)** of vectors A and B. The length of vector [x, y, z] is calculated as √(x²+y²+z²).

**Real example: Movie recommendation system 🎬**

Imagine Netflix wants to recommend a movie to you. It represents your preferences and other users' preferences as vectors. For simplicity, let's take only 3 movies: "Dune", "Barbie", "Oppenheimer". Your ratings (from 1 to 5) are your vector.

* Your_Vector = [5, 1, 4] (You love "Dune" and "Oppenheimer", but not "Barbie").  
* Anna_Vector = [4, 2, 5] (Similar to your preferences).  
* Peter_Vector = [2, 5, 1] (Loves "Barbie", doesn't like "Dune" and "Oppenheimer").

**Let's find who is "closer" to you – Anna or Peter?**

**1. Similarity between you and Anna:**

* Dot product: (5 * 4) + (1 * 2) + (4 * 5) = 20 + 2 + 20 = 42.  
* Vector lengths:  
  * ||Your|| = √(5² + 1² + 4²) = √(25 + 1 + 16) = √42 ≈ 6.48  
  * ||Anna|| = √(4² + 2² + 5²) = √(16 + 4 + 25) = √45 ≈ 6.71  
* Cosine similarity: 42 / (6.48 * 6.71) ≈ 42 / 43.48 ≈ **0.97**  
  * This number is very close to 1. Your tastes are very similar!

**2. Similarity between you and Peter:**

* Dot product: (5 * 2) + (1 * 5) + (4 * 1) = 10 + 5 + 4 = 19.  
* Vector lengths:  
  * ||Your|| ≈ 6.48  
  * ||Peter|| = √(2² + 5² + 1²) = √(4 + 25 + 1) = √30 ≈ 5.48  
* Cosine similarity: 19 / (6.48 * 5.48) ≈ 19 / 35.51 ≈ **0.53**  
  * This number is significantly smaller. Your tastes are not very similar.

**Conclusion:** Since your similarity with Anna (0.97) is much higher than with Peter (0.53), the system will likely recommend a movie that Anna liked but you haven't seen yet.

### Vector Normalization: Bringing to a Common Denominator

We already saw that to calculate cosine similarity we divide by vector lengths. This process of "removing" length has its name – **normalization**.

**What is normalization?**

Normalization is the process of transforming a vector so that its length (norm) equals **1**, but its direction remains unchanged. The result is called a **unit vector**.

**Formula:**

Normalized_V = V / ‖V‖

That is, we simply divide each component of the vector by its length.

**What is this used for?**

Normalization allows comparing vectors while ignoring their magnitude (scale). This is critically important when magnitude can be misleading.

**Example: Analyzing texts of different lengths 📄**

Imagine we want to determine how similar two documents are by topic, counting key words "AI" and "data" in them.

* **Document A (short news):** contains "AI" 10 times, "data" 5 times. Vector_A = [10, 5]  
* **Document B (long scientific article):** contains "AI" 100 times, "data" 50 times. Vector_B = [100, 50]

Without normalization, Vector_B has a much greater length, and direct comparison would be incorrect. But intuitively we understand that both documents have the same ratio of keywords (2:1) and probably tell about the same thing. Let's check this using normalization.

**1. Normalize Vector_A:**

* Length: ||A|| = √(10² + 5²) = √(100 + 25) = √125 ≈ 11.18  
* Normalized vector: [10/11.18, 5/11.18] ≈ **[0.894, 0.447]**

**2. Normalize Vector_B:**

* Length: ||B|| = √(100² + 50²) = √(10000 + 2500) = √12500 ≈ 111.8  
* Normalized vector: [100/111.8, 50/111.8] ≈ **[0.894, 0.447]**

**Conclusion:** After normalization we got **identical** vectors! This proves that both documents have the same "direction" (topic), despite the huge difference in length. Now, if we calculate cosine similarity between them, it will equal 1, which perfectly reflects their thematic identity.

This is exactly how, using simple geometry and arithmetic, search engines, recommendation systems and many other AI tools work. They convert data into vectors and look for similarity between them.