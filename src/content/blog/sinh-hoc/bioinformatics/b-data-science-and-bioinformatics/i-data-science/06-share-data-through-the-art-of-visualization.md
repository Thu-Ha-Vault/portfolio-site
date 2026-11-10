---
title: 'Course 6: Share Data through the Art of Visualization'
type: course-note
tags:
  - bioinformatics
  - data-science-and-bioinformatics
  - data-science
  - course-06
section: Sinh học
folder: >-
  Sinh học / Bioinformatics / B - Data Science and Bioinformatics / I - Data
  Science
vaultPath: >-
  Resources/Sinh học/Bioinformatics/B - Data Science and Bioinformatics/I - Data
  Science/06 - Share Data through the Art of Visualization.md
url: /blog/share-data-through-the-art-of-visualization/
topic: biology
updated: '2026-11-10'
order: 6
description: 'How to choose a data visualization.pdf - Some common errors to avoid:'
isIndex: false
---
## Module 1: Visualize data
### Understand data visualization
#### Why data visualization matters?
- Data visualization: The graphic representation and presentation of data (→ [Visualizations (R)](/blog/visualizations/))
- History: Start with map
	- Scientists and mathematicians began to truly embrace the idea of arranging data visually in the 1700s and 1800s
- Time with data visuals probably split in two way:
	1. Looking at visuals in order to understand and draw conclusion about data
	2. Creating visuals using raw data to tell a story
- Rule for creating a visualization: 
	- Your audience should know exactly what they're looking at within the first five ​seconds of seeing it. ​Basically, this means the visual should be clear and easy to follow. ​
	- In the five seconds after that, ​your audience should understand the conclusion your visualization is making. ​Even if they aren't totally familiar with the research you've been doing.
	- ​They might not agree with your conclusion, and that's okay. ​You can always use their feedback to adjust your visualization and ​go back to the data to do further analysis.
- Data visualizations are a helpful tool for ​fitting a lot of information into a small space.
	- Structure and organize your thoughts. ​Think about your objectives and ​the conclusions you've reached after sorting through data.
	- Think about the patterns you've noticed in the data, the things that ​surprised you and, of course, how all of this fits together into your analysis. ​Identifying the key elements of your findings help set the stage for ​how you should organize your presentation.

![Ảnh chụp Màn hình 2026-06-20 lúc 21.45.59](/vault-assets/anh-chup-man-hinh-2026-06-20-luc-21-45-59-f88c2d6e.png)
- Effective data visualization: https://www.coursera.org/learn/visualize-data/supplement/9xEjx/effective-data-visualizations
- Xem thêm: [Transcriptomics: RNA-seq](/blog/transcriptomics-rna-seq-va-single-cell/) – các biểu đồ chuẩn trong bioinformatics: PCA, volcano plot, MA plot, heatmap
#### Connect images with data
- **Bar graphs**: Use size contrast to compare two or more values
	- x-axis: used to represent categories, time periods, or other variables. 
	- y-axis: usually has a scale of values for the variables. (start with zero to avoid misleading)
- **Line graphs:** Help your audience understand shift or changes in your data, usually using for changes in a period of time
- **Pie charts**: Show how much of each part of something makes up the whole
- **Maps**: Help organize data geographically. They can hold a lot of location-based information
- **The beauty of visualizing:** https://www.coursera.org/learn/visualize-data/supplement/YHHg5/the-beauty-of-visualizing
#### A recipe for a powerful visualization
- One of your biggest considerations when creating a data visualization is where you'd like your audience to focus.
- As a general rule, ​as long as it's not misleading, ​you should visually represent only the data that ​your audience needs in order to understand your findings.
- What you ​can show with visualizations: 
	- ​**Time series chart:** Change over time is a big one. ​If your analysis involves how ​the data has changed over a certain period, ​which could be days, weeks, months, or years. ​You can set your visualization to show ​only the time period relevant to your objective.
	- **Histograms**: Another situation is when you need to ​show how your data is distributed.
		- **Histogram**: A chart that shows how often data values fall into certain ranges
	-  **Ranked bar chart**: If your data needs to be ranked, ​like when ordering the number of ​responses to survey questions. ​You should first think about what you ​want to highlight in your visualization.
		- ​Bar charts with horizontal bars ​effectively show data that are ranked, ​with bars arranged in ascending or descending order. ​A bar chart should always be ranked by value, ​unless there's a natural order to ​the data like age or time
	- **Correlation charts**: Show relationships among data, but they should be used with ​caution because they might lead ​viewers to think that the data shows causation. ​
		- **Causation**: or a cause-effect relationship ​occurs when an action directly leads to an outcome. ​Correlation and causation are often mixed up because ​humans like to find patterns even when they don't exist. (→ [Causal Inference](/blog/causal-inference-biology/))
		- Details: https://www.coursera.org/learn/visualize-data/supplement/PPdt5/correlation-and-causation
#### Dynamic visualizations
- **Static visualizations**: Do not change over time unless they're edited.
	- Any visualization printed on paper is automatically static.
	- Charts and graphs created in spreadsheets are often static too.
- **Dynamic visualizations**: visualizations that are interactive or change over time.
	- Users have some control over what they see
- **Tableau**: A business intelligence and analytics platform that helps people see, understand, and make decisions with data
- The choice between using a static or dynamic visualization, this usually depend on: 
	- The data you are visualizing
	- The audience you're presenting to
	- And how you're giving your presentation.
- The wonderful world of visualizations: https://www.coursera.org/learn/visualize-data/supplement/j9Wdl/the-wonderful-world-of-visualizations
- Data grows on decision trees: https://www.coursera.org/learn/visualize-data/supplement/XvN2U/data-grows-on-decision-trees
### Design data visualization
- The elements of art:
	- Line: curved or straight, thick or thin, vertical or horizontal or diagonal -> add visual form to data and help build a structure for visualization.
	- Shape: 
		- should always be two-dimensional because 3-dimensional objects in a visualization can complicate the visual and confuse the audience
		- great way to add eye-catching contrast, especially size contrast
	- Color: 
		- Hue: its name
		- Intensity: bright/dull a color is
		- Value: light/dark (how much light is being reflected)z;
			- Dark values with some black added: shades of color.
			- Light values with some white added: tints
	- Space: area between, around and in the objects
	- Movement: create a sense of flow or action in a viz
		- Static image: control all elements of the story you want to tell.
		- Incorporating movement and interactivity -> the story is controlled by whoever controlling the interactivity.
