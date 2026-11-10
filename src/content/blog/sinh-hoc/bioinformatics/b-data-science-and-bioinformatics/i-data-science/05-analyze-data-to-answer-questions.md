---
title: 'Course 5: Analyze Data to Answer Questions'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - data-science
  - course-05
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / I - Data
  Science
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/I - Data
  Science/05 - Analyze Data to Answer Questions.md
url: /blog/analyze-data-to-answer-questions/
topic: biology
updated: '2026-10-17'
order: 5
description: >-
  Get support during analysis Asking peers or members Note: If the units of
  measurement in the timestamp columns are expressed in hours, adding 1 (day) to
  the formula would incorrectly calculate the results as a negative v
isIndex: false
---
## Module 1: Organize data for more effective analysis
### Organize data for analysis
- [Analysis]: The process used to make sense of the data collected.
- The goal of analysis is to identify trends and relationships within data so you can accurately answer the question you’re asking
- The 4 phases of analysis: (→ [Data Exploration Using Descriptive Statistics](/blog/data-exploration-using-descriptive-statistics/))
	- Organize data
	- Format and adjust data
	- Get input from others
	- Transform data
- The first two phases of data analysis, Organize data and Format and adjust data, are important for data analysts because they can use these phases to manipulate their data in ways that make important patterns and trends more obvious. Most of the datasets you’ll use as a data analyst will be organized as tables. Tables are helpful because they let you manipulate and categorize your data. Having distinct categories and classifications lets you focus on, and differentiate between, the groups in your data quickly and easily.
- Sorting and filtering are two methods you can use to organize, format, and adjust data. (→ [Phân tích CSDL trên Excel](/blog/phan-tich-co-so-du-lieu/))
	- [Sort data]:
		- Sorting is the process of arranging data into a meaningful order to make it easier to understand, analyze, and visualize. It ranks your data based on a specific metric you choose. You can sort data in spreadsheets, SQL databases (when your dataset is too large for spreadsheets), and tables in documents.
		- To rank items or create chronological lists, you can sort by ascending or descending order. Sorting arranges the data in a meaningful way and gives you immediate insights. Sorting also helps you to group similar data together by a classification. For example, if a ski resort design company wants to evaluate the resorts designed by a competitor, a data analyst can sort competitive resorts by locations, runs, acreage, and other factors. This way, the firm’s designers can visit the types of resorts they also design and gather information that could be used in its own future designs.
	- [Filter data]: Sometimes, an analysis may require only a subset of the data in your dataset. You can use a filter to show only the data that meets a specified criteria while hiding the rest. Filtering is useful when you have lots of data. You can save time by zeroing in on the data that’s important for your current analysis or the data that contains errors. Most spreadsheets and SQL databases allow you to filter your data in a variety of ways. Filtering gives you the ability to find what you are looking for without too much effort.
- [Sort a pivot table]: A pivot table is a data summarization tool used to sort, reorganize, group, count, total, or average data. Items in the row and column areas of a pivot table are sorted in ascending order by any custom list first. If the items aren’t in a custom list, they will be sorted in ascending order by default. But, if you sort in descending order, you are setting up a rule that controls how the field is sorted even after new data points are added.
### Sort data in spreadsheets
- [Sort sheet]: All of the data in a spreadsheet is sorted by the ranking of a specific sorted column - data across rows is kept together
- [Sort range]: Nothing else on the spreadsheet is rearranged besides the specified cells in a column
- [Customized sort order]: When you sort data in a spreadsheet using multiple conditions
### Sort data using SQL
- [WHERE]: Filtering
- [AND]: Adding conditions to filter
- [ORDER BY] (ASC/DESC): sorting (Always the last clause) (→ [Sắp xếp & Tìm kiếm](/blog/sap-xep-and-tim-kiem/))
- Organize and analyze your data in a meaningful way
- Find highest or lowest values in a dataset
- Compare data across different dimensions
## Module 2: Format and adjust data
- Formatting for better analysis
- Incorrectly formatted data can:
- Lead to mistakes
- Take time to fix
- Affect stakeholder’s decision-making
- CONVERT(value, start_unit, end_unit): Converts a numeric value to a different unit of measure
- Convert data in spreadsheets
- Data validation (Function): Allows you to control what can and can’t be entered in your worksheet
	- Add dropdown lists with predetermined options: Data/Data Validation/+Add rule/List of items
	- Create custom checkbox: Data/Data Validation/+Add rule/Checkbox
	- Protect structured data and formulas: Reject Input
