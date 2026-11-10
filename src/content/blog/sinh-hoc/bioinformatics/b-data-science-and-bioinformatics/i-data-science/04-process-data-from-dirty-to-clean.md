---
title: 'Course 4: Process data from Dirty to Clean'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - data-science
  - course-04
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / I - Data
  Science
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/I - Data
  Science/04 - Process data from Dirty to Clean.md
url: /blog/process-data-from-dirty-to-clean/
topic: biology
updated: '2026-10-14'
order: 4
description: >-
  Data integrity: The accuracy, completeness, consistency, and trustworthiness
  of data throughout its lifecycle.
isIndex: false
---
### i. Module 1: The importance of integrity

#### Data integrity and analytics

- Data integrity: The accuracy, completeness, consistency, and trustworthiness of data throughout its lifecycle.

- Data replication: The process of storing data in multiple locations

- Data transfer: The process of copying data from a storage device to memory, or from one computer to another.

- Data manipulation: The process of changing data to make it more organized and easier to read

- Other threats to data integrity:

- Human error

- Viruses

- Malware

- Hacking

- System failures

| Data constraint | Definition | Examples |
| --- | --- | --- |
| Data type | Values must be of a certain type: date, number, percentage, Boolean, etc. | If the data type is a date, a single number like 30 would fail the constraint and be invalid |
| Data range | Values must fall between predefined maximum and minimum values | If the data range is 10-20, a value of 30 would fail the constraint and be invalid |
| Mandatory | Values can’t be left blank or empty | If age is mandatory, that value must be filled in |
| Unique | Values can’t have a duplicate | Two people can’t have the same mobile phone number within the same service area |
| Regular expression (regex) patterns | Values must match a prescribed pattern | A phone number must match ###-###-#### (no other characters allowed) |
| Cross-field validation | Certain conditions for multiple fields must be satisfied | Values are percentages and values from multiple fields must add up to 100% |
| Primary-key | (Databases only) value must be unique per column | A database table can’t have two rows with the same primary key value. A primary key is an identifier in a database that references a column in which each value is unique. More information about primary and foreign keys is provided later in the program. |
| Set-membership | (Databases only) values for a column must come from a set of discrete values | Value for a column must be set to Yes, No, or Not Applicable |
| Foreign-key | (Databases only) values for a column must be unique values coming from a column in another table | In a U.S. taxpayer database, the State column must be a valid state or territory with the set of acceptable values defined in a separate States table |
| Accuracy | The degree to which the data conforms to the actual entity being measured or described | If values for zip codes are validated by street location, the accuracy of the data goes up. |
| Completeness | The degree to which the data contains all desired components or measures | If data for personal profiles required hair and eye color, and both are collected, the data is complete. |
| Consistency | The degree to which the data is repeatable from different points of entry or collection | If a customer has the same address in the sales and repair databases, the data is consistent. |

- Well-aligned objectives and data: You can gain powerful insights and make accurate conclusions when data is well-aligned to business objectives. As a data analyst, alignment is something you will need to judge. Good alignment means that the data is relevant and can help you solve a business problem or determine a course of action to achieve a given business objective.

- Clean data + alignment to business objective = accurate conclusions

- Alignment to business objective + additional data cleaning = accurate conclusions

- Alignment to business objective + newly discovered variables + constraints = accurate conclusions

#### Overcome the challenges of insufficient data

- Types of insufficient data:

- Data from only one source

- Data that keeps updating

- Outdated data

- Geographically-limited data

- Ways to address insufficient data:

- Identify trends with the available data

- Wait for more data if time allows

- Talk with stakeholders and adjust your objective

- Look for a new dataset

- Data issues and possible solution:

- No data:

- Gather the data on a small scale to perform a preliminary analysis and then request additional time to complete the analysis after you have collected more data.

- If there isn’t time to collect data, perform the analysis using proxy data from other datasets. (This is the most common workaround.)

- Too little data:

- Do the analysis using proxy data along with actual data.

- Adjust your analysis to align with the data you already have.

- Wrong data, including data with errors

- If you have the wrong data because requirements were misunderstood, communicate the requirements again.

- Identify errors in the data and, if possible, correct them at the source by looking for a pattern in the errors.

- If you can’t correct data errors yourself, you can ignore the  wrong data and go ahead with the analysis if your sample size is still large enough and ignoring the data won’t cause systematic bias.

- Important note: Sometimes data with errors can be a warning sign that the data isn’t reliable. Use your best judgment.

![image_032](/vault-assets/image-032-0238919d.png)

- Population: All possible data values in a certain dataset.

- Sample size: A part of a population that is representative of the population

- Sample bias: A sample isn’t representative of the population as a whole

- Random sampling: A way of selecting a sample from a population so that every possible type of the sample has an equal chance of being chosen

