---
title: "Matrix - and it's not about the movie"
description: "What matrices are, operations on them, and their critical importance for AI and machine learning"
author: "Department of AIsics"
date: 2025-07-24
readingTime: 20
tags: ["matrices", "linear-algebra", "machine-learning", "neural-networks", "mathematics"]
featured: true
difficulty: "intermediate"
category: "Basics"
prerequisites: []
relatedArticles: []
---

# Lecture 2: Matrices – Data Organizers in the AI World 📊

Remember our cat vector **[4.5, 46, 0.9, 0.2]** from the last lecture? But what if we have not just one cat, but a whole bunch? Or not just a photo, but a video with thousands of frames? Or not just one characteristic, but a complex network of connections between neurons?

This is where **matrices** come into play – a powerful tool for organizing and processing huge amounts of structured data. If vectors are lists of numbers, then matrices are **tables of numbers** that can store and process many vectors simultaneously.

## What is a Matrix? 🧩

### Formal Definition

A **matrix** is a rectangular table of numbers (called **elements**), organized into **m rows** and **n columns**. A matrix of size m×n is often denoted by a capital letter, for example **A**:

$$
A = \begin{pmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{pmatrix}
$$

Where $a_{ij}$ is the element of the matrix in the i-th row and j-th column.

### Connection with Vectors 🔗

A matrix is essentially a **collection of vectors**! It can be viewed as:
- **A set of row vectors**: each row is a separate vector
- **A set of column vectors**: each column is a separate vector

For example, a 3×4 matrix contains:
- 3 row vectors of dimension 4
- 4 column vectors of dimension 3

### Notation and Terminology 📝

**Basic notation:**
- **Matrix size**: m×n (m rows, n columns)
- **Matrix element**: $a_{ij}$ or $A_{ij}$ – element in i-th row, j-th column
- **i-th row**: $A_{i*}$ = $[a_{i1}, a_{i2}, ..., a_{in}]$
- **j-th column**: $A_{*j}$ = $[a_{1j}, a_{2j}, ..., a_{mj}]^T$

**Important terms:**
- **Main diagonal**: elements $a_{11}, a_{22}, ..., a_{kk}$ (where k = min(m,n))
- **Trace of matrix**: sum of main diagonal elements (for square matrices)
- **Matrix order**: for a square matrix n×n, order = n

### **Example 1: Cat Database 🐱**

Imagine you're an animal shelter owner keeping a database of your cats:

Cat database:

$$
\begin{pmatrix}
4.5 & 46 & 0.9 & 0.2 \\
3.2 & 38 & 0.7 & 0.8 \\
5.1 & 52 & 1.0 & 0.1 \\
2.8 & 35 & 0.4 & 0.9
\end{pmatrix}
$$

Here each row is one cat, and each column is a characteristic:
- **Column 1:** Weight (kg)
- **Column 2:** Length (cm)  
- **Column 3:** Fluffiness (0-1)
- **Column 4:** Danger level (0-1)

**Matrix size:** 4 × 4 (4 rows, 4 columns)
**Element a₂₃ = 0.7** – this is the fluffiness of the second cat

### **Example 2: Black and White Image 📷**

Every digital image is essentially a matrix! Let's consider a tiny 5×5 pixel image, where 0 = black, 1 = white:

Image matrix:

$$
\begin{pmatrix}
0 & 0 & 1 & 0 & 0 \\
0 & 1 & 1 & 1 & 0 \\
1 & 1 & 1 & 1 & 1 \\
0 & 1 & 1 & 1 & 0 \\
0 & 0 & 1 & 0 & 0
\end{pmatrix}
$$

This is an image of a cross! Each matrix element represents the brightness of one pixel.

## Basic Matrix Operations

### **Matrix Addition and Subtraction ➕➖**

You can only add/subtract matrices of the **same size**. The operation is performed element-wise.

#### **Example: Change in Cat Moods After Lunch 😸**

**Before lunch:**

$$
\begin{pmatrix}
0.3 & 0.5 \\
0.2 & 0.4
\end{pmatrix}
$$

**Improvement after lunch:**

$$
\begin{pmatrix}
0.4 & 0.3 \\
0.5 & 0.2
\end{pmatrix}
$$

**Mood after lunch:**

$$
\begin{pmatrix}
0.3 & 0.5 \\
0.2 & 0.4
\end{pmatrix} + \begin{pmatrix}
0.4 & 0.3 \\
0.5 & 0.2
\end{pmatrix} = \begin{pmatrix}
0.7 & 0.8 \\
0.7 & 0.6
\end{pmatrix}
$$

All cats became happier! 🎉

### **Scalar Multiplication ✖️**

Just like with vectors – multiply each element by the number.

#### **Example: Doubling Food Portions 🍽️**

If the vet recommends doubling portions:

$$
2 \times \begin{pmatrix}
100 & 150 \\
80 & 120
\end{pmatrix} = \begin{pmatrix}
200 & 300 \\
160 & 240
\end{pmatrix}
$$

Each cat will get twice as much food!

### **Matrix Multiplication – The Most Important Operation! 🔥**

This is the most complex but most powerful operation in linear algebra. It underlies all computations in neural networks!

#### When Can We Multiply Matrices?

Matrix **A** of size **m×k** can be multiplied by matrix **B** of size **k×n** only if:
- **Number of columns in A = Number of rows in B** (i.e., inner dimensions match)
- The result will be matrix **C** of size **m×n** (outer dimensions)

$$
\underbrace{A}_{m \times k} \times \underbrace{B}_{k \times n} = \underbrace{C}_{m \times n}
$$

#### How is Multiplication Computed?

**Rule:** Element $c_{ij}$ of the result is computed as the **dot product** of the i-th row of matrix A and the j-th column of matrix B:

$$
c_{ij} = \sum_{l=1}^{k} a_{il} \cdot b_{lj} = a_{i1}b_{1j} + a_{i2}b_{2j} + ... + a_{ik}b_{kj}
$$

#### Why is This Important for AI?

Matrix multiplication allows us to:
- **Transform data**: convert feature vectors into new spaces
- **Combine information**: merge multiple inputs into one output
- **Parallelize computations**: process lots of data simultaneously on GPUs

#### **Example: Calculating Calories for Cats 🥩**

**Matrix A** – how much food each cat eats (grams):
$$
A = \begin{pmatrix}
150 & 50 \\
200 & 30 \\
100 & 80
\end{pmatrix}
$$
(Rows: cats, Columns: meat, fish)

**Matrix B** – caloric content of products (cal/gram):
$$
B = \begin{pmatrix}
3.5 \\
2.8
\end{pmatrix}
$$
(Rows: meat, fish)

**Result C** – total calories for each cat:
$$
C = A \times B = \begin{pmatrix}
150 & 50 \\
200 & 30 \\
100 & 80
\end{pmatrix} \times \begin{pmatrix}
3.5 \\
2.8
\end{pmatrix}
$$

Calculation:
- Cat 1: $(150 \times 3.5) + (50 \times 2.8) = 525 + 140 = 665$ calories
- Cat 2: $(200 \times 3.5) + (30 \times 2.8) = 700 + 84 = 784$ calories  
- Cat 3: $(100 \times 3.5) + (80 \times 2.8) = 350 + 224 = 574$ calories

$$
C = \begin{pmatrix}
665 \\
784 \\
574
\end{pmatrix}
$$

### **Matrix Transpose 🔄**

**Transposition** is "flipping" a matrix: rows become columns, and columns become rows. Denoted as $A^T$.

#### **Example: Viewing Data from Different Angles 📈**

If we have weekly food sales data (Monday, Tuesday, Wednesday):

Sales matrix:

$$
\begin{pmatrix}
150 & 200 & 100 \\
180 & 220 & 120 \\
160 & 250 & 90
\end{pmatrix}
$$
(Rows: days of the week, Columns: stores A, B, C)

**What we see from this matrix:**
- **Monday**: Store B sold the most (200), store C – the least (100)
- **Tuesday**: Store B leads again (220)
- **Wednesday**: Store B set the week's record (250)!

After transposition:

$$
\begin{pmatrix}
150 & 180 & 160 \\
200 & 220 & 250 \\
100 & 120 & 90
\end{pmatrix}
$$
(Rows: stores A, B, C, Columns: days of the week)

**Now analysis is simpler:**
- **Store A**: Sales are stable (150→180→160), total = 490
- **Store B**: Sales are growing! (200→220→250), total = 670 🏆
- **Store C**: Weakest sales (100→120→90), total = 310

**Conclusion:** Store B is the clear sales leader, worth studying their methods!

## Properties of Matrix Operations 🔧

Matrix operations have important properties used in AI:

### Multiplication Properties:
- **NOT commutative**: $A \times B ≠ B \times A$ (in general)
- **Associative**: $(A \times B) \times C = A \times (B \times C)$
- **Distributive**: $A \times (B + C) = A \times B + A \times C$

### Transpose Properties:
- $(A^T)^T = A$ (double transpose returns the original)
- $(A + B)^T = A^T + B^T$
- $(A \times B)^T = B^T \times A^T$ (note the order change!)
- $(cA)^T = cA^T$ (where c is a scalar)

## Special Types of Matrices 🎯

### **Square Matrix**
A matrix where the number of rows = number of columns (n×n). Only square matrices can have:
- Determinant
- Inverse matrix
- Eigenvalues and eigenvectors

### **Diagonal Matrix**
All elements outside the main diagonal are zero:
$$
D = \begin{pmatrix}
5 & 0 & 0 \\
0 & 3 & 0 \\
0 & 0 & 7
\end{pmatrix}
$$

**Why important:** Multiplication by a diagonal matrix is scaling each coordinate separately. Used in AI for data normalization.

### **Identity Matrix (I)**
Diagonal matrix with ones on the diagonal – the "neutral element" for multiplication:
$$
I = \begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{pmatrix}
$$

For any matrix A: $A \times I = I \times A = A$

**Why important:** Plays the role of "1" for matrices. Used in neural network initialization.

### **Symmetric Matrix**
A matrix that equals its transpose ($A = A^T$):
$$
S = \begin{pmatrix}
4 & 2 & -1 \\
2 & 5 & 3 \\
-1 & 3 & 6
\end{pmatrix}
$$

**Why important:** Correlation and covariance matrices are always symmetric. They have guaranteed real eigenvalues.

### **Orthogonal Matrix**
A matrix for which $Q^T \times Q = Q \times Q^T = I$ (transpose = inverse):

**Properties:**
- Preserves vector lengths
- Preserves angles between vectors
- Represents rotation or reflection

**Why important:** Used in PCA (Principal Component Analysis) and for image rotations.

## Determinant – The "Magic Number" of a Matrix 🔮

The **determinant** is a special number that can be computed for a square matrix. It tells us about important properties of the matrix.

### Geometric Meaning of Determinant 📐

The determinant shows how a matrix changes areas/volumes:
- **|det| > 1**: matrix increases areas
- **|det| < 1**: matrix decreases areas
- **det = 0**: matrix "flattens" space (dimension loss)
- **det < 0**: matrix changes orientation (mirror reflection)

### **For a 2×2 matrix:**
$$
\det\begin{pmatrix}
a & b \\
c & d
\end{pmatrix} = ad - bc
$$

#### **Example: Area of a Parallelogram 📐**

Two vectors form a parallelogram. Its area = |determinant|:

Vector matrix:

$$
\begin{pmatrix}
3 & 1 \\
2 & 4
\end{pmatrix}
$$

$$
\det = (3 \times 4) - (1 \times 2) = 12 - 2 = 10
$$

Area of the parallelogram = 10 square units!

### **For a 3×3 matrix:**
$$
\det\begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix} = aei + bfg + cdh - ceg - bdi - afh
$$

