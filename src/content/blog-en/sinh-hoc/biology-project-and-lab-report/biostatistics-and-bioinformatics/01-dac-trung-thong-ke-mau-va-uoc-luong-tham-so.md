---
title: 'Confidence intervals in biology: n or n−1, z or t, and one 6.0 mg/L outlier'
type: article
tags:
  - article
  - biology
  - biostatistics
  - confidence-interval
  - excel
section: Sinh học
folder: Sinh học / Biology Project and Lab Report / Biostatistics and Bioinformatics
vaultPath: >-
  Projects/Portfolio Website/Bài viết/Sinh học/BV - 01 - Đặc trưng thống kê mẫu
  và ước lượng tham số (EN).md
url: /en/blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/
topic: biology
updated: '2026-11-17'
date: '2026-11-17'
status: draft
order: 1
lang: en
translationUrl: /blog/3-dac-trung-thong-ke-cua-mot-mau-va-uoc-luong-tham-so-cua-tong-the/
translationTitle: >-
  Khoảng tin cậy trong số liệu sinh học: n hay n−1, z hay t, và một giá trị 6,0
  mg/L làm lệch cả mẫu
description: >-
  Confidence intervals for a mean, variance, and proportion in Excel and Python:
  STDEV vs. STDEVP, CONFIDENCE vs. CONFIDENCE.T, Wilson, and outliers.
isIndex: false
---
Excel's `CONFIDENCE` function uses the normal distribution, not the t distribution (Microsoft, n.d.-a): with 18 observations, the 99% interval for the mean is (93.57, 110.76) from `CONFIDENCE` but (92.50, 111.83), 12.5% wider, from t. In a set of 100 serum calcium values, a single value of 6.0 mg/L pushes kurtosis up to 19.11; drop it and kurtosis falls to −0.10. This article walks through four decisions you make when computing a confidence interval (dividing by n or n−1, using z or t, choosing an interval for a proportion, and handling one stray value), with Python code you can rerun.

## 1. Introduction: the confidence interval is the result, not an intermediate step

With `AVERAGE`, `STDEV`, `VAR`, `CHIINV`, and `CONFIDENCE`, Excel covers almost all of descriptive statistics and parameter estimation. The price of that convenience is that the formula on paper and the function in the spreadsheet do not always match, and users rarely see where they diverge.

A confidence interval (CI) is not just a step on the way to a hypothesis test. Cumming (2014) argues for making an effect size estimate with its CI the main result instead of a p-value, and Krzywinski and Altman (2013) stress reporting the uncertainty that comes with every estimate. If the CI is what you report, the way you compute it deserves the same scrutiny as the way you measure your samples.

It also helps to separate the standard deviation (SD) from the standard error (SE). The SD describes how spread out the individual observations are; the SE, which equals the SD divided by √n, describes the uncertainty of the sample mean. Altman and Bland (2005) point out that you report the SD to describe the data and the SE or a CI to say how precise the mean is. A larger sample shrinks the SE; it does not shrink the SD.

The four issues are ordered by increasing impact: n or n−1 (section 3), z or t (section 4), intervals for a proportion (section 5), and one outlier (section 6, the core of the article). Hypothesis testing and regression are covered in [Statistical hypothesis testing](/en/blog/kiem-dinh-gia-thiet-thong-ke-trong-nghien-cuu-sinh-hoc/) and [Correlation and regression](/en/blog/tuong-quan-va-hoi-quy/).

## 2. Data and methods

### 2.1. The data sets

The examples use five practice data sets in the style of biostatistics textbooks, plus one sample-size problem (Table 1). Their original measurement source is unknown, and section 6.5 shows that the calcium set is most likely illustrative, so every biological comment here is a plausibility check, not a clinical conclusion. The calcium set and the 18-value set are copied in full into the code blocks.

**Table 1.** Data sets used in this article

| Data set | n | Estimate |
| --- | --- | --- |
| Serum calcium (mg/L) | 100 | 95% and 99% CI for μ; proportion > 100 mg/L |
| Height of young men (cm) | 40 | 95% CI for μ and σ² |
| Quantitative variable | 36 | 99% CI for μ and σ² |
| Subset of the set above | 18 | 99% CI for μ and σ² |
| Traps with a rat: 120/400 | 400 | 95% CI for p; number of traps needed |
| Adult height, σ = 7.2 cm | — | n for an error ≤ 1.5 cm at 95% |

Section 7 also uses a grouped frequency table (n = 1060).

### 2.2. Tools and the intervals compared

The calculations use Python 3 (numpy, scipy, pandas), with a few equivalent lines of R. Skewness and kurtosis are computed with exactly the formulas behind Excel's `SKEW` and `KURT` (section 6.2). For the mean, each data set is computed three ways:

- **(a) z with the SD divided by n**: `CONFIDENCE(α, STDEVP(…), n)`. This is the combination that the rule "use `STDEVP` for large samples" leads to.
- **(b) z with the SD divided by n−1**: `CONFIDENCE.NORM(α, STDEV.S(…), n)`.
- **(c) t with the SD divided by n−1**: `CONFIDENCE.T(α, STDEV.S(…), n)`, the standard interval based on Student's distribution (Student, 1908).

