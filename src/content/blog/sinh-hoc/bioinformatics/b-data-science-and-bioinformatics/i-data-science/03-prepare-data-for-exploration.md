---
title: 'Course 3: Prepare Data for Exploration'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - data-science
  - course-03
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / I - Data
  Science
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/I - Data
  Science/03 - Prepare Data for Exploration.md
url: /blog/prepare-data-for-exploration/
topic: biology
updated: '2026-10-14'
order: 3
description: >-
  The fairness issue: The lack of structure makes unstructured data difficult to
  search, manage, and analyze. But recent advancements in artificial
  intelligence and machine learning algorithms are beginning to change that.
isIndex: false
---
## i. Module 1: Data types and structures

### Data exploration
- Understanding the different types of data and data .
- What type of data is right for the question you’re answering.
- Practical skills about how to extract, use, organize and protect your data.
- How data is generated.
- Different formats, types, and structures of data. (→ [Data Exploration Using Descriptive Statistics](/blog/data-exploration-using-descriptive-statistics/))
- Analyze data for bias and credibility.
- What “clean data” .
- Databases.
- Extract your own data using spreadsheets and SQL.
- The basics of data organization
- The process of protecting your data
### Collect data
- How data is collect:
	- Interviews
	- Observations
	- Forms
	- Questionnaires
	- Surveys
	- Cookies: track people's online activities and interests
- Data collection considerations:
	- How the data will be collected: Decide if you will collect the data using your own resources or receive (and possibly purchase it) from another party.
	- Choose data sources
	- First-party data: Data collected by an individual or group using their own resources
	- Second-party data: Data collected by a group directly from its audience and then sold
	- Third-party data: Data collected from outside sources who did not collect it directly
	- Decide what data to use: Datasets can show a lot of interesting information. But be sure to choose data that can actually help solve your problem question.
- How much data collect:
	- Population: All possible data values in a certain dataset
	- Sample: A part of a population that is representative of the population
	- Select the right data type
	- Determine the time frame: If you are collecting your own data, decide how long you will need to collect it, especially if you are tracking trends over a long period of time. If you need an immediate answer, you might not have time to collect new data. In this case, you would need to use historical data that already exists.

![image_026](/vault-assets/image-026-1df3acd4.png)

#### Differentiate data formats and structures
- Quantitative and qualitative data:
	- Quantitative: can be measured or counted and then expressed as a number, with a certain quantity, amount or range.
		- Discrete data: Data that is counted and has a limited number of values
		- Continuous data: Data that is measured and can have almost any numeric value
	- Qualitative: can’t be counted, measured or easily expressed using number, usually listed as a name, category, or description.
		- Nominal data: A type of qualitative data that is categorized without a set order
		- Ordinal data: A type of qualitative data with a set order or scale
		- Internal data: Data that live within a company’s own systems
		- External data (Secondary data): Data that lives and is generated outside of an organization
		- Structured data: Data organized in a certain format such as rows and
		- Unstructured data: Data that is not organized in any easily identifiable.
- Data model: A model that is used for organizing data elements and how they relate to one another
- Data elements: Pieces of information, such as people’s names, account numbers, and addresses.
- Sources of structured data:
	- Spreadsheets
	- Databases that store dataset

![image_027](/vault-assets/image-027-07253a6f.png)

- The fairness issue: The lack of structure makes unstructured data difficult to search, manage, and analyze. But recent advancements in artificial intelligence and machine learning algorithms are beginning to change that. Now, the new challenge facing data scientists is making sure these tools are inclusive and unbiased. Otherwise, certain elements of a dataset will be more heavily weighted and/or represented than others. And as you're learning, an unfair dataset does not accurately represent the population, causing skewed outcomes, low accuracy levels, and unreliable analysis.
- Data modeling: is the process of creating diagrams that visually represent how data is organized and structured.  These visual representations are called data models. You can think of data modeling as a blueprint of a house. At any point, there might be electricians, carpenters, and plumbers using that blueprint. Each one of these builders has a different relationship to the blueprint, but they all need it to understand the overall structure of the house. Data models are similar; different users might have different data needs, but the data model gives them an understanding of the structure as a whole.
- Levels of data modeling:
	- Conceptual data modeling:  gives a high-level view of the data structure, such as how data interacts across an organization. For example, a conceptual data model may be used to define the business requirements for a new database. A conceptual data model doesn't contain technical details.
	- Logical data modeling: focuses on the technical details of a database such as relationships, attributes, and entities. For example, a logical data model defines how individual records are uniquely identified in a database. But it doesn't spell out actual names of database tables. That's the job of a physical data model.
	- Physical data modeling: depicts how a database operates. A physical data model defines all entities and attributes used; for example, it includes table names, column names, and data types for the database.