- Margin of error: Since a sample is used to represent a population, the sample’s results are expected to differ from what the result would have been if you had surveyed the entire population. This difference is called the margin of error. The smaller the margin of error, the closer the results of the sample are to what the result would have been if you had surveyed the entire population.

- Confidence level: How confident you are in the survey results. For example, a 95% confidence level means that if you were to run the same survey 100 times, you would get similar results 95 of those 100 times. Confidence level is targeted before you start your study because it will affect how big your margin of error is at the end of your study.  
Having a 99% confidence level is ideal, but most industries hope for a least a 90% or 95% confidence level

- Confidence interval: The range of possible values that the population’s result would be at the confidence level of the study. This range is the sample result +/- the margin of error.

- Statistical significance: The determination of whether your result could be due to random chance or not. The greater the significance, the less due to chance.

- Things to remember when determining the size of your sample:

- When figuring out a sample size, here are things to keep in mind:

- Don’t use a sample size less than 30. It has been statistically proven that 30 is the smallest sample size where an average result of a sample starts to represent the average result of a population.

- The confidence level most commonly used is 95%, but 90% can work in some cases.

- Increase the sample size to meet specific needs of your project:

- For a higher confidence level, use a larger sample size

- To decrease the margin of error, use a larger sample size

- For greater statistical significance, use a larger sample size

- Note: Sample size calculators use statistical formulas to determine a sample size. More about these are coming up in the course!  Stay tuned.

- Why a minimum sample of 30: This recommendation is based on the Central Limit Theorem (CLT) in the field of probability and statistics. As sample size increases, the results more closely resemble the normal (bell-shaped) distribution from a large number of samples. A sample of 30 is the smallest sample size for which the CLT is still valid. Researchers who rely on regression analysis – statistical methods to determine the relationships between controlled and dependent variables – also prefer a minimum sample of 30.

- Sample sizes vary by business problem: Sample size will vary based on the type of business problem you are trying to solve.

- Larger sample sizes have a higher cost: You also have to weigh the cost against the benefits of more accurate results with a larger sample size. Someone who is trying to understand consumer preferences for a new line of products wouldn’t need as large a sample size as someone who is trying to understand the effects of a new drug. For drug safety, the benefits outweigh the cost of using a larger sample size. But for consumer preferences, a smaller sample size at a lower cost could provide good enough results.

- Knowing the basic is helpful:

- Knowing the basics will help you make the right choices when it comes to sample size. You can always raise concerns if you come across a sample size that is too small. A sample size calculator is also a great tool for this. Sample size calculators let you enter a desired confidence level and margin of error for a given population size. They then calculate the sample size needed to statistically achieve those results.

- Refer to the Determine the Best Sample Size video for a demonstration of a sample size calculator, or refer to the Sample Size Calculator reading for additional information.

- Pre-cleaning activities: Pre-cleaning steps are crucial before data cleaning to ensure accurate and reliable results. Without these steps, issues like missing or incorrect data, biased analysis, and inaccurate conclusions may arise. By conducting pre-cleaning tasks such as removing duplicates, handling missing values, and addressing outliers, the data quality is improved, leading to more effective data cleaning processes and analysis.

- Review data integrity:

- 1. Determine data integrity by assessing the overall accuracy, consistency, and completeness of the data.

- 2. Connect objectives to data by understanding how your business objectives can be served by an investigation into the data.

- 3. Know when to stop collecting data.

- Identify what makes data insufficient

- Deal with insufficient data

#### Test your data

- Statistical power: The probability of getting meaningful results from a test.

- Hypothesis testing: A way to see if a survey or experiment has meaningful results

- If a test is statistically significant, it means the results of the test are real and not an error caused by random chance.

- Usually, you need a statistical power of at least 0.8 or 80% to consider your results statistically significant

- Determine the best sample size: Sample Size Calculator

- Estimated response rate: If you are running a survey of individuals, this is the percentage of people you expect will complete your survey out of those who received the survey.

#### Consider the margin or error

- Margin of error: The maximum amount that the sample results are expected to differ from those of the actual population.

- Calculate margin of error: Margin of Error Calculator

  - Population size

  - Sample size

  - Confidence level

- Regular expression (RegEx): A rule that says the values in a table must match a prescribed pattern

- Mandatory: A data value that cannot be left blank or empty

- DATEDIF: A spreadsheet function that calculates the number of days, months, or years between two dates

- Data constraints: The criteria that determine whether a piece of a data is clean and valid

- Accuracy: The degree to which the data conforms to the actual entity being measured or described

- Completeness: The degree to which the data contains all desired components or measures

- Consistency: The degree to which data is repeatable from different points of entry or collection

- Cross-field validation: A process that ensures certain conditions for multiple data fields are satisfied