For the variance, the standard interval is based on χ² with (n−1)s². For a proportion, four intervals are compared: Wald, Wilson (Wilson, 1927), Agresti–Coull (Agresti & Coull, 1998), and Clopper–Pearson. For the 6.0 mg/L value, the sensitivity analysis has four scenarios: keep it, drop it, or replace it with 96.0 or 106.0 (hypothetical typos with a missing digit, for illustration only). The outlier threshold follows Leys et al. (2013); calcium units are converted using the standard atomic weight 40.078 (CIAAW, n.d.) to compare against published reference intervals (Jassam et al., 2020; Yang et al., 2022).

## 3. n or n−1: correcting twice, or not at all

### 3.1. How STDEV and STDEVP differ

`STDEVP` (now `STDEV.P`) divides the sum of squared deviations by n; `STDEV` (now `STDEV.S`) divides by n−1. When you estimate a population variance from a sample, dividing by n−1 (Bessel's correction) gives an unbiased estimate of σ² at **every** sample size; there is no threshold of 30 above which dividing by n becomes correct.

Bruce and Bruce (2017) note that choosing n or n−1 rarely matters because n is usually large. Table 2 shows this holds when n really is large: at n = 100 the two SDs differ by 0.5%, at n = 18 by almost 3%.

**Table 2.** Standard deviation computed with n and with n−1

| Data set | n | SD with n (`STDEV.P`) | SD with n−1 (`STDEV.S`) | Difference |
| --- | --- | --- | --- | --- |
| Calcium | 100 | 14.315 | 14.387 | 0.5% |
| Height | 40 | 5.062 | 5.127 | 1.3% |
| 36 values | 36 | 15.296 | 15.512 | 1.4% |
| 18 values | 18 | 13.753 | 14.151 | 2.9% |

The difference always equals √(n/(n−1)) − 1.

### 3.2. An identity worth remembering

Let $s_P$ be the SD divided by n and $s$ the SD divided by n−1. Because $n s_P^2 = (n-1) s^2$:

$$\frac{s_P}{\sqrt{n-1}} = \frac{s}{\sqrt{n}}$$

<div class="callout callout-note">
<p class="callout-title">Two ways to write the same standard error</p>

$$\varepsilon = t_{(n-1;\,\alpha/2)} \cdot \frac{s_P}{\sqrt{n-1}} = t_{(n-1;\,\alpha/2)} \cdot \frac{s}{\sqrt{n}}$$
The left side uses the SD divided by n and then divides by √(n−1); the right side uses the SD divided by n−1 and divides by √n. Both give the same result. The only rule: **correct exactly once**.

</div>

If your formula sheet writes the error of the mean in the left-hand form, $t \cdot s/\sqrt{n-1}$ with s as the SD divided by n, the formula is algebraically correct. Problems only arise where the formula meets the function.

### 3.3. The compounding trap

There are two ways to combine things wrongly, in opposite directions:

- **Correcting twice**: use `STDEV` (already divided by n−1) and then divide by √(n−1) again. The interval is inflated by a factor of √(n/(n−1)), wider than it needs to be.
- **Not correcting at all**: use `STDEVP` (divided by n) and pass it to `CONFIDENCE`, which divides by √n. The result is $z \cdot s_P/\sqrt{n}$, narrower than the correct interval by a factor of √((n−1)/n), before z versus t even enters the picture.

The second happens when you follow the rule "use `STDEVP` for large samples" and then call `CONFIDENCE(α, s, n)`.

### 3.4. For the variance, there is no error

The confidence interval for σ² is

$$\left(\frac{(n-1)s^2}{\chi^2_{\alpha/2;\,n-1}};\ \frac{(n-1)s^2}{\chi^2_{1-\alpha/2;\,n-1}}\right)$$

where $\chi^2_{\alpha/2}$ is the upper quantile. Since $n \cdot s_P^2 = (n-1) \cdot s^2$, writing the numerator as `n*VARP(…)` or `(n-1)*VAR(…)` gives the same number. Recomputed for three data sets: height (17.64, 43.33), the 36 values (139.73, 489.90), and the 18 values (95.31, 597.57), all three match the standard formula whichever way the numerator is written. The reason is the identity above, not "use n when n > 30." The χ² degrees of freedom remain n−1 in every case.

### 3.5. Sheppard's correction is not Bessel's correction

For grouped data, the variance computed from class midpoints exceeds the true variance by roughly d²/12, where d is the class width; Sheppard (1897) proposed subtracting that amount: $s^2 - d^2/12$. Bessel corrects the bias from estimating the mean from the same sample, while Sheppard corrects the error from grouping: two different corrections, so a report should say which one was used (example in section 7).

## 4. z or t: CONFIDENCE is not t

### 4.1. Which function uses which distribution

According to Microsoft's support page, `CONFIDENCE` returns the confidence interval for a population mean "using a normal distribution" and has been replaced by newer functions (Microsoft, n.d.-a): `CONFIDENCE.NORM`, which still uses the normal distribution, and `CONFIDENCE.T`, which uses Student's distribution (Microsoft, n.d.-b). Even if your formula sheet says $t_{(n-1;\,\alpha/2)}$, `CONFIDENCE` multiplies by z.

The t distribution was developed for exactly this situation: when σ is unknown and replaced by s from a small sample, the ratio $(\bar{x} - \mu)/(s/\sqrt{n})$ has heavier tails than the normal distribution (Student, 1908). Using z ignores the uncertainty that s itself introduces.

### 4.2. How much narrower

The t/z ratio depends only on n and the confidence level (Table 3); the last column is the √(n/(n−1)) factor from section 3, for comparison.

**Table 3.** The t/z ratio by sample size and confidence level

| n | t/z at 95% | t/z at 99% | √(n/(n−1)) |
| --- | --- | --- | --- |
| 18 | 1.076 | 1.125 | 1.029 |
| 36 | 1.036 | 1.057 | 1.014 |
| 40 | 1.032 | 1.051 | 1.013 |
| 100 | 1.012 | 1.020 | 1.005 |
| 1000 | 1.001 | 1.002 | 1.001 |

At the same sample size, choosing z or t matters about 2.5 to more than 4 times as much as choosing n or n−1, and the effect grows with the confidence level: at n = 18, t(17; 0.995) = 2.898 versus z = 2.576. Table 4 and Figure 1 apply the three methods to the four data sets.

**Table 4.** Half-width ε of the confidence interval for the mean, three methods

| Data set | Level | (a) z, SD with n | (b) z, SD with n−1 | (c) t, SD with n−1 | (c)/(a) | (c)/(b) |
| --- | --- | --- | --- | --- | --- | --- |
| Calcium, n = 100 | 95% | 2.806 | 2.820 | 2.855 | 1.017 | 1.012 |
| Calcium, n = 100 | 99% | 3.687 | 3.706 | 3.779 | 1.025 | 1.020 |
| Height, n = 40 | 95% | 1.569 | 1.589 | 1.640 | 1.045 | 1.032 |
| 36 values | 99% | 6.566 | 6.660 | 7.042 | 1.072 | 1.057 |
| 18 values | 99% | 8.350 | 8.592 | 9.667 | 1.158 | 1.125 |

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-1-en](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-1-en-cd78121a.webp)

