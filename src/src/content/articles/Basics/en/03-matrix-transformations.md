---
title: "Matrix Transformations - Drawing a Mushroom"
description: "How matrices transform images: rotation, mirroring, color inversion and other transformations using pixel examples"
author: "Department of AIsics"
date: 2025-07-24
readingTime: 15
tags: ["matrices", "transformations", "image-processing", "visualization", "mathematics"]
featured: true
difficulty: "beginner"
category: "Basics"
prerequisites: ["vectors-in-ai", "matrixes-in-ai"]
relatedArticles: []
---

# Lecture 3: Matrix Transformations – The Magic of Data Transformation 🎨

In previous lectures, we learned that matrices can store data and perform operations on them. But the real magic begins when we use matrices to **transform** data. Today we'll draw a mushroom with numbers and learn how to transform it!

<div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
<strong>⚠️ Educational Simplification:</strong><br/>
All examples in this lecture are simplified for better understanding of concepts. Real image processing algorithms may be more complex. The 10×10 matrix is used only for clarity – real images have hundreds or thousands of pixels in each dimension. Visualizations and calculations may be approximate to maintain simplicity of explanation.
</div>

## Drawing a Mushroom with a Matrix 🍄

Imagine we have an image of a mushroom. An image is actually a matrix of pixels, where each has certain characteristics - in our case, we'll focus on color.

So, let's say we have the following color palette:
- **0** = black (⬛)
- **1** = dark gray (🔲)
- **2** = light gray (🔳)
- **3** = white (⬜)

Therefore, our mushroom as a 10×10 matrix with our palette would look like this:

$$
\text{Mushroom} = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 2 & 2 & 2 & 2 & 1 & 0 & 0 \\
0 & 1 & 2 & 3 & 3 & 3 & 3 & 2 & 1 & 0 \\
0 & 2 & 3 & 3 & 1 & 1 & 3 & 3 & 2 & 0 \\
0 & 2 & 3 & 1 & 3 & 3 & 1 & 3 & 2 & 0 \\
0 & 1 & 2 & 3 & 3 & 3 & 3 & 2 & 1 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Visualization:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛🔲🔳🔳🔳🔳🔲⬛⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛🔳⬜⬜🔲🔲⬜⬜🔳⬛<br/>
⬛🔳⬜🔲⬜⬜🔲⬜🔳⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛⬛🔲🔲⬛⬛⬛⬛
</div>

## Pattern Recognition – How AI "Sees" a Mushroom? 👁️

Before transforming images, let's understand how a computer recognizes that there's a mushroom in the picture. This is the foundation of computer vision!

### Reference Mushroom (what we're looking for):

$$
\text{Reference} = \begin{pmatrix}
0 & 0 & 1 & 1 & 1 & 1 & 1 & 1 & 0 & 0 \\
0 & 1 & 2 & 2 & 3 & 3 & 2 & 2 & 1 & 0 \\
1 & 2 & 3 & 3 & 3 & 3 & 3 & 3 & 2 & 1 \\
1 & 3 & 3 & 2 & 1 & 1 & 2 & 3 & 3 & 1 \\
1 & 2 & 3 & 3 & 3 & 3 & 3 & 3 & 2 & 1 \\
0 & 1 & 2 & 2 & 2 & 2 & 2 & 2 & 1 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 1 & 1 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

### Our Image (slightly different mushroom):

$$
\text{Our Mushroom} = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 2 & 2 & 2 & 2 & 1 & 0 & 0 \\
0 & 1 & 2 & 3 & 3 & 3 & 3 & 2 & 1 & 0 \\
0 & 2 & 3 & 3 & 1 & 1 & 3 & 3 & 2 & 0 \\
0 & 2 & 3 & 1 & 3 & 3 & 1 & 3 & 2 & 0 \\
0 & 1 & 2 & 3 & 3 & 3 & 3 & 2 & 1 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Visualizations for Comparison:**

