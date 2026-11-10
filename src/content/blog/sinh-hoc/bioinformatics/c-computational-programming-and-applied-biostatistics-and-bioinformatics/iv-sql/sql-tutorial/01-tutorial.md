---
title: Tutorial
type: note
tags:
  - bioinformatics
  - computational-programming-and-applied-biostatistics-and-bioinformatics
  - sql
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / C - Computational Programming and Applied
  Biostatistics and Bioinformatics / IV - SQL / SQL - Tutorial
vaultPath: >-
  Resources/Sinh học/Bioinformatics/C - Computational Programming and Applied
  Biostatistics and Bioinformatics/IV - SQL/SQL - Tutorial/01 - Tutorial.md
url: /blog/tutorial-biology-2/
topic: biology
updated: '2026-10-14'
order: 1
description: What is SQL?
isIndex: false
---
## Intro

- What is SQL?

- SQL stands for Structured Query Language

- SQL lets you access and manipulate databases

- SQL became a standard of the American National Standards Institute (ANSI) in 1986, and of the International Organization for Standardization (ISO) in 1987

- What Can SQL do?

- SQL can execute queries against a database

- SQL can retrieve data from a database

- SQL can insert records in a database

- SQL can update records in a database

- SQL can delete records from a database

- SQL can create new databases

- SQL can create new tables in a database

- SQL can create stored procedures in a database

- SQL can create views in a database

- SQL can set permissions on tables, procedures, and views

- SQL is a Standard - BUT....: Although SQL is an ANSI/ISO standard, there are different versions of the SQL language. However, to be compliant with the ANSI standard, they all support at least the major commands (such as SELECT, UPDATE, DELETE, INSERT, WHERE) in a similar manner

- Note: Most of the SQL database programs also have their own proprietary extensions in addition to the SQL standard!

- Using SQL in Your Web Site: To build a web site that shows data from a database, you will need:

- An RDBMS database program (i.e. MS Access, SQL Server, MySQL)

- To use a server-side scripting language, like PHP or ASP

- To use SQL to get the data you want

- To use HTML / CSS to style the page

- RDBMS:

- RDBMS stands for Relational Database Management System.

- RDBMS is the basis for SQL, and for all modern database systems such as MS SQL Server, IBM DB2, Oracle, MySQL, and Microsoft Access.

- The data in RDBMS is stored in database objects called tables. A table is a collection of related data entries and it consists of columns and rows.

## Syntax

- SQL Statements:

- Most of the actions you need to perform on a database are done with SQL statements.

- SQL statements consist of keywords that are easy to understand.

- Database Tables: A database most often contains one or more tables. Each table is identified by a name (e.g. "Customers" or "Orders"), and contain records (rows) with data.

- Keep in Mind That…: SQL keywords are NOT case sensitive: select is the same as SELECT.

- Semicolon after SQL Statements?

- Some database systems require a semicolon at the end of each SQL statement.

- Semicolon is the standard way to separate each SQL statement in database systems that allow more than one SQL statement to be executed in the same call to the server.

- Some of The Most Important SQL Commands (→ [Bảng tra cứu lập trình](/blog/programming-bang-tra-cuu-lenh-r-sql-cong-cu-tin-sinh-va-hoa-chat/))

  - SELECT - extracts data from a database

  - UPDATE - updates data in a database

  - DELETE - deletes data from a database

  - INSERT INTO - inserts new data into a database

  - CREATE DATABASE - creates a new database

  - ALTER DATABASE - modifies a database

  - CREATE TABLE - creates a new table

  - ALTER TABLE - modifies a table

  - DROP TABLE - deletes a table

  - CREATE INDEX - creates an index (search key)

  - DROP INDEX - deletes an index

## Select

- The SQL SELECT Statement: The SELECT statement is used to select data from a database. (→ [SELECT & WHERE](/blog/select-and-where-truy-van-co-ban/))

- Syntax: 
SELECT column1, column2, …
FROM table_name;

- Here, column1, column2, ... are the field names of the table you want to select data from.

- The table_name represents the name of the table you want to select data from.

- Select ALL columns: If you want to return all columns, without specifying every column name, you can use the SELECT * syntax:

## Select Distinct

- The SQL SELECT DISTINCT Statement: The SELECT DISTINCT statement is used to return only distinct (different) values. Inside a table, a column often contains many duplicate values; and sometimes you only want to list the different (distinct) values. (→ [Sắp xếp & Tìm kiếm](/blog/sap-xep-and-tim-kiem/))

- Syntax:
SELECT DISTINCT column1, column2, ...
FROM table_name;

- Count Distinct: By using the DISTINCT keyword in a function called COUNT, we can return the number of different countries.

- Note: The COUNT(DISTINCT column_name) is not supported in Microsoft Access databases.

## Where

- The SQL WHERE Clause:

- The WHERE clause is used to filter records.

- It is used to extract only those records that fulfill a specified condition.

- Syntax:
SELECT column1, column2, ...
FROM table_name
WHERE condition;

- Note: The WHERE clause is not only used in SELECT statements, it is also used in UPDATE, DELETE, etc.!

- Text Fields vs. Numeric Fields

- SQL requires single quotes around text values (most database systems will also allow double quotes).

- However, numeric fields should not be enclosed in quotes

- Operators in The WHERE Clause:

- You can use other operators than the = operator to filter the search.

- The following operators can be used in the WHERE clause:

| Operator | Description |
| --- | --- |
| = | Equal |
| > | Greater than |
| < | Less than |
| >= | Greater than or equal |
| <= | Less than or equal |
| <> | Not equal. Note: In some version of SQL, this operator may be written as != |
| BETWEEN | Between a certain range |
| LIKE | Search for a pattern |
| IN | To specify multiple possible values for a colunm |

- Order By

- And

- Or

- Not

- Insert Into

- Null Values

- Update

- Delete

- Select Top

- Aggregate Functions

- Min and Max

- Count

- Sum

- Avg

- Like

- Wildcards

- In

- Between

- Aliases

- Joins

- Inner Join

- Left Join

- Right Join

- Full Join

- Self Join

- Union

- Union All

- Group By

- Having

- Exists

- Any, All

- Select Into

- Insert Into Select

- Case

- Null Functions

- Stored Procedures

- Comments

- Operators
