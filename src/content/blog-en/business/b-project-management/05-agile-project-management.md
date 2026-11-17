---
title: >-
  Is Agile Better Than Waterfall? Evidence on Scrum, Planning Poker and
  Large-Scale Agile
type: article
tags:
  - article
  - business
  - agile
  - scrum
  - evidence-based-management
section: Business
folder: Business / B - Project Management
vaultPath: >-
  Projects/Portfolio Website/Bài viết/Kinh doanh/BV - 05 - Agile Project
  Management (EN).md
url: /en/blog/agile-project-management/
topic: business
updated: '2026-11-17'
date: '2026-11-17'
status: draft
order: 5
lang: en
translationUrl: /blog/agile-project-management/
translationTitle: >-
  Agile có hiệu quả hơn Waterfall? Tổng quan bằng chứng về Scrum, ước lượng
  tương đối và Agile quy mô lớn
description: >-
  Does Agile beat Waterfall? An evidence review of Scrum, Planning Poker,
  velocity, SAFe, LeSS and Spotify, rating the evidence behind each claim.
isIndex: false
---
Agile is often presented as the sensible choice for a volatile world: less waste, faster feedback, and Planning Poker estimates that avoid bias. This article checks each of those claims against the empirical research, from the first systematic review of Agile to surveys of hundreds of projects and experiments on Planning Poker. The short answer: Agile has a real but modest advantage, clearest in stakeholder satisfaction; story points, velocity and Planning Poker are companion practices that do not appear in the Scrum Guide; and the survey figures most often quoted about Agile need a careful look at their units and samples.

## Summary

This is the fifth article in the *Evidence-based Project Management* series. It is written as an evidence review, not a full systematic review: there is no protocol, and sources were selected purposively. The article gives priority to published systematic reviews, quantitative studies with large samples and experiments on Planning Poker, and then compares them with the 2017 and 2020 editions of the Scrum Guide. Five main conclusions:

1. The evidence in favor of Agile is real but weak; the first systematic review rated it *very low* on the GRADE scale.
2. The clearest advantage is stakeholder satisfaction; advantages in time and budget are small, or absent in the most recent study.
3. Hybrid approaches are very common and produce results similar to pure Agile.
4. Planning Poker beats a mechanical combination of individual estimates, but is no more accurate than a single expert estimating alone.
5. Large-scale Agile (SAFe, LeSS, the Spotify model) rests mostly on experience reports.

## 1. Why "Agile is better" needs to be tested

Agile is usually introduced with a coherent story: the world is increasingly volatile, uncertain, complex and ambiguous (VUCA), plans made in advance go stale, and Agile, with its short iterations and continuous feedback, helps teams value responding to change over following a plan (Beck et al., 2001) and thereby cuts waste. The story is persuasive, but it is often told without any comparative research or effect sizes. Project practitioners can therefore end up with strong beliefs and little data, both for defending that choice in front of a skeptical manager and for recognizing when a sequential approach is actually the sensible one.

The question "Is Agile better than Waterfall?" is also badly framed. Project success has many dimensions: on time, on budget, full scope, adequate quality, satisfied customers and sponsors. The thesis of this article is that the right question is **in which dimension Agile is better, in which context, and on what level of evidence**.

To gauge the "level of evidence," the article borrows the GRADE scale used by Dybå and Dingsøyr (2008): high, moderate, low and very low. Randomized trials start at high and observational studies at low, and either is downgraded if the design has limitations or the results are inconsistent. From Section 3 on, each section ends with an estimated level in that spirit, not a formal GRADE assessment. Two limitations should be stated up front: almost all of the evidence comes from software development, and the large quantitative studies are all retrospective surveys in which respondents report on themselves.

## 2. Waterfall and Agile: definitions and origins

### 2.1. Working definitions

**Waterfall** is a sequential approach: each phase finishes before the next begins, requirements are locked early, changes go through a change control process, and the product is delivered once at the end. **Agile** is an iterative and incremental approach: requirements are allowed to change, and the product is delivered in many small, frequent increments. Agile's intellectual foundation is the Agile Manifesto, with its 4 values and 12 principles (Beck et al., 2001). Table 1 compares the two approaches along seven familiar project management dimensions and adds a column for the evidence (details in Section 3).

**Table 1.** Waterfall and Agile across seven dimensions

| Dimension     | Waterfall                         | Agile                                    | Comparative evidence                                      |
| ------------- | --------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| PM role       | Commands, assigns work            | Scrum Master supports, team self-manages | Not covered by this article's sources                     |
| Scope         | Locked early, via change requests | Adjusted each iteration                  | Equivalent                                                |
| Schedule      | Sequential by phase               | Fixed-length Sprints                     | Inconsistent                                              |
| Cost          | Estimated in detail up front      | Can change after each iteration          | Inconsistent                                              |
| Quality       | Criteria set at the start         | Continuous user feedback                 | Equivalent                                                |
| Communication | PM reports at milestones          | Continuous contact with the customer     | Descriptive studies only (Section 7)                      |
| Stakeholders  | PM manages their involvement      | Progress driven by feedback              | Higher satisfaction with Agile and hybrid (correlational) |

