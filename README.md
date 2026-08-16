# Postfix Expression Calculator

A web-based calculator for evaluating mathematical expressions written in postfix (Reverse Polish Notation) as part of my Algorithms and Data Structures coursework.

## Overview

The application takes a postfix mathematical expression as input and evaluates it using a stack-based approach.

For example:

Infix:
3 + 4

Postfix:
3 4 +

Result:
7

## Features

- Accepts postfix mathematical expressions
- Evaluates expressions using a stack
- Supports basic arithmetic operations
- Provides an interactive web interface
- Displays the calculated result to the user

## Technologies

- HTML
- CSS
- JavaScript

## Data Structures & Algorithms

This project demonstrates the use of:

- Stack data structure
- Postfix expression evaluation
- Algorithmic problem solving
- Expression parsing
- Time and space complexity analysis

## How It Works

1. The user enters a postfix expression.
2. The expression is processed from left to right.
3. Numbers are pushed onto a stack.
4. When an operator is encountered, the required operands are removed from the stack.
5. The operation is performed.
6. The result is pushed back onto the stack.
7. The final value remaining on the stack is returned as the answer.

## Example

Input:

`5 3 + 2 *`

Processing:

`5 3 +` → `8`

`8 2 *` → `16`

Output:

`16`

## How to Run

Clone the repository:

```bash
git clone https://github.com/lakshaya003/Postfix_Calculator.git
```
Navigate to the project directory:
```bash
cd Postfix_Calculator
```
Start a local web server:
```bash
python3 -m http.server 8000
```
## Project Context

Developed as part of my Computer Science Algorithms and Data Structures coursework.