**Figure 1.** Confidence intervals for the mean of four data sets, computed three ways; the number on the right is the width ratio of method (c) to method (a).

At n = 100, the correct 95% interval (99.14, 104.85) and method (a)'s interval (99.19, 104.80) nearly coincide. For the 40 heights, the t interval (161.14, 164.41) is 4.5% wider than method (a). For the 18 values at 99%, the z interval is (93.57, 110.76) and the t interval is (92.50, 111.83), 12.5% wider, and 15.8% wider than method (a). A "99%" interval computed with z at n = 18 actually has a confidence level below 99%.

### 4.3. Recompute it yourself

The code below recomputes the 18-value set and checks the identity from section 3.2:

```python
import math
import numpy as np
from scipy import stats

x = np.array([76, 84, 89, 85, 90, 95, 96, 97, 100,
              100, 111, 112, 115, 112, 115, 117, 122, 123], dtype=float)
n, alpha = len(x), 0.01
mean = x.mean()
s_p = x.std(ddof=0)          # STDEV.P: divides by n
s = x.std(ddof=1)            # STDEV.S: divides by n - 1
z = stats.norm.ppf(1 - alpha / 2)
t = stats.t.ppf(1 - alpha / 2, df=n - 1)

print(f"n = {n}, mean = {mean:.3f}, s_P = {s_p:.3f}, s = {s:.3f}")
print(f"s_P/sqrt(n-1) = {s_p / math.sqrt(n - 1):.4f} ; s/sqrt(n) = {s / math.sqrt(n):.4f}")
print(f"z = {z:.3f} ; t(17) = {t:.3f}")
for name, half in [("CONFIDENCE.NORM, s", z * s / math.sqrt(n)),
                   ("CONFIDENCE.T, s   ", t * s / math.sqrt(n))]:
    print(f"{name}: ε = {half:.3f} -> ({mean - half:.2f}; {mean + half:.2f})")
lo, hi = stats.t.interval(0.99, df=n - 1, loc=mean, scale=stats.sem(x))
print(f"scipy t.interval: ({lo:.2f}; {hi:.2f})")
```

```text
n = 18, mean = 102.167, s_P = 13.753, s = 14.151
s_P/sqrt(n-1) = 3.3355 ; s/sqrt(n) = 3.3355
z = 2.576 ; t(17) = 2.898
CONFIDENCE.NORM, s: ε = 8.592 -> (93.57; 110.76)
CONFIDENCE.T, s   : ε = 9.667 -> (92.50; 111.83)
scipy t.interval: (92.50; 111.83)
```

The equivalent in Excel (data in A2:I3; expected values taken from the calculation above) and in R:

```text
Excel:  =CONFIDENCE.T(0.01, STDEV.S(A2:I3), COUNT(A2:I3))     expected 9.667
        =CONFIDENCE.NORM(0.01, STDEV.S(A2:I3), COUNT(A2:I3))  expected 8.592
```

```r
x <- c(76, 84, 89, 85, 90, 95, 96, 97, 100, 100, 111, 112, 115, 112, 115, 117, 122, 123)
t.test(x, conf.level = 0.99)$conf.int                 # t interval for the mean
prop.test(120, 400, correct = FALSE)$conf.int         # Wilson interval for a proportion
binom.test(120, 400)$conf.int                         # Clopper–Pearson
```

```text
[1]  92.49951 111.83383
attr(,"conf.level")
[1] 0.99
[1] 0.2571677 0.3466372
attr(,"conf.level")
[1] 0.95
[1] 0.2554667 0.3475219
attr(,"conf.level")
[1] 0.95
```

### 4.4. Sample size with t

The sample size for a mean is usually computed as $n = (z\,\sigma/\varepsilon)^2$: with σ = 7.2 cm, ε = 1.5 cm, and 95% confidence, that gives 88.51, rounded up to 89. If σ is genuinely known in advance, z is reasonable. If s will be estimated from the sample itself and the CI computed with t, you need to iterate to find the smallest n with $t_{(n-1)} \cdot 7.2/\sqrt{n} \le 1.5$, which gives n = 91. The approximation "t ≈ z when the degrees of freedom are large" is an assumption worth stating.