The studies do not all use the same pair of concepts: **flexible** versus **sequential** models (Moløkken-Østvold & Jørgensen, 2005), a self-rated **degree of Agile use** (Serrador & Pinto, 2015), or traditional, agile and hybrid (Gemino et al., 2021). This article pools these labels for the synthesis, so "Agile" in Section 3 means a family of approaches, not Scrum alone.

### 2.2. Origins: a longer history than the word Agile

The idea of iterating predates the word Agile by decades. Larman and Basili (2003) show that iterative and incremental development (IID) was in use from the **mid-1950s**, as a way to avoid a single-pass, document-heavy sequential process. The 1990s were when **named** agile methods appeared; Dybå and Dingsøyr (2008) list DSDM as the first agile method, followed by XP.

The paper usually associated with Waterfall is Royce (1970), and it holds a surprise. Royce does draw the chain of phases from system requirements to operations, but he writes immediately afterward that the single-pass implementation "is risky and invites failure," because testing at the end is the first time real problems surface. He proposes five corrective steps, including building a preliminary version first ("do it twice") and involving the customer formally. The word "waterfall" does not appear in the paper. In other words, the sequential model was described, and criticized, by Royce in 1970; the name came later.

The word "scrum" comes from Takeuchi and Nonaka's (1986) article in the *Harvard Business Review*. The two authors contrasted a sequential, relay-race style of working with a rugby-style approach in which the whole team moves forward together, and in the section "Moving the Scrum Downfield" they listed six characteristics: built-in instability, self-organizing project teams, overlapping development phases, multilearning, subtle control and organizational transfer of learning. A rarely mentioned detail: the article studied six hardware products (copiers, cameras, a car, a computer) at Fuji-Xerox, Canon, Honda and NEC, chosen partly because they had succeeded in the market. That makes it a case study of winners with no comparison group, so it shows that this way of working **can** succeed, not that it succeeds **more often** than the sequential approach.

Scrum was developed from the early 1990s (Schwaber & Sutherland, 2020), so it predates the Agile Manifesto. The Manifesto was written on February 11–13, 2001, in Snowbird, Utah, by 17 people who called themselves "organizational anarchists" (Highsmith, 2001). According to Hoda et al. (2018), Agile has since dominated the second half of software engineering's fifty years; that is evidence of **popularity**, not yet of **effectiveness**.

**Table 2.** Verified timeline

| Date          | Milestone                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Mid-1950s     | IID used in large projects (Larman & Basili, 2003)                                             |
| 1970          | Royce describes the sequential chain of phases and warns of the single-pass risk (Royce, 1970) |
| January 1986  | The rugby and scrum metaphor in HBR (Takeuchi & Nonaka, 1986)                                  |
| 1990s         | Named methods: DSDM, XP, Scrum (Dybå & Dingsøyr, 2008)                                         |
| February 2001 | Agile Manifesto, 17 people (Beck et al., 2001)                                                 |
| 2017, 2020    | Two Scrum Guide editions that differ on team size (Section 7)                                  |

## 3. Is Agile more effective than Waterfall? Three layers of evidence

### 3.1. Layer 1: the first systematic review

Dybå and Dingsøyr (2008) searched for empirical studies of Agile published through 2005. Out of **1,996** studies, they kept **36** that met their standards for rigor, credibility and relevance, grouped into four themes: introduction and adoption, human and social factors, perceptions of Agile, and comparative studies. Three details are more memorable than the overall conclusion:

- **Skewed toward XP.** 25 studies (76%) concerned XP; management-oriented methods such as Scrum were the least studied relative to how widely they are used.
- **Teams new to Agile.** 24 studies (73%) observed teams with less than one year of Agile experience.
- **Productivity.** Four comparative studies: three reported gains (337%, 42%, 46%) and one a 44% drop. The 337% figure came from an experiment in which the XP team wrote **3.5 times as many lines of code** but delivered no additional functionality; the 46% gain came from a case study in which the Agile team had far more domain and language experience, that is, a confounding factor.

The lesson for data analysts: a productivity metric based on lines of code can rise by several hundred percent while the value delivered to the customer stays the same. The two authors concluded that the strength of evidence on the benefits and limitations of Agile is **very low**, and every estimate of effect is very uncertain.

### 3.2. Layer 2: effort overruns

Moløkken-Østvold and Jørgensen (2005) surveyed software projects in depth and found that projects using a flexible model had **smaller effort overruns** than sequential projects. The authors were careful with the explanation: they wrote that the reason was "not obvious," because the two groups did not differ in size, estimation process or share of functionality delivered. The biggest difference lay in what managers said: on flexible projects, they more often cited **good requirements specification** and **good collaboration with the customer** as reasons for accurate estimates. The abstract does not report the sample size or the size of the difference, so it is not yet possible to say how large this advantage is.