- Data range: Numerical values that fall between predefined maximum and minimum values

### ii. Module 2: Clean data for more accurate insights

#### Data cleaning is a must

- #1 cause of poor quality data = human error

- Dirty data: Data that is incomplete, incorrect, or irrelevant to the problem you’re trying to solve (→ [Data Mining](/blog/data-mining/))

| Types of dirty data | Description | Possible cause | Potential harm to businesses |
| --- | --- | --- | --- |
| Duplicate | Any data record that shows up more than once | Manual data entry, batch data imports, or data migration | Skewed metrics or analyses, inflated or inaccurate counts or prediction, or confusion during data retrieval |
| Outdated | Any data that is old which should be replaced with newer and more accurate information | People changing roles or companies, or software and systems becoming obsolete | Inaccurate insights, decision-making, and analytics |
| Incomplete | Any data that is missing important fields | Improper data collection or incorrect data entry | Decreased productivity, inaccurate insights, or inability to complete essential services |
| Incorrect/Inaccurate | Any data that is complete but inaccurate | Human error inserted during data input, fake information, or mock data | Inaccurate insights or decision-making based on bad information resulting in revenue loss |
| Inconsistent | Any data that uses different formats to represent the same thing | Data stored incorrectly or errors inserted during data transfer | Contradictory data points leading to confusion or inability to classify or segment customers |

- Business impact of dirty data: For further reading on the business impact of dirty data, enter the term “dirty data” into your preferred browser’s search bar to bring up numerous articles on the topic. Here are a few impacts cited for certain industries from a previous search:

- Banking: Inaccuracies cost companies between 15% and 25% of revenue (source).

- Digital commerce: Up to 25% of B2B database contacts contain inaccuracies (source).

- Marketing and sales: 99% of companies are actively tackling data quality in some way (source).

- Healthcare: Duplicate records can be 10% and even up to 20% of a hospital’s electronic health records (source).

- Clean data: Data that is complete, correct, and relevant to the problem you’re trying to solve (→ [Statistic and Regression](/blog/statistic-and-regression/))

- Data engineers: Transform data into a useful format for analysis and give it a reliable infrastructure

- Data warehouse specialists: Develop processes and procedures to effectively store and organize data

- Field: A single piece of information from a row or column of a spreadsheet.

- Field length: A tool for determining how many characters can be keyed into a field

- Data validation: A tool for checking the accuracy and quality of data before adding or importing it

#### First step toward clean data

- How to remove unwanted data, clean up text to remove extra spaces and blanks, fix typos, and make formatting consistent.

- However, before removing unwanted data, it's always a good practice to make a copy of the data set. That way, if you remove something that you end up needing in the future, you can easily access it and put it back in the data set.

- Once that's done, then you can move on to getting rid of the duplicates or data that isn't relevant to the problem you're trying to solve.

- Typically, duplicates appear when you're combining data sets from more than one source or using data from multiple departments within the same business.

- Irrelevant data, which is data that doesn't fit the specific problem that you're trying to solve, also needs to be removed. Removing irrelevant data takes a little more time and effort because you have to figure out the difference between the data you need and the data you don't.

- The next step is removing extra spaces and blanks. Extra spaces can cause unexpected results when you sort, filter, or search through your data. And because these characters are easy to miss, they can lead to unexpected and confusing results.

- Fixing misspellings

- Inconsistent capitalization

- Incorrect punctuation and other typos

- The next step is removing formatting. This is particularly important when you get data from lots of different sources. Every database has its own formatting, which can cause the data to seem inconsistent. Creating a clean and consistent visual appearance for your spreadsheets will help make it a valuable tool for you and your team when making key decisions. Most spreadsheet applications also have a "clear formats" tool, which is a great time saver.

- Cleaning data is an essential step in increasing the quality of your data. Now you know lots of different ways to do that.

- Merger: An agreement that unites two organizations into a single new one

- Data merging: The process of combining two or more datasets into a single dataset

- Do I have all the data I need?

- Does the data I need exist within these datasets

- Does the data need to be cleaned, or are they ready for me to use?

- Common mistakes to avoid:

- Not checking for spelling errors: Misspellings can be as simple as typing or input errors. Most of the time the wrong spelling or common grammatical errors can be detected, but it gets harder with things like names or addresses. For example, if you are working with a spreadsheet table of customer data, you might come across a customer named “John” whose name has been input incorrectly as “Jon” in some places. The spreadsheet’s spellcheck probably won’t flag this, so if you don’t double-check for spelling errors and catch this, your analysis will have mistakes in it.