```python
import math
from scipy import stats

z = stats.norm.ppf(0.975)
p = 0.3
for eps in (0.10, 0.03):                       # absolute 0.10, or relative 10% of 0.3
    print(f"proportion, ε = {eps:.2f}: n = {z**2 * p * (1 - p) / eps**2:.1f}")
print(f"ε achieved with n = 400: {z * math.sqrt(p * (1 - p) / 400):.3f}")

sigma, eps = 7.2, 1.5                          # sample size for a mean
print(f"with z: n = {(z * sigma / eps) ** 2:.2f}")
n = 2
while stats.t.ppf(0.975, n - 1) * sigma / math.sqrt(n) > eps:
    n += 1
print(f"with t (iterated): n = {n}, t = {stats.t.ppf(0.975, n - 1):.3f}")
```

```text
proportion, ε = 0.10: n = 80.7
proportion, ε = 0.03: n = 896.3
ε achieved with n = 400: 0.045
with z: n = 88.51
with t (iterated): n = 91, t = 1.987
```

The first three lines are used for the rat-trap problem in section 5.3.

### 4.5. Numerical accuracy is a separate issue

McCullough and Heiser (2008) concluded that Excel 2007 still failed a standard set of accuracy tests in three areas: statistical distributions, random number generation, and estimation. That assessment says nothing about the version you are using, but results you plan to report should be checked at least once against R or Python.

## 5. Confidence intervals for a proportion: when Wald is good enough

### 5.1. Four intervals on two data sets

The most familiar interval for a proportion is the Wald interval, $\hat{p} \pm z\sqrt{\hat{p}(1-\hat{p})/n}$. Brown, Cai, and DasGupta (2001) showed that its coverage probability fluctuates erratically and can fall well below the nominal level, even when n is not small. Two alternatives are the Wilson interval, obtained by inverting the z test (Wilson, 1927), and the Agresti–Coull interval, which essentially "adds two successes and two failures" and then applies the Wald formula (Agresti & Coull, 1998). Clopper–Pearson is based on the exact binomial distribution and tends to be wider than necessary. Table 5 compares the four.

**Table 5.** 95% confidence intervals for a proportion, four methods

| Data | $\hat{p}$ | Wald | Wilson | Agresti–Coull | Clopper–Pearson |
| --- | --- | --- | --- | --- | --- |
| Calcium > 100 mg/L: 60/100 | 0.60 | (0.504, 0.696) | (0.502, 0.691) | (0.502, 0.691) | (0.497, 0.697) |
| Traps with a rat: 120/400 | 0.30 | (0.255, 0.345) | (0.257, 0.347) | (0.257, 0.347) | (0.255, 0.348) |
| Extra example: 2/30 | 0.067 | (−0.023, 0.156) | (0.018, 0.213) | (0.008, 0.224) | (0.008, 0.221) |

For 60/100 and 120/400, Wald is not wrong: the proportions are far from 0 and 1, n is large enough, and the four intervals differ only in the third decimal place. The difference shows in the last row: with 2 positives out of 30 samples, a common situation when estimating an infection rate or a mutation rate, the Wald lower bound is −0.023, a meaningless negative proportion.

```python
import math
from scipy import stats

def proportion_cis(k, n, conf=0.95):
    z = stats.norm.ppf(1 - (1 - conf) / 2)
    p = k / n
    w = z * math.sqrt(p * (1 - p) / n)
    wald = (p - w, p + w)
    center = (p + z**2 / (2 * n)) / (1 + z**2 / n)
    half = z / (1 + z**2 / n) * math.sqrt(p * (1 - p) / n + z**2 / (4 * n**2))
    wilson = (center - half, center + half)
    n_t = n + z**2                        # Agresti–Coull: add z²/2 successes and z²/2 failures
    p_t = (k + z**2 / 2) / n_t
    w_t = z * math.sqrt(p_t * (1 - p_t) / n_t)
    ac = (p_t - w_t, p_t + w_t)
    cp = stats.binomtest(k, n).proportion_ci(confidence_level=conf, method="exact")
    return {"Wald": wald, "Wilson": wilson, "Agresti–Coull": ac,
            "Clopper–Pearson": (cp.low, cp.high)}

for k, n in [(60, 100), (120, 400), (2, 30)]:
    row = "  ".join(f"{m} ({lo:.3f}; {hi:.3f})" for m, (lo, hi) in proportion_cis(k, n).items())
    print(f"{k}/{n}: {row}")
```

```text
60/100: Wald (0.504; 0.696)  Wilson (0.502; 0.691)  Agresti–Coull (0.502; 0.691)  Clopper–Pearson (0.497; 0.697)
120/400: Wald (0.255; 0.345)  Wilson (0.257; 0.347)  Agresti–Coull (0.257; 0.347)  Clopper–Pearson (0.255; 0.348)
2/30: Wald (-0.023; 0.156)  Wilson (0.018; 0.213)  Agresti–Coull (0.008; 0.224)  Clopper–Pearson (0.008; 0.221)
```

### 5.2. When Wald starts to fail

The true coverage probability of an interval for a proportion can be computed exactly by summing the binomial probabilities of every k whose interval contains p. Figure 2 plots this quantity for n = 30 and n = 100, following the approach of Brown et al. (2001).

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-2-en](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-2-en-d4fa1ffd.webp)