### 3.3. Layer 3: quantitative studies across industries

**Serrador and Pinto (2015)** analyzed more than 1,000 projects across industries and countries, through an online questionnaire sent to members of PMI (the Project Management Institute) and several LinkedIn groups. Each respondent described **one more successful and one less successful project**. Success was measured on two dimensions: efficiency (cost, time, goals) and the satisfaction of customers and sponsors. The degree of Agile use was positively associated with both dimensions, most strongly with satisfaction; the quality of the vision and goals moderated the relationship at a level close to statistical significance, while team experience and complexity did not (Serrador & Pinto, 2015; Association for Project Management, n.d.). One useful finding: the amount of up-front planning **did not differ** between projects with more and less Agile use, so the myth that "Agile needs no plan" does not hold.

**Gemino, Horner Reich and Serrador (2021)** analyzed 477 multi-industry, international projects, of which **52%** were hybrid. Their regression models had R² values from 0.21 to 0.41. Agile and hybrid approaches increased success with stakeholders compared with traditional approaches, while **budget, time, scope and quality were similar**; hybrid was about as effective as pure Agile.

Three methodological caveats:

- **Cross-sectional and self-reported.** Respondents chose their own projects and rated both their degree of Agile use and their level of success. The "one success, one less successful" design can inflate the correlation: once you know which project succeeded, it is easy to remember it as more "flexible." Self-reported data from the PMI community on project failure rates have exactly the same problem (see article 01).
- **Most of the variation is unexplained.** A maximum R² of 0.41 means more than half of the differences in success lie outside the model.
- **No randomized trials.** The APM (Association for Project Management, the UK professional body) summary quotes one author as saying that Agile "leads to" more successful projects; that causal wording is stronger than a cross-sectional survey allows.

### 3.4. Synthesis

Table 3 places the four sources side by side in the manner of a qualitative forest plot. This is **not a meta-analysis**: the studies use different measures, so their numbers cannot be pooled.

**Table 3.** Direction of Agile's effect compared with sequential approaches (+ favors Agile; 0 no difference; ± inconsistent; – not measured or no comparative conclusion)

| Study                               | Design, sample                        | Time, cost       | Scope, quality        | Stakeholder satisfaction |
| ----------------------------------- | ------------------------------------- | ---------------- | --------------------- | ------------------------ |
| Dybå & Dingsøyr (2008)              | Systematic review, 36 studies         | ± (productivity) | –                     | –                        |
| Moløkken-Østvold & Jørgensen (2005) | In-depth survey of software projects  | +                | 0                     | –                        |
| Serrador & Pinto (2015)             | Retrospective survey, 1,000+ projects | +                | + (within efficiency) | + (strongest)            |
| Gemino et al. (2021)                | International survey, 477 projects    | 0                | 0                     | +                        |

Agile and hybrid approaches are **associated** with higher stakeholder satisfaction, consistently across the two large quantitative studies. The advantage in time and cost is inconsistent: present in the two older studies, absent in the most recent one. All of it is correlation, not causation.

> **Estimated level of evidence:** low for stakeholder satisfaction; very low for time, cost and productivity.

## 4. "Reduces waste" and "fits VUCA": empirical claims or conceptual frameworks?

The most thorough empirical study of waste in software is by Sedano, Ralph and Péraire (2017). They did two years and five months of participant observation on eight projects at Pivotal, a software development consultancy, interviewed 33 people and analyzed one year of retrospective topics. The result is **the first empirical taxonomy of waste**, with nine types: building the wrong feature or product, mismanaging the backlog, rework, unnecessarily complex solutions, extraneous cognitive load, psychological distress, waiting and multitasking, knowledge loss, and ineffective communication.

This study does not prove that Agile reduces waste. The environment observed had backlogs and retrospectives, yet the list still includes "building the wrong feature," exactly the thing Agile is supposed to prevent. There was no comparison group using Waterfall, and the authors themselves note that grounded theory does not allow statistical generalization. "Agile reduces waste" is therefore a **design goal**, not yet a measured outcome.

The second argument uses **VUCA** as a diagnosis: the more VUCA the environment, the more you should choose Agile. Bennett and Lemoine (2014) object to precisely this lumping together. In their view, VUCA is often used as a catch-all label for any unpredictable situation, which leads leaders to believe that planning is pointless; yet volatility, uncertainty, complexity and ambiguity are four different conditions that call for different allocations of resources. "High VUCA, so choose Agile" is therefore too crude a rule. The only quantitative evidence that can be tied to a specific component is the finding of Moløkken-Østvold and Jørgensen (2005): the advantage of flexible models went together with requirements specification and customer collaboration, that is, with **uncertainty about requirements**. The term VUCA is often attributed to the US Army War College, but this origin is not confirmed by a primary document in this article's sources.

> **Estimated level of evidence:** both are reasonable conceptual frameworks; direct comparative evidence is very low.