- Forgetting to document errors: Documenting your errors can be a big time saver, as it helps you avoid those errors in the future by showing you how you resolved them. For example, you might find an error in a formula in your spreadsheet. You discover that some of the dates in one of your columns haven’t been formatted correctly. If you make a note of this fix, you can reference it the next time your formula is broken, and get a head start on troubleshooting. Documenting your errors also helps you keep track of changes in your work, so that you can backtrack if a fix didn’t work.

- Not checking for misfielded values: A misfielded value happens when the values are entered into the wrong field. These values might still be formatted correctly, which makes them harder to catch if you aren’t careful. For example, you might have a dataset with columns for cities and countries. These are the same type of data, so they are easy to mix up. But if you were trying to find all of the instances of Spain in the country column, and Spain had mistakenly been entered into the city column, you would miss key data points. Making sure your data has been entered correctly is key to accurate, complete analysis.

- Overlooking missing values: Missing values in your dataset can create errors and give you inaccurate conclusions. For example, if you were trying to get the total number of sales from the last three months, but a week of transactions were missing, your calculations would be inaccurate.  As a best practice, try to keep your data as clean as possible by maintaining completeness and consistency. (→ [Thao tác dữ liệu trong R](/blog/cac-thao-tac-voi-du-lieu-trong-r/))

- Only looking at a subset of the data: It is important to think about all of the relevant data when you are cleaning. This helps make sure you understand the whole story the data is telling, and that you are paying attention to all possible errors. For example, if you are working with data about bird migration patterns from different sources, but you only clean one source, you might not realize that some of the data is being repeated. This will cause problems in your analysis later on. If you want to avoid common errors like duplicates, each field of your data requires equal attention.

- Losing track of business objectives: When you are cleaning data, you might make new and interesting discoveries about your dataset-- but you don’t want those discoveries to distract you from the task at hand. For example, if you were working with weather data to find the average number of rainy days in your city, you might notice some interesting patterns about snowfall, too. That is really interesting, but it isn’t related to the question you are trying to answer right now. Being curious is great! But try not to let it distract you from the task at hand.

- Not fixing the source of the error: Fixing the error itself is important. But if that error is actually part of a bigger problem, you need to find the source of the issue. Otherwise, you will have to keep fixing that same error over and over again. For example, imagine you have a team spreadsheet that tracks everyone’s progress. The table keeps breaking because different people are entering different values. You can keep fixing all of these problems one by one, or you can set up your table to streamline data entry so everyone is on the same page. Addressing the source of the errors in your data will save you a lot of time in the long run.

- Not analyzing the system prior to data cleaning: If we want to clean our data and avoid future errors, we need to understand the root cause of your dirty data. Imagine you are an auto mechanic. You would find the cause of the problem before you started fixing the car, right? The same goes for data. First, you figure out where the errors come from. Maybe it is from a data entry error, not setting up a spell check, lack of formats, or from duplicates. Then, once you understand where bad data comes from, you can control it and keep your data clean.

- Not backing up your data prior to data cleaning: It is always good to be proactive and create your data backup before you start your data clean-up. If your program crashes, or if your changes cause a problem in your dataset, you can always go back to the saved version and restore it. The simple procedure of backing up your data can save you hours of work-- and most importantly, a headache.

- Not accounting for data cleaning in your deadlines/process: All good things take time, and that includes data cleaning. It is important to keep that in mind when going through your process and looking at your deadlines. When you set aside time for data cleaning, it helps you get a more accurate estimate for ETAs for stakeholders, and can help you know when to request an adjusted ETA.

![image_033](/vault-assets/image-033-b6c6d2eb.png)

- CLEAN DTA:

  - Delete fields that contain nulls values: Data/Create Filter/Filter by condition/Is null/Delete the ro

  - Transposing data (Hoán vị/Chuyển vị): convert the data from the current long format (more rows than columns) to the wide format (more columns than rows): Highlight and copy data/Right-clink on the cell you want the transposed data to start/Paste Special/Transposed/Delete previous data and by its columns.

  - Eliminate the extra spaces in the values of the cell:

- Google Sheet: Data (Dữ liệu)/Data cleanup (Dọn sạch dữ liệu)/Trim whitespace (Cắt bỏ khoảng trắng).

- Excel: TRIM()

- Change lower/uppercase/proper case text:

- Excel

- Google sheet: Add-Ons/Get add-ons/ChangeCase/Install/Select column you want to make changes/Add-Ons/ChangeCase/All uppercase

- Delete all formatting:

- Select the data for which you want to delete the formatting

- Format/Clear Formatting

#### Continue cleaning data in spreadsheets

- Conditional formatting: A spreadsheet tool that changes how cells appear when values meet specific conditions

- Selecting the range we want to search

- Format/Conditional formatting

- Format rules, Format Styles

- Remove duplicate: A tool that automatically searches for and eliminates duplicate entries from a spreadsheet (Before make any changes like this, make a copy of raw data): Data/Data Cleanup/Remove Duplicate