- **Principles of design:** (→ [Trình bày và mô tả dữ liệu bằng R](/blog/trinh-bay-va-mo-ta-du-lieu-thuc-hanh-r/))
	- **Balance**: The design of a data visualization is balanced when the key visual elements, like color and shape, are distributed evenly. This doesn’t mean that you need complete symmetry, but your visualization shouldn’t have one side distracting from the other. If your data visualization is balanced, this could mean that the lines used to create the graphics are similar in length on both sides, or that the space between objects is equal. For example, [**this column chart**](https://developers.google.com/chart/interactive/docs/gallery/columnchart "this column chart") (also shown below) is balanced; even though the columns are different heights and the chart isn’t symmetrical, the colors, width, and spacing of the columns keep this data visualization balanced. The colors provide sufficient contrast to each other so that you can pay attention to both the motivation level and the energy level displayed.
![bar chart measuring motivation and energy levels throughout the day](https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/bqmDqhCfRJipg6oQn0SYBw_d6d283ffacab4c5a83a484cb5e6ac4ac_Screen-Shot-2021-02-28-at-4.11.09-PM.png?expiry=1786464397490&hmac=6l6zNKuADFBy3KhKAvU7Ta4ISlY3V6RiLKK8S8tVMyU)
	- **Emphasis:** Your data visualization should have a focal point, so that your audience knows where to concentrate. In other words, your visualizations should emphasize the most important data so that users recognize it first. Using color and value is one effective way to make this happen. By using contrasting colors, you can make certain that graphic elements—and the data shown in those elements—stand out. For example, you will notice a heat map data visualization below from [**The Pudding’s “Where Slang Comes From"**](https://pudding.cool/2017/02/new-slang/ "The Pudding's \"Where Slang Comes From\"") article. This heat map uses colors and value intensity to emphasize the states where search interest is highest. You can visually identify the increase in the search over time from low interest to high interest. This way, you are able to quickly grasp the key idea being presented without knowing the specific data values.
![heat map graphic measuring search interest](https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/oBHz_WbkRp6R8_1m5CaecA_5347b07316cc4bcaba3f9265be1230bd_Screen-Shot-2021-03-29-at-7.39.32-PM.png?expiry=1786464397490&hmac=xqPoz58s1Vhq6BoB7QJRXWQBE9pq0EAUcGsOVnD8ZJM)
	- **Movement:** Movement can refer to the path the viewer’s eye travels as they look at a data visualization, or literal movement created by animations. Movement in data visualization should mimic the way people usually read. You can use lines and colors to pull the viewer’s attention across the page. For example, notice how the average line in [**this combo chart**](https://developers.google.com/chart/interactive/docs/gallery/combochart "this combo chart") (also shown below) draws your attention from left to right. Even though this example isn’t moving, it still uses the movement principle to guide viewers’ understanding of the data. 
![bar chart of monthly coffee production by country](https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/p1hhdnUQQ7uYYXZ1EOO76g_e96125cf0ebf4b0e8e4c31e357cd2194_Screen-Shot-2021-02-28-at-4.12.29-PM.png?expiry=1786464397490&hmac=To-0KM2iA7pEzrqE11lfCv8S-gy62mjKtpVl27d0ZNo)
	- **Pattern:** You can use similar shapes and colors to create patterns in your data visualization. This can be useful in a lot of different ways. For example, you can use patterns to highlight similarities between different data sets, or break up a pattern with a unique shape, color, or line to create more emphasis. In the example below, the different colored categories of [**this stacked column chart**](https://developers.google.com/chart/interactive/docs/gallery/barchart "this stacked column chart") (also shown below) are a consistent pattern that makes it easier to compare book sales by genre in each column. Notice in the chart that the Fantasy & Sci Fi category (royal blue) is increasing over time even as the general category (green) is staying about the same. 
![Bar chart measuring book sales by genre: fantasy & sci-fi, general, western, romance, literature, mystery/crime](https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/2H6ZIpq0R-y-mSKatKfsuQ_268ae7d3d10049419721b4cb52a9375f_Screen-Shot-2021-02-28-at-4.13.08-PM.png?expiry=1786464397490&hmac=dwWe5a0QHHagKEm17odT69EB50EZfSxalrb7-WaqN5I)
	- **Repetition:** Repeating chart types, shapes, or colors adds to the effectiveness of your visualization. Think about the book sales chart from the previous example: the repetition of the colors helps the audience understand that there are distinct sets of data. You may notice this repetition in all of the examples we have reviewed so far. Take some time to review each of the previous examples and notice the elements that are repeated to create a meaningful visual story.
	- **Proportion:** Proportion is another way that you can demonstrate the importance of certain data. Using various colors and sizes helps demonstrate that you are calling attention to a specific visual over others. If you make one chart in a dashboard larger than the others, then you are calling attention to it. It is important to make sure that each chart accurately reflects and visualizes the relationship among the values in it. In [**this dashboard**](https://developers.google.com/chart/interactive/docs/gallery/controls "this dashboard") (also shown below), the slice sizes and colors of the pie chart compared to the data in the table help make the number of donuts eaten by each person the focal point. 
![dashboard with a pie chart and table](https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/W-CTuFxISVigk7hcSJlYLQ_f516a6799c194f71a706ab727167e28a_Screen-Shot-2021-02-28-at-4.13.44-PM.png?expiry=1786464397490&hmac=_lmSBlPXhLcUPdKwcNxIFRNqiU9mrx2BGIGaaPZpXpY)
These first six principles of design are key considerations that you can make while you are creating your data visualization. These next three principles are useful checks once your data visualization is finished. If you have applied the initial six principles thoughtfully, then you will probably recognize these next three principles within your visualizations already. 
	- **Rhythm:** This refers to creating a sense of movement or flow in your visualization. Rhythm is closely tied to the movement principle. If your finished design doesn’t successfully create a flow, you might want to rearrange some of the elements to improve the rhythm.
	- **Variety:** Your visualizations should have some variety in the chart types, lines, shapes, colors, and values you use. Variety keeps the audience engaged. But it is good to find balance since too much variety can confuse people. The variety you include should make your dashboards and other visualizations feel interesting and unified.
	- **Unity:** The last principle is unity. This means that your final data visualization should be cohesive. If the visual is disjointed or not well organized, it will be confusing and overwhelming.
- ***Question: Which one will make it easiest for the user to understand the point you're trying to make?*** (→ [Digital marketing Course 5: Chart types in spreadsheets](/blog/assess-for-success-marketing-analytics-and-measurement/))
	- Over time: Line, Bar, Stacked Bar, Area
	- Between objects: Ordered Bar, Ordered Column, Group Bar
	- **Data Composition**: Combining the individual parts in a visualization and displaying them together as a whole: 
		- Stacked Bar
		- Pie
		- Donut
		- Treemap
		- Stacked Area
	- Relationships: Scatterplot, Bubble, Column/Line, Heatmap
![Pasted image 20260810231845](/vault-assets/pasted-image-20260810231845-20390102.png)
- Element for effective visuals: 
	- Clear meaning: good viz clearly communicate their intended insight
	- Sophisticated use of contrast: helps separate the most important data from the rest using visual context that our brain naturally look for.
	- Refined execution: include deep attention to detail, using visual elements like lines, shapes,...
- Four elements of successful visualizations: The Venn diagram by David McCandless identifies four elements of successful visualizations: 
	- **Information (data):** The information or data that you are trying to convey is a key building block for your data visualization. Without information or data, you cannot communicate your findings successfully.
	- **Story (concept):** Story allows you to share your data in meaningful and interesting ways. Without a story, your visualization is informative, but not really inspiring. 
	- **Goal (function):** The goal of your data visualization makes the data useful and usable. This is what you are trying to achieve with your visualization. Without a goal, your visualization might still be informative, but can’t generate actionable insights.
    - **Visual form (metaphor):** The visual form element is what gives your data visualization structure and makes it beautiful. Without visual form, your data is not visualized yet. 
All four of these elements are important on their own, but a successful data visualization balances all four. For example, if your data visualization has only two elements, like the information and story, you have a rough outline. This can be really useful in your early planning stages, but is not polished or informative enough to share. Even three elements are not quite enough—you need to consider all four to create a successful data visualization.
- **Design thinking:** A process used to solve complex problems in a user-centric way.
- Five phases of the design process: 
	- Empathize: emotions and needs of the target audience of data viz, whether it's stakeholders, team members or the general public. Avoid areas where people might face obstacles interacting with viz
	- Define: helps to find audiences needs, their problems, and your insights.
	- Ideate: start generate data viz ideas
	- Prototype: putting charts, dashboards or other viz together
	- Test
- Design thinking for visualization improvement: https://www.coursera.org/learn/visualize-data/supplement/ihlqt/optional-design-thinking-for-visualization-improvement
### Visualization considerations
- Pro tips for highlighting key information: https://www.coursera.org/learn/visualize-data/supplement/ewNyk/pro-tips-for-highlighting-key-information

|Visualization components|Guidelines|Style checks|
|---|---|---|
|Headlines|- **Content**: Briefly describe the data - **Length**: Usually the width of the data frame - **Position**: Above the data|- Use brief language - Don’t use all caps - Don’t use italic - Don’t use acronyms - Don't use abbreviations - Don’t use humor or sarcasm|
|Subtitles|- **Content**: Clarify context for the data - **Length**: Same as or shorter than headline - **Position**: Directly below the headline|- Use smaller font size than headline - Don’t use undefined words - Don’t use all caps, bold, or italic - Don’t use acronyms - Don't use abbreviations|
|Labels|- **Content**: Replace the need for legends - **Length**: Usually fewer than 30 characters - **Position**: Next to data or below or beside axes|- Use a few words only - Use thoughtful color-coding - Use callouts to point to the data - Don’t use all caps, bold, or italic|
|Annotations|- **Content**: Draw attention to certain data - **Length**: Varies, limited by open space - **Position**: Immediately next to data annotated|- Don’t use all caps, bold, or italic - Don't use rotated text - Don’t distract viewers from the data|
- Ways to make data visualizations accessible:
	- **Labeling**: helps label data directly instead of relying exclusively on legends, which require color interpretation and more effort by the viewer to understand
	- **Text alternatives**: Alternative text provides a textual alternative to non-text content
		- can be changed into other forms people need, such as large print, braille, or speech.
	- **Text-based format**: available through an export to Sheets or Excel
	- **Distinguishing**: helps people see and hear content by separating foreground from background: colors, textures and shapes
	- **Simplify**: Avoid over complicating data viz
- Design a chart in 60 minutes: 
	- **Prep (5 min):** Create the mental and physical space necessary for an environment of comprehensive thinking. This means allowing yourself room to brainstorm _how_ you want your data to appear while considering the amount and type of data that you have.
	- **Talk and listen (15 min):** Identify the object of your work by getting to the “ask behind the ask” and establishing expectations. Ask questions and really concentrate on feedback from stakeholders regarding your projects to help you hone how to lay out your data. 
	- **Sketch and design (20 min):** Draft your approach to the problem. Define the timing and output of your work to get a clear and concise idea of what you are crafting.
	- **Prototype and improve (20 min):** Generate a visual solution and gauge its effectiveness at accurately communicating your data. Take your time and repeat the process until a final visual is produced. It is alright if you go through several visuals until you find the perfect fit.
## Module 2: Create data visualizations with Tableau
### Get started with Tableau
- Tableau Public: 
	- email: [email hidden]
	- pass: Thuha2003@
	- Create a Viz: Within your Tableau Public profile, you’ll find tabs for **Vizzes**, **Favorites**, **Following**, and **Followers**. If you haven’t created a public viz yet, there are two buttons in the **Vizzes** tab: **Create a Viz** and **Explore Sample Data**. Selecting the Explore Sample Data button is a great way to try out the tool on your own and test how the software works in a sandbox-like environment. There is also a **Create a Viz** button at the upper right of the page. At the instructor’s prompt, select either of the two **Create a Viz** buttons.
	- After you select **Create a Viz**, you will be directed to a screen that asks you to connect to data. Tableau Public needs data to work with, such as a spreadsheet, .json, or .csv file, for example. When prompted by the instructor, upload the data provided using the **Connect to Data** screen. You can also use any of the sample data that you find in the [Learn](https://public.tableau.com/app/learn/sample-data) area.
- Visualizations in spreadsheets and Tableau: 
	- **Primary chart types in spreadsheets**: In spreadsheets, **charts** are graphical representations of data from one or more sheets.
		- **Column (vertical bar)**: a column chart allows you to display and compare multiple categories of data by their values.
		- **Line**: a line chart showcases trends in your data over a period of time. The last line chart example is a combo chart which can include a line chart. Refer to the description for the combo chart type.
		- **Pie**: a pie chart is an easy way to visualize what proportion of the whole each data point represents.
		- **Horizontal bar**: a bar chart functions similarly to a column chart, but is flipped horizontally.
		- **Scatter**: scatterplots are typically used to display trends in numeric data.
		- **Combo**: combo charts use multiple visual markers like columns and lines to showcase different aspects of the data in one visualization. The example below is a combo chart that has a column and line chart together.
		- More: 
			- https://support.google.com/docs/answer/190718?hl=en
			- https://www.tutorialspoint.com/excel_charts/excel_charts_types.htm
	- How visualizations differ in Tableau: As you have also learned, Tableau is an analytics platform that helps data analysts display and understand data. Most if not all of the charts that you can create in spreadsheets are available in Tableau. But, Tableau offers some distinct charts that aren’t available in spreadsheets.
		- **Highlight tables** appear like tables with conditional formatting. Review the [steps to build a highlight table](https://help.tableau.com/current/pro/desktop/en-us/buildexamples_highlight.htm). 
		- **Heat maps** show intensity or concentrations in the data. Review the [steps to build a heat map](https://help.tableau.com/current/pro/desktop/en-us/buildexamples_highlight.htm).
		- **Density maps** illustrate concentrations (such as a population density map). Refer to [instructions to create a heat map for density](https://help.tableau.com/current/pro/desktop/en-us/maps_howto_heatmap.htm).  
		- **Gantt charts** demonstrate the duration of events or activities on a timeline. Review the [steps to build a Gantt chart](https://help.tableau.com/current/pro/desktop/en-us/buildexamples_gantt.htm).
		- **Symbol maps** display a mark over a given longitude and latitude. Learn more from this [example of a symbol map](https://interworks.com/blog/ccapitula/2014/08/18/tableau-essentials-chart-types-symbol-map/).
		- **Filled maps** are maps with areas colored based on a measurement or dimension. Explore an [example of a filled map](https://interworks.com/blog/ccapitula/2014/09/23/tableau-essentials-chart-types-filled-map/).
		- **Circle views** show comparative strength in data. Learn more from this [example of a circle view](https://interworks.com/blog/ccapitula/2014/10/17/tableau-essentials-chart-types-circle-view/).
		- **Box plots**, also known as **box and whisker charts,** illustrate the distribution of values along a chart axis. Refer to the [steps to build a box plot](https://help.tableau.com/current/pro/desktop/en-us/buildexamples_boxplot.htm).
		- **Bullet graphs** compare a primary measure with another and can be used instead of dial gauge charts. Review the [steps to build a bullet graph](https://help.tableau.com/current/pro/desktop/en-us/qs_bullet_graphs.htm).
		- **Packed bubble charts** display data in clustered circles. Review the [steps to build a packed bubble chart](https://help.tableau.com/current/pro/desktop/en-us/buildexamples_bubbles.htm)
- **Create a data visualization in Tableau**: 
	- Double-click or drag the sheet to load that data into the main part of the screen
	- Each row corresponds to a single data point, and each column represents a different feature.
	- Tableau interprets the type of data in each column, each icon represents a different type of data: 
		- #: Numeric data
		- Abc: String data
		- Globe: Geographic data
		- Calendar: Date data
		- Calendar with a clock: Date and time data
	- Choose sheet (left corner) to show the viz screen
		- Tables: dimensions of the data - contain qualitative values (such as names, dates, or geographical data). You can use dimensions to categorize, segment, and reveal the details in your data. Dimensions affect the level of detail in the view.
		- Below the line: different measure that you can track for these dimension - contain numeric, quantitative values that you can measure. Measures can be aggregated. When you drag a measure into the view, Tableau applies an aggregation to that measure (by default).
- Xem thêm: [Project management: data visualization tools](/blog/project-execution-running-the-project/) – visualizing project data
### Design visualizations in Tableau
- **Diverging color palette**: Display two ranges of values using color intensity to show the magnitude of the number and the actual color to show which range the number is from
- **Essential design principles** (→ [Digital marketing Course 5: Design principles for slides, data-ink ratio](/blog/assess-for-success-marketing-analytics-and-measurement/)):

| **Principle**               | **Description**                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choose the right visual     | One of the first things you have to decide is which visual will be the most effective for your audience. Sometimes, a simple table is the best visualization. Other times, you need a more complex visualization to illustrate your point.                                                                                               |
| Optimize the data-ink ratio | The data-ink entails focusing on the part of the visual that is essential to understanding the point of the chart. Try to minimize non-data ink like boxes around legends or shadows to optimize the data-ink ratio.                                                                                                                     |
| Use orientation effectively | Make sure the written components of the visual, like the labels on a bar chart, are easy to read. You can change the orientation of your visual to make it easier to read and understand.                                                                                                                                                |
| Color                       | There are a lot of important considerations when thinking about using color in your visuals. These include using color consciously and meaningfully, staying consistent throughout your visuals, being considerate of what colors mean to different people, and using inclusive color scales that make sense for everyone viewing them.  |
| Numbers of elements         | Think about how many elements you include in any visual. If your visualization uses lines, try to plot five or fewer. If that isn’t possible, use color or hue to emphasize important lines. Also, when using visuals like pie charts, try to keep the number of segments to less than seven since too many elements can be distracting. |

*How to choose a data visualization.pdf*
 - Some common errors to avoid: 

|**What to avoid**|**Why**|
|---|---|
|Cutting off the y-axis|Changing the scale on the y-axis can make the differences between different groups in your data seem more dramatic, even if the difference is actually quite small.|
|Misleading use of a dual y-axis|Using a dual y-axis without clearly labeling it in your data visualization can create extremely misleading charts.|
|Artificially limiting the scope of the data|If you only consider the part of the data that confirms your analysis, your visualizations will be misleading because they don’t take all of the data into account.|
|Problematic choices in how data is binned or grouped|It is important to make sure that the way you are grouping data isn’t misleading or misrepresenting your data and disguising important trends and insights.|
|Using part-to-whole visuals when the totals do not sum up appropriately|If you are using a part-to-whole visual like a pie chart to explain your data, the individual parts should add up to equal 100%. If they don’t, your data visualization will be misleading.|
|Hiding trends in cumulative charts|Creating a cumulative chart can disguise more insightful trends by making the scale of the visualization too large to track any changes over time.|
|Artificially smoothing trends|Adding smooth trend lines between points in a scatter plot can make it easier to read that plot, but replacing the points with just the line can actually make it appear that the point is more connected over time than it actually was.|
- A few rules about what makes a helpful data visualization:
	- **Five-second rule:** A data visualization should be **clear, effective, and convincing** enough to be absorbed in five seconds or less    
	- **Color contrast:** Graphs and charts should use a **diverging color palette** to show contrast between elements.
	- **Conventions and expectations:** Visuals and their organization should align with **audience expectations** and **cultural conventions**. For example, if the majority of your audience associates green with a positive concept and red with a negative one, your visualization should reflect this.
	- **Minimal labels:** Titles, axes, and annotations should use as **few labels** as it takes to make sense. Having too many labels makes your graph or chart too busy. It takes up too much space and prevents the labels from being shown clearly.
### Work with multiple data sources
- JOIN: 
	- Kéo data cần JOIN vào **Multiple connection section** sau đó double click vào box đó để tạo một physical table giúp tạo JOIN.
	- Tạo JOIN đầu tiên, kéo data cần join vào bên trái box data đầu tiên sau đó chọn các cột join của hai data 
- Tableau resources for combining multiple data sources: 

| **Resource**                                                                                                                                                              | **Description**                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Set up data sources**](https://help.tableau.com/current/pro/desktop/en-us/datasource_prepare.htm "set up data sources")                                                | This page links to other resources explaining how to **set up your data sources** and prepare them for analysis once you have connected them to your Tableau account. It specifically includes articles explaining how to join or blend data, and what a union is and how they work. This is a great starting point as you get ready to begin using and combining data sources. |
| [**Join your data**](https://help.tableau.com/current/pro/desktop/en-us/joining_tables.htm "join your data")                                                              | **Joining** refers to the process of combining data sources based on common fields. This article gives a more detailed explanation of the different joins, how to use them in Tableau, and an example join with a step-by-step guide.                                                                                                                                           |
| [**Don’t be scared of relationships**](https://help.tableau.com/v2020.2/pro/desktop/en-us/datasource_dont_be_scared.htm "Don't be scared of relationships")               | **Relationships** allow you to combine multiple data sources in Tableau. This is a more flexible alternative to joins, and doesn’t force you to create one single table with your multiple data sources. This article will give you more insight into how relationships work.                                                                                                   |
| [**How relationships differ from joins**](https://help.tableau.com/current/online/en-us/datasource_relationships_learnmorepage.htm "how relationships differ from joins") | This article goes into more detail about the differences between using **relationships and joins**, and guides you through the process of using relationships to combine data.                                                                                                                                                                                                  |
| [**Blend your data**](https://help.tableau.com/current/pro/desktop/en-us/multiple_connections.htm "blend your data")                                                      | **Data blending** is another method you can use to combine multiple data sources. Instead of truly combining the data, blends allow you to query and aggregate data from multiple sources. This resource goes into more detail about blending and includes a tutorial.                                                                                                          |
| [**Combining multiple date fields**](https://kb.tableau.com/articles/howto/combining-start-and-end-dates-into-a-single-axis "combining multiple date fields")             | This resource provides examples that explain how to **combine date fields** when using four different methods of data combination in Tableau.                                                                                                                                                                                                                                   |
## Module 3: Craft data stories
### Data-driven storytelling
- [Dashboard]: A tool that organizes information from multiple datasets into one central location for tracking, analysis, and simple visualization.
- [Dashboard filter]: A tool for showing only the data that meets a specific criteria while hiding the rest
- [Data storytelling]: Communicating the meaning of a dataset with visuals and a narrative that are customized for each particular audience (→ [Communicating the benefits of ANR](/blog/communicating-the-benefits-of-anr/))
- 3 data storytelling steps
	1. Engage your audience: **Engagement** - Capturing and holding someone's interest and attention
		- What role does this audience play?
		- What is they stake in the project?
		- What do they hope to get from the data insights I deliver?
		***Choose your primary message.***
		- [Spotlighting]: Scanning through data to quickly identify the most important insights.
	2. Create compelling visuals
	3. Tell the story in an interesting narrative
### Tableau dashboards
#### Tableau dashboard basics
- Car dashboard analogy: warning lights constantly track and analyze the car's status so the driver can respond; without it you'd have to dig through the user manual
- Companies use dashboards to share information, engage people with business plans and goals, and uncover potential problems
- **Dashboard**: a tool that organizes information from multiple datasets into one central location for tracking, analysis, and simple visualization through tables, charts, and graphs (→ [Digital marketing Course 5: Tableau marketing dashboards](/blog/assess-for-success-marketing-analytics-and-measurement/))
	- Works by constantly monitoring live incoming data
	- A big part of step 2 of the three data storytelling steps
- Design dashboards for specific stakeholders: who will look at the data, what they need from it, how often they'll use it
	- Too much data confuses and distracts people; a dashboard keeps things neat, tidy, easy to understand
	- Start simple with the most important data points; tweak or create a new dashboard later if something is missing
- Layout: elements must be **cohesive** (balanced, make good use of space); resize and reorganize so it works for users
	- **Vertical layout**: adjusts the height of the views/objects it contains
	- **Horizontal layout**: resizes the width of the views/objects it contains
	- Evenly distribute items to create a clear, organized visual
	- **Tiled** items: part of a single-layer grid that automatically resizes based on overall dashboard size (don't overlap)
	- **Floating** items: can be layered over other objects
- Most people are visual learners → sharing dashboards is valuable
- Risk: sharing dashboards means you lose control of the narrative – viewers craft their own story and conclusions
	- Still be collaborative and open; more people working on the problem → more connections, new practices and innovations
#### Live and static insights
- Live vs static depends on: how old the data is; how long until insights are stale; whether the analysis needs regular updating to stay valuable
- **Static data**: screenshots/snapshots in presentations, or dashboards built on snapshots of data
	- PROS: tightly control a point-in-time narrative; allows complex analysis to be explained in-depth to a larger audience
	- CONS: insight loses value immediately and keeps losing it; snapshots can't keep up with the pace of data change
- **Live data**: dashboards, reports, and views connected to automatically updated data
	- PROS: more dynamic and scalable dashboards; most up-to-date data to the people who need it when they need it; curated views with a scalable "single source of truth"; immediate action on frequently changing data; saves time/resources per analysis
	- CONS: takes engineering resources to keep pipelines live and scalable; without the ability to interpret data you can lose control of the narrative → **data chaos** (teams reaching conflicting conclusions from the same data); can cause lack of trust if data isn't handled properly
- Key takeaway: know the business and data so you can recommend when a static analysis should be refreshed, and make the case for which analyses, visualizations, and additional data are needed
- Keep the [customer survey spreadsheet](https://docs.google.com/spreadsheets/d/1DWIKPvtci3Gq6Qbz15SjjY6l4wbc_4I-CpVaFDPneDA/template/preview?resourcekey=0-OOpDEJqur_5qsHXNIt2Bqg) for the next video
- Live and static insights: https://www.coursera.org/learn/visualize-data/supplement/vCKv9/live-and-static-insights
#### From filters to charts
- **Filtering**: showing only the data that meets specific criteria while hiding the rest
	- Tableau lets you limit the data based on criteria you specify: e.g. only the last six months, one particular customer, or limit the number of rows/columns in a view
	- World happiness example: filter for just GDP, family, generosity, freedom, trust, and health, then create individual scatterplots for each
- Filters can highlight or hide individual data points (e.g. explore a scatterplot without outliers)
	- Not OK to drop a data point just because it's an outlier – outliers can be the most interesting observations; investigate before removing (→ [Boxplot và outlier](/blog/data-exploration-using-descriptive-statistics/))
- Steps to filter data points from a view:
	1. Select a single data point, or click and drag to select several points
	2. On the tooltip, select **Exclude** to hide them (or **Keep only** selected points)
- Filter rows/columns in a table: select the rows you want, then on the tooltip choose keep only (or exclude)
- **Prefilter** a dashboard so stakeholders don't have to filter themselves – saves time and directs them to the important data
- Filters cut clutter and let you zero in on what's important (e.g. isolate ad tactics such as search or YouTube ads to see which work best)
- Build a chart in Google Sheets (customer survey spreadsheet):
	1. Select the column for software package (basic, plus, premium) → Insert → Chart
	2. Sheets suggests a chart type; you can change it, assign styles, axis titles, legend, etc.
	3. Highlight columns A and B (country, satisfaction score) → Insert → Chart → Chart type → select the first **map** option
	4. Click **Customize** (top right) → **Geo** → change min/mid/max colors to light/middle/dark blue gradient instead of red and green
- Blue gradient map shows most satisfied in dark blue, least in light blue – more accessible for people with color vision deficiencies
#### Hands-On Activity: Create, filter, and customize charts
- Goal: create a chart in a spreadsheet and customize it with filters and styles
- Template: [Cosmetics, Inc](https://docs.google.com/spreadsheets/d/1qaSKSyfvXz3Zsu_RU7abK-eNScSyGSe2oXT1KgiaMXI/template/preview) (or download the Cosmetics Inc. XLSX from the activity page)
- Step 2 – create a chart (Google Sheets; similar in Excel):
	1. Work in the first tab "Create your chart here" (total purchases per store)
	2. Highlight cells B3 through C7
	3. Insert → Chart
	4. In the Chart editor, change Chart type to **Column chart** (title: Total Purchases vs store name)
	5. Setup → below X-axis → three dots → **Add labels** (range B3:B7)
	6. Select the header row (row 3) → filter icon in the toolbar (or Data → Create a filter after selecting B3:C3)
	7. Filter icon for Store Name → uncheck Candy's Beauty Supply
	8. OK → chart updates to exclude that store (re-check the box to add it back)
- Step 3 – apply styles:
	1. Double-click the chart → Chart editor
	2. Expand **Series**
	3. Format → Fill color → **Custom**
	4. Change the Hex value to an accessible blue for white backgrounds: #0071bc, #046b99, #205493 ([Web accessibility guidelines](http://web-accessibility.carnegiemuseums.org/design/color/))
	5. OK → chart updates
- Resources: [Graphs in Google Sheets](https://www.datacamp.com/community/tutorials/graphs-in-spreadsheets), [Add and edit a chart or graph in Google Sheets](https://support.google.com/docs/answer/63824), [Create a Microsoft Excel chart from start to finish](https://support.microsoft.com/en-us/office/create-a-chart-from-start-to-finish-0baf399e-dd61-4e18-8a73-b3fd5d5680c2), [Microsoft Excel: Creating and modifying charts](https://guides.lib.umich.edu/c.php?g=283162&p=1886446)
- Pro tip: save a blank copy of the template for further practice
- Reflection question (chưa nộp): which changes customize a chart in a spreadsheet (chart type dropdown / Series dropdown colors / updating relevant cells); 2-3 sentences on advantages/disadvantages of charting in a spreadsheet
- Hands-On Activity: Create, filter, and customize charts: https://www.coursera.org/learn/visualize-data/assignment-submission/spAfZ/hands-on-activity-create-filter-and-customize-charts
#### Create your first Tableau dashboard
- Dashboards let people visualize data in dynamic, interactive ways; put all key information in one place; many update constantly and are interactive
- Open [Tableau Public](https://public.tableau.com/app/discover); see [Using Tableau Public](https://www.coursera.org/learn/visualize-data/supplement/bMjvq) for account/profile/loading datasets
- Dataset: [CO2 Dataset](https://docs.google.com/spreadsheets/d/1NBV7WYvOX-WbB6f7JLm0jaaf5E-L9Me5fKVFgBkNJKo/template/preview) (or download the CO2 Dataset XLSX)
- Load the dataset:
	1. In Tableau Public: Create → Web Authoring → **Upload from computer** → select the CO2 dataset
	2. Save datasets to the **data sources folder** Tableau creates by default (best practice: keep data files in one place)
	3. All tabs of the dataset appear in a vertical toolbar on the left
	4. Drag the sheet **CO2 Data Cleaned** to the middle of the page → **Update Automatically**
	5. Go to **Sheet 1** at the bottom
	6. Drag green **# Year** to **Columns**
	7. Drag green **# CO2 (kt)** to **Rows**
	8. Drag blue **Abc Region** to **Colors**
- Result: a basic timeline dashboard of CO2 (kilotons) emitted by regions from 1960 to 2012
- Do a preliminary analysis of categories, rows, data ranges, null values on the data source page to get ideas for other dashboard types
- Additional dashboard types: [Tableau help – Create a dashboard](https://help.tableau.com/current/pro/desktop/en-us/dashboards_create.htm)
- Create your first Tableau dashboard: https://www.coursera.org/learn/visualize-data/supplement/nGpig/create-your-first-tableau-dashboard
#### Hands-On Activity: Build a dashboard in Tableau
- Requires Tableau Public Desktop app to import the Dashboards Starter Template (TWBX); Chromebook users: use the two visualizations from the previous Tableau activities as Sheet 1 and Sheet 2
- Step 1: copy the CO2 dataset (same link as above) and download the Dashboards Starter Template (TWBX file on the activity page)
- Step 2: open the template in Tableau Public Desktop → shows the **CO2 Production by Region** sheet (line chart of CO2 kt by year, six trendlines, all trending upward); workbook has Sheet 1 and Sheet 2 but not the dataset
- Step 3 – load the data:
	1. Select the **Data Source** tab in the sidebar
	2. Navigate to the downloaded "CO2 Dataset.xlsx" and open it
	3. Locate the **My Tableau Repository** folder (usually in Documents)
	4. Open My Tableau Repository → **Datasources**
	5. Drag your datasets into the Datasources folder (best practice: always move Tableau datasets there)
- Step 4 – create a dashboard: Sheet 1 = average CO2 per capita per country (map); Sheet 2 = line chart of CO2 production per region over time; select **Add Dashboard** (middle button on the bottom row, spreadsheet-with-plus icon)
	- Dashboard pane: size, list of sheets, Objects (Horizontal Container, Vertical Container, Text, Extension, Ask Data, Data Story, Image, Blank, Workflow, Web Page), tiled/floating toggle, show dashboard title checkbox
- Step 5 – add visualizations:
	1. Drag Sheet 1 onto "Drop sheets here"
	2. Drag Sheet 2 so it takes up the bottom half (layout adjusts depending on where you drop)
- Step 6 – clean the dashboard (three legends, only two needed; CO2 per capita is shown by both size and color):
	1. Delete the topmost (size) legend: select it → close (X)
	2. Select a remaining legend
	3. More Options dropdown → **Floating**
	4. Drag it to the top-right corner of the map
	5. Repeat for the other legend → top-right corner of the bottom graph
- Pro tip: save a copy of the dataset and template
- Reflection question (chưa nộp): how you arranged the sheets; other uses of dashboards; a dashboard you'd like to create
- Hands-On Activity: Build a dashboard in Tableau: https://www.coursera.org/learn/visualize-data/assignment-submission/TT03O/hands-on-activity-build-a-dashboard-in-tableau
#### Test your knowledge on using Tableau dashboards
- Practice quiz (8 min) – chưa làm: https://www.coursera.org/learn/visualize-data/assignment-submission/RsiAy/test-your-knowledge-on-using-tableau-dashboards
### Share data stories
#### Compelling presentation tips
- Data won't get you anywhere if stakeholders can't understand it or stay focused → presentations must be logically organized, interesting, and communicate key messages clearly
- An effective presentation supports your narrative by making it more interesting than words alone
- Five key parts of a data story:
	- **Characters**: the people affected by your story (stakeholders, customers, clients…); add a personal account and human context; think about why they care
	- **Setting**: what's going on, how often it's happening, what tasks are involved, background about the current situation
	- **Plot** (conflict): what creates tension – a competitor's challenge, an inefficient process, a new opportunity; reveals the problem your analysis solves and compels characters to act
	- **Big reveal** (resolution): how the data shows you can solve the problem (become more competitive, improve a process, invent a new system…)
	- **Aha moment**: share your recommendations and explain why they'll help the company succeed (the instructor likes to start here)
- Use these five elements to outline the presentation, then pair the narrative with interesting, persuasive visuals
#### Share a narrative
- Your presentation reflects on you: messy/disorganized/unsupportive images → audience loses confidence; professional and appealing → keeps attention on main points
- **Themes**: control color, font types and sizes, formatting, and positioning of text and visuals; pick one matching the tone → consistent look that supports your argument
- **Title slide**: title and subtitle describing what you'll present, plus the **date** (e.g. "date created" or "date last updated") – important context for data that changes over time
- Slides guide the audience through main points; don't repeat every word you say
	- Choose what to include: description of a visual, first step of a process, directions, or a key message
	- Font size readable; rule: **less than 5 lines and 25 words per slide**
	- Avoid slang, unknown abbreviations, region-specific phrases
- **Visuals**: help the audience quickly understand each slide; great visuals leave no room for interpretation
	- Don't share too many details at once; choose only data points that support your points, especially the key message
	- Ask: "What's the single most important thing I want my audience to learn from my analysis?"
	- Several important things → one visual per point, not crammed on one slide; add an arrow, call-out, or clearly labeled element to direct attention
	- Big reveal and aha moment visuals must communicate with clarity and excitement
- Copy/paste vs link vs embed a visual:
	- **Copy and paste**: editable directly in the slideshow; changes don't affect the original (e.g. Tableau dashboard); visual won't update if the original dataset changes
	- **Link**: visual lives in its original file; slideshow connects via the visual's URL; changes to the original automatically appear in the presentation – useful for data that changes over time
	- **Embed**: object lives in the original source file but does NOT auto-update; embedded copy is completely independent; edits in the presentation don't affect the original
	- Main difference: where they're stored and how you update them
- Practice: create a slideshow with a theme, text, visuals, and a reveal; try pasting, linking, and embedding visuals from different sources
#### Hands-On Activity: Practice presenting
- Goal: screenshot dashboard visualizations, build a short presentation, record yourself, evaluate delivery and slides
- Step 1 – screenshots of your Tableau dashboard:
	1. Log in to Tableau Online → Recents → open the dashboard
	2. Download icon → **Image** (saves a .png), or
	3. OS screenshot: Chromebook Ctrl + Show windows (Ctrl + F5 on non-Chrome OS keyboards); Mac Shift + Command + 4; Windows snipping tool ([Microsoft Support](https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b#take-screen-capture-print-screen=windows-7))
- Step 2 – prepare the presentation (audience: stakeholders not closely involved but curious about the analysis, dashboard, and key findings):
	- Title slide: title, your name, date
	- Next slides: one or two dashboard screenshots each + bullet points giving context
	- Closing slide with final take-aways
	- Tools: [Google Slides](https://www.google.com/slides/about/), [Microsoft 365](https://www.microsoft.com/en-us/microsoft-365/free-office-online-for-the-web), [Prezi](https://prezi.com/)
	- Record yourself (phone, camera, webcam; [Screencastify](https://www.screencastify.com/) or [Camtasia](https://www.techsmith.com/download/camtasia/)) – deliver in 2 to 3 minutes; check lighting and focus
- Step 3 – delivery checklist. Do you:
	- Use an attention-grabbing opening?
	- Start with broad ideas and later talk about specific details?
	- Speak in short sentences?
	- Pause for five seconds after showing a data visualization?
	- Pause intentionally at certain points?
	- Keep the pitch of your voice level?
	- Stand still and move with purpose?
	- Maintain good posture?
	- Look at your audience (or camera) while speaking?
	- Keep your message concise?
	- End by explaining why the data analysis matters?
- Slide deck checklist. Do you:
	- Include a good title and subtitle?
	- Include the date of the presentation / last update?
	- Use a readable font size?
	- Showcase what business metrics you used?
	- Include effective visuals (charts, graphs)?
- Save the checklist; you'll rerecord and reevaluate later in the course
- Reflection question (chưa nộp): what you learned about your delivery; what worked well / could improve in the slide deck
- Hands-On Activity: Practice presenting: https://www.coursera.org/learn/visualize-data/assignment-submission/uLhnv/hands-on-activity-practice-presenting
#### Elements of an effective narrative (ungraded plugin)
- Scenario: Libby, a data analyst at a home improvement store, prepares a presentation; match each scenario to one of the five storytelling elements
	- Head of marketing shares a large supply chain dataset and a market research report, asks Libby for in-depth analysis → **Setting** (what's happening and other background info)
	- Libby suggests a three-day lumber sale across all U.S. stores within two weeks, and monitoring sales and consumer sentiment to inform future campaigns → **Aha moment** (data-driven recommendations)
	- Head of marketing will use Libby's analysis to present to the executive team and board of directors → **Characters** (people affected by the story)
	- Lumber prices up 32%, the store must mitigate supply chain inefficiencies and find new opportunities → **Plot** (creates tension; characters need data to prove the need for a campaign)
	- Supply issues cut inventory last year but are almost resolved; demand is strong → big opportunity to run campaigns before competitors → **Big reveal** (how data solves the problem)
- Takeaway: use all five elements – characters, setting, plot, big reveal, aha moment
- Elements of an effective narrative: https://www.coursera.org/learn/visualize-data/ungradedWidget/p0idZ/elements-of-an-effective-narrative
#### Sundas: How to manage imposter syndrome
- Sundas, Analytical Lead at Google: turns data into stories that influence business decisions; untraditional path (6-year gap, community college, online learning while raising kids)
- Imposter syndrome: first woman in her family to graduate, an immigrant, often surrounded by people who don't look like her; nervous presenting to senior leaders ("they'll figure out I'm a fraud")
- What helped:
	- Networking and expanding her network – meeting women from her country with similar struggles who were succeeding: "if they can do it, so can I"
	- Give yourself a **pep talk** ("you're worth it, you deserve it")
	- Keep a **log of successes and failures** – look back at achievements when feeling down; a reminder you got there through hard work, not luck
- Imposter syndrome is normal and ongoing; being the first makes you someone others (especially girls in her family) can look up to
#### Test your knowledge on sharing data stories
- Practice quiz (8 min) – chưa làm: https://www.coursera.org/learn/visualize-data/assignment-submission/DPSz2/test-your-knowledge-on-sharing-data-stories
### Module 3 challenge
#### Glossary terms from module 3
- [Data storytelling]: Communicating the meaning of a dataset with visuals and a narrative that are customized for an audience
- [Engagement]: Capturing and holding someone's interest and attention during a data presentation
- [Live data]: Data that is automatically updated
- [Spotlighting]: Scanning through data to quickly identify the most important insights
- Glossary terms from module 3: https://www.coursera.org/learn/visualize-data/supplement/qoWKf/glossary-terms-from-module-3
#### Module 3 challenge
- [ ] Module 3 challenge (graded, 40 min): https://www.coursera.org/learn/visualize-data/assignment-submission/rRUel/module-3-challenge 📅 2026-10-17 ⏫
## Module 4: Develop presentations and slideshows
### The art and science of presentations
#### Pull it all together
- Share phase of the data analysis process: show other people what you found
- Coming up: the art and science of presentations, best practices, bringing multiple data sources together to tell the whole story
- Finding answers is important, but sharing those findings with others is just as important
#### Present with a framework
- A **framework** guides your presentation and creates logical connections that tie back to the business task and metrics; gives the audience context and keeps you focused on the most important information
- **Business task**: the question or problem your data analysis answers; raw data doesn't mean much, but data presented in the context of the business task is easier to connect with
- Example: grocery store chain wants trends in online searches for avocados to make seasonal stocking decisions
	- Slide 2 – goals for the discussion:
		1. Share an overview of historical online avocado searches (how searches have grown year over year and what it means for the business)
		2. Examine seasonal trends in online avocado searches using historical data (helps forecast stocking needs and inform planning)
		3. Discuss potential areas for further exploration (next steps)
	- Frame each data viz: "this graph shows the months with the most online searches for avocados last year, so we can expect interest to fall on the same months this year"
- **Speaker notes**: add important points to remember; not visible in presentation mode; can share the deck with notes ahead of time for accessibility
- Showcase which **business metrics** you used so the audience understands the impact (e.g. number of online avocado searches per month over several years to anticipate demand)
	- Frame a viz with metrics: time period ("Google search queries from 2004 to 2018"), source/scope ("limited to the United States only"), how trends are measured ("Google Trends scores are normalized at 100")
#### Weave data into your presentation
- Tell the audience what data was available during collection, any new relevant data, or whether different data is needed
	- Avocado example: all searches containing the word "avocado" → answers general-interest questions; something specific like guacamole would need different data
- Establish the **initial hypothesis** early: a theory you're trying to prove or disprove with data (e.g. average monthly prices will show clear trends to plan avocado demand)
- Explain the solution to the business task using examples and visualizations
- **McCandless Method** (general → specific, like building a pyramid) (→ [Digital marketing Course 5: Create effective presentations](/blog/assess-for-success-marketing-analytics-and-measurement/)):
	1. **Introduce the graphic by name** (e.g. "Yearly avocado search trends") – directs attention
	2. **Answer the obvious questions before they're asked** – high-level first, then lower-level detail; e.g. where the data is from and what it covers; explain how to read an unusual chart in speaker notes ("time runs in a circle, winter months on top, summer on bottom; farther from center = more queries")
	3. **State the insight** your data viz provides – get everyone on the same page before supporting details; e.g. consistent seasonal trend year over year; low interest October–December; searches peak in January/February (Super Bowl guacamole)
	4. **Call out data to support that insight** – give as many examples as you can (week of Nov 25, 2018 search score ≈ 49 vs week of Feb 4 score 90)
	5. **Tell your audience why it matters** – the "so what" moment: business impact and clear actions (account for lower interest Oct–Dec; prepare for the Super Bowl surge late Jan/early Feb; optimize stocking in spring/summer)
- Self-check: "Does this data point or chart support the point I want people to walk away with?"
#### Review a slide presentation
- Best practices to check in any slide presentation (including your own):
	- **Include a title, subtitle, and date**: audience knows what you're presenting and when the information is from
	- **Use a logical sequence of slides**: guides the audience through the narrative step by step
	- **Provide an agenda with a timeline**: a roadmap so the audience can follow along
	- **Limit the amount of text on slides**: audience should scan it within 5 seconds
	- **Start with the business task**: contextualizes the information, makes it relevant and actionable
	- **Establish the initial hypothesis**: gives a starting point and frames the analysis
	- **Show what business metrics you used**: validates arguments, shows relevance to business outcomes
	- **Use visualizations**: illustrate complex data more effectively than text
	- **Introduce the graphic by name**: aids understanding and retention
	- **Provide a title for each graph**: signposts for quickly grasping meaning
	- **Go from the general to the specific**: keeps everyone on the same page
	- **Use speaker notes** to remember talking points: cue cards for smoother delivery
	- **Include key takeaways**: reinforce the message at the end
- Creating presentations is iterative: review, change, improve
- **Evaluation table**: a checklist per slide – columns for slide number, what works well, what could be improved

| Slide # | What works well | What could be improved |
| ------- | --------------- | ---------------------- |
| 1       |                 |                        |
| 2       |                 |                        |
| 3       |                 |                        |
| 4       |                 |                        |
| 5       |                 |                        |
| 6       |                 |                        |
| 7       |                 |                        |

- Review a slide presentation: https://www.coursera.org/learn/visualize-data/supplement/FThSi/review-a-slide-presentation
#### Brittany: Presentation skills for new data analysts
- Brittany, Analytical Lead at Google – tips:
	- Keep things **"kindergarten simple"**: audiences have varying interest and knowledge levels; nobody wants eyes glazing over
	- Avoid **"eyesore charts"**: too much data, too many colors, busy, unclear point
	- Make it fun: games, quizzes, a video, questions to the audience to keep them engaged and talking back
	- Use storytelling to connect and engage
	- Have an **ally in the room**: present to one or two attendees beforehand for feedback and alignment on the numbers; they'll speak up and lend credibility when the room pokes holes
- Hardest part of the job: convincing people to do something they're not confident about; often takes multiple conversations; worth it when they act on your analysis
#### Step-by-Step: Critique of a presentation
- Orientation for the two Connor videos (watch back to back)
- **Messy presentation** – why it falls short:
	- No story or logical flow
	- No titles
	- Too much text
	- Inconsistent format (no theme)
	- No recommendation or conclusion at the end
	- Main problem: people don't know where to focus; visuals appear without introduction or explanation → audience lost, confused, unclear on actions
- **Good presentation** – best practices applied:
	- Title and date the presentation was last updated
	- Flow or table of contents
	- Transition slides
	- Visual introduction to the data (also used as a repeated theme)
	- Animated bullet points
	- Annotations on top of visuals
	- Logic and progression
	- Limitations to the data (caveats) – what the data can't tell you
	- Audience is logically guided from objectives to conclusions; visualizations introduced with a common theme and placed before each conclusion
- Tip: take notes in your journal on Connor's suggestions and refer back when building your own presentations
- Step-by-Step: Critique of a presentation: https://www.coursera.org/learn/visualize-data/supplement/EHWS8/step-by-step-critique-of-a-presentation
#### Connor: Messy example of a data presentation
- Title slide "The Relationship Between Health and Happiness Around the World": generic world picture, lengthy title, nothing compelling
- First slide: lots of data and text immediately; no statement of purpose, no introduction slide (who I am, why we're here, what to walk away with); no title → audience lost, busy reading and deciphering visuals
- Every slide needs a **title/subtitle** so people know what the slide discusses
- Second slide: better visual (a map with colors for numeric values) but still lots of words, no title; visual switched sides → no consistent **theme**; you should build familiarity with the visuals/data so by the end the audience understands it as well as you do
- Conclusion slide "Laughter is the best medicine": has a title but no logical flow leading to it; only two content slides; too much text; awkward placement
- Think from the audience's view: "Where should my focus be?" – direct their gaze so they know what to listen to and understand
- Summary of problems: no story/logical flow (scatterplots and text, then a heatmap, with no concept behind them); no titles; too much text; uneven and inconsistent; the recommendation/conclusion slide (most important part) wasn't signposted as the end
#### Connor: Good example of a data presentation
- Title slide: simpler – title, presenter, **date** (people may revisit months later; important to know the circumstances of the company at the time)
- Agenda/table of contents: purpose statement → tell your story (present the data) → conclusion (with recommendations in a business context) → appendix (extra data, visuals, context that doesn't fit the flow)
- Transition slide "What are we talking about?": purpose = identify whether geographic, demographic, and/or economic factors contribute to a happier life
- First data slide: title + visual, **no text**; introduce the underlying dataset verbally ("data from residents of European countries 2015–2017, including population, GDP, and happiness score per person")
- **Animations**: direct attention as you speak, stop people getting bogged down when new concepts appear
- **Annotations** on visuals: another way to direct the gaze (e.g. "happiness score" pointing to a country; darker blue = higher score, deeper red = lower)
- Text on screen only short and concise, appearing as you discuss it (bullet: "Happiness levels vary widely by country"; speaker notes: little correlation between geography and happiness)
- **Transitions** between slides via a bullet or speaker notes ("Our next step was to identify the demographic and economic differences…")
- Consistent theme: title and text in the same place → audience familiar within three slides
- Scatterplots can be hard to follow – explain in depth the first time (axes: happiness vs population; trend line tests correlation), then reuse without re-explaining
- One bullet per slide with the result (little to no correlation between happiness and population)
- Explain new technical concepts simply: **correlation coefficient** = measure of strength and direction of the linear relationship between two variables; closer to 1 → positively correlated (both go up); closer to −1 → negatively correlated; closer to 0 → not correlated (→ [Tương quan và hồi quy](/blog/tuong-quan-va-hoi-quy/))
	- Happiness vs health: 0.50 positive correlation
	- GDP vs health: 0.7; GDP vs happiness: strongest of the three → richer countries have higher average happiness
- Keep a logical flow with open questions ("are happy people healthy or healthy people happy?"; what contributes to longer life expectancy?)
- Conclusions slide: wealthier countries with sustained growth tend to be happier; healthier countries tend to be happier but also tend to be wealthy; evidence suggests wealth, health, and happiness go together
- State **caveats**: correlation does not mean one causes the other; future analysis needed for causal effects
- Final slide for questions
- Data storytelling is an art – put your own personality and skill set into it
### Presentation skills and practices
#### Proven presentation tips
- Two key responsibilities of a data analyst: analyze data and present findings effectively; analysis turns raw information into knowledge, but it helps no one if you can't communicate it
- Ways analysts communicate: emails, memos, dashboards, presentations
- Delivery matters: audience should leave empowered and ready to make decisions
- Tips:
	- Nerves are natural; take deep, controlled breaths; channel excitement into passion
	- Apply the McCandless Method to presentations in general: broad ideas, obvious questions, context → then specifics
	- Avocado example goals slide: state of the world on online avocado searches → opportunities and risks of seasonal trends → actionable next steps → discussion with stakeholders
	- **Five-second rule**: after showing a data visualization, wait five seconds, then ask if they understand it; if not, explain, then wait another five seconds before stating the conclusion; don't rush through visualizations
	- Preparation is key: dress rehearsals, writing a script, visualizing yourself presenting – find what works for you
#### Self-Reflection: Examples of great presentations
- McCandless Method recap:
	1. Introduce the graphic by name
	2. Answer obvious questions before they're asked
	3. State the insight of your graphic
	4. Call out data to support that insight
	5. Tell your audience why it matters
- Model TED Talks: [The 3 bones of networking](https://www.youtube.com/watch?v=4OTPJZnBP8s), [Grit: The power of passion and perseverance](https://www.youtube.com/watch?v=H14bBuluwB8), [Looking for a job? Highlight your ability, not your experience](https://www.youtube.com/watch?v=guXxy8LH2QM)
- Model slide decks: [Demystifying value: The importance of lifetime value](https://docs.google.com/presentation/d/1jyZeBt2PizsVU4KdODvzAnUbcz7CIOq6Udvp0d5_jKs/template/preview) (PPTX also downloadable on the activity page), [Airbnb pitch deck from 2008](https://www.failory.com/pitch-deck/airbnb)
- Reflection question (chưa nộp): favorite presentation and the three characteristics that made it your favorite
- Self-Reflection: Examples of great presentations: https://www.coursera.org/learn/visualize-data/assignment-submission/p7SVL/self-reflection-examples-of-great-presentations
#### Guide: Share data findings in presentations
- Downloadable PDF: [Sharing your data findings in presentations – Tips and Tricks](https://www.coursera.org/api/rest/v1/asset/download/pdf/_LwuiIoNSYq8LoiKDUmKxw)
- **Tip 1: Know your flow** – a data story needs a plot (theme and flow), dialogue (talking points), and a big reveal (results and conclusions)
	- Who is my audience?
		- Executives / board / C-suite: keep it high level, brief; focus on results and recommendations
		- Stakeholders and managers: more time; expect data-specific questions; prepare talking points about the analysis
		- Other analysts / individual contributors: most freedom and time to go deep into data, processes, results
	- What is the purpose?
		- Request/recommend something (sales pitch): each slide works toward the recommendations
		- Focus on results: slides mark the path to results, with plenty of breadcrumbs (views of the analysis steps)
		- Report on the analysis: slides summarize data and key findings; let the data speak
- **Tip 2: Prepare talking points and limit text on slides** – you talk while the audience reads; if slides become documents, move text into talking points; **five-second rule**: no more than five seconds reading any block of text; talking points create natural flow and avoid awkward pauses
- **Tip 3: End with your recommendations** – like reaching the mountaintop; one clear, concise slide; if recommending action, give next steps and what a successful outcome looks like
- **Tip 4: Allow enough time for the presentation and questions** – be aware of timing (number of slides, time per slide); every slide tells a unique part of the story (combine if not); save time for questions
- Sample slide deck layout:
	1. **Agenda**: high-level topics with time per topic; most presentations 30 min to 1 hour, e.g. Introductions (4 min), Project overview and goals (5), Data and analysis (10), Recommendations (3), Actionable steps (3), Questions (5)
	2. **Purpose**: why the project matters to the business, e.g. "Service center consolidation is an important cost savings initiative. The aim of this project was to determine the impact of service center consolidation on customer response times."
	3. **Data/analysis**: possible in a single slide with supporting slides in an appendix; if multiple slides: logical order (beginning, middle, end); each slide introduces the next (visual or verbal cues); limit text; slide text ≠ talking points (don't read the slides); animations: fade in one bullet at a time, show only the relevant visual, use arrows/callouts
	4. **Recommendations**: should be obvious if the story was told well; be ready to explain how the data backs them up in different ways
	5. **Call to action**: can be combined with recommendations; separate slide if multiple actions; e.g. if consolidation hurt response times → examine whether processes need to change
- Wrap-up: get candid feedback from your manager or another analyst to improve
- Guide: Share data findings in presentations: https://www.coursera.org/learn/visualize-data/supplement/LFLIP/guide-share-data-findings-in-presentations
#### Evaluate your presentation
- Delivering compelling presentations is as important as the analysis; use clear, jargon-free language for non-data audiences; a presentation bridges complex data and actionable insights
- Build a personal **presentation evaluation checklist**; treat the presentation as a dialogue, not a monologue; visuals should represent data accurately and highlight key takeaways
- Delivery questions: attention-grabbing opening; broad ideas then specifics; short sentences; pause five seconds after a data viz; intentional pauses; level pitch; stand still and move with purpose; good posture; look at the audience/camera; concise message; end by explaining why the analysis matters
- Slide deck questions: good title and subtitle; date of presentation or last update; readable font size; showcase business metrics used; effective visuals (charts and graphs)
- Key takeaway: cycle of practice, feedback, and refinement; welcome constructive criticism
- Evaluate your presentation: https://www.coursera.org/learn/visualize-data/supplement/igsQe/evaluate-your-presentation
#### Present like a pro
- Not everyone experiences presentations the same way: share via email and think about data viz accessibility beforehand
- **Curse of knowledge**: because you did the work, it's hard to imagine the audience not knowing it; focus on what they need to reach the same conclusion
	- Answer basic questions: where the data came from, what it covers, how it was collected, specific time or place
	- Include the guiding hypothesis and goals; assumptions and methods (e.g. grouped months by season); explain the conclusion and how you reached it
- Audiences are busy and distractible: keep it focused and to the point; avoid unrelated stories and irrelevant detail (e.g. an exciting new SQL database); the more you put in a chart, the more the audience needs to explore it – share the right amount to keep them ready to act
- Delivery best practices:
	- Keep sentences short; short words over long ones
	- Build in intentional pauses
	- Keep the pitch level so statements aren't confused for questions
	- Be mindful of nervous habits (talking faster, tapping toes, touching hair); stay still, move with purpose
	- Good posture, positive eye contact
	- Accept and seek feedback – "feedback is a gift"
#### Test your knowledge on presentation skills and practices
- Practice quiz (8 min) – chưa làm: https://www.coursera.org/learn/visualize-data/assignment-submission/3Py4U/test-your-knowledge-on-presentation-skills-and-practices
### Data caveats and limitations
#### Prepare for the Q&A
- **Q&A**: opportunity for stakeholders to ask about your findings; challenging because you don't know what to expect, it requires purposeful listening, and keeping everyone involved
- Consider the objective, stakeholder expectations, and any limitations before preparing questions
- Checklist – before the presentation:
	- Assemble and prepare your questions
	- Discuss the presentation with your manager, other analysts, or friendly contacts
	- Ask what questions this audience normally asked in the past
	- Seek comments, feedback, and questions on the deck or analysis document
	- At least 24 hours ahead, brainstorm tricky questions or unclear parts to avoid surprises
	- Practice the presentation to find missing information and calm nerves
- During the presentation:
	- Be prepared to explain your findings effectively and accurately
	- Address potential questions that may come up
	- Don't let a single question derail the presentation – propose following up offline
	- Put supplementary visualizations and content in the **appendix**
- Invest time in knowing your audience, crafting notes, research, and organizing data → engaged audience
- Prepare for the Q&A: https://www.coursera.org/learn/visualize-data/supplement/RI0Cu/prepare-for-the-q-a
#### Anticipate the question
- Understand stakeholder expectations (set early in the project) and the objective – otherwise you can't anticipate or answer questions correctly
	- Example objective: identify whether geographic, demographic, and/or economic factors contribute to a happier life
- **Colleague test**: show the presentation/data viz to a colleague with no prior knowledge and see what questions they ask; their questions may match the real audience's (e.g. "how were health and happiness measured?"); feedback can revise the deck or prepare you for Q&A detail
- Start with **zero assumptions**: don't assume the audience knows jargon, acronyms, past events, background; explain in the presentation and be ready to go further
	- E.g. define GDP in speaker notes: gross domestic product – total monetary or market value of all finished goods and services produced within a country's borders in a specific period of time
- Work with your team to anticipate questions and draft responses (they know how data was gathered or what it's missing)
- Be prepared to describe **limitations** in your data: check patterns for integrity (could correlations be coincidence?); know the strengths and weaknesses of your tools
- Recap: focus on stakeholder expectations and goals; identify questions with your team; review with zero assumptions; consider data limitations
#### Handle objections
- Objections may come during or after the presentation, usually about the data, the analysis, or the findings
- Objections about the **data**: where it came from and what systems; what transformations happened before you worked with it; how fresh and accurate it is
	- Set up data context at the beginning; detailed breakdown in the appendix; keep a detailed **log of data transformations** (cleaning) in the appendix
- Objections about the **analysis**: is it reproducible? keep a **change log** of steps so others can reproduce; add an appendix slide explaining steps; keep a clean version of scripts (SQL, R); "Who did you get feedback from?" – especially when insights contradict the audience's gut feelings; include many perspectives
- Objections about the **findings**: "Do these findings exist in previous time periods?", "Did you control for differences in your data?" – audience wants results that account for inconsistencies
- How to respond:
	1. Communicate any **assumptions** about the data, analysis, or findings (e.g. the team cleaned and formatted the data first)
	2. Explain why the analysis might be different than expected – walk through the variables that change the outcomes
	3. Acknowledge valid objections and take steps to investigate further; follow up with more details afterwards
#### Self-Reflection: Practice handling objections
- A **business task** is a question or problem you use data to solve; a presentation demonstrates how to solve it; respond to objections clearly, concisely, and politely
- Example objections:
	- Sales revenue of an autonomous vacuum robot: analyst explained each step, but a stakeholder is confused and worries the analysis is incomplete
	- Effectiveness of a new heartburn drug using data from an external private company: stakeholder doubts the source's reputability and credentials
	- Highway traffic patterns: analyst concludes Friday is busiest; a stakeholder who commutes believes Monday is
- Reflection question (chưa nộp): how you'd respond to one objection; impact of not addressing objections
- Self-Reflection: Practice handling objections: https://www.coursera.org/learn/visualize-data/assignment-submission/zbo1D/self-reflection-practice-handling-objections
#### Test your knowledge on caveats and limitations to data
- Practice quiz (8 min) – chưa làm: https://www.coursera.org/learn/visualize-data/assignment-submission/QNVZa/test-your-knowledge-on-caveats-and-limitations-to-data
### Listen, respond, and include
#### Q&A best practices
- **Listen to the whole question** – don't start composing your answer before they finish
- **Repeat the question**: confirms understanding, lets the asker correct you, lets everyone hear it, and gives you a moment to gather thoughts
	- Example: "How was happiness measured?" → participants in different countries rated their happiness in a survey
- Keep an **appendix** slide with extra information (e.g. survey details) for answering questions
- **Understand the context**: who the audience is, their concerns and backgrounds, project goals; tailor answers (e.g. healthcare stakeholders care more about medical data and health–happiness relationship)
- **Involve the whole audience**: it's not a one-on-one conversation; others may have the same question; include other voices (ask a team member for insight)
- **Keep responses short**: start with a headline answer, then add detail if they want more; answer directly with the fewest words, then expand with color and context as needed
- You don't have to answer everything on the spot: for tough questions needing more analysis, say you'll get back to them and follow up in a timely manner
- Recap: listen to the whole question, repeat it, understand the context, involve the whole audience, keep responses short
#### Connor: Becoming an expert data translator
- It's not the data itself that matters to the company – it's the understanding of the data and its impact; business leaders often lack technical expertise, so the analyst is the **translator**
- Presenting data is the most important aspect of being a data analyst: if people don't understand the analysis, it offers no value
- Elements of a good presentation:
	- **Define your purpose**: what you'll talk about, why it's important, what the audience will take away
	- **Keep it concise**: not too wordy, not too much on-screen text, not too long
	- **Logical flow**: audience knows what's coming next and what you're on now
	- **Visually compelling**: appealing visuals and theme that draw people in
	- All roll up to one concept: **how easy is it to understand?** – simplify technical analysis so anyone, regardless of technical or business background, understands
#### Test your knowledge on listening, responding, and including
- Practice quiz (8 min) – chưa làm: https://www.coursera.org/learn/visualize-data/assignment-submission/ep87O/test-your-knowledge-on-listening-responding-and-including
### Module 4 challenge
#### Glossary terms from module 4
- [Dashboard filter]: A tool for showing only the data that meets a specific criteria while hiding the rest
- [Data blending]: A Tableau method that combines data from multiple data sources
- [Framework]: The context a presentation needs to create logical connections that tie back to the business task and metrics
- [Professional relationship building]: Building relationships by meeting people both in person and online (Refer to Networking)
- [Static data]: Data that doesn't change once it has been recorded
- [Statistics]: The study of how to collect, analyze, summarize, and present data
- [WITH]: A SQL clause that creates a temporary table that can be queried multiple times (→ [SQL and temporary tables](/blog/analyze-data-to-answer-questions/))
- Glossary terms from module 4: https://www.coursera.org/learn/visualize-data/supplement/Adbqw/glossary-terms-from-module-4
#### Module 4 challenge
- [ ] Module 4 challenge (graded, 40 min): https://www.coursera.org/learn/visualize-data/assignment-submission/T1Uta/module-4-challenge 📅 2026-10-20