## 5. How widespread is Agile? Rereading the survey figures

This section applies the "one number, three questions" approach from article 01: what is the source, who was measured, and how were the data collected.

**72%.** The most often quoted figure on Scrum's popularity comes from the *13th Annual State of Agile Report* (CollabNet VersionOne, 2019): a survey run from August to December 2018, sponsored by a software tool vendor, with **1,319** complete responses, 17% of them from the sponsor's customers. The original sentence says "at least 72% of respondents" use Scrum or a Scrum hybrid. The unit is **respondents**, not teams or projects. The chart in the report shows that 72% matches the sum of Scrum (54%), Scrum/XP hybrid (10%) and Scrumban (8%); the "Other/Hybrid/Multiple" category accounts for another 14%. In the same report, 95% of respondents say their organization has had at least some successful Agile projects and 48% say most or all; these figures carry almost no information, because "success" is not defined.

**85%.** This figure comes from a Gartner (2019) press release: 85% of organizations have "adopted, or plan to adopt" a product-centric application delivery model; respondents used this model for about 40% of their work in 2018. The methodology note in the release says this was an online survey in Q2 2018 of **129** IT professionals in the Gartner Research Circle, a panel of Gartner clients. The figure includes intentions, concerns an application delivery model rather than Agile directly, and comes from a small, unrepresentative sample.

**Hybrid.** The 13th State of Agile report does not give a separate hybrid rate: the word "hybrid" appears only in the 72% sentence, in the Scrum/XP hybrid category and in the Other/Hybrid/Multiple category. Academic research gives a clearer picture. Kuhrmann et al. (2019) found that the companies surveyed use hybrid approaches project by project **even when they have a company-wide process policy**, and **regardless of size or industry**. Gemino et al. (2021) classified 52% of projects as hybrid. Hybrid is the norm, not the exception.

**Table 4.** One number, three questions

| Frequently quoted figure | Source, sample                                           | How to state it                                                                      |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 72% use Scrum            | State of Agile 13th; 1,319 people, vendor-sponsored      | "At least 72% of respondents to a vendor survey"                                     |
| 85% product-centric      | Gartner; 129 IT professionals, Q2 2018                   | "85% have adopted **or plan to adopt** a product-centric application delivery model" |
| Share of hybrid          | Gemino et al. (2021); 477 projects, international survey | "52% of projects in an international sample were hybrid"                             |

The general lesson: vendor surveys tell you about self-reported trends, not about effectiveness.

## 6. Story points and Planning Poker: is relative estimation better?

### 6.1. The case for relative estimation

The familiar argument in the Scrum community goes like this: people tend to underestimate how long things take, so instead of **absolute estimation** (in hours or days), teams use **relative estimation** (comparing the size of one piece of work with another), via T-shirt sizes or **story points** on a Fibonacci sequence. In **Planning Poker**, each person places an estimate card face down, the group reveals all cards at once and then discusses estimates that are far apart, thereby avoiding **anchoring bias**.

The "people tend to underestimate" part belongs to the topic of the planning fallacy (see article 03 on the planning fallacy). Here it is enough to know that expert estimation is the most common strategy in software projects, and that there is no substantial evidence that formal estimation models do better (Jørgensen, 2004). Planning Poker is **a structured way of combining the estimates of several experts**; the right question is whether it beats other ways of combining them, or beats a single expert.

### 6.2. The evidence

Usman et al. (2014) reviewed 25 primary studies on estimation in Agile: **subjective** techniques (expert judgment, Planning Poker, use case points) were used most, story points were the most common size measure, and accuracy was usually measured with MMRE and MRE. The review tells us what people **use**, not which method is **more accurate**.

The most direct experiment is by Moløkken-Østvold and Haugen (2007). In a real software project, the team used Planning Poker for half of the tasks. For those tasks, the consensus estimates were **less optimistic** and **more accurate** than a mechanical combination of the individual estimates for the same tasks. But the control tasks, estimated by individual experts working alone, reached **similar accuracy**; judged by the median, neither group was biased.

Two other studies add nuance; for these two, the article relies on the abstracts only. A 2008 paper by the same group suggests that tasks estimated with Planning Poker required additional effort linked to the complexity of the change, possibly because the discussion surfaced information (Moløkken-Østvold et al., 2008). Mahnič and Hovelja (2012) had 13 student teams estimate user stories and compared them with a group of experts: the students' estimates were overly optimistic, and Planning Poker made that optimism worse; for the experts, Planning Poker produced results closer to actual effort than the average of individual estimates. The optimism bias from group discussion fades as expertise grows.

**Table 5.** Studies on Planning Poker