- Text string: A group of characters within a cell, most often composed of letters.

- Substring: A smaller subset of a text string

- Split: A tool that divides text around a specified character and puts each fragment into a new, separate cell

- Specified text separator = delimiter

- Select data you want to split/Data/Split text to column

- Concatenate: A function that join multiple text strings into a single string

- COUNTIF: A function that returns the number of cells that match a specified value

- LEN: A function that tells you the length of a text string by counting the number of character it contains

- LEFT: A function that gives you a set number of characters from the left side of a text string

- RIGHT: A function that gives you a set number of characters from the right side of a text string

- MID: A function that gives you a segment from the middle of a text string

- TRIM: A function that remove leading, trailing, and repeated spaces in data

- Workflow automation: is the process of automating parts of your work. That could mean creating an event trigger that sends a notification when a system is updated. Or it could mean automating parts of the data cleaning process. As you can probably imagine, automating different parts of your work can save you tons of time, increase productivity, and give you more bandwidth to focus on other important aspects of the job.

- What can be automated:

| Task | Can it be automated? | Why? |
| --- | --- | --- |
| Communicating with your team and stakeholders | No | Communication is key to understanding the needs of your team and stakeholders as you complete the tasks you are working on. There is no replacement for person-to-person communications. |
| Presenting your findings | No | Presenting your data is a big part of your job as a data analyst. Making data accessible and understandable to stakeholders and creating data visualizations can’t be automated for the same reasons that communications can’t be automated. |
| Preparing and cleaning data | Partially | Some tasks in data preparation and cleaning can be automated by setting up specific processes, like using a programming script to automatically detect missing values. |
| Data exploration | Partially | Sometimes the best way to understand data is to see it. Luckily, there are plenty of tools available that can help automate the process of visualizing data. These tools can speed up the process of visualizing and understanding the data, but the exploration itself still needs to be done by a data analyst. |
| Modeling the data | Yes | Data modeling is a difficult process that involves lots of different factors; luckily there are tools that can completely automate the different stages. |

- One of the most important ways you can streamline your data cleaning is to clean data where it lives. This will benefit your whole team, and it also means you don’t have to repeat the process over and over. For example, you could create a programming script that counted the number of words in each spreadsheet file stored in a specific folder. Using tools that can be used where your data is stored means that you don’t have to repeat your cleaning steps, saving you and your team time and energy.

- There are a lot of tools out there that can help automate your processes, and those tools are improving all the time. Here are a few articles or blogs you can check out if you want to learn more about workflow automation and the different tools out there for you to use:

- Towards Data Science’s Automating Scientific Data Analysis

- MIT News’ Automating Big-Data Analysis

- TechnologyAdvice’s 10 of the Best Options for Workflow Automation Software

- Different data perspectives: different methods data analysts use to view data differently and how looking at different views leads to more efficient and effective data cleaning.

- Pivot table: A pivot table is a data summarization tool. It can be used in data processing and in data cleaning, for which pivot tables offer a quick, clutter-free view of your data. Pivot tables help sort, reorganize, group, count, total, or average data in a dataset: Select the data you will include/Insert/Pivot Table/New sheet/Create/Pivot table editor

- VLOOKUP: VLOOKUP is a spreadsheet function that vertically searches for a certain value in a column to return a corresponding piece of information. It's rare for all of the data an analyst will need to be in the same place. Usually, you'll have to search across multiple sheets or even different databases. VLOOKUP helps bring the information together.

- Plotting: The plotting tool allows analysts to quickly create a graph, chart, table, or other visual from data. Plotting is useful for identifying skewed data or outliers: Select data you want to plot/Insert/Chart

- Data mapping: The process of matching fields from on data source to another

- Compatibility: How well two or more datasets are able to work together.

- Cleaning checklist: Start developing your personal approach to cleaning data by creating a checklist to help you identify problems in your data efficiently and identify the scale and scope of your dataset. Think of this checklist as your default “what to search for” list:

- Determine the size of the dataset: Large datasets may have more data quality issues and take longer to process. This may impact your choice of data cleaning techniques and how much time to allocate to the project.

- Determine the number of categories or labels: By understanding the number and nature of categories and labels in a dataset, you can better understand the diversity of the dataset. This understanding also helps inform data merging and migration strategies.

- Identify missing data: Recognizing missing data helps you understand data quality so you can take appropriate steps to remediate the problem. Data integrity is important for accurate and unbiased analysis.

- Identify unformatted data: Identifying improperly or inconsistently formatted data helps analysts ensure data uniformity. This is essential for accurate analysis and visualization.

- Explore the different data types: Understanding the types of data in your dataset (for instance, numerical, categorical, text) helps you select appropriate cleaning methods and apply relevant data analysis techniques.