<div style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">
  <div style="text-align: center;">
    <p style="margin-bottom: 0.5rem; font-weight: bold;">Reference:</p>
    <div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛🔲🔲🔲🔲🔲🔲⬛⬛<br/>
⬛🔲🔳🔳⬜⬜🔳🔳🔲⬛<br/>
🔲🔳⬜⬜⬜⬜⬜⬜🔳🔲<br/>
🔲⬜⬜🔳🔲🔲🔳⬜⬜🔲<br/>
🔲🔳⬜⬜⬜⬜⬜⬜🔳🔲<br/>
⬛🔲🔳🔳🔳🔳🔳🔳🔲⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔲🔲🔲⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
    </div>
  </div>
  <div style="text-align: center;">
    <p style="margin-bottom: 0.5rem; font-weight: bold;">Our Mushroom:</p>
    <div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛🔲🔳🔳🔳🔳🔲⬛⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛🔳⬜⬜🔲🔲⬜⬜🔳⬛<br/>
⬛🔳⬜🔲⬜⬜🔲⬜🔳⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛⬛🔲🔲⬛⬛⬛⬛
    </div>
  </div>
</div>

### How to Compare? Computing the Difference:

$$
\text{Difference} = |\text{Reference} - \text{Our Mushroom}|
$$

Where |...| means the absolute value of each element.

**Difference matrix:**

$$
\begin{pmatrix}
0 & 0 & 1 & 1 & 1 & 1 & 1 & 1 & 0 & 0 \\
0 & 1 & 1 & 0 & 1 & 1 & 0 & 1 & 1 & 0 \\
1 & 1 & 1 & 0 & 0 & 0 & 0 & 1 & 1 & 1 \\
1 & 1 & 0 & 0 & 0 & 0 & 1 & 0 & 1 & 1 \\
1 & 0 & 0 & 2 & 0 & 0 & 2 & 0 & 0 & 1 \\
0 & 0 & 0 & 1 & 1 & 1 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Visualization of the difference (lighter = bigger difference):**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛🔲🔲🔲🔲🔲🔲⬛⬛<br/>
⬛🔲🔲⬛🔲🔲⬛🔲🔲⬛<br/>
🔲🔲🔲⬛⬛⬛⬛🔲🔲🔲<br/>
🔲🔲⬛⬛⬛⬛🔲⬛🔲🔲<br/>
🔲⬛⬛🔳⬛⬛🔳⬛⬛🔲<br/>
⬛⬛⬛🔲🔲🔲🔲⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬛🔲🔲⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
</div>

### Similarity Score:

#### Step 1: Count the sum of all differences
Adding all numbers from the difference matrix:
- Row 1: 0+0+1+1+1+1+1+1+0+0 = **6**
- Row 2: 0+1+1+0+1+1+0+1+1+0 = **6**
- Row 3: 1+1+1+0+0+0+0+1+1+1 = **6**
- Row 4: 1+1+0+0+0+0+1+0+1+1 = **5**
- Row 5: 1+0+0+2+0+0+2+0+0+1 = **6**
- Row 6: 0+0+0+1+1+1+1+0+0+0 = **4**
- Rows 7-8: all zeros = **0**
- Row 9: 0+0+0+0+1+1+0+0+0+0 = **2**
- Row 10: all zeros = **0**

**Sum of all differences:** 6+6+6+5+6+4+0+0+2+0 = **28**

#### Step 2: Calculate the maximum possible difference
If our mushroom was completely opposite to the reference:
- Each pixel could differ by a maximum of 3 (from 0 to 3)
- We have 10×10 = 100 pixels
- Maximum difference: 100 × 3 = **300**

#### Step 3: Convert to similarity percentage
$$
\text{Similarity} = \frac{\text{Max. difference} - \text{Actual difference}}{\text{Max. difference}} \times 100\%
$$

$$
\text{Similarity} = \frac{300 - 28}{300} \times 100\% = \frac{272}{300} \times 100\% = 90.7\%
$$