| Study                            | Setting                             | Compared with                           | Main finding                                                   |
| -------------------------------- | ----------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Moløkken-Østvold & Haugen (2007) | One real project, half of the tasks | Mechanical combination; one expert      | Better than mechanical combination; on par with one expert     |
| Moløkken-Østvold et al. (2008)   | Same group, with code analysis      | Tasks not estimated with Planning Poker | Extra effort linked to complexity (per abstract)               |
| Mahnič & Hovelja (2012)          | 13 student teams, an expert group   | Average of individual estimates         | Students more optimistic; experts more accurate (per abstract) |
| Usman et al. (2014)              | Systematic review, 25 studies       | –                                       | Planning Poker and story points common; accuracy not compared  |

### 6.3. A critical reading

**"Planning Poker avoids anchoring."** Placing cards face down and revealing them at once is a sensible mechanism, but none of the studies above measured anchoring directly. What has been shown is narrower: group consensus beats mechanical combination, does not beat a single expert, and for less experienced people, discussion can make estimates more optimistic.

**"Story points are more accurate than hours."** This article's sources include no study that compares the two directly. Story points mainly **change the unit**; to compute an error you still have to convert back to actual effort. The counterweight is three-point estimating and PERT (see article 06 on three-point estimating). The more reliable value of Planning Poker probably lies in the **discussion**: estimates that diverge force people to say what they know about the complexity.

<div class="callout callout-note">
<p class="callout-title">Statistics box: why estimation research often uses the median</p>

The relative error of a task is $\text{MRE} = \lvert \text{actual} - \text{estimate} \rvert / \text{actual}$; MMRE is the mean of the MREs. Because it is a mean, MMRE is very sensitive to a few tasks that are far off. A hypothetical example: five tasks with MREs of 0.1, 0.1, 0.2, 0.2 and 3.0 give an MMRE of 0.72, which sounds like an average error of 72%, but the median is only 0.2. The median is a robust estimate of location that is not pulled by extreme values (Bruce & Bruce, 2017), which is why Moløkken-Østvold and Haugen (2007) assessed bias by the median. The same idea in descriptive statistics: [the mean is sensitive to outliers, the median is more robust](/en/blog/data-exploration-using-descriptive-statistics/).

</div>

> **Estimated level of evidence:** low. Few studies, small samples, some of them students, mostly within one or a few organizations.

## 7. Velocity, burndown, WIP and the Daily Scrum: what the Scrum Guide says and what research says

### 7.1. Official Scrum and companion practices

The 2020 Scrum Guide **does not mention** story points, velocity or Planning Poker. Burn-down appears only as one example of a forecasting practice, alongside burn-up and cumulative flow, and does not replace empiricism (Schwaber & Sutherland, 2020). Story points, velocity and Planning Poker are therefore community practices often used with Scrum, not rules of Scrum.

Team size and timeboxes also differ between editions. The 2017 edition sets the **Development Team** at 3 to 9 people: fewer than 3 reduces interaction, more than 9 requires too much coordination; this count excludes the Product Owner and Scrum Master unless they also work on the Sprint Backlog (Schwaber & Sutherland, 2017). The 2020 edition replaces Development Team with the term **Developers** and says the Scrum Team is "typically 10 or fewer people," counting the Product Owner and Scrum Master. A maximum of 4 hours for the Sprint Review and 3 hours for the Retrospective applies **to a one-month Sprint**; for shorter Sprints, these events are usually shorter (Schwaber & Sutherland, 2020).

### 7.2. Velocity

The advice not to use velocity to compare teams is correct on grounds of **measurement logic**, with no experiment needed. Each team calibrates its story points against its own reference tasks, so "5 points" for two teams are not on the same scale; comparing velocity across two teams is like comparing two thermometers with no units marked. The risk is real: in the 2019 State of Agile report, velocity was the third most cited measure of project success (38% of respondents), after customer satisfaction (46%) and business value (42%) (CollabNet VersionOne, 2019). When an internal metric becomes a KPI, it is easily inflated.

### 7.3. Work-in-progress limits and Little's law

The claim that "doing fewer things at once gets things done faster" has a mathematical basis in Little's law, $L = \lambda W$: the average number of items in the system ($L$) equals the rate at which items pass through ($\lambda$) times the average time each item spends in the system ($W$), provided the averages are finite and the process is stable (Little, 1961). If the completion rate stays the same, reducing work in progress (WIP) means each item finishes sooner. But the law is about long-run averages, and it does not by itself raise total output; output rises only if less multitasking cuts switching time, exactly the "waiting and multitasking" waste of Sedano et al. (2017). LeSS also builds queueing theory into the framework's principles (LeSS Company, n.d.).

### 7.4. The Daily Scrum

The 2020 Scrum Guide describes the Daily Scrum as a 15-minute event for the Developers, held at the same time and place every working day of the Sprint, to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as needed (Schwaber & Sutherland, 2020). Stray, Sjøberg and Dybå (2016) studied daily stand-up meetings in practice with a grounded theory study of 12 software teams at three companies in Malaysia, Norway, Poland and the UK: they interviewed 60 people and observed 79 meetings. Positive attitudes came from sharing information and solving problems together; negative attitudes came from the meeting turning into **status reporting to a manager**, held too often and running too long. In other words, the meeting loses its value when it drifts away from the purpose the Scrum Guide sets for it, coordination within the team. Retrospectives and psychological safety are covered in article 04 on retrospectives.