### iii. Module 3: Cleaning data with SQL

#### SQL for sparkling clean data

- SQL: a structured query language that analysts use to work with databases. Data analysts usually use SQL to deal with large datasets because it can handle huge amounts of data.

- Before analysis, data analyst needs to choose what tool to use. First, they have to think about where the data lives. If it is stored in a database, then SQL is the best tool for the job. But if it is stored in a spreadsheet, then they will have to perform their analysis in that spreadsheet.

| Features of Spreadsheets | Feature of SQL databases |
| --- | --- |
| Small data sets Enter data manually Create graphs and visualizations in the same program Built-in spell check and other useful functions Best when working solo on a project Generated with a program Access to the data you input Stored locally | Larger datasets Access tables across a database Prepare data for further analysis in another software Fast and powerful functionality Great for collaborative work and tracking queries run by all users A language used to interact with database program Can pull information from different sources in the database Stored across a database |

- SQL dialects and their uses: Learning SQL can be a lot like learning a new language—including the fact that languages usually have different dialects within them. Some database products have their own variant of SQL, and these different varieties of SQL dialects are what help you communicate with each database product. These dialects will be different from company to company and might change over time if the company moves to another database system. So, a lot of analysts start with Standard SQL and then adjust the dialect they use based on what database they are working with. Standard SQL works with a majority of databases and requires a small number of syntax changes to adapt to other dialects.

- LearnSQL’s blog, What Is a SQL Dialect, and Which One Should You Learn?

- Software Testing Help’s article, Differences Between SQL Vs MySQL vs SQL Server

- Datacamp’s blog, SQL Server, PostgreSQL, MySQL... what's the difference? Where do I start?

- Note that there is an error in this blog article. The comparison table incorrectly states that SQlite uses subqueries instead of window functions. Refer to the SQLite Window Functions documentation for proper clarification.

- SQL Tutorial’s tutorial, What is SQL

- How data is measured: All information in a computer is represented as a binary number consisting solely of 0’s and 1’s. Each 0 or 1 in a number is a bit, which is the smallest unit of storage in computers. Data is measured by the number of bits it takes to represent it. This is then described in bytes, which are equal to 8 bits.

| Unit | Abbreviation | Equivalent to | Example (with approximate size) |
| --- | --- | --- | --- |
| Byte | B | 8 bits | 1 character in a string (1 byte) |
| Kilobyte | KB | 1024 bytes | A page of text (4 kilobytes) |
| Megabyte | MB | 1024 Kilobytes | 1 song in MP3 format (2-3 megabytes) |
| Gigabyte | GB | 1024 Megabytes | 300 songs in MP3 format (1 gigabyte) |
| Terabyte | TB | 1024 Gigabytes | 500 hours of HD video (1 terabyte) |
| Petabyte | PB | 1024 Terabytes | 10 billion Facebook photos (1 petabyte) |
| Exabyte | EB | 1024 Petabytes | 500 million hours of HD video (1 exabyte) |
| Zettabyte | ZB | 1024 Exabytes | All the data on the internet in 2019 (4.5 ZB) |

- Dataset size is important: The size of the dataset you’re working with usually determines which tool—spreadsheets or SQL—is best suited for the task. Spreadsheets often start to have performance issues as dataset sizes increase beyond a few megabytes. SQL databases are much better at working with larger datasets that have billions of rows with sizes measured in gigabytes. Yet the dataset’s size still matters here: Even in SQL, it takes longer for queries to complete when they’re run on longer datasets, depending on the query’s content and the number of rows SQL has to process.

#### Learn basic SQL queries

- Clean string variables using SQL: (→ [Subquery & CASE WHEN](/blog/subquery-and-case-when/))

- Remove duplicate: 
SELECT
DISTINCT
FROM

- Check consistent of string variables: LENGTH/LEN

#### Transforming data

- CAST(): Can be used to convert anything from one data type to another

- ORDER BY
column name DESC: Sorting

- Float: A number that contains a decimal

- Typecasting: Converting data from one type to another

- CONCAT(): Adds string together to create new text strings that can be used as unique keys

- COALESCE(): Can be used to return non-null values in a list

### iv. Module 4: Verify and report on cleaning results

#### Manually cleaning data

- Verification: A process to confirm that a data-cleaning effort was well-executed and the resulting data is accurate and reliable

- Changelog: A file containing a chronologically ordered list of modifications made to a project

- Steps of verification process:

- Going back to the original unclean data set and comparing it to what you have now

- See the big picture when verifying data-cleaning

- Consider the business problem

- Consider the goal

- Consider the data

- Find and replace: A tool that looks for specified search term in a spreadsheet and allows you to replace it with something else

- CASE statement: The CASE statement goes through one or more conditions and returns a value as soon as a condition is met