**Figure 2.** Actual coverage probability of nominal 95% Wald and Wilson intervals as a function of the true proportion p, computed exactly from the binomial distribution (y-axis cut at 0.5).

With n = 30, Wald covers only 0.809 at p = 0.1, 0.782 at p = 0.05, and 0.454 at p = 0.02; Wilson at the same points covers 0.974, 0.939, and 0.978. Averaged over p from 0.01 to 0.99, Wald reaches 0.889 and Wilson 0.953; even with n = 100, Wald reaches only 0.877 at p = 0.05. Both curves are jagged because k takes only integer values, and at a few points, such as p = 0.3 with n = 30, Wald even beats Wilson (0.953 versus 0.930). But Wilson oscillates around 95%, while Wald collapses as p approaches 0 or 1. Wilson is therefore the better default; in R, `prop.test(k, n, correct = FALSE)$conf.int` returns exactly this interval.

### 5.3. Which error is "a 10% error"?

The rat-trap problem asks: with an estimated proportion of 0.3 traps catching a rat, how many traps are needed so that, at 95% confidence, the error does not exceed 10%? Two readings give answers more than ten times apart:

- If "10%" is an **absolute error** ε = 0.10, meaning the proportion lies within 0.3 ± 0.1, then $n = (1.96/0.10)^2 \cdot 0.3 \cdot 0.7 = 80.7$, rounded up to **81 traps**.
- If "10%" is a **relative error**, 10% of 0.3, so ε = 0.03, then n = 896.3, rounded up to **897 traps**.

With the 400 traps already set, the absolute error achieved is about 0.045, so the question "how many traps are needed" only helps in planning the next round. When you state an error for a proportion, say whether it is in percentage points or relative percent.

One more point about design: the proportion of traps with a rat is a relative density index, not the population size; estimating the number of animals requires a different design, such as mark and recapture. Likewise, the mean of only the 60 people with calcium > 100 mg/L is the mean of a distribution truncated by the very variable being measured; its CI is meaningful only if that is truly the parameter you want to estimate.

## 6. One 6.0 mg/L value: a sensitivity analysis

### 6.1. One point, nineteen units of kurtosis

In the set of 100 calcium values, 99 lie between 79.9 and 130.2 mg/L, and one is 6.0 (Figure 3).

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-3-en](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-3-en-e421ee76.webp)

**Figure 3.** Distribution of the 100 calcium values: individual points, box plot, the two Tukey fences (dotted lines), and the 2.2–2.6 mmol/L reference interval converted to mg/L (green band).

Table 6 compares the sample statistics across the four scenarios.

**Table 6.** Statistics of the calcium data set when 6.0 is kept, dropped, or replaced

| Statistic | Keep 6.0 | Drop 6.0 | Replace with 96.0 | Replace with 106.0 |
| --- | --- | --- | --- | --- |
| n | 100 | 99 | 100 | 100 |
| Mean | 102.00 | 102.97 | 102.90 | 103.00 |
| Median | 102.55 | 102.70 | 102.55 | 102.80 |
| SD (n−1) | 14.39 | 10.68 | 10.65 | 10.63 |
| MAD (× 1.4826) | 11.27 | 11.12 | 11.19 | 11.05 |
| Skewness (`SKEW`) | −2.90 | 0.12 | 0.14 | 0.12 |
| Kurtosis (`KURT`) | 19.11 | −0.10 | −0.09 | −0.07 |
| Shapiro–Wilk, p | 2.1 × 10⁻¹⁰ | 0.78 | 0.74 | 0.79 |
| 95% CI for the mean (t) | (99.14, 104.85) | (100.84, 105.10) | (100.78, 105.01) | (100.89, 105.11) |

One value, 1% of the sample, raises the SD by 35%, flips skewness from 0.12 to −2.90, pushes kurtosis from −0.10 to 19.11, and turns a sample that looks very normal (Shapiro–Wilk p = 0.78) into one that rejects normality at any conventional significance level. The CI widens by about a third and shifts downward. The median and the MAD change by only 0.15. The three scenarios without 6.0 give nearly identical results, so the conclusion does not depend on which number you "correct" it to.

![bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-4-en](/vault-assets/bv-01-ac-trung-thong-ke-mau-va-uoc-luong-th-4-en-b39682e2.webp)

**Figure 4.** Histogram of the calcium data set before and after dropping the value 6.0.

### 6.2. How Excel computes skewness and kurtosis

`SKEW` and `KURT` do not use the simple moment formulas but sample-adjusted versions:

$$G_1 = \frac{n}{(n-1)(n-2)} \sum \left(\frac{x_i - \bar{x}}{s}\right)^3, \qquad G_2 = \frac{n(n+1)}{(n-1)(n-2)(n-3)} \sum \left(\frac{x_i - \bar{x}}{s}\right)^4 - \frac{3(n-1)^2}{(n-2)(n-3)}$$

where s is the SD divided by n−1. Joanes and Gill (1998) compared three families of skewness and kurtosis measures used by statistical software; $G_1$ and $G_2$ are the sample-adjusted family. These two formulas reproduce Excel's −2.899 and 19.109 exactly; in scipy you need `bias=False` to get the same result.

### 6.3. Kurtosis measures tails, not peakedness