> **Estimated level of evidence:** velocity and WIP rest on measurement logic and mathematics; the Daily Scrum is at a low level, based on one thorough qualitative study.

### 7.5. Worked example: a hybrid project with high WIP

<div class="callout callout-example">
<p class="callout-title">A small project read as hybrid and through Little's law</p>

Suppose one person is building a small mobile app and tracking the work in a spreadsheet. The project is divided into seven consecutive phases, from market research, design and development to testing, release and maintenance. Within each phase, large work items are broken into subtasks, and the development phase aims at an MVP.

**Read as hybrid.** Seven consecutive phases form a Waterfall-style frame; inside it, the list of large items broken into subtasks resembles a backlog with epics. This is the very common kind of combination discussed in Section 5.

**Read through WIP.** Suppose 6 subtasks are open at the same time, for example all 6 screens of the app are half-built, and the person completes 2 subtasks a week on average. By Little's law, each item spends on average $W = L/\lambda = 6/2 = 3$ weeks in the system. With a WIP limit of 2, $W = 2/2 = 1$ week.

**What changes and what does not.** The total time to finish all 6 items does not change, because the completion rate is still 2 items a week. What changes is that each screen is finished and usable sooner, feedback arrives sooner, and the person switches less between many half-done items. The numbers here are assumptions to illustrate the concept, not measured data.

</div>

## 8. Large-scale Agile: SAFe, LeSS and the Spotify model

When several teams work on one product, five ways of scaling Agile are commonly mentioned: SAFe, Scrum of Scrums, LeSS, Disciplined Agile Delivery (DAD) and the Spotify model. Is there evidence that they work? The systematic review by Dikert, Paasivaara and Lassenius (2016) answers fairly clearly. From 1,875 papers, they kept **52 papers on 42 cases** of industrial transformations; **nearly 90%** were experience reports, which the authors themselves see as a sign of a lack of solid academic research. They compiled 35 challenges and 29 success factors; the most prominent were management support, choosing and **customizing** the Agile model, training and coaching, and mindset and alignment.

Edison, Wang and Conboy (2022) compared SAFe, LeSS, Scrum-at-Scale, DAD and the Spotify model, and noted that no cross-method comparison based on empirical evidence existed before theirs; the literature focuses on **the practices of commercial frameworks** more than on underlying principles, while companies such as Nokia and Ericsson built their own methods. The map of 136 studies by Uludağ et al. (2022) also ends with an open research agenda. For SAFe, Putta, Paasivaara and Lassenius (2018) carried out a multivocal review, combining case studies with non-peer-reviewed experience reports, and identified 52 adopting organizations. Because the sources include gray literature, many of the reported benefits are adopters' accounts, not independently measured outcomes.

The **Spotify model** is perhaps the most misunderstood. The original white paper describes itself as only a "snapshot," "a journey in progress, not a journey completed" (Kniberg & Ivarsson, 2012). A Squad has no formal team lead but does have a Product Owner and an agile coach; a Tribe is designed to stay **under about 100 people**, based on Dunbar's number, at a time when the engineering organization grew from 30 to 250 people in three years. Academic research has mostly looked at individual mechanisms, such as guilds supporting knowledge sharing and collective decision-making (Šmite et al., 2019). The sensible reading, then, is to take inspiration from the model rather than copy it, which is exactly how the white paper describes itself. **LeSS** comes in LeSS for 2–8 teams and LeSS Huge for 8 teams and up, and is described as the result of "hundreds of concrete experiments" (LeSS Company, n.d.).

On popularity, the 2019 State of Agile report asked which scaling approach organizations follow most closely: SAFe 30%, Scrum of Scrums 16%, internally created methods 8%, DAD 7%, the Spotify model 5%, LeSS 3%, and 19% did not know (CollabNet VersionOne, 2019). SAFe's popularity is **not** evidence of its effectiveness.

**Table 6.** Ways of scaling Agile and the type of evidence

| Scaling approach   | Followed most closely (2019) | Type of evidence available                                                |
| ------------------ | ---------------------------- | ------------------------------------------------------------------------- |
| SAFe               | 30%                          | Multivocal review, including gray literature                              |
| Scrum of Scrums    | 16%                          | Mostly experience reports                                                 |
| Internally created | 8%                           | Case studies within the reviews                                           |
| DAD                | 7%                           | Descriptive comparisons                                                   |
| Spotify model      | 5%                           | Self-descriptive white paper; studies of single mechanisms such as guilds |
| LeSS               | 3%                           | Descriptive comparisons                                                   |

> **Estimated level of evidence:** very low to low. With such a thin evidence base, the most cautious advice is not to scale unless you really need to.

## 9. Discussion and conclusion

**Table 7.** Common claims about Agile and the level of evidence