- Data-cleaning verification checklist:

- Correct the most common problems:

- Sources of errors: Did you use the right tools and functions to find the source of the errors in your dataset?

- Null data: Did you search for NULLs using conditional formatting and filters?

- Misspelled words: Did you locate all misspellings?

- Mistyped numbers: Did you double-check that your numeric data has been entered correctly?

- Extra spaces and characters: Did you remove any extra spaces or characters using the TRIM function?

- Duplicates: Did you remove duplicates in spreadsheets using the Remove Duplicates function or DISTINCT in SQL?

- Mismatched data types: Did you check that numeric, date, and string data are typecast correctly?

- Messy (inconsistent) strings: Did you make sure that all of your strings are consistent and meaningful?

- Messy (inconsistent) date formats: Did you format the dates consistently throughout your dataset?

- Misleading variable labels (columns): Did you name your columns meaningfully?

- Truncated data: Did you check for truncated or missing data that needs correction?

- Business Logic: Did you check that the data makes sense given your knowledge of the business?

- Review the goal of your project:

- Confirm the business problem

- Confirm the goal of the project

- Verify that data can solve the problem and is aligned to the goal.

#### Document the cleaning process

- Documentation: The process of tracking changes, additions, deletions, and errors involved in your data-cleaning effort

- Recover data-cleaning errors

- Inform other users of changes

- Determine quality of data

- The instructor stated that the first two benefits of documentation --1) recalling the errors that were cleaned and 2) informing others of the changes -- assume that the data errors aren't fixable. She then added that when the data errors are fixable, the documentation needs to record how the data was fixed. Data-cleaning documentation is important in both cases.

- Engineers use engineering change orders (ECOs) to keep track of new product design details and proposed changes to existing products. Writers use document revision histories to keep track of changes to document flow and edits. And data analysts use changelogs to keep track of data transformation and cleaning.

- Most software applications have a kind of history tracking built in. For example, in Google sheets, you can check the version history of an entire sheet or an individual cell and go back to an earlier version. In Microsoft Excel, you can use a feature called Track Changes. And in BigQuery, you can view the history to check what has changed. Here’s how it works:

| Google Sheets | 1. Right-click the cell and select Show edit history. 2. Click the left-arrow < or right arrow > to move backward and forward in the history as needed. |
| --- | --- |
| Microsoft Excel | 1. If Track Changes has been enabled for the spreadsheet: click Review. 2. Under Track Changes, click the Accept/Reject Changes option to accept or reject any change made. |
| BigQuery | Bring up a previous version (without reverting to it) and figure out what changed by comparing it to the current version. |

- A changelog can build on your automated version history by giving you an even more detailed record of your work. This is where data analysts record all the changes they make to the data. Here is another way of looking at it. Version histories record what was done in a data change for a project, but don't tell us why. Changelogs are super useful for helping us understand the reasons changes have been made. Changelogs have no set format and you can even make your entries in a blank document. But if you are using a shared changelog, it is best to agree with other data analysts on the format of all your log entries.

- Typically, a changelog records:

- Data, file, formula, query, or any other component that changed

- Description of what changed

- Date of the change

- Person who made the change

- Person who approved the change

- Version number

- Reason for the change

- If an analyst is making changes to an existing SQL query that is shared across the company, the company most likely uses what is called a version control system. An example might be a query that pulls daily revenue to build a dashboard for senior management. Here's how a version control system affects a change to a query:

  - A company has official versions of important queries in their version control system.

  - An analyst makes sure the most up-to-date version of the query is the one they will change. This is called syncing

  - The analyst makes a change to the query.

  - The analyst might ask someone to review this change. This is called a code review and can be informally or formally done. An informal review could be as simple as asking a senior analyst to take a look at the change.

  - After a reviewer approves the change, the analyst submits the updated version of the query to a repository in the company's version control system. This is called a code commit. A best practice is to document exactly what the change was and why it was made in a comments area. Going back to our example of a query that pulls daily revenue, a comment might be: Updated revenue to include revenue coming from the new product, Calypso.

  - After the change is submitted, everyone else in the company will be able to access and use this new query when they sync to the most up-to-date queries stored in the version control system.

  - If the query has a problem or business needs change, the analyst can undo the change to the query using the version control system. The analyst can look at a chronological list of all changes made to the query and who made each change. Then, after finding their own change, the analyst can revert to the previous version.

  - The query is back to what it was before the analyst made the change. And everyone at the company sees this reverted, original query, too.

- A changelog for a personal project may take any form desired. However, in a professional setting and while collaborating with others, readability is important. These guiding principles help to make a changelog accessible to others:

- Changelogs are for humans, not machines, so write legibly.

- Every version should have its own entry.

- Each change should have its own line.