Positive kurtosis is often read as a "peaked" (leptokurtic) distribution and negative kurtosis as "flat" (platykurtic). Westfall (2014) showed that kurtosis has a clear interpretation only in terms of tail extremity, that is, outliers, and says almost nothing about the peak. In Figure 4 the peak barely changes when 6.0 is dropped; a single point far out in the left tail is what pushed kurtosis from −0.10 to 19.11. When you see a large kurtosis, the first question should be "is there something unusual in the tails?"

Similarly, the skewness of 0.034 in the 40 heights means the data are nearly symmetric; calling that "right-skewed" because of the sign of a very small number reads too much into the data.

### 6.4. Detecting outliers: don't let the SD measure itself

The classic z score, $(x - \bar{x})/s$, of the value 6.0 is −6.67, so this time it is caught. But the outlier itself has inflated s (from 10.68 to 14.39) and pulled the mean toward it, so in small samples or samples with several outliers, the classic z can mask them. Leys et al. (2013) recommend replacing the mean with the median, the SD with the MAD (median absolute deviation, multiplied by 1.4826 to match the SD under normality), and using 2.5 as the default threshold. The robust z of 6.0 is $(6.0 - 102.55)/11.27 = -8.57$; no other value exceeds 2.5.

Tukey's fences, Q1 − 1.5 × IQR and Q3 + 1.5 × IQR, give (73.4, 132.5) and also flag only the value 6.0. All three methods point to the same single value.

The median and the MAD are robust because they depend only on the ordering and the middle of the data. Bruce and Bruce (2017) emphasize that the MAD is not influenced by extreme values; Hampel (1974) built the theoretical framework for robustness through the influence curve. In Table 6, the SD changes by 35%, the MAD by 1.3%.

```python
import numpy as np
import pandas as pd
from scipy import stats

ca = np.array([
    104.6, 113.9, 113.7, 97.2, 102.0, 107.7, 96.7, 106.3, 104.2, 124.6,
    94.9, 116.8, 97.4, 79.9, 102.1, 100.8, 112.8, 110.8, 110.1, 95.6,
    100.6, 109.1, 95.2, 117.9, 88.1, 101.6, 103.8, 97.1, 103.8, 105.9,
    110.2, 110.3, 98.5, 96.4, 111.8, 102.7, 83.6, 88.6, 80.6, 106.6,
    114.9, 111.8, 98.9, 106.6, 122.7, 94.9, 101.6, 85.8, 108.6, 96.5,
    95.1, 6.0, 118.3, 112.5, 106.1, 96.6, 91.1, 104.9, 91.1, 112.8,
    85.0, 110.1, 86.6, 95.6, 100.4, 102.9, 86.5, 94.5, 102.4, 95.3,
    107.6, 91.0, 105.4, 103.6, 114.2, 118.3, 101.9, 97.6, 93.7, 110.2,
    93.1, 99.9, 110.4, 114.0, 120.3, 110.3, 112.5, 96.9, 91.5, 94.4,
    102.3, 88.4, 123.2, 130.2, 80.6, 129.9, 98.0, 105.3, 104.0, 110.4])

def skew_excel(x):          # formula used by SKEW (G1)
    n, s = len(x), x.std(ddof=1)
    return n / ((n - 1) * (n - 2)) * np.sum(((x - x.mean()) / s) ** 3)

def kurt_excel(x):          # formula used by KURT (G2)
    n, s = len(x), x.std(ddof=1)
    return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) * np.sum(((x - x.mean()) / s) ** 4)
            - 3 * (n - 1) ** 2 / ((n - 2) * (n - 3)))

def describe(x):
    lo, hi = stats.t.interval(0.95, df=len(x) - 1, loc=x.mean(), scale=stats.sem(x))
    return {"n": len(x), "mean": x.mean(), "median": np.median(x),
            "SD": x.std(ddof=1), "MAD": stats.median_abs_deviation(x, scale="normal"),
            "skew": skew_excel(x), "kurt": kurt_excel(x),
            "Shapiro p": stats.shapiro(x).pvalue, "CI95 low": lo, "CI95 high": hi}

scenarios = {"keep 6.0": ca, "drop 6.0": ca[ca != 6.0],
             "6.0 -> 96.0": np.where(ca == 6.0, 96.0, ca),
             "6.0 -> 106.0": np.where(ca == 6.0, 106.0, ca)}
table = pd.DataFrame({k: describe(v) for k, v in scenarios.items()})
print(table.map(lambda v: f"{v:.2g}" if abs(v) < 1e-3 else f"{v:.2f}").to_string())

med, mad = np.median(ca), stats.median_abs_deviation(ca, scale="normal")
q1, q3 = np.percentile(ca, [25, 75])
print(f"classic z of 6.0: {(6.0 - ca.mean()) / ca.std(ddof=1):.2f}")
print(f"robust z of 6.0:  {(6.0 - med) / mad:.2f}")
print(f"Tukey fences: ({q1 - 1.5 * (q3 - q1):.1f}; {q3 + 1.5 * (q3 - q1):.1f})")
```

```text
          keep 6.0 drop 6.0 6.0 -> 96.0 6.0 -> 106.0
n           100.00    99.00      100.00       100.00
mean        102.00   102.97      102.90       103.00
median      102.55   102.70      102.55       102.80
SD           14.39    10.68       10.65        10.63
MAD          11.27    11.12       11.19        11.05
skew         -2.90     0.12        0.14         0.12
kurt         19.11    -0.10       -0.09        -0.07
Shapiro p  2.1e-10     0.78        0.74         0.79
CI95 low     99.14   100.84      100.78       100.89
CI95 high   104.85   105.10      105.01       105.11
classic z of 6.0: -6.67
robust z of 6.0:  -8.57
Tukey fences: (73.4; 132.5)
```