<div style="background: linear-gradient(to right, #10b981, #3b82f6); padding: 2px; border-radius: 8px; margin: 1rem 0;">
<div style="background: white; padding: 1rem; border-radius: 6px;">
<strong>Conclusion:</strong> With 90.7% similarity, this is indeed a mushroom! 🎉<br/>
AI considers the image a mushroom if similarity > 85%
</div>
</div>

### Where are the biggest differences?

Looking at the difference matrix, we see:
- **Cap is wider** in the reference (top row)
- **Spots on the cap** are positioned differently (value 2 in row 5)
- **Stem is shorter** in our mushroom (difference in the last row)

This is exactly how pattern recognition algorithms work – by comparing pixel matrices!

## Color Inversion – Image Negative 🔄

To create a negative, we subtract each value from the maximum (3):

$$
\text{Negative} = 3 - \text{Mushroom}
$$

For each pixel: if it was black (0), it becomes white (3), and vice versa.

**Visualization of the inverted mushroom:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br/>
⬜⬜🔳🔲🔲🔲🔲🔳⬜⬜<br/>
⬜🔳🔲⬛⬛⬛⬛🔲🔳⬜<br/>
⬜🔲⬛⬛🔳🔳⬛⬛🔲⬜<br/>
⬜🔲⬛🔳⬛⬛🔳⬛🔲⬜<br/>
⬜🔳🔲⬛⬛⬛⬛🔲🔳⬜<br/>
⬜⬜⬜🔳🔲🔲🔳⬜⬜⬜<br/>
⬜⬜⬜🔳🔲🔲🔳⬜⬜⬜<br/>
⬜⬜⬜🔳🔲🔲🔳⬜⬜⬜<br/>
⬜⬜⬜⬜🔳🔳⬜⬜⬜⬜
</div>

Now our mushroom glows on a dark background! ✨

## Horizontal Mirroring 🪞

For horizontal mirroring, we simply reverse the order of columns:

$$
\text{Mirror} = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 2 & 2 & 2 & 2 & 1 & 0 & 0 \\
0 & 1 & 2 & 3 & 3 & 3 & 3 & 2 & 1 & 0 \\
0 & 2 & 3 & 3 & 1 & 1 & 3 & 3 & 2 & 0 \\
0 & 2 & 3 & 1 & 3 & 3 & 1 & 3 & 2 & 0 \\
0 & 1 & 2 & 3 & 3 & 3 & 3 & 2 & 1 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 & 0 & 0
\end{pmatrix} \times P
$$

Where P is the permutation matrix that reverses column order:

$$
P = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Visualization of the mirrored mushroom:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛🔲🔳🔳🔳🔳🔲⬛⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛🔳⬜⬜🔲🔲⬜⬜🔳⬛<br/>
⬛🔳⬜🔲⬜⬜🔲⬜🔳⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
⬛⬛⬛⬛🔲🔲⬛⬛⬛⬛
</div>