- Paste values only: ensure spreadsheet values are static, rather than carrying over a preexisting formula or function.
- Conditional formatting: A spreadsheet tool that changes how cells appear when values meet specific conditions.
- Format/Conditional formatting/Select data range/Format rule/Formatting style
- The CAST function:
- Full list of functions and associated rule to CAST function in SQL
- CAST is an American National Standards Institute (ANSI) function used in lots of programming languages, including BigQuery. This section provides the BigQuery syntax and examples of converting the data types in the first column of the previous table. The syntax for the CAST function is as follows: CAST(expression AS typename)
- Where expression is the data to be converted and typename is the data type to be returned.
- Converting a number to a string: The following CAST statement returns a string from a numeric identified by the variable MyCount in the table called MyTable. 
SELECT CAST(MyCount AS STRING) FROM MyTable
- SELECT indicates that you will be selecting data from a table
- CAST indicates that you will be converting the data you select to a different data type
- AS comes before and identifies the data type which you are casting to
- STRING indicates that you are converting the data to a string
- FROM indicates which table you are selecting the data from
- Converting a string to a number: The following CAST statement returns an integer from a string identified by the variable MyVarcharCol in the table called MyTable. (An integer is any whole number.) 
SELECT CAST(MyVarcharCol AS INT) FROM MyTable
- SELECT indicates that you will be selecting data from a table
- CAST indicates that you will be converting the data you select to a different data type
- AS comes before and identifies the data type which you are casting to
- INT indicates that you are converting the data to an integer
- FROM indicates which table you are selecting the data from
- Converting a date to a string: The following CAST statement returns a string from a date identified by the variable MyDate in the table called MyTable. 
SELECT CAST(MyDate AS STRING) FROM MyTable
- SELECT indicates that you will be selecting data from a table
- CAST indicates that you will be converting the data you select to a different data type
- AS comes before and identifies the data type which you are casting to
- STRING indicates that you are converting the data to a string
- FROM indicates which table you are selecting the data from
- Converting a date to a datetime: Datetime values have the format of YYYY-MM-DD hh: mm: ss format, so date and time are retained together. The following CAST statement returns a datetime value from a date. 
SELECT CAST (MyDate AS DATETIME) FROM MyTable
- SELECT indicates that you will be selecting data from a table
- CAST indicates that you will be converting the data you select to a different data type
- AS comes before and identifies the data type which you are casting to
- DATETIME indicates that you are converting the data to a datetime value
- FROM indicates which table you are selecting the data from
- The SAFE_CAST function: Using the CAST function in a query that fails returns an error in BigQuery. To avoid errors in the event of a failed query, use the SAFE_CAST function instead. The SAFE_CAST function returns a value of Null instead of an error when a query fails.
- The syntax for SAFE_CAST is the same as for CAST. Simply substitute the function directly in your queries. The following SAFE_CAST statement returns a string from a date:
SELECT SAFE_CAST(MyDate AS STRING) FROM MyTable
- Combine multiple datasets
- Import data: Both spreadsheets and SQL include functionality that enables you to import data.
- Import data in spreadsheets: As you learned earlier, in spreadsheets you use the IMPORTRANGE function to import a range of cells from another spreadsheet into your current spreadsheet. The syntax is: =IMPORTRANGE(spreadsheet_url, range_string). In this formula, spreadsheet_url is the URL of the spreadsheet from which you want to import data. The specific cells you want to import, such as A2:B6, are specified by range_string. If the spreadsheet has multiple tabs, you also need to specify the name of the tab as part of the range.
- Import data in SQL: In contrast to spreadsheets, SQL does not include a function for importing data. Instead, a method you can use to import data from one table to another is to use the INSERT INTO command together with a SELECT statement. The syntax is: 
INSERT INTO [destination_table_name]
SELECT [column names, separated by commas, or * for all columns]
FROM [source_table_name]
WHERE [condition]
- In this syntax, the SQL query inserts rows from a source table into a destination table based on the WHERE clause.
- Combine data: In both spreadsheets and SQL, joining together text strings is referred to as concatenation.
- Combine data in spreadsheets: In spreadsheets, you use the CONCATENATE function to join together two or more text strings, such as combining street addresses and primary contacts in a business’ vendor database.
- The basic syntax is =CONCATENATE(item 1, item 2). You can add multiple items by separating them with commas. Where appropriate, such as when you’re combining a customer’s first and last name, you should add a space between the items you’re combining by typing quotation marks space quotation marks [“ ”] between the items. Separate this information by a comma as well. This would change the formula to: =CONCATENATE(item 1, " ", item 2).
- Combine data in SQL: In SQL, use the CONCAT function to join strings together to create new text strings. You might combine data simply to improve the readability of reports (such as combining a customer’s first and last name when generating a customer list). Or, you might combine data to generate a unique identifier for the rows in a table. Here is the basic syntax:
SELECT CONCAT(field1, " ", field2)
FROM [table_name]
- Notice that this syntax includes " " so that there is a space between the combined fields. With this syntax, SQL combines field1 and field2 with a space between them.
- By default, SQL includes the field names as headers when you run a query. However, if you use the CONCAT function, SQL doesn’t know what to use as a header. For this reason, you should include an alias for the combined fields to help with readability. You give the combined fields an alias by using AS:
SELECT CONCAT(field1, " ", field2) AS alias
FROM [table_name]
- Strings in spreadsheet:
- LEN: Length of a string
- LEFT, RIGHT: Choose part of the string to isolate in a new column
- FIND: locate specific characters in a string (Case sensitive)

