---
title: 'Course 7: Introduction to Data Analysis Using Python'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - data-science
  - course-07
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / I - Data
  Science
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/I - Data
  Science/07 - Introduction to Data Analysis Using Python.md
url: /blog/introduction-to-data-analysis-using-python/
topic: biology
updated: '2026-11-10'
order: 7
description: >-
  These tools are often used together: e.g. use SQL to pull a dataset → clean
  and organize it in Python → export as a spreadsheet for quick insights (→
  Digital marketing Course 7: E-commerce analytics tools) Introduction t
isIndex: false
---
## Module 1: Hello, Python!
### Get started with the course
#### Introduction to Course 7
- **Computer programming**: The process of giving instructions to a computer to perform an action or set of actions
	- Different programming languages can be used to write these instructions, chosen based on the project or the problem to solve
- **Python**: super useful for working with data, optimizes every phase of the data workflow: exploring, cleaning, visualizing data → building machine learning models
- Instructor: Adrian, customer engineer at Google Cloud
- Course outline:
	- Introduction to Python: **variables** and **data types** → store and organize data
	- **Functions**: reusable chunks of code that perform specific tasks; **conditional statements**: tell the computer how to make decisions based on instructions
	- **Loops**: repeat a portion of code until a process is complete; **strings**: sequences of characters such as letters and punctuation marks
	- **Data structures**: methods of storing and organizing data in a computer: lists, sets, dictionaries, data frames
#### Course 7 overview
- Course content (4 modules):
	- **Module 1: Hello, Python!**: basics of Python, object-oriented programming, Jupyter Notebooks, variables and data types
	- **Module 2: Functions and conditional statements**: call functions, write conditional statements, write clean code that can be understood and reused
	- **Module 3: Loops and strings**: iterative statements (loops) to automate repetitive tasks; manipulate strings using slicing, indexing, and formatting
	- **Module 4: Data structures in Python**: lists, tuples, dictionaries, sets, arrays; two important tools for advanced data analysis: **NumPy** and **pandas**
- Course 7 overview: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/UD00Z/course-7-overview
#### Helpful resources and tips
- To obtain the certificate: pass all graded assignments in all eight courses (passing grade for each course is **80%**)
- Healthy habits: plan your time, work at your own pace, be curious, follow along with instructors (step-by-step guides), take notes, review exemplars, build your career identity, study together
- **Exemplars**: completed assignments that fully meet an activity's criteria
- Glossaries: module glossaries (end of each module), course glossaries, certificate glossary (Resources tab)
- Helpful resources and tips: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/nFLSF
#### Adrian: My path to a data career
- Adrian: from nursing (non-traditional background) and an undergraduate degree in English and history → digital humanities → knowledge management → data analytics
- Transferable skills: **critical thinking**, **problem solving**, **assessment** (key when debugging and assessing answers found online), and **soft skills / interpersonal skills** (collaboration)
- "Every company is going to become a data company"
- Data analytics can be entry level: once you understand the basics you can get started on your own, no formal degree or years of experience required
#### Welcome to module 1
- Module 1: Python's main features → **Jupyter notebooks** (interactive environment for coding and data work) → **object-oriented programming** → **variables** (store and label data, naming conventions) → **data types**: integers, floats, strings
#### From spreadsheets to SQL to Python
- Spreadsheets, SQL, and Python have two things in common:
	- They all use **filters**: Python → pandas library; SQL → `SELECT-FROM-WHERE` query; spreadsheet → menu options (→ [SQL](/topics/sql/))
	- They all use **functions**: in formulas (spreadsheets), in queries (SQL), in code (Python)

| Key question                      | Spreadsheet programs                                                                                              | SQL                                                                              | Python                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| What is it?                       | A program that uses rows and columns to organize data and allows analysis through formulas, functions, built-ins | A database programming language used to communicate with databases              | A general purpose programming language for data analysis, scientific computing, machine learning, web dev   |
| Primary advantage                 | Variety of visualization tools/features                                                                           | Manipulate and reorganize data as needed                                         | Accessible language with extensive libraries (pandas, NumPy) for manipulation, analysis, visualization      |
| Best datasets                     | Smaller datasets                                                                                                  | Larger datasets                                                                  | Larger datasets                                                                                             |
| Source of the data                | Entered manually or imported                                                                                      | Accessed from an external database                                               | CSV files, spreadsheets, databases, or APIs                                                                 |
| Where analysis data is stored     | Spreadsheet file on your computer                                                                                 | Tables in the accessed database                                                  | Python file or Jupyter Notebook on your computer                                                            |
| Formulas and functions?           | Yes                                                                                                               | Yes                                                                              | Yes                                                                                                         |
| Visualizations?                   | Yes                                                                                                               | Yes, with an additional tool like a DBMS or BI tool                              | Yes, with libraries such as Seaborn, Matplotlib, Plotly                                                     |

- These tools are often used together: e.g. use SQL to pull a dataset → clean and organize it in Python → export as a spreadsheet for quick insights (→ [Digital marketing Course 7: E-commerce analytics tools](/blog/satisfaction-guaranteed-develop-customer-loyalty-online/))
#### Introduction to Python
- Programming languages: the words and symbols used to write instructions for computers to follow
- **Transistor**: the most fundamental component of the computer, controls the flow of electricity through a circuit; two states: on or off
	- **Binary**: represented as ones and zeros → computers only understand instructions given in binary
- **Low-level languages**: the first programming languages, difficult to use, required lots of training, often only worked on the specific machine they were designed for
- **High-level languages**: use syntax that's much more familiar to humans
	- **Syntax**: simpler rules and structures of a programming language
- **Python**: a high-level language that's versatile, easy to learn and powerful
	- Named after the British comedy troupe Monty Python
	- Open source → many libraries and tools
	- **Library**: A reusable collection of code (e.g. a math library that contains a `sum` function instead of hand-coding it)
	- Large and active community of users
- Coding is simple and complex: each line of code represents a small, simple idea, but together they can express very complex logic → don't be afraid to make a mess, experimenting is part of the process

### The power of Python
#### Discover more about Python
- Python is simple enough to learn some basic concepts just by example:
	- `print("Hello, world!")` → outputs whatever is entered in its parentheses
	- Computations: `(5 + 4) / 3` → `3.0`
	- **Variable**: like a container that you can name; the container's contents are its **value**
		```python
		country = 'Brazil'
		age = 30
		print(country)   # Brazil
		print(age)       # 30
		```
	- Evaluate statements: `10**3 == 1000` → `True`; `10*3 == 40` → `False`; `10*3 == age` → `True`
	- **Operators**: `+` addition, `/` division, `**` exponent, `==` checks equivalence of two values (returns `True`/`False`)
		- A single `=` is reserved for assigning variables → using it to compare gives a **syntax error**
	- **Conditional logic**:
		```python
		if age >= 18:
		    print('adult')
		else:
		    print('minor')
		```
	- **Looping**: performs the same action to each element of something
		```python
		for number in [1, 2, 3, 4, 5]:
		    print(number)

		my_list = [3, 6, 9]
		for x in my_list:
		    print(x / 3)   # 1.0, 2.0, 3.0
		```
	- **Function**: A chunk of code that can be reused to perform the same task; **argument**: information given to a function in its parentheses
		```python
		def is_adult(age):
		    if age >= 18:
		        print('adult')
		    else:
		        print('minor')

		is_adult(14)   # minor
		```
	- **Built-in functions**: e.g. `sorted(new_list)` returns the list sorted from least to greatest
		```python
		new_list = [20, 25, 10, 5]
		sorted(new_list)   # [5, 10, 20, 25]
		```
#### Python versus other programming languages
- Five considerations of programming languages:
	- **Speed**: depends on compile time, runtime, hardware, installed dependencies, efficiency of the code. Low-level languages are generally faster but more difficult to learn
	- **Approachability**: how easy it is for new learners to start using a language
		- **Syntax**: The structure of code words, symbols, placement, and punctuation
		- **Semantics**: builds meaning into those structures by using variables and objects
	- **Variables**: named container which stores values in a reserved location in the computer's memory
		- **Static** variables: maintain a value throughout the entire run of a program
		- **Dynamic** variables: values determined when a program is run
		- **Declarative** variables: enable a program to determine where a variable should be placed
	- **Data science focus**: each language better serves different data analysis tasks
	- **Programming paradigm**:
		- **Object-oriented**: modeled around data objects
		- **Functional**: modeled around functions
		- **Imperative**: modeled around code statements that can alter the state of the program itself

| Features            | Python                                    | R                                                              | Java                                        | C++                                                  |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Speed               | Slower                                    | Depends on configuration and add-ons                           | Faster                                      | Very fast                                            |
| Approachability     | Easy to learn                             | Complex                                                        | Easy to learn                               | Complex                                              |
| Variable            | Dynamic                                   | Dynamic                                                        | Static                                      | Declarative                                          |
| Data science focus  | Machine learning and automated analysis   | Exploratory data analysis and extensive statistical libraries  | Used across projects with open-source assets | Not as widely used but very powerful implementations |
| Programming paradigm | Object-oriented                          | Functional language                                            | Object-oriented                             | Multi-paradigm (imperative & object-oriented)        |

- Python: easy to learn, object-oriented, dynamic variables; sometimes requires a longer time to execute, but a great tool for machine learning and automated analysis (→ [Digital marketing Course 5: Python and R for marketing analytics](/blog/assess-for-success-marketing-analytics-and-measurement/))
#### Introduction to R
- **R**: an open-source programming language and software environment specifically designed for statistical computing and graphics (→ [R Tutorial](/topics/tutorial/), [Bài tập R cơ bản](/blog/bai-tap-r-co-ban-buoi-5-buoi-6-va-buoi-7/))
	- Created in 1993 by Ross Ihaka and Robert Gentleman (University of Auckland, New Zealand)
	- A **domain-specific language** (unlike general-purpose languages such as Python or Java); most users work in the IDE **RStudio**
	- Typically used by professionals with a statistical or research-oriented approach: data scientists, statisticians, engineers
- Uses and applications:
	- **Statistical analysis**: complex statistical tests, predictive models, validate hypotheses
	- **Machine learning**: packages such as `caret` and `tidymodels`
	- **Data wrangling**: `tidyverse` suite, `dplyr` (data manipulation), `tidyr` (data tidying)
	- **Data visualization**: `ggplot2`
	- **Reporting**: R Markdown → dynamic reports, presentations, dashboards
- Benefits: open-source, vast ecosystem of packages (over 20,000 on **CRAN** – Comprehensive R Archive Network), dedicated to data, strong community support
- Resources: R for data science (Hadley Wickham & Garrett Grolemund), RStudio Education, CRAN
#### Ways to learn about programming
- Popular programming languages by profession:
	- **Data analyst**: Python, R (+ **Kaggle**: online repository of datasets, competitions, Learn)
	- **Web designer**: HTML5, CSS
	- **Mobile application developer**: Swift (Apple platforms), Java (Android), C# (.NET, Xamarin)
	- **Web application developer**: Python, Java ("Write Once, Run Anywhere"), Ruby, PHP
	- **Game developer**: C#, C++