- Group the same types of changes. For example, Fixed should be grouped separately from Added.

- Versions should be ordered chronologically starting with the latest.

- The release date of each version should be noted.

- All the changes for each category should be grouped together. Types of changes usually fall into one of the following categories:

- Added: new features introduced

- Changed: changes in existing functionality

- Deprecated: features about to be removed

- Removed: features that have been removed

- Fixed: bug fixes

- Security: lowering vulnerabilities

- Common data errors:

- Human error in data entry

- Flawed processes

- System issues

![image_034](/vault-assets/image-034-841115ce.png)

- The IMPORTRANGE function in Google Sheets and the Paste Link feature (a Paste Special option in Microsoft Excel) both allow you to insert data from one sheet to another. Using these on a large amount of data is more efficient than manual copying and pasting. They also reduce the chance of errors being introduced by copying and pasting the wrong data. They are also helpful for data cleaning because you can “cherry pick” the data you want to analyze and leave behind the data that isn’t relevant to your project. Basically, it is like canceling noise from your data so you can focus on what is most important to solve your problem. This functionality is also useful for day-to-day data monitoring; with it, you can build a tracking spreadsheet to share the relevant data with others. The data is synced with the data source so when the data is updated in the source file, the tracked data is also refreshed.

- In Google Sheets, you can use the IMPORTRANGE function. It enables you to specify a range of cells in the other spreadsheet to duplicate in the spreadsheet you are working in. You must allow access to the spreadsheet containing the data the first time you import the data.

- The QUERY function is also useful when you want to pull data from another spreadsheet. The QUERY function's SQL-like ability can extract specific data within a spreadsheet. For a large amount of data, using the QUERY function is faster than filtering data manually. This is especially true when repeated filtering is required. For example, you could generate a list of all customers who bought your company’s products in a particular month using manual filtering. But if you also want to figure out customer growth month over month, you have to copy the filtered data to a new spreadsheet, filter the data for sales during the following month, and then copy those results for the analysis. With the QUERY function, you can get all the data for both months without a need to change your original dataset or copy results.

- The QUERY function syntax is similar to IMPORTRANGE. You enter the sheet by name and the range of data that you want to query from, and then use the SQL SELECT command to select the specific columns. You can also add specific criteria after the SELECT statement by including a WHERE statement. But remember, all of the SQL code you use has to be placed between the quotes!

- Google Sheets run the Google Visualization API Query Language across the data. Excel spreadsheets use a query wizard to guide you through the steps to connect to a data source and select the tables. In either case, you are able to be sure that the data imported is verified and clean based on the criteria in the query.

- The FILTER function is fully internal to a spreadsheet and doesn’t require the use of a query language. The FILTER function lets you view only the rows (or columns) in the source data that meet your specified conditions. It makes it possible to pre-filter data before you analyze it.

- The FILTER function might run faster than the QUERY function. But keep in mind, the QUERY function can be combined with other functions for more complex calculations. For example, the QUERY function can be used with other functions like SUM and COUNT to summarize data, but the FILTER function can't.

v. Module 5: Add data to your resume

- Summary:

- Problem

- Action

- Result

- Skills: Spreadsheets, SQL, R, Tableau

  - Programming languages: SQL, R

- Job title: Junior or associate data analysts

- Healthcare analyst

- Marketing analyst

- Business intelligence analyst

- Financial analyst

- Ethical considerations: Data analysts often have access to a great deal of data and must consider what's right and fair when collecting and interpreting it. It’s important to establish and follow ethical guidelines for data use, some of which are included below:

  - Informed consent: Obtain informed and voluntary consent from individuals before collecting their data. This ensures that people are aware of how their data will be used and gives them the opportunity to make an informed decision about data sharing.

  - Anonymity and confidentiality: Protect the privacy of individuals through de-identification and confidentiality measures. This guideline helps prevent unauthorized access to sensitive data and maintains trust in data handling.

  - Data security: Implement robust data security measures to safeguard data from breaches and unauthorized access. Data security is foundational for protecting individuals' information.

  - Transparency: Transparency in data use practices is critical for building trust. Clearly communicate how data is collected, processed, and shared.

  - Data ownership and control:  Make sure to give people control over their data, including the ability to access, correct, or delete it.

- If your team is small or lacks diversity, there are steps you can take to identify and mitigate bias in data collection and analysis:

- Educate yourself on unconscious bias and its impact on data analysis.

- Review data collection methods to find and fix bias in tools and survey questions.

- Be transparent in documenting all aspects of your data collection and analysis methods to allow others to review and identify potential biases in your methodology.

- Consult with diverse data experts and seek peer reviews from colleagues with diverse perspectives.

- Engage in continuous learning and in discussions with other data analysts to stay up to date on the latest research and techniques.