![image_035](/vault-assets/image-035-837a1a21.png)

- Get support during analysis
- Asking peers or members
- Note: If the units of measurement in the timestamp columns are expressed in hours, adding 1 (day) to the formula would incorrectly calculate the results as a negative value, thus causing an error in the cell.
- Update: Since 1 day = 24 hours, you could substitute the number "24" to satisfy the following statement: Add 24 minus the start time to the formula that's being used for the multi-day trip; then try to apply to another trip that happened in the same day.
- As a result of the different units of measurement as described in the last pop-up, the following formula would calculate the correct solution:
=IF(end>start, end-start, 24+end-sta
- https://www.coursera.org/learn/analyze-data/supplement/6Vp5U/advanced-spreadsheet-tips-and-tricks
- Best practices for searching online:
- Thinking skills
- Data analytics terms
- Basic knowledge of tools
- Mental model: Your thought process and the way you approach a problem
- R: A programming language frequently used for statistics analysis, visualization and other data analysis
## iii. Module 3: Aggregate data for analysis

### VLOOKUP and data aggregation
- [Aggregation]: Collecting or gathering many separate pieces into a whole
- [Data aggregation]: The process of gathering data from multiple sources in order to combine it into a single summarized collection.
	- Identify trends
	- Make comparisons
	- Gain insights
- Data can also be aggregated over a given time period to provides statistics such as:
	- Averages
	- Minimums
	- Maximums
	- Sums
- Functions help make data aggregation possible (→ [Hàm tổng hợp (Aggregate)](/blog/ham-tong-hop-aggregate/))
- [Subquery]: A query within another query
- [VLOOKUP] ([Vertical Lookup](https://www.coursera.org/learn/analyze-data/supplement/SNmqP/vlookup-core-concepts)): A function that searches for a certain value in a column to return a corresponding piece of information.
	- [Duplicates]: If there are duplicates row, it will only return the first match it finds
	- [Absolute reference] {$}: A reference that is locked so that rows and columns won't change when copied. 
		- Lock spreadsheet
		- [MATCH]: A function used to locate the position of a specific lookup value
	- [TRUE/FALSE]:
		- [TRUE]: tells VLOOKUP to look for approximate matches
		- [FALSE]: tells VLOOKUP to look for exact matches
- [VALUE]: A function that converts a text string that represents a number to a numerical value
- [Remove duplicates]: A tool that automatically searches for and eliminates duplicate entries from a spreadsheet.
### Use JOINS to agregate data in SQL
- [JOIN]: A SQL clause that is used to combine rows from two or more tables based on a related column (→ [JOIN](/blog/join-ket-hop-nhieu-bang/))
- Common JOINs: 4
	- Inner: A function that returns records with matching values in both tables
	- Left: A function that will return all the records from the left table and only the matching records from the right table
	- Right: A function that will return all the records from the right table and only the matching records from the left table
	- Outer: A function that combines RIGHT and LEFT JOIN to return all matching records in both tables
- Using JOIN: https://www.coursera.org/learn/analyze-data/supplement/DBOi7/use-joins-effectively
**The table mentioned first is left, and the tablee mentioned second is right**
	![Ảnh chụp Màn hình 2026-05-23 lúc 00.10.07](/vault-assets/anh-chup-man-hinh-2026-05-23-luc-00-10-07-e41f79c6.png)
- Primary keys reference columns in which each value is unique.
- Foreign keys are primary keys in other tables
- [Aliases]: https://www.coursera.org/learn/analyze-data/supplement/qURXP/secret-identities-the-importance-of-aliases
	- [AS]: is the SQL keyword used to create an **alias** (temporary name) for a table or column.
### Work with subqueries
- [Subquery]: A SQL query that is nested inside a larger query (→ [Subquery & CASE WHEN](/blog/subquery-and-case-when/))
	- The statement containning the subquery can also be called the [Outer query] or the [Outer select]
	- The subquery be the [Inner query] or the [Inner select] - executes first so that the result can be passed on to the outer query to use
	- Usually be seen in [SELECT] and [WHERE]
- [HAVING]: Allows you to add a filter to your query instead of the underlying table that can only be used with aggregate function.
- [CASE]: Returns records with your conditions by allowing you to include if/then statement in your query.
- Clauses like [HAVING] and [CASE], paired with subqueries, will help you build more and more complex queries.
- https://www.coursera.org/learn/analyze-data/supplement/SthVU/sql-functions-and-subqueries-a-functional-friendship
### Module 4: Perform data calculation

### Get started with data calculation
- Formulas for basic calculations: [SUM], [AVERAGE], [MIN], [MAX],...
- Conditional formulas that use the IF function:
	- [COUNTIF(range, "value")]: returns the number of cells that match a specified value
	- [Summary table]: A table used to summarize statistical information about data
	- [SUM(range, criteria/condition, [sum_range])]
	- https://www.coursera.org/learn/analyze-data/supplement/s9khi/functions-with-multiple-conditions
- The [SUMPRODUCT(array1, [array2]...)] function: A function that multiplies arrays and returns the sum of those products
	- [Array]: A collection of values in cells
- Pivot tables to organize calculations: [^cdf31e](#cdf31e)
### Pivot
- Pivot tables: Let you view data in multiple ways to find insights and trends 
	- Elements: https://www.coursera.org/learn/analyze-data/supplement/j6w9Z/elements-of-a-pivot-table
	- Create and use: https://www.coursera.org/learn/analyze-data/supplement/qRo2l/use-pivot-tables-in-analysis
- Case study:
	- Link: https://docs.google.com/spreadsheets/d/1NzcyKwEqkuM5FhO2M46QQe8ACM3spfL5DZONiiHOb-A/edit?gid=0#gid=0
	- Ask: Find some trends to help the manger think through new movie ideas using revenue calculation
	- Analysis steps: 
		- Find out how much revenue was generated each year
		- Build a pivot table to show the revenue per year
		- Find the average revenue per movie
		- Check out findings for some possible trends
- [Calculated field]: A new field within a pivot table that carries out certain calculations based on the values of other fields.
### Learn more SQL calculation
- A symbol that names the type of the operation or calculation to be performed in a formula. 
	- + **addition**
	- - **subtraction**
	- * **multiplication**
	- / **division**
	- **Modulo**: An operator (%) that returns the remainder when one number is divided by another.
	- **SUM**
	- **AVG**
- The syntax of a query is its structure.
- **Underscores**: Lines used to underline words and connect text characters
- **GROUP BY:** A command that groups row that have the same values from a table into summary rows. (→ [GROUP BY & HAVING](/blog/group-by-and-having-tong-hop-du-lieu/))
``` sql
	SELECT
	FROM
	WHERE
	GROUP BY
```
### The data-validation process
- Data Validation Overview: 
	- Data validation in spreadsheets adds drop-down lists to control data entry and protect structured data and formulas.
	- It is part of a larger process that involves checking data completeness, accuracy, security, and consistency throughout analysis.
- **Data validation process**: Checking and rechecking the quality of your data so that is complete, accurate, secure and consistent. (→ [Laboratory Process Management](/blog/essential-requirements-of-laboratory-process-management/))
- Using Tools for Validation
	- Data validation should be applied regardless of the analysis tool, including spreadsheets and SQL.
	- SQL queries can be used to verify data accuracy, such as confirming totals match sums of components and handling errors like division by zero.
- **Types of data validation**: The first five are validation types associated with the data (type, range, constraint, consistency, and structure) and the sixth type focuses on the validation of application code used to accept data from user input.
	1. **Data type:**
		- **Purpose**: Check that the data matches the data type defined for a field.
		- **Example**: Data values for school grades 1-12 must be a numeric data type.
		- **Limitations**: The data value 13 would pass the data type validation but would be an unacceptable value. For this case, data range validation is also needed.
	2. **Data range: **
		- **Purpose**: Check that the data falls within an acceptable range of values defined for the field.
		- **Example**: Data values for school grades should be values between 1 and 12.
		- **Limitations**: The data value 11.5 would be in the data range and would also pass as a numeric data type. But, it would be unacceptable because there aren't half grades. For this case, data constraint validation is also needed.
	3. **Data constraints:**
		- **Purpose**: Check that the data meets certain conditions or criteria for a field. This includes the type of data entered as well as other attributes of the field, such as number of characters.
		- **Example**: Content constraint: Data values for school grades 1-12 must be whole numbers.
		- **Limitations**: The data value 13 is a whole number and would pass the content constraint validation. But, it would be unacceptable since 13 isn’t a recognized school grade. For this case, data range validation is also needed.
	4. **Data consistency:** 
		- **Purpose**: Check that the data makes sense in the context of other related data.
		- **Example**: Data values for product shipping dates can’t be earlier than product production dates.
		- **Limitations**: Data might be consistent but still incorrect or inaccurate. A shipping date could be later than a production date and still be wrong.
	5. **Data structure:**
		- **Purpose**: Check that the data follows or conforms to a set structure.
		- **Example**: Web pages must follow a prescribed structure to be displayed properly.
		- **Limitations**: A data structure might be correct with the data still incorrect or inaccurate. Content on a web page could be displayed properly and still contain the wrong information.
	6. **Code validation:**
		- **Purpose:** Check that the application code systematically performs any of the previously mentioned validations during user data input.
		- **Example:** Common problems discovered during code validation include: more than one data type allowed, data range checking not done, or ending of text strings not well defined.
		- **Limitations:** Code validation might not validate all possible variations with data input.
### SQL and temporary tables
- **Temporary table**: A database table that is created and exists temporarily on a database server
	- Temporary tables are database tables created temporarily to store subsets of data for short-term use during analysis.
	- They are automatically deleted at the end of the SQL session and help avoid repeated filtering or complex joins on large datasets.
- Benefits and Use Cases
	- Temporary tables simplify complex queries by storing intermediate results, such as joining smaller tables first before joining larger ones.
	- They enable combining results from multiple databases or repeatedly working with a filtered subset of data without re-running filters.
- Creating and Using Temporary Tables in BigQuery: The WITH clause in SQL acts like a temporary table, allowing multiple queries on the same subset of data without creating a permanent table. (→ [CTE & Set Operations](/blog/cte-and-set-operations/), [Glossary \[WITH](/blog/share-data-through-the-art-of-visualization/)])
- Advantages for Analysts and Teams
	- Using temporary tables makes analysis more efficient by reducing repetitive code and query complexity.
	- It also improves code readability, which benefits team collaboration and review.
- BigQuery doesn't currently recognize the SELECT INTO command
- How to create temporary table:
	- WITH clauses: Use when you want a quick, inline temporary table within a query to keep code organized and readable without creating a separate table.
	- SELECT INTO statements: Good for making a temporary copy of data with specific conditions without adding the table to the database; useful for one-time or personal use.
	- CREATE TABLE statements: Choose this when the table needs to be saved in the database for access by multiple users or when you want to add metadata and ensure the table persists.
	- CREATE TEMP TABLE statements:  Use this if your RDBMS supports it and you want a temporary table that exists only during your session but behaves like a regular table.
- More:
	- https://www.coursera.org/learn/analyze-data/supplement/oGADZ/work-with-temporary-tables
	- Connect Sheet: https://www.coursera.org/learn/analyze-data/supplement/U5ojF/use-connected-sheets-with-bigquery