#### **Example: Does a System of Equations Have a Solution? 🤔**

Imagine you need to find prices for three types of cat food (x, y, z), knowing the cost of different combinations:

**System of equations:**
- 2 packs of food A + 1 pack of food B = 100 UAH
- 1 pack of food A with discount (-1×A) + 3 packs of food B + 4 packs of food C = 250 UAH  
- 5 packs of food B - 2 packs of food C = 150 UAH

**Mathematically written as:**
$$
\begin{cases}
2x + 1y + 0z = 100 \\
-1x + 3y + 4z = 250 \\
0x + 5y - 2z = 150
\end{cases}
$$

**In matrix form: Ax = b**

$$
\underbrace{\begin{pmatrix}
2 & 1 & 0 \\
-1 & 3 & 4 \\
0 & 5 & -2
\end{pmatrix}}_{A} \times 
\underbrace{\begin{pmatrix}
x \\
y \\
z
\end{pmatrix}}_{\vec{x}} = 
\underbrace{\begin{pmatrix}
100 \\
250 \\
150
\end{pmatrix}}_{\vec{b}}
$$

**Checking via determinant:**

$$\det(A) = (2)(3)(-2) + (1)(4)(0) + (0)(-1)(5) - (0)(3)(0) - (1)(-1)(-2) - (2)(4)(5)$$
$$= -12 + 0 + 0 - 0 - 2 - 40 = -54$$