- Data-modeling techniques: There are a lot of approaches when it comes to developing data models, but two common methods are the Entity Relationship Diagram (ERD) and the Unified Modeling Language (UML) diagram. ERDs are a visual way to understand the relationship between entities in the data model. UML diagrams are very detailed diagrams that describe the structure of a system by showing the system's entities, attributes, operations, and their relationships. As a junior data analyst, you will need to understand that there are different data modeling techniques, but in practice, you will probably be using your organization’s existing technique.
- Data analysis and data modeling: Data modeling can help you explore the high-level details of your data and how it is related across the organization’s information systems. Data modeling sometimes requires data analysis to understand how the data is put together; that way, you know how to map the data. And finally, data models make it easier for everyone in your organization to understand and collaborate with you on your data.
### Explore data types, fields, and value
- Data type: A specific kind of data attribute that tells what kind of value the data is.
	- SQL: allows for different data types depending on which database you're using
	- Spreadsheets:
		- Number
		- Text or string: A sequence of characters and punctuation that contains textual information.
		- Boolean: A data type with only two possible values, such as TRUE or FALSE
- Use Boolean logic: the basics of Boolean logic and learn how to use single and multiple conditions in a Boolean statement. These conditions are created with Boolean operators, including AND, OR, and NOT. These operators are similar to mathematical operators and can be used to create logical statements that filter your results. Data analysts use Boolean statements to do a wide range of data analysis tasks, such as writing queries for searches and checking for conditions when writing programming code. In queries, Boolean logic is represented in a statement written with Boolean operators. An operator is a symbol that names the operation or calculation to be performed. Read on to discover how you can convert your shoe preferences into Boolean statements.
- The AND operator: Your condition is “If the color of the shoe has any combination of grey and pink, you will buy them.” The Boolean statement would break down the logic of that statement to filter your results by both colors. It would say IF (Color="Grey") AND (Color="Pink") then buy them. The AND operator lets you stack both of your conditions.
- The OR operator: The OR operator lets you move forward if either one of your two conditions is met. Your condition is “If the shoes are grey or pink, you will buy them.” The Boolean statement would be IF (Color="Grey") OR (Color="Pink") then buy them. Notice that any shoe that meets either the Color is Grey or the Color is Pink condition is marked as true by the Boolean logic.
- The NOT operator: Finally, the NOT operator lets you filter by subtracting specific conditions from the results. Your condition is "You will buy any grey shoe except for those with any traces of pink in them." Your Boolean statement would be IF (Color="Grey") AND (Color=NOT "Pink") then buy them. Now, all of the grey shoes that aren't pink are marked true by the Boolean logic for the NOT Pink condition. The pink shoes are marked false by the Boolean logic for the NOT Pink condition.
- The power of multiple conditions: For data analysts, the real power of Boolean logic comes from being able to combine multiple conditions in a single statement. For example, if you wanted to filter for shoes that were grey or pink, and waterproof, you could construct a Boolean statement such as: “IF ((Color = "Grey") OR (Color = "Pink")) AND (Waterproof="True". Notice that you can use parentheses to group your conditions together.

![image_028](/vault-assets/image-028-7e7032c7.png)

- Wide data: is a dataset in which every data subject has a single row with multiple columns to hold the values of various attributes of the subject. It is helpful for comparing specific attributes across different subjects.
Population-Latin-and-Caribbean-Countries-2010-2019.xlsx
- Long data: Long data is data in which each row represents one observation per subject, so each subject will be represented by multiple rows. This data format is useful for comparing changes over time or making other comparisons across subjects.
Population, Latin and Caribbean Countries, 2010-2019, long format
- Transforming data: Data transformation is the process of changing the data’s format, structure, or values. As a data analyst, there is a good chance you will need to transform data at some point to make it easier for you to analyze it.
- Data transformation usually involves:
	- Adding, copying, or replicating data
	- Deleting fields or records
	- Standardizing the names of variables
	- Renaming, moving, or combining columns in a database
	- Joining one set of data with another
	- Saving a file in a different format. For example, saving a spreadsheet as a comma separated values (.csv) file.
- Why transform data?: Goals for data transformation might be:
	- Data organization: better organized data is easier to use
	- Data compatibility: different applications or systems can then use the same data
	- Data migration: data with matching formats can be moved from one system to another
	- Data merging: data with the same organization can be merged together
	- Data enhancement: data can be displayed with more detailed fields
	- Data comparison: apples-to-apples comparisons of the data can then be made

| Wide data is preferred when | Long data is preferred when |
| --- | --- |
| Creating tables and charts with a few variables about each subject Comparing straightforward line graphs | Storing a lot of variables about each subject. For example, 60 years worth of interest rates for each bank Performing advanced statistical analysis or graphing |

- In a data table, the columns are fields, and the rows are records.

## ii. Module 2: Data responsibility

### Unbiased and objective data
- Bias: A preference in favor of or against a person, group of people, or thing.
- Data bias: A type of error that systematically skews results in a certain direction.
- Sampling bias: When a sample isn’t representative of the population as a whole.
- Unbiased sampling: When a sample is representative of the population being measured. (→ [Statistic and Regression](/blog/statistic-and-regression/))
- More types of data bias: (4 types of bias)
	- Sampling bias.
	- Observer bias (experimenter/research bias): The tendency for different people to observe things differently.
	- Interpretation bias: The tendency to always interpret ambiguous situations in a positive or negative way.
	- Confirmation bias: The tendency to search for or interpret information in a way that confirms pre-existing beliefs.
### Achieve data credibility
- ROCCC: Choose a good data source -> without these, it’s a bad data source
	- Reliable
	- Original
	- Comprehensive
	- Current
	- Cited
### Data ethics and privacy
- Ethics: Well-founded standards of right and wrong that prescribe what humans ought to do, usually in terms of rights, obligations,benefits to society, fairness or specific virtues.
- Data ethics: Well- founded standards of right and wrong that dictate how data is collected, shared, and used.
- GDPR: General Data Protection Regulation of the European Union.
- Aspects of data ethics:
	- Ownership: individuals who own the raw data they provide, and they have primary control over its usage, how it's processed and how it's shared.
	- Transaction transparency: all data processing activities and algorithms should be completely explainable and understood by the individual who provides their data.
	- Consent: an individual's right to know explicit details about how and why their data will be used before agreeing to provide it.
	- Currency: Individuals should be aware of financial transactions resulting from the use of their personal data and the scale of these transactions.
	- Privacy: preserving a data subject's information and activity any time a data transaction occurs. This is sometimes called information privacy or data protection.
		- Protection from unauthorized access to our private data
		- Freedom from inappropriate use of our data
		- The right to inspect, update, or correct our data
		- Ability to give consent to use our data
		- Legal right to access our data.
	- Openness: Free access, usage, and sharing of data (Open data)
- Data anonymization
	- Personally identifiable information (PII): information that can be used by itself or with other data to track down a person's identity.
	- Data anonymization: the process of protecting people's private or sensitive data by eliminating that kind of information. Typically, data anonymization involves blanking, hashing, or masking personal information, often by using fixed-length codes to represent data columns, or hiding data with altered values.
	- Organizations have a responsibility to protect their data and the personal information that data might contain. As a data analyst, you might be expected to understand what data needs to be anonymized, but you generally wouldn't be responsible for the data anonymization itself. A rare exception might be if you work with a copy of the data for testing or development purposes. In this case, you could be required to anonymize the data before you work with it.
- Types of data should be anonymized
	- Healthcare and financial data are two of the most sensitive types of data. These industries rely a lot on data anonymization techniques. After all, the stakes are very high. That’s why data in these two industries usually goes through de-identification, which is a process used to wipe data clean of all personally identifying information.
	- Data anonymization is used in just about every industry. That is why it is so important for data analysts to understand the basics. Here is a list of data that is often anonymized:
		 - Telephone numbers
		- Names
		- License plates and license numbers
		- Social security numbers
		- IP addresses
		- Medical records
		- Email addresses
		- Photographs
		- Account numbers
### Understand open data
- Data interoperability: The ability of data systems and services to openly connect and share data
- In data analytics, open data is part of data ethics, which has to do with using data ethically. Openness refers to free access, usage, and sharing of data. But for data to be considered open, it has to:
- Data can only be considered open when it meets all three of these standards.
	- Be available and accessible to the public as a complete dataset
	- Be provided under terms that allow it to be reused and redistributed
	- Allow universal participation so that anyone can use, reuse, and redistribute the data
- What data should be publicly available?: One of the biggest benefits of open data is that credible databases can be used more widely. Basically, this means that all of that good data can be leveraged, shared, and combined with other data. This could have a huge impact on scientific collaboration, research advances, analytical capacity, and decision-making. But it is important to think about the individuals being represented by the public, open data, too.
- Third-party data is collected by an entity that doesn’t have a direct relationship with the data. You might remember learning about this type of data earlier. For example, third parties might collect information about visitors to a certain website. Doing this lets these third parties create audience profiles, which helps them better understand user behavior and target them with more effective advertising.
- Personal identifiable information (PII) is data that is reasonably likely to identify a person and make information known about them. It is important to keep this data safe. PII can include a person’s address, credit card information, social security number, medical records, and more.
- Data sources.
- Hands-on activity: Animal Crossing New Horizons Catalog
- Header: The header at the top of the page contains the following information about the dataset:
	- Its title
	- A brief description of its contents
	- The name of its creator
	- When it was last updated
	- Its current version
- Badge:  In the top-right corner of the header, you’ll find three more items:
- A badge in the shape of a circle
- An icon in the shape of a caret symbol ( ^ )
- A number
- Upvotes: Clicking on the caret lets you “upvote” the dataset. The number shows the number of times this dataset has been upvoted by the Kaggle community.
- Tabs: Beneath the header is a bar with three tabs: Data Card, Code, and Discussion. Take a moment to click on each of these tabs and explore their contents. Afterwards, navigate back to the Datasets tab!
- Now, you can move down the page. You’ll find a box that contains three terms: Usability, License, and Tags.
- Usability shows how complete the dataset webpage is (and not the dataset itself). Kaggle encourages the community to add information to the dataset webpage to make the dataset itself easier to understand. For example, a brief description or a column header. Hover your cursor over the Usability score to discover what the dataset page contains.
- Licenses govern how a dataset can be used. Click on the license name to learn more about that specific license.
- Expected update frequency will report when the data set was updated with new attributes, amendments, or expansions of the data. You may also see when any expected future dates are scheduled for a data set update. In this case, there will never be an update scheduled.
- The Data Explorer menu shows that the Animal Crossing dataset contains 30 .csv files. If you click on a file name, the window to the right will display information from that specific file. Try clicking on umbrellas.csv to check it out! Notice that the Data Explorer has three viewing options: Detail, Compact, and Column. The description at the top of the Detail tab shows that the umbrellas.csv file contains data on all the umbrellas in the video game. Let’s check out the columns. Each column header has three items:
- A small icon on the left that shows the data type
- The name of the column
- An icon with three bars that lets you sort the data if you click on it
Below each column header is a box that contains a summary of the data. This lets you quickly get an idea of what’s in the dataset. For example, the summary for the Name column shows there are 67 unique values for the umbrella names. The summary for the DIY column shows that 9 of the umbrella recipes are DIY, or “do it yourself.”

- Access a dataset: After you’ve explored a dataset, you can link it to a Kaggle notebook or download it to access it for your own use. Linking a dataset to a Kaggle notebook means you create a new notebook from the existing dataset so that it is available for you to use.

- Find your own datasets: Now, you’ll get a chance to choose your own datasets to work with! Use the following steps to find datasets that interest you:

  - 1. When you’re ready, click on the Data icon on the left to return to the Datasets landing page.

  - 2. Note that datasets can exist in a variety of formats. If you want to make sure your dataset is in a .csv format, click on the Filter button on the right side of the Datasets search bar. Then, choose CSV from the menu.

  - 3. Find 2-3 datasets that you’re interested in exploring further.

  - 4. Create notebooks from them, download them, or check them out in the Data Explorer. Keep these datasets in mind for your upcoming reflection.

- Link or download a dataset: Here are the options to create a notebook or download the dataset:

  - Create a Kaggle notebook: To link a dataset to a Kaggle notebook, you click on the New Notebook button in the dataset header. This will create a notebook in your Kaggle account that links to the dataset.

  - Download the dataset: To download a copy of the dataset to your computer, click on the Download button in the dataset header at the top of the page.

  - Open the file in Google Sheets: To open a Google Sheets view of the file, click on the download icon at the top-right of the Data Explorer. You can then download the file.

## iii. Module 3: Database essentials

#### Work with database

- Database: A collection of data stored in a computer system. When you maintain a database of customer information, ensuring data integrity, credibility, and privacy. (→ [Database](/blog/database/))

- Metadata: Data about data.

- Relational database: A database that contains a series of related tables that can be connected via their relationships. For two tables to have a relationship, one or more of the same fields (key) must exist inside both tables. (→ [Dữ liệu & Database](/blog/gioi-thieu-du-lieu-and-database/))
In a non-relational table, you will find all of the possible variables you might be interested in analyzing all grouped together. This can make it really hard to sort through. This is one reason why relational databases are so common in data analysis: they simplify a lot of analysis processes and make data easier to find and use across an entire database.

- Primary key: An identifier that references a column in which each value is unique (no two rows can have the same primary key, it can’t not be null or blank).

- Used to ensure data in a specific column is unique

- Uniquely identifies a record in a relationship database table

- Only one primary key is allowed in a table

- Cannot contain null or blank values

- Foreign key: A field within a table that is a primary key in another table.

- A column or group of columns in a relational database table that provides a link between the data in two table

- Refers to the field in a table that’s the primary key of another table

- More than one foreign key is allowed to exist in a table

![image_029](/vault-assets/image-029-b6f56e13.png)

![image_030](/vault-assets/image-030-4e91a1b9.png)

- Normalization: a process of organizing data in a relational database. For example, creating tables and establishing relationships between those tables. It is applied to eliminate data redundancy, increase data integrity, and reduce complexity in a database.

#### Manage data with metadata

- Metadata helps data analysts interpret the contents of the data within a database.

- Three common types of metadata:

- Descriptive: Metadata that describes a piece of data and can be used to identify it at a later point in time

- Structural: Metadata that indicates how a piece of data is organized and whether it is part of one, or more than one, data collection

- Administrative: Metadata that indicates the technical source of a digital asset

- Regardless of whether you’re working with a large or small quantity of data, metadata is the mark of a knowledgeable analytics team. Metadata helps people communicate about data across the business and makes it easier to reuse data. In essence, metadata tells the who, what, when, where, which, why, and how of data.

- Elements of metadata: it’s important to understand what type of information metadata typically provides:

- File or document type: What type of file or document are you examining?

- Date, time, and creator: When was it created? Who created it? When was it last modified?

- Title and description: What is the name of the item you are examining? What type of content does it contain?

- Geolocation: If you’re examining a photo, where was it taken

- Tags and categories: What is the general overview of the item that you have? Is it indexed or described in a specific way?

- Who last modified it and when: Were any changes made to the file? If yes, when were the most recent modifications made?

- Who can access or update it: If you’re examining a dataset, is it public? Are special permissions needed to customize or modify it?

- Example:

- Photo: Whenever a photo is captured with a camera, metadata such as filename, date, time, geolocation, and the type of device on which it was taken are gathered and saved with it. The metadata of the following photo is displayed as a pop-up alongside the photo.

- Emails: When an email is sent or received, it contains metadata such as subject line, sender, recipient, date sent, and time sent. Emails also contain hidden metadata that includes server names, IP addresses, HTML format, and software details.

- Spreadsheets and electronically created documents: Spreadsheets and documents are already filled with a considerable amount of data, so it’s no surprise that they also include metadata such as title, author, creation date, number of pages, and user comments. Additionally, spreadsheet metadata includes tab names, tables, and columns.

- Websites: Every web page has a number of standard metadata fields such as tags and categories, the site creator’s name, web page title and description, and time of creation. Results of search engine queries that you might make on a daily basis are metadata!

- Books and audiobooks: Non-digital items can have metadata, too! Every book has standard metadata that will inform you of its title, author’s name, a table of contents, publisher information, copyright description, index, and a brief description of the book’s contents. Audiobook metadata also includes this data, as well as metadata specific to the audiobook such as narrator and recording length.

- The benefits of metadata:

  - Reliability: Data analysts use reliable and high-quality data to identify the root causes of any problems that might occur during analysis and to improve their results. If the data being used to solve a problem or to make a data-driven decision is unreliable, there’s a good chance the results will be unreliable as well. Metadata helps data analysts confirm their data is reliable by making sure it is:

- Accurate

- Precise

- Relevant

- Timely

It does this by helping analysts ensure that they’re working with the right data and that the data is described correctly.

- Consistency: Data analysts thrive on consistency and aim for uniformity in their data and databases,  and metadata helps make this possible. For example, to use survey data from two different sources, data analysts use metadata to make sure the same collection methods were applied in the survey so that both datasets can be compared reliably. When a database is consistent, it’s easier to discover relationships between the data inside the database and data that exists elsewhere. When data is uniform, it is:

- Organized: Data analysts can easily find tables and files, monitor the creation and alteration of assets, and store metadata.

- Classified: Data analysts can categorize data when it follows a consistent format, which is beneficial in cleaning and processing data.

- Stored: Consistent and uniform data can be efficiently stored in various data repositories. This streamlines storage management tasks such as managing a database.

- Accessed: Users, applications, and systems can efficiently locate and use data.

Together, these benefits empower data analysts to effectively analyze and interpret their data.

- Metadata repositories

- Metadata repositories help data analysts ensure their data is reliable and consistent.

- Metadata repositories are specialized databases specifically created to store and manage metadata. They can be kept in a physical location or a virtual environment—like data that exists in the cloud.

- Metadata repositories describe where the metadata came from and store that data in an accessible form with a common structure. This provides data analysts with quick and easy access to the data. If data analysts didn’t use a metadata repository, they would have to select each file to look up its information and compare the data manually, which would waste a lot of time and effort.

- Data analysts also use metadata repositories to bring together multiple sources for data analysis. Metadata repositories do this by describing the state and location of the data, the structure of the tables inside the data, and who accessed the user logs.

- Metadata of external databases

  - Data analysts use both second-party and third-party data to gain valuable insights and make strategic, data-driven decisions. Second-party data is data that’s collected by a group directly from the group’s audience and then sold. Third-party data is provided by outside sources that didn’t collect it directly. The providers of this data are not its original collectors and do not have a direct relationship with any individuals to whom the data belongs. The outside providers get the data from websites or other programs that pull it from the various platforms where it was originally generated.

  - Data analysts should understand the metadata of external databases to confirm that it is consistent and reliable. In some cases, they should also contact the owner of the third-party data to confirm that it is accessible and available for purchase. Confirming that the data is reliable and that the proper permissions to use it have been obtained are best practices when using data that comes from another organization.

- Data governance: A process to ensure the formal management of a company’s data assets

#### Access different data sources

- Internal/External data.

- CSV = Comma-separated values: A CSV file saves data in a table format

- .csv file to ggsheet:

- In the menu, select File then Import. The Import file window will pop up.

- Select Upload then Browse to select the .csv file to import. For this example, select the .csv file you downloaded in the previous section

- Next select the Import location. You can:

- Create a new spreadsheet

- Insert the .csv data as a new sheet

- Replace spreadsheet

- Replace current sheet

- Append (add) the data to the current spreadsheet

- Replace the data starting with a specific cell.

- Next, select the Separator type. Google Sheets defaults to automatically detecting separator, or delimiter, type. To manually set the delimiter type, select the dropdown menu under Separator type and choose the separator.

- Next, determine if you would like the text to be imported with or without formatting. In the box next to Convert text to numbers, dates, and formulas, keep the checkmark if you want text data to be formatted.

- Select Import data. The data in the .csv file will be loaded into your sheet, and you can begin using it.

- IMPORT function in ggsheet

#### Sort and filter data

- Sorting data: Arranging data into a meaningful order to make it easier to understand, analyze, and visualize

- Filtering: Showing only the data that meets a specific criteria while hiding the rest

#### Large datasets in SQL

- BigQuery: Types of account

- Sandbox: A sandbox account is available at no charge and anyone with a Google account can log in and use it.

- 12 projects at a time

- Cannot insert new records to a database

- Cannot update field values of existing records.

- Data Manipulation Language (DML) operations aren’t supported in sandbox.

- Free trial: The free trial gives you access to more of what Big Query has to offer with fewer overall limitations.

- $300 in credit during the first 90 days

- Select to upgrade to a paid account

- You will never be automatically charged

![image_031](/vault-assets/image-031-ea8e1b71.png)

- BigQuery Studio components: Once you have navigated to BigQuery from the project space, most of the major components of the BigQuery console will be present:

- the Navigation pane: On the console page, find the Navigation pane. This is how you navigate from the project space to the BigQuery tool. This menu also contains a list of other Google Cloud Project (GCP) data tools. During this program, you will focus on BigQuery, but it’s useful to understand that the GCP has a collection of connected tools data professionals use every day.

- the Explorer pane: The Explorer pane lists your current projects and any starred projects you have added to your console. It’s also where you’ll find the + ADD button, which you can use to add datasets. This button opens the Add dialog that allows you to open or import a variety of datasets.

- Add Public Datasets: BigQuery offers a variety of public datasets from the Google Cloud Public Dataset Program. Scroll down the Add dialog to the Public Datasets option. Select Public Datasets. This takes you to the Public Datasets Marketplace, where you can search for and select public datasets to add to your BigQuery console. For example, search for the "noaa lightning" dataset in the Marketplace search bar. When you search for this dataset, you will find NOAA’s Cloud-to-Ground Lightning Strikes data. Select the dataset to read its description. Select View dataset to create a tab of the dataset’s information within the SQL workspace.

- Star and examine Public Datasets: You added the public noaa_lightning dataset to your BigQuery Workspace, so the Explorer pane displays the noaa_lightning dataset, along with the list of other public datasets. These datasets are nested under bigquery-public-data. Star bigquery-public-data by navigating to the top of the Explorer pane and selecting the star next to bigquery-public-data. Starring bigquery-public-data will enable you to search for and add public datasets by scrolling in the Explorer pane or by searching for them in the Explorer search bar. When you select a table, its information is displayed in the SQL Workspace. Select the 311_service_requests table to examine several tabs that describe it, including:

  - Schema, which displays the column names in the dataset

  - Details, which contains additional metadata, such as the creation date of the dataset

  - Preview, which shows the first rows from the dataset

- the SQL Workspace: The final menu pane in your console is the SQL Workspace. This is where you will actually write and execute queries in BigQuery. The SQL Workspace also gives you access to your personal and project history, which stores a record of the queries you’ve run. This can be useful if you want to return to a query to run it again or use part of it in another query.

- Upload your data: In addition to offering access to public datasets, BigQuery also gives you the ability to upload your own data directly into your workspace. Access this feature by opening the + ADD menu again or by clicking the three vertical dots next to your project’s name in the Explorer pane. This will give you the option to create your own dataset and upload your own tables.

- Three basic parts of a query: SELECT, FROM, and WHERE:

- SELECT is the section of a query that indicates what data you want SQL to return to you.

- FROM is the section of a query that indicates which table the desired data comes from. You must provide a full path to the table. The path includes the project name, database name, and table name, each separated by a period.

- WHERE is the section of a query that indicates any filters you’d like to apply to your table.

- https://www.coursera.org/learn/data-preparation/supplement/G5WAN/in-depth-guide-sql-best-practices

### iv. Module 4: Organize and protect data

#### Bring data to order

- Benefits of organizing data:

- Makes it easier to find and use

- Helps you avoid making mistakes during your analysis

- Helps to protect your data

- Best practices when organizing data: (→ [Monitoring ANR – quản lý dữ liệu](/blog/monitoring-anr-part-1-establishing-baseline-control-and-reference-sites-and-data/))

- Naming conventions: Consistent guidelines that describe the content, date, or version of a file in its name. Use logical and descriptive names for your files to make them easier to find and use

- Foldering: Organize your files into folders. Break folders down into subfolders

- Archiving older files: Move old projects to a separate location to create an archive and cut down on clutter.

- Align your naming and storage practices with your team

- Develop metapratices

- Best practices for naming files: File-naming conventions help you organize, access, process, and analyze data because they act as quick reference points to identify what’s in a file. One important practice is to decide on file naming conventions—as a team or company—early in a project. This will prevent you from spending time updating file names later, which can be a time-consuming process. In addition, you should align your project’s file names with your team’s or company’s existing file-naming conventions. You don’t want to spend time learning a new file-naming convention each time you look up a file in a new project! It's also critical to ensure that file names are meaningful, consistent, and easy-to-read. File names should include:

- The project’s name: Giving a file a meaningful name to describe its contents makes searching for it straightforward. It also makes it easy to understand the type of data the file contains.

- The file creation date: Knowing when a file was created can help you understand if it is relevant to your current analysis. For example, you might want to analyze only data from 2023.

- Revision version: Including a revision version helps ensure you’re working with the correct file. You wouldn’t want to make edits to an old version of a file without realizing it! When you include revision numbers in a file name, lead with a zero. This way, if your team reaches more than nine rounds of revisions, double digits are already built into your convention.

- Consistent style and order: Make sure the information you include in a file name follows a consistent order. To ensure all team members use the agreed-upon file naming conventions, create a text file as a sample that includes all of the naming conventions on a project. This can benefit new team members to help them quickly get up to speed or a current team member who just needs a refresher on the file naming conventions.

Further, file-naming conventions should act as quick reference points to identify what is in the file. Because of this, they should be short and to the point.

### Secure data

- Data security: Protecting data from unauthorized access or corruption by adopting safety measures. (→ [Fundamentals of Laboratory Systems](/blog/the-fundamentals-of-laboratory-systems/))

- Usually the purpose of data security is to keep unauthorized users from accessing or viewing sensitive data. Data analysts have to find a way to balance data security with their actual analysis needs. This can be tricky-- we want to keep our data safe and secure, but we also want to use it as soon as possible so that we can make meaningful and timely observations. In order to do this, companies need to find ways to balance their data security measures with their data access needs.

- Luckily, there are a few security measures that can help companies do just that:

- Encryption: uses a unique algorithm to alter data and make it unusable by users and applications that don’t know the algorithm. This algorithm is saved as a “key” which can be used to reverse the encryption; so if you have the key, you can still use the data in its original form.

- Tokenization: replaces the data elements you want to protect with randomly generated data referred to as a “token.” The original data is stored in a separate location and mapped to the tokens. To access the complete original data, the user or application needs to have permission to use the tokenized data and the token mapping. This means that even if the tokenized data is hacked, the original data is still safe and secure in a separate location.

Encryption and tokenization are just some of the data security options out there. There are a lot of others, like using authentication devices for AI technology.

- Excel and ggsheets:

- Protect spreadsheets from being edited

- Access control feature: Password protection, user permission

- One thing you absolutely can do to help strike the right balance is to use version control best practices. Version control enables all collaborators within a file to track changes over time. You can understand who made what changes to a file, when they were made, and why.