The mushroom is looking the other way! (Though in this case it's symmetric)

## Image Part Extraction – Masking 🎭

Want to extract only the mushroom cap? We create a mask matrix:

### How to Build a Mask:
1. **Identify the cap area**: looking at the original mushroom, we see the cap occupies rows 1-6
2. **Put 1 where we want to keep the image**: in the cap area
3. **Put 0 where we want to remove the image**: in the stem area and surroundings

$$
\text{Cap Mask} = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 1 & 1 & 1 & 1 & 1 & 0 & 0 \\
0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 0 \\
0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 0 \\
0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 0 \\
0 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Element-wise multiplication** (Hadamard operation):

$$
\text{Cap} = \text{Mushroom} \odot \text{Mask}
$$

**Visualization of the extracted cap:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛🔲🔳🔳🔳🔳🔲⬛⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛🔳⬜⬜🔲🔲⬜⬜🔳⬛<br/>
⬛🔳⬜🔲⬜⬜🔲⬜🔳⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
</div>

Result – only the mushroom cap, the rest of the pixels are black!

### Alternative Approach – Through Subtraction:
If we had a separate stem matrix, we could achieve the same result through subtraction:

$$
\text{Cap} = \text{Mushroom} - \text{Stem}
$$

Where the stem matrix contains values only in the lower part (rows 7-10). This shows that in image processing there are often multiple ways to achieve the same result!

## 90-Degree Rotation 🔄

For 90° clockwise rotation:
1. Transpose the matrix (swap rows and columns)
2. Reverse each row (reverse the order of elements in each row)

**Step 1 - Transposition:**

When transposing, rows become columns:

$$
\text{Mushroom}^T = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 & 0 \\
0 & 1 & 2 & 3 & 3 & 2 & 0 & 0 & 0 & 0 \\
0 & 2 & 3 & 3 & 1 & 3 & 1 & 1 & 1 & 0 \\
0 & 2 & 3 & 1 & 3 & 3 & 2 & 2 & 2 & 1 \\
0 & 2 & 3 & 1 & 3 & 3 & 2 & 2 & 2 & 1 \\
0 & 2 & 3 & 3 & 1 & 3 & 1 & 1 & 1 & 0 \\
0 & 1 & 2 & 3 & 3 & 2 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Step 2 - Reverse Each Row:**

Now we reverse the order of elements in each row:

$$
\text{Mushroom}_{90°} = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 2 & 3 & 3 & 2 & 1 & 0 \\
0 & 1 & 1 & 1 & 3 & 1 & 3 & 3 & 2 & 0 \\
1 & 2 & 2 & 2 & 3 & 3 & 1 & 3 & 2 & 0 \\
1 & 2 & 2 & 2 & 3 & 3 & 1 & 3 & 2 & 0 \\
0 & 1 & 1 & 1 & 3 & 1 & 3 & 3 & 2 & 0 \\
0 & 0 & 0 & 0 & 2 & 3 & 3 & 2 & 1 & 0 \\
0 & 0 & 0 & 0 & 1 & 2 & 2 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

**Visualization of the 90° rotated mushroom:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬛🔲🔳🔳🔲⬛⬛<br/>
⬛⬛⬛⬛🔳⬜⬜🔳🔲⬛<br/>
⬛🔲🔲🔲⬜🔲⬜⬜🔳⬛<br/>
🔲🔳🔳🔳⬜⬜🔲⬜🔳⬛<br/>
🔲🔳🔳🔳⬜⬜🔲⬜🔳⬛<br/>
⬛🔲🔲🔲⬜🔲⬜⬜🔳⬛<br/>
⬛⬛⬛⬛🔳⬜⬜🔳🔲⬛<br/>
⬛⬛⬛⬛🔲🔳🔳🔲⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
</div>

Now our mushroom has rotated 90° clockwise – the stem points left and the cap points right!

## Brightness and Contrast Changes 🔆

### Brightness Increase:
$$
\text{Bright} = \min(3, \text{Mushroom} + 1)
$$

We add 1 to each pixel (but not more than the maximum of 3).

**Visualization of the brighter mushroom:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
🔲🔲🔲🔲🔲🔲🔲🔲🔲🔲<br/>
🔲🔲🔳⬜⬜⬜⬜🔳🔲🔲<br/>
🔲🔳⬜⬜⬜⬜⬜⬜🔳🔲<br/>
🔲⬜⬜⬜🔳🔳⬜⬜⬜🔲<br/>
🔲⬜⬜🔳⬜⬜🔳⬜⬜🔲<br/>
🔲🔳⬜⬜⬜⬜⬜⬜🔳🔲<br/>
🔲🔲🔲🔳⬜⬜🔳🔲🔲🔲<br/>
🔲🔲🔲🔳⬜⬜🔳🔲🔲🔲<br/>
🔲🔲🔲🔳⬜⬜🔳🔲🔲🔲<br/>
🔲🔲🔲🔲🔳🔳🔲🔲🔲🔲
</div>

### Contrast Increase:
$$
\text{Contrast} = \text{round}(1.5 \times (\text{Mushroom} - 1.5) + 1.5)
$$

**How it works:**
1. **Why 1.5?** It's the middle of our color range (0-3). Middle = (0+3)/2 = 1.5
2. **$(\text{Mushroom} - 1.5)$** – deviation from the middle:
   - If pixel = 0 (black): $0 - 1.5 = -1.5$
   - If pixel = 3 (white): $3 - 1.5 = +1.5$
3. **$\times 1.5$** – increase the deviation (contrast factor)
4. **$+ 1.5$** – shift back to original range
5. **$\text{round}()$** – rounding to nearest integer ($0.5 \rightarrow 1$, $1.4 \rightarrow 1$, $1.6 \rightarrow 2$)

**Examples:**
- Pixel = 0: $\text{round}(1.5 \times (0 - 1.5) + 1.5) = \text{round}(-2.25 + 1.5) = \text{round}(-0.75) = 0$
- Pixel = 1: $\text{round}(1.5 \times (1 - 1.5) + 1.5) = \text{round}(-0.75 + 1.5) = \text{round}(0.75) = 1$
- Pixel = 2: $\text{round}(1.5 \times (2 - 1.5) + 1.5) = \text{round}(0.75 + 1.5) = \text{round}(2.25) = 2$
- Pixel = 3: $\text{round}(1.5 \times (3 - 1.5) + 1.5) = \text{round}(2.25 + 1.5) = \text{round}(3.75) = 3$ (capped at maximum)

This stretches values from the middle, making dark pixels darker and light pixels lighter.

**Visualization of the high-contrast mushroom:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛⬛⬜⬜⬜⬜⬛⬛⬛<br/>
⬛⬛⬜⬜⬜⬜⬜⬜⬛⬛<br/>
⬛⬜⬜⬜⬛⬛⬜⬜⬜⬛<br/>
⬛⬜⬜⬛⬜⬜⬛⬜⬜⬛<br/>
⬛⬛⬜⬜⬜⬜⬜⬜⬛⬛<br/>
⬛⬛⬛⬛⬜⬜⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬜⬜⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬜⬜⬛⬛⬛⬛<br/>
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
</div>

## Image Composition – Adding Elements 🎨

Imagine we want to add grass under the mushroom:

### How to Create a Grass Matrix:
1. **Top 7 rows = 0**: no grass here, it's sky and space for the mushroom
2. **Row 8**: sparse grass blades (1 0 1 0 0 0 0 1 0 1) - individual stems
3. **Row 9**: denser grass (1 1 1 1 0 0 1 1 1 1) - more coverage but with gaps
4. **Row 10**: ground (2 2 2 2 2 2 2 2 2 2) - solid layer of light gray color

$$
\text{Grass} = \begin{pmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
1 & 0 & 1 & 0 & 0 & 0 & 0 & 1 & 0 & 1 \\
1 & 1 & 1 & 1 & 0 & 0 & 1 & 1 & 1 & 1 \\
2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2 & 2
\end{pmatrix}
$$

**Combining:**
$$
\text{Scene} = \max(\text{Mushroom}, \text{Grass})
$$

The `max` function takes the larger value for each pixel, so the grass doesn't "erase" the mushroom.

**Visualization of mushroom with grass:**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛<br/>
⬛⬛🔲🔳🔳🔳🔳🔲⬛⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛🔳⬜⬜🔲🔲⬜⬜🔳⬛<br/>
⬛🔳⬜🔲⬜⬜🔲⬜🔳⬛<br/>
⬛🔲🔳⬜⬜⬜⬜🔳🔲⬛<br/>
⬛⬛⬛🔲🔳🔳🔲⬛⬛⬛<br/>
🔲⬛🔲🔲🔳🔳🔲🔲⬛🔲<br/>
🔲🔲🔲🔲🔳🔳🔲🔲🔲🔲<br/>
🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳
</div>

## Blur Filters – Smoothing 🌫️

Filtering is the process of processing an image using a small matrix (kernel) that "slides" across the entire image.

### Box Blur Filter:

$$
\text{Filter} = \frac{1}{9} \begin{pmatrix}
1 & 1 & 1 \\
1 & 1 & 1 \\
1 & 1 & 1
\end{pmatrix}
$$

### How Filtering Works:

**Example for pixel at position (3,4) of our mushroom:**

1. **Select a 3×3 area around the pixel:**
   ```
   2 3 3    (values from mushroom matrix)
   3 1 1    center = position (3,4), value = 1
   3 3 3
   ```

2. **Element-wise multiplication with filter:**
   ```
   2×(1/9) + 3×(1/9) + 3×(1/9) +
   3×(1/9) + 1×(1/9) + 1×(1/9) +
   3×(1/9) + 3×(1/9) + 3×(1/9)
   ```

3. **Sum the results:**
   ```
   = (2+3+3+3+1+1+3+3+3) / 9
   = 22 / 9
   = 2.44 ≈ 2 (rounded)
   ```

4. **New pixel = 2** (light gray instead of dark gray)

**Was:** 🔲 (dark gray, value 1)
**Became:** 🔳 (light gray, value 2)

The pixel became lighter because it's surrounded by mostly light pixels!

### Why This Works:
- **Averaging**: each pixel becomes the arithmetic mean of its neighbors
- **Smoothing**: sharp color transitions become smoother
- **Noise removal**: random bright/dark pixels disappear

### Other Popular Filters:
- **Gaussian blur**: more weight to the central pixel
- **Edge detection**: negative values for contrast
- **Sharpening**: amplification of the central pixel

**Visualization of the blurred mushroom (approximate):**

<div style="font-family: monospace; line-height: 1; font-size: 1.2rem; letter-spacing: 0.05em;">
⬛⬛🔲🔲🔲🔲🔲🔲⬛⬛<br/>
⬛🔲🔲🔳🔳🔳🔳🔲🔲⬛<br/>
🔲🔲🔳🔳🔳🔳🔳🔳🔲🔲<br/>
🔲🔳🔳🔳🔳🔳🔳🔳🔳🔲<br/>
🔲🔳🔳🔳🔳🔳🔳🔳🔳🔲<br/>
🔲🔲🔳🔳🔳🔳🔳🔳🔲🔲<br/>
⬛🔲🔲🔳🔳🔳🔳🔲🔲⬛<br/>
⬛⬛🔲🔲🔳🔳🔲🔲⬛⬛<br/>
⬛⬛⬛🔲🔲🔲🔲⬛⬛⬛<br/>
⬛⬛⬛🔲🔲🔲🔲⬛⬛⬛
</div>

Contours became softer, details got blurred.

## Practical Applications in AI 🤖

Although our mushroom is simple, these same operations are used for:

1. **Data augmentation**: Rotating, mirroring images for neural network training
2. **Preprocessing**: Normalizing brightness and contrast
3. **Object detection**: Using masks to highlight regions of interest
4. **Filtering**: Noise removal, edge detection
5. **Compression**: Reducing data size without losing important information

## Experiments for Practice 🧪

1. **Try drawing** your own simple object as a matrix (house, tree, smiley)
2. **Apply different transformations** and see the result
3. **Combine operations**: what happens if you first invert colors, then rotate?
4. **Create an animation**: sequentially rotate the image by 90°, 180°, 270°

## Summary 🎯

Matrix transformations are the foundation of image processing:
- ✅ **Simple operations** (addition, multiplication) produce complex effects
- ✅ **Composition of transformations** creates new possibilities
- ✅ **Masks and filters** allow working with parts of data
- ✅ **It all scales** – from 10×10 to millions of pixels!

### Key Ideas:
1. **Image = matrix of numbers**
2. **Transformation = matrix operation**
3. **Composition = sequence of operations**
4. **Efficiency = parallel computations**

**In the next lecture** we'll learn about derivatives and gradients – how to teach a computer to find optimal transformations on its own!

Thank you for your attention! 🚀