| Common claim                           | Best evidence                                | Estimated level      | How to state it                                                          |
| -------------------------------------- | -------------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Agile is more effective than Waterfall | 1 systematic review, 3 observational studies | Low to very low      | Associated with stakeholder satisfaction; time and cost uncertain        |
| Agile reduces waste                    | A taxonomy from one company                  | Very low             | It is a design goal                                                      |
| Agile fits VUCA                        | Conceptual framework                         | Very low             | Fits best when requirements are uncertain and the customer can take part |
| Most organizations already use Agile   | Vendor survey; Gartner press release         | Descriptive          | State the unit, the sample and whether it counts intentions              |
| Planning Poker is more accurate        | 1 experiment, a few small studies            | Low                  | Better than mechanical combination, on par with one expert               |
| Do not compare velocity across teams   | Measurement logic                            | No experiment needed | Correct: each team has its own scale                                     |
| The Daily Scrum keeps the team in sync | 1 study, 12 teams                            | Low                  | Useful for sharing information, counterproductive as a status report     |
| SAFe, LeSS and Spotify help you scale  | Nearly 90% experience reports                | Very low to low      | Practices are described; effectiveness has not been compared             |

This table yields five practical guidelines:

1. **Choose Agile or hybrid when requirements are still uncertain and the customer can take part.** The advantage of flexible models is tied to customer collaboration (Moløkken-Østvold & Jørgensen, 2005) and is clearest in stakeholder satisfaction (Gemino et al., 2021; Serrador & Pinto, 2015).
2. **Do not promise that Agile is faster or cheaper.** The more reliable benefit is stakeholder satisfaction.
3. **Use Planning Poker for the discussion**, and do not expect it to make estimates more accurate on its own.
4. **Do not use velocity as a KPI or to compare teams.**
5. **Before scaling, ask whether you really need to.** Besides choosing and customizing the model, the most prominent success factors are management support, training and mindset (Dikert et al., 2016).

The research gaps are still large: few studies of Scrum in mature teams (Dybå & Dingsøyr, 2008), almost no comparisons of Agile outside software, and a lack of longitudinal designs before and after a transformation.

So is Agile more effective than Waterfall? The honest answer is **yes, in some dimensions, in some contexts, on evidence that is not yet strong**. That is not a reason to abandon Agile, but a reason to treat Agile as a hypothesis to be tested in your own project, in the empirical spirit of Scrum itself.

## References

Association for Project Management. (n.d.). *Does Agile work? A quantitative analysis of agile project success* [Research summary]. https://apm.org.uk/media/r01fph3t/does-agile-work-a-quantitative-analysis-of-agile-project-success.pdf

Beck, K., Beedle, M., van Bennekum, A., Cockburn, A., Cunningham, W., Fowler, M., Grenning, J., Highsmith, J., Hunt, A., Jeffries, R., Kern, J., Marick, B., Martin, R. C., Mellor, S., Schwaber, K., Sutherland, J., & Thomas, D. (2001). *Manifesto for agile software development*. https://agilemanifesto.org/

Bennett, N., & Lemoine, G. J. (2014). What a difference a word makes: Understanding threats to performance in a VUCA world. *Business Horizons, 57*(3), 311–317. https://doi.org/10.1016/j.bushor.2014.01.001

Bruce, P., & Bruce, A. (2017). *Practical statistics for data scientists: 50 essential concepts*. O'Reilly Media.

CollabNet VersionOne. (2019). *13th annual State of Agile report*. https://eg.bucknell.edu/~cs479/common-files/resources/versionone-state-of-agile/13th-annual-state-of-agile-report.pdf

Dikert, K., Paasivaara, M., & Lassenius, C. (2016). Challenges and success factors for large-scale agile transformations: A systematic literature review. *Journal of Systems and Software, 119*, 87–108. https://doi.org/10.1016/j.jss.2016.06.013

Dybå, T., & Dingsøyr, T. (2008). Empirical studies of agile software development: A systematic review. *Information and Software Technology, 50*(9–10), 833–859. https://doi.org/10.1016/j.infsof.2008.01.006

Edison, H., Wang, X., & Conboy, K. (2022). Comparing methods for large-scale agile software development: A systematic literature review. *IEEE Transactions on Software Engineering, 48*(8), 2709–2731. https://doi.org/10.1109/TSE.2021.3069039

Gartner. (2019, February 19). *Gartner survey finds 85 percent of organizations favor a product-centric application delivery model* [Press release]. https://www.gartner.com/en/newsroom/press-releases/2019-02-19-gartner-survey-finds-85-percent-of-organizations-favor-a-product

Gemino, A., Horner Reich, B., & Serrador, P. M. (2021). Agile, traditional, and hybrid approaches to project success: Is hybrid a poor second choice? *Project Management Journal, 52*(2), 161–175. https://doi.org/10.1177/8756972820973082

Highsmith, J. (2001). *History: The Agile Manifesto*. https://agilemanifesto.org/history.html