Since $\det(A) = -54$ ≠ $0$:
- ✅ The system has a **unique solution**
- ✅ We can find exact prices for each food
- ✅ Matrix A has an inverse matrix

**If determinant = 0:**
- ❌ System might have no solution (contradictory conditions)
- ❌ Or have infinitely many solutions (insufficient information)


## Practical Tips and Common Mistakes 💡

### Tips for Working with Matrices:

1. **Always check dimensions**: Before multiplying matrices, ensure inner dimensions match
2. **Use libraries**: Don't reinvent the wheel, use proven tools
3. **Think about efficiency**: Order of matrix multiplication affects speed: $(A \times B) \times C$ can be much faster than $A \times (B \times C)$

### Common Beginner Mistakes:

- ❌ **Confusing rows and columns** when indexing
- ❌ **Forgetting about non-commutativity** of multiplication
- ❌ **Ignoring numerical stability** (very small/large numbers)
- ❌ **Not using vectorized operations** (loops instead of matrix operations)

---

## Summary 🎯

**Matrices** are the foundation of modern AI:
- ✅ **Universal data structure** for organizing information
- ✅ **Powerful mathematical operations** for data transformation
- ✅ **Efficient implementation** on modern hardware
- ✅ **Intuitive geometric interpretation** for understanding

### Key Concepts to Remember:

1. **Matrix = table of numbers = collection of vectors**
2. **Matrix multiplication = composition of transformations**
3. **Determinant = measure of area/volume change**
4. **Special matrices have special properties**