- Tips for learning a new programming language:
	- Define a practice project and use the language to complete it
	- Keep previous concepts and coding principles in mind, many are transferable between languages
	- Create and keep good notes and cheat sheets
	- Create an online filing system for information you can easily access
- Additional Python resources: official Python documentation, Stack Overflow, Python tutor mailing list, Python-announce mailing list
- Ways to learn about programming: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/RG4DR
#### Jupyter Notebooks
- **Jupyter Notebook**: An open-source web application for creating and sharing documents containing live code, mathematical formulas, visualizations and text
	- Lets you collaborate on data projects and integrate code, puts all output in one document
- **Terminal-based text editor**: like a single page that's infinitely long; each line executes immediately and you can only move forward → not always the best for data analytics projects
- **Cells**: The modular code input/output fields into which Jupyter Notebooks are partitioned → move, add, delete code easily
- **Markdown**: lets you write formatted text in a coding environment or plain text editor (titles, bullets, tables, mathematical formulas)
#### How to use Jupyter Notebooks
- **JupyterLab**: the full suite of tools for working with computational notebooks; **Jupyter Notebook**: a more streamlined and simplified tool. Works with over 100 programming languages
	- In this program, activities that use Jupyter notebooks are labeled as **labs** (no need to download software)
- Why Jupyter Notebook?
	- **Modular/interactive computing**: run a cell without running the whole notebook → helpful for exploration, experimentation, debugging
	- **Integration of code and documentation**: code, explanations, visualizations in a single document
	- **Support for multiple languages**
	- **Data exploration and analysis**: load, clean, analyze, examine data
	- **Cloud-based services**: run and share notebooks without a local environment
	- **Libraries and extensions**
- Two working modes:
	- **Command mode**: interact with the notebook as a whole (add, move, delete cells), indicated by a **blue bar** on the left of the current cell
	- **Edit mode**: type code or markdown text into a particular cell, indicated by a **green bar** and a thin green border
	- Enter edit mode: click into a cell or press `Enter`; back to command mode: click outside the cell or press `Esc`
- **Markdown mode**: toggle cells between code and Markdown (menu "Code" → "Markdown")
	- **Markdown**: a markup language that lets you add formatting elements to plain text; ubiquitous, future-proof, platform independent
- Common actions and keyboard shortcuts (command mode):
	- `a`: insert a cell above; `b`: insert a cell below
	- `dd`: delete a cell
	- `Ctrl + Enter`: run selected cell; `Shift + Enter`: run and select next cell; `Alt + Enter`: run and insert new cell below
	- `h`: pop-up window with all keyboard shortcuts
- Troubleshooting: use the latest Chrome, Firefox, or Edge; restart the browser, clear cache and cookies or use incognito mode; check internet connection; restart the lab
- How to use Jupyter Notebooks: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/2poER
#### Object-oriented programming
- **Object-oriented programming**: A programming system that is based around objects, which can contain both data and useful code that manipulates that data → more organized, accessible, and reusable code
- **Object**: An instance of a class; a fundamental building block of Python (lists, functions, strings are all objects)
- **Class**: An object's data type that bundles data and functionality together
	```python
	magic = 'hocus pocus'      # an instance of the string class
	magic.swapcase()           # 'HOCUS POCUS'
	magic.replace(old, new)    # replace some characters with new characters
	magic.split()              # ['hocus', 'pocus']
	```
- **Method**: A function that belongs to a class and typically performs an action or operation; uses parentheses
	- In Jupyter Notebook, type a dot and press `Tab` to see the list of methods available to a class
- **Dot notation**: How to access the methods and attributes that belong to an instance of a class
- Core classes of Python: integers, floats, strings, booleans, lists, dictionaries, tuples, sets, frozensets, functions, ranges, and **None** (a data type that returns an empty value); + custom-defined classes from libraries and packages, or your own
- **Attribute**: A value associated with an object or class which is referenced by name using dot notation; no parentheses
	- Access characteristics of a class, but don't change it
	```python
	planets.shape     # (8, 3): 8 rows (planets) × 3 columns (name, radius, number of moons)
	planets.columns   # an index object containing the column names
	```
#### More about object-oriented programming
- Attributes are **characteristics** of the object, while methods are **actions or operations**
	- E.g. class `Spaceship`:
		- Attributes (accessed using only a dot): `Spaceship.name`, `Spaceship.kind`, `Spaceship.speed`, `Spaceship.tractor_beam`
		- Methods (followed by parentheses, can take arguments): `Spaceship.warp()`, `Spaceship.tractor()`; `Spaceship.warp(7)` could change the speed to warp seven
- Defining classes: the class is defined first, then indented beneath it are its attributes and methods → this is what "belongs to a class" means
- A class is like a **blueprint** for all things that share characteristics and behaviors
	- **Instantiating** a class: creating an object (an instance) of that class
	- **Class attribute**: shared by all instances (e.g. every `Spaceship` starts with its tractor beam set to off)
	- **Instance attribute**: assigned when you instantiate the object
- Classes comprise the core objects of Python → Python is known as an object-oriented language
- More about object-oriented programming: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/lJo8v
#### Hamza: How Python helped my data science career
- Hamza: applied machine learning engineer, builds, maintains, and productionizes large-scale models (used by about a hundred million users) → Python is the central theme of the job
- Why Python: a lot of documentation and help, user-friendly, easy to adapt
	- "You never get hired as a good chef because you have good knives, you get hired because you have good cooking skills"
- Strength of Python: a multifaceted tool → transformations, data cleaning, build models, put them into production, make an API, build monitoring systems
- Learning is not linear: steep curve at first → stick to it and be consistent until the "aha" moment

### Python syntax
#### Variables and data types
- Variables give meaning to code, like **nouns** in language
- Variables **point to values**, they're not the values themselves: in `x = 3`, `x` is the variable and its stored value `3` exists in a specific location in the computer's memory
	- Like a container with a label on it (a labeled ketchup bottle)