Hoda, R., Salleh, N., & Grundy, J. (2018). The rise and evolution of agile software development. *IEEE Software, 35*(5), 58–63. https://doi.org/10.1109/MS.2018.290111318

Jørgensen, M. (2004). A review of studies on expert estimation of software development effort. *Journal of Systems and Software, 70*(1–2), 37–60. https://doi.org/10.1016/S0164-1212(02)00156-5

Kniberg, H., & Ivarsson, A. (2012). *Scaling Agile @ Spotify with tribes, squads, chapters & guilds* [White paper]. https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf

Kuhrmann, M., Diebold, P., Münch, J., Tell, P., Trektere, K., McCaffery, F., Garousi, V., Felderer, M., Linssen, O., Hanser, E., & Prause, C. R. (2019). Hybrid software development approaches in practice: A European perspective. *IEEE Software, 36*(4), 20–31. https://doi.org/10.1109/MS.2018.110161245

Larman, C., & Basili, V. R. (2003). Iterative and incremental development: A brief history. *Computer, 36*(6), 47–56. https://doi.org/10.1109/MC.2003.1204375

LeSS Company. (n.d.). *Introduction to LeSS*. https://less.works/less/framework/introduction

Little, J. D. C. (1961). A proof for the queuing formula: L = λW. *Operations Research, 9*(3), 383–387. https://doi.org/10.1287/opre.9.3.383

Mahnič, V., & Hovelja, T. (2012). On using planning poker for estimating user stories. *Journal of Systems and Software, 85*(9), 2086–2095. https://doi.org/10.1016/j.jss.2012.04.005

Moløkken-Østvold, K., & Haugen, N. C. (2007). Combining estimates with planning poker: An empirical study. In *Proceedings of the 2007 Australian Software Engineering Conference (ASWEC'07)* (pp. 349–358). IEEE. https://doi.org/10.1109/ASWEC.2007.15

Moløkken-Østvold, K., Haugen, N. C., & Benestad, H. C. (2008). Using planning poker for combining expert estimates in software projects. *Journal of Systems and Software, 81*(12), 2106–2117. https://doi.org/10.1016/j.jss.2008.03.058

Moløkken-Østvold, K., & Jørgensen, M. (2005). A comparison of software project overruns: Flexible versus sequential development models. *IEEE Transactions on Software Engineering, 31*(9), 754–766. https://doi.org/10.1109/TSE.2005.96

Putta, A., Paasivaara, M., & Lassenius, C. (2018). Benefits and challenges of adopting the Scaled Agile Framework (SAFe): Preliminary results from a multivocal literature review. In *Product-Focused Software Process Improvement (PROFES 2018)* (pp. 334–351). Springer. https://doi.org/10.1007/978-3-030-03673-7_24

Royce, W. W. (1970). Managing the development of large software systems. In *Proceedings of IEEE WESCON* (pp. 1–9). IEEE.

Schwaber, K., & Sutherland, J. (2017). *The Scrum Guide: The definitive guide to Scrum: The rules of the game*. https://scrumguides.org/docs/scrumguide/v2017/2017-Scrum-Guide-US.pdf

Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide: The definitive guide to Scrum: The rules of the game*. https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf

Sedano, T., Ralph, P., & Péraire, C. (2017). Software development waste. In *2017 IEEE/ACM 39th International Conference on Software Engineering (ICSE)* (pp. 130–140). IEEE. https://doi.org/10.1109/ICSE.2017.20

Serrador, P., & Pinto, J. K. (2015). Does Agile work? A quantitative analysis of agile project success. *International Journal of Project Management, 33*(5), 1040–1051. https://doi.org/10.1016/j.ijproman.2015.01.006

Šmite, D., Moe, N. B., Levinta, G., & Floryan, M. (2019). Spotify guilds: How to succeed with knowledge sharing in large-scale agile organizations. *IEEE Software, 36*(2), 51–57. https://doi.org/10.1109/MS.2018.2886178

Stray, V., Sjøberg, D. I. K., & Dybå, T. (2016). The daily stand-up meeting: A grounded theory study. *Journal of Systems and Software, 114*, 101–124. https://doi.org/10.1016/j.jss.2016.01.004

Takeuchi, H., & Nonaka, I. (1986, January). The new new product development game. *Harvard Business Review*. https://hbr.org/1986/01/the-new-new-product-development-game

Uludağ, Ö., Philipp, P., Putta, A., Paasivaara, M., Lassenius, C., & Matthes, F. (2022). Revealing the state of the art of large-scale agile development research: A systematic mapping study. *Journal of Systems and Software, 194*, Article 111473. https://doi.org/10.1016/j.jss.2022.111473

Usman, M., Mendes, E., Weidt, F., & Britto, R. (2014). Effort estimation in agile software development: A systematic literature review. In *Proceedings of the 10th International Conference on Predictive Models in Software Engineering (PROMISE '14)* (pp. 82–91). ACM. https://doi.org/10.1145/2639490.2639503