### 6.5. Checking units: is the number biologically plausible?

The next step is to ask whether the value could occur in a living body. With a standard atomic weight of 40.078 (CIAAW, n.d.), 1 mmol/L of calcium corresponds to 40.078 mg/L, so 6.0 mg/L is only about 0.15 mmol/L. The reference interval for total calcium in adults is 2.2–2.6 mmol/L under the UK harmonized standard (Jassam et al., 2020) and 2.122–2.518 mmol/L in a study of healthy adults in Shanghai (Yang et al., 2022). A value of 0.15 mmol/L is more than ten times below these lower limits.

The conversion also exposes a problem with the rest of the data. The upper limit of 2.6 mmol/L corresponds to 104.2 mg/L, and 43 of the remaining 99 values exceed it; the maximum, 130.2 mg/L, is about 3.25 mmol/L. Only 47/99 values fall within 88.2–104.2 mg/L (the green band in Figure 3). For a sample labeled "healthy people," that is unlikely; most likely these are illustrative numbers, or the unit recorded differs from the unit actually measured. The habit to take away: convert units and place your data next to published physiological ranges before computing any CI.

### 6.6. Practical rules for outliers

Never delete an outlier silently. A reasonable sequence, with criteria fixed before the analysis:

1. Flag values with a predefined criterion (robust z > 2.5 or Tukey's fences).
2. Trace back to the source: result slips, instrument export files, the lab notebook. Correct the value if you find the right one.
3. If it cannot be resolved, report both scenarios, with and without the point, as in Table 6.
4. Record the decision and the reason.

A documented data-cleaning workflow is covered in [Process data from Dirty to Clean](/en/blog/process-data-from-dirty-to-clean/).

## 7. Other small traps: do you fall into them?

<div class="callout callout-warning">
<p class="callout-title">Five easy slips when computing sample statistics</p>

- **Multiple modes.** The height data have two modes, 161 and 164 cm, each occurring 4 times. `MODE` returns only one value; `MODE.MULT` returns all of them (Microsoft, n.d.-c). For continuous data like calcium, a mode of 94.9 is just a value that happens to repeat.
- **Data ranges.** Copying formulas can easily shift a reference range by one column; check that `COUNT` of that range equals n.
- **Percentiles.** Hyndman and Fan (1996) list nine definitions of sample quantiles used in software. `PERCENTILE(…, 0.05)` for the calcium set gives 84.93, matching R's default `quantile` (type 7) and `numpy.percentile`; when comparing two programs, state the definition.
- **z coefficients.** The 99.9% coefficient is 3.29 (3.2905), not 3.3.
- **Cell labels.** A label copied onto the wrong variable does not change the number but does make the report wrong.

</div>

Class boundaries deserve an example. The frequency table with n = 1060 has classes labeled 43–46, 47–50, 51–54, and so on. If the underlying data are integers (an assumption to confirm against the raw data), the true class boundaries are 42.5–46.5, 46.5–50.5, and so on, and the class width is d = 4, not 3. Then the median from $Me = b + d\,(n/2 - m_j)/m_i$ is 76.33 instead of 76.37; P5 is 60.19 instead of 60.27; and the Sheppard-corrected variance is $93.95 - 4^2/12 = 92.62$ instead of 93.20. The mode stays at 76.5. The differences are small, but this is a definitional error repeated in every statistic computed from the table. Tables whose boundaries are already continuous, such as 49.5–54.5, avoid the problem.

## 8. Reporting with an estimation mindset: template sentences and a checklist

A reporting sentence should give readers enough to reproduce the number (Cumming, 2014): point estimate, interval type, confidence level, n, SD, and tool.

<div class="callout callout-example">
<p class="callout-title">Template sentences</p>

Mean 102.2 (99% CI from the t distribution: 92.5–111.8; n = 18; SD 14.2; computed with `CONFIDENCE.T` in Excel).

The proportion of traps with a rat was 0.30 (95% Wilson CI: 0.257–0.347; 120/400).

Mean serum calcium was 102.0 mg/L (95% t CI: 99.1–104.9; n = 100); after excluding one value of 6.0 mg/L with a robust z of −8.6, the mean was 103.0 (95% CI: 100.8–105.1; n = 99).

</div>

The third sentence is a sensitivity analysis: both scenarios plus the flagging criterion. The SD describes the data and the CI describes the precision of the mean (Altman & Bland, 2005); one does not replace the other.

**A six-step checklist before reporting a confidence interval**

1. **Plot the data before computing.** Figure 3 reveals the 6.0 faster than any statistic.
2. **Check units and published physiological ranges.**
3. **Use `STDEV.S`** at every sample size; apply the n−1 correction only once.
4. **Use `CONFIDENCE.T`**, `t.test()`, or `scipy.stats.t.interval` for a mean; use z only when σ is truly known.
5. **For a proportion, use Wilson**; state whether a sample-size error is absolute or relative.
6. **If there are outliers, report a sensitivity analysis** based on predefined criteria.

In the same spirit of "don't assume what you don't need to," Welch's t test does not assume equal variances ([Statistical hypothesis testing](/en/blog/kiem-dinh-gia-thiet-thong-ke-trong-nghien-cuu-sinh-hoc/)). A 95% CI on real measurements: Darwin's finches; the 40 heights recomputed in R: [Virtual Lab](/projects/virtual-lab/); basic descriptive functions in R: [presenting and describing data in R](/en/blog/trinh-bay-va-mo-ta-du-lieu-thuc-hanh-r/).

## 9. Conclusion

The three decisions have three levels of impact. Choosing n or n−1 matters little, under 3% even at n = 18, as long as you correct only once; for the CI of a variance, `n*VARP` and `(n-1)*VAR` give the same result. Choosing z or t matters moderately: negligible at n = 100, but at n = 18 the correct 99% t interval is 12.5% wider than the z interval, and `CONFIDENCE` always uses z. A single outlier matters most: the 6.0 mg/L value moves kurtosis from −0.10 to 19.11 and raises the SD by 35%, while the median and the MAD barely move. So when checking a confidence interval, look at the data and units first, choose the right distribution next, and leave n versus n−1 for last.

## References

Agresti, A., & Coull, B. A. (1998). Approximate is better than "exact" for interval estimation of binomial proportions. *The American Statistician, 52*(2), 119–126. https://doi.org/10.1080/00031305.1998.10480550

Altman, D. G., & Bland, J. M. (2005). Standard deviations and standard errors. *BMJ, 331*(7521), 903. https://doi.org/10.1136/bmj.331.7521.903

Brown, L. D., Cai, T. T., & DasGupta, A. (2001). Interval estimation for a binomial proportion. *Statistical Science, 16*(2), 101–133. https://doi.org/10.1214/ss/1009213286

Bruce, P., & Bruce, A. (2017). *Practical statistics for data scientists: 50 essential concepts*. O'Reilly Media.

CIAAW. (n.d.). *Calcium*. Commission on Isotopic Abundances and Atomic Weights. https://www.ciaaw.org/calcium.htm

Cumming, G. (2014). The new statistics: Why and how. *Psychological Science, 25*(1), 7–29. https://doi.org/10.1177/0956797613504966

Hampel, F. R. (1974). The influence curve and its role in robust estimation. *Journal of the American Statistical Association, 69*(346), 383–393. https://doi.org/10.1080/01621459.1974.10482962

Hyndman, R. J., & Fan, Y. (1996). Sample quantiles in statistical packages. *The American Statistician, 50*(4), 361–365. https://doi.org/10.1080/00031305.1996.10473566

Jassam, N., Luvai, A., Narayanan, D., Turnock, D., Lee, G., Earp, K., West, J., Day, A., Jeffery, J., Zouwail, S., El-Farhan, N., Dearman, R., Hayden, K., Willett, S., Osborne, J., & Barth, J. H. (2020). Albumin and calcium reference interval using healthy individuals and a data-mining approach. *Annals of Clinical Biochemistry, 57*(5), 373–381. https://doi.org/10.1177/0004563220944204

Joanes, D. N., & Gill, C. A. (1998). Comparing measures of sample skewness and kurtosis. *Journal of the Royal Statistical Society: Series D (The Statistician), 47*(1), 183–189. https://doi.org/10.1111/1467-9884.00122

Krzywinski, M., & Altman, N. (2013). Importance of being uncertain. *Nature Methods, 10*(9), 809–810. https://doi.org/10.1038/nmeth.2613

Leys, C., Ley, C., Klein, O., Bernard, P., & Licata, L. (2013). Detecting outliers: Do not use standard deviation around the mean, use absolute deviation around the median. *Journal of Experimental Social Psychology, 49*(4), 764–766. https://doi.org/10.1016/j.jesp.2013.03.013

McCullough, B. D., & Heiser, D. A. (2008). On the accuracy of statistical procedures in Microsoft Excel 2007. *Computational Statistics & Data Analysis, 52*(10), 4570–4578. https://doi.org/10.1016/j.csda.2008.03.004

Microsoft. (n.d.-a). *CONFIDENCE function*. Microsoft Support. https://support.microsoft.com/en-us/office/confidence-function-75ccc007-f77c-4343-bc14-673642091ad6

Microsoft. (n.d.-b). *CONFIDENCE.T function*. Microsoft Support. https://support.microsoft.com/en-us/office/confidence-t-function-e8eca395-6c3a-4ba9-9003-79ccc61d3c53

Microsoft. (n.d.-c). *MODE.MULT function*. Microsoft Support. https://support.microsoft.com/en-us/office/mode-mult-function-50fd9464-b2ba-4191-b57a-39446689ae8c

Sheppard, W. F. (1897). On the calculation of the most probable values of frequency-constants, for data arranged according to equidistant division of a scale. *Proceedings of the London Mathematical Society, s1-29*(1), 353–380. https://doi.org/10.1112/plms/s1-29.1.353

Student. (1908). The probable error of a mean. *Biometrika, 6*(1), 1–25. https://doi.org/10.2307/2331554

Westfall, P. H. (2014). Kurtosis as peakedness, 1905–2014. R.I.P. *The American Statistician, 68*(3), 191–195. https://doi.org/10.1080/00031305.2014.917055

Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association, 22*(158), 209–212. https://doi.org/10.1080/01621459.1927.10502953

Yang, Y.-Y., Zhang, D., Ma, L.-Y., Hou, Y.-F., Bi, Y.-F., Xu, Y., Xu, M., Zhao, H.-Y., Sun, L.-H., Tao, B., & Liu, J.-M. (2022). Association of famine exposure and the serum calcium level in healthy Chinese adults. *Frontiers in Endocrinology, 13*, 937380. https://doi.org/10.3389/fendo.2022.937380