- **Data type**: An attribute that describes a piece of data based on its values, its programming language, or the operations it can perform (strings, integers, floats, lists, dictionaries, ...)
- Before assigning a new variable, answer: What's the variable's **name**? What's its **type**? What's its **starting value**?
- **Assignment**: The process of storing a value inside a variable
- **Expression**: A combination of numbers, symbols, or other variables that produce a result when evaluated
- **Dynamic typing**: variables can point to objects of any data type; Python interprets the data type automatically when a new variable is assigned
	- No default types for most new variables → must assign (initialize) before calling them
	```python
	age_list = [...]                  # ages of the starting five basketball players
	max_age = max(age_list)           # 34 → integer
	max_age = str(max_age)            # '34' → string (quotation marks)
	max_age = 'ninety-nine'           # overwrite the contents entirely
	min_age = min(age_list)
	```
	- To modify the contents of a variable, you usually need to **reassign** it (`str(max_age)` alone returns a string but doesn't change the variable)
	- In Jupyter Notebook, **the order you run the cells in matters**: rerunning the cell where `max_age` was first assigned reverts it to the integer `34`
	- Variables can be used in expressions: `max_age - min_age` → age difference of the oldest and youngest player
#### Create precise variable names
- **Naming conventions**: Consistent guidelines that describe the content, creation date, and version of a file in its name
- **Naming restrictions**: Rules built into the syntax of the language itself that must be followed
- Conventions:
	- Avoid **keywords**: special words reserved for a specific purpose that can only be used for that purpose (`for`, `in`, `if`, `else`, ...)
		- Keywords appear in a special color in most coding environments → if the name changes color, don't use it
		- Assigning a value to a keyword → the computer **throws an error** (returns an error and the code doesn't run)
	- Avoid names reserved for existing functions, e.g. `print`, `str`
- Restrictions:
	- Variables can only include **letters, numbers, and underscores** (no spaces, tabs, or special characters such as `$` or `&`)
	- Must start with a **letter or underscore**
	- Python is **case sensitive**
	- Cannot include **parentheses** (they have other uses in Python)
	- Valid: `any_a_variable`, `any_a_variable_2`; invalid: `1_is_a_number` (starts with a number), `apples_&_oranges` (special character)
- Parentheses in calculations follow the mathematical **order of operations**:
	```python
	2 * (3 + 4)   # 14
	(2 * 3) + 4   # 10
	```
#### Explore Python syntax
- **Semantics**: The meaning conveyed by the syntax (words + punctuation together communicate ideas and processes)
	- Best way to learn syntax and semantics: exposure → practice coding and read other people's code
- Basics of Python:
	- **Variables**: represent data stored as strings, tuples, dictionaries, lists, objects. E.g. `student_name`
	- **Keywords**: e.g. `in`, `not`, `or`, `for`, `while`, `return`
	- **Operators**: symbols that perform operations on objects and values
		- `+` addition, `-` subtraction, `*` multiplication, `/` division, `**` exponentiation
		- `%` **modulo** (remainder after a division): `10 % 3 = 1`
		- `//` **floor division** (rounds the result down to the nearest integer): `5 // 2 = 2`
		- `>`, `<`, `==`: return a Boolean
	- **Expressions**: e.g. `[1, 2, 3] + [2, 4, 6]`
	- **Functions**: a group of related statements to perform a task and return a value
	- **Conditional statements**: sections of code that direct program execution based on specified conditions
	- Python generates **syntax errors** for incorrectly used keywords and syntax
- Naming rules and conventions:
	- Names cannot contain spaces; may mix upper and lower case; can't start with a number
	- Variable and function names should be written in **snake_case**: all letters lowercase, words separated by an underscore
	- Descriptive names are better than cryptic abbreviations: `student_name` is better than `sn`
- **The Zen of Python** (Tim Peters): Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Complex is better than complicated. Flat is better than nested. Sparse is better than dense. Readability counts. ... (type `import this` in Python to read the full poem)
- **PEP 8 Style Guide for Python**: PEP = Python Enhancement Proposals, a running catalog of ways to improve or standardize Python
- Explore Python syntax: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/95H6J
#### Data types and conversions
- **String**: A sequence of characters and punctuation that contains textual information
	- Instantiated with single or double quotation marks or the `str()` function
	- **Immutable data type**: the values can never be altered or updated
- **Integer**: whole numbers without fractions
- **Float**: numbers that contain decimals
- Mixing different data types can throw an error, e.g. `7 + '8'` → `TypeError` (`'8'` is read as a string because of the quotation marks)
	- Read the errors carefully → understand what they say → fix the mistake
- `type()` function: tells you the data type
	```python
	type('A')   # str
	type(2)     # int
	type(2.5)   # float
	```
- Two ways to convert data:
	- **Implicit conversion**: Python automatically converts one data type to another without user involvement (e.g. arithmetic with integers and floats → integers converted to floats)
	- **Explicit conversion** (**typecasting**): users convert the data type of an object to a required data type, using `int()`, `float()`, `str()`
- **Debugging**: figuring out what's wrong when your code won't work → even experienced professionals search for answers online
#### Wrap-up
- Module 1 review: introduction to Python → Jupyter Notebooks → object-oriented programming → variables and naming conventions → data types (integers, floats, strings) and conversions
#### Glossary terms from module 1
- **Argument**: Information given to a function in its parentheses
- **Assignment**: The process of storing a value in a variable
- **Attribute**: A value associated with an object or class which is referenced by name using dot notation
- **Cells**: The modular code input and output fields into which Jupyter Notebooks are partitioned
- **Class**: An object's data type that bundles data and functionality together
- **Computer programming**: The process of giving instructions to a computer to perform an action or set of actions
- **Data type**: An attribute that describes a piece of data based on its values, its programming language, or the operations it can perform
- **Dot notation**: How to access the methods and attributes that belong to an instance of a class
- **Dynamic typing**: Variables that can point to objects of any data type
- **Explicit conversion**: The process of converting a data type of an object to a required data type
- **Expression**: A combination of numbers, symbols, or other variables that produce a result when evaluated
- **Float**: A data type that represents numbers that contain decimals
- **Immutable data type**: A data type in which the values can never be altered or updated
- **Implicit conversion**: The process Python uses to automatically convert one data type to another without user involvement
- **Integer**: A data type used to represent whole numbers without fractions
- **Jupyter Notebook**: An open-source web application for creating and sharing documents containing live code, mathematical formulas, visualizations, and text
- **Keyword**: A special word in a programming language that is reserved for a specific purpose and that can only be used for that purpose
- **Markdown**: A markup language that lets the user write formatted text in a coding environment or plain-text editor
- **Method**: A function that belongs to a class and typically performs an action or operation
- **Naming conventions**: Consistent guidelines that describe the content, creation date, and version of a file in its name
- **Naming restrictions**: Rules built into the syntax of a programming language
- **Object**: An instance of a class; a fundamental building block of Python
- **Object-oriented programming**: A programming system that is based around objects which can contain both data and code that manipulates that data
- **Programming languages**: The words and symbols used to write instructions for computers to follow
- **String**: A sequence of characters and punctuation that contains textual information
- **Syntax**: The structure of code words, symbols, placement, and punctuation
- **Typecasting**: Converting data from one type to another (see explicit conversion)
- **Variable**: A named container which stores values in a reserved location in the computer's memory

## Module 2: Functions and conditional statements
### Functions
#### Welcome to module 2
- Module 2: **functions** (like the verbs or action words of a programming language: sorting, classifying, summarizing data, ...) → writing **clean code**: **reusability** and **modularity** → **commenting** → **operators**: comparators and logical operators → **conditional statements**: `if`, `else`, `elif`
- Writing clean code is a great way to collaborate with teammates → work faster, communicate more effectively, produce better results
#### Lateefat: Tips to address challenges when learning to code
- Lateefat: customer engineer at Google Cloud, specialty data analytics; used to be a secretary and a waitress → lesson: face the issue head on, admit your mistakes
- Challenges when learning Python: setting up the environment and picking IDEs → overcome by **committing to just starting** (spend X amount of time on it)
- Learn to read Stack Overflow: slow down and understand what it says and how it relates to your error, instead of copy-pasting code
- Coding knowledge → automated the creation of 2,300 business intelligence reports within an hour and a half
- Tips: actually write code (not just watch videos), **learn to debug**, **deal with the noise** (separate must-knows from nice-to-knows)
#### Define functions and return values
- **Function**: A body of reusable code for performing specific processes or tasks
	- Built-in functions: `print()` writes text on the screen, `type()` tells the data type, `str()` converts an object into a string
	- In Python 3, `print` is a function and requires parentheses (in previous versions it was a statement)
- Define a function:
	- Begin with the `def` keyword → function name → arguments (**parameters**) in parentheses → colon `:`
	- The body is **indented** (usually four spaces, be consistent): lines of code are hierarchical, any indented line pertains to the less-indented code that precedes it
	- Unindent the next line to finish defining the function
	```python
	def greeting(name):
	    print('Welcome, ' + name + '!')
	    print('You are part of the team!')

	greeting('Rebecca')
	```
- **`return`**: A reserved keyword in Python that makes a function produce new results which are saved for later use (instead of printing)
	```python
	def area_triangle(base, height):
	    return base * height / 2

	area_a = area_triangle(base_a, height_a)
	area_b = area_triangle(base_b, height_b)
	total_area = area_a + area_b

	def get_seconds(hours, minutes, seconds):
	    total_seconds = 3600 * hours + 60 * minutes + seconds
	    return total_seconds

	get_seconds(16, 45, 20)   # 60320
	```
	- `return` enables combining function calls with other operations → **reusability**: defining code once and using it many times without having to rewrite it
#### Write clean code
- Reuse code that others have written (online code repositories) or develop **modular code** → speed up development, focus on business needs instead of rework
- Code duplication in your scripts → clean things up by using a function
	```python
	def lucky_number(name):
	    number = ...   # a calculation that uses len(name)
	    print('Hello ' + name + '. Your lucky number is ' + str(number))

	lucky_number(name_1)
	lucky_number(name_2)   # call it with a different name as many times as needed
	```
	- `len()`: returns the length of an object (e.g. the number of characters in a string)
- **Modularity**: The ability to write code in separate components that work together and that can be reused for other programs
- **Refactoring**: The process of restructuring code while maintaining its original functionality
- **Self-documenting code**: Code written in a way that is readable and makes its purpose clear (variable names, clear and concise expressions)
- **Comments**: a helpful supplemental explanation of the code; the computer ignores everything after the `#` character on that line
- Code reuse and modularity reduce errors, enhance teamwork, and build trust
#### Use comments to scaffold your code
- **Algorithm**: A set of instructions for solving a problem or accomplishing a task (e.g. a recipe for baking bread) → **think algorithmically**; functions are algorithms
- Best way to write a new function: break it into small, simple pieces, beginning with the **comments** (outline the steps before writing code)
	```python
	def seed_calculator(fountain_side, grass_width):
	    """
	    Calculate the number of kilograms of grass seed needed for
	    a border around a square fountain.

	        Parameters:
	            fountain_side (num): length of one side of the fountain in meters
	            grass_width (num): width of the grass border in meters

	        Returns:
	            seed (float): amount of seed (kg) needed for grass border
	    """
	    # Area of fountain
	    fountain_area = fountain_side**2
	    # Total area
	    total_area = (fountain_side + 2 * grass_width)**2
	    # Area of grass border
	    grass_area = total_area - fountain_area
	    # Amount of seed needed (35 g/m²)
	    seed = grass_area * 35
	    # Convert to kg
	    seed = seed / 1000
	    return seed

	seed_calculator(12, 2)   # 3.92
	```
- **Docstring**: A string at the beginning of a function's body that summarizes the function's behavior and explains its arguments and return values
	- Begins and ends with three quotation marks (single or double)
	- First line in the form of a command, ending in a period → parameters → return value
#### Reference guide: Functions
- Function examples: converting Fahrenheit to Celsius, calculating the total cost of goods in stock, building a DataFrame, a spell checker
- Function syntax:
	- `def` + function name (snake_case) + parameters in parentheses + `:`
	- Docstring for important or non-obvious functions: in the form of a command ("Add two numbers", not "Adds two numbers"), indented four spaces
	- Body indented at least four spaces; finish with a `return` or `print` statement
- **`return` vs. `print`**: `return` gives a result you can use for something else; `print` only prints something to the console
	- Return = your brother brings back a bag of potatoes; print = your brother tells you what potatoes were for sale
- **Functions vs. methods**: methods are functions that belong to a class, called using dot notation (e.g. `my_string.split()` splits strings on their whitespaces); standalone functions don't belong to a particular class and can often be used on multiple classes (e.g. `len()`, `type()`)
- Useful built-in functions: `enumerate()`, `isinstance()`, `dict()`, `type()`, `len()`, `set()`, `zip()`; docstring conventions: **PEP 257**
- Reference guide: Functions: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/G8CX0

### Conditional statements
#### Make comparisons using operators
- **Boolean**: A data type that has only two possible values, usually `True` or `False` (from George Boole, 19th-century English mathematician)
	- Every comparison in Python results in Boolean data → used to control logical flows in code
- **Comparator**: An operator that compares two values and produces Boolean values
	- Six comparators: `>`, `>=`, `<`, `<=`, `==`, `!=`
	```python
	print(10 > 1)         # True
	print('cat' == 'dog') # False
	print(1 != 2)         # True
	print(1 < '1')        # TypeError: can't compare an integer and a string
	```
- **Logical operator**: An operator that connects multiple statements together and performs more complex comparisons: `and`, `or`, `not`
	- `and`: needs both expressions to be true to return `True`
	- `or`: `True` if either expression is true, `False` only when both are false
	- `not`: inverts the value of the expression that follows it
	- Comparing strings: comparators evaluate the first letter (A least → Z greatest), then the second letter if the first letters are the same
	```python
	print('yellow' > 'cyan' and 'brown' > 'magenta')   # False (only the first part is true)
	print(25 > 50 or 1 != 2)                           # True
	print(not 42 == 'Answer')                          # True
	```
#### Reference guide: Python operators
- **Operators**: characters that enact specific arithmetic, logical actions, or processes
- Comparators: `>` greater than, `>=` greater than or equal to, `<` less than, `<=` less than or equal to, `!=` not equal to, `==` equal to
	- A single `=` is reserved for assignment → comparison with `=` returns a `SyntaxError`; comparing incompatible data types → `TypeError`
- Logical operators: `and` (True only if both statements are true), `or` (True if one or both are true), `not` (reverses the evaluation)
- Arithmetic operators:

| Operation                                                         | Operator | Example  | Output |
| ----------------------------------------------------------------- | -------- | -------- | ------ |
| Addition                                                          | `+`      | `5 + 2`  | `7`    |
| Subtraction                                                       | `-`      | `5 - 2`  | `3`    |
| Multiplication                                                    | `*`      | `5 * 2`  | `10`   |
| Division                                                          | `/`      | `5 / 2`  | `2.5`  |
| Modulo (the remainder of a division)                              | `%`      | `5 % 2`  | `1`    |
| Exponentiation                                                    | `**`     | `5 ** 2` | `25`   |
| Floor division (times the denominator fully goes into the numerator) | `//`  | `5 // 2` | `2`    |

- Reference guide: Python operators: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/EFjd3
#### Use if, elif, else statements to make decisions
- **Branching**: The ability of a program to alter its execution sequence
- **`if`**: A reserved keyword that sets up a condition in Python (**if statements** = **conditional statements**)
	- Structure: `if` + condition + `:` → indented body; the body only executes when the condition evaluates to `True`, otherwise it is ignored
	```python
	def hint_username(username):
	    if len(username) < 8:
	        print('Invalid username. Must be at least 8 characters long.')
	    else:
	        print('Valid username.')
	```
- **`else`**: A reserved keyword that executes when preceding conditions evaluate as `False`
	- An `if` statement and its corresponding `else` are always written at the same indentation level
- **Modulo** `%`: An operator that returns the remainder when one number is divided by another (`5 % 2` → 1, `11 % 3` → 2, `10 % 2` → 0)
	- `else` is not always needed: when the `if` block returns a value, the function exits there; otherwise it continues to the next line
	```python
	def is_even(number):
	    if number % 2 == 0:
	        return True
	    return False

	is_even(19)   # False
	```
- **`elif`** (else-if): A reserved keyword that executes subsequent conditions when the previous conditions are not true → handles an unlimited number of comparison cases and avoids nested `if`/`else`
	```python
	def hint_username(username):
	    if len(username) < 8:
	        print('Invalid username. Must be at least 8 characters long.')
	    elif len(username) > 15:
	        print('Invalid username. Cannot exceed 15 characters.')
	    else:
	        print('Valid username.')
	```
- Branching is helpful for: binning data based on its value, backing up files, only allowing login access to a server during certain times of day
#### Reference guide: Conditional statements
- Basic syntax:
	```python
	if condition1:
	    # code to execute if condition1 is True
	elif condition2:
	    # code to execute if condition1 is False and condition2 is True
	else:
	    # code to execute if both conditions are False
	```
- Omitting `else`: often superfluous in the logical context (a `return` inside `if` exits the function); the final `return False` is at the same indentation level as `if`
- Key takeaways:
	- `elif` and `else` are optional; you can have multiple `elif` statements
	- Only one `else`, and only at the end of the logic block
	- Conditions must evaluate to a Boolean value
	- **Indentation matters**: typically four spaces; indentation mistakes are one of the most common causes of unexpected code behavior
- Reference guide: Conditional statements: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/HjOvQ
#### Wrap-up
- Module 2 review: functions → clean code (reusability, modularity, commenting) → comparators and logical operators → conditional statements (`if`, `else`, `elif`)
#### Glossary terms from module 2
- **Algorithm**: A set of instructions for solving a problem or accomplishing a task
- **Boolean**: A data type that has only two possible values, usually true or false
- **Branching**: The ability of a program to alter its execution sequence
- **Comparator**: An operator that compares two values and produces Boolean values (True/False)
- **def**: A keyword that defines a function at the start of the function block
- **Docstring**: A string at the beginning of a function's body that summarizes the function's behavior and explains its arguments and return values
- **elif**: A reserved keyword that executes subsequent conditions when the previous conditions are not true
- **else**: A reserved keyword that executes when preceding conditions evaluate as False
- **Function**: A body of reusable code for performing specific processes or tasks
- **if**: A reserved keyword that sets up a condition in Python
- **Logical operator**: An operator that connects multiple statements together and performs complex comparisons
- **Modularity**: The ability to write code in separate components that work together and that can be reused for other programs
- **Modulo**: An operator that returns the remainder when one number is divided by another
- **Refactoring**: The process of restructuring code while maintaining its original functionality
- **return**: A reserved keyword in Python that makes a function produce new results which are saved for later use
- **Reusability**: The capability to define code once and using it many times without having to rewrite it
- **Self-documenting code**: Code written in a way that is readable and makes its purpose clear
- (Các thuật ngữ còn lại trùng với [Glossary terms from module 1](#glossary-terms-from-module-1))

## Module 3: Loops and strings
### While loops
#### Welcome to module 3
- **Iterative statement** (**loop**): automatically repeats a portion of code until a process is complete (e.g. the same calculation on hundreds of price values) → saves time, reduces human error, increases productivity
	- Two types: **while loops** and **for loops**
- You can iterate over strings, lists, sets, dictionaries; this module focuses on **strings** (indexing and slicing → select, filter, edit textual data such as customer feedback)
#### Michelle: Approach problems with an analytical mindset
- Michelle: data engineer at Google, started as a documentation specialist right out of college
- **Imposter syndrome** is very real → a career in data is not about memorizing every answer, but developing the skills to **approach a problem with an analytical mindset**
- Automating a workflow: first write down what you want to do in **plain English** → search forums (how to use a for loop, ...) → automate it one piece at a time
- Break things down into smaller, more manageable chunks
#### Introduction to while loops
- **Loop**: A block of code used to carry out iterations
- **Iteration**: The repeated execution of a set of statements, where one iteration is the single execution of a block of code
- **Iterable**: An object that's looped, or iterated, over
- **While loop**: A loop that instructs your computer to continuously execute your code based on the value of a condition (Fido eats treats *while* the treat bag is in Magali's lap)
	- Similar to `if` statements, but the body can be executed multiple times
	```python
	x = 0                       # initialize
	while x < 5:
	    print('Not there yet, x=' + str(x))
	    x = x + 1               # increment
	print('x = ' + str(x))      # x = 5
	```
	- After each iteration, the computer loops back to re-evaluate the condition; when it's no longer true, the next line after the loop executes
	- The condition can use logical operators (`and`, `or`, `not`) but must evaluate to `True` or `False`
- Example: a number-guessing game
	```python
	import random

	number = random.randint(1, 25)   # random number between 1 and 25, inclusive
	number_of_guesses = 0

	while number_of_guesses < 5:
	    print('Guess a number between 1 and 25: ')
	    guess = input()              # captures the user's input as a string
	    guess = int(guess)           # convert to integer, otherwise it never equals number
	    number_of_guesses += 1       # same as number_of_guesses = number_of_guesses + 1

	    if guess == number:
	        break
	    elif number_of_guesses == 5:
	        break
	    else:
	        print('Nope! Try again.')

	if guess == number:
	    print('Correct! You guessed the number in ' + str(number_of_guesses) + ' tries!')
	else:
	    print('You did not guess the number. The number was ' + str(number) + '.')
	```
	- Without incrementing the counter, the loop would never stop running
	- **`break`**: A keyword that lets you escape a loop without triggering any `else` statement that follows it in the loop
#### Loops, break, and continue statements
- **While loop**: a control structure that repeatedly executes a block of code as long as a certain condition is true; the condition is evaluated at the beginning of each iteration
	```python
	while condition:
	    # code block

	x = 1
	while x < 100:
	    print(x)
	    x = x * 2       # 1, 2, 4, ..., 64 → stops when x becomes 128
	```
- **Infinite loop**: a mistake in logic or syntax (e.g. `x = x * 2` not indented in the body) → the loop never terminates
	- Break out by **interrupting the kernel**: stop button in the menu, Kernel → Interrupt, or press `i` twice in command mode
- **`break`**: ends a loop even if the conditional statement is still true
	```python
	x = 1
	i = 0
	while x < 100:
	    if i == 5:
	        break
	    print(i, x)
	    x = x * 2
	    i += 1
	```
- **`continue`**: skips the rest of the code in the current iteration and goes to the next iteration
	```python
	i = 0
	while i < 10:
	    if i % 3 != 0:
	        print(i)      # numbers 0–9 not divisible by 3
	        i += 1
	        continue      # avoid incrementing i twice
	    i += 1
	```
- Loops, break, and continue statements: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/aCeEE

### For loops
#### Introduction to for loops
- **For loop**: A piece of code that iterates over a sequence of values (e.g. ATM software counting how many PIN attempts were made before blocking the user)
	```python
	for x in range(5):
	    print(x)        # 0, 1, 2, 3, 4
	```
	- `for` + variable (any name, keep it consistent) + `in` + sequence + `:` → indented body
- **`range()`**: A Python function that returns a sequence of numbers starting from zero, increments by one by default, and stops before the given number; usable in while or for loops
- Read a file line by line:
	```python
	with open('zen_of_python.txt') as f:   # file path
	    for line in f:
	        print(line)
	print("I'm done.")
	```
- Nested for loops: e.g. find all unique words in a 2D array of text (outer loop over each column, inner loop over each cell)
- For loops are great for performing a repeated procedure on an object with a fixed length
#### Loops with multiple range() parameters
- `range(start, stop, step)`: three parameters
	```python
	product = 1                 # start with 1, not 0
	for n in range(1, 10):
	    product = product * n
	print(product)              # 362880 = factorial of 9

	def to_celsius(x):
	    return (x - 32) * 5 / 9

	for x in range(0, 101, 10):     # 0 to 100 °F in steps of 10 (stop value excluded → 101)
	    print(x, to_celsius(x))
	```
- When to use which loop:
	- **For loops**: when there's a sequence of elements to iterate over (e.g. a record in a dataset) → better readability
	- **While loops**: to repeat an action until a Boolean condition changes
	- If either works, use whichever you prefer
#### For loops
- **For loop**: a control structure that executes a block of code the same number of times as there are elements in an iterable sequence
	- Iterable data types: strings `'chimichurri'`, lists `[1, 2, 3, 4, 5, 6]`, tuples `(1, 2, 3, 4, 5)`, dictionaries `{'Name': 'Anita', 'Age': 77}`, sets `{1, 4, 14, 33}`
	```python
	for item in iterable_sequence:
	    # code block
	```
	- Naming conventions for the loop variable: `char` for characters in a string, `n` or `num` for numbers, `for name in names:`
	- The loop variable is reassigned at each iteration and **persists** after the loop terminates (contains the value from the final iteration)
- `range(start, stop, step)` returns an object of the range class:
	- One argument → stop value (start = 0, step = 1 by default); two arguments → start and stop; stop value is not included
	- Useful for numbered lists or operations on certain indices of an object
- **Nested loop**: a loop inside of another loop (e.g. extract information from a list of lists)
	```python
	students = [[given_name_1, surname_1], [given_name_2, surname_2], [given_name_3, surname_3]]
	for student in students:
	    for name in student:
	        print(name)
	    print()          # new line after each inner list
	```
- For loops: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/xom5n

### Strings
#### Work with strings
- String: immutable data type, but we can still do a lot with them
- **Concatenate**: To link or join together → use the `+` operator
	```python
	'Hello' + 'world'         # 'Helloworld' → whitespace counts as its own character
	'Hello' + ' ' + 'world'   # 'Hello world'
	greeting_1 + greeting_2   # also works with variables
	'Danger! ' * 3            # 'Danger! Danger! Danger! '
	```
	- Strings cannot be divided or subtracted → error
- Quotation marks inside strings:
	- Use single quotes to begin/end a string that contains double quotes, and vice versa
	- **Escape character** `\`: A character that changes the typical behavior of the characters that follow it (e.g. `\"` behaves as a regular punctuation mark)
	- `\n`: indicates a new line when printing; to print `\n` as characters, write `\\n`
- Iterate over strings with loops:
	```python
	for letter in 'Python':
	    print(letter + 'ut')
	```
#### String slicing
- **Indexing**: A way to refer to the individual items within an iterable by their relative position → select, filter, edit and manipulate data (works on strings, lists, tuples, ...)
	- Python uses **zero-based indexing**: the first element of a sequence is indexed at 0
- Example: a salary column mixing a currency symbol and an amount (e.g. `$`) is interpreted as strings → slicing removes the character at index 0 so values can behave like numbers
- **`index()`**: A string method that outputs the index number of a character in a string
	```python
	pets = 'cats and dogs'
	pets.index('s')   # 3 → only returns the first position that matches
	pets.index('z')   # ValueError: substring not found

	name = 'Jolene'
	name[0]           # 'J'
	name[5]           # 'e'
	name[6]           # IndexError: string index out of range
	```
- **Negative indices**: access characters from the end without knowing the length (`[-1]` → last character, `[-2]` → second to last)
- **String slice**: A portion of a string that can contain more than one character; also referred to as a **substring**
	```python
	color = 'orange'
	color[1:4]        # 'ran' → closing index is not included

	fruit = 'pineapple'
	fruit[:4]         # 'pine' → omitting the first number implies 0
	fruit[4:]         # 'apple' → to the end

	'banana' in fruit # False
	'apple' in fruit  # True
	```
#### String indexing and slicing
- **Indexing**: accessing a single element of a sequence by its position, using square brackets
	- Zero-based indexing in Python; some languages use **one-based indexing**, such as **R**, Julia, and SAS (→ [R](/topics/tutorial/))
	- Selecting an index out of range → `IndexError`
- **Slicing**: accessing a range of elements from a sequence, using square brackets with two indices separated by a colon
	- The starting index is **inclusive** and the ending index is **exclusive**
	- Omitted starting index → 0; omitted ending index → the length of the sequence
	- Slicing does **not** throw an `IndexError` when the ending index is out of range (e.g. `[:100]` returns the substring up to the final element)
- String indexing and slicing: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/IAiQA
#### Format strings
- **`format()`**: A string method that formats and inserts specific substrings into designated places within a larger string; curly braces `{}` designate where values are inserted
	```python
	name = ...     # a string
	number = ...   # an integer
	print('Hello {}, your lucky number is {}.'.format(name, number))   # inserted in argument order

	print('Hello {name}, your lucky number is {num}.'.format(num=number, name=name))   # keywords: order doesn't matter

	print('Hello {1}, your lucky number is {0}.'.format(number, name))   # integer indices
	```
	- Keywords are helpful when an output message needs to be translated into another language with a different word order
- Formatting numbers:
	```python
	price = 7.75
	with_tax = price * 1.07
	print('Base price: ${:.2f} USD. \nWith tax: ${:.2f} USD.'.format(price, with_tax))   # 8.2925 → 8.29
	```
	- `:` separates the expression from the keyword name; `.2f`: two places beyond the decimal, `f` = float (`.0f` → whole number)
	- `>3`, `>6`: align the output 3 or 6 spaces to the right
	```python
	def to_celsius(x):
	    return (x - 32) * 5 / 9

	for x in range(0, 101, 10):
	    print('{:>3} F | {:>6.2f} C'.format(x, to_celsius(x)))
	```
#### String formatting and regular expressions
- `format()` is useful for reusable template text and for labeling charts and graphs
	- **79 characters** is a conventional maximum length for a line of Python code → enclose long strings in triple quotes to break them over multiple lines
	- Arguments can be inserted by order, by keyword names, or by index numbers (indices can be repeated, any number of arguments)
- **Literal string interpolation** (**f-strings**, Python 3.6+): start with `f` (or `F`), embed expressions directly into braces without calling `format()`
	```python
	var_a = 1
	var_b = 2
	print(f'{var_a} + {var_b} = {var_a + var_b}')   # 1 + 2 = 3
	```
- Float formatting: `{float:.precision type}`, e.g. `f'{num:.2f}'`

| Type  | Meaning                                                                                       |
| ----- | --------------------------------------------------------------------------------------------- |
| `'e'` | Scientific notation: coefficient with one digit before and p digits after the decimal point, `e` separates the exponent (default precision 6) |
| `'f'` | Fixed-point notation: exactly p digits following the decimal point                            |
| `'%'` | Percentage: multiplies the number by 100 and displays in fixed (`'f'`) format followed by `%` |

- Useful string methods:
	- `str.count(sub[, start[, end]])`: number of non-overlapping occurrences of substring `sub`
	- `str.find(sub)`: lowest index where `sub` is found; returns `-1` if not found
	- `str.join(iterable)`: concatenation of the strings in the iterable, separated by the string providing the method
	- `str.partition(sep)`: split at the first occurrence of `sep` → 3-tuple (before, separator, after)
	- `str.replace(old, new[, count])`: copy with occurrences of `old` replaced by `new`
	- `str.split([sep])`: list of the words in the string, whitespace by default as the delimiter
- **Regular expressions** (**regex**): techniques to modify and process string data by **matching patterns** (web scraping, text processing and cleaning, data analysis); not required in this program
	```python
	import re

	pattern = 'regex_pattern'
	match = re.search(pattern, string)   # returns a match object with the position of the match
	```
	- E.g. a pattern like `[bms]ad` searches for "bad", "mad", and "sad"
- String formatting and regular expressions: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/65hYg
#### Wrap-up
- Module 3 review: automate repetitive tasks with loops (while loops, for loops, when to use each) → strings: slicing, indexing, formatting
#### Glossary terms from module 3
- **break**: A keyword that lets a user escape a loop without triggering any ELSE statement that follows it in the loop
- **Concatenate**: To link or join together
- **Escape character**: A character that changes the typical behavior of the characters that follow it
- **For loop**: A piece of code that iterates over a sequence of values
- **format()**: A string method that formats and inserts specific substrings into designated places within a larger string
- **index()**: A string method that outputs the index number of a character in a string
- **Indexing**: A way to refer to the individual items within an iterable by their relative position
- **Iterable**: An object that's looped, or iterated, over
- **Iteration**: The repeated execution of a set of statements, where one iteration is the single execution of a block of code
- **Loop**: A block of code used to carry out iterations
- **range()**: A Python function that returns a sequence of numbers starting from zero, increments by 1 by default, and stops before the given number
- **String slice**: A portion of a string that can contain more than one character; also referred to as a substring
- **While loop**: A loop that instructs the computer to continuously execute the code based on the value of a condition

## Module 4: Data structures in Python
### Lists and tuples
#### Welcome to module 4
- **Data structures**: collections of data values or objects that contain different data types → store, access, organize, and categorize data with speed and efficiency
	- Module 4: lists, tuples, dictionaries, sets, arrays
- Two of the most important libraries/packages for data professionals:
	- **NumPy** (Numerical Python): high-performance computational power → rapidly process large quantities of data
	- **pandas** (Python Data Analysis Library): analyzing data in the form of a table with rows and columns
#### Introduction to lists
- **Data type** (integers, strings, floats, Booleans, ...) vs. **data structure**: A collection of data values or objects that can contain different data types → efficient storage, access, modification; organize, categorize, relate collections of data
- **List**: A data structure that helps store and, if necessary, manipulate an ordered collection of items (e.g. a list of email addresses associated with a user account)
	- Like strings: allow duplicate elements, indexing and slicing, both are **sequences**
	- **Sequence**: A positionally ordered collection of items
	- Strings are sequences of characters, lists store sequences of elements of **any data type**
- **Mutability**: The ability to change the internal state of a data structure; **immutability**: a data structure or element's values can never be altered or updated
	- Lists are **mutable**, strings are **immutable**
	- A list is like a long box divided into slots; each slot can contain another list, an integer, a string, a float, the output of a function, ...
	```python
	x = ['Now', 'we', 'are', 'cooking', 'with', 'seven', 'ingredients']
	print(x[3])         # 'cooking'
	print(x[7])         # IndexError
	print(x[1:3])       # ['we', 'are']
	print(x[:2])        # ['Now', 'we']
	print(x[2:])        # ['are', 'cooking', 'with', 'seven', 'ingredients']
	print('this' in x)  # False → Boolean, usable for branching or looping
	```
#### Modify the contents of a list
- Modifying a list: keep the box, but add, remove, or change what's inside
	```python
	fruits = [...]                 # a list of fruits (incl. 'Banana', 'Pineapple')
	fruits.append('Kiwi')          # adds an element to the end of a list (one argument)
	fruits.insert(1, 'Orange')     # inserts an element at the given index (index, element)
	fruits.insert(0, 'Mango')      # add at the beginning
	fruits.remove('Banana')        # removes an element (one argument)
	fruits.remove('Strawberry')    # ValueError: not in list
	fruits.pop(2)                  # extracts and removes the element at a given index
	fruits[1] = 'Mango'            # reassign the value at index 1
	```
	- **`append()`**: adds an element to the end of a list
	- **`insert()`**: takes an index as the first parameter and an element as the second, inserts the element at the given index
	- **`remove()`**: removes an element from a list
	- **`pop()`**: extracts an element from a list by removing it at a given index
- Strings are immutable: modifying a string means reassigning (overwriting) the variable; `my_string[0] = 'x'` → error. With a list, `my_list[0] = 'x'` works → lists are mutable
#### Reference guide: Lists
- Create a list: square brackets `[]` (elements separated by commas) or the `list()` function; empty list: `[]` or `list()`
	- Can hold strings, integers, or mixed data types
- Indexing and slicing like strings: zero-based, negative indices from the end, ending index of a slice not included; omitted indices → 0 and `len(my_list)`
- **List mutability**: change an item by index (`my_list[1] = ...`), or change a slice of any length (`my_list[1:3] = [...]`)
- List operations: combine with `+`, multiply with `*` (no subtraction or division); check membership with `in`
- List methods:
	- `append()`: add an element to the end
	- `insert()`: insert an element at a given position
	- `remove()`: remove the first occurrence of an item
	- `pop()`: remove and return the item at the given position (last item if no index is specified)
	- `clear()`: remove all items
	- `index()`: index of the first occurrence of an item
	- `count()`: number of times an item occurs
	- `sort()`: sorts ascending by default; a function can decide the sorting criteria
- Reference guide: Lists: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/5lejs
#### Introduction to tuples
- **Tuple**: An immutable sequence that can contain elements of any data type → more secure than lists, keeps data that must be processed together in the same structure
	- Instantiated with parentheses `()` or the `tuple()` function
	```python
	fullname = (first_name, middle_initial, 'Hopper')
	fullname[2] = 'Copper'                  # error: tuples can't be changed
	fullname = fullname + ('Jr',)           # add to the end only by reassigning the tuple
	tuple(name_list)                        # convert a list into a tuple
	```
- Functions that return more than one value actually return a **tuple**
	```python
	def to_dollars_cents(price):
	    ...                                  # compute dollars and cents
	    return dollars, cents

	to_dollars_cents(6.55)                   # (6, 55)
	dollars, cents = to_dollars_cents(6.55)  # unpacking a tuple → two integers
	```
	- **Unpacking a tuple**: splitting a tuple into separate variables
- Tuples inside other data structures: e.g. a **list of tuples** for the starting five players of a basketball team (name, age, position) → list is mutable (add/rearrange players), each player record is an immutable tuple
	```python
	for name, age, position in team:
	    print(name)       # same as printing record[0] for each record
	```
- Tuples save memory, optimize programs, and signal to collaborators that the values are not intended to be modified
#### Compare lists, strings, and tuples

|                | Strings                                                   | Lists                                                        | Tuples                                                                  |
| -------------- | --------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Syntax         | Single, double, or triple quotes; `str()`                 | Brackets, elements separated by commas; `list()` (iterables only) | Parentheses with commas (single element needs a trailing comma `(1,)`), or no parentheses `1, 2`; `tuple()` |
| Content        | Any character, all part of the same single string         | Any data type, in any combination                            | Any data type, in any combination                                       |
| Mutability     | Immutable (operations create a new string object)         | Mutable                                                      | Immutable                                                               |
| Usage          | Text data                                                 | Collections of related items, iterating, sorting and searching, modifying data, storing results | Returning multiple values from a function, packing/unpacking, dictionary keys, data integrity |
| Methods        | Many string methods                                       | Many list methods                                            | Only `count()` and `index()`                                            |

- Triple quotes for a multi-line string insert newlines (`\n`)
- Tuples can be **dictionary keys** because they're immutable, lists cannot (→ [Dictionaries and sets](#dictionaries-and-sets))
- Compare lists, strings, and tuples: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/7BVJD
#### More with loops, lists, and tuples
- Extract the name and position of each player:
	```python
	def player_position(players):
	    result = []
	    for name, age, position in players:      # variables must align with the tuple format
	        result.append('Name: {:>19} \nPosition: {:>15}\n'.format(name, position))
	    return result

	for player in player_position(team):
	    print(player)
	```
	- `for name, age in players` → error: 3 elements in each tuple but only 2 variables
- **Nested loops**: generate all domino tiles (pips from 0 to 6)
	```python
	for left in range(7):
	    for right in range(left, 7):
	        print(f'[{left}|{right}]', end=' ')   # end=' ' instead of the default new line
	    print('\n')

	dominoes = []
	for left in range(7):
	    for right in range(left, 7):
	        dominoes.append((left, right))      # list of tuples

	dominoes[4][1]                              # second number of the tuple at index 4
	```
- **List comprehension**: formulaically creates a new list based on the values in an existing list → like a for loop written in reverse; more elegant and usually faster
	```python
	pips_from_list_comp = [domino[0] + domino[1] for domino in dominoes]
	```
#### zip(), enumerate(), and list comprehension
- **`zip()`**: performs an element-wise combination of sequences; returns an **iterator** that produces tuples containing elements from each input sequence
	- **Iterator**: an object that enables processing of a collection of items one at a time without needing to assemble the entire collection at once (use with loops or `list()`, `tuple()`)
	- Works with two or more iterables; unequal lengths → result is as long as the shortest input
	```python
	places = list(zip(seq_1, seq_2))   # list of tuples (seq_1[i], seq_2[i])
	a, b = zip(*places)                     # unzip with the * operator → two tuples
	```
- **`enumerate()`**: iterate over a sequence while keeping track of each element's index; returns pairs of (index, element), starting index 0 by default (can be changed, e.g. `enumerate(letters, 2)`)
	```python
	for index, letter in enumerate(['a', 'b', 'c']):
	    print(index, letter)
	```
- **List comprehension**: `my_list = [expression for element in iterable if condition]` (condition is optional, used to filter)
	```python
	numbers = [1, 2, 3, 4, 5]
	new_list = [x + 10 for x in numbers]                      # add 10 to each number

	words = [...]   # a list of words
	new_list = [(word[0], word[-1]) for word in words if len(word) > 5]   # first and last letter of words longer than 5 letters
	```
- zip(), enumerate(), and list comprehension: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/TNnsx

### Dictionaries and sets
#### Introduction to dictionaries
- **Dictionary**: A data structure that consists of a collection of **key-value pairs**; instantiated with braces `{}` or the `dict()` function
	- Like a real dictionary: look up the key → access the values associated with that key
	```python
	zoo = {
	    'pen_1': 'penguins',
	    'pen_2': 'zebras',
	    'pen_3': 'lions',
	}
	zoo['pen_2']        # 'zebras'
	zoo['zebras']       # KeyError: lookup only works by key, not by value

	zoo = dict(pen_1='penguins', pen_2='zebras', pen_3='lions')   # keyword arguments, no quotes, = instead of :
	zoo = dict([['pen_1', 'penguins'], ['pen_2', 'zebras']])     # also a list of lists, list of tuples, tuple of tuples, tuple of lists

	zoo['pen_4'] = 'crocodiles'   # add a new key-value pair
	'pen_1' in zoo                # True → only works for keys, not values
	```
- A dictionary's keys must be **immutable** (integers, floats, tuples, strings); lists, sets, and other dictionaries can't be keys
- Dictionaries are **unordered**: can't be accessed by positional index (`zoo[2]` → `KeyError`, 2 is interpreted as a key); if order matters, use a list
#### Dictionary methods
- Convert a list of tuples (name, age, position) into a dictionary with positions as keys and lists of (name, age) tuples as values:
	```python
	new_team = {}
	for name, age, position in team:
	    if position in new_team:
	        new_team[position].append((name, age))
	    else:
	        new_team[position] = [(name, age)]
	```
- Looping over a dictionary only accesses the **keys**
- **`keys()`**: retrieves only the dictionary's keys
- **`values()`**: retrieves only the dictionary's values (here: a list of lists of tuples)
- **`items()`**: retrieves both the dictionary's keys and values
	```python
	for position, players in new_team.items():
	    print(position, players)
	```
#### Reference guide: Dictionaries
- Create a dictionary: braces `{key: value, ...}` or `dict(key=value, ...)` (keyword arguments can't contain whitespaces); empty: `{}` or `dict()`
	- **Keys**: any immutable data type (strings, numbers, tuples)
	- **Values**: any data type, mutable or immutable, including other dictionaries or objects
	- Each key corresponds to a single value; enclose multiple values in another data structure (e.g. a list)
- Work with dictionaries:
	- Access a value: `my_dict[key]`; all values: `my_dict.values()`
	- Assign a new key: `my_dict[new_key] = value` (dictionaries are mutable)
	- Check if a key exists: `key in my_dict`
	- Delete a key-value pair: `del my_dict[key]`
- `items()`, `keys()`, `values()` return **view objects**: a dynamic view of the dictionary's entries (reflects changes), iterable, support membership tests
- Reference guide: Dictionaries: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/tELNl
#### Introduction to sets
- **Set**: A data structure in Python that contains only unordered, non-interchangeable elements; instantiated with the `set()` function or non-empty braces
	- Each element is **unique** and **immutable**, but the set itself is **mutable** → cannot be a dictionary key
	- Useful for storing mixed data in a single record, or making sure each element is only present once
	```python
	set(['foo', 'bar', 'baz', 'foo'])    # {'bar', 'baz', 'foo'} → duplicates removed
	set(('foo', 'bar', 'baz', 'foo'))    # tuple: two sets of parentheses
	set('foo')                           # {'f', 'o'} → a string is split into unique characters
	{'foo'}                              # braces treat contents as literals → {'foo'}
	{}                                   # an empty dictionary, not a set → use set()
	```
	- Sets cannot be indexed or sliced
- Set operations:
	- **Intersection** (`intersection()` or `&`): elements that two sets have in common
	- **Union** (`union()` or `|`): all elements from both sets (commutative)
	- **Difference** (`difference()` or `-`): elements present in one set but not the other (not commutative)
	- **Symmetric difference** (`symmetric_difference()` or `^`): elements from both sets that are mutually not present in the other
	```python
	set_1 = {...}
	set_2 = {...}
	set_1.intersection(set_2)   # same as set_1 & set_2
	set_1.union(set_2)          # same as set_1 | set_2
	set_1 - set_2               # only in set_1
	set_1 ^ set_2               # in either set, but not both
	```
#### Reference guide: Sets
- **Set**: a collection of unique data elements without duplicates (also an important concept in general mathematics) → identify unique elements, compare data, clean data
	- `my_set = {5, 10, 10, 20}` → `{5, 10, 20}`
- **`set()`**: mutable, has methods to add and remove data (e.g. `add()`), removes duplicates from any iterable, unordered and non-indexable
	- Elements must be **hashable** (generally immutable): a tuple can be an element, a set cannot (error)
	- `2` and `2.0` are evaluated as equivalent
- **`frozenset()`**: like a set but **immutable** → can be used as a dictionary key and as an element in other sets
- Set methods: `union()` (`|`), `intersection()` (`&`), `difference()` (`-`), `symmetric_difference()` (`^`) → each returns a new set
- Reference guide: Sets: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/exFE8

### Arrays and vectors with NumPy
#### The power of packages
- Advanced calculation capabilities are not included in basic Python → import them from libraries, packages, and modules
- **Library** (**package**): A reusable collection of code; also contains related modules and documentation (the terms are used interchangeably)
	- **Matplotlib**: a comprehensive library for creating static, animated, and interactive visualizations
	- **Seaborn**: a data visualization library based on matplotlib, simpler interface for common plots and graphs
	- **NumPy** (Numerical Python): multidimensional array and matrix data structures and functions to manipulate them → scientific computation
	- **pandas** (Python data analysis): built on top of NumPy, manipulate and analyze tabular data
	- **scikit-learn** (library) and **statsmodels** (package): functions to test the performance of statistical models
- **Module**: A Python file that contains collections of functions and global variables; accessed from within a package or library
	- **Global variables**: can be accessed from anywhere in a program or script
	- Commonly used modules: **math** (mathematical functions), **random** (generate random numbers → random elements, shuffling, random sampling)
#### Introduction to NumPy
- **Vectorization**: enables operations to be performed on multiple components of a data object at the same time → faster, less memory
	```python
	list_a = [...]
	list_b = [...]
	list_a * list_b        # error

	list_c = []            # for loop: one element at a time
	for i in range(len(list_a)):
	    list_c.append(list_a[i] * list_b[i])

	import numpy as np
	array_a = np.array(list_a)
	array_b = np.array(list_b)
	array_a * array_b      # vectorized: simpler, easier to read, faster
	```
- **Import statement**: uses the `import` keyword to load an external library, package, module, or function into your computing environment (no need to import again unless the notebook is restarted)
- **Aliasing**: assign an alternate name (alias) to something, e.g. `import numpy as np` (`np` is the standard alias)
- NumPy powers a lot of other Python libraries, like pandas
#### Understand Python libraries, packages, and modules
- **Library**: a corpus of reusable code modules and their accompanying documentation; bundled into packages that you install, then import
- **Modules**: groups of related classes and functions, generally subcomponents of libraries → import the entire library or just the module you need
- Import syntax:
	```python
	import numpy
	numpy.array([2, 4, 6])

	import numpy as np               # aliasing with the as keyword
	import pandas as pd
	import seaborn as sns
	import matplotlib.pyplot as plt  # pyplot module from the matplotlib library
	np.array([2, 4, 6])

	from sklearn.metrics import precision_score, recall_score   # import individual functions
	from numpy import array
	array([2, 4, 6])                 # no preceding library name needed

	from library import *            # discouraged: hard to track where functions come from
	```
- Built-in modules (Python standard library, no installation needed): **datetime** (date and time conversions and calculations), **math**, **random** (pseudo-random numbers)
- Search for libraries on **PyPI** (Python Package Index)
- Understand Python libraries, packages, and modules: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/muag2
#### Python's new versions and features
- Python and its libraries are constantly updated → code developed in one version may behave differently in another (e.g. Python 2.7.4 vs 3.12.4); team members using different library versions → compatibility issues
- **Deprecation**: code gets phased out and becomes obsolete; Jupyter shows a warning → update your code while actively writing it
	- Major releases (2.X → 3.X) bring more deprecation than small updates (3.11.8 → 3.11.9); older versions often still receive support
- **Environment**: the set of conditions and configurations used to develop code (tools, libraries, dependencies, settings) → collaborators should share the same environment
	- **Anaconda Navigator**: free, open-source GUI to manage environments (with Jupyter, PyCharm, VSCode, ...)
- Check versions:
	```python
	import sys
	print(sys.version)

	import numpy as np
	import pandas as pd
	print(np.__version__)
	print(pd.__version__)
	```
- Python's new versions and features: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/NuXR1
#### Basic array operations
- **Array**: the core data structure of NumPy; **ndarray** (n-dimensional array) is a vector
	```python
	import numpy as np
	array_1d = np.array([1, 2, 3, 4])
	array_1d[-1] = 5             # mutable: change values by index
	np.append(...)               # can't change the size without reassigning → error when adding to the end
	np.array([1, 2, 'coconut'])  # all elements forced to the same data type → strings ('<U21', unicode)
	type(array_1d)               # numpy.ndarray
	array_1d.dtype               # data type of the contents, e.g. int64
	array_1d.shape               # (4,) → 1-D array is neither a row nor a column
	array_1d.ndim                # 1

	array_2d = np.array([[..., ...], [..., ...], [..., ...], [..., ...]])   # list of 4 lists of length 2 → like a table
	array_2d.shape               # (4, 2)
	array_2d.ndim                # 2

	array_3d = np.array([table_1, table_2])   # a list of two lists of lists → like two tables of 2 rows × 3 columns
	array_3d.ndim                # 3

	array_2d = array_2d.reshape(2, 4)   # 2 rows × 4 columns
	```
	- Confirming the shape and number of dimensions is useful when attaching arrays together or debugging errors
- Other NumPy functions: mean, natural logarithm, floor and ceiling (round to the nearest lesser / greater whole number), ...
#### Reference guide: Arrays
- `np.array()`: creates an ndarray (1-D ≈ a list, 2-D ≈ a table, 3-D ≈ two tables)
- `np.zeros()`, `np.ones()`, `np.full()`: create an array of a designated shape pre-filled with zeros, ones, or a specified value → initialize arrays, allocate memory, matrix operations
- Array methods:
	- `ndarray.flatten()`: a copy collapsed into one dimension
	- `ndarray.reshape()`: new shape without changing data (`-1` lets NumPy infer the value)
	- `ndarray.tolist()`: convert to a list (nested lists for multidimensional arrays)
	- Mathematical: `max()`, `mean()`, `min()`, `std()` (whole array or along a specified axis)
- Array attributes: `shape` (tuple of dimensions), `dtype` (data type), `size` (total number of elements), `T` (transposed: rows ↔ columns)
- Indexing and slicing like lists, but multiple indices for multidimensional arrays (e.g. `array_2d[1][0]`, `array_2d[:, 1:]`)
- Array operations: element-wise addition and multiplication; nearly 100 other mathematical functions
- **Mutability**: existing elements can be changed, but the array cannot be lengthened or shortened
	- NumPy arrays allocate a **contiguous block of memory** at instantiation → very fast, but no room to grow; lengthening = copy to a new memory address
- Reference guide: Arrays: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/F6vES

### Dataframes with pandas
#### Introduction to pandas
- **pandas**: key functionality is the manipulation and analysis of **tabular data** (rows and columns, e.g. a spreadsheet); standard alias `pd`, usually imported together with NumPy
	- NumPy can do many of the same operations but requires working more abstractly; pandas displays data as rows and columns → you can always follow what's happening to the data
- Demonstration with the Titanic dataset (passenger name, ticket class, age, ticket price, cabin number):
	```python
	import numpy as np
	import pandas as pd

	titanic = pd.read_csv(url)          # load data from CSV, Excel, databases, ...
	titanic['Age'].mean()               # average age; also max(), min(), std()
	titanic['Pclass'].value_counts()    # number of passengers in each class
	titanic.describe()                  # summary statistics for every numeric column: count, mean, std, min, max, quartiles
	titanic[(titanic['Pclass'] == 3) & (titanic['Age'] > 60)]   # third class passengers older than 60
	titanic['Fare_2023'] = titanic['Fare'] * ...                 # add a column: inflation-adjusted ticket price 1912 → 2023
	titanic.iloc[1, 3]                  # select a cell by index: row 1, column 3 → 'Florence Briggs Thayer'
	titanic.groupby(['Pclass', 'Sex'])['Fare'].mean()           # mean ticket cost per class and sex
	```
	- **Dataframe**: the core data structure in pandas, made up of rows and columns; can contain integers, floats, strings, Booleans, ...
	- Florence Briggs Thayer paid £71.28 for her first class ticket → about £10,417 today
#### pandas basics
- Two core object classes: **DataFrame** and **Series**
- **DataFrame**: A two-dimensional, labeled data structure with rows and columns (like a spreadsheet or a SQL table → [SQL](/topics/sql/))
	```python
	d = {'col1': [1, 2], 'col2': [3, 4]}
	df = pd.DataFrame(data=d)           # from a dictionary: keys = column names, list values = rows

	df2 = pd.DataFrame(np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
	                   columns=['a', 'b', 'c'], index=['x', 'y', 'z'])   # from a NumPy array, name columns and rows

	df3 = pd.read_csv(url_or_file_path)  # from a CSV file
	```
	- **CSV** (comma-separated values): a plaintext file that uses commas to separate distinct values
- **Series**: A one-dimensional, labeled array; most often represents individual columns or rows of a dataframe (can be created from NumPy arrays, dictionaries, scalars)
- Attributes and methods:
	```python
	titanic = df3
	titanic.columns       # index of all column names
	titanic.shape         # (891, 12)
	titanic.info()        # rows, columns, column names, data types, non-null counts, memory usage
	```
	- **NaN** ("not a number"): null values in pandas
	- A Series with mixed or string data types has the data type **object**
- Selecting data:
	```python
	titanic['Age']                # a single column → Series
	titanic.Age                   # dot notation: only if the column name has no whitespaces
	titanic[['Name', 'Age']]      # multiple columns → DataFrame

	titanic.iloc[0]               # integer-location-based: first row → Series
	titanic.iloc[[0]]             # list of a single integer → DataFrame
	titanic.iloc[0:3]             # rows 0, 1, 2
	titanic.iloc[0:3, [3, 4]]     # rows 0–2 at columns 3 and 4
	titanic.iloc[:, [3]]          # a single column in its entirety
	titanic.iloc[0, 3]            # a single value

	titanic.loc[1:3, ['Name']]    # select rows and columns by name
	titanic['new_column'] = ...   # add a new column with an assignment statement
	```
	- **`iloc[]`**: select by integer-location-based position
	- **`loc[]`**: select rows and columns by name (here rows are indexed by number)
	- Bracket notation is generally better for more complex code (easier to read)
#### The fundamentals of pandas
- **Series**: one-dimensional labeled array that can hold any data type, each element has an associated label called an **index**
- **DataFrame**: two-dimensional labeled data structure where each column and row is represented by a Series
- Common DataFrame attributes:

| Attribute | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `columns` | Returns the column labels                                        |
| `dtypes`  | Returns the data types                                           |
| `iloc`    | Accesses rows and columns using integer-based indexing           |
| `loc`     | Accesses rows and columns by label(s) or a Boolean array         |
| `shape`   | Returns a tuple representing the dimensionality                  |
| `values`  | Returns a NumPy representation of the dataframe                  |

- Common DataFrame methods:

| Method           | Description                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `apply()`        | Applies a function over an axis                                                                   |
| `copy()`         | Makes a copy of the indices and data                                                              |
| `describe()`     | Descriptive statistics: min, max, mean, percentiles of numeric columns, row count, data types     |
| `drop()`         | Drops specified labels from rows or columns                                                       |
| `groupby()`      | Splits the dataframe, applies a function, combines the results                                    |
| `head(n=5)`      | Returns the first n rows (default 5)                                                              |
| `info()`         | Concise summary                                                                                   |
| `isna()`         | Same-sized Boolean dataframe indicating null values (alias `isnull()`)                            |
| `sort_values()`  | Sorts by the values across a given axis                                                           |
| `value_counts()` | Series of counts of unique rows                                                                   |
| `where()`        | Replaces values where a given condition is false                                                  |

- Row selection:
	- `loc[]` by name: `df.loc['row']` → Series; `df.loc[['row']]` → DataFrame; `df.loc[['r1', 'r2']]`; a named range `df.loc['r1':'r3']` **includes** the end index
	- `iloc[]` by numeric position: `df.iloc[0]`, `df.iloc[[0]]`, `df.iloc[[0, 2]]`, `df.iloc[0:3]` (excludes index 3)
- Column selection: `df['col']`, `df[['c1', 'c2']]`, dot notation `df.col`, `df.loc[:, ['col']]`, `df.iloc[:, [1]]` (rows must be specified with `loc`/`iloc`)
- Rows and columns together: `df.loc['r1':'r3', ['C']]`, `df.iloc[0:3, [2]]`
	- With named row indices you can't mix numeric and named notation (`df.loc[0:3, 'D']` → error; use `df.iloc[0:3][['D']]`); with numeric indices you can
- The fundamentals of pandas: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/OZSy8
#### Boolean masking
- **Boolean masking** (**Boolean indexing**): A filtering technique that overlays a Boolean grid onto a dataframe's index in order to select only the values that align with the `True` values of the grid
- Example: the planets dataframe

| planet  | radius_km | moons |
| ------- | --------- | ----- |
| Mercury | 2,440     | 0     |
| Venus   | 6,052     | 0     |
| Earth   | 6,371     | 1     |
| Mars    | 3,390     | 2     |
| Jupiter | 69,911    | 80    |
| Saturn  | 58,232    | 83    |
| Uranus  | 25,362    | 27    |
| Neptune | 24,622    | 14    |

- Create and apply the mask:
	```python
	mask = planets['moons'] < 20      # Boolean mask: a Series of dtype bool
	planets[mask]                     # Mercury, Venus, Earth, Mars, Neptune → only a filtered view
	moons_under_20 = planets[mask]    # assign the result to keep it
	planets.loc[mask, 'planet']       # just the planet column as a Series
	```
- Logical operators in pandas: `&` (and), `|` (or), `~` (not); **each condition must be in its own parentheses**, otherwise an error or an unintended result
	```python
	mask = (planets['moons'] < 10) | (planets['moons'] > 50)
	planets[mask]

	mask = (planets['moons'] > 20) & ~(planets['moons'] == 80) & ~(planets['radius_km'] < 50000)
	planets[mask]                     # only Saturn: 83 moons, radius 58,232 km
	```
#### Boolean masking in pandas
- Boolean masking applies a filter to a dataframe; `True` rows remain, `False` rows are filtered out; it doesn't permanently modify the dataframe
- `~(planets['moons'] == 80)` returns the same result as `(planets['moons'] != 80)`
- Boolean masking in pandas: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/YgWpd
#### Grouping and aggregation
- **`groupby()`**: A pandas DataFrame method that groups rows of the dataframe together based on their values at one or more columns → further analysis of the groups
	- Extended planets dataset: type, rings, mean temperature (°C), magnetic field
	```python
	planets.groupby(['type'])                      # a groupby object (stored at a memory address)
	planets.groupby(['type']).sum()                # sum of numeric columns per planet type (type becomes the index)
	planets.groupby(['type']).sum()[['moons']]     # isolate particular columns
	planets.groupby(['type', 'magnetic_field']).mean()   # one row per unique combination
	```
	- Also: `min()`, `max()`, `mean()`, `median()`, `count()`, ...
- **`agg()`** (aggregate): apply multiple calculations to groups of data
	```python
	planets.groupby(['type']).agg(['mean', 'median'])
	planets.groupby(['type', 'magnetic_field']).agg(['mean', 'max'])

	def percentile_90(x):
	    return x.quantile(0.9)

	planets.groupby(['type', 'magnetic_field']).agg(['mean', percentile_90])   # built-in methods as strings, custom functions as objects
	```
#### More on grouping and aggregation
- `groupby()` splits data into groups based on criteria → applies a function to each group → combines the results; the groupby object is the foundation for **aggregation**, **transformation**, **filtration**, **iteration**
	- Future pandas versions require `numeric_only=True` for some aggregations like `mean()`
	- Grouping by multiple columns (e.g. type then color) → one group per existing combination; `size()` returns the number of observations in each group
- Built-in aggregation functions: `count()` (non-null values), `sum()`, `mean()`, `median()`, `min()`, `max()`, `std()`, `var()`
- **`agg()`**: apply multiple functions at the same time; parameters `func` and `axis` (default 0)
	```python
	clothes[['price_usd', 'mass_g']].agg(['sum', 'mean'])          # subset columns first
	clothes.agg({'price_usd': 'sum', 'mass_g': ['mean', 'median']}) # dictionary: different functions per column (NaN where not applied)
	clothes[['price_usd', 'mass_g']].agg(['sum', 'mean'], axis=1)   # applied over each row
	clothes.groupby('color').agg({'price_usd': ['mean', 'max'], 'mass_g': ['mean', 'max']})
	```
- **MultiIndex**: a hierarchical system of dataframe indexing (results of functions applied to groupby objects have tiered indices)
	- Select with `loc[]` and indices in parentheses, e.g. `grouped.loc[:, ('price_usd', 'mean')]`, `grouped.loc[(color, type)]`
	- Remove the row MultiIndex: `groupby(..., as_index=False)`
- More on grouping and aggregation: https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/A29Jl
#### Merging and joining data
- **`pd.concat()`**: combines data either horizontally (new columns for existing rows) or vertically (new rows for existing columns)
	- **Axes**: `axis=0` runs vertically over rows, `axis=1` runs horizontally across columns
	```python
	df = pd.concat([df1, df2], axis=0)     # Mercury–Mars + Jupiter–Neptune → 8 rows × 3 columns
	df = df.reset_index(drop=True)         # restart numbering 0–7 without adding an index column
	```
	- Best for identically formatted data that simply needs to be combined vertically
- **`pd.merge()`**: joins two dataframes together, only horizontally (axis 1) (→ [SQL JOIN](/topics/sql/))
	- **Keys**: the shared points of reference between different dataframes (what to match on), e.g. the `planet` column
	- **Inner join**: only keys in both dataframes
	- **Outer join**: all keys from both dataframes (missing values filled with NaN)
	- **Left join**: all keys in the left dataframe, plus matching keys from the right
	- **Right join**: all keys in the right dataframe, plus matching keys from the left
	```python
	inner = pd.merge(df3, df4, on='planet', how='inner')   # missing Mercury, Venus (left only) and Janssen, Tadmor (right only)
	outer = pd.merge(df3, df4, on='planet', how='outer')
	left = pd.merge(df3, df4, on='planet', how='left')     # Janssen and Tadmor excluded
	right = pd.merge(df3, df4, on='planet', how='right')   # Mercury and Venus excluded
	```
#### Wrap-up
- Module 4 review: data structures (lists, tuples, dictionaries, sets, arrays) → NumPy (computational power, process large amounts of data) → pandas (tabular data: filtering, grouping, merging)
#### Glossary terms from module 4
- **agg()**: A pandas groupby method that allows the user to apply multiple calculations to groups of data
- **Aliasing**: A process that allows the user to assign an alternate name—or alias—to something
- **append()**: A method that adds an element to the end of a list
- **Boolean masking**: A filtering technique that overlays a Boolean grid onto a dataframe in order to select only the values in the dataframe that align with the True values of the grid
- **concat()**: A pandas function that combines data either by adding it horizontally as new columns for existing rows or vertically as new rows for existing columns
- **CSV file**: A plaintext file that uses commas to separate distinct values from one another; stands for "comma-separated values"
- **Data structure**: A collection of data values or objects that contain different data types
- **DataFrame**: A two-dimensional, labeled data structure with rows and columns
- **dict()**: A function used to create a dictionary
- **Dictionary**: A data structure that consists of a collection of key-value pairs
- **difference()**: A function that finds the elements present in one set but not the other
- **dtype**: A NumPy attribute used to check the data type of the contents of an array
- **Global variable**: A variable that can be accessed from anywhere in a program or script
- **groupby()**: A pandas DataFrame method that groups rows of the dataframe together based on their values at one or more columns, which allows further analysis of the groups
- **iloc[]**: A type of notation in pandas that indicates when the user wants to select by integer-location-based position
- **Immutability**: The concept that a data structure or element's values can never be altered or updated
- **Import statement**: A statement that uses the import keyword to load an external library, package, module, or function into the computing environment
- **Inner join**: A way of combining data such that only the keys that are in both dataframes get included in the merge
- **insert()**: A function that takes an index as the first parameter and an element as the second parameter, then inserts the element into a list at the given index
- **intersection()**: A function that finds the elements that two sets have in common
- **items()**: A dictionary method to retrieve both the dictionary's keys and values
- **Keys**: The shared points of reference between different dataframes
- **keys()**: A dictionary method to retrieve only the dictionary's keys
- **Left join**: A way of combining data such that all of the keys in the left dataframe are included, even if they aren't in the right dataframe
- **Library**: A reusable collection of code; also referred to as a "package"
- **List**: A data structure that helps store and manipulate an ordered collection of items
- **List comprehension**: Formulaic creation of a new list based on the values in an existing list
- **loc[]**: Notation that is used to select pandas rows and columns by name
- **matplotlib**: A library for creating static, animated, and interactive visualizations in Python
- **merge()**: A pandas function that joins two dataframes together; it only combines data by extending along axis one horizontally
- **Module**: A simple Python file containing a collection of functions and global variables
- **Mutability**: The ability to change the internal state of a data structure
- **N-dimensional array**: The core data object of NumPy; also referred to as "ndarray"
- **NaN**: How null values are represented in pandas; stands for "not a number"
- **ndim**: A NumPy attribute used to check the number of dimensions of an array
- **Nested loop**: A loop inside of another loop
- **NumPy**: An essential library that contains multidimensional array and matrix data structures and functions to manipulate them
- **Outer join**: A way of combining data such that all of the keys from both dataframes get included in the merge
- **pandas**: A powerful library built on top of NumPy that's used to manipulate and analyze tabular data
- **pop()**: A method that extracts an element from a list by removing it at a given index
- **remove()**: A method that removes an element from a list
- **reshape()**: A NumPy method used to change the shape of an array
- **Right join**: A way of combining data such that all the keys in the right dataframe are included—even if they aren't in the left dataframe
- **Seaborn**: A visualization library based on matplotlib that provides a simpler interface for working with common plots and graphs
- **Sequence**: A positionally ordered collection of items
- **Series**: A one-dimensional, labeled array where the data type must be the same for all the data in a given series
- **Set**: A data structure in Python that contains only unordered, non-interchangeable elements
- **set()**: A function that takes an iterable as an argument and returns a new set object
- **shape**: A NumPy attribute used to check the shape of an array
- **symmetric_difference()**: A function that finds elements from both sets that are mutually not present in the other
- **Tabular data**: Data that is in the form of a table, with rows and columns
- **Tuple**: An immutable sequence that can contain elements of any data type
- **tuple()**: A function that transforms input into tuples
- **type()**: A function used to identify the type of data in a list
- **union()**: A function that finds all the elements from both sets
- **values()**: A dictionary method to retrieve only the dictionary's values
- **Vectorization**: A process that enables operations to be performed on multiple components of a data object at the same time
#### Course wrap-up
- Course 7 review: variables and data types → functions, operators, conditional statements, clean code → loops, strings (slicing, indexing, formatting) → data structures (lists, tuples, dictionaries, sets, arrays) → NumPy and pandas
- Reflect and connect with peers: Google Data Analytics Community
- Course 7 glossary (downloadable): https://www.coursera.org/learn/introduction-to-data-analysis-using-python/supplement/8q3FS
- Coming up next: **Google Data Analytics Capstone: Complete a Case Study** (→ [Course 8: Case Study](/blog/case-study/))
