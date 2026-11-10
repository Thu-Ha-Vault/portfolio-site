---
title: Causal Inference
type: course-note
tags:
  - data-science
  - AI
section: AI và DEV
folder: AI và DEV / Khoá học AI của Tsing Hua University / Learning Module
vaultPath: >-
  Resources/AI và DEV/Khoá học AI của Tsing Hua University/Learning Module/10 -
  Causal Inference.md
url: /blog/causal-inference/
topic: ai-development
updated: '2026-10-14'
source: 'https://maic.chat/my_study'
order: 10
description: >-
  Lưu ý quan trọng: Biến phụ thuộc $Y$ luôn là biến nội sinh vì bản chất toàn bộ
  biến thiên của sai số $\varepsilon$ là biến thiên thuộc về $Y$. Năng lực
  (ability) có thể coi là ngoại sinh nếu xem là thiên phú bẩm sinh khô
isIndex: false
---
## Violation of the Ordinary Least Squares (OLS) Assumptions
### 1. 10 giả định cổ điển của OLS (Classical Hypotheses)
Để ước lượng OLS không thiên vị (*unbiased*) và nhất quán (*consistent*), mô hình cần thỏa mãn: (→ Linear and Logistic Regression)
1. **Không có sai số chỉ định mô hình:** Dạng hàm hồi quy đúng theo lý thuyết.
2. **Mẫu ngẫu nhiên mang tính đại diện.**
3. **Sai số ngẫu nhiên $\varepsilon$ tuân theo phân phối chuẩn** có kỳ vọng bằng 0: $E(\varepsilon) = 0$.
4. **Không có hiện tượng tự tương quan:** Các sai số độc lập với nhau ($Cov(\varepsilon_i, \varepsilon_j) = 0$ với $i \neq j$).
5. **Phương sai sai số không đổi (Homoscedasticity):** $Var(\varepsilon_i) = \sigma^2$. (Nếu vi phạm, dùng *WLS - Weighted Least Squares*).
6. **Biến độc lập được đo lường không có sai số** (Không có sai số đo lường).
7. **Biến giải thích $X$ và sai số $\varepsilon$ không tương quan:** $Cov(X, \varepsilon) = 0$ (Giả định ngoại sinh nghiêm ngặt - **Trọng tâm bài học**).
8. **Không có đa cộng tuyến hoàn hảo:** Các biến độc lập có tính độc lập tuyến tính.
9. **Ma trận $X$ cỡ $n \times (k+1)$ phi ngẫu nhiên** và có hạng đầy đủ $\rho = k + 1$.
10. **Độ lệch chuẩn của $X$ tiến tới một hằng số hữu hạn** khi cỡ mẫu $n \to \infty$.
### 2. Trực quan hóa OLS qua biểu đồ Venn
* **Tổng biến thiên của $Y$** chia làm hai phần:
  * **Phần giải thích được (Fitted value):** Vùng giao giữa vòng tròn $X$ và vòng tròn $Y$ (thể hiện tương quan/sức mạnh giải thích của $X$ lên $Y$, phản ánh qua hệ số $\beta$).
  * **Phần không giải thích được (Residual/Error $\varepsilon$):** Phần diện tích của $Y$ nằm ngoài $X$.
* **Ước lượng OLS:**
  $$Cov(Y, X) = \beta_1 Var(X) + Cov(\varepsilon, X) \implies \beta_1 = \frac{\sigma_{YX} - \sigma_{\varepsilon X}}{\sigma_X^2}$$
  * Chỉ khi **$\sigma_{\varepsilon X} = 0$** ($X$ ngoại sinh), ta mới có: $\hat{\beta}_1 = \frac{\sigma_{YX}}{\sigma_X^2}$.
### 3. Thiên lệch do bỏ sót biến (Omitted Variable Bias - OVB)
* **Ví dụ tiền lương và học vấn:**
  $$\text{Wage} = \beta_0 + \beta_1 \times \text{edu} + \beta_2 \times \text{ability} + \varepsilon$$
* **Vấn đề thực tế:** Năng lực cá nhân (*ability*) thường không quan sát hay đo lường chính xác được, nên bị đẩy vào phần dư $\varepsilon$.
* **Hai trường hợp:**
  * **$Cov(\text{edu}, \text{ability}) = 0$:** Biến bị bỏ sót không gây thiên lệch nghiêm trọng cho $\beta_1$.
  * **$Cov(\text{edu}, \text{ability}) \neq 0$:** Vòng tròn của $\text{edu}$ giao với vòng tròn $\text{ability}$ (nay nằm trong $\varepsilon$). Khi đó $Cov(X, \varepsilon) \neq 0$, vi phạm giả định ngoại sinh và gây ra **thiên lệch do bỏ sót biến (OVB)**.
### 4. Biến ngoại sinh (Exogenous) vs. Biến nội sinh (Endogenous)

| Đặc điểm | Biến ngoại sinh (Exogenous) | Biến nội sinh (Endogenous) |
| :--- | :--- | :--- |
| **Định nghĩa** | Không tương quan với sai số $\varepsilon$ ($Cov(X, \varepsilon) = 0$). | Tương quan với sai số $\varepsilon$ ($Cov(X, \varepsilon) \neq 0$). |
| **Nguồn gốc** | Do các yếu tố bên ngoài hệ thống quyết định (ví dụ: giới tính, độ tuổi sinh ra). | Bị chi phối bởi các yếu tố bên trong hệ thống hoặc do bỏ sót biến. |
| **Biểu đồ Venn** | Vùng $X$ và vùng $\varepsilon$ tách biệt hoàn toàn, không giao nhau. | Vùng $X$ và vùng $\varepsilon$ có phần diện tích giao nhau. |
| **Hệ quả với OLS** | Ước lượng OLS không thiên vị và nhất quán. | Ước lượng OLS bị thiên lệch, không phản ánh đúng quan hệ nhân quả. |

> **Lưu ý quan trọng:**
> * **Biến phụ thuộc $Y$ luôn là biến nội sinh** vì bản chất toàn bộ biến thiên của sai số $\varepsilon$ là biến thiên thuộc về $Y$.
> * **Năng lực (*ability*)** có thể coi là ngoại sinh nếu xem là thiên phú bẩm sinh không đổi; nhưng sẽ là nội sinh nếu năng lực thay đổi và phát triển qua quá trình giáo dục.
### 5. Vấn đề tự lựa chọn (Self-Selection Problem)
Khi biến nội sinh $X$ là một **biến rời rạc / biến nhị phân** ($D_i \in \{0, 1\}$) đại diện cho một quyết định hoặc lựa chọn (ví dụ: $D_i=1$ là đi học cấp 3, $D_i=0$ là nghỉ học đi làm sớm), hiện tượng nội sinh biểu hiện dưới dạng **thiên lệch tự lựa chọn**.
#### Khung kết quả tiềm năng (Potential Outcomes Framework)
* $Y_{1i}$: Tiền lương nếu đi học; $Y_{0i}$: Tiền lương nếu không đi học.
* Giá trị quan sát được: $Y_i = Y_{0i} + (Y_{1i} - Y_{0i}) D_i$.
#### Phân rã sai số quan sát được
Sự chênh lệch tiền lương trung bình giữa hai nhóm quan sát được phân tách thành:
$$E[Y_i \mid D_i=1] - E[Y_i \mid D_i=0] = \underbrace{E[Y_{1i} - Y_{0i} \mid D_i=1]}_{\text{ATT}} + \underbrace{\left( E[Y_{0i} \mid D_i=1] - E[Y_{0i} \mid D_i=0] \right)}_{\text{Selection Bias}}$$

* **ATT (Average Treatment Effect on the Treated):** Hiệu quả can thiệp thực sự đối với nhóm đã đi học.
* **Selection Bias (Thiên lệch lựa chọn):** Chênh lệch tiền lương vốn có giữa hai nhóm ngay cả khi *cả hai nhóm đều không đi học* (do khác biệt nền tảng gia đình, năng khiếu, vùng miền,...).
* **ATE (Average Treatment Effect):** Hiệu quả can thiệp trung bình trên toàn bộ tổng thể.
* **ATNT / ATU (Average Treatment Effect on the Non-Treated):** Hiệu quả can thiệp nếu nhóm chưa từng đi học được đi học.
### 6. Bản chất cốt lõi cần nhớ
1. **Bản chất của OLS:** OLS tính toán mức độ thay đổi của $Y$ tương ứng với $X$ dựa trên hiệp phương sai giữa chúng. OLS chỉ bóc tách được đúng tác động nhân quả nếu phần biến thiên của $X$ hoàn toàn "sạch" (không dính líu gì tới các yếu tố trong sai số $\varepsilon$). (→ [Statistic and Regression](/blog/statistic-and-regression/))
2. **Tại sao có hiện tượng nội sinh?** Khi có một yếu tố thứ 3 (như năng lực, hoàn cảnh gia đình) vừa tác động lên quyết định đi học ($X$), vừa tác động trực tiếp lên mức lương tương lai ($Y$). Vì ta không đo được yếu tố này nên nó ẩn trong sai số $\varepsilon$. Kết quả là $X$ tương quan với $\varepsilon$.
3. **Tại sao OLS thất bại?** Khi $X$ và $\varepsilon$ chồng lấn lên nhau, OLS sẽ gán nhầm cả phần ảnh hưởng của các yếu tố ẩn này vào hệ số của $X$, dẫn đến ước lượng sai lệch (thổi phồng hoặc đánh giá thấp tác động thực).
4. **Hướng giải quyết tiếp theo:** Do OLS bị thiên lệch khi có biến nội sinh, ta phải tìm một biến thứ ba gọi là **Biến công cụ (Instrumental Variable - IV)**—một biến chỉ tác động vào $X$ mà hoàn toàn không liên quan gì đến sai số $\varepsilon$—để tách lấy phần biến thiên "sạch" của $X$. (→ Causal Inference)
## Ý Tưởng Cốt Lõi Của Phương Pháp Biến Công Cụ (The Core Idea of Instrumental Variables in Causal Inference)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả & Xử lý Vấn đề Nội sinh trong Kinh tế lượng (Causal Inference & Endogeneity Correction - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Trong mô hình hồi quy $Y = \beta_0 + \beta_1 X + \varepsilon$, khi giả định ngoại sinh bị vi phạm do biến bị bỏ sót (omitted variables), sai số đo lường (measurement error) hoặc quan hệ nhân quả hai chiều (simultaneity), ta có:
    $$\text{Cov}(X, \varepsilon) \ne 0 \implies \hat{\beta}_{1, \text{OLS}} \xrightarrow{p} \beta_1 + \frac{\text{Cov}(X, \varepsilon)}{\text{Var}(X)} \ne \beta_1$$
    Ước lượng OLS bị chệch và không nhất quán, không thể hiện đúng tác động nhân quả thuần túy.
  * Phân rã biến thiên của biến giải thích nội sinh $X$:
    $$X = X_{\text{endogenous}} + X_{\text{exogenous}}$$
    * $X_{\text{endogenous}}$: Phần biến thiên tương quan với phần dư sai số $\varepsilon$ (chứa các yếu tố nhiễu không quan sát được).
    * $X_{\text{exogenous}}$: Phần biến thiên độc lập với sai số $\varepsilon$.
  * Biến công cụ ($Z$) là một biến ngoại sinh quan sát được, thỏa mãn đồng thời hai giả định tiên đề:
    1. *Giả định về tính liên quan (Instrument Relevance):* Biến công cụ phải có tương quan mạnh với biến nội sinh:
       $$\text{Cov}(Z, X) \ne 0 \quad (\text{hay } \text{Corr}(Z, X) \ne 0)$$
    2. *Giả định về tính ngoại sinh & Ràng buộc loại trừ (Instrument Exogeneity & Exclusion Restriction):* Biến công cụ không có tương quan với sai số và chỉ tác động đến biến kết quả $Y$ duy nhất thông qua kênh truyền dẫn $X$:
       $$\text{Cov}(Z, \varepsilon) = 0 \quad \text{và} \quad Y \perp Z \mid X, \varepsilon$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Thay vì cố gắng tìm kiếm và kiểm soát toàn bộ các biến gây nhiễu tiềm ẩn (vốn là nhiệm vụ bất khả thi trong thực nghiệm xã hội), phương pháp IV tiếp cận theo nguyên lý: **"Khử nội sinh, giữ ngoại sinh"**. Phương pháp sử dụng dao động ngoại sinh của $Z$ như một công cụ lọc cơ học để trích xuất phần biến thiên sạch của $X$, tạo ra ước lượng không chệch tiệm cận (asymptotically unbiased).
### 2. Phân tích các ví dụ minh họa (Slide 5, 7, 8 & Transcript)
* **Cơ chế phân tách và ước lượng qua Hai giai đoạn (Two-Stage Least Squares - 2SLS):**
  * *Biểu diễn logic:* 
    $$\text{Giai đoạn 1 (First Stage): } X = \pi_0 + \pi_1 Z + v \implies \hat{X} = \hat{\pi}_0 + \hat{\pi}_1 Z$$
    $$\text{Giai đoạn 2 (Second Stage): } Y = \beta_0 + \beta_1 \hat{X} + u \implies \hat{\beta}_{1, \text{2SLS}} = \frac{\text{Cov}(Y, Z)}{\text{Cov}(X, Z)} \xrightarrow{p} \beta_{\text{causal}}$$
  * *Cơ chế thực tế:* 
    * Ở Giai đoạn 1, $X$ được phân rã thành giá trị dự phóng $\hat{X}$ (hàm tuyến tính theo $Z$) và phần dư $v$. Vì $Z$ hoàn toàn độc lập với sai số hệ thống $\varepsilon$, toàn bộ phần tương quan độc hại giữa $X$ và $\varepsilon$ được gom vào $v$.
    * Ở Giai đoạn 2, giá trị dự phóng $\hat{X}$ được đưa vào mô hình thay cho $X$ gốc. Vì $\text{Cov}(\hat{X}, \varepsilon) = 0$, bài toán nội sinh được giải quyết triệt để, hệ số thu được phản ánh chính xác hiệu ứng can thiệp nhân quả từ $X$ sang $Y$.
* **Mô hình hóa biến thiên bằng Biểu đồ không gian phương sai (Slide 1, 3, 4, 7):**
  * *Biểu diễn logic:* 
    $$\text{Phần chồng lấn } (X \cap \varepsilon) \xrightarrow{\text{Loại bỏ hoàn toàn}} \text{Phần chồng lấn } (X \cap Z) \xrightarrow{\text{Chuyển tiếp ước lượng}} \hat{X} \rightarrow Y$$
  * *Cơ chế thực tế:* Trên sơ đồ phương sai, vùng giao thoa giữa $X$ và $Y$ ban đầu bị ô nhiễm bởi vùng giao thoa giữa $X$ và $\varepsilon$. Biến công cụ $Z$ cắt ngang qua $X$ ở một vùng hoàn toàn nằm ngoài biên giới của $\varepsilon$. Khi chỉ dùng vùng giao thoa $(X \cap Z)$ để giải thích biến thiên của $Y$, ta cô lập được tác động thực sự mà không bị nhiễu bởi các biến ẩn.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 5, 6, 8, 9 & Transcript)
* **Theo góc nhìn Kiểm định Tính Hợp lệ của Biến Công cụ (Instrument Diagnostics):**
  * *Mục tiêu:* Ngăn ngừa rủi ro biến công cụ yếu (Weak Instrument) dẫn đến phương sai ước lượng bùng nổ hoặc phóng đại độ chệch.
  * *Hành động can thiệp:* Tại Giai đoạn 1, bắt buộc kiểm định ý nghĩa thống kê của hệ số $\pi_1$ qua chỉ số $F$-statistic (áp dụng tiêu chuẩn thực nghiệm $F > 10$ hoặc bảng kiểm Stock-Yogo); biện luận chặt chẽ trên lý thuyết kinh tế để đảm bảo không tồn tại bất kỳ con đường trực tiếp nào dẫn từ $Z$ đến $Y$ bỏ qua $X$.
* **Theo góc nhìn Thiết kế Thể chế & Đánh giá Tác động Chính sách (Policy & Program Evaluation):**
  * *Mục tiêu:* Đánh giá chính xác hiệu quả can thiệp công (ví dụ: tác động của số năm đi học lên thu nhập, quy mô lớp học lên điểm số) khi các đối tượng tự lựa chọn tham gia (self-selection bias).
  * *Hành động can thiệp:* Tìm kiếm các cú sốc ngoại sinh tự nhiên (Natural Experiments) đóng vai trò biến công cụ $Z$ như: sự thay đổi địa giới tuyển sinh, khoảng cách địa lý đến cơ sở đào tạo, ngày sinh quy định độ tuổi nhập học, hoặc các đợt bốc thăm ngẫu nhiên chỉ tiêu học bổng.
* **Theo góc nhìn Đánh đổi giữa Độ tin cậy và Hiệu quả Thống kê (Robustness vs. Efficiency Trade-off):**
  * *Mục tiêu:* Cân đối giữa việc triệt tiêu độ chệch chọn mẫu và hiện tượng phương sai ước lượng tăng cao.
  * *Hành động can thiệp:* Nhận thức rõ rằng $\hat{X}$ chỉ khai thác một phần phương sai của $X$, khiến sai số chuẩn (standard error) của ước lượng 2SLS luôn lớn hơn OLS ($\text{SE}(\hat{\beta}_{\text{2SLS}}) > \text{SE}(\hat{\beta}_{\text{OLS}})$); do đó, trong thiết kế khảo sát thực địa cần tăng quy mô mẫu ($N$) để bù đắp cho sự sụt giảm hiệu quả thống kê khi sử dụng phương pháp IV.
## Phương Pháp Ước Lượng Mô-Men Cho Biến Công Cụ & Ước Lượng Wald (Method of Moments IV Estimation & The Wald Estimator)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–8 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả & Ước lượng Tham số Mô hình Kinh tế lượng (Causal Inference & Econometric Parameter Estimation - Descriptive & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Phương pháp Ước lượng Mô-men (Method of Moments - MM) giải quyết bài toán nhận diện tham số $\beta$ bằng cách chuyển hóa các giả định lý thuyết của tổng thể thành các điều kiện mô-men thực nghiệm:
    * Giả định 1 (Mean Zero Error): Sai số có kỳ vọng bằng 0:
      $$\mathbb{E}[\varepsilon] = 0$$
    * Giả định 2 (Instrument Orthogonality): Biến công cụ $Z$ trực giao với sai số ngẫu nhiên $\varepsilon$:
      $$\mathbb{E}[Z\varepsilon] = 0 \iff \text{Cov}(Z, \varepsilon) = 0$$
  * Từ mô hình cấu trúc $Y = \beta_0 + \beta_1 X + \varepsilon$, thiết lập điều kiện mô-men mẫu để xác định trực tiếp hệ số hồi quy:
    $$\mathbb{E}[Z(Y - \beta_0 - \beta_1 X)] = 0 \implies \text{Cov}(Z, Y) - \beta_1 \text{Cov}(Z, X) = 0 \implies \beta_1 = \frac{\text{Cov}(Z, Y)}{\text{Cov}(Z, X)} = \frac{\sigma_{YZ}}{\sigma_{XZ}}$$
  * Trường hợp biến công cụ $Z$ là biến nhị phân ($Z \in \{0, 1\}$) và không có biến kiểm soát bổ sung, điều kiện mô-men quy đổi chính xác về **Ước lượng Wald (Wald Estimator)**:
    $$\beta_{1, \text{Wald}} = \frac{\mathbb{E}[Y \mid Z=1] - \mathbb{E}[Y \mid Z=0]}{\mathbb{E}[X \mid Z=1] - \mathbb{E}[X \mid Z=0]} = \frac{\Delta \bar{Y}}{\Delta \bar{X}}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Cung cấp nền tảng toán học nguyên thủy của ước lượng biến công cụ trước khi mở rộng thành 2SLS hoặc GMM. Ước lượng Wald phản ánh trực quan bản chất nhân quả: tỷ số giữa tác động của biến công cụ lên biến kết quả (Reduced-form effect) chia cho tác động của biến công cụ lên biến nội sinh (First-stage effect).
### 2. Phân tích các ví dụ minh họa (Slide 9–12 & Transcript)
* **Nghiên cứu kinh điển của Angrist & Krueger (1991) về Lợi tức Giáo dục (Slide 9–12):**
  * *Biểu diễn logic:* 
    $$\text{Quy định tuổi đi học bắt buộc} \longrightarrow \text{Quý sinh } (Z) \longrightarrow \text{Số năm học } (X) \longrightarrow \text{Thu nhập tương lai } (\log(\text{Wage}))$$
    $$\beta_{1, \text{Wald}} = \frac{\overline{\log(\text{Wage})}_{\text{Q3,Q4}} - \overline{\log(\text{Wage})}_{\text{Q1,Q2}}}{\overline{\text{Education}}_{\text{Q3,Q4}} - \overline{\text{Education}}_{\text{Q1,Q2}}}$$
  * *Cơ chế thực tế:* 
    * Luật giáo dục bắt buộc tại Hoa Kỳ yêu cầu trẻ em nhập học trong năm tròn 6 tuổi và được phép thôi học vào ngày sinh nhật thứ 16. Do đó, những cá nhân sinh vào các quý đầu năm (Q1/Q2, như Bob) đạt độ tuổi 16 sớm hơn trong tiến trình học tập so với những người sinh vào các quý cuối năm (Q3/Q4, như John).
    * Hệ quả cơ học là nhóm muốn bỏ học sinh vào quý 1–2 có thể rời ghế nhà trường sớm hơn và tích lũy ít hơn gần 1 năm học so với nhóm sinh quý 3–4 (Slide 10: First-stage difference).
    * Đồng thời, mức lương trung bình hàng tuần của nhóm sinh quý 1–2 cũng thấp hơn nhóm sinh quý 3–4 (Slide 11: Reduced-form difference).
    * Vì ngày sinh mang tính ngẫu nhiên tự nhiên (độc lập với năng lực bẩm sinh hay hoàn cảnh gia đình), việc sử dụng tỷ số Wald giữa hai chênh lệch này cho phép cô lập chính xác lợi tức kinh tế của việc học thêm một năm mà không bị chệch do biến năng lực tiềm ẩn.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 8, 12)
* **Theo góc nhìn Hiệu ứng Tác động Cục bộ (Local Average Treatment Effect - LATE):**
  * *Mục tiêu:* Xác định đúng đối tượng thụ hưởng và phạm vi suy rộng của chính sách can thiệp.
  * *Hành động can thiệp:* Nhận diện rõ ước lượng Wald chỉ đo lường tác động can thiệp trên nhóm "tuân thủ" (Compliers - những học sinh kéo dài việc học thuần túy vì quy định tuổi bắt buộc), không phản ánh lợi tức giáo dục của nhóm luôn tiếp tục học lên đại học bất kể ngày sinh; tránh khái quát hóa sai lệch khi thiết kế chính sách học bổng hoặc học phí.
* **Theo góc nhìn Kiểm định Tính Hợp lệ của Ràng buộc Loại trừ (Exclusion Restriction):**
  * *Mục tiêu:* Bảo đảm tính vững của ước lượng nhân quả trước các đường truyền dẫn nhiễu.
  * *Hành động can thiệp:* Thẩm định chặt chẽ giả định $\text{Cov}(Z, \varepsilon) = 0$ bằng việc chứng minh quý sinh không tác động đến thu nhập thông qua bất kỳ kênh nào khác ngoài số năm giáo dục (ví dụ: loại trừ các tác động sinh học theo mùa, đặc điểm kinh tế - xã hội của gia đình khi chọn tháng sinh).
* **Theo góc nhìn Lựa chọn Công cụ và Mở rộng Mô hình (Methodology Selection):**
  * *Mục tiêu:* Tối ưu hóa giữa tính trực quan và hiệu quả thống kê khi xử lý dữ liệu phức tạp.
  * *Hành động can thiệp:* Áp dụng ước lượng Wald khi biến công cụ là biến giả nhị phân đơn lẻ để kiểm tra nhanh tỷ số can thiệp; khi mô hình bổ sung nhiều biến kiểm soát ngoại sinh (Covariates) hoặc có nhiều biến công cụ đồng thời (Over-identification), chuyển đổi sang phương pháp Bình phương Tối thiểu Hai giai đoạn (2SLS) hoặc Mô hình Phương trình Cấu trúc (SEM) để thu được ước lượng hiệu quả nhất.
## Ước Lượng Bình Phương Tối Thiểu Hai Giai Đoạn (2SLS): Cơ Chế, Sai Số Chuẩn và Năng Lực Thống Kê (Two-Stage Least Squares Estimation: Mechanism, Standard Errors & Statistical Power)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–3, 6–8 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả & Ước lượng Tham số Kinh tế lượng (Causal Inference & Econometric Parameter Estimation - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Khi biến giải thích $X$ bị nội sinh ($\text{Cov}(X, \varepsilon) \ne 0$), phương pháp Ước lượng Bình phương Tối thiểu Hai giai đoạn (Two-Stage Least Squares - 2SLS) sử dụng biến công cụ ngoại sinh $Z$ thỏa mãn hai điều kiện: Tính liên quan ($\text{Cov}(Z, X) \ne 0$) và Tính ngoại sinh ($\text{Cov}(Z, \varepsilon) = 0$).
  * Quy trình ước lượng chuẩn:
    $$\text{Giai đoạn 1 (First Stage): } X_i = \pi_0 + \pi_1 Z_i + v_i \implies \hat{X}_i = \hat{\pi}_0 + \hat{\pi}_1 Z_i$$
    $$\text{Giai đoạn 2 (Second Stage): } Y_i = \beta_0 + \beta_1 \hat{X}_i + \varepsilon_i$$
  * Vấn đề sai lệch khi ước lượng thủ công (Manual 2SLS Bias): Nếu tự chạy hai lần OLS tuần tự bằng lệnh thông thường, hệ số hồi quy $\hat{\beta}_1$ vẫn nhất quán nhưng sai số chuẩn ($\text{SE}$) sẽ bị tính sai hoàn toàn:
    $$\text{Phần dư hồi quy thủ công: } \eta_i = Y_i - \hat{\beta}_0 - \hat{\beta}_1 \hat{X}_i = \varepsilon_i + \hat{\beta}_1 (X_i - \hat{X}_i) = \varepsilon_i + \hat{\beta}_1 \hat{v}_i \ne \varepsilon_i$$
    * Phần mềm OLS thông thường sử dụng $\eta_i$ để tính phương sai sai số $\hat{\sigma}_\eta^2$, trong khi công thức chuẩn đòi hỏi phải dùng phần dư của mô hình gốc $\varepsilon_i = Y_i - \hat{\beta}_0 - \hat{\beta}_1 X_i$.
  * Công thức sai số chuẩn của ước lượng IV/2SLS:
    $$\text{SE}(\hat{\beta}_{1, \text{IV}}) = \frac{\hat{\sigma}_\varepsilon}{\sqrt{N \cdot \text{Var}(X) \cdot r_{XZ}^2}} = \frac{\text{SE}(\hat{\beta}_{1, \text{OLS}})}{\sqrt{r_{XZ}^2}}$$
    * Trong đó: $r_{XZ}^2$ là bình phương hệ số tương quan giữa biến nội sinh $X$ và biến công cụ $Z$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Sự đánh đổi kinh điển giữa **Độ chệch (Bias)** và **Hiệu quả thống kê (Efficiency)**: OLS bị chệch nhưng có phương sai nhỏ nhất (BLUE), trong khi 2SLS nhất quán (khử sạch độ chệch) nhưng luôn có sai số chuẩn lớn hơn OLS do $0 < r_{XZ}^2 < 1$.
  * Tác động trực tiếp lên **Năng lực Thống kê (Statistical Power)**: Do sai số chuẩn tăng cao, giá trị kiểm định $t = \hat{\beta}/\text{SE}(\hat{\beta})$ giảm xuống, khiến năng lực thống kê của 2SLS luôn thấp hơn OLS trong cùng điều kiện cỡ mẫu.
### 2. Phân tích các ví dụ minh họa (Slide 4–7 & Transcript)
* **Mô hình Dự đoán Hành vi Bầu cử qua Học vấn và Khoảng cách (Slide 4, 5):**
  * *Biểu diễn logic:* 
    $$\text{Khoảng cách từ nhà đến trường ĐH } (Z) \xrightarrow{\text{Chi phí / Tiếp cận}} \text{Tình trạng học ĐH } (X) \xrightarrow{\text{Ý thức công dân}} \text{Đăng ký bầu cử } (Y)$$
  * *Cơ chế thực tế:* Tình trạng học đại học ($X$) có tương quan với các yếu tố năng lực, nền tảng gia đình chưa quan sát được (nằm trong $\varepsilon$), dẫn đến ước lượng OLS về tỷ lệ bầu cử ($Y$) bị chệch. Khoảng cách địa lý ($Z$) đóng vai trò biến công cụ vì nó làm giảm xác suất đi học đại học do rào cản chi phí đi lại, nhưng không tác động trực tiếp đến ý thức đăng ký tham gia bầu cử của một cá nhân ở tuổi trưởng thành.
* **Sai lệch phần dư trong Hồi quy Hai giai đoạn Thủ công (Slide 6, 7):**
  * *Biểu diễn logic:* 
    $$\text{Mô hình gốc: } Y_i = \beta_0 + \beta_1 X_i + \varepsilon_i \implies \text{Phần dư chuẩn cần tính: } \varepsilon_i = Y_i - \beta_0 - \beta_1 X_i$$
    $$\text{Mô hình thủ công GĐ2: } Y_i = \beta_0 + \beta_1 \hat{X}_i + \eta_i \implies \eta_i = \varepsilon_i + \beta_1 \hat{v}_i$$
  * *Cơ chế thực tế:* Phần dư $\eta_i$ trong hồi quy thủ công giai đoạn 2 bị cộng dồn thêm phần dư dự báo của giai đoạn 1 ($\hat{v}_i$). Do đó, nếu lấy $\eta_i$ để tính độ lệch chuẩn $\sigma(\eta)$ nhằm gán vào công thức tính sai số chuẩn của $\hat{\beta}_1$, kết quả sẽ bị bóp méo, làm sai lệch giá trị thống kê $t$, trị số $p$-value và các kết luận kiểm định giả thuyết khoa học.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 8–10 & Transcript)
* **Theo góc nhìn Thực thi Phần mềm Thống kê (Software Implementation Practice):**
  * *Mục tiêu:* Đảm bảo tính toán chính xác sai số chuẩn và khoảng tin cậy cho hệ số can thiệp nhân quả.
  * *Hành động can thiệp:* Tuyệt đối không tự ý thực hiện hai lệnh OLS rời rạc (`regress` thủ công). Bắt buộc phải sử dụng các module tích hợp chuyên dụng (như `ivregress 2sls` trong Stata hoặc hàm `ivreg` trong R) để phần mềm tự động thu hồi phần dư thực nghiệm $\hat{\varepsilon}_i = Y_i - \hat{\beta}_0 - \hat{\beta}_1 X_i$ và xuất ra ma trận hiệp phương sai đúng chuẩn.
* **Theo góc nhìn Đánh đổi Hiệu quả & Rủi ro Biến Công cụ Yếu (Weak Instrument Risk):**
  * *Mục tiêu:* Tránh tình trạng sai số chuẩn bùng nổ làm vô hiệu hóa khả năng ước lượng mô hình.
  * *Hành động can thiệp:* Khi tương quan giữa $X$ và $Z$ yếu ($r_{XZ}^2 \to 0$), đại lượng $\sqrt{r_{XZ}^2}$ ở mẫu số sẽ kéo $\text{SE}(\hat{\beta}_{\text{IV}})$ tăng vọt tới vô cùng. Do đó, cần luôn kiểm tra chỉ số thống kê $F$ ở Giai đoạn 1 (áp dụng tiêu chuẩn $F > 10$) để đảm bảo công cụ đủ mạnh trước khi chấp nhận sự đánh đổi về mặt hiệu quả so với OLS.
* **Theo góc nhìn Thiết kế Khảo sát & Kế hoạch Cỡ mẫu (Power Analysis & Sample Sizing):**
  * *Mục tiêu:* Đảm bảo nghiên cứu có đủ năng lực thống kê để phát hiện hiệu ứng tác động thực tế của chính sách.
  * *Hành động can thiệp:* Do ước lượng 2SLS có phương sai lớn hơn OLS ($\text{Lower Power}$), khi xây dựng kế hoạch thu thập dữ liệu dự kiến áp dụng phương pháp biến công cụ, nhà nghiên cứu cần chủ động mở rộng quy mô mẫu điều tra $N$ tương ứng với tỷ lệ $1/r_{XZ}^2$ nhằm bù đắp lượng thông tin suy giảm và đảm bảo độ nhạy kiểm định.
## Thực Hành Ước Lượng Biến Công Cụ (IV/2SLS) Trên Stata: Nghiên Cứu Angrist & Krueger (1991)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7)
* **Phân loại nhiệm vụ:** **Thực hành Kinh tế lượng Ứng dụng & Ước lượng Suy luận Nhân quả (Applied Econometrics & Causal Inference - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Tái hiện quy trình phân tích thực nghiệm kinh điển của Angrist & Krueger (1991) về tỷ suất sinh lời của giáo dục trên tệp dữ liệu điều tra dân số `NEW7080.dta`. (→ [Economics of Education](/blog/economics-of-education/))
  * Cấu trúc biến nghiên cứu cốt lõi:
    * Biến kết quả phụ thuộc ($Y$): `LWKLYWGE` (logarit tự nhiên của tiền lương tuần - log weekly wage).
    * Biến giải thích nội sinh ($X$): `EDUC` (số năm đi học tích lũy - years of education).
    * Biến công cụ ngoại sinh ($Z$): `QTR1` (biến giả nhận giá trị 1 nếu sinh vào quý 1 và 0 nếu sinh vào các quý còn lại).
  * Kiểm tra tiền đề thực nghiệm qua kiểm định trung bình hai mẫu và OLS cơ sở:
    1. Kiểm tra tính liên quan ngoại sinh lên kết quả ($Z \rightarrow Y$): `ttest LWKLYWGE, by(QTR1)`.
    2. Kiểm tra tính liên quan giai đoạn 1 ($Z \rightarrow X$): `ttest EDUC, by(QTR1)`.
    3. Ước lượng tương quan trực tiếp ($X \rightarrow Y$): `reg LWKLYWGE EDUC`.
  * Cú pháp lệnh Stata 2SLS chuẩn tắc:
    $$\text{ivregress 2sls } Y \quad [\mathbf{W}] \quad (X = Z) \quad [,\; \text{options}]$$
    * Giai đoạn 1 (First Stage): Hồi quy biến nội sinh theo biến công cụ và các biến kiểm soát ngoại sinh:
      $$X_i = \pi_0 + \pi_1 Z_i + \mathbf{W}_i' \boldsymbol{\gamma} + v_i \implies \hat{X}_i$$
    * Giai đoạn 2 (Second Stage): Hồi quy biến kết quả theo giá trị dự phóng từ giai đoạn 1 cùng các biến kiểm soát:
      $$Y_i = \beta_0 + \beta_1 \hat{X}_i + \mathbf{W}_i' \boldsymbol{\delta} + \varepsilon_i$$
  * Giả định bắt buộc về phần dư cầu (Spherical Perturbation Term):
    * Phương sai không đổi (Homoskedasticity): $\text{Var}(\varepsilon_i \mid X_i, Z_i, \mathbf{W}_i) = \sigma^2$ không đổi với mọi quan sát.
    * Không tự tương quan (No Autocorrelation): $\text{Cov}(\varepsilon_i, \varepsilon_j) = 0 \quad (\forall i \ne j)$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Cơ chế nhận diện danh sách biến công cụ ở dòng xuất kết quả (*Instruments list*): Trong hồi quy 2SLS có biến kiểm soát ngoại sinh $\mathbf{W}$, bản thân các biến kiểm soát $\mathbf{W}$ đóng vai trò là biến công cụ cho chính chúng ở Giai đoạn 1. Vì vậy, danh sách công cụ thực tế của mô hình luôn bao gồm cả biến công cụ loại trừ $Z$ lẫn toàn bộ vector biến kiểm soát ngoại sinh $\mathbf{W}$ ($[\text{Instruments: } Z \quad \mathbf{W}]$).
### 2. Phân tích các ví dụ minh họa (Slide 2–7)
* **Chuẩn bị và tiền xử lý dữ liệu thực nghiệm (Slide 2–5):**
  * *Biểu diễn logic:* 
    $$\text{NEW7080.dta} \xrightarrow{\text{Lines 13–124}} \begin{bmatrix} \text{Sàng lọc mẫu (Sample screening)} \\ \text{Xử lý khuyết thiếu (Missing values)} \\ \text{Tạo biến \& Mã hóa (Gen \& Recode)} \end{bmatrix} \xrightarrow{} \{\text{LWKLYWGE}, \text{EDUC}, \text{QTR1}, \mathbf{W}\}$$
  * *Cơ chế thực tế:* Dữ liệu gốc từ Tổng điều tra Dân số chứa nhiều nhóm đối tượng không nằm trong lực lượng lao động hoạt động hoặc ngoài khung tuổi chịu tác động của luật giáo dục bắt buộc. Đoạn mã dòng 13–124 làm sạch dữ liệu, tạo biến giả sinh quý 1 (`QTR1`), chuẩn hóa biến log lương tuần (`LWKLYWGE`) nhằm đảm bảo mẫu nghiên cứu phản ánh đúng quần thể mục tiêu trước khi chạy hồi quy.
* **So sánh các mô hình OLS với bộ biến kiểm soát tăng dần (Slide 5, Table 5 của bài báo):**
  * *Biểu diễn logic:* 
    $$\text{Model OLS 1 (Gốc): } \text{reg } Y \; X \implies \hat{\beta}_{\text{EDUC}} \approx 0.07 \dots 0.08, \; R^2 \text{ thấp}$$
    $$\text{Model OLS 2, 3 (Thêm Covariates): } \text{reg } Y \; X \; \mathbf{W}_{\text{age}} \; \mathbf{W}_{\text{race}} \; \mathbf{W}_{\text{region}} \implies \hat{\beta}_{\text{EDUC}} \text{ thay đổi}, \; R^2 \uparrow$$
  * *Cơ chế thực tế:* Các biến kiểm soát ngoại sinh như độ tuổi/năm sinh phản ánh kinh nghiệm làm việc; chủng tộc và khu vực địa lý kiểm soát chênh lệch cấu trúc thị trường lao động. Khi bổ sung các biến kiểm soát này, mô hình bóc tách được các yếu tố gây nhiễu ảnh hưởng đồng thời đến thu nhập, giúp quan sát sự dịch chuyển của hệ số $\hat{\beta}_{\text{EDUC}}$ và sự gia tăng của hệ số xác định $R^2$.
* **Ước lượng 2SLS và So sánh Sai số Chuẩn (Slide 6, 7):**
  * *Biểu diễn logic:* 
    $$\text{ivregress 2sls LWKLYWGE (EDUC = QTR1)} \implies \hat{\beta}_{\text{2SLS}} \ge \hat{\beta}_{\text{OLS}}, \quad \text{SE}(\hat{\beta}_{\text{2SLS}}) > \text{SE}(\hat{\beta}_{\text{OLS}})$$
  * *Cơ chế thực tế:* Khi chạy lệnh dòng 140–146, tác động của số năm học lên tiền lương vẫn duy trì ý nghĩa thống kê. Tuy nhiên, sai số chuẩn $\text{SE}(\hat{\beta}_{\text{2SLS}})$ luôn lớn hơn $\text{SE}(\hat{\beta}_{\text{OLS}})$ do biến công cụ chỉ khai thác một phần biến thiên ngoại sinh của `EDUC` ($r_{XZ}^2 < 1$), minh chứng rõ nét cho sự đánh đổi giữa việc loại bỏ độ chệch nội sinh và sụt giảm độ chính xác thống kê.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–7)
* **Theo góc nhìn Chẩn đoán Tiền Thực nghiệm (Pre-estimation Verification):**
  * *Mục tiêu:* Kiểm tra tính liên quan và tính trực giao của biến công cụ trước khi tiến hành ước lượng mô hình cấu trúc.
  * *Hành động can thiệp:* Bắt buộc chạy kiểm định trung bình `ttest` giữa biến công cụ và các biến cốt lõi (`LWKLYWGE`, `EDUC`). Nếu chênh lệch số năm học giữa nhóm sinh quý 1 và các quý còn lại đạt ý nghĩa thống kê cao ($p < 0.05$), điều kiện về tính liên quan của công cụ mới đủ cơ sở vững chắc để tiếp tục bước ước lượng 2SLS.
* **Theo góc nhìn Thiết kế Mô hình & Kiểm soát Nhiễu (Model Specification & Covariate Control):**
  * *Mục tiêu:* Tránh hiện tượng sai lệch ước lượng do đưa nhầm các biến nội sinh hoặc biến trung gian vào danh sách biến kiểm soát.
  * *Hành động can thiệp:* Phân định rạch ròi giữa các biến kiểm soát ngoại sinh tiền định (năm sinh, chủng tộc, khu vực sinh trưởng) với các biến hệ quả sau giáo dục; đưa toàn bộ biến kiểm soát ngoại sinh vào danh sách biến công cụ bổ trợ ở giai đoạn 1 để đảm bảo tính nhận diện mô hình.
* **Theo góc nhìn Diễn giải Kết quả Thực nghiệm & Hoạch định Chính sách (Empirical Interpretation):**
  * *Mục tiêu:* Đánh giá đúng bản chất của hệ số can thiệp phục vụ phân tích chi phí - lợi ích giáo dục.
  * *Hành động can thiệp:* Trình bày song song bảng kết quả OLS và 2SLS để minh chứng sự tồn tại của độ chệch do biến bị bỏ sót; diễn giải hệ số 2SLS theo góc nhìn Hiệu ứng Tác động Cục bộ (LATE) — đại diện cho lợi tức giáo dục của nhóm học sinh có xu hướng bỏ học sớm nếu không bị ràng buộc bởi luật giáo dục bắt buộc, thay vì suy rộng tùy tiện cho toàn bộ lực lượng lao động.
## Kiểm Định Giả Thuyết Biến Công Cụ, Thách Thức Ngoại Sinh & ATE vs. LATE (Hypothesis Testing of IV, Threats to Validity & LATE)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–5, 10 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả & Thẩm định Giả thuyết Nhận diện Mô hình (Causal Inference & Identification Diagnostics - Inferential & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Hai giả thuyết tiên đề bắt buộc để biến công cụ $Z$ có giá trị nhận diện tham số nhân quả:
    1. *Tính liên quan của công cụ (Instrument Relevance):* Biến công cụ $Z$ và biến nội sinh $X$ phải cùng biến thiên có ý nghĩa:
       $$\text{Cov}(Z, X) \ne 0$$
       Điều kiện này kiểm tra xem $Z$ có giải thích được một phần biến thiên đáng kể của $X$ hay không (được kiểm định trực tiếp qua thống kê $F$ ở hồi quy giai đoạn 1).
    2. *Tính ngoại sinh & Ràng buộc loại trừ (Exogeneity & Exclusion Restriction):* Biến công cụ $Z$ hoàn toàn trực giao với sai số $\varepsilon$ và chỉ tác động đến biến kết quả $Y$ duy nhất thông qua biến nội sinh $X$:
       $$\text{Cov}(Z, \varepsilon) = 0 \quad \text{và} \quad Z \longrightarrow X \longrightarrow Y \quad (\text{Đường truyền trực tiếp } Z \rightarrow Y \text{ không tồn tại})$$
  * Phân biệt hai loại hiệu ứng tác động trong suy luận nhân quả:
    * *Hiệu ứng can thiệp trung bình toàn thể (Average Treatment Effect - ATE):* Tác động can thiệp trung bình kỳ vọng trên toàn bộ quần thể nghiên cứu:
      $$\text{ATE} = \mathbb{E}[Y(1) - Y(0)]$$
    * *Hiệu ứng can thiệp cục bộ (Local Average Treatment Effect - LATE):* Tác động can thiệp chỉ tính riêng trên nhóm "tuân thủ" (Compliers) — tức phân khúc đối tượng thay đổi hành vi $X$ do cú sốc ngoại sinh từ biến công cụ $Z$:
      $$\text{LATE} = \mathbb{E}[Y(1) - Y(0) \mid \text{Compliers}]$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Giả thuyết 1 ($\text{Cov}(Z, X) \ne 0$) hoàn toàn có thể kiểm định định lượng trực tiếp từ dữ liệu mẫu. Ngược lại, giả thuyết 2 ($\text{Cov}(Z, \varepsilon) = 0$) **không thể kiểm định trực tiếp** bằng thống kê trong mô hình vừa đủ nhận diện (just-identified), mà bắt buộc phải biện luận dựa trên lý thuyết kinh tế hoặc các kiểm định giả định gián tiếp (falsification/placebo tests).
  * Mô hình IV không ước lượng ATE cho toàn dân số mà chỉ cô lập và ước lượng LATE trên vùng biến thiên cục bộ do công cụ kích hoạt.
### 2. Phân tích các ví dụ minh họa (Slide 6–9 & Transcript)
* **Thẩm định Ràng buộc Loại trừ trong Nghiên cứu Angrist & Krueger (1991) (Slide 6–8):**
  * *Biểu diễn logic:* 
    $$\text{Đường truyền chính: } \text{Quý sinh } (Z) \xrightarrow{\text{Luật giáo dục 16 tuổi}} \text{Số năm học } (X) \longrightarrow \text{Tiền lương tương lai } (Y)$$
    $$\text{Kiểm định giả dược (Placebo): } \text{Quý sinh } (Z) \xrightarrow{\text{Nhóm tốt nghiệp Đại học}} \text{Tiền lương } (Y) \implies \text{Hệ số } \beta \approx 0 \ (\text{Không tương quan})$$
  * *Cơ chế thực tế:* 
    * Mối đe dọa (Threat) lớn nhất: Quý sinh có thể tương quan với các đặc tính năng lực bẩm sinh chưa quan sát được của cá nhân (Ability nằm trong $\varepsilon$).
    * Phản biện/Thử nghiệm đối chứng (Response): Các tác giả kiểm tra mối liên hệ giữa quý sinh và thu nhập trên nhóm cử nhân đại học (College graduates). Do nhóm này học đại học tự nguyện và không chịu sự ràng buộc của ngưỡng tuổi thôi học 16 tuổi, quý sinh không tác động đến số năm học của họ. Kết quả thực nghiệm cho thấy quý sinh không liên quan đến tiền lương của nhóm cử nhân đại học, gián tiếp chứng minh quý sinh không tự mang lại lợi thế thu nhập ngoài luồng học vấn và bảo vệ giả định ràng buộc loại trừ.
* **Phản biện của Bound, Jaeger & Baker (1995) về Vi phạm Ngoại sinh & Công cụ Yếu (Slide 9):**
  * *Biểu diễn logic:* 
    $$\text{Kênh sinh học / Sức khỏe: } Z \longrightarrow \text{Thể chất \& sức khỏe tâm thần} \longrightarrow Y$$
    $$\text{Kênh kinh tế gia đình: } Z \longrightarrow \text{Tỷ lệ hộ giàu sinh con mùa đông thấp hơn} \longrightarrow Y$$
    $$\text{Hệ quả kết hợp: } \begin{cases} \text{Cov}(Z, \varepsilon) \ne 0 \ (\text{Ngoại sinh bị vi phạm}) \\ \text{Cov}(Z, X) \approx 0 \ (\text{Công cụ yếu}) \end{cases} \implies \text{Độ chệch IV bị thổi phồng nghiêm trọng}$$
  * *Cơ chế thực tế:* Các tác giả chỉ ra rằng quý sinh có thể vi phạm điều kiện ngoại sinh do tương quan với điều kiện thời tiết, sức khỏe thai kỳ và tập quán sinh nở theo tầng lớp kinh tế - xã hội. Khi biến công cụ chỉ có tương quan rất yếu với biến nội sinh, ngay cả một vi phạm rất nhỏ của giả thuyết ngoại sinh cũng bị chia cho mẫu số gần bằng 0 trong công thức tỷ số IV, làm cho ước lượng IV bị chệch nặng nề hơn cả ước lượng OLS thông thường.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 4, 5, 8–10 & Transcript)
* **Theo góc nhìn Thiết kế Kiểm định & Thẩm định Tính Hợp lệ (Diagnostic & Falsification Testing):**
  * *Mục tiêu:* Thiết lập bằng chứng vững chắc bảo vệ tính ngoại sinh của biến công cụ trước các phản biện học thuật và kiểm toán chính sách.
  * *Hành động can thiệp:* Áp dụng kiểm định giả dược (Placebo/Falsification test) trên nhóm dân số phụ không bị tác động bởi cơ chế can thiệp; luôn báo cáo thống kê $F$ ở Giai đoạn 1 ($F > 10$ theo quy tắc thực nghiệm hoặc so sánh với giá trị tới hạn Stock-Yogo) để sàng lọc và loại bỏ rủi ro công cụ yếu.
* **Theo góc nhìn Diễn giải Chính sách & Phân định Phạm vi Can thiệp (Policy Generalization - ATE vs. LATE):**
  * *Mục tiêu:* Tránh ngộ nhận về quy mô tác động thực tế của can thiệp khi mở rộng quy mô chương trình công.
  * *Hành động can thiệp:* Làm rõ trong báo cáo chính sách rằng ước lượng IV chỉ đại diện cho hiệu ứng cục bộ (LATE) trên nhóm cận biên (Compliers - nhóm bị ép buộc kéo dài việc học do quy định pháp lý); tuyệt đối không khái quát hóa kết quả này thành tác động phổ quát (ATE) cho toàn bộ lực lượng lao động khi xây dựng các chính sách cải cách giáo dục tổng thể.
* **Theo góc nhìn Quản trị Rủi ro Mô hình hóa & Đánh đổi Phương pháp (Methodological Risk Management):**
  * *Mục tiêu:* Ngăn ngừa sai lệch suy luận khi biến công cụ tiềm ẩn nguy cơ yếu hoặc nhiễu ngoại sinh nhẹ.
  * *Hành động can thiệp:* Khi nghi ngờ công cụ yếu hoặc có mối liên hệ gián tiếp nhỏ với sai số, chủ động bổ sung các phương pháp ước lượng vững như LIML (Limited Information Maximum Likelihood) thay vì chỉ dựa vào 2SLS; đồng thời so sánh thận trọng giữa kết quả OLS và IV để đánh giá chiều hướng và biên độ chệch thực tế.
## Các Thảo Luận Mở Rộng Về Biến Công Cụ: Biến Công Cụ Yếu, Kiểm Định Hausman và Đa Biến Kiểm Soát (Extended Discussion of IV Settings: Weak IV, Hausman Test & Multiple Covariates)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–10 & Transcript P1–P10)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Nâng cao & Thẩm định Khuyết tật Mô hình (Advanced Causal Inference & Econometric Model Diagnostics - Inferential & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Ba vấn đề mở rộng then chốt khi triển khai phương pháp biến công cụ (IV/2SLS):
    1. *Vấn đề Biến công cụ yếu (Weak Instruments):* Xuất hiện khi biến công cụ $Z$ có mối tương quan lỏng lẻo với biến giải thích nội sinh $X$ khiến hiệp phương sai mẫu tiến sát về 0 ($\sigma_{XZ} \approx 0$). Khi đó:
       $$\hat{\beta}_{1, \text{IV}} = \frac{\sigma_{YZ}}{\sigma_{XZ}} - \frac{\sigma_{\varepsilon Z}}{\sigma_{XZ}}$$
       Nếu $\sigma_{XZ} \to 0$, ngay cả một vi phạm cực nhỏ của giả định ngoại sinh ($\sigma_{\varepsilon Z} \ne 0$) cũng bị khuếch đại nghiêm trọng qua tỷ số $\frac{\sigma_{\varepsilon Z}}{\sigma_{XZ}}$, dẫn đến độ chệch lớn và phương sai ước lượng bùng nổ.
       Tiêu chuẩn kiểm tra: Dùng kiểm định $F$ cho biến công cụ ở phương trình giai đoạn 1 (First-stage $F$-test):
       $$F = \frac{(\text{SSR}_{\text{restricted}} - \text{SSR}_{\text{unrestricted}}) / q}{\text{SSR}_{\text{unrestricted}} / (n - k - 1)}$$
       Quy tắc thực nghiệm kinh điển (Rule of thumb): $F > 10$ xác nhận biến công cụ đủ mạnh để đảm bảo tính vững của ước lượng.
    2. *Kiểm định Tính nội sinh Hausman (Hausman Endogeneity Test):* Đánh giá xem biến giải thích $X_1$ có thực sự nội sinh hay không bằng cách so sánh trực tiếp khoảng cách giữa ước lượng OLS ($\hat{\beta}_{\text{OLS}}$) và ước lượng IV ($\hat{\beta}_{\text{IV}}$):
       $$H_0: \hat{\beta}_{\text{IV}} - \hat{\beta}_{\text{OLS}} = 0 \quad (X_1 \text{ là biến ngoại sinh, OLS không chệch và hiệu quả hơn})$$
       $$H_1: \hat{\beta}_{\text{IV}} - \hat{\beta}_{\text{OLS}} \ne 0 \quad (X_1 \text{ là biến nội sinh, OLS bị chệch, bắt buộc dùng IV})$$
       Thống kê kiểm định tuân theo phân phối Chi bình phương tiệm cận:
       $$H = (\hat{\boldsymbol{\beta}}_{\text{IV}} - \hat{\boldsymbol{\beta}}_{\text{OLS}})' \left[ \widehat{\text{Var}}(\hat{\boldsymbol{\beta}}_{\text{IV}}) - \widehat{\text{Var}}(\hat{\boldsymbol{\beta}}_{\text{OLS}}) \right]^{-1} (\hat{\boldsymbol{\beta}}_{\text{IV}} - \hat{\boldsymbol{\beta}}_{\text{OLS}}) \sim \chi^2(df)$$
    3. *Nguyên tắc Đưa Đa biến kiểm soát vào Mô hình 2SLS (Multiple Covariates in 2SLS):* Trong hồi quy có các biến kiểm soát ngoại sinh ($X_2, X_3$), toàn bộ các biến kiểm soát này **bắt buộc phải xuất hiện trong phương trình hồi quy giai đoạn 1**:
       $$X_{1i} = \pi_0 + \pi_1 Z_i + \pi_2 X_{2i} + \pi_3 X_{3i} + v_i$$
       Nếu bỏ sót $X_2, X_3$ ở giai đoạn 1, phần dự phóng $\hat{X}_1$ sẽ gom cả biến thiên của các biến này, làm cho các biến ngoại sinh vốn có trở thành biến nội sinh trong giai đoạn 2.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Cung cấp bộ công cụ kiểm toán toán học định lượng để bảo vệ mô hình: không sử dụng biến công cụ một cách cảm tính mà phải kiểm tra độ mạnh qua $F > 10$, kiểm định tính cần thiết của IV qua kiểm định Hausman, và bảo đảm tính trực giao của toàn hệ thống phương trình thông qua quy tắc cấu trúc giai đoạn 1.
### 2. Phân tích các ví dụ minh họa (Slide 2–10 & Transcript P2–P10)
* **Khuếch đại Sai số và Tiêu chuẩn Lực công cụ (Slide 2–4):**
  * *Biểu diễn logic:* 
    $$\sigma_{XZ} \to 0 \implies \frac{\sigma_{\varepsilon Z}}{\sigma_{XZ}} \gg 0 \implies \text{Bias}(\hat{\beta}_{\text{IV}}) \gg \text{Bias}(\hat{\beta}_{\text{OLS}})$$
    $$p\text{-value}(\pi_1) > 0.05 \ \lor \ F \le 10 \implies \text{Biến công cụ yếu (Weak IV)}$$
  * *Cơ chế thực tế:* Khi $\sigma_{XZ}$ có độ lớn rất nhỏ (ví dụ bậc $10^{-5}$), mẫu số bị thu hẹp cực độ. Nếu tồn tại tương quan dù là vi mô giữa công cụ và sai số ngẫu nhiên ($\sigma_{\varepsilon Z} \ne 0$), ước lượng IV sẽ bị chệch nặng nề hơn cả OLS ban đầu. Do đó, việc kiểm tra mức ý nghĩa thống kê của hệ số công cụ ($p < 0.05$) và chỉ số $F > 10$ ở giai đoạn 1 là điều kiện tiên quyết trước khi diễn giải kết quả.
* **Quy trình Kiểm định Hausman Phân biệt Bản chất Biến (Slide 6, 7):**
  * *Biểu diễn logic:* 
    $$\text{Độ lệch } (\hat{\beta}_{\text{IV}} - \hat{\beta}_{\text{OLS}}) \xrightarrow{\text{Kiểm định } \chi^2} \begin{cases} p < 0.05 \implies \text{Bác bỏ } H_0 \implies X_1 \text{ nội sinh} \rightarrow \text{Ưu tiên 2SLS} \\ p \ge 0.05 \implies \text{Chưa đủ cơ sở bác bỏ } H_0 \implies X_1 \text{ ngoại sinh} \rightarrow \text{Dùng OLS} \end{cases}$$
  * *Cơ chế thực tế:* Vì ước lượng IV luôn nhất quán dưới cả hai giả thuyết, còn OLS chỉ nhất quán khi $H_0$ đúng. Nếu $X_1$ thực chất là biến ngoại sinh, sai khác giữa hai ước lượng chỉ là biến động lấy mẫu ngẫu nhiên; khi đó giữ lại OLS sẽ tối ưu hơn vì phương sai OLS nhỏ hơn. Ngược lại, nếu khoảng cách vượt ngưỡng tới hạn của phân phối $\chi^2$, sự khác biệt này phản ánh độ chệch nghiêm trọng của OLS do nội sinh gây ra.
* **Cơ chế Lan truyền Nội sinh qua Biểu đồ Venn Đa Biến Kiểm soát (Slide 8–10):**
  * *Biểu diễn logic:* 
    $$X_1 \text{ tương quan với } \{X_2, X_3\} \xrightarrow{\text{Bỏ } X_2, X_3 \text{ khỏi Giai đoạn 1}} \hat{X}_1 \text{ mang thông tin của } \{X_2, X_3\} \rightarrow X_2, X_3 \text{ bị nội sinh hóa ở GĐ2}$$
  * *Cơ chế thực tế:* Biểu đồ Venn (Murnane & Willett, 2010) thể hiện vùng biến thiên giao thoa giữa sai số $\varepsilon$, biến nội sinh $X_1$, kết quả $Y$, và các biến kiểm soát $X_2, X_3$. Nếu không đưa $X_2, X_3$ vào phương trình giai đoạn 1, phần biến thiên chung giữa $X_1$ với $X_2$ và $X_3$ sẽ bị đẩy vào phần dư của giai đoạn 1 hoặc bị tích hợp sai lệch vào $\hat{X}_1$. Hậu quả là trong giai đoạn 2, các biến kiểm soát $X_2, X_3$ bị tương quan ngược với phần dư, làm mất tính ngoại sinh ban đầu của chúng.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–10 & Transcript P2–P10)
* **Theo góc nhìn Chẩn đoán Kỹ thuật & Kiểm soát Rủi ro Ước lượng (Econometric Diagnostics):**
  * *Mục tiêu:* Ngăn ngừa rủi ro sai lệch nghiêm trọng do sử dụng biến công cụ yếu hoặc áp dụng phương pháp phức tạp không cần thiết.
  * *Hành động can thiệp:* Bắt buộc xuất kết quả kiểm định $F$ của phương trình giai đoạn 1; nếu $F \le 10$, phải tìm kiếm công cụ mạnh hơn hoặc áp dụng các phương pháp thay thế ít nhạy cảm với công cụ yếu như LIML (Limited Information Maximum Likelihood). Đồng thời, thực hiện kiểm định Hausman để xác nhận tính nội sinh trước khi quyết định đánh đổi độ chính xác của OLS lấy tính nhất quán của 2SLS.
* **Theo góc nhìn Thiết lập Cấu trúc Mô hình Thực nghiệm (Model Specification Standards):**
  * *Mục tiêu:* Đảm bảo tính nhất quán toán học và tính hợp lệ của toàn bộ hệ thống phương trình 2SLS.
  * *Hành động can thiệp:* Áp dụng nguyên tắc bao gồm toàn diện: bất kỳ biến kiểm soát ngoại sinh nào được đưa vào phương trình chính (Giai đoạn 2) đều bắt buộc phải được đưa đồng thời vào phương trình công cụ (Giai đoạn 1). Tuyệt đối không tinh giản phương trình giai đoạn 1 bằng cách loại bỏ các biến kiểm soát ngoại sinh.
* **Theo góc nhìn Thẩm định Bằng chứng & Hoạch định Chính sách (Policy Decision Validation):**
  * *Mục tiêu:* Cung cấp căn cứ khoa học minh bạch và đáng tin cậy cho các can thiệp can dự xã hội.
  * *Hành động can thiệp:* Trình bày bảng so sánh đối chiếu giữa OLS và 2SLS kèm theo kết quả kiểm định Hausman và chỉ số $F$ giai đoạn 1; giải trình chi tiết về cơ chế kinh tế đảm bảo tính mạnh và tính ngoại sinh của biến công cụ để bảo vệ giá trị thực tiễn của các khuyến nghị chính sách trước các phản biện độc lập.
## Thiết Lập Đa Biến Công Cụ (Multiple IV Settings), Nâng Cao Hiệu Quả Ước Lượng 2SLS & Kiểm Định Ngoại Sinh Hausman
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript P1–P7)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Nâng cao, Tối ưu hóa Hiệu quả Ước lượng & Thẩm định Tính Hợp lệ của Ràng buộc Nhận diện Vượt mức (Advanced Causal Inference, Multiple IV Optimization & Overidentification Diagnostics - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Điều kiện bậc (Order Condition) cho việc nhận diện hệ số: Với $K$ biến nội sinh và $M$ biến công cụ, phương trình nhận diện được khi $M \ge K$:
    * Vừa đủ nhận diện (Just-identified): $M = K$ (ví dụ: 1 biến nội sinh, 1 biến công cụ).
    * Nhận diện vượt mức (Over-identified): $M > K$ (ví dụ: 1 biến nội sinh, từ 2 biến công cụ ngoại sinh trở lên).
  * Quy trình ước lượng 2SLS với đa biến công cụ ($Z = \{Z_1, Z_2, \dots, Z_M\}$):
    * Giai đoạn 1 (First Stage): Dự phóng biến nội sinh $X$ dựa trên không gian biến thiên tạo bởi tổ hợp tuyến tính tối ưu của tất cả các biến công cụ và biến kiểm soát ngoại sinh $\mathbf{W}$:
      $$X_i = \pi_0 + \sum_{m=1}^{M} \pi_m Z_{mi} + \mathbf{W}_i'\boldsymbol{\gamma} + v_i \implies \hat{X}_i = \hat{\pi}_0 + \sum_{m=1}^{M} \hat{\pi}_m Z_{mi} + \mathbf{W}_i'\hat{\boldsymbol{\gamma}}$$
    * Giai đoạn 2 (Second Stage): Hồi quy biến kết quả $Y$ theo giá trị dự phóng $\hat{X}$ và các biến kiểm soát ngoại sinh:
      $$Y_i = \beta_0 + \beta_1 \hat{X}_i + \mathbf{W}_i'\boldsymbol{\delta} + \varepsilon_i$$
  * Hai lợi ích then chốt của việc bổ sung biến công cụ:
    1. *Tăng hệ số xác định ($R^2$) giai đoạn 1:* Tổ hợp nhiều biến công cụ khai thác được nhiều lát cắt biến thiên ngoại sinh hơn, nâng cao năng lực giải thích cho $X$ và trực tiếp làm suy giảm độ chệch biến công cụ yếu (Weak IV Bias).
    2. *Thu hẹp sai số chuẩn ($\text{SE}$) ở giai đoạn 2:* Giảm phương sai tiệm cận của ước lượng 2SLS, cải thiện độ chuẩn xác và gia tăng năng lực thống kê (statistical power):
       $$\text{SE}(\hat{\beta}_{\text{2SLS}}) \propto \frac{1}{\sqrt{N \cdot \text{Var}(X) \cdot R_{X\vert{}Z,\mathbf{W}}^2}}$$
  * Kiểm định tính ngoại sinh của biến công cụ bổ sung qua Kiểm định Hausman (Hausman Test for Additional IVs):
    * So sánh ước lượng 2SLS dựa trên bộ công cụ đầy đủ ($Z_{\text{full}}$) với ước lượng dựa trên tập con hợp lệ ($Z_{\text{sub}}$):
      $$H_0: \text{Biến công cụ bổ sung là ngoại sinh } (\hat{\beta}_{\text{full}} - \hat{\beta}_{\text{sub}} = 0)$$
      $$H_1: \text{Biến công cụ bổ sung bị nội sinh } (\hat{\beta}_{\text{full}} - \hat{\beta}_{\text{sub}} \ne 0)$$
    * Công thức thống kê kiểm định $H$:
      $$H = (\hat{\boldsymbol{\beta}}_{\text{full}} - \hat{\boldsymbol{\beta}}_{\text{sub}})' \left[ \widehat{\mathbf{V}}_{\text{sub}} - \widehat{\mathbf{V}}_{\text{full}} \right]^{+} (\hat{\boldsymbol{\beta}}_{\text{full}} - \hat{\boldsymbol{\beta}}_{\text{sub}}) \sim \chi^2(q)$$
      Trong đó: $\widehat{\mathbf{V}}_{\text{full}}$ và $\widehat{\mathbf{V}}_{\text{sub}}$ là ma trận hiệp phương sai của $\hat{\boldsymbol{\beta}}_{\text{full}}$ và $\hat{\boldsymbol{\beta}}_{\text{sub}}$, dấu $+$ biểu thị nghịch đảo giả Moore-Penrose, và $q$ là bậc tự do tương ứng với số biến công cụ nhận diện vượt mức.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Trong mô hình đơn công cụ ($M = 1$), tính ngoại sinh $\text{Cov}(Z, \varepsilon) = 0$ là giả định tiên đề không thể kiểm định thống kê trực tiếp. Thiết lập đa biến công cụ ($M > 1$) tạo ra tính thừa nhận diện, mở ra khả năng kiểm định thực nghiệm tính nhất quán và ngoại sinh của các công cụ bổ sung thông qua việc so sánh đối ứng giữa các mô hình ước lượng.
### 2. Phân tích các ví dụ minh họa (Slide 2–7 & Transcript P2–P7)
* **Nghiên cứu của Dee (2004) & Murnane & Willett (2010) - Tác động của Giáo dục lên Tham gia Bầu cử (Slide 2–4):**
  * *Biểu diễn logic:* 
    $$\begin{cases} Z_1: \text{Khoảng cách tới trường CĐ 2 năm gần nhất (DISTANCE)} \\ Z_2: \text{Số lượng trường CĐ 2 năm trong hạt (NUMBER)} \end{cases} \xrightarrow{\text{Giai đoạn 1}} \text{Bằng CĐ/ĐH (COLLEGE)} \xrightarrow{\text{Giai đoạn 2}} \text{Đăng ký bầu cử (REGISTER)}$$
  * *Cơ chế thực tế:* 
    * Bối cảnh nghiên cứu: Đánh giá tác động nhân quả của trình độ học vấn (`COLLEGE`, 1984) lên xác suất đăng ký đi bầu cử (`REGISTER`, 1992), có kiểm soát các biến ngoại sinh về chủng tộc/dân tộc (`race/ethnicity`).
    * Mô hình giai đoạn 1 (First Stage):
      $$\text{COLLEGE}_i = \pi_0 - 0.0057^{**} \text{DISTANCE}_i + 0.0217^{**} \text{NUMBER}_i + \mathbf{W}_i'\boldsymbol{\gamma} + v_i \quad (R^2 = 0.0269)$$
      Cả hai công cụ đều có ý nghĩa thống kê cao ($p < 0.01$): khoảng cách địa lý làm tăng chi phí đi lại khiến xác suất học cao đẳng giảm ($\hat{\pi}_1 = -0.0057, \text{SE} = 0.0006$), trong khi mật độ trường trong khu vực mở rộng cơ hội tiếp cận khiến xác suất học tăng lên ($\hat{\pi}_2 = 0.0217, \text{SE} = 0.0031$).
    * Mô hình giai đoạn 2 (Second Stage):
      $$\text{REGISTER}_i = \beta_0 + 0.2776^{**} \widehat{\text{COLLEGE}}_i + \mathbf{W}_i'\boldsymbol{\delta} + \varepsilon_i \quad (\text{SE} = 0.0693, p < 0.01, R^2 = 0.0291)$$
    * So sánh hiệu năng giữa mô hình đơn công cụ và đa công cụ (Slide 4):
      * Nâng cao độ chuẩn xác: Ở giai đoạn 1, $R^2$ tăng $25\%$ (từ $0.0217$ lên $0.0269$). Ở giai đoạn 2, sai số chuẩn hiệu chỉnh của biến `COLLEGE` giảm $14\%$ (từ $0.0806$ xuống $0.0693$).
      * Ước lượng hiệu ứng nhân quả mạnh mẽ hơn: Độ lớn tác động của `COLLEGE` tăng $11.6\%$ (từ $0.249$ lên $0.278$), khẳng định việc hoàn thành chương trình cao đẳng/đại học làm tăng đáng kể hành vi tham gia công dân.
* **Quy trình Kiểm định Ngoại sinh Biến công cụ Bổ sung bằng Hausman Test (Slide 5–7):**
  * *Biểu diễn logic:* 
    $$Z_{\text{full}} = \{Z_{\text{sub}}, Z_{\text{additional}}\} \implies \Delta \hat{\beta} = \hat{\beta}_{\text{full}} - \hat{\beta}_{\text{sub}} \xrightarrow{\text{Kiểm định } H} \begin{cases} H \le \chi^2_{\text{crit}}(q) \implies \text{Chấp nhận } H_0 \rightarrow Z_{\text{additional}} \text{ là ngoại sinh} \\ H > \chi^2_{\text{crit}}(q) \implies \text{Bác bỏ } H_0 \rightarrow Z_{\text{additional}} \text{ bị nội sinh} \end{cases}$$
  * *Cơ chế thực tế:* 
    * Khi bắt đầu với một tập con biến công cụ hợp lệ $Z_{\text{sub}}$ (đủ điều kiện nhận diện tối thiểu), nếu biến công cụ mới bổ sung $Z_{\text{additional}}$ cũng là ngoại sinh thuần túy, cả hai ước lượng $\hat{\beta}_{\text{full}}$ và $\hat{\beta}_{\text{sub}}$ đều hội tụ về tham số thực $\beta$, sai khác giữa chúng chỉ do dao động ngẫu nhiên của mẫu ($H \le \chi^2_{\text{crit}}$).
    * Ngược lại, nếu $Z_{\text{additional}}$ có tương quan với sai số $\varepsilon$, ước lượng $\hat{\beta}_{\text{full}}$ sẽ bị lệch hướng nghiêm trọng so với $\hat{\beta}_{\text{sub}}$, khiến giá trị thống kê $H$ vượt ngưỡng tới hạn của phân phối $\chi^2(q)$ với $q$ bậc tự do. Khi đó, giả thuyết $H_0$ bị bác bỏ, buộc nhà nghiên cứu phải loại bỏ biến công cụ bổ sung này khỏi mô hình.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–7 & Transcript P1–P7)
* **Theo góc nhìn Tối ưu hóa Năng lực Thống kê & Giảm thiểu Rủi ro Biến công cụ Yếu (Weak IV Mitigation):**
  * *Mục tiêu:* Khắc phục triệt để hiện tượng sai số chuẩn bùng nổ và độ chệch phương sai trong các mô hình suy luận nhân quả.
  * *Hành động can thiệp:* Chủ động tìm kiếm và kết hợp nhiều biến công cụ phản ánh các cơ chế can thiệp ngoại sinh khác nhau (như rào cản địa lý kết hợp mức độ sẵn có của nguồn cung); theo dõi sự gia tăng của $R^2$ ở giai đoạn 1 để đảm bảo chỉ số thống kê $F > 10$, giúp giảm biên độ dao động của sai số chuẩn ở giai đoạn 2.
* **Theo góc nhìn Thẩm định Quy chuẩn Mô hình & Kiểm toán Giả định (Model Diagnostics & Exogeneity Verification):**
  * *Mục tiêu:* Đảm bảo tính vững chắc của các ràng buộc nhận diện vượt mức trước khi diễn giải kết luận nghiên cứu.
  * *Hành động can thiệp:* Bắt buộc thực hiện kiểm định Hausman hoặc kiểm định Hansen-Sargan ($J$-test) khi đưa thêm công cụ mới; tuân thủ nguyên tắc tiên quyết: tập con công cụ đối chứng ($Z_{\text{sub}}$) phải được chứng minh chặt chẽ về tính hợp lệ và có số lượng tối thiểu bằng số biến giải thích nội sinh trong phương trình. (→ Hypothesis Testing and p-values)
* **Theo góc nhìn Đánh giá Tác động Can thiệp & Hoạch định Chính sách Công (Policy Impact Evaluation):**
  * *Mục tiêu:* Cung cấp bằng chứng thực nghiệm chuẩn xác về lợi ích ngoại tác tích cực của chính sách giáo dục lên phát triển xã hội.
  * *Hành động can thiệp:* Sử dụng các hệ số ước lượng 2SLS có độ chính xác cao từ mô hình đa biến công cụ để định lượng các giá trị vô hình của giáo dục (như ý thức công dân và tỷ lệ cử tri đi bầu); hỗ trợ các nhà hoạch định chính sách xây dựng luận cứ đầu tư mở rộng mạng lưới trường học dựa trên cả giá trị kinh tế lẫn giá trị thúc đẩy tiến trình dân chủ cộng đồng.
## Kiểm Định Giả Thuyết Mô Hình Biến Công Cụ & Quy Trình Ước Lượng 2SLS Thực Hành Trong Stata (IV Diagnostics, Specification Tests & 2SLS Implementation)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript)
* **Phân loại nhiệm vụ:** **Kiểm định Chẩn đoán Mô hình & Ước lượng Suy luận Nhân quả Thực nghiệm (Econometric Model Diagnostics & Causal Inference - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Hai giả định tiên đề bắt buộc của phương pháp Biến công cụ (Instrumental Variables - IV):
    1. *Tính liên quan của công cụ (Relevance Condition):* $\text{Cov}(Z, X) \ne 0$. Công cụ $Z$ phải giải thích được một phần biến thiên đáng kể của biến nội sinh $X$. Kiểm định này được thực hiện thông qua kiểm định công cụ yếu (Weak instruments test) ở phương trình giai đoạn 1:
       $$H_0: \pi_1 = 0 \quad (\text{Biến công cụ yếu / Weak IV})$$
       Quy tắc thực nghiệm kiểm tra: Chỉ số $F\text{-statistic} > 10$ cho phép bác bỏ giả thuyết công cụ yếu, đảm bảo ước lượng IV có phương sai ổn định.
    2. *Tính ngoại sinh & Ràng buộc loại trừ (Exogeneity & Exclusion Restriction):* $\text{Cov}(Z, \varepsilon) = 0$. Biến công cụ hoàn toàn trực giao với sai số ngẫu nhiên và chỉ tác động đến $Y$ thông qua $X$.
  * Kiểm định Nhận diện Vượt mức (Overidentification Test - Hansen's $J$ Test):
    * Điều kiện áp dụng: Mô hình nhận diện vượt mức ($M > K$, tức số biến công cụ ngoại sinh nhiều hơn số biến giải thích nội sinh).
    * Giả thuyết kiểm định:
      $$H_0: \text{Toàn bộ các biến công cụ đều là ngoại sinh } (\text{Cov}(Z_m, \varepsilon) = 0, \, \forall m)$$
      $$H_1: \text{Có ít nhất một biến công cụ bị nội sinh / không hợp lệ}$$
    * Thống kê kiểm định Hansen $J$ tuân theo phân phối Chi bình phương với bậc tự do $df = M - K$.
  * Kiểm định Bản chất Nội sinh (Endogeneity Test / Hausman Specification Test):
    * Mục tiêu: Đánh giá xem biến nghi vấn $X$ có thực sự nội sinh hay không để quyết định có cần thiết phải dùng IV/2SLS thay cho OLS:
      $$H_0: \text{Biến giải thích là ngoại sinh } (\text{Cov}(X, \varepsilon) = 0 \implies \hat{\beta}_{\text{IV}} - \hat{\beta}_{\text{OLS}} \to 0)$$
      $$H_1: \text{Biến giải thích là nội sinh } (\text{Cov}(X, \varepsilon) \ne 0 \implies \hat{\beta}_{\text{IV}} - \hat{\beta}_{\text{OLS}} \ne 0)$$
    * Nếu $p < 0.05$: Bác bỏ $H_0$, xác nhận $X$ nội sinh, OLS bị chệch và bắt buộc phải dùng 2SLS.
  * Cơ chế Ước lượng 2SLS Thủ công (Manual 2SLS) vs. Lệnh tích hợp `ivregress`:
    * Giai đoạn 1: Tách phần biến thiên ngoại sinh của $X$ qua phép hồi quy theo $Z$:
      $$X_i = \pi_0 + \pi_1 Z_i + v_i \implies \hat{X}_i = \hat{\pi}_0 + \hat{\pi}_1 Z_i$$
    * Giai đoạn 2: Sử dụng giá trị dự phóng $\hat{X}$ vào phương trình hồi quy chính:
      $$Y_i = \beta_0 + \beta_1 \hat{X}_i + \varepsilon_i$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Chạy 2SLS thủ công bằng hai lệnh hồi quy tuần tự (`reg X Z` $\rightarrow$ `predict X_hat` $\rightarrow$ `reg Y X_hat`) cho ra đúng hệ số hồi quy $\hat{\beta}_1$, nhưng **sai số chuẩn ($\text{SE}$) bị tính sai**. Lệnh hồi quy OLS ở giai đoạn 2 tự động lấy phần dư $\eta_i = Y_i - \hat{\beta}_0 - \hat{\beta}_1 \hat{X}_i$ thay vì phần dư thực tế của mô hình cấu trúc $\varepsilon_i = Y_i - \hat{\beta}_0 - \hat{\beta}_1 X_i$, làm biến dạng khoảng tin cậy và giá trị kiểm định $t$.
### 2. Phân tích các ví dụ minh họa (Slide 2–7 & Transcript)
* **Kiểm định Công cụ Yếu và Giải pháp Thay thế LIML trong Stata (Slide 3):**
  * *Biểu diễn logic:* 
    $$\text{ivregress 2sls } Y \ (X = Z) \xrightarrow{\text{estat firststage, all forcenonrobust}} \begin{cases} F > 10 \implies \text{Công cụ mạnh (Strong IV)} \\ F \le 10 \implies \text{Công cụ yếu (Weak IV)} \rightarrow \text{Chuyển sang LIML} \end{cases}$$
  * *Cơ chế thực tế:* Lệnh `estat firststage` xuất ra hệ số $R^2$ riêng phần (partial $R^2$) và thống kê $F$ của giai đoạn 1. Tùy chọn `all` hiển thị thống kê cho từng biến nội sinh riêng rẽ, `forcenonrobust` tính toán dưới giả định phương sai đồng nhất. Khi $F \le 10$, thay vì bỏ cuộc, nhà nghiên cứu có thể chuyển sang phương pháp Hợp lý Cực đại Thông tin Giới hạn (LIML) bằng lệnh `ivregress liml y x1 (x2 = z1 z2)`, vốn ít nhạy cảm và ít bị chệch hơn 2SLS trước sự hiện diện của công cụ yếu.
* **Kiểm định Nhận diện Vượt mức Hansen J Test (Slide 4):**
  * *Biểu diễn logic:* 
    $$\text{ivregress 2sls } Y \ (X = Z_1 \; Z_2) \xrightarrow{\text{estat overid}} \begin{cases} p \ge 0.05 \implies \text{Chấp nhận } H_0 \ (\text{Tất cả công cụ đều ngoại sinh}) \\ p < 0.01 \implies \text{Bác bỏ } H_0 \ (\text{Tồn tại ít nhất 1 công cụ nội sinh}) \end{cases}$$
  * *Cơ chế thực tế:* Chạy dòng lệnh 158 `estat overid`. Kiểm định Hansen $J$ kiểm tra xem các phần dư của giai đoạn 2 có độc lập với tập công cụ vượt mức hay không. Điểm hạn chế cố hữu của kiểm định này là tính bất đối xứng thông tin: nó chỉ cho biết toàn hệ thống công cụ có hợp lệ hay không, chứ không thể chỉ điểm chính xác biến công cụ cụ thể nào vi phạm điều kiện ngoại sinh.
* **Đối chiếu Hai Phương Pháp Kiểm Định Hausman trong Stata (Slide 5, 6):**
  * *Biểu diễn logic:* 
    $$\text{Phương pháp 1 (DWH): } \text{ivregress 2sls } Y \dots (X = Z) \longrightarrow \text{estat endogenous } X$$
    $$\text{Phương pháp 2 (Hausman truyền thống): } \begin{cases} \text{reg } Y \; X \implies \text{estimates store ols} \\ \text{ivregress 2sls } Y \; (X = Z) \implies \text{estimates store iv} \end{cases} \longrightarrow \text{hausman iv ols, constant sigmamore}$$
  * *Cơ chế thực tế:* Lệnh `estat endogenous` dựa trên nguyên lý kiểm định Durbin-Wu-Hausman (DWH) bằng cách đưa trực tiếp phần dư dự báo từ giai đoạn 1 vào mô hình OLS để kiểm tra ý nghĩa thống kê của hệ số phần dư. Lệnh `hausman` truyền thống so sánh trực tiếp ma trận sai số giữa hai bộ ước lượng (`constant` giữ lại hệ số chặn, `sigmamore` sử dụng ước lượng phương sai hiệu quả hơn từ OLS). Hai lệnh có thể cho ra kết quả sai khác nhẹ do thuật toán xử lý ma trận hiệp phương sai sai số khác nhau.
* **Minh họa 2SLS Thủ công và Sự Sai lệch Sai số Chuẩn (Slide 7):**
  * *Biểu diễn logic:* 
    $$\text{reg } X \; Z \longrightarrow \text{predict } X\_hat \longrightarrow \text{reg } Y \; X\_hat \implies \hat{\beta}_{\text{Manual}} = \hat{\beta}_{\text{ivregress}}, \quad \text{nhưng } \text{SE}_{\text{Manual}} \ne \text{SE}_{\text{ivregress}}$$
  * *Cơ chế thực tế:* Chạy thực nghiệm các dòng code 176–198. Kết quả hệ số góc của biến $X$ trong hai cách làm là hoàn toàn trùng khớp, chứng minh giá trị dự phóng $\hat{X}$ đã chắt lọc trọn vẹn phần biến thiên ngoại sinh. Tuy nhiên, sai số chuẩn của lệnh `reg` thủ công giai đoạn 2 luôn nhỏ hơn hoặc sai lệch so với lệnh hệ thống `ivregress 2sls` do Stata OLS không nhận diện được $\hat{X}$ là một giá trị ước lượng có sai số ngẫu nhiên đi kèm từ bước trước.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–7 & Transcript)
* **Theo góc nhìn Thiết lập Quy trình Kiểm toán Mô hình Chuẩn mực (Econometric Audit Trail):**
  * *Mục tiêu:* Thiết lập chuỗi lập luận khoa học chặt chẽ trước khi khẳng định mối quan hệ nhân quả.
  * *Hành động can thiệp:* Bắt buộc chạy kiểm định DWH (`estat endogenous`); nếu không có bằng chứng thống kê về tính nội sinh ($p \ge 0.05$), giữ lại mô hình OLS để tối ưu hóa hiệu quả thống kê. Nếu xác nhận nội sinh, tiếp tục kiểm tra lực công cụ qua `estat firststage` ($F > 10$) và kiểm định ràng buộc ngoại sinh qua `estat overid` ($p \ge 0.05$) trước khi công bố ước lượng 2SLS.
* **Theo góc nhìn Xử lý Kỹ thuật Khi Gặp Công Cụ Yếu (Remedial Action for Weak IVs):**
  * *Mục tiêu:* Ngăn ngừa rủi ro sai lệch ước lượng và bùng nổ phương sai tiệm cận.
  * *Hành động can thiệp:* Khi kiểm định giai đoạn 1 cho chỉ số $F$ nằm trong khoảng rủi ro ($F < 10$), ngay lập tức chuyển đổi từ `ivregress 2sls` sang `ivregress liml` nhằm triệt tiêu độ chệch trong mẫu hữu hạn; đồng thời rà soát lại cơ chế tác động để bổ sung các biến công cụ ngoại sinh mạnh hơn từ thiết kế chính sách.
* **Theo góc nhìn Chuẩn hóa Code Nghiên cứu & Tránh Lỗi Phân tích (Software Implementation Guidelines):**
  * *Mục tiêu:* Tránh sai sót trong kiểm định giả thuyết và đưa ra kết luận can thiệp sai lầm.
  * *Hành động can thiệp:* Tuyệt đối không sử dụng kết quả sai số chuẩn, giá trị thống kê $t$ và $p$-value từ quy trình chạy 2SLS thủ công (`predict` rồi `reg`) cho các báo cáo định lượng hoặc thẩm định chính sách; luôn sử dụng các lệnh chuẩn hóa tích hợp chuyên dụng (`ivregress 2sls`) để đảm bảo ma trận phương sai - hiệp phương sai được tính toán chuẩn xác trên phần dư mô hình gốc.
# Randomize Controlled Trial
## Khái Niệm Thử Nghiệm Ngẫu Nhiên Có Đối Chứng (RCT), Khung Kết Quả Tiềm Năng & Cơ Chế Triệt Tiêu Sai Lệch Tự Lựa Chọn
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7, 10–13 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm & Đánh giá Tác động Can thiệp (Causal Inference & Experimental Program Evaluation - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Khung kết quả tiềm năng (Potential Outcomes Framework / Rubin Causal Model): Mỗi cá thể $i$ có hai trạng thái kết quả tiềm năng:
    * $Y_{1i}$: Kết quả khi được tiếp nhận can thiệp ($T_i = 1$).
    * $Y_{0i}$: Kết quả khi không tiếp nhận can thiệp ($T_i = 0$).
  * Vấn đề cốt lõi của suy luận nhân quả (Fundamental Problem of Causal Inference): Trong thực tế, chỉ có thể quan sát một trong hai trạng thái kết quả đối với mỗi cá nhân tại một thời điểm:
    $$Y_i = T_i Y_{1i} + (1 - T_i) Y_{0i}$$
    Trạng thái chưa được trải nghiệm trở thành một giá trị phản thực tế (counterfactual missing data), khiến hiệu ứng can thiệp cá thể $\text{ITE}_i = Y_{1i} - Y_{0i}$ không thể tính toán trực tiếp.
  * Các tham số tổng hợp kỳ vọng của quần thể:
    * Hiệu ứng can thiệp trung bình (Average Treatment Effect - ATE):
      $$\text{ATE} = \mathbb{E}[Y_{1i} - Y_{0i}]$$
    * Hiệu ứng can thiệp trung bình trên nhóm được xử lý (Average Treatment Effect on the Treated - ATT):
      $$\text{ATT} = \mathbb{E}[Y_{1i} - Y_{0i} \mid T_i = 1]$$
    * Hiệu ứng can thiệp trung bình trên nhóm không xử lý (Average Treatment Effect on the Non-Treated - ATNT):
      $$\text{ATNT} = \mathbb{E}[Y_{1i} - Y_{0i} \mid T_i = 0]$$
  * Phân rã sai lệch tự lựa chọn trong dữ liệu quan sát (Selection Bias Decomposition):
    $$\mathbb{E}[Y_i \mid T_i = 1] - \mathbb{E}[Y_i \mid T_i = 0] = \underbrace{\mathbb{E}[Y_{1i} - Y_{0i} \mid T_i = 1]}_{\text{ATT}} + \underbrace{\left( \mathbb{E}[Y_{0i} \mid T_i = 1] - \mathbb{E}[Y_{0i} \mid T_i = 0] \right)}_{\text{Selection Bias (Sai lệch tự lựa chọn)}}$$
  * Cơ chế toán học giải quyết sai lệch của RCT: Phân bổ ngẫu nhiên (Random Assignment) đảm bảo tính độc lập thống kê giữa trạng thái can thiệp $T_i$ và các kết quả tiềm năng:
    $$T_i \perp (Y_{1i}, Y_{0i}) \implies \begin{cases} \mathbb{E}[Y_{1i} \mid T_i = 1] = \mathbb{E}[Y_{1i} \mid T_i = 0] = \mathbb{E}[Y_{1i}] \\ \mathbb{E}[Y_{0i} \mid T_i = 1] = \mathbb{E}[Y_{0i} \mid T_i = 0] = \mathbb{E}[Y_{0i}] \end{cases}$$
    Khi đó, sai lệch tự lựa chọn bị triệt tiêu hoàn toàn về 0:
    $$\text{Selection Bias} = 0 \implies \mathbb{E}[Y_i \mid T_i = 1] - \mathbb{E}[Y_i \mid T_i = 0] = \text{ATT} = \text{ATE}$$
  * Ba giả định tiên đề của RCT (Assumptions of RCT):
    1. *Hiệu ứng can thiệp ổn định (Stable Treatment Effect / SUTVA):* Can thiệp của cá thể này không gây tác động lan tỏa (spillover) sang kết quả của cá thể khác.
    2. *Tính tương đồng (Comparability):* Các nhóm có phân phối đặc tính ban đầu giống nhau trước khi can thiệp.
    3. *Tính độc lập (Independence):* Phép gán can thiệp hoàn toàn ngẫu nhiên và không phụ thuộc vào bất kỳ đặc tính nào của đối tượng.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * RCT được coi là "tiêu chuẩn vàng" (Gold Standard) cho suy luận nhân quả. Khác với các phương pháp bán thực nghiệm (RDD, PSM, IV) phải dựa vào các giả định nhận diện phức tạp (như biến công cụ mạnh hay điều kiện ngoại sinh khó kiểm định), RCT cân bằng toàn bộ các yếu tố nhiễu quan sát được lẫn không quan sát được thông qua cơ chế phân bổ ngẫu nhiên cơ học.
### 2. Phân tích các ví dụ minh họa (Slide 4, 6, 7–9, 11–13 & Transcript)
* **Nghiên cứu Tác động Trường Học lên Kết Quả Học Tập của Xiao Dan (Slide 4, 6):**
  * *Biểu diễn logic:* 
    $$\text{Tham gia trường đô thị chất lượng cao } (T_i = 1) \text{ vs. Trường cho con em nhập cư } (T_i = 0) \implies \text{ITE} = Y_{1,\text{Xiao Dan}} - Y_{0,\text{Xiao Dan}}$$
  * *Cơ chế thực tế:* Nếu học sinh Xiao Dan được chọn vào trường đô thị chất lượng cao, ta chỉ đo lường được kết quả $Y_{1}$. Điểm số của Xiao Dan nếu em tiếp tục ở lại học trường dành cho con em lao động nhập cư ($Y_0$) trở thành trạng thái phản thực tế vĩnh viễn không thể thu thập được. Vì không thể lùi thời gian để đo cả hai trạng thái trên một cá nhân, khoa học xã hội buộc phải dịch chuyển từ ước lượng hiệu ứng cá thể ($\text{ITE}$) sang ước lượng giá trị kỳ vọng trung bình trên nhóm đối tượng tương đương ($\text{ATE}$).
* **Phân rã Sai Lệch Chọn trong Dữ liệu Quan sát và Giải pháp Bốc thăm Ngẫu nhiên (Slide 7, 9, 11, 12):**
  * *Biểu diễn logic:* 
    $$\text{Dữ liệu Quan sát: } \mathbb{E}[Y \mid T=1] - \mathbb{E}[Y \mid T=0] = \text{ATT} + \underbrace{\left( \mathbb{E}[Y_0 \mid T=1] - \mathbb{E}[Y_0 \mid T=0] \right)}_{> 0 \ (\text{Năng lực, điều kiện ban đầu vượt trội})}$$
    $$\text{Cơ chế RCT: } \text{Bốc thăm ngẫu nhiên} \implies \mathbb{E}[Y_0 \mid T=1] = \mathbb{E}[Y_0 \mid T=0] \implies \Delta \bar{Y}_{\text{Observed}} = \text{ATE}$$
  * *Cơ chế thực tế:* Khi thu thập dữ liệu quan sát thông thường, những học sinh vào học trường chất lượng cao thường có gia đình khá giả hơn, phụ huynh đầu tư nhiều hơn, và nền tảng học lực sẵn có cao hơn. Ngay cả khi không được học trường tốt, điểm số kỳ vọng của nhóm này vẫn cao hơn nhóm còn lại ($\mathbb{E}[Y_0 \mid T=1] > \mathbb{E}[Y_0 \mid T=0]$). Phép trừ trung bình thông thường sẽ phóng đại tác động của trường học do gộp cả ưu thế ban đầu vào hiệu quả giáo dục. Nhờ phân bổ ngẫu nhiên (bốc thăm), hai nhóm có xuất phát điểm trung bình giống hệt nhau, loại bỏ hoàn toàn phần dư chênh lệch nền tảng.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 3, 10, 13 & Transcript)
* **Theo góc nhìn Thiết kế Thử nghiệm & Thẩm định Tính Hợp lệ Nội tại (Experimental Design & Internal Validity):**
  * *Mục tiêu:* Đảm bảo tính khách quan và hiệu lực khoa học của phép đo lường tác động can thiệp chính sách.
  * *Hành động can thiệp:* Triển khai quy trình bốc thăm ngẫu nhiên chuẩn hóa bằng thuật toán máy tính; thực hiện kiểm định cân bằng nền tảng (Balance test / Baseline covariates check) để xác minh nhóm can thiệp và nhóm đối chứng không có sự khác biệt có ý nghĩa thống kê về đặc tính nhân khẩu học trước khi triển khai chương trình.
* **Theo góc nhìn Đánh giá Rủi ro Khi Diễn Giải Dữ liệu Quan sát (Observational Data Governance):**
  * *Mục tiêu:* Ngăn chặn các quyết định phân bổ ngân sách sai lầm dựa trên tương quan giả mạo (spurious correlations).
  * *Hành động can thiệp:* Không bao giờ đánh đồng chênh lệch trung bình mô tả với tác động nhân quả thuần túy khi phân tích dữ liệu khảo sát thông thường; luôn nhận diện rõ quy mô của sai lệch tự lựa chọn (selection bias) và chủ động áp dụng các phương pháp bán thực nghiệm (Quasi-experimental designs) để kiểm soát khi không thể tổ chức thử nghiệm ngẫu nhiên.
* **Theo góc nhìn Kiểm soát Giả định SUTVA & Giới hạn Thực thi Thực địa (SUTVA & Practical Feasibility):**
  * *Mục tiêu:* Bảo toàn tính ổn định của can thiệp và giải quyết các xung đột đạo đức trong thử nghiệm xã hội.
  * *Hành động can thiệp:* Thiết lập ranh giới địa lý hoặc tổ chức lớp học chặt chẽ để ngăn hiện tượng hiệu ứng lan tỏa (spillover effect) giữa học sinh nhóm can thiệp và nhóm đối chứng; cân nhắc kỹ các rào cản đạo đức khi tước bỏ cơ hội can thiệp của nhóm đối chứng trong các chính sách giáo dục mang tính thiết yếu.
## Thiết Kế Thực Địa, Ước Lượng Hồi Quy Và Các Mối Đe Dọa Giá Trị Trong Thử Nghiệm Ngẫu Nhiên Có Đối Chứng (RCT Design, Estimation & Threats to Validity)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm & Thiết kế Can thiệp Hiện trường (Experimental Causal Inference & Field Trial Design - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Chu trình chuẩn hóa của một thử nghiệm ngẫu nhiên có đối chứng (RCT) tại hiện trường:
    $$\text{Quần thể mục tiêu} \xrightarrow{\text{Lấy mẫu ngẫu nhiên đại diện}} \text{Mẫu tổng thể} \xrightarrow{\text{Phân bổ ngẫu nhiên (Pretest)}} \begin{cases} \text{Nhóm can thiệp (Treatment Group)} \xrightarrow{\text{Triển khai can thiệp}} \bar{Y}_1 \\ \text{Nhóm đối chứng (Control Group)} \xrightarrow{\text{Giữ nguyên mọi điều kiện}} \bar{Y}_0 \end{cases}$$
  * Hai phương pháp ước lượng tác động can thiệp (Estimates from RCTs):
    1. *So sánh giá trị trung bình (Two-sample $t$-test):* Đo lường trực tiếp hiệu ứng can thiệp trung bình:
       $$\text{ATE} = \mathbb{E}[Y_{1i} - Y_{0i}] \approx \bar{Y}_{\text{Treatment}} - \bar{Y}_{\text{Control}}$$
    2. *Ước lượng qua mô hình hồi quy tuyến tính (Regression approach):*
       * Hồi quy đơn biến:
         $$Y_i = \alpha + \rho D_i + \varepsilon_i$$
         Trong đó: $D_i \in \{0, 1\}$ là biến giả chỉ định can thiệp. Nhờ tính ngẫu nhiên của $D_i$, $\mathbb{E}[\varepsilon_i \mid D_i] = 0$, hệ số $\hat{\rho}$ ước lượng chính xác $\text{ATE}$.
       * Hồi quy có kiểm soát hiệp biến (Covariates):
         $$Y_i = \alpha + \rho D_i + \boldsymbol{\beta}' \mathbf{X}_i + \varepsilon_i$$
         Vì $D_i \perp \mathbf{X}_i$, việc đưa thêm các biến kiểm soát ngoại sinh đo lường trước can thiệp $\mathbf{X}_i$ không làm thay đổi giá trị kỳ vọng của $\hat{\rho}$, nhưng giải thích thêm một phần biến thiên của biến kết quả, làm giảm phương sai sai số dư ($\sigma_\varepsilon^2 \downarrow$) và trực tiếp thu hẹp sai số chuẩn $\text{SE}(\hat{\rho}) \downarrow$, qua đó tối ưu hóa **năng lực thống kê (Statistical Power $\uparrow$)**.
  * Hai trụ cột đánh giá hiệu lực của RCT (Effectiveness / Validity):
    * *Giá trị nội tại (Internal Validity):* Mức độ tin cậy rằng chênh lệch trung bình giữa hai nhóm phản ánh đúng mối quan hệ nhân quả khách quan từ can thiệp, không bị thiên lệch bởi các yếu tố gây nhiễu.
    * *Giá trị ngoại tại (External Validity):* Khả năng suy rộng (generalizability) kết quả thực nghiệm từ mẫu nghiên cứu về toàn bộ quần thể mục tiêu đã định nghĩa ban đầu.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * RCT chuyển dịch từ suy luận toán học thuần túy sang kiểm soát môi trường thực địa phức tạp. Mô hình hồi quy trong RCT không nhằm mục đích "chống chệch nội sinh" như trong dữ liệu quan sát, mà đóng vai trò là công cụ kỹ thuật để gia tăng hiệu quả thống kê (statistical precision) và kiểm định cân bằng mẫu.
### 2. Phân tích các ví dụ minh họa (Slide 2–6 & Transcript)
* **Cơ chế đưa Hiệp biến (Covariates) vào Hồi quy để Tối ưu Lực Thống kê (Slide 3):**
  * *Biểu diễn logic:* 
    $$\text{Hồi quy đơn: } Y_i = \alpha + \rho D_i + \varepsilon_i \implies \text{SE}(\hat{\rho}) = \frac{\sigma_\varepsilon}{\sqrt{N \cdot \text{Var}(D)}}$$
    $$\text{Hồi quy đa biến: } Y_i = \alpha + \rho D_i + \beta X_{\text{pretest}, i} + \tilde{\varepsilon}_i \implies \sigma_{\tilde{\varepsilon}}^2 < \sigma_\varepsilon^2 \implies \text{SE}_{\text{mới}}(\hat{\rho}) < \text{SE}_{\text{cũ}}(\hat{\rho}) \implies t = \frac{\hat{\rho}}{\text{SE}} \uparrow$$
  * *Cơ chế thực tế:* Trong các thử nghiệm giáo dục, điểm kiểm tra đầu vào ($X_{\text{pretest}}$) có tương quan rất mạnh với điểm kiểm tra cuối kỳ ($Y$). Mặc dù việc gán ngẫu nhiên học sinh vào các lớp học đã triệt tiêu độ chệch chọn mẫu, phần dư $\varepsilon_i$ trong hồi quy đơn biến vẫn chứa toàn bộ sự khác biệt về học lực bẩm sinh ban đầu. Khi đưa $X_{\text{pretest}}$ vào phương trình, phần lớn phương sai tự nhiên này được hấp thụ, làm giảm mạnh độ phân tán của phần dư, giúp mô hình dễ dàng phát hiện ra tác động can thiệp dù là nhỏ mà không cần phải tốn kém chi phí tăng gấp đôi cỡ mẫu.
* **Hệ thống 7 Mối đe dọa Thực địa Xói mòn Tính Hợp lệ của RCT (Slide 5, 6):**
  * *Biểu diễn logic:* 
    $$\text{Mối đe dọa Giá trị Nội tại: } \begin{cases} \text{Spillovers: } D_i = 1 \xrightarrow{\text{Lan tỏa kiến thức/tài liệu}} D_j = 0 \implies \Delta \bar{Y}_{\text{Observed}} < \text{True ATE} \\ \text{Hawthorne: } D_i = 1 \xrightarrow{\text{Ý thức đang được quan sát}} \text{Tăng nỗ lực nhân tạo} \implies \hat{\rho} \text{ bị thổi phồng} \\ \text{John Henry: } D_i = 0 \xrightarrow{\text{Tâm lý cạnh tranh bù trừ}} \text{Nỗ lực vượt bậc} \implies \Delta \bar{Y}_{\text{Observed}} \downarrow \\ \text{Placebo: } D_i = 1 \xrightarrow{\text{Kỳ vọng tâm lý tích cực}} \text{Kết quả tăng không do bản chất can thiệp} \\ \text{Crossover: } D_i = 0 \xrightarrow{\text{Tự ý đổi nhóm để nhận can thiệp}} D_i = 1 \implies \text{Vi phạm phân bổ ban đầu} \end{cases}$$
    $$\text{Mối đe dọa Giá trị Ngoại tại \& Thực thi: } \text{Bối cảnh phi điển hình (External Validity)} + \text{Chi phí \& Khả thi} + \text{Rào cản Đạo đức (Ethics)}$$
  * *Cơ chế thực tế:* 
    * Hiện tượng lan tỏa (Spillovers) phá vỡ giả định SUTVA: ví dụ học sinh nhóm can thiệp chia sẻ phần mềm học tập cho học sinh nhóm đối chứng cùng trường, làm cho nhóm đối chứng cũng tiến bộ, dẫn đến việc đánh giá thấp hiệu quả thực tế của phần mềm.
    * Hiệu ứng Hawthorne tạo ra tác động giả: người tham gia thay đổi hành vi tích cực hơn đơn thuần vì biết mình đang nằm trong tầm ngắm của các nhà nghiên cứu chứ không phải do nội dung can thiệp.
    * Hiện tượng hoán đổi (Crossover): phụ huynh ở nhóm đối chứng khiếu nại hoặc tự tìm cách đưa con sang học lớp can thiệp, làm mờ ranh giới giữa hai nhóm và biến thử nghiệm thành dạng không tuân thủ hoàn hảo (imperfect compliance).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–6 & Transcript)
* **Theo góc nhìn Thiết lập Giao thức Phân tích & Kiểm soát Biến định trước (Pre-analysis Protocols):**
  * *Mục tiêu:* Nâng cao độ tin cậy khoa học và triệt tiêu hành vi thao túng dữ liệu (p-hacking).
  * *Hành động can thiệp:* Đăng ký trước kế hoạch phân tích (Pre-Analysis Plan - PAP) quy định rõ danh mục các biến kiểm soát nền tảng ($X_i$) được thu thập ở bước tiền kiểm tra (Pretest); ưu tiên sử dụng mô hình hồi quy tuyến tính có kiểm soát hiệp biến để thu hẹp khoảng tin cậy của ước lượng mà vẫn giữ nguyên tính khách quan của phép gán ngẫu nhiên.
* **Theo góc nhìn Kiểm soát Mối đe dọa Thực địa & Thiết kế Cụm (Field Threat Mitigation):**
  * *Mục tiêu:* Bảo toàn tính toàn vẹn của giá trị nội tại trước các tương tác hành vi xã hội.
  * *Hành động can thiệp:* Áp dụng thiết kế ngẫu nhiên hóa theo cụm (Cluster Randomized Controlled Trial - ví dụ: phân bổ ngẫu nhiên theo cụm trường học hoặc cụm địa phương thay vì từng cá nhân) nhằm ngăn chặn triệt để hiệu ứng lan tỏa (Spillover); thiết lập nhóm đối chứng tích cực hoặc nhóm nhận giả dược (Placebo/Active control) để trung hòa hiệu ứng tâm lý Hawthorne và John Henry.
* **Theo góc nhìn Hoạch định Dự án, Cân bằng Chi phí & Chuẩn mực Đạo đức (Ethics & Scalability):**
  * *Mục tiêu:* Bảo đảm tính khả thi thực tế và tính nhân văn khi triển khai các chính sách công quy mô lớn.
  * *Hành động can thiệp:* Khi việc từ chối can thiệp đối với nhóm đối chứng vi phạm các quy chuẩn đạo đức xã hội (như hỗ trợ dinh dưỡng học đường hoặc học bổng cơ bản), chuyển đổi sang thiết kế triển khai bậc thang (Stepped-Wedge Design) — cam kết nhóm đối chứng sẽ được tiếp nhận chính sách ở chu kỳ tiếp theo; đồng thời cân đối giữa cỡ mẫu tối thiểu cần thiết để đạt lực kiểm định $80\%$ với giới hạn ngân sách và năng lực vận hành tại địa bàn thực địa.
## Hiện Tượng Hoán Đổi Nhóm (Crossover) Trong RCT, Ước Lượng Biến Công Cụ (IV/Wald) Và Phân Tích Ý Định Điều Trị (ITT)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7, 12, 13 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm Khi Có Hiện Tượng Không Tuân Thủ (Causal Inference with Imperfect Compliance & Policy Impact Evaluation - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Hiện tượng hoán đổi (Crossover / Imperfect Compliance) xảy ra khi các đối tượng tham gia thử nghiệm không tuân thủ phân bổ ngẫu nhiên ban đầu ($D_i$), mà tự ý lựa chọn hoặc từ chối trạng thái can thiệp thực tế ($T_i$).
  * Phân rã 4 nhóm hành vi theo khung tiếp cận Angrist, Imbens & Rubin:
    $$\begin{cases} \text{Complier (Tuân thủ): } D_i = 1 \implies T_i = 1; \quad D_i = 0 \implies T_i = 0 \\ \text{Always Taker (Luôn nhận): } D_i = 1 \implies T_i = 1; \quad D_i = 0 \implies T_i = 1 \\ \text{Never Taker (Không bao giờ nhận): } D_i = 1 \implies T_i = 0; \quad D_i = 0 \implies T_i = 0 \\ \text{Defier (Chống đối): } D_i = 1 \implies T_i = 0; \quad D_i = 0 \implies T_i = 1 \end{cases}$$
  * Giả định Đơn điệu (Monotonicity Assumption): Loại trừ sự tồn tại của nhóm Defier ($T_{1i} \ge T_{0i}, \forall i$).
  * Khi có Crossover, biến can thiệp thực tế $T_i$ trở thành biến nội sinh ($\text{Cov}(T_i, \varepsilon_i) \ne 0$), khiến ước lượng OLS thông thường bị chệch do sai lệch tự lựa chọn (Selection Bias).
  * Giải pháp Biến công cụ (Instrumental Variable - IV) trong RCT: Sử dụng chỉ định phân bổ ngẫu nhiên ban đầu $D_i \in \{0, 1\}$ làm biến công cụ cho hành vi can thiệp thực tế $T_i$:
    * *Tính liên quan (Relevance):* $\text{Cov}(D_i, T_i) \ne 0$ (phân bổ ngẫu nhiên tác động trực tiếp đến xác suất nhận can thiệp).
    * *Tính ngoại sinh / Ràng buộc loại trừ (Exogeneity / Exclusion Restriction):* $D_i \perp \varepsilon_i$ và $D \longrightarrow T \longrightarrow Y$ (phép bốc thăm ngẫu nhiên không tác động trực tiếp lên kết quả ngoại trừ thông qua việc tiếp nhận can thiệp).
  * Hai thước đo ước lượng chuẩn mực:
    * *Ý định điều trị (Intention-to-Treat - ITT):* Đo lường tác động của chính sách đề xuất can thiệp:
      $$\text{ITT} = \mathbb{E}[Y_i \mid D_i = 1] - \mathbb{E}[Y_i \mid D_i = 0]$$
    * *Ước lượng Wald / Hiệu ứng can thiệp cục bộ (Wald Estimator / LATE / TOT):* Đo lường tác động can thiệp thực sự trên nhóm tuân thủ (Compliers):
      $$\beta_{1, \text{Wald}} = \frac{\mathbb{E}[Y_i \mid D_i = 1] - \mathbb{E}[Y_i \mid D_i = 0]}{\mathbb{E}[T_i \mid D_i = 1] - \mathbb{E}[T_i \mid D_i = 0]} = \frac{\text{ITT}_Y}{\text{ITT}_D} = \frac{\text{Reduced Form Effect}}{\text{First Stage Compliance Difference}}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * OLS đo lường sai khác giữa người thực tế nhận và không nhận can thiệp, phản ánh cả tác động can thiệp lẫn động cơ nội sinh tự lựa chọn ($\text{OLS}$ bị chệch).
  * ITT bảo toàn tính ngẫu nhiên sạch của $D_i$, phản ánh hiệu quả chính sách ngoài đời thực nhưng đánh giá thấp (pha loãng) tác động sinh học/nội tại của bản thân can thiệp.
  * IVE/Wald phóng đại ITT ngược lại theo tỷ lệ tuân thủ ($0 < \text{ITT}_D < 1$) để khôi phục trọn vẹn tác động nhân quả thuần túy trên nhóm Compliers.
### 2. Phân tích các ví dụ minh họa (Slide 2, 4, 8–13 & Transcript)
* **Kế Hoạch STAR của Krueger (1999) về Quy Mô Lớp Học (Slide 4):**
  * *Biểu diễn logic:* 
    $$\text{Bốc thăm vào lớp nhỏ } (D_i = 1) \xrightarrow{\text{Phụ huynh khiếu nại / Giáo viên chuyển lớp}} \text{Học lớp nhỏ thực tế } (T_i = 1) \longrightarrow \text{Điểm thi } (Y_i)$$
  * *Cơ chế thực tế:* Một số học sinh bốc thăm vào lớp tiêu chuẩn nhưng gia đình có điều kiện đã vận động chuyển sang lớp nhỏ, trong khi một số học sinh được phân vào lớp nhỏ lại chuyển về lớp thường do bất tiện đi lại. Biến $T_i$ bị nội sinh hóa bởi đặc điểm gia đình. Việc sử dụng phân bổ ngẫu nhiên ban đầu $D_i$ làm biến công cụ giúp bóc tách và ước lượng chính xác tác động nhân quả của việc giảm sĩ số lớp lên thành tích học tập.
* **Thử Nghiệm JTPA (Job Training Partnership Act - MHE p.119–123) (Slide 8–11, 13):**
  * *Biểu diễn logic:* 
    $$P(T=1 \mid D=1) = 60\%, \quad P(T=1 \mid D=0) = 2\% \implies \Delta P_{\text{Compliance}} = 60\% - 2\% = 58\% = 0.58$$
    $$\beta_{1, \text{Wald}} = \frac{\text{ITT}_Y}{0.60 - 0.02} = \frac{\text{ITT}_Y}{0.58} \approx 1.72 \times \text{ITT}_Y$$
  * *Cơ chế thực tế:* 
    * Trong nhóm được chỉ định đào tạo nghề ($D_i = 1$): $60\%$ thực tế đi học, $40\%$ bỏ học (Never Takers).
    * Trong nhóm đối chứng không được chỉ định ($D_i = 0$): $98\%$ tuân thủ không đi học, nhưng $2\%$ tự tìm cách đăng ký khóa học bên ngoài (Always Takers).
    * Ước lượng Wald điều chỉnh tác động chính sách $\text{ITT}_Y$ bằng cách chia cho độ chênh lệch xác suất tham gia ($0.58$).
    * Mối quan hệ độ lớn thực nghiệm: $\text{OLS} > \text{IVE} > \text{ITT}$. OLS cao nhất do nhóm chủ động đi học vốn có động lực tìm việc cao hơn (chệch dương); ITT thấp nhất do bị pha loãng bởi $40\%$ người không đi học; IVE nằm ở giữa, phản ánh đúng tác động thực sự trên nhóm tuân thủ.
* **Ẩn Dụ Điển Tích Tào Tháo và Hoa Đà Về Phân Tích ITT (Slide 12):**
  * *Biểu diễn logic:* 
    $$\text{Đề xuất phác đồ mổ sọ } (D=1) \xrightarrow{\text{Tào Tháo nghi ngờ, từ chối \& chém Hoa Đà}} \text{Không phẫu thuật } (T=0) \longrightarrow \text{Tử vong } (Y)$$
  * *Cơ chế thực tế:* Chiến lược cung cấp điều trị (Treatment Strategy / Proposal) hoàn toàn khác với bản thân việc tiếp nhận điều trị (Treatment Itself). Một phác đồ dù hoàn hảo về mặt y học nhưng nếu khiến bệnh nhân hoảng sợ và từ chối tiếp nhận thì trong thực tế triển khai chính sách vẫn thất bại. ITT đo lường chính xác hiệu quả tổng thể của đề xuất chính sách có tính đến xác suất đối tượng từ chối tham gia.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 5, 8, 12, 13 & Transcript)
* **Theo góc nhìn Hoạch định Ngân sách & Đánh giá Tính Khả thi Chính sách (Policy Feasibility - ITT):**
  * *Mục tiêu:* Đánh giá hiệu quả kinh tế - xã hội thực tế của một chương trình công trước khi mở rộng quy mô toàn quốc.
  * *Hành động can thiệp:* Luôn sử dụng chỉ số ITT làm căn cứ chính để tính toán tỷ suất hoàn vốn xã hội (Social ROI) và phân bổ ngân sách; nhận diện rõ ràng rằng một chương trình có hiệu quả nội tại cao nhưng tỷ lệ tuân thủ thấp sẽ không mang lại giá trị thực tế cho cộng đồng.
* **Theo góc nhìn Đánh giá Hiệu lực Kỹ thuật & Tác động Nội tại (Efficacy Assessment - IVE/Wald):**
  * *Mục tiêu:* Xác định xem bản thân giải pháp kỹ thuật/chương trình đào tạo có thực sự mang lại tác động tích cực hay không đối với người tiếp nhận.
  * *Hành động can thiệp:* Báo cáo đồng thời ước lượng Wald/2SLS song song với ITT; sử dụng ước lượng IVE để chứng minh tính hiệu quả cốt lõi của nội dung can thiệp cho nhóm đối tượng mục tiêu sẵn sàng tiếp nhận, tránh việc vội vàng hủy bỏ một can thiệp tốt chỉ vì khâu truyền thông vận động tuân thủ chưa hiệu quả.
* **Theo góc nhìn Giám sát Thực địa & Kiểm soát Rủi ro Không Tuân thủ (Compliance Risk Control):**
  * *Mục tiêu:* Tối đa hóa năng lực thống kê của thử nghiệm bằng cách thu hẹp khoảng cách giữa $D_i$ và $T_i$.
  * *Hành động can thiệp:* Thiết lập các biện pháp rào chắn chặt chẽ để nhóm đối chứng không thể tiếp cận dịch vụ can thiệp (triệt tiêu nhóm Always Takers); cung cấp các gói khuyến khích tham gia (trợ cấp đi lại, tài liệu miễn phí) cho nhóm can thiệp để giảm thiểu tỷ lệ bỏ cuộc (Never Takers), đẩy độ chênh lệch giai đoạn 1 ($\Delta P \to 1$) để sai số chuẩn của ước lượng Wald tiệm cận với sai số chuẩn của RCT lý tưởng.
## Phân Tích Thực Hành RCT Trên Stata: Lựa Chọn Mô Hình OLS, Biến Công Cụ (IV) Và Mô Hình Đa Cấp (HLM)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–3, 6, 8)
* **Phân loại nhiệm vụ:** **Thực hành Kinh tế lượng Ứng dụng & Lựa chọn Mô hình Suy luận Nhân quả (Applied Econometrics & Causal Inference - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * RCT được coi là "tiêu chuẩn vàng" để xác định mối quan hệ nhân quả. Tuy nhiên, việc lựa chọn mô hình ước lượng trên Stata phụ thuộc trực tiếp vào cơ chế phát sinh dữ liệu thực tế tại hiện trường thông qua 3 kịch bản chuẩn hóa:
    1. *Kịch bản RCT Tiêu chuẩn (Standard RCT với dữ liệu "phẳng"):* Các đối tượng độc lập, gán ngẫu nhiên hoàn hảo, không có hiện tượng khuếch tán can thiệp. Sử dụng mô hình Hồi quy Tuyến tính Bình phương Tối thiểu (OLS) để ước lượng Hiệu ứng Can thiệp Trung bình (ATE):
       $$Y_i = \alpha + \beta_1 \text{Treat}_i + \mathbf{X}_i'\boldsymbol{\gamma} + \varepsilon_i \implies \hat{\beta}_1 = \text{ATE}$$
       * Cú pháp Stata: `reg y treat x1 x2, robust`. Việc đưa thêm các biến kiểm soát ngoại sinh $\mathbf{X}_i$ giúp giải thích phương sai sai số, nâng cao độ chính xác và năng lực kiểm định thống kê.
    2. *Kịch bản Có Vấn đề Tuân thủ hoặc Hiệu ứng Lan tỏa (Imperfect Compliance & Spillover Effects):* Can thiệp không được thực thi nghiêm ngặt (đối tượng tự ý từ chối hoặc nhóm đối chứng bị tác động lan tỏa từ nhóm can thiệp). Khi đó hành vi can thiệp thực tế ($D_i$) bị nội sinh hóa, buộc phải dùng Biến công cụ (IV / 2SLS) để ước lượng Hiệu ứng Can thiệp Cục bộ (LATE):
       $$\text{Giai đoạn 1: } D_i = \pi_0 + \pi_1 Z_i + \mathbf{X}_i'\boldsymbol{\theta} + v_i \implies \hat{D}_i$$
       $$\text{Giai đoạn 2: } Y_i = \beta_0 + \beta_{\text{IV}} \hat{D}_i + \mathbf{X}_i'\boldsymbol{\delta} + u_i \implies \hat{\beta}_{\text{IV}} = \text{LATE}$$
       * Cú pháp Stata: `ivregress 2sls y (D = Z) x1 x2, robust`, trong đó $Z$ là chỉ định phân bổ ngẫu nhiên ban đầu (Intention to treat) và $D$ là trạng thái tiếp nhận can thiệp thực tế (Treatment received).
    3. *Kịch bản Dữ liệu Có Cấu trúc Nhóm/Lồng ghép (Hierarchical / Clustered Data):* Các quan sát thuộc về các đơn vị phân cấp tự nhiên (học sinh trong lớp học, lớp học trong trường học), vi phạm giả định quan sát độc lập. Cần sử dụng Mô hình Đa cấp (HLM / Fixed Effects có kiểm soát phương sai cụm) để kiểm soát tương quan nội nhóm:
       $$Y_{ij} = \alpha_j + \beta_1 \text{Treat}_{ij} + \mathbf{X}_{ij}'\boldsymbol{\gamma} + \varepsilon_{ij}$$
       * Cú pháp Stata: `xtreg y treat, fe vce(cluster schoolid)`.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Phân định rõ ràng giữa mục tiêu phân tích và bản chất tham số: OLS ước lượng ATE trên toàn thể khi thỏa mãn tính độc lập; IV ước lượng LATE trên nhóm đối tượng tuân thủ (Compliers) khi có sự phân kỳ giữa chỉ định và thực nhận; HLM giải quyết triệt để sự tương quan trong cụm để bảo đảm sai số chuẩn không bị sai lệch.
### 2. Phân tích các ví dụ minh họa (Slide 4–7)
* **Quy trình Phân tích OLS Với Biến Giả Tương Tác và Sai Số Cụm (Slide 4, 5):**
  * *Biểu diễn logic:* 
    $$\text{xi: regress GPA\_year } \begin{pmatrix} \text{ssp\_p} \\ \text{sfp\_p} \\ \text{sfsp\_p} \end{pmatrix} \mathbf{X}_{\text{categorical}} \dots, \, \text{r clu(id)}$$
    $$\text{xi: regress GPA\_year } \begin{pmatrix} \text{ssp} \\ \text{sfp} \\ \text{sfsp} \end{pmatrix} \mathbf{X}_{\text{categorical}} \dots, \, \text{r clu(id)}$$
  * *Cơ chế thực tế:* 
    * Trong tập dữ liệu thực nghiệm dự án STAR/Student Achievement (`STAR_public_student.dta`), nghiên cứu đánh giá 3 gói can thiệp: dịch vụ hỗ trợ sinh viên (`ssp`), khuyến khích tài chính/học bổng (`sfp`), và gói tích hợp cả hai dịch vụ (`sfsp`).
    * Lệnh tiền tố `xi:` tự động tạo biến giả cho các biến phân loại danh nghĩa nhiều bậc (như `i.sex`, `i.mtongue`, `i.hsgroup`, `i.year`).
    * So sánh hai phương trình: Hồi quy theo trạng thái đăng ký thực tế (`signed-up`: `ssp_p`, `sfp_p`, `sfsp_p`) phản ánh tương quan với kết quả thực tế nhưng dễ bị chệch tự lựa chọn; trong khi hồi quy theo đề xuất gán ngẫu nhiên ban đầu (`offered`: `ssp`, `sfp`, `sfsp`) phản ánh hiệu ứng ý định điều trị (ITT).
    * Tùy chọn `r clu(id)` (Robust Clustered Standard Errors) nới lỏng giả định phương sai đồng nhất và độc lập, hiệu chỉnh ma trận hiệp phương sai sai số theo mã nhận diện đối tượng `id` để tránh phóng đại ý nghĩa thống kê.
* **Quy trình Ước lượng 2SLS Với Đa Biến Can Thiệp và Đa Kết Quả (Slide 6, 7):**
  * *Biểu diễn logic:* 
    $$\begin{pmatrix} \text{ssp} \\ \text{sfp} \\ \text{sfsp} \end{pmatrix}_{\text{Offered (Z)}} \xrightarrow{\text{First Stage}} \begin{pmatrix} \widehat{\text{ssp\_p}} \\ \widehat{\text{sfp\_p}} \\ \widehat{\text{sfsp\_p}} \end{pmatrix}_{\text{Predicted Actual (D)}} \xrightarrow{\text{Second Stage}} \begin{pmatrix} \text{GPA\_year} \\ \text{prob\_year} \\ \text{credits\_earned} \end{pmatrix}_{\text{Outcomes (Y)}}$$
  * *Cơ chế thực tế:* 
    * Chạy thực nghiệm các dòng lệnh 45–47 với cú pháp hệ thống: `xi: ivregress 2sls [Y] [Covariates] (ssp_p sfp_p sfsp_p = ssp sfp sfsp), r clu(id)`.
    * Hệ thống giải quyết đồng thời bài toán đa biến can thiệp nội sinh bằng cách dùng 3 biến phân bổ ngẫu nhiên (`ssp`, `sfp`, `sfsp`) làm biến công cụ ngoại sinh tương ứng cho 3 biến tham gia thực tế (`ssp_p`, `sfp_p`, `sfsp_p`).
    * Mô hình đánh giá toàn diện tác động can thiệp nhân quả trên 3 chiều kích kết quả học tập khác nhau: Điểm trung bình năm (`GPA_year`), xác suất vượt qua kỳ thi/không bị cảnh báo học tập (`prob_year`), và số tín chỉ tích lũy được (`credits_earned`).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 8)
* **Theo góc nhìn Tiền Thống Kê & Khám Phá Cấu Trúc Dữ Liệu (Pre-modeling Diagnostics):**
  * *Mục tiêu:* Nhận diện bản chất phân phối của dữ liệu và kiểm định cân bằng ngẫu nhiên trước khi chạy các mô hình phức tạp.
  * *Hành động can thiệp:* Bắt buộc thực hiện thống kê mô tả toàn diện (so sánh giá trị trung bình giữa các nhóm, vẽ biểu đồ hộp boxplot, kiểm tra độ phân tán) để sớm phát hiện ra cấu trúc lồng ghép hoặc sự mất cân bằng giữa nhóm can thiệp và đối chứng.
* **Theo góc nhìn Quản trị Hiện Trường & Định Vị Tác Nhân (Stakeholder Differentiation):**
  * *Mục tiêu:* Tránh nhầm lẫn giữa đề xuất chính sách và mức độ tiếp nhận thực tế của đối tượng thụ hưởng.
  * *Hành động can thiệp:* Thiết lập các biến số phân định rõ ràng giữa "Ai là người được chỉ định nhận can thiệp" (Intention) và "Ai là người thực tế tham gia hoặc chịu tác động lan tỏa" (Actual acceptance/Affected); áp dụng mô hình IV để bóc tách tác động nhân quả thuần túy khi tỷ lệ bỏ cuộc hoặc lan tỏa ngoài ý muốn diễn ra phổ biến.
* **Theo góc nhìn Thiết Kế Mô Hình Cho Dữ Liệu Lồng Ghép (Hierarchical Modeling Standard):**
  * *Mục tiêu:* Ngăn ngừa rủi ro bác bỏ sai giả thuyết không (Sai lầm loại I) do bỏ qua tương quan cụm.
  * *Hành động can thiệp:* Coi việc mô hình hóa cấu trúc phân cấp (HLM / phân cụm sai số) là yêu cầu kỹ thuật bắt buộc chứ không phải thao tác nâng cao tùy chọn trong nghiên cứu giáo dục và xã hội; luôn giải thích kết quả hồi quy bằng ngôn ngữ cơ chế chính sách mạch lạc thay vì chỉ dừng lại ở việc báo cáo độ lớn của giá trị $p$-value.
## Phân Bổ Theo Cụm Trong Thử Nghiệm Ngẫu Nhiên (Cluster Assignment in RCT), Hệ Số Tương Quan Nội Cụm (ICC) Và Mô Hình Đa Cấp Điểm Cắt Ngẫu Nhiên (Random-Intercept Multilevel Model)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–13, 16 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm với Cấu trúc Dữ liệu Cụm / Phân cấp (Causal Inference with Clustered/Hierarchical Data - Inferential & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Hiện tượng phân cụm (Clustering Phenomenon): Can thiệp chính sách và giáo dục thường được triển khai ở cấp độ nhóm tự nhiên (lớp học, trường học, giáo viên, quận/huyện) thay vì từng học sinh riêng lẻ. 
  * Vi phạm giả định độc lập: Các quan sát trong cùng một trường chia sẻ chung tài nguyên giáo dục, giáo viên, cơ sở vật chất và môi trường xã hội, dẫn đến sai số của các cá nhân trong cùng nhóm có tương quan nội bộ ($\text{Cov}(\varepsilon_{ig}, \varepsilon_{jg}) \ne 0$).
  * Hệ số tương quan nội cụm (Intraclass Correlation Coefficient - ICC, ký hiệu $\rho$): Đại lượng đo lường tỷ lệ biến thiên của biến kết quả do sự khác biệt giữa các nhóm tạo ra:
    $$\rho = \frac{\sigma^2_{\text{between}}}{\sigma^2_{\text{within}} + \sigma^2_{\text{between}}} = \frac{\sigma_u^2}{\sigma_\varepsilon^2 + \sigma_u^2}$$
    * $\rho = 1$: Không có khác biệt nội bộ nhóm ($\sigma_\varepsilon^2 = 0$), các đối tượng trong cùng trường đồng nhất tuyệt đối.
    * $\rho = 0$: Không có khác biệt giữa các nhóm ($\sigma_u^2 = 0$), các trường hoàn toàn tương đồng nhau.
    * Quy chuẩn thực nghiệm: $\rho \approx 0.01$ là nhỏ, $\rho \approx 0.09$ là trung bình, $\rho \approx 0.25$ là lớn (trong nghiên cứu trường học thực tế, $\rho$ hiếm khi vượt quá $0.20$ và thường dưới $0.05$).
  * Tác động phóng đại sai số chuẩn (Moulton, 1986): Khi có tương quan nội cụm ($\rho > 0$), việc ước lượng OLS thông thường sẽ đánh giá thấp sai số chuẩn thực tế, dẫn đến trị tuyệt đối của thống kê $t$ bị thổi phồng và làm tăng vọt Sai lầm Loại I (bác bỏ sai giả thuyết không):
    $$\frac{\text{Var}(\hat{\beta}_1)}{\text{Var}_{\text{OLS}}(\hat{\beta}_1)} = 1 + (m - 1)\rho > 1$$
    Trong đó: $m$ là quy mô trung bình của mỗi cụm, và $1 + (m - 1)\rho$ là hệ số hiệu ứng thiết kế (Design Effect / Variance Inflation Factor).
  * Mô hình Đa cấp Điểm cắt Ngẫu nhiên (Random-Intercept Multilevel Model):
    * Cấp 1 (Cấp học sinh - Level 1):
      $$Y_{ij} = \beta_{0j} + \varepsilon_{ij}, \quad \varepsilon_{ij} \sim \text{i.i.d } \mathcal{N}(0, \sigma_\varepsilon^2)$$
    * Cấp 2 (Cấp trường học - Level 2):
      $$\beta_{0j} = \gamma_{00} + \gamma_{01} \text{TREAT}_j + u_{0j}, \quad u_{0j} \sim \text{i.i.d } \mathcal{N}(0, \sigma_u^2)$$
    * Mô hình hợp nhất (Composite Model):
      $$Y_{ij} = \gamma_{00} + \gamma_{01} \text{TREAT}_j + (u_{0j} + \varepsilon_{ij})$$
      Trong đó: $\gamma_{00}$ là điểm trung bình chặn cơ sở của toàn hệ thống, $\gamma_{01}$ là tác động can thiệp ở cấp trường, $u_{0j}$ là phần dư đặc trưng của trường $j$ (giữa các trường), và $\varepsilon_{ij}$ là phần dư của học sinh $i$ trong trường $j$ (nội bộ trường). Giả định hiệp phương sai $\text{Cov}(\varepsilon_{ij}, u_{0j}) = 0$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Mô hình OLS coi mỗi học sinh là một đơn vị thông tin hoàn toàn độc lập ($N = 300$), trong khi Mô hình Đa cấp (HLM) phân rã rõ ràng hai nguồn phương sai: phương sai giữa các trường ($\sigma_u^2$) và phương sai giữa các học sinh trong cùng trường ($\sigma_\varepsilon^2$), từ đó hiệu chỉnh đúng kích thước mẫu hiệu dụng (Effective Sample Size) và bảo toàn tính hợp lệ của suy luận thống kê.
### 2. Phân tích các ví dụ minh họa (Slide 2, 9, 14–20 & Transcript)
* **Đánh đổi Thiết kế Lấy Mẫu: 10 trường $\times$ 30 học sinh vs. 300 trường $\times$ 1 học sinh (Slide 2, 7):**
  * *Biểu diễn logic:* 
    $$300 \text{ trường} \times 1 \text{ học sinh} \implies m = 1 \implies 1 + (1 - 1)\rho = 1 \implies \text{Phương sai chuẩn OLS}$$
    $$10 \text{ trường} \times 30 \text{ học sinh} \implies m = 30 \implies 1 + (30 - 1)\rho = 1 + 29\rho \gg 1 \implies \text{Phương sai thực tế bị phóng đại}$$
  * *Cơ chế thực tế:* Về mặt khả thi hiện trường, điều tra 10 trường (mỗi trường 30 em) tiết kiệm chi phí di chuyển và tổ chức hơn rất nhiều so với việc tiếp cận 300 trường khác nhau. Tuy nhiên, nếu $\rho = 0.10$, phương sai thực tế của thiết kế 10 trường sẽ lớn gấp $1 + 29(0.10) = 3.9$ lần so với công thức OLS tính toán, làm sai số chuẩn tăng gần gấp đôi ($\sqrt{3.9} \approx 1.97$).
* **Dự án Cải cách Đọc hiểu Success for All (SFA) trên 41 trường học (Slide 9, 14–19):**
  * *Biểu diễn logic:* 
    $$\text{Model 1 (Gốc): } \beta_{0j} = \gamma_{00} + u_{0j} \longrightarrow \rho_{\text{Model 1}} = \frac{\sigma_{u(1)}^2}{\sigma_{\varepsilon(1)}^2 + \sigma_{u(1)}^2}$$
    $$\text{Model 2 (SFA Main Effect): } \beta_{0j} = \gamma_{00} + \gamma_{01} \text{SFA}_j + u_{0j} \longrightarrow \rho_{\text{Model 2}} = \frac{\sigma_{u(2)}^2}{\sigma_{\varepsilon(2)}^2 + \sigma_{u(2)}^2}$$
    $$\text{Model 3 (SFA + Pretest Covariate): } \beta_{0j} = \gamma_{00} + \gamma_{01} \text{SFA}_j + \gamma_{02} X_j + u_{0j} \longrightarrow \sigma_{u(3)}^2 \ll \sigma_{u(2)}^2$$
  * *Cơ chế thực tế:* Thiết kế thử nghiệm phân bổ ngẫu nhiên can thiệp ở cấp trường (Khối 2 là nhóm can thiệp tại các trường chỉ định, Khối 3–5 đóng vai trò đối chứng nội bộ trên 41 trường). Khi chuyển từ Model 1 sang Model 2, biến can thiệp $\text{SFA}_j$ được bổ sung vào cấp trường để ước lượng tác động cải cách giáo dục. Ở Model 3, việc bổ sung thêm biến kiểm soát điểm tiền kiểm tra (Pretest scores cấp trường) giúp giải thích sâu hơn nữa sự chênh lệch nền tảng giữa các trường học.
* **Nghịch lý Biến thiên: Vì sao $\sigma_\varepsilon^2$ giữ nguyên nhưng $\sigma_u^2$ liên tục suy giảm? (Slide 20):**
  * *Biểu diễn logic:* 
    $$\text{Bổ sung biến cấp 2 (Trường): } \text{SFA}_j, \, X_j \implies \begin{cases} \sigma_u^2: \text{Phương sai giữa các trường giảm mạnh } (\sigma_{u(1)}^2 > \sigma_{u(2)}^2 > \sigma_{u(3)}^2) \\ \sigma_\varepsilon^2: \text{Phương sai nội bộ học sinh giữ nguyên } (\sigma_{\varepsilon(1)}^2 \approx \sigma_{\varepsilon(2)}^2 \approx \sigma_{\varepsilon(3)}^2) \end{cases}$$
  * *Cơ chế thực tế:* Cả biến can thiệp $\text{SFA}_j$ và biến kiểm soát điểm số trường $X_j$ đều là các biến số đo lường ở cấp trường (Level 2 predictors). Chúng chỉ có năng lực giải thích phần dao động giữa trường này với trường khác, do đó hấp thụ phần dư $u_{0j}$ và kéo phương sai $\sigma_u^2$ giảm xuống. Ngược lại, mô hình không đưa thêm bất kỳ biến đặc trưng nào ở cấp độ cá nhân học sinh (Level 1 covariates như giới tính, hoàn cảnh gia đình, nỗ lực học tập của từng em), khiến phần biến thiên không giải thích được giữa các học sinh trong cùng một trường ($\sigma_\varepsilon^2$) hoàn toàn không đổi qua cả 3 mô hình.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 7, 8, 20 & Transcript)
* **Theo góc nhìn Thiết kế Thử nghiệm Thực địa & Tối ưu hóa Ngân sách (Cluster Trial Design):**
  * *Mục tiêu:* Cân đối giữa tính khả thi vận hành và năng lực kiểm định thống kê (Statistical Power).
  * *Hành động can thiệp:* Nhận diện rõ quy luật: tăng số lượng cụm (tăng số trường $J$) mang lại năng lực thống kê lớn hơn rất nhiều so với việc tăng số lượng đối tượng trong một cụm (tăng số học sinh $m$ trên mỗi trường); trước khi triển khai thực địa, luôn ước tính trước ICC từ các nghiên cứu tiền trạm để tính toán chính xác cỡ mẫu cụm tối thiểu cần thiết theo hệ số hiệu ứng thiết kế $1 + (m - 1)\rho$.
* **Theo góc nhìn Kiểm soát Rủi ro Thống kê (Mitigating False Discoveries):**
  * *Mục tiêu:* Tránh ngộ nhận chính sách do sai số chuẩn bị thu hẹp giả tạo khi chạy mô hình OLS truyền thống trên dữ liệu lồng ghép.
  * *Hành động can thiệp:* Bắt buộc áp dụng Mô hình Đa cấp (HLM / Multilevel Mixed Effects) hoặc sử dụng sai số chuẩn hiệu chỉnh theo cụm (`vce(cluster school_id)` trong Stata) khi đơn vị can thiệp là cấp trường/lớp; tuyệt đối không sử dụng OLS thuần túy để tránh mắc Sai lầm Loại I và phê duyệt những chính sách thực chất không có hiệu quả.
* **Theo góc nhìn Chiến lược Bổ sung Biến Kiểm soát Đa Tầng (Multi-level Covariate Strategy):**
  * *Mục tiêu:* Tối ưu hóa việc làm giảm phương sai dư để thu hẹp khoảng tin cậy của hiệu ứng can thiệp.
  * *Hành động can thiệp:* Nhận diện rõ bản chất cấp bậc của các hiệp biến: đưa biến kiểm soát cấp trường (như khu vực địa lý, cơ sở vật chất trường) để giảm $\sigma_u^2$; đồng thời thu thập thêm các biến kiểm soát cấp học sinh (như điểm kiểm tra đầu vào cá nhân, thời gian tự học) để hấp thụ $\sigma_\varepsilon^2$, từ đó làm giảm toàn diện phương sai sai số gộp và nâng cao độ chuẩn xác của ước lượng can thiệp chính sách.
## Tổng Kết Toàn Diện Khung Thử Nghiệm Ngẫu Nhiên Có Đối Chứng (RCT): Từ Tiêu Chuẩn Vàng Đến Xử Lý Thách Thức Thực Địa Bằng IVE, HLM Và Phân Tích Năng Lực Thống Kê

### 1. Bản chất & Định nghĩa cốt lõi (Slide 7 & Tổng hợp Toàn Chương)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm, Kiểm soát Nhiễu Hiện trường & Thiết kế Đa tầng (Experimental Causal Inference, Field Confounding Control & Multilevel Experimental Design - Inferential & Methodological Synthesis)**.
* **Bản chất kỹ thuật:** 
  * Thiết lập một chu trình khép kín từ lý thuyết nền tảng đến thực thi hiện trường và ước lượng kinh tế lượng nhằm bảo toàn giá trị nhân quả:
    $$\text{Lý tưởng: Gán ngẫu nhiên (RCT)} \xrightarrow{\text{Thực địa}} \begin{cases} \text{Bị vi phạm bởi Crossover} \implies \text{Biến công cụ (IVE / Wald Estimator)} \\ \text{Bị vi phạm bởi Tương quan cụm} \implies \text{Mô hình Đa cấp (HLM / Random Intercept)} \\ \text{Ràng buộc ngân sách \& mẫu} \implies \text{Phân tích Năng lực Thống kê (Power Analysis)} \end{cases}$$
  * Hệ thống 5 thành phần phương pháp luận cốt lõi:
    1. *RCT là "Tiêu chuẩn vàng" (Gold Standard):* Cơ chế bốc thăm ngẫu nhiên bảo đảm trạng thái can thiệp $T$ hoàn toàn độc lập với các kết quả tiềm năng ($T \perp (Y_1, Y_0)$), triệt tiêu hoàn toàn sai lệch tự lựa chọn ($\text{Selection Bias} = 0$), đưa hiệu ứng quan sát về đúng Hiệu ứng Can thiệp Trung bình:
       $$\mathbb{E}[Y \mid T=1] - \mathbb{E}[Y \mid T=0] = \text{ATE} = \text{ATT}$$
    2. *Thách thức nghiên cứu thực địa (Field Research Challenges):* Môi trường xã hội thực tế phát sinh các vi phạm giả định nghiêm trọng: hiệu ứng lan tỏa (Spillover vi phạm SUTVA), hiệu ứng tâm lý (Hawthorne/John Henry effects), hiện tượng đối tượng tự ý đổi nhóm (Crossover/Non-compliance), cùng rào cản đạo đức và chi phí tổ chức.
    3. *Giải pháp Biến công cụ (IVE) cho bài toán hoán đổi nhóm (Cross-confounding):* Tận dụng chính phép gán ngẫu nhiên ban đầu ($Z \in \{0, 1\}$) làm biến công cụ ngoại sinh hoàn hảo cho hành vi can thiệp thực tế ($D \in \{0, 1\}$), ước lượng Hiệu ứng Can thiệp Cục bộ (LATE) qua tỷ số Wald:
       $$\beta_{\text{Wald}} = \frac{\mathbb{E}[Y \mid Z=1] - \mathbb{E}[Y \mid Z=0]}{\mathbb{E}[D \mid Z=1] - \mathbb{E}[D \mid Z=0]} = \frac{\text{ITT}_Y}{\text{ITT}_D}$$
    4. *Sai số cụm và Mô hình Đa cấp (Clustering Residuals & HLM):* Khi việc phân bổ can thiệp diễn ra ở cấp nhóm (trường, lớp), sự tương quan nội cụm ($\rho / \text{ICC} > 0$) làm phóng đại phương sai OLS theo hệ số Moulton:
       $$\text{VIF} = 1 + (m - 1)\rho$$
       Mô hình Random-Intercept tách biệt phương sai giữa các nhóm ($\sigma_u^2$) và nội bộ nhóm ($\sigma_\varepsilon^2$), khôi phục tính chuẩn xác của sai số chuẩn:
       $$Y_{ij} = (\gamma_{00} + u_{0j}) + \gamma_{01} \text{TREAT}_j + \varepsilon_{ij}$$
    5. *Phân tích Năng lực Thống kê (Statistical Power Analysis):* Xác định phương sai ước lượng theo cấu trúc mẫu hai tầng của Raudenbush & Liu:
       $$\text{Var}(\hat{\gamma}_{01}) = \frac{4}{J} \left( \sigma_u^2 + \frac{\sigma_\varepsilon^2}{n} \right)$$
       Chứng minh việc mở rộng số lượng cụm ($J$) mang tính quyết định để đẩy công suất kiểm định vượt ngưỡng chuẩn mực $80\%$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Chuyển hóa tư duy từ "RCT lý tưởng trong phòng thí nghiệm" sang "Kinh tế lượng ứng dụng thích ứng với thực địa". Khung tổng hợp này không loại bỏ thử nghiệm khi gặp lỗi không tuân thủ hoặc tương quan cụm, mà cung cấp các công cụ toán học chuẩn xác (IVE, HLM, Power formula) để hiệu chỉnh sai số và thu hồi kết luận nhân quả vững chắc.
### 2. Phân tích các ví dụ minh họa (Slide 7 & Tổng hợp Toàn Chương)
* **Quy trình Khắc phục Hiện tượng Bỏ cuộc / Hoán đổi bằng Tỷ số Wald (Slide 7 & Chương IVE):**
  * *Biểu diễn logic:* 
    $$Z_i \in \{0, 1\} \xrightarrow{\Delta P_{\text{Compliance}} = \text{ITT}_D} D_i \in \{0, 1\} \xrightarrow{\text{Reduced Form}} Y_i \implies \beta_{\text{IVE}} = \frac{\text{ITT}_Y}{\text{ITT}_D} > \text{ITT}_Y$$
  * *Cơ chế thực tế:* Trong các chương trình can thiệp giáo dục hay đào tạo nghề, tỷ lệ học sinh thực tế tham gia luôn thấp hơn tỷ lệ được mời. Nhà phân tích báo cáo $\text{ITT}_Y$ nhằm phản ánh đúng tác động vĩ mô của chính sách khi triển khai diện rộng, đồng thời dùng biến công cụ $Z_i$ để phóng đại hiệu ứng trở lại qua hệ số $\frac{1}{\text{ITT}_D}$, bóc tách đúng tác động thuần túy của nội dung can thiệp lên những học sinh thực sự tuân thủ (Compliers).
* **Đánh đổi Giữa Quy mô Cụm và Số lượng Cụm trong Dự án Giáo dục Cấp Trường (Slide 7 & Chương HLM/Power):**
  * *Biểu diễn logic:* 
    $$\text{Tăng số học sinh trong trường: } n = 30 \to 100 \implies \frac{\sigma_\varepsilon^2}{n} \to 0 \implies \text{Power tiệm cận đường trần (Plateau)}$$
    $$\text{Tăng số trường khảo sát: } J = 20 \to 40 \implies \frac{4}{J} \sigma_u^2 \downarrow \ 50\% \implies \text{Power bứt phá vượt } 80\%$$
  * *Cơ chế thực tế:* Trong các thử nghiệm quy mô lớn như dự án cải cách trường học SFA, do học sinh trong cùng một trường có điểm số tương quan với nhau ($\rho > 0$), việc cố gắng khảo sát thêm học sinh trong cùng một trường mang lại giá trị gia tăng thông tin biên rất nhỏ. Thay vào đó, việc phân bổ nguồn lực tài chính để mở rộng thêm số lượng trường ($J$) giúp triệt tiêu phần lớn phương sai liên trường $\sigma_u^2$, trực tiếp giải phóng năng lực thống kê để kiểm định đạt ý nghĩa khoa học.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 7 & Tổng hợp Toàn Chương)
* **Theo góc nhìn Thiết kế Thử nghiệm Tiên nghiệm (A-priori Experimental Engineering):**
  * *Mục tiêu:* Tối ưu hóa phân bổ nguồn lực khảo sát và bảo đảm khả năng phát hiện hiệu ứng chính sách.
  * *Hành động can thiệp:* Tính toán trước chỉ số tương quan nội cụm ($\text{ICC}$) từ dữ liệu lịch sử; xây dựng phương án lấy mẫu ưu tiên mở rộng số cụm trường/địa phương ($J$) thay vì lấy mẫu toàn bộ học sinh trong trường; luôn thu thập các biến kiểm soát nền tảng (pretest scores) để đưa vào mô hình nhằm hấp thụ phương sai dư và nâng cao công suất kiểm định.
* **Theo góc nhìn Quản trị Vận hành Hiện trường (Field Protocol & Threat Mitigation):**
  * *Mục tiêu:* Giảm thiểu rủi ro xói mòn giá trị nội tại từ các tương tác hành vi con người.
  * *Hành động can thiệp:* Thiết kế ranh giới cách ly địa lý hoặc ngẫu nhiên hóa theo cụm trường học nhằm triệt tiêu hiệu ứng lan tỏa kiến thức (Spillover); áp dụng nhóm đối chứng tích cực hoặc giả dược để trung hòa hiệu ứng tâm lý Hawthorne/John Henry; ghi nhận chi tiết dữ liệu thực nhận can thiệp để chuẩn bị cho bước hồi quy biến công cụ.
* **Theo góc nhìn Ra Quyết định Chính sách Công (Policy Evaluation & Reporting Framework):**
  * *Mục tiêu:* Cung cấp bằng chứng định lượng đa tầng, minh bạch cho các nhà hoạch định chiến lược.
  * *Hành động can thiệp:* Báo cáo đồng thời kết quả ITT (đánh giá tính khả thi tài chính và mức độ chấp nhận thực tế của xã hội) cùng kết quả IVE/LATE (đánh giá hiệu lực kỹ thuật thực chất của bản thân can thiệp); bắt buộc sử dụng mô hình Random-Intercept HLM khi dữ liệu có cấu trúc cụm để đảm bảo các kết luận khoa học không bị đánh lừa bởi các giá trị $p$-value sai lệch do OLS thông thường tạo ra.
## Thực Hành Mô Hình Tuyến Tính Đa Cấp (HLM) Trên Stata: Phân Rã Phương Sai, Can Thiệp Cấp Trường Và Kỹ Thuật Định Tâm (Centering)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 2, 5–8 & Transcript)
* **Phân loại nhiệm vụ:** **Mô hình hóa Dữ liệu Lồng ghép Phân cấp & Ước lượng Can thiệp Thực nghiệm (Hierarchical Linear Modeling & Variance Decomposition - Explanatory & Inferential Modeling)**.
* **Bản chất kỹ thuật:** 
  * Cấu trúc dữ liệu phân cấp lồng lồng (Nested Structure): Học sinh $i$ lồng trong các đơn vị cấp cao hơn là trường học $j$. Do chia sẻ chung giáo viên, tài nguyên giảng dạy và môi trường quản lý, sai số giữa các học sinh trong cùng trường có tương quan nội bộ ($\text{Cov}(\varepsilon_{ij}, \varepsilon_{i'j}) \ne 0$), vi phạm giả định độc lập quan sát của OLS và làm sai số chuẩn bị đánh giá thấp nghiêm trọng.
  * Mô hình Rỗng (Unconditional / Empty Model):
    $$Y_{ij} = \beta_{0j} + e_{ij} = \gamma_{00} + u_{0j} + e_{ij}$$
    Trong đó, tổng phương sai của biến kết quả được phân rã thành hai thành phần độc lập:
    $$\text{Var}(Y_{ij}) = \sigma_u^2 + \sigma_e^2$$
    * $\sigma_u^2$ (`sigma_u`$^2$): Phương sai giữa các trường (Between-school variance), phản ánh độ phân tán của trung bình các trường quanh trung bình chung $\gamma_{00}$.
    * $\sigma_e^2$ (`sigma_e`$^2$): Phương sai nội bộ học sinh (Within-school variance), phản ánh độ phân tán của từng học sinh quanh trung bình của trường mình.
    * Hệ số tương quan nội cụm (ICC / $\rho$):
      $$\rho = \frac{\sigma_u^2}{\sigma_u^2 + \sigma_e^2}$$
  * Cơ chế giải thích phương sai đa tầng:
    * Biến cấp trường ($W_j \in \{\text{sfa}_j, \text{sch\_ppvt}_j\}$): Chỉ hấp thụ phần dao động giữa trường này với trường khác, làm giảm phương sai giữa các trường ($\sigma_u^2 \downarrow$) trong khi giữ nguyên phương sai nội bộ ($\sigma_e^2 \approx \text{const}$).
    * Biến cấp học sinh ($X_{ij} \in \{\text{ppvt}_{ij}\}$): Hấp thụ sự khác biệt năng lực giữa các cá nhân, trực tiếp kéo giảm phương sai nội bộ học sinh ($\sigma_e^2 \downarrow$).
  * Giới hạn kỹ thuật của Mô hình Tác động Cố định (Fixed Effects):
    $$\text{xtreg } Y_{ij} \quad W_j, \, \text{fe} \implies W_j - \bar{W}_j = 0 \implies W_j \text{ bị loại bỏ do đa cộng tuyến hoàn hảo}$$
  * Kỹ thuật định tâm biến số (Centering Strategies):
    * Định tâm theo trung bình chung (Grand-Mean Centering - GMC): $X_{ij}^* = X_{ij} - \bar{X}_{..}$. Chuyển dịch điểm cắt (intercept) về giá trị kỳ vọng của một đối tượng có mức điểm trung bình toàn hệ thống.
    * Định tâm theo trung bình nhóm (Group-Mean Centering - CWC): $X_{ij}^* = X_{ij} - \bar{X}_{.j}$. Tách biệt hoàn toàn tác động nội nhóm (within-group effect) khỏi tác động giữa các nhóm (between-group effect).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * HLM giải quyết triệt để vấn đề sai số cụm mà OLS mắc phải, đồng thời bóc tách rành mạch nguồn gốc phương sai được giải thích ở từng cấp độ; kỹ thuật định tâm loại bỏ sự phụ thuộc vô nghĩa của hệ số chặn vào mốc số 0 tuyệt đối và ngăn ngừa hiện tượng đa cộng tuyến giữa cấp 1 và cấp 2.
### 2. Phân tích các ví dụ minh họa (Slide 3–11 & Transcript)
* **Khám phá Phân phối và Ước lượng Mô hình Rỗng trong Stata (Slide 3–5):**
  * *Biểu diễn logic:* 
    $$\text{graph box wattack, over(schid)} \implies \text{Median \& IQR phân hóa mạnh giữa 41 trường}$$
    $$\text{xtreg wattack, i(schid)} \implies \begin{cases} \sigma_u^2 = e(\text{sigma\_u})^2 \\ \sigma_e^2 = e(\text{sigma\_e})^2 \end{cases} \implies \text{ICC} = \frac{e(\text{sigma\_u})^2}{e(\text{sigma\_u})^2 + e(\text{sigma\_e})^2}$$
  * *Cơ chế thực tế:* Biểu đồ hộp `graph box` chỉ ra mức điểm kỹ năng đọc `wattack` có sự chênh lệch rõ nét về trung vị và độ phân tán giữa các trường (`schid`). Khi chạy mô hình rỗng `xtreg wattack, i(schid)`, Stata ước lượng mô hình ngẫu nhiên không có biến giải thích. Phép trích xuất `display e(sigma_u)^2` và `display e(sigma_e)^2` cho phép tính chính xác tỷ lệ ICC, chứng minh tỷ trọng phương sai đáng kể bắt nguồn từ cấp trường, làm cơ sở bác bỏ mô hình hồi quy tuyến tính cổ điển `reg wattack`.
* **Động thái Biến thiên Phương sai Khi Đưa Biến Cấp 2 và Cấp 1 (Slide 6, 7):**
  * *Biểu diễn logic:* 
    $$\text{Thêm } \text{sfa}_j \xrightarrow{\text{xtreg wattack sfa, i(schid)}} \sigma_u^2 \downarrow, \quad \sigma_e^2 \approx \text{giữ nguyên}$$
    $$\text{Thêm } \text{sch\_ppvt}_j \xrightarrow{\text{xtreg wattack sfa sch\_ppvt, i(schid)}} \sigma_u^2 \downarrow\downarrow, \quad \sigma_e^2 \approx \text{giữ nguyên}$$
    $$\text{Thêm } \text{ppvt}_{ij} \xrightarrow{\text{xtreg wattack sfa ppvt sch\_ppvt, i(schid)}} \sigma_e^2 \downarrow, \quad \sigma_u^2 \downarrow \ (\text{giải thích sâu hơn})$$
  * *Cơ chế thực tế:* Biến can thiệp cải cách đọc `sfa` và biến điểm kiểm tra từ vựng trung bình cấp trường `sch_ppvt` là các biến số bất biến trong cùng một trường (Level 2). Khi đưa vào phương trình, chúng chỉ hấp thụ phần biến thiên giữa các trường, khiến `sigma_u`$^2$ giảm mạnh trong khi `sigma_e`$^2$ gần như giữ nguyên. Ngược lại, biến điểm kiểm tra đầu vào của từng cá nhân `ppvt` là biến cấp học sinh (Level 1); khi xuất hiện trong mô hình, nó hấp thụ sự chênh lệch năng lực bẩm sinh giữa các học sinh cùng trường, làm cho `sigma_e`$^2$ giảm đi rõ rệt.
* **Nghịch lý Mô hình Fixed Effects và Kỹ thuật Định Tâm (Slide 8–11):**
  * *Biểu diễn logic:* 
    $$\text{xtreg wattack sfa sch\_ppvt, fe clu(schid)} \implies \text{sfa và sch\_ppvt bị omit hoàn toàn}$$
    $$\text{ppvt\_devgm} = \text{ppvt} - 90.4006 \implies Y_{ij} = \beta_{0j} + \beta_1 (\text{ppvt}_{ij} - \bar{X}_{..}) \implies \beta_0 = \mathbb{E}[Y \mid \text{Học sinh có } \text{ppvt} = 90.4]$$
    $$\begin{cases} \text{ppvt\_devsm} = \text{ppvt} - \text{sch\_ppvt} \\ \text{sch\_ppvt\_devgm} = \text{sch\_ppvt} - 90.4006 \end{cases} \implies Y_{ij} = \gamma_{00} + \beta_W \text{ppvt\_devsm}_{ij} + \beta_B \text{sch\_ppvt\_devgm}_j + u_{0j} + e_{ij}$$
  * *Cơ chế thực tế:* Dòng lệnh 109 chạy mô hình `fe` sẽ thất bại vì phép biến đổi sai phân nội nhóm (within transformation) triệt tiêu hoàn toàn các biến không đổi theo thời gian/nhóm, khiến biến can thiệp `sfa` bị loại bỏ. Để giữ lại `sfa`, bắt buộc dùng Random Intercept. Ở các dòng lệnh 9–11, việc trừ đi điểm trung bình chung ($90.4006$) giúp hệ số chặn có ý nghĩa thực tế (điểm kỳ vọng của học sinh trung bình cả nước). Việc phân rã tiếp thành độ lệch so với trường (`ppvt_devsm`) và độ lệch trường so với cả nước (`sch_ppvt_devgm`) giúp mô hình bóc tách đồng thời hai tác động: nỗ lực vượt trội của học sinh so với bạn cùng trường ($\beta_W$) và hiệu ứng trường học chất lượng cao ($\beta_B$).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 7, 8, 11 & Transcript)
* **Theo góc nhìn Thiết kế Kỹ thuật Mô hình & Kiểm tra Khả thi trong Stata:**
  * *Mục tiêu:* Đảm bảo các biến chính sách cấp trường được nhận diện và ước lượng thành công.
  * *Hành động can thiệp:* Nhận diện rõ ràng: khi biến can thiệp chính sách hoặc biến điều trị được gán ở cấp trường, tuyệt đối không sử dụng mô hình tác động cố định `xtreg, fe` vì sẽ dẫn tới bẫy đa cộng tuyến hoàn hảo; lựa chọn mô hình điểm cắt ngẫu nhiên `xtreg, re` hoặc `xtreg, i(schid)` kèm tùy chọn sai số cụm `clu(schid)` để bảo vệ độ chính xác của sai số chuẩn.
* **Theo góc nhìn Đo lường và Bóc tách Động cơ Tác động (Mechanism Analysis):**
  * *Mục tiêu:* Xác định chính xác nguồn gốc phương sai được can thiệp hấp thụ để đánh giá hiệu quả chương trình.
  * *Hành động can thiệp:* Luôn so sánh giá trị $\sigma_u^2$ và $\sigma_e^2$ trước và sau khi bổ sung biến số; nếu muốn cải thiện năng lực kiểm định cho hiệu ứng cấp trường `sfa`, cần bổ sung các biến kiểm soát cấp trường mạnh (như `sch_ppvt`) để triệt tiêu phương sai giữa các trường, giúp khoảng tin cậy của hệ số can thiệp thu hẹp lại.
* **Theo góc nhìn Chuẩn hóa Báo cáo Chính sách Qua Kỹ thuật Định Tâm (Centering Governance):**
  * *Mục tiêu:* Tránh việc diễn giải hệ số chặn vô nghĩa và phân định rõ ràng giữa hiệu ứng cá nhân và hiệu ứng cụm.
  * *Hành động can thiệp:* Bắt buộc thực hiện định tâm theo trung bình chung (Grand-mean centering) đối với các thang đo không có điểm 0 tự nhiên trước khi đưa vào mô hình HLM; áp dụng định tâm theo trung bình nhóm (Group-mean centering) khi người ra quyết định cần so sánh giữa tác động của năng lực cá thể học sinh với tác động của văn hóa và môi trường học tập của nhà trường.
# Difference in Differences
## Ý Tưởng Cơ Bản Của Thí Nghiệm Tự Nhiên Trong Suy Luận Nhân Quả (Basic Idea of Natural Experiments)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Bán thực nghiệm (Causal Inference & Quasi-Experimental Evaluation - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Khái niệm Thí nghiệm tự nhiên (Natural Experiment): Là trạng thái thực nghiệm xã hội phát sinh khách quan, trong đó các đối tượng nghiên cứu được phân bổ ngẫu nhiên (hoặc chuẩn ngẫu nhiên - as-if random) vào nhóm can thiệp (treatment group) và nhóm đối chứng (control group) bởi các **cú sốc ngoại sinh** (external shocks: thiên tai, cải cách chính sách giáo dục bất ngờ, điều chỉnh địa giới hành chính) thay vì do nhà nghiên cứu chủ động dàn dựng hay do đối tượng tự ý lựa chọn.
  * Cơ sở logic của ước lượng không chệch (Logical basis for unbiased estimation):
    $$\text{Cú sốc ngoại sinh } Z \implies \text{Phân bổ } D \perp (Y_{1}, Y_{0}) \iff \mathbb{E}[Y_{0i} \mid D_i = 1] = \mathbb{E}[Y_{0i} \mid D_i = 0]$$
    * Do việc phân chia nhóm có tính ngoại sinh (exogenous allocation), kỳ vọng kết quả trước can thiệp giữa hai nhóm là hoàn toàn tương đương nhau.
    * Đặc tính nền tảng (baseline balance characteristics) giữa hai nhóm đạt trạng thái tương đồng cao nhất có thể, từ đó triệt tiêu thiên lệch tự lựa chọn (selection bias $\to 0$).
  * Vị trí trong hệ thống phương pháp nghiên cứu định lượng (Slide 2, 4):
    $$\text{Thử nghiệm Ngẫu nhiên Đối chứng (RCT)} \xrightarrow{\text{Gặp rào cản thực tế}} \text{Thí nghiệm Tự nhiên} \longrightarrow \begin{cases} \text{Difference-in-Differences (DID)} \\ \text{Regression Discontinuity (RD)} \\ \text{Instrumental Variables (IV)} \\ \text{Propensity Score Matching (PSM)} \end{cases}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * So với RCT (thử nghiệm do nhà nghiên cứu thiết kế - Gold Standard), thí nghiệm tự nhiên không chủ động kiểm soát quy trình gán ngẫu nhiên trong phòng thí nghiệm mà **nhận diện và khai thác tính ngẫu nhiên sẵn có của các sự kiện thực tế**, thu thập dữ liệu định kỳ trước và sau cú sốc. Điều này giúp vượt qua hoàn toàn các hạn chế nan giải của RCT về chi phí vận hành, tính bất khả thi và rào cản đạo đức.
### 2. Phân tích các ví dụ minh họa (Slide 2–6)
* **Bảy mối đe dọa đối với tính hợp lệ của thử nghiệm RCT (Threats to RCT Validity - Slide 3):**
  * *Biểu diễn logic:* 
    $$\text{RCT Nhân tạo} \xrightarrow{\text{Can thiệp thực địa}} \begin{bmatrix} \text{Hiệu ứng Lan tỏa (Spillover)} \\ \text{Hiệu ứng Hawthorne / John Henry} \\ \text{Hiệu ứng Giả dược (Placebo Effect)} \\ \text{Chéo mẫu \& Ô nhiễm (Crossover/Contamination)} \\ \text{Giới hạn Ngoại suy (External Validity)} \\ \text{Gánh nặng Chi phí (Cost \& Feasibility)} \\ \text{Vi phạm Đạo đức (Ethics)} \end{bmatrix} \implies \text{Ước lượng } \hat{\tau}_{\text{RCT}} \text{ bị sai lệch}$$
  * *Cơ chế thực tế:* Trong giáo dục, nhà nghiên cứu không thể tước đoạt cơ hội đến trường của trẻ em nghèo để làm nhóm đối chứng (Ethics); học sinh nhóm can thiệp có thể học tập tích cực hơn đơn thuần vì biết mình đang bị quan sát (Hawthorne effect); học sinh nhóm đối chứng có thể nỗ lực cạnh tranh bất thường (John Henry effect) hoặc tiếp cận tài liệu của nhóm can thiệp (Spillovers/Contamination). Thí nghiệm tự nhiên giải quyết các biến dạng hành vi này vì đối tượng vận động hoàn toàn tự nhiên trong đời sống thực.
* **Cơ chế Phân bổ Ngoại sinh từ Cú sốc Chính sách Thực tế (Slide 5, 6):**
  * *Biểu diễn logic:* 
    $$\text{Chính sách Đột xuất } (Z) \longrightarrow \begin{cases} 
      \text{Nhóm Can thiệp } (D = 1): & \text{Thế hệ học sinh chịu áp dụng luật học chế mới} \\ 
      \text{Nhóm Đối chứng } (D = 0): & \text{Thế hệ học sinh sinh trước mốc thời gian áp dụng} 
    \end{cases}$$
    $$\text{Đặc tính nền: } \bar{X}_{D=1}^{\text{pre}} \approx \bar{X}_{D=0}^{\text{pre}} \implies \hat{\tau} = \Delta \bar{Y}^{\text{post}} - \Delta \bar{Y}^{\text{pre}}$$
  * *Cơ chế thực tế:* Khi một chính sách (ví dụ: bãi bỏ học phí phổ cập hoặc quy định tuổi nhập học) được ban hành đột ngột tại một thời điểm hoặc khu vực nhất định, sự phân chia giữa người được hưởng và người không được hưởng không phụ thuộc vào ý chí chủ quan hay năng lực của học sinh. Sự cân bằng nền tảng giữa hai thế hệ/vùng giáp ranh bảo đảm tính ngoại sinh tuyệt đối, giúp ước lượng nhân quả tiệm cận độ chuẩn xác của một thử nghiệm lý tưởng.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–6)
* **Theo góc nhìn Nhận diện Tiền đề và Khai thác Dữ liệu (Identification Strategy):**
  * *Mục tiêu:* Tận dụng tối đa các biến động khách quan của đời sống kinh tế - xã hội để trả lời các câu hỏi chính sách lớn mà không thể thử nghiệm nhân tạo.
  * *Hành động can thiệp:* Nhà nghiên cứu cần liên tục theo dõi các thay đổi đột ngột về thể chế, thiên tai, quy hoạch hoặc điều chỉnh chính sách vĩ mô; chủ động thu thập chuỗi dữ liệu bảng (panel data) đo lường trước và sau thời điểm diễn ra cú sốc ngoại sinh.
* **Theo góc nhìn Kiểm soát Rủi ro Thiên lệch Lựa chọn (Selection Bias Mitigation):**
  * *Mục tiêu:* Bảo đảm tính vững của giả định ngoại sinh trước khi đưa ra kết luận nhân quả.
  * *Hành động can thiệp:* Tiến hành các kiểm định cân bằng cơ bản (Baseline Balance Tests) về nhân khẩu học, thu nhập, năng lực đầu vào giữa nhóm can thiệp và nhóm đối chứng trước thời điểm xảy ra cú sốc; kiểm tra xem có hiện tượng dự đoán trước chính sách (anticipation effect) dẫn đến hành vi tự lựa chọn hay không.
* **Theo góc nhìn Tích hợp Khung Phương pháp Luận Bán Thực nghiệm (Methodological Cross-Application):**
  * *Mục tiêu:* Thiết lập mô hình kinh tế lượng phù hợp với cấu trúc phân bổ của thí nghiệm tự nhiên.
  * *Hành động can thiệp:* Nếu cú sốc ngoại sinh phân hóa theo thời gian và không gian, triển khai mô hình Sai phân trong sai phân (DID); nếu chính sách tạo ra ngưỡng điểm ngắt ngẫu nhiên, áp dụng Hồi quy gián đoạn (RD); nếu cú sốc tác động gián tiếp qua việc thay đổi xác suất tham gia, lựa chọn phương pháp Biến công cụ (IV) để bóc tách tác động xử lý trung bình cục bộ (LATE).
## Ước Lượng Sai Phân Trong Sai Phân (Difference-in-Differences - DID) và Đánh Giá Chính Sách Trợ Cấp Giáo Dục SSSB
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–15 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Tác động Bán thực nghiệm (Causal Inference & Quasi-Experimental Policy Evaluation - Evaluative & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Phương pháp ước lượng hiệu ứng can thiệp trung bình bằng cách triệt tiêu đồng thời hai nguồn sai lệch: sai lệch do đặc tính cố định không quan sát được giữa các nhóm và sai lệch do xu hướng biến động chung theo thời gian.
  * Phép tính sai phân kép trên bảng chéo $2 \times 2$:
    $$\text{DID} = \Delta \bar{Y}_{\text{treatment}} - \Delta \bar{Y}_{\text{control}} = \big(\bar{Y}_{t1} - \bar{Y}_{t0}\big) - \big(\bar{Y}_{c1} - \bar{Y}_{c0}\big) = D_1 - D_2$$
    * *Sai phân bậc một của nhóm can thiệp ($D_1$):* Phản ánh tổng biến động trước và sau can thiệp, bao gồm cả hiệu ứng chính sách thuần túy lẫn xu hướng biến đổi tự nhiên của thời gian.
    * *Sai phân bậc một của nhóm đối chứng ($D_2$):* Đóng vai trò là đại lượng phản thực tế (counterfactual), đại diện cho xu hướng biến thiên chung theo thời gian (time trend) trong điều kiện không chịu tác động của chính sách.
  * Dạng mô hình hồi quy tuyến tính OLS chuẩn mực:
    $$Y_i = \alpha + \beta D_i + \gamma \text{Post}_i + \delta (D_i \times \text{Post}_i) + \mathbf{X}_i'\boldsymbol{\theta} + \varepsilon_i$$
    * $D_i$ (`FatherDec`): Biến giả định danh nhóm can thiệp ($D_i = 1$ nếu thuộc nhóm can thiệp, $D_i = 0$ nếu thuộc nhóm đối chứng).
    * $\text{Post}_i$ (`OFFER`): Biến giả thời gian ($= 1$ ở giai đoạn trước khi chính sách bị bãi bỏ / khi còn trợ cấp, $= 0$ ở giai đoạn sau khi bãi bỏ).
    * $D_i \times \text{Post}_i$: Biến tương tác (interaction term), tích số giữa nhóm và thời gian.
    * $\mathbf{X}_i$: Vector các biến kiểm soát ngoại sinh nhằm giảm phương sai phần dư và thu hẹp sai số chuẩn của ước lượng.
  * Ba giả định nền tảng mang tính sống còn của mô hình DID (Slide 7):
    1. *Cú sốc chính sách phải có tính ngoại sinh (Exogenous Policy Shock):* Việc ban hành hoặc chấm dứt chính sách không do đối tượng nghiên cứu tác động hay dự đoán trước để thay đổi hành vi.
    2. *Không có cú sốc đồng thời đơn biến (No Confounding Policy Shocks):* Không có sự kiện hoặc chính sách nào khác diễn ra cùng thời điểm mà chỉ tác động cục bộ lên một trong hai nhóm.
    3. *Giả định xu hướng song song (Parallel Trends Assumption):* Nếu không có can thiệp chính sách, xu hướng biến thiên theo thời gian của nhóm can thiệp và nhóm đối chứng phải song song tuyệt đối:
       $$\mathbb{E}[Y_{0i, \text{post}} - Y_{0i, \text{pre}} \mid D_i = 1] = \mathbb{E}[Y_{0i, \text{post}} - Y_{0i, \text{pre}} \mid D_i = 0]$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khắc phục triệt để khiếm khuyết của phương pháp so sánh Trước - Sau thuần túy (First Differencing - $D_1$), loại bỏ hoàn toàn nguy cơ gán nhầm tác động của suy thoái kinh tế vĩ mô hoặc các chính sách song hành khác thành hiệu ứng của chương trình can thiệp.
### 2. Phân tích các ví dụ minh họa (Slide 2–6, 8–16 & Transcript)
* **Bối cảnh Bãi bỏ Chương trình Trợ cấp SSSB Năm 1981 (Dynarski, 2003 - Slide 2, 3):**
  * *Biểu diễn logic:* 
    $$\text{Đạo luật 1981} \longrightarrow \begin{cases}        \text{Giai đoạn 1965–1981 (Có SSSB):} & \text{Trợ cấp } \approx \$6,700/\text{năm} \gg \text{Học phí ĐH Công } (\$1,900) \\        \text{Sau tháng 5/1982 (Bãi bỏ hoàn toàn):} & \text{Trợ cấp } = \$0 \implies \text{Tỷ lệ nhập học ĐH trước tuổi 23 giảm sút}      \end{cases}$$
  * *Cơ chế thực tế:* Chương trình SSSB cung cấp gói hỗ trợ tài chính rất lớn cho học sinh có cha đã qua đời. Việc Quốc hội Mỹ bất ngờ xóa bỏ chương trình vào năm 1981 tạo ra một cú sốc ngoại sinh quy mô lớn. Nhóm học sinh có cha mất trở thành nhóm can thiệp (treatment group - bị mất khoản trợ cấp), trong khi nhóm học sinh có cha còn sống trở thành nhóm đối chứng (control group - không bao giờ đủ điều kiện nhận SSSB).
* **Nghịch lý của Sai phân Bậc một và Sự cần thiết của DID (Slide 5, 8, 10):**
  * *Biểu diễn logic:* 
    $$D_1 = \bar{Y}_{t1} - \bar{Y}_{t0} \neq \text{Tác động Nhân quả thuần túy}$$
    $$\text{Thực tế 1979–1983:} \begin{bmatrix} \text{Bãi bỏ đạo luật MISAA (1981)} \\ \text{Biến động kinh tế / Lạm phát} \end{bmatrix} \longrightarrow \text{Kéo giảm tỷ lệ nhập học chung toàn quốc } (D_2 = \text{Time Trend})$$
    $$\text{Hiệu ứng ròng của SSSB: } \delta = D_1 - D_2 = (Y_{t1} - Y_{t0}) - (Y_{c1} - Y_{c0})$$
  * *Cơ chế thực tế:* Nếu chỉ lấy tỷ lệ nhập học của học sinh có cha mất giai đoạn 1979–1981 trừ đi giai đoạn 1982–1983 ($D_1$), mức sụt giảm này bị thổi phồng vì trong giai đoạn 1981, Đạo luật Hỗ trợ Sinh viên Thu nhập Trung bình (MISAA) cũng bị bãi bỏ và nền kinh tế gặp khó khăn. Nhóm học sinh có cha còn sống giúp đo lường chính xác mức độ suy giảm do bối cảnh vĩ mô chung ($D_2$). Trừ đi phần suy giảm chung này sẽ bóc tách được tác động nhân quả ròng của việc bãi bỏ SSSB.
* **Giải phẫu Hệ số Mô hình Hồi quy Tuyến tính (Slide 12–15):**
  * *Biểu diễn logic:* 
    $$\begin{cases}       \mathbb{E}[Y_{c0}] = \alpha & (\text{Nhóm ĐC, sau 1981: Cha còn sống, không có SSSB}) \\       \mathbb{E}[Y_{c1}] = \alpha + \gamma & (\text{Nhóm ĐC, trước 1981: Cha còn sống, giai đoạn trước}) \implies \Delta Y_c = \gamma \\       \mathbb{E}[Y_{t0}] = \alpha + \beta & (\text{Nhóm CT, sau 1981: Cha mất, không còn SSSB}) \\       \mathbb{E}[Y_{t1}] = \alpha + \beta + \gamma + \delta & (\text{Nhóm CT, trước 1981: Cha mất, có SSSB}) \implies \Delta Y_t = \gamma + \delta     \end{cases}$$
    $$\text{DID Result} = \Delta Y_t - \Delta Y_c = (\gamma + \delta) - \gamma = \delta$$
  * *Cơ chế thực tế:* 
    * $\alpha$: Giá trị nền tảng của nhóm đối chứng sau khi chính sách thay đổi.
    * $\beta$: Chênh lệch cố định sẵn có giữa nhóm có cha mất và cha còn sống (đặc tính hoàn cảnh gia đình).
    * $\gamma$: Xu hướng biến động chung của thời gian giữa hai thời kỳ áp dụng cho cả hai nhóm.
    * $\delta$: Hệ số của biến tương tác, chính là ước lượng nhân quả sai phân kép phản ánh độ nhạy của việc nhận gói tài trợ $\$6,700$ lên quyết định học đại học.
* **Kết quả Ước lượng Thực nghiệm của Dynarski (Slide 16):**
  * *Biểu diễn logic:* 
    $$\Delta Y_{\text{Treatment}} = 0.535 - 0.353 = 0.182 \quad (\gamma + \delta)$$
    $$\Delta Y_{\text{Control}} = 0.540 - 0.518 = 0.022 \quad (\gamma)$$
    $$\hat{\delta}_{\text{DID}} = 0.182 - 0.022 = 0.160 \quad (p < 0.01)$$
  * *Cơ chế thực tế:* Bảng kết quả chỉ ra rằng trước năm 1981, tỷ lệ nhập học của nhóm được nhận SSSB là $53.5\%$, sau khi bãi bỏ tụt xuống $35.3\%$ (giảm $18.2$ điểm phần trăm). Trong khi đó, nhóm đối chứng chỉ giảm $2.2$ điểm phần trăm. Sai phân trong sai phân xác nhận khoản trợ cấp SSSB làm tăng xác suất học đại học lên $16$ điểm phần trăm với độ tin cậy thống kê cao.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 7, 8, 12 & Transcript)
* **Theo góc nhìn Kiểm chứng Độ tin cậy & Giá trị Nội tại (Internal Validity Defense):**
  * *Mục tiêu:* Bảo vệ kết quả đánh giá tác động trước sự nghi ngờ về tính hợp lệ của nhóm so sánh.
  * *Hành động can thiệp:* Bắt buộc kiểm tra tiền định đề xu hướng song song (Parallel Trends Test) bằng cách phân tích dữ liệu đa kỳ trước can thiệp (ví dụ từ 1975–1980); chạy các kiểm định giả dược (Placebo Tests) bằng cách gán thời điểm bãi bỏ chính sách giả định vào những năm trước 1981 để chứng minh hệ số tương tác $\hat{\delta}$ bằng 0 khi không có can thiệp thực sự.
* **Theo góc nhìn Thiết kế Kỹ thuật Mô hình Kinh tế lượng:**
  * *Mục tiêu:* Nâng cao hiệu quả thống kê và tránh ước lượng sai số chuẩn bị chệch.
  * *Hành động can thiệp:* Tích hợp thêm các biến kiểm soát nhân khẩu học và hoàn cảnh kinh tế cá nhân vào mô hình hồi quy DID nhằm hấp thụ phương sai dư thừa ($\varepsilon_i$); luôn sử dụng sai số chuẩn cụm (Cluster-Robust Standard Errors) theo từng nhóm đối tượng hoặc tiểu bang để xử lý hiện tượng tự tương quan chuỗi thời gian.
* **Theo góc nhìn Hoạch định Chính sách Tài chính Giáo dục (Policy Design & Resource Allocation):**
  * *Mục tiêu:* Đánh giá hiệu quả kinh tế và độ nhạy biên của sinh viên đối với các gói viện trợ học bổng.
  * *Hành động can thiệp:* Kết quả thực nghiệm chứng minh rào cản tài chính là điểm nghẽn nghiêm trọng đối với các nhóm yếu thế (con em mồ côi); khi thiết kế chính sách an sinh giáo dục, hỗ trợ tài chính trực tiếp kèm theo tiêu chí minh bạch, không ràng buộc thủ tục quá phức tạp mang lại đòn bẩy gia tăng tỷ lệ nhập học đại học cao hơn đáng kể so với các chương trình cho vay tín dụng thông thường.
## Các Giả Định Cốt Lõi và Phương Pháp Kiểm Định Giả Định Xu Hướng Song Song trong Mô Hình Sai Phân trong Sai Phân (Core Assumptions & Parallel Trends Tests in DID)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Đánh giá Tác động Bán thực nghiệm (Causal Inference & Quasi-Experimental Policy Evaluation - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Mô hình hồi quy sai phân trong sai phân (DID) hai chiều cơ bản:
    $$Y_{it} = \alpha + \beta D_i + \gamma t_i + \delta (D_i \times t_i) + \varepsilon_{it}$$
    * Hệ số $\delta$ chỉ phản ánh chính xác hiệu ứng can thiệp nhân quả khi toàn bộ các điều kiện nền tảng được thỏa mãn.
  * Ba giả định cơ bản mang tính sống còn của phương pháp DID:
    1. *Cú sốc chính sách phải có tính ngoại sinh (Exogenous Policy Shocks):* Biến can thiệp $D_i$ phải phát sinh độc lập với các đặc tính tiềm ẩn của đối tượng, không bị chi phối bởi hành vi tự lựa chọn hoặc vận động chính sách chủ quan.
    2. *Không có cú sốc can thiệp đồng thời cục bộ (No Confounding Single-Group Policy Shocks):* Trong suốt khung thời gian nghiên cứu, không tồn tại bất kỳ sự kiện, quy định hoặc cú sốc ngoại cảnh nào khác tác động riêng lẻ lên duy nhất nhóm can thiệp (hoặc nhóm đối chứng).
    3. *Giả định xu hướng song song (Parallel Trends Assumption):* Nếu không có can thiệp chính sách xảy ra, quỹ đạo biến thiên theo thời gian của biến kết quả ở cả hai nhóm phải hoàn toàn song song:
       $$\mathbb{E}[Y_{0,it_1} - Y_{0,it_0} \mid D_i = 1] = \mathbb{E}[Y_{0,it_1} - Y_{0,it_0} \mid D_i = 0]$$
  * Ba phương pháp chuẩn tắc kiểm định giả định xu hướng song song:
    1. *Vẽ biểu đồ xu hướng thời gian (Visual Inspection of Time Trends):* Trực quan hóa đường tiến triển của biến kết quả $Y$ qua nhiều mốc thời gian tiền can thiệp giữa hai nhóm.
    2. *Kiểm định DID giả dược với các số hạng dẫn trước/trễ (Placebo DID with Leads & Lags):* Thiết lập mô hình nghiên cứu sự kiện (Event-Study Design) bằng cách đưa các biến tương tác thời gian đa kỳ trước và sau can thiệp vào phương trình hồi quy.
    3. *Kiểm định hiệu ứng giả dược trên các biến kiểm soát (Placebo DID on Key Covariates):* Sử dụng các đặc tính nhân khẩu học hoặc kinh tế cố định làm biến phụ thuộc để kiểm tra xem cú sốc chính sách có gây ra sự biến đổi sai lệch nào trên cấu trúc nhóm hay không.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Quỹ đạo phản thực tế của nhóm can thiệp sau thời điểm áp dụng chính sách ($Y_{0, \text{post}} \mid D = 1$) là đại lượng không bao giờ quan sát được trong thực tế. Vì vậy, giả định xu hướng song song không thể kiểm định trực tiếp ở giai đoạn sau can thiệp, mà bắt buộc phải kiểm chứng gián tiếp thông qua việc chứng minh tính song song tuyệt đối ở tất cả các giai đoạn tiền can thiệp ($t < 0$).
### 2. Phân tích các ví dụ minh họa (Slide 3–7 & Transcript)
* **Hiện tượng vi phạm giả định xu hướng song song (Pre-trend Divergence - Slide 3):**
  * *Biểu diễn logic:* 
    $$\frac{d\mathbb{E}[Y_{0, \text{treatment}}]}{dt} \neq \frac{d\mathbb{E}[Y_{0, \text{control}}]}{dt} \implies \hat{\delta}_{\text{DID}} = \delta_{\text{true}} + \Delta_{\text{trend\_bias}} \neq \delta_{\text{true}}$$
  * *Cơ chế thực tế:* Khi đồ thị cho thấy trước thời điểm can thiệp ($t < 0$), tốc độ tăng trưởng của nhóm can thiệp vốn dĩ đã nhanh hơn (hoặc chậm hơn) nhóm đối chứng, sự khác biệt sau can thiệp sẽ gộp cả hiệu ứng chính sách lẫn quán tính biến thiên tự thân. Việc ngộ nhận xu hướng này dẫn đến việc ước lượng sai lầm mức tác động can thiệp, biến một kết quả ngẫu nhiên thành kết luận chính sách ngụy tạo.
* **Kiểm định giả dược đa kỳ với các số hạng Lead và Lag (Multi-period Placebo Event Study - Slide 5, 6):**
  * *Biểu diễn logic:* 
    $$Y_{it} = \alpha + \beta D_i + \gamma t_i + \sum_{k = -M}^{-2} \delta_k (D_i \times \mathbf{1}_{\{t = k\}}) + \sum_{m = 0}^K \delta_m (D_i \times \mathbf{1}_{\{t = m\}}) + \varepsilon_{it}$$
    $$\text{Điều kiện cần: } \forall k < -1, \; \hat{\delta}_k \approx 0 \land p\text{-value} > 0.05 \implies \text{Xu hướng song song được bảo toàn}$$
  * *Cơ chế thực tế:* Các số hạng dẫn trước (lead terms / $t < 0$) đóng vai trò kiểm định giả dược xem có tồn tại hiệu ứng can thiệp giả tạo trước khi chính sách thực sự có hiệu lực hay không. Nếu các hệ số $\hat{\delta}_k$ ở giai đoạn trước can thiệp khác 0 có ý nghĩa thống kê, điều đó cảnh báo có sự tồn tại của hiệu ứng đón đầu (anticipatory behavior) hoặc sự phân kỳ nội tại giữa hai nhóm, làm bác bỏ tính hợp lệ của mô hình DID. Ngược lại, các số hạng trễ (lag terms / $t \ge 0$) đo lường sự lan tỏa động học của chính sách qua từng mốc thời gian.
* **Kiểm định giả dược trên các biến kiểm soát cốt lõi (Covariate Placebo Test - Slide 7):**
  * *Biểu diễn logic:* 
    $$X_{it} = \alpha + \beta D_i + \gamma t_i + \delta_1 (D_i \times t_i) + \varepsilon_{it}$$
    $$\text{Kỳ vọng lý thuyết: } X_{it} \text{ (Giới tính, độ tuổi, trình độ phụ huynh)} \implies \hat{\delta}_1 = 0$$
  * *Cơ chế thực tế:* Một chính sách giáo dục hay tài trợ học bổng chỉ có thể tác động lên hành vi học tập hoặc kết quả thi cử của học sinh ($Y$), hoàn toàn không thể làm thay đổi các thuộc tính nhân khẩu học cố định ($X$). Nếu ước lượng phương trình trên các biến $X$ lại cho ra $\hat{\delta}_1 \neq 0$, điều này chứng minh tập mẫu đã bị thay đổi thành phần cấu trúc (compositional shift) hoặc phát sinh sai lệch bỏ cuộc (attrition bias) theo thời gian, làm mất hiệu lực của kết luận nhân quả.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–7 & Transcript)
* **Theo góc nhìn Thiết lập tiêu chuẩn phản biện khoa học (Academic & Empirical Defense):**
  * *Mục tiêu:* Xây dựng bằng chứng vững chắc bảo vệ tính hợp lệ nội tại (internal validity) của kết quả đánh giá tác động trước các cơ quan tài trợ và cộng đồng học thuật.
  * *Hành động can thiệp:* Báo cáo kết quả DID luôn phải đính kèm biểu đồ nghiên cứu sự kiện (Event-Study Graph) với dải khoảng tin cậy 95% bao trùm giá trị 0 ở toàn bộ các kỳ trước chính sách; thực hiện hồi quy kiểm định giả dược trên nhiều biến kiểm soát độc lập để chứng minh tính ngẫu nhiên của mẫu.
* **Theo góc nhìn Phân tích hiệu ứng động của can thiệp chính sách (Dynamic Policy Impact Assessment):**
  * *Mục tiêu:* Đánh giá chu kỳ sống và tốc độ thẩm thấu của can thiệp vào đời sống thực tế.
  * *Hành động can thiệp:* Thông qua việc theo dõi chuỗi hệ số lag ($\delta_0, \delta_1, \delta_2 \dots$), nhà hoạch định chính sách có thể nhận biết chính sách mang lại tác động tức thời (immediate shock), tác động tích lũy dài hạn (cumulative effect) hay chỉ là hiệu ứng sốc tâm lý ngắn hạn suy giảm theo thời gian để kịp thời điều chỉnh cơ chế hỗ trợ.
* **Theo góc nhìn Chiến lược khắc phục khi vi phạm xu hướng song song (Remedial Identification Strategies):**
  * *Mục tiêu:* Duy trì khả năng suy luận nhân quả khi dữ liệu quan sát không thỏa mãn điều kiện song song nguyên bản.
  * *Hành động can thiệp:* Khi kiểm định lead terms bị bác bỏ, nhà nghiên cứu cần chuyển đổi phương pháp luận: bổ sung xu hướng thời gian tuyến tính đặc thù cho từng nhóm (group-specific linear time trends), kết hợp thuật toán Ghép điểm xu hướng với sai phân kép (PSM-DID), hoặc nâng cấp lên Phương pháp Kiểm soát Tổng hợp (Synthetic Control Method - SCM) để kiến tạo nhóm đối chứng nhân tạo tối ưu.
## Thực Hành Phân Tích Mô Hình Sai Phân Trong Sai Phân (DID) Trên Phần Mềm Stata (Workshop 1: Stata-Based Analysis of DID Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–3 & Transcript P1–P3)
* **Phân loại nhiệm vụ:** **Ước lượng Tác động Nhân quả Thực nghiệm / Phương pháp Đánh giá Can thiệp Bán thực nghiệm trên Stata (Empirical Causal Inference & Quasi-Experimental Evaluation in Stata)**.
* **Bản chất kỹ thuật:** 
  * Cơ sở toán học xác định Tác động Can thiệp Trung bình trên Nhóm được Xử lý (Average Treatment Effect on the Treated - ATT):
    $$\text{ATT} = (Y_{t1} - Y_{t0}) - (Y_{c1} - Y_{c0})$$
    * $Y_{t1}, Y_{t0}$: Biến kết quả của nhóm can thiệp (treatment group) sau và trước khi có chính sách.
    * $Y_{c1}, Y_{c0}$: Biến kết quả của nhóm đối chứng (control group) sau và trước khi có chính sách.
  * Hai dạng cấu trúc dữ liệu tương thích trong phân tích DID:
    * *Dữ liệu mảng (Panel Data):* Theo dõi lặp lại cùng một tập hợp đối tượng qua nhiều thời điểm liên tiếp (ví dụ: điểm số của cùng một nhóm học sinh qua các năm).
    * *Dữ liệu chéo lặp lại (Repeated Cross-Sectional Data):* Lấy mẫu độc lập các đối tượng khác nhau tại mỗi mốc thời gian, chỉ cần phân biệt được giai đoạn thời gian và tình trạng can thiệp.
  * Hệ thống biến số chuẩn mực khi thiết lập mô hình trong Stata:
    * `treat` (hoặc `fatherdec`): Biến giả nhóm can thiệp ($1$ là nhóm can thiệp, $0$ là nhóm đối chứng).
    * `post` (hoặc `offer`): Biến giả thời gian chính sách ($1$ là giai đoạn áp dụng chính sách, $0$ là giai đoạn không áp dụng).
    * `outcome` (hoặc `coll`): Biến phụ thuộc cần đánh giá (xác suất nhập học đại học, thu nhập, việc làm).
    * `x1, x2...`: Vector các biến kiểm soát ngoại sinh nhằm hấp thụ yếu tố gây nhiễu.
    * `cluster_var` & `weight`: Biến chỉ báo cụm lồng ghép và trọng số mẫu điều tra xác suất.
  * Hai phương pháp tạo biến tương tác (Interaction Term) trong Stata:
    * *Phương pháp 1 (Tạo biến thủ công):* 
      $$\text{gen treat\_post} = \text{treat} \times \text{post} \longrightarrow \text{reg outcome treat post treat\_post}$$
    * *Phương pháp 2 (Cú pháp biến nhân tố - Factor-variable syntax, khuyến nghị):* 
      $$\text{reg outcome i.treat\#\#i.post, robust}$$
      * Toán tử `##` tự động đưa vào mô hình cả hai hiệu ứng chính (`i.treat`, `i.post`) cùng biến tương tác chéo (`i.treat#i.post`). Hệ số của số hạng tương tác chính là giá trị ước lượng ATT.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Điểm khác biệt quan trọng trong thực hành Stata là việc thiết lập môi trường xử lý dữ liệu khảo sát phức hợp thông qua câu lệnh `svyset [pw=weight], psu(cluster_var)`. Điều này đảm bảo toàn bộ các ước lượng trung bình và hồi quy (`svy: mean`, `svy: regress`) đều tự động hiệu chỉnh trọng số lấy mẫu và phương sai cụm, ngăn ngừa sai lệch ước lượng sai số chuẩn.
### 2. Phân tích các ví dụ minh họa (Slide 4–7 & Transcript P4–P7)
* **Khai báo Trọng số Mẫu và Dữ liệu Chương trình SSSB (Slide 4 & Transcript P4):**
  * *Biểu diễn logic:* 
    $$\text{ch8\_dynarski.dta} \xrightarrow{\text{svyset, clear}} \text{svyset [pw=wt88], psu(hhid)}$$
  * *Cơ chế thực tế:* Sử dụng bộ dữ liệu kinh điển của Susan Dynarski (2003) về tác động của việc bãi bỏ Chương trình Trợ cấp Sinh viên An sinh Xã hội (SSSB) năm 1981. Khai báo trọng số xác suất `wt88` và đơn vị chọn mẫu sơ cấp theo hộ gia đình `hhid` để kết quả ước lượng phản ánh đúng cơ cấu tổng thể dân số thanh niên Hoa Kỳ.
* **Thống kê Mô tả 4 Phân nhóm Giao thoa (Slide 5 & Transcript P5):**
  * *Biểu diễn logic:* 
    $$\text{fatherdec} \in \{0, 1\} \times \text{offer} \in \{0, 1\} \xrightarrow{\text{svy: mean coll, over(fatherdec offer)}} \begin{bmatrix} \bar{Y}_{t1} & \bar{Y}_{t0} \\ \bar{Y}_{c1} & \bar{Y}_{c0} \end{bmatrix}$$
  * *Cơ chế thực tế:* Lệnh `svy: mean coll, over(fatherdec offer)` tính toán trực tiếp 4 giá trị trung bình tỷ lệ học đại học (`coll`):
    * Học sinh có cha mất khi có chính sách SSSB ($\bar{Y}_{t1}$).
    * Học sinh có cha mất sau khi chính sách bị bãi bỏ ($\bar{Y}_{t0}$).
    * Học sinh có cha còn sống trong thời kỳ có chính sách ($\bar{Y}_{c1}$).
    * Học sinh có cha còn sống sau khi chính sách bị bãi bỏ ($\bar{Y}_{c0}$).
* **So sánh Sai phân Bậc một giữa Nhóm Can thiệp và Đối chứng (Slide 6 & Transcript P6):**
  * *Biểu diễn logic:* 
    $$\text{Nhóm Can thiệp: } \text{svy if fatherdec==1: regress coll offer} \implies \Delta Y_t = 0.208$$
    $$\text{Nhóm Đối chứng: } \text{svy if fatherdec==0: regress coll offer} \implies \Delta Y_c = 0.026$$
    $$\text{Đồ thị xu hướng: } \text{twoway lfit coll post [pw=wt88], by(fatherdec)}$$
  * *Cơ chế thực tế:* Sai phân bậc một của nhóm can thiệp cho thấy tỷ lệ nhập học giảm $20.8$ điểm phần trăm sau khi mất trợ cấp. Tuy nhiên, nhóm đối chứng (không nhận trợ cấp) cũng ghi nhận mức sụt giảm $2.6$ điểm phần trăm do bối cảnh suy thoái kinh tế và bãi bỏ luật MISAA năm 1981. Nếu chỉ dùng sai phân bậc một, hiệu ứng chính sách sẽ bị thổi phồng nghiêm trọng do gộp cả xu hướng vĩ mô chung.
* **Ước lượng Mô hình Hồi quy DID và Giải phẫu Tuyến tính bằng `lincom` (Slide 7 & Transcript P7):**
  * *Biểu diễn logic:* 
    $$\text{coll}_i = \alpha + \beta \text{offer}_i + \gamma \text{fatherdec}_i + \delta (\text{offer}_i \times \text{fatherdec}_i) + \varepsilon_i$$
    $$\hat{\delta}_{\text{DID}} = \Delta Y_t - \Delta Y_c = 0.208 - 0.026 = 0.182 \quad (p < 0.01)$$
    $$\text{lincom offer + offerxfatherdec} \implies \hat{\beta} + \hat{\delta} = 0.026 + 0.182 = 0.208 = \Delta Y_t$$
  * *Cơ chế thực tế:* Kết quả hồi quy Stata trả về hệ số biến tương tác $\hat{\delta} = 0.182$, khẳng định gói tài trợ SSSB làm tăng ròng $18.2$ điểm phần trăm xác suất vào đại học của học sinh mồ côi cha. Câu lệnh `lincom offer + offerxfatherdec` thực hiện phép cộng tuyến tính giữa hiệu ứng thời gian ($\beta$) và hiệu ứng tương tác ($\delta$), trả về chính xác giá trị sai phân bậc một $0.208$ của nhóm can thiệp, chứng minh sự nhất quán toán học giữa phương pháp trừ trung bình thủ công và phương pháp hồi quy OLS tương tác.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–7 & Transcript P1–P7)
* **Theo góc nhìn Thiết lập Quy trình Ước lượng Chuẩn tắc trong Do-file (Stata Workflow Standardization):**
  * *Mục tiêu:* Đảm bảo tính minh bạch, khả năng tái lập (reproducibility) và giảm thiểu sai sót kỹ thuật khi chạy mô hình thực nghiệm.
  * *Hành động can thiệp:* Xây dựng do-file theo trình tự 4 bước nghiêm ngặt: (1) Thiết lập trọng số khảo sát với `svyset`; (2) Lập bảng thống kê mô tả 4 nhóm chéo với `over()`; (3) Chạy hồi quy bậc một từng nhóm để nhận diện xu hướng thô; (4) Triển khai hồi quy DID toàn phần bằng cú pháp factor-variable `i.treat##i.post`.
* **Theo góc nhìn Phân lập Tác động Chính sách Ròng (Net Treatment Effect Extraction):**
  * *Mục tiêu:* Loại bỏ hoàn toàn sự can thiệp của các cú sốc thời gian mang tính chu kỳ hoặc vĩ mô đối với quyết định chính sách.
  * *Hành động can thiệp:* Tuyệt đối không đưa ra kết luận can thiệp chỉ dựa trên kết quả hồi quy trước - sau đơn biến; phải luôn sử dụng hệ số tương tác sai phân kép $\hat{\delta}$ làm chỉ số duy nhất để đánh giá hiệu quả thực chất của các gói ngân sách can thiệp xã hội.
* **Theo góc nhìn Khai thác Công cụ Hậu kiểm Tuyến tính (`lincom` Post-Estimation):**
  * *Mục tiêu:* Giải thích linh hoạt các kịch bản phản thực tế và phân rã chi tiết từng thành phần hiệu ứng cho người ra quyết định.
  * *Hành động can thiệp:* Ứng dụng lệnh `lincom` sau khi ước lượng mô hình tương tác để kiểm định các tổ hợp giả thuyết tuyến tính phức tạp (tổng biến động nhóm xử lý, độ chênh lệch tuyệt đối tại từng thời kỳ) mà không cần phải tái định dạng hoặc hồi quy lại mô hình nhiều lần.
## Mô Hình Sai Phân Trong Sai Phân Đa Kỳ Bất Đồng Bộ (Staggered DID) và Thiết Kế Nghiên Cứu Sự Kiện (Event-Study Design)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–12 & Transcript P1–P12)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Động học Thực nghiệm / Thiết kế Bán thực nghiệm Đa kỳ Đa nhóm (Dynamic Empirical Causal Inference & Quasi-Experimental Event-Study Design - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Mở rộng mô hình DID 2 nhóm $\times$ 2 thời kỳ lên khung phân tích tổng quát với nhiều nhóm đối tượng và nhiều chu kỳ thời gian liên tiếp (năm, quý, tháng), trong đó các nhóm tiếp nhận cú sốc chính sách tại các mốc thời gian lịch khác nhau (Staggered Adoption Timing).
  * Kỹ thuật Căn chỉnh thời gian sự kiện (Event-Time Centering):
    $$\tau = t - T_s^*$$
    * Quy đổi thời gian lịch ($t$: 1990, 1991, 1992...) sang thời gian tương đối ($\tau$), lấy năm ban hành chính sách của từng đơn vị $s$ ($T_s^*$) làm gốc chuẩn $\tau = 0$.
    * Các kỳ trước can thiệp (Leads): $\tau = -1, -2, \dots, -q$ (hoặc ký hiệu quy ước theo hướng dẫn slide: $\tau$ mang giá trị âm/dương biểu diễn số kỳ trước và sau).
    * Các kỳ sau can thiệp (Lags): $\tau = +1, +2, \dots, +m$.
  * Phương trình hồi quy cố định hai chiều mở rộng (Two-Way Fixed Effects - TWFE Event Study):
    $$Y_{ist} = \beta_s + \gamma_t + \sum_{\tau = -q}^{m} \delta_\tau D_{s\tau} + \mathbf{X}_{ist}'\boldsymbol{\theta} + \varepsilon_{ist}$$
    * $Y_{ist}$: Biến kết quả của doanh nghiệp/cá nhân $i$ tại bang $s$ vào năm $t$.
    * $\beta_s$: Hiệu ứng cố định đơn vị (State Fixed Effects), kiểm soát toàn bộ các đặc tính bất biến theo thời gian của từng địa phương.
    * $\gamma_t$: Hiệu ứng cố định thời gian (Year Fixed Effects), kiểm soát các cú sốc vĩ mô chung, chu kỳ kinh tế và lạm phát tác động đồng thời lên mọi đơn vị.
    * $D_{s\tau}$: Biến giả tương tác sự kiện ($D_{s\tau} = 1$ khi và chỉ khi quan sát thuộc nhóm can thiệp và đang ở thời kỳ tương đối $\tau$; ngược lại $D_{s\tau} = 0$).
    * $\delta_\tau$: Hệ số tác động tại thời kỳ $\tau$, đo lường chênh lệch trung bình giữa nhóm can thiệp và nhóm đối chứng sau khi đã triệt tiêu hoàn toàn hiệu ứng cố định bang và hiệu ứng năm.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Vượt qua hạn chế của DID tĩnh (chỉ ước lượng một hệ số trung bình duy nhất $\delta$ gộp chung mọi giai đoạn). Mô hình Staggered DID phân rã tác động can thiệp thành một chuỗi động học thời gian, cho phép kiểm tra trực tiếp giả định xu hướng song song tiền can thiệp và theo dõi sự bền vững dài hạn của chính sách.
### 2. Phân tích các ví dụ minh họa (Slide 1–10 & Transcript P1–P10)
* **Nghiên cứu Kinh điển của David Autor (2003) về Ngoại lệ Học thuyết Sa thải Tùy ý (Slide 2–5, 10 & Transcript P1–P5, P10):**
  * *Biểu diễn logic:* 
    $$\text{Tòa án ban hành ngoại lệ bảo vệ việc làm} \longrightarrow \text{Chi phí sa thải chính thức } \uparrow \longrightarrow \text{Doanh nghiệp thay thế bằng Lao động thời vụ / Thuê ngoài } \uparrow$$
  * *Cơ chế thực tế:* Để bảo vệ việc làm, một số bang tại Mỹ thông qua án lệ hạn chế người sử dụng lao động tự do sa thải công nhân. Tuy nhiên, doanh nghiệp phản ứng bằng cách hạn chế ký hợp đồng chính thức và tăng cường sử dụng lao động thuê ngoài (temporary-help workers) nhằm tránh rủi ro kiện tụng. Autor khai thác thời điểm thông qua án lệ so le giữa các bang để đo lường tác động thay thế này.
* **Cơ chế Căn chỉnh Thời gian Sự kiện và Cấu trúc Ma trận Biến giả (Slide 6–8 & Transcript P6–P8):**
  * *Biểu diễn logic:* 
    $$\begin{cases}        \text{Bang 1 (Áp dụng 1990):} & 1990 \equiv \tau_0, \; 1991 \equiv \tau_1, \; 1992 \equiv \tau_2, \; \dots \\        \text{Bang 3 (Áp dụng 1992):} & 1990 \equiv \tau_{-2}, \; 1991 \equiv \tau_{-1}, \; 1992 \equiv \tau_0, \; \dots \\        \text{Bang Chưa/Không áp dụng (Never-treated):} & D_{s\tau} = 0 \quad (\forall \tau) \implies \text{Nhóm đối chứng thuần túy}      \end{cases}$$
  * *Cơ chế thực tế:* Quá trình căn chỉnh tạo ra một bảng dữ liệu bảng không cân bằng theo thời gian tương đối: các bang áp dụng sớm sẽ có ít kỳ leads và nhiều kỳ lags; các bang áp dụng muộn sẽ có nhiều kỳ leads và ít kỳ lags. Sự hiện diện của nhóm bang chưa từng thông qua luật (`never-treated states`) đóng vai trò thiết yếu để thiết lập đường chuẩn đối chứng chung.
* **Kiểm định Xu hướng Song song và Nhận diện Hiệu ứng Đón đầu / Lan tỏa (Slide 9–10 & Transcript P9–P10):**
  * *Biểu diễn logic:* 
    $$\text{Kiểm định Pre-trends: } \forall \tau < 0, \; \hat{\delta}_\tau \approx 0 \land p > 0.05 \implies \text{Thỏa mãn xu hướng song song}$$
    $$\text{Hiệu ứng Đón đầu (Anticipation Effect): } \tau = -1 \implies \hat{\delta}_{-1} > 0 \quad (\text{Điểm ước lượng tăng trước khi luật có hiệu lực})$$
  * *Cơ chế thực tế:* Biểu đồ nghiên cứu sự kiện của Autor cho thấy các hệ số giai đoạn trước can thiệp dao động quanh trục 0, xác nhận tính hợp lệ của nhóm đối chứng. Tuy nhiên, tại kỳ ngay sát thời điểm ban hành ($\tau = -1$), hệ số bắt đầu nhích lên. Điều này phản ánh hiệu ứng dự đoán trước (anticipation effect): các cuộc tranh luận công khai tại tòa án trước khi phán quyết chính thức được ban hành đã khiến các doanh nghiệp chủ động điều chỉnh cơ cấu nhân sự từ trước.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 9–12 & Transcript P9–P12)
* **Theo góc nhìn Kiểm định Tính Hợp lệ Tiền can thiệp (Pre-Trend Validation):**
  * *Mục tiêu:* Ngăn ngừa rủi ro ban hành chính sách dựa trên các mối liên hệ nhân quả ngụy tạo do khác biệt nội tại giữa các địa phương.
  * *Hành động can thiệp:* Bắt buộc kiểm tra trực quan và kiểm định thống kê liên hợp trên toàn bộ các hệ số dẫn trước ($H_0: \delta_{-q} = \dots = \delta_{-1} = 0$); nếu giả định xu hướng song song bị bác bỏ (xuất hiện góc lệch giữa hai nhóm trước can thiệp), phải dừng việc diễn giải mô hình DID tiêu chuẩn và nâng cấp lên phương pháp Sai phân trong sai phân trong sai phân (Triple Differences - DDD).
* **Theo góc nhìn Theo dõi Quỹ đạo Động học của Chính sách (Dynamic Policy Persistence):**
  * *Mục tiêu:* Đánh giá hiệu quả thực chất của can thiệp theo thời gian để quyết định duy trì, điều chỉnh hay bãi bỏ chương trình.
  * *Hành động can thiệp:* Quan sát chuỗi hệ số trễ ($\delta_0, \delta_1, \delta_2\dots$) để xác định xem chính sách mang lại tác động tức thời rồi suy giảm nhanh (transitory shock) hay tạo ra hiệu ứng chuyển đổi cơ cấu tích lũy và bền vững trong dài hạn (long-term structural shift).
* **Theo góc nhìn Kiểm soát Hành vi Đón đầu và Tác động Ngoài dự kiến (Unintended Behavioral Responses):**
  * *Mục tiêu:* Nhận diện sớm các phản ứng phụ hoặc hành vi né tránh luật của thị trường trước khi chính sách chính thức được thực thi.
  * *Hành động can thiệp:* Phân tích độ nhạy tại các kỳ $\tau = -1$ và $\tau = 0$ để nắm bắt tâm lý thị trường; khi thiết kế các chính sách bảo vệ an sinh hoặc thắt chặt thị trường lao động, cơ quan quản lý cần tính toán trước các giải pháp ngăn chặn việc doanh nghiệp lách luật thông qua hình thức thuê ngoài hoặc chuyển đổi loại hình hợp đồng.
## Phương Pháp Ước Lượng Sai Phân Trong Sai Phân Trong Sai Phân (Triple Differences - DDD) và Đánh Giá Chính Sách Phúc Lợi Thai Sản Bắt Buộc
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–2, 10–14 & Transcript P1–P2, P10–P14)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Tác động Bán thực nghiệm Khử Xu hướng Không Đồng nhất (Causal Inference & Quasi-Experimental Evaluation - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Giải quyết vấn đề cốt lõi khi mô hình DID chuẩn bị vi phạm giả định xu hướng song song (Parallel Trends Assumption) do tồn tại sự khác biệt về xu hướng biến động kinh tế vĩ mô theo thời gian giữa các vùng/bang can thiệp và đối chứng.
  * Nguyên lý bóc tách thành phần xu hướng sai lệch thông qua một khu vực/đối tượng không bị ảnh hưởng (unaffected group):
    $$\text{DID}_{\text{lớn}} (\text{DD}_{\text{affected}}) = \text{Hiệu ứng Chính sách Thực} + \text{Sai lệch Xu hướng Thời gian Khác biệt}$$
    $$\text{did}_{\text{nhỏ}} (\text{DD}_{\text{unaffected}}) = 0 + \text{Sai lệch Xu hướng Thời gian Khác biệt}$$
    $$\text{DDD} = \text{DD}_{\text{affected}} - \text{DD}_{\text{unaffected}} = \text{Hiệu ứng Nhân quả Ròng}$$
  * Mô hình phương trình hồi quy tương tác ba chiều toàn phần (Full Three-Way Interaction Regression):
    $$Y_{ijt} = \alpha + \beta_1 Z_j + \beta_2 T_t + \beta_3 A_i + \beta_4 (Z_j \times T_t) + \beta_5 (Z_j \times A_i) + \beta_6 (T_t \times A_i) + \beta_7 (Z_j \times T_t \times A_i) + \mathbf{X}_{ijt}'\boldsymbol{\gamma} + \varepsilon_{ijt}$$
    * $Z_j$: Biến giả khu vực/bang can thiệp ($1$ là bang can thiệp, $0$ là bang đối chứng).
    * $T_t$: Biến giả thời gian ($1$ là sau chính sách, $0$ là trước chính sách).
    * $A_i$: Biến giả nhóm đối tượng ($1$ là nhóm chịu ảnh hưởng của chính sách, $0$ là nhóm không chịu ảnh hưởng).
    * $Z_j \times T_t$: Hấp thụ sự khác biệt về xu hướng thời gian đặc thù giữa các bang (chính là $did_{\text{nhỏ}}$).
    * $Z_j \times A_i$: Hấp thụ chênh lệch cố định sẵn có giữa nhóm đối tượng tại các bang.
    * $T_t \times A_i$: Hấp thụ xu hướng biến động chung theo thời gian của nhóm đối tượng trên toàn quốc.
    * $Z_j \times T_t \times A_i$: Biến tương tác ba chiều; hệ số $\beta_7$ (hoặc $\beta_8$ khi bổ sung biến kiểm soát) chính là ước lượng nhân quả không chệch DDD.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Thiết lập một chiều so sánh thứ ba: Thay vì chỉ so sánh 2 bang $\times$ 2 thời kỳ, phương pháp đưa thêm phân nhóm đối chứng nội bộ cùng địa bàn không thuộc diện điều chỉnh của luật. Điều này giúp loại trừ hoàn toàn các cú sốc kinh tế vĩ mô địa phương diễn ra đồng thời mà mô hình DID 2 chiều truyền thống bị bất lực.
### 2. Phân tích các ví dụ minh họa (Slide 3–9, 14–15 & Transcript P3–P9, P14–P15)
* **Nghiên cứu Kinh điển Đánh giá Chính sách Phúc lợi Thai sản Bắt buộc (Gruber, 1994 - Slide 3–9):**
  * *Biểu diễn logic:* 
    $$\begin{cases} 
      \text{Bang Can thiệp } (Z=1): & \text{Illinois (IL), New Jersey (NJ), New York (NY) (Áp dụng luật sớm)} \\ 
      \text{Bang Đối chứng } (Z=0): & \text{Ohio, Indiana, Connecticut, Massachusetts, North Carolina} \\ 
      \text{Nhóm Bị ảnh hưởng } (A=1): & \text{Phụ nữ đã kết hôn trong độ tuổi sinh đẻ (20–40 tuổi)} \\ 
      \text{Nhóm Không bị ảnh hưởng } (A=0): & \text{Phụ nữ trên 40 tuổi và Nam giới độc thân 20–40 tuổi} \\ 
      \text{Thời kỳ}: & \text{Trước can thiệp (1974–1975) } \text{vs. } \text{Sau can thiệp (1977–1978)} 
    \end{cases}$$
    $$\text{DD}_{\text{affected}} = -0.062, \quad \text{DD}_{\text{unaffected}} = -0.008 \implies \text{DDD} = -0.062 - (-0.008) = -0.054 \; (p < 0.05)$$
  * *Cơ chế thực tế:* Luật bảo vệ thai sản yêu cầu doanh nghiệp chi trả toàn bộ chi phí sinh nở cho lao động nữ. Tại các bang ban hành luật sớm, tỷ lệ việc làm của phụ nữ 20–40 tuổi giảm $6.2$ điểm phần trăm so với bang đối chứng ($\text{DD}_{\text{affected}}$). Tuy nhiên, nhóm lao động không bị ảnh hưởng (nam giới độc thân và phụ nữ lớn tuổi) tại các bang này cũng ghi nhận mức giảm $0.8$ điểm phần trăm ($\text{DD}_{\text{unaffected}}$) do suy thoái kinh tế vùng. Trừ đi mức suy giảm tự nhiên này, tác động ròng thực sự của chính sách là kéo giảm $5.4$ điểm phần trăm xác suất có việc làm của phụ nữ kết hôn trong độ tuổi sinh đẻ.
* **Giải phẫu Kết quả Ước lượng Hồi quy Kinh tế lượng Đa biến (Slide 14–15 & Transcript P14–P15):**
  * *Biểu diễn logic:* 
    $$\text{Mô hình DDD: } \hat{\beta}_8 \longrightarrow \begin{cases}
      \text{Log tiền lương thực tế (Wage):} & -2.140 \quad (\text{Không có ý nghĩa thống kê}) \\
      \text{Số giờ làm việc (Hours):} & -0.028 \quad (p < 0.05) \\
      \text{Việc làm toàn thời gian (Full-time):} & -0.037 \quad (p < 0.05) \\
      \text{Giờ làm hàng tuần (Weekly hours):} & +0.0049 \quad (p < 0.05) \\
      \text{Tỷ lệ có việc làm (Employment):} & -0.027 \quad (p < 0.05)
    \end{cases}$$
  * *Cơ chế thực tế:* Kết quả hồi quy khẳng định chi phí thai sản bắt buộc không làm thay đổi đáng kể mức lương danh nghĩa (có thể do ràng buộc của luật lương tối thiểu hoặc hợp đồng cứng nhắc), mà khiến người sử dụng lao động phản ứng bằng cách chuyển dịch gánh nặng chi phí sang số lượng: cắt giảm tuyển dụng mới, thu hẹp tỷ lệ việc làm toàn thời gian và giảm số giờ làm việc đối với nhóm lao động nữ có nguy cơ phát sinh chi phí sinh con.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–2, 10, 14–15 & Transcript P1–P2, P10, P14–P15)
* **Theo góc nhìn Nhận diện và Xử lý Vi phạm Giả định Song song (Methodological Defense):**
  * *Mục tiêu:* Cứu vãn thiết kế nghiên cứu bán thực nghiệm khi các nhóm địa phương có sự phân kỳ phát triển kinh tế tự nhiên trước can thiệp.
  * *Hành động can thiệp:* Khi kiểm định pre-trends trong DID thất bại, nhà nghiên cứu cần tìm kiếm một nhóm đối tượng thứ ba có mặt trong cùng thị trường nhưng hoàn toàn miễn nhiễm với nội dung chính sách; kiểm tra xem nhóm này có chịu các cú sốc vĩ mô tương tự hay không để làm đại diện đo lường $did_{\text{nhỏ}}$, từ đó thiết lập mô hình DDD.
* **Theo góc nhìn Đánh giá Tác động Ngoài Ý muốn của Chính sách Lao động (Policy Unintended Consequences):**
  * *Mục tiêu:* Dự báo và ngăn chặn các hệ lụy tiêu cực đối với các nhóm đối tượng yếu thế được nhắm tới để bảo vệ.
  * *Hành động can thiệp:* Khi áp đặt các quy định phúc lợi bắt buộc mang tính bao cấp một chiều lên doanh nghiệp, nhà hoạch định chính sách phải lường trước hành vi phân biệt đối xử ngầm (statistical discrimination) của nhà tuyển dụng; cần đi kèm các cơ chế chia sẻ rủi ro tài chính (ví dụ: quỹ an sinh xã hội nhà nước chi trả thay vì ép trực tiếp lên quỹ lương của người sử dụng lao động) để bảo vệ cơ hội việc làm bền vững cho phụ nữ.
* **Theo góc nhìn Chuẩn hóa Quy trình Hồi quy Tương tác Bậc cao (Regression Specification Protocol):**
  * *Mục tiêu:* Tránh sai sót toán học trong việc bỏ sót các biến thành phần cấu thành mô hình DDD.
  * *Hành động can thiệp:* Bắt buộc đưa đầy đủ 3 biến hiệu ứng chính và 3 biến tương tác chéo đôi trước khi diễn giải hệ số của số hạng tương tác ba chiều ($Z \times T \times A$); kiểm tra tính ổn định của $\hat{\beta}_7$ khi lần lượt đưa thêm vector các biến kiểm soát nhân khẩu học và hiệu ứng cố định đơn vị để xác nhận tính vững của kết quả.
## Phương Pháp Kiểm Soát Tổng Hợp (Synthetic Control Method - SCM) và Đánh Giá Tổn Thất Kinh Tế Do Xung Đột Khủng Bố
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–11 & Transcript P1–P11)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Tác động Bán thực nghiệm cho Nghiên cứu Ca Điển hình (Empirical Causal Inference & Quasi-Experimental Evaluation for Comparative Case Studies - Evaluative & Counterfactual Modeling)**.
* **Bản chất kỹ thuật:** 
  * Kiến tạo một nhóm đối chứng ảo/tổng hợp (synthetic/virtual control unit) bằng cách lấy tổ hợp lồi có trọng số (weighted average) từ tập hợp nhiều đơn vị tiềm năng không bị can thiệp (donor pool), sao cho đơn vị tổng hợp này mô phỏng sát nhất quỹ đạo tăng trưởng và cấu trúc đặc trưng của đơn vị can thiệp trong suốt giai đoạn trước xử lý (pre-treatment period).
  * Quy trình tối ưu hóa trọng số toán học qua hai tầng (Two-step Optimization):
    1. *Ràng buộc trọng số tổ hợp lồi:* Tập hợp $J$ đơn vị đối chứng tiềm năng được gán vector trọng số $W = (w_1, w_2, \dots, w_J)'$ thỏa mãn:
       $$w_j \ge 0 \quad (\forall j = 1, \dots, J) \quad \text{và} \quad \sum_{j=1}^J w_j = 1$$
       Ràng buộc này triệt tiêu hoàn toàn rủi ro xuất hiện giá trị âm và ngăn chặn việc ngoại suy vượt ra ngoài bao lồi (convex hull) của dữ liệu quan sát.
    2. *Tối ưu hóa hàm khoảng cách có trọng số ma trận $V$:* Cực tiểu hóa sai số bình phương giữa vector đặc trưng tiền xử lý của đơn vị can thiệp ($X_1$) và ma trận đặc trưng của các đơn vị đối chứng ($X_0$):
       $$\min_{W} (X_1 - X_0 W)' V (X_1 - X_0 W)$$
       Trong đó, $V$ là ma trận đường chéo bán xác định dương thể hiện tầm quan trọng tương đối của từng biến dự báo đối với biến kết quả.
    3. *Hiệu chỉnh ma trận $V$ tối ưu:* Ma trận $V^*$ được lựa chọn bằng thuật toán lặp sao cho vector trọng số $W^*(V)$ cực tiểu hóa sai số bình phương giữa chuỗi giá trị thực tế của đơn vị can thiệp trước can thiệp ($Z_1$) và chuỗi giá trị tổng hợp ($Z_0 W$):
       $$\min_{V} \big(Z_1 - Z_0 W^*(V)\big)' \big(Z_1 - Z_0 W^*(V)\big)$$
    4. *Ước lượng Tác động Can thiệp Ròng (GAP / Treatment Effect):* Giá trị phản thực tế sau can thiệp được dự phóng bằng $Y_1^* = Y_0 W^*$, và độ lệch tại thời điểm $t > T_0$ chính là tác động nhân quả thuần túy:
       $$\text{GAP}_t = Y_{1t} - Y_{1t}^* = Y_{1t} - \sum_{j=1}^J w_j^* Y_{jt}$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Giải pháp thay thế hoàn hảo khi mô hình Sai phân trong Sai phân (DID) và Sai phân ba chiều (DDD) thất bại do không tìm được bất kỳ đơn vị đối chứng đơn lẻ nào có cùng xu hướng biến thiên theo thời gian (vi phạm giả định Parallel Trends). SCM giải quyết bài toán can thiệp trên một đơn vị duy nhất ($N = 1$) một cách minh bạch, định lượng và có căn cứ toán học chặt chẽ.
### 2. Phân tích các ví dụ minh họa (Slide 2–4, 9–13 & Transcript P2–P4, P9–P13)
* **Nghiên cứu Kinh điển Đánh giá Tác động của Xung đột Khủng bố tại Xứ Basque (Abadie & Gardeazabal, 2003 - Slide 2–4 & Transcript P2–P4):**
  * *Biểu diễn logic:* 
    $$\text{Xứ Basque (Can thiệp, 1975)} \xrightarrow{\text{Không có tỉnh đối chứng tương đồng}} \text{Tổ hợp 16 vùng khác của Tây Ban Nha } (X_1^* = X_0 W^*)$$
  * *Cơ chế thực tế:* Xứ Basque là một khu vực đặc thù với mức GDP bình quân đầu người, tỷ lệ đầu tư và vốn con người vượt trội so với mức trung bình của Tây Ban Nha. Khi làn sóng khủng bố bùng phát mạnh vào năm 1975, không thể dùng DID vì không một tỉnh nào có cùng xu hướng kinh tế. Nghiên cứu sử dụng SCM để tìm ra tập hợp trọng số $W^*$ từ các khu vực khác, tổng hợp nên một "Xứ Basque ảo" phản ánh chính xác cấu trúc kinh tế của Xứ Basque nếu không xảy ra khủng bố.
* **Độ Khớp Tiền Can thiệp Hoàn hảo giữa Thực tế và Tổng hợp (Slide 9–11 & Transcript P9–P11):**
  * *Biểu diễn logic:* 
    $$\text{Giai đoạn 1960–1969:} \begin{cases}
      \text{GDP bình quân Xứ Basque thực tế } (Z_1): & 5,285.46 \text{ USD} \\
      \text{GDP bình quân Xứ Basque tổng hợp } (Z_0 W^*): & 5,270.80 \text{ USD} \\
      \text{GDP bình quân toàn quốc Tây Ban Nha:} & 3,745.39 \text{ USD}
    \end{cases} \implies \text{GAP}_{t \le 1975} \approx 0$$
  * *Cơ chế thực tế:* So với mức trung bình toàn quốc chênh lệch rất xa, Xứ Basque tổng hợp có các chỉ số kinh tế vĩ mô trong thập niên 1960 gần như trùng khít với Xứ Basque thực tế (chênh lệch GDP bình quân chưa đầy 15 USD). Trên biểu đồ chuỗi thời gian, đường nét liền (thực tế) và đường nét đứt (tổng hợp) bám sát nhau hoàn hảo trước năm 1975, bảo đảm tính hợp lệ cao của kịch bản phản thực tế.
* **Tương quan Nghịch giữa Số vụ Khủng bố và Độ tụt hậu GDP (Slide 12–13 & Transcript P12–P13):**
  * *Biểu diễn logic:* 
    $$\text{Sau năm 1975:} \begin{bmatrix} \text{Tần suất tấn công khủng bố } \uparrow \\ \text{Số ca tử vong do tổ chức ETA } \uparrow \end{bmatrix} \implies \text{Khoảng cách tăng trưởng } \text{GAP}_t = Y_{1t} - Y_{1t}^* < 0 \quad (\text{Mức sụt giảm } \approx 10\%)$$
  * *Cơ chế thực tế:* Phân tích biểu đồ hai trục tung chỉ ra rằng trước 1975, hiệu số $\text{GAP}$ dao động sát trục 0. Ngay khi số nạn nhân thiệt mạng vì khủng bố gia tăng đột biến sau năm 1975, đường chênh lệch GDP bình quân lao dốc mạnh sang miền âm. Xứ Basque thực tế đã tụt hậu khoảng $10\%$ GDP bình quân so với phiên bản tổng hợp của chính mình, chứng minh thực nghiệm tổn thất nặng nề của bất ổn an ninh đối với đầu tư và tăng trưởng kinh tế.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1–3, 8, 11–14 & Transcript P1–P3, P8, P11–P14)
* **Theo góc nhìn Thiết lập Kịch bản Phản thực tế Khách quan (Objective Counterfactual Benchmark):**
  * *Mục tiêu:* Định lượng chính xác tác động của các sự kiện ngoại sinh hoặc chính sách cấp vùng/quốc gia tác động lên một đơn vị duy nhất mà không phụ thuộc vào cảm tính.
  * *Hành động can thiệp:* Thay vì lựa chọn một nhóm đối chứng đơn lẻ có tính chủ quan hoặc lấy trung bình giản đơn toàn quốc gây chệch ước lượng, nhà phân tích cần công khai minh bạch ma trận trọng số $W^*$ từ SCM để cộng đồng chuyên gia cùng thẩm định tính hợp lý về cơ cấu kinh tế của nhóm đối chứng nhân tạo.
* **Theo góc nhìn Đo lường Tổn thất Rủi ro & Tái thiết Sau Khủng hoảng (Crisis Costing & Reconstruction Planning):**
  * *Mục tiêu:* Đánh giá toàn diện thiệt hại ròng về kinh tế - xã hội do xung đột vũ trang, thảm họa thiên tai hoặc gián đoạn chuỗi cung ứng.
  * *Hành động can thiệp:* Sử dụng chuỗi giá trị $\text{GAP}_t$ tích lũy qua các năm để tính toán tổng sản lượng bị mất đi của địa phương; từ đó xây dựng kế hoạch phân bổ ngân sách cứu trợ, thu hút vốn đầu tư bù đắp và định lượng chi phí cơ hội của việc duy trì hòa bình, an ninh khu vực.
* **Theo góc nhìn Mở rộng Ứng dụng trong Đánh giá Đột phá Sư phạm & Khủng hoảng Y tế (Class Discussion / Cross-application - Slide 14):**
  * *Mục tiêu:* Khai thác cú sốc dịch bệnh COVID-19 để đánh giá hiệu quả thực chất của phương thức đào tạo hoàn toàn trực tuyến (fully online teaching).
  * *Hành động can thiệp:* Khi việc áp dụng học trực tuyến diễn ra không đồng nhất giữa các trường và vi phạm giả định xu hướng song song của DID, nhà nghiên cứu có thể áp dụng SCM để tổng hợp một nhóm trường học đối chứng ảo (dựa trên tổ hợp trọng số về điều kiện kinh tế, trình độ giáo viên, điểm chuẩn đầu vào), từ đó phân lập chuẩn xác tác động ròng của việc học từ xa lên kết quả học tập và sức khỏe tâm lý của học sinh.
## Thực Hành Mô Hình Sai Phân Trong Sai Phân Đa Kỳ, Đa Nhóm Trên Stata và Kiểm Soát Xu Hướng Động Học (Workshop 2: Stata-Based Analysis of DID Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–5 & Transcript P1–P5)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Ước lượng Tác động Bán thực nghiệm Đa kỳ & Đa nhóm trong Stata (Empirical Causal Inference & Multi-period, Multi-group DID Estimation - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Mở rộng mô hình DID 2 thời kỳ lên cấu trúc đa kỳ nhằm bóc tách động học tác động theo từng năm khảo sát:
    $$Y_{it} = \alpha + \beta \text{Treat}_i + \sum_{\tau} \gamma_\tau \mathbf{1}_{\{t = \tau\}} + \sum_{\tau \neq -1} \delta_\tau (\text{Treat}_i \times \mathbf{1}_{\{t = \tau\}}) + \varepsilon_{it}$$
    * Biến giả thời gian $\tau$: Xác định các mốc tiền chính sách ($\tau < 0$), mốc thực thi ($\tau = 0$), và hậu chính sách ($\tau > 0$).
    * Biến tương tác $\text{Treat}_i \times \mathbf{1}_{\{t = \tau\}}$ (trong Stata tạo bằng cú pháp thủ công `tao0s = tao0 * fatherdec` hoặc cú pháp nhân tố `fatherdec##i.yearsr`): Đo lường sự thay đổi chênh lệch qua từng năm giữa hai nhóm.
  * Mô hình đa nhóm, đa kỳ với thời điểm áp dụng so le (Staggered DID) theo nghiên cứu của Autor (2003):
    $$Y_{st} = \mathbf{X}_{st}'\boldsymbol{\beta} + \sum_{\tau = -2}^{4+} \delta_\tau \text{Law}_{s\tau} + \gamma_t + \alpha_s + \mathbf{Z}_{st}'\boldsymbol{\theta} + \varepsilon_{st}$$
    * Biến phụ thuộc $\text{lnths}$: Logarithm quy mô việc làm dịch vụ lao động thời vụ cấp bang (Temporary Help Services - THS).
    * Biến kiểm soát $\text{lnemp}$: Logarithm tổng việc làm phi nông nghiệp cấp bang.
    * Chuỗi biến leads & lags: Đo lường tác động trước 2 năm (`admico_2`), trước 1 năm (`admico_1`), năm ban hành (`admico0`), sau 1 đến 3 năm (`admico1`–`admico3`), và từ 4 năm trở lên (`mico4`).
  * Khung kiểm soát nhiễu đa tầng qua 4 bước hồi quy (Multi-tier Confounder Controls):
    * `_Iy*` (Year FE - $\gamma_t$): Hiệu ứng cố định năm, kiểm soát các cú sốc kinh tế vĩ mô toàn quốc chung cho mọi bang tại từng năm.
    * `_Istate*` (State FE - $\alpha_s$): Hiệu ứng cố định bang, kiểm soát các đặc trưng văn hóa, thể chế và địa lý bất biến theo thời gian của từng địa phương.
    * `_IstaXt_*` (State $\times$ Linear Trends): Xu hướng thời gian tuyến tính riêng của từng bang, cho phép mỗi bang có tốc độ tăng trưởng kinh tế nền tảng độc lập ($s \times t$).
    * `_IstaXt*` (State $\times$ Linear & Quadratic Trends): Xu hướng thời gian bậc hai cấp bang, kiểm soát các gia tốc tăng trưởng phi tuyến tính ($s \times t + s \times t^2$).
    * `_IregX*` (Region $\times$ Year FE): Biến tương tác vùng theo năm, hấp thụ các cú sốc chu kỳ kinh tế cục bộ của từng khu vực địa lý lớn.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Giải quyết triệt để nguy cơ vi phạm giả định xu hướng song song do các quỹ đạo tăng trưởng kinh tế nội tại khác nhau giữa các địa phương. Việc bổ sung xu hướng thời gian tuyến tính và bậc hai cấp bang giúp phân lập chính xác cú sốc pháp lý ngoại sinh khỏi đà tăng trưởng tự thân của thị trường lao động.
### 2. Phân tích các ví dụ minh họa (Slide 2–5 & Transcript P1–P5)
* **Khai báo và Ước lượng Mô hình DID Đa kỳ cho Chính sách Trợ cấp SSSB (Slide 2 & Transcript P1–P2):**
  * *Biểu diễn logic:* 
    $$\text{yearsr} \in \{79, 80, 81, 82, 83\} \implies \begin{cases}        \text{tao\_3} = \mathbf{1}_{\{\text{yearsr}=79\}}, \; \text{tao\_2} = \mathbf{1}_{\{\text{yearsr}=80\}}, \; \text{tao\_1} = \mathbf{1}_{\{\text{yearsr}=81\}} & (\tau < 0, \text{Tiền can thiệp}) \\        \text{tao0} = \mathbf{1}_{\{\text{yearsr}=82\}} & (\tau = 0, \text{Năm cắt giảm}) \\        \text{tao1} = \mathbf{1}_{\{\text{yearsr}=83\}} & (\tau = 1, \text{Hậu can thiệp})      \end{cases}$$
    $$\text{tao}\_\tau\text{s} = \text{tao}\_\tau \times \text{fatherdec} \xrightarrow{\text{svy : regress coll fatherdec i.yearsr tao*s}} \hat{\delta}_\tau$$
  * *Cơ chế thực tế:* Các lệnh Stata gán giá trị 1 cho các năm tương ứng và thay thế giá trị khuyết bằng 0 để định hình các biến thời gian sự kiện. Biến tương tác `tao*s` với tình trạng mồ côi cha (`fatherdec`) cho phép kiểm tra: Các hệ số tiền can thiệp (`tao_3s`, `tao_2s`, `tao_1s`) kiểm định xu hướng song song; nếu các hệ số này không có ý nghĩa thống kê, sự sụt giảm xác suất vào đại học tại `tao0s` và `tao1s` phản ánh chính xác cú sốc bãi bỏ quỹ SSSB.
* **Quy trình Kiểm tra Tính vững Bậc thang trong Nghiên cứu Autor (2003) (Slide 3–5 & Transcript P3–P5):**
  * *Biểu diễn logic:* 
    $$\begin{aligned}       \text{Đặc tả 1:} & \quad \text{lnths} \sim \text{lnemp} + \text{Leads/Lags} + \text{\_Iy*} + \text{\_Istate*}, \quad \text{cluster(state)} \\       \text{Đặc tả 2:} & \quad \text{Đặc tả 1} + \text{\_IstaXt\_*} \quad (\text{Thêm xu hướng tuyến tính cấp bang}) \\       \text{Đặc tả 3:} & \quad \text{Đặc tả 1} + \text{\_IstaXt*} \quad (\text{Thêm xu hướng tuyến tính + bậc hai cấp bang}) \\       \text{Đặc tả 4:} & \quad \text{Đặc tả 3} + \text{\_IregX*} \quad (\text{Thêm biến giả vùng } \times \text{ năm})     \end{aligned}$$
  * *Cơ chế thực tế:* Ngành lao động thời vụ vốn phát triển bùng nổ trên toàn nước Mỹ trong giai đoạn nghiên cứu. Nếu một bang vốn dĩ đã có tốc độ dịch chuyển cơ cấu lao động nhanh hơn, mô hình cơ bản (Đặc tả 1) có thể ngộ nhận sự tăng trưởng này là do luật ngoại lệ sa thải gây ra. Bằng cách đưa thêm xu hướng tăng trưởng tuyến tính và phi tuyến của từng bang vào mô hình (Đặc tả 2 và 3), Stata bóc tách phần tăng trưởng tự nhiên này ra khỏi phương sai phần dư. Việc các hệ số của ngoại lệ hợp đồng ngầm (`admico0` đến `mico4`) vẫn giữ nguyên độ lớn và mức ý nghĩa thống kê trên Bảng 7 chứng minh tác động thúc đẩy lao động thời vụ là hiệu ứng nhân quả thực chất.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 4–5 & Transcript P4–P5)
* **Theo góc nhìn Thiết kế Kiểm soát Xu hướng Nội tại Cấp vùng (State-Specific Trends Strategy):**
  * *Mục tiêu:* Triệt tiêu nguy cơ vi phạm giả định xu hướng song song phát sinh từ các khác biệt về cơ cấu kinh tế dài hạn giữa các địa phương.
  * *Hành động can thiệp:* Trong các nghiên cứu đánh giá chính sách đa bang hoặc đa tỉnh, nhà nghiên cứu cần chủ động đưa biến tương tác xu hướng thời gian đặc thù `_IstaXt_*` vào phương trình để hấp thụ các yếu tố tăng trưởng nội tại của từng địa phương, bảo vệ tính hợp lệ nội tại (internal validity) của mô hình.
* **Theo góc nhìn Kiểm soát Cú sốc Chu kỳ Kinh tế Cục bộ (Regional Shocks Control):**
  * *Mục tiêu:* Phân lập tác động can thiệp khỏi các biến động chu kỳ hoặc sự kiện vĩ mô tác động riêng lên từng khu vực địa lý.
  * *Hành động can thiệp:* Ứng dụng biến tương tác vùng theo năm `_IregX*` để loại trừ ảnh hưởng của các cú sốc kinh tế vùng (như khủng hoảng công nghiệp miền Trung Tây hoặc bùng nổ công nghệ bờ Tây) diễn ra trùng với thời điểm thay đổi quy định pháp lý.
* **Theo góc nhìn Chuẩn hóa Quy trình Kiểm định Độ nhạy (Stepwise Robustness Protocol):**
  * *Mục tiêu:* Cung cấp bằng chứng thực nghiệm vững chắc và đáng tin cậy trước khi tư vấn điều chỉnh chính sách thị trường lao động.
  * *Hành động can thiệp:* Báo cáo kết quả nghiên cứu kinh tế lượng theo chuỗi hồi quy tiến biến 4 bước từ cơ bản đến kiểm soát phi tuyến; đồng thời luôn sử dụng hiệu chỉnh sai số chuẩn theo cụm cấp bang `cluster(state)` để tránh việc thổi phồng mức ý nghĩa thống kê do hiện tượng tự tương quan chuỗi.
# Regression Discontinuity
## Ý Tưởng Cốt Lõi Của Thiết Kế Hồi Quy Gián Đoạn (The Basic Idea of Regression Discontinuity Design - RDD)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6 & Transcript P1–P6)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Tác động Bán thực nghiệm Cận biên (Empirical Causal Inference & Quasi-Experimental Evaluation - Explanatory & Counterfactual Modeling)**.
* **Bản chất kỹ thuật:** 
  * Khai thác một quy tắc định lượng mang tính bắt buộc (mandatory/institutional rules) dựa trên một biến số chạy/biến chỉ định liên tục (Running/Forcing Variable $X$) cắt qua một ngưỡng xác định (Cutoff / Threshold $c$) để phân chia đối tượng nghiên cứu thành nhóm can thiệp và nhóm đối chứng.
  * Giả định ngẫu nhiên hóa cục bộ (Local Randomization Assumption): Trong một khoảng lân cận cực hẹp quanh điểm ngưỡng $[c - \varepsilon, c + \varepsilon]$, các đối tượng không có khả năng thao túng chính xác vị trí của mình (No Precise Manipulation). Khi đó, các đặc tính quan sát được và không quan sát được của hai nhóm ngay sát hai bên ngưỡng hoàn toàn tương đồng:
    $$\lim_{X \to c^+} \mathbb{E}[U \mid X] = \lim_{X \to c^-} \mathbb{E}[U \mid X]$$
  * Tác động can thiệp trung bình cục bộ (Local Average Treatment Effect - LATE tại $X = c$) được xác định bằng độ lớn của bước nhảy gián đoạn (Discontinuous Jump) của biến kết quả $Y$:
    $$\tau_{\text{RD}} = \lim_{X \downarrow c} \mathbb{E}[Y \mid X] - \lim_{X \uparrow c} \mathbb{E}[Y \mid X]$$
  * Hai phân loại kỹ thuật của mô hình RDD:
    * *Hồi quy gián đoạn sắc nét (Sharp RD):* Quy tắc được thực thi tuyệt đối; việc vượt qua ngưỡng xác định hoàn toàn việc nhận can thiệp ($D_i = \mathbf{1}_{\{X_i \ge c\}}$), xác suất nhận can thiệp nhảy vọt từ $0$ lên $1$ tại $c$.
    * *Hồi quy gián đoạn mờ (Fuzzy RD):* Việc vượt qua ngưỡng chỉ làm thay đổi đột ngột xác suất nhận can thiệp ($0 < \lim_{X \downarrow c} \Pr(D=1 \mid X) - \lim_{X \uparrow c} \Pr(D=1 \mid X) < 1$); mô hình giải quyết thông qua phương pháp Biến công cụ (IV-RD).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Nguyên lý tự nhiên không có bước nhảy đột ngột ("There are no cutoffs in nature" - bản chất thế giới thực diễn tiến liên tục). Do đó, sự đứt gãy quan sát được tại ngưỡng chỉ có thể bắt nguồn từ quy định can thiệp nhân tạo. RDD được xem là "tiêu chuẩn vàng" trong các phương pháp bán thực nghiệm vì cung cấp bằng chứng nhân quả có độ tin cậy tiệm cận thử nghiệm lâm sàng ngẫu nhiên (RCT).
### 2. Phân tích các ví dụ minh họa (Slide 4, 7–12 & Transcript P4, P7–P12)
* **Thí nghiệm Cận biên Điểm số Ngưỡng (Threshold Visualization - Slide 4):**
  * *Biểu diễn logic:* 
    $$X = 599 \text{ (Đối chứng)} \xleftrightarrow{\text{Năng lực xấp xỉ đồng nhất}} X = 601 \text{ (Can thiệp)} \quad (\text{Ngưỡng trúng tuyển: } c = 600)$$
  * *Cơ chế thực tế:* Khoảng cách giữa 599 điểm và 601 điểm thuần túy là sai số ngẫu nhiên của bài thi (may rủi, sức khỏe trong ngày thi) chứ không phản ánh sự khác biệt thực chất về trí tuệ hay năng lực. Việc thí sinh 600 điểm được cấp học bổng còn thí sinh 599 điểm bị từ chối tạo ra một thử nghiệm ngẫu nhiên tự nhiên ngay tại lân cận điểm cắt.
* **Nghiên cứu Quy mô Lớp học và Quy tắc Maimonides tại Israel (Angrist & Lavy, 1999 - Slide 7–12):**
  * *Biểu diễn logic:* 
    $$\text{Mô hình OLS ngây thơ:} \quad \text{Achievement}_i = \beta_0 + \beta_1 \text{ClassSize}_i + \varepsilon_i \implies \text{Cov}(\text{ClassSize}, \varepsilon) \neq 0 \quad (\text{Chệch chọn lọc})$$
    $$\text{Quy tắc Maimonides: } \begin{cases} 
      \text{Ghi danh } = 40 \implies \text{Số lớp} = 1 \implies \text{Sĩ số} = 40 \\ 
      \text{Ghi danh } = 41 \implies \text{Số lớp} = 2 \implies \text{Sĩ số} \in \{20, 21\} 
    \end{cases} \xrightarrow{\Delta \text{ClassSize} \approx -20} \text{Tách lớp đột ngột}$$
  * *Cơ chế thực tế:* Đánh giá tác động của sĩ số lớp học bằng OLS luôn bị chệch do hiện tượng tự chọn: phụ huynh có điều kiện kinh tế thường chủ động chọn trường lớp nhỏ, hoặc nhà trường ưu tiên xếp học sinh yếu vào lớp quy mô nhỏ. Quy tắc Maimonides quy định sĩ số tối đa là 40 học sinh; chỉ cần có thêm học sinh thứ 41 ghi danh, trường bắt buộc phải bổ sung giáo viên và chia đôi khối thành 2 lớp với quy mô 20 và 21 học sinh. Việc trường có 40 hay 41 học sinh hoàn toàn nằm ngoài tầm kiểm soát của phụ huynh, từ đó bóc tách chính xác tác động nhân quả thuần túy của việc thu hẹp lớp học lên kết quả học tập.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 7, 9–12 & Transcript P2, P7–P12)
* **Theo góc nhìn Đánh giá Hiệu quả Đầu tư Ngân sách Công (Public Spending Cost-Effectiveness):**
  * *Mục tiêu:* Tránh lãng phí hàng tỷ USD ngân sách giáo dục vào các chương trình giảm quy mô lớp học kém hiệu quả.
  * *Hành động can thiệp:* Sử dụng RDD để tính toán chính xác tác động biên thực chất của việc giảm sĩ số trước khi ban hành chính sách diện rộng; cân đối giữa chi phí tuyển dụng thêm giáo viên/xây dựng phòng học mới với mức độ cải thiện điểm số thực nghiệm thu được.
* **Theo góc nhìn Khai thác Quy tắc Thể chế Làm Thí nghiệm Tự nhiên (Institutional Rule Exploitation):**
  * *Mục tiêu:* Thiết lập các nghiên cứu đánh giá tác động có độ tin cậy cao mà không vấp phải rào cản đạo đức hoặc chi phí triển khai RCT quá lớn.
  * *Hành động can thiệp:* Rà soát các chính sách công có ngưỡng định lượng ngặt nghèo (ngưỡng chuẩn nghèo nhận trợ cấp an sinh, ngưỡng điểm sàn tuyển dụng/thăng tiến, độ tuổi hưởng bảo hiểm); sử dụng các ngưỡng này làm điểm cắt $c$ để đo lường hiệu quả chương trình.
* **Theo góc nhìn Kiểm soát Gian lận và Tính Hợp lệ của Thiết kế (Design Validity & Anti-Manipulation):**
  * *Mục tiêu:* Bảo đảm ước lượng nhân quả không bị sai lệch bởi hành vi lách luật hoặc thao túng điểm số quanh ngưỡng.
  * *Hành động can thiệp:* Kiểm tra tính liên tục của hàm mật độ biến chỉ định quanh ngưỡng (McCrary density test) để phát hiện tình trạng dồn ứ bất thường; đối chiếu tính liên tục của các biến kiểm soát nền tảng tại điểm cắt để bảo đảm tính ngẫu nhiên hóa cục bộ không bị xâm phạm.
## Thiết Lập Mô Hình Hồi Quy Gián Đoạn (Model Settings of Regression Discontinuity)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript P1–P7)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Mô hình Hóa Kết quả Tiềm năng và Đánh giá Tác động Bán thực nghiệm (Empirical Causal Inference & Potential Outcomes Modeling - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Đánh giá hiệu ứng can thiệp trong bối cảnh phi thực nghiệm (non-experimental setting) khi việc tiếp nhận can thiệp được quyết định hoàn toàn bởi việc biến gán/biến chạy quan sát được ($x_i$) có vượt qua một ngưỡng xác định ($x_0$) hay không:
    $$D_i = \mathbf{1}_{\{x_i \ge x_0\}} = \begin{cases} 1 & \text{nếu } x_i \ge x_0 \\ 0 & \text{nếu } x_i < x_0 \end{cases}$$
    Trạng thái can thiệp $D_i$ là một hàm tất định và gián đoạn (deterministic & discontinuous function) của biến chạy $x_i$. Chỉ cần biết tọa độ $x_i$, trạng thái $D_i$ hoàn toàn được xác định mà không có yếu tố ngẫu nhiên hay tự lựa chọn.
  * Giả định tính liên tục cốt lõi (Core Continuity Assumption):
    $$\lim_{x_i \to x_0} \mathbb{E}(Y_{0i} \mid x_i) = \mathbb{E}(Y_{0i} \mid x_0) \quad \text{và} \quad \lim_{x_i \to x_0} \mathbb{E}(Y_{1i} \mid x_i) = \mathbb{E}(Y_{1i} \mid x_0)$$
    Kỳ vọng của các kết quả tiềm năng ($Y_{0i}, Y_{1i}$) phải biến thiên liên tục theo biến chạy $x_i$ tại điểm cắt $x_0$. Điều này đồng nghĩa với việc toàn bộ các yếu tố quyết định khác không quan sát được của $Y$ đều có mối quan hệ biến thiên liên tục với biến gán $X$ qua ngưỡng.
  * Mô hình kết quả tiềm năng tuyến tính với hiệu ứng không đổi (Linear Constant Effects Model):
    $$\mathbb{E}(Y_{0i} \mid x_i) = \alpha + \beta x_i$$
    $$Y_{1i} = Y_{0i} + \rho \implies Y_{1i} - Y_{0i} = \rho \quad (\text{Hiệu ứng nhân quả cá nhân})$$
    Dẫn đến phương trình hồi quy tham số chuẩn tắc:
    $$Y_i = \alpha + \beta x_i + \rho D_i + \eta_i$$
    Trong đó, $\eta_i = Y_{0i} - \mathbb{E}(Y_{0i} \mid x_i)$ là số hạng sai số ngẫu nhiên thỏa mãn $\mathbb{E}(\eta_i \mid x_i) = 0$. Tham số $\rho$ chính là hiệu ứng nhân quả cục bộ cần ước lượng.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * So với Thử nghiệm Ngẫu nhiên Có đối chứng (RCT): Trong RCT, biến can thiệp $D_i$ được phân bổ ngẫu nhiên độc lập với mọi biến kiểm soát ($\text{Cov}(D_i, x_i) = 0$). Ngược lại, trong mô hình Hồi quy Gián đoạn (RD), biến quan tâm $D_i$ không chỉ có tương quan mà còn là một hàm tất định của $x_i$. Vì vậy, việc kiểm soát chính xác dạng hàm của biến chạy $x_i$ trong phương trình hồi quy là điều kiện tiên quyết để bóc tách hiệu ứng chính sách $\rho$ khỏi xu hướng biến thiên tự nhiên của $X$.
### 2. Phân tích các ví dụ minh họa (Slide 3–7 & Transcript P3–P7)
* **Cơ chế nhảy bậc tất định tại ngưỡng cắt (Slide 5, 6 & Transcript P5, P6):**
  * *Biểu diễn logic:* 
    $$x_i < x_0 \implies D_i = 0; \quad x_i \ge x_0 \implies D_i = 1 \quad \left(\lim_{\varepsilon \to 0^+} [D(x_0) - D(x_0 - \varepsilon)] = 1\right)$$
  * *Cơ chế thực tế:* Cho dù giá trị của biến chạy $x_i$ tiến sát đến ngưỡng $x_0$ đến mức độ nào (ví dụ: $x_0 - 0.001$), trạng thái xử lý vẫn giữ nguyên bằng 0 cho đến khi chạm đúng mốc $x_0$. Bước nhảy đột ngột từ 0 lên 1 tạo ra một sự đứt gãy nhân tạo, cho phép nhà nghiên cứu so sánh các quan sát nằm ngay sát hai bên ranh giới như một thử nghiệm bán ngẫu nhiên cục bộ.
* **Khung kết quả tiềm năng và phân rã hiệu ứng nhân quả $\rho$ (Slide 6, 7 & Transcript P6, P7):**
  * *Biểu diễn logic:* 
    $$Y_i = (1 - D_i) Y_{0i} + D_i Y_{1i} = Y_{0i} + D_i (Y_{1i} - Y_{0i}) \xrightarrow{Y_{1i} = Y_{0i} + \rho} Y_i = \alpha + \beta x_i + \rho D_i + \eta_i$$
  * *Cơ chế thực tế:* Kết quả quan sát được $Y_i$ thực chất là sự hòa trộn giữa kết quả khi không nhận can thiệp ($Y_{0i}$) và khi có can thiệp ($Y_{1i}$). Bằng việc thiết lập hàm cơ sở của nhóm đối chứng theo dạng tuyến tính $\alpha + \beta x_i$, mô hình hồi quy phân rã biến thiên của $Y$ thành hai thành phần riêng biệt: đà tăng trưởng nền tảng theo biến chạy (hệ số góc $\beta$) và bước dịch chuyển song song của đường hồi quy do can thiệp mang lại (độ dịch chuyển tung độ gốc $\rho$).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 3, 7 & Transcript P2, P3, P7)
* **Theo góc nhìn Kiểm chứng Tính hợp lệ của Giả định Ngoại sinh (Continuity Verification):**
  * *Mục tiêu:* Đảm bảo kết quả ước lượng không bị biến dạng do hành vi can thiệp chủ quan hay biến cố ngoại cảnh xảy ra đồng thời.
  * *Hành động can thiệp:* Kiểm tra chặt chẽ giả định liên tục bằng cách xác nhận các biến kiểm soát quan sát được khác ($W_i$) không bị gián đoạn tại ngưỡng $x_0$; đồng thời rà soát xem đối tượng nghiên cứu có khả năng tự điều chỉnh hoặc thao túng điểm số để vượt ngưỡng hay không (No Precise Manipulation).
* **Theo góc nhìn Định lượng Hiệu quả Can thiệp Biên (Marginal Policy Effect):**
  * *Mục tiêu:* Đưa ra căn cứ định lượng phục vụ việc mở rộng, thu hẹp hoặc điều chỉnh mức ngưỡng của các chương trình can thiệp công.
  * *Hành động can thiệp:* Khai thác hệ số $\hat{\rho}$ như thước đo tác động thực chất của chính sách tại điểm cận biên; nếu $\hat{\rho}$ mang giá trị dương có ý nghĩa thống kê vượt trội so với chi phí vận hành, nhà hoạch định có thể cân nhắc hạ ngưỡng $x_0$ để mở rộng đối tượng thụ hưởng.
* **Theo góc nhìn Đa dạng hóa Dạng hàm và Kiểm soát Sai số Mô hình (Functional Form Robustness):**
  * *Mục tiêu:* Tránh ngộ nhận mối quan hệ phi tuyến tính tự nhiên của biến chạy thành hiệu ứng gián đoạn chính sách.
  * *Hành động can thiệp:* Do $Y_i$ có thể phụ thuộc phi tuyến vào $x_i$, transcript bài học nhấn mạnh $Y_i$ có thể được chỉ định theo nhiều dạng hàm khác nhau. Người phân tích cần thử nghiệm thêm các dạng hàm bậc cao ($x_i^2, x_i^3$), cho phép hệ số góc biến thiên ở hai bên điểm cắt $(x_i - x_0) \times D_i$, hoặc áp dụng các kỹ thuật phi tham số trong khoảng băng thông lân cận để kiểm chứng tính vững của ước lượng $\hat{\rho}$.
## Ước Lượng Tham Số Trong Thiết Kế Hồi Quy Gián Đoạn (Parametric Estimation of RD Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–3, 8–10, 13–15 & Transcript P1–P15)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Mô hình Hóa Ước lượng Tham số Kinh tế lượng Cận biên (Empirical Causal Inference & Parametric Boundary Estimation - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Áp dụng các mô hình hồi quy tham số để chỉ định dạng hàm toán học mô tả mối quan hệ giữa biến kết quả ($Y$) và biến gán ($X$), từ đó bóc tách độ cao của bước nhảy gián đoạn tại điểm cắt ($x_0$) làm ước lượng của hiệu ứng can thiệp $\rho$.
  * Kỹ thuật Tịnh tiến tâm biến gán (Recentering of Assignment Variable):
    $$\tilde{x}_i = x_i - x_0$$
    * Phép biến đổi đưa gốc tọa độ của trục hoành về đúng ngưỡng cắt $x_0$, giúp hệ số chặn $\beta_0$ đại diện cho giá trị kỳ vọng của biến kết quả đối với nhóm đối chứng ngay tại điểm ngưỡng, và tham số đi kèm biến can thiệp trực tiếp biểu thị độ lớn tác động can thiệp biên.
  * Phương trình hồi quy tham số tuyến tính chuẩn tắc:
    $$Y_i = \beta_0 + \beta_1 (x_i - x_0) + \beta_2 D_i + \varepsilon_i$$
    * $\beta_0 = \mathbb{E}[Y_{0i} \mid x_i = x_0]$: Giá trị nền tảng tại ngưỡng khi không có can thiệp.
    * $\beta_2 = \lim_{x \downarrow x_0} \mathbb{E}[Y_i \mid x] - \lim_{x \uparrow x_0} \mathbb{E}[Y_i \mid x] = \rho$: Hiệu ứng can thiệp nhân quả cục bộ.
  * Mở rộng hồi quy phi tuyến với đa thức bậc $p$ (Polynomial of Order $p$):
    * *Đa thức cùng bậc ở hai bên ngưỡng (Same polynomial on both sides):*
      $$Y_i = \alpha + \sum_{k=1}^p \beta_k (x_i - x_0)^k + \rho D_i + \varepsilon_i$$
    * *Đa thức khác biệt linh hoạt ở hai bên ngưỡng (Different polynomials on either side):*
      $$Y_i = \alpha + \sum_{k=1}^p \beta_k (x_i - x_0)^k + \rho D_i + \sum_{k=1}^p \gamma_k \big[D_i \times (x_i - x_0)^k\big] + \varepsilon_i$$
      Cơ chế này cho phép đường khớp dữ liệu có độ dốc, độ cong và dạng phi tuyến biến thiên độc lập hoàn toàn giữa phía trước và phía sau ngưỡng can thiệp.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Ước lượng tham số tận dụng toàn bộ mẫu dữ liệu hoặc một cửa sổ lân cận được định trước dựa trên dạng hàm giải tích xác định. Thách thức kỹ thuật lớn nhất là rủi ro định dạng sai dạng hàm (functional form misspecification) — nếu áp đặt sai bậc đa thức, sự uốn lượn phi tuyến tự nhiên của dữ liệu có thể bị ngộ nhận thành một bước nhảy gián đoạn nhân tạo tại ngưỡng.

### 2. Phân tích các ví dụ minh họa (Slide 4–7, 11–15 & Transcript P4–P7, P11–P15)
* **Kỹ thuật Tịnh tiến Tâm và Mô hình Đánh giá Sĩ số Lớp học (Slide 4–7 & Transcript P4–P7):**
  * *Biểu diễn logic:* 
    $$\text{SIZE}_i \longrightarrow \text{CSIZE}_i = \text{SIZE}_i - 41 \implies \text{READ}_i = \beta_0 + \beta_1 \text{CSIZE}_i + \beta_2 \text{SMALL}_i + \varepsilon_i$$
    $$\mathbb{E}[\text{READ}_i \mid \text{SIZE}_i = 41, \text{SMALL}_i = 0] = \beta_0 \quad \text{và} \quad \mathbb{E}[\text{READ}_i \mid \text{SIZE}_i = 41, \text{SMALL}_i = 1] = \beta_0 + \beta_2$$
  * *Cơ chế thực tế:* Trong bài toán sĩ số lớp học theo quy tắc Maimonides, ngưỡng phân tách lớp là 41 học sinh. Giới hạn mẫu khảo sát trong nhóm sĩ số từ 36 đến 41. Bằng cách định nghĩa biến dự báo mới $\text{CSIZE} = \text{SIZE} - 41$, gốc tọa độ được dời về vị trí 41. Khi $\text{CSIZE} = 0$, điểm đọc trung bình của học sinh ở lớp quy mô lớn ($\text{SMALL} = 0$) là $\beta_0$, còn học sinh ở lớp quy mô nhỏ được chia tách ($\text{SMALL} = 1$) là $\beta_0 + \beta_2$. Do đó, hệ số $\beta_2$ biểu diễn tường minh quy mô hiệu ứng can thiệp tại ranh giới mà không cần thực hiện thêm các phép biến đổi hậu kiểm phức tạp.
* **Hồi quy Đa thức Bậc cao và Thách thức Xác định Phương trình (Slide 11–15 & Transcript P11–P15):**
  * *Biểu diễn logic:* 
    $$Y_i = \alpha + \beta_1 (x_i - x_0) + \beta_2 (x_i - x_0)^2 + \rho D_i + \gamma_1 [D_i (x_i - x_0)] + \gamma_2 [D_i (x_i - x_0)^2] + \varepsilon_i$$
    $$\text{Thử nghiệm bậc đa thức: } p = 1 \text{ (Tuyến tính)} \neq p = 2 \text{ (Bậc hai)} \neq p = 3 \text{ (Bậc ba)} \implies \hat{\rho}^{(1)} \neq \hat{\rho}^{(2)} \neq \hat{\rho}^{(3)}$$
  * *Cơ chế thực tế:* Mối quan hệ thực tế giữa biến chạy và biến kết quả thường biểu hiện phi tuyến phức tạp (dạng sóng, cong gập). Nếu gượng ép dùng đường hồi quy tuyến tính ($p=1$), đường khớp sẽ bị méo mó bởi các điểm dữ liệu nằm xa ngưỡng, tạo ra bước nhảy giả tạo tại $x_0$. Cho phép mô hình sử dụng đa thức bậc cao khác nhau ở hai bên ngưỡng giúp ôm sát hình dáng phân phối của dữ liệu. Tuy nhiên, thách thức cốt lõi là việc lựa chọn bậc đa thức $p$ mang tính cảm tính; nếu lạm dụng đa thức bậc quá cao ($p \ge 3$), mô hình dễ bị hiện tượng quá khớp (overfitting) và gây sai số nghiêm trọng ở hai đầu mút của khoảng dữ liệu.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 8–10, 15 & Transcript P8–P10, P15)
* **Theo góc nhìn Chuẩn hóa Quy trình Ước lượng Tham số (Estimation Workflow Standardization):**
  * *Mục tiêu:* Thiết lập mô hình hồi quy sao cho các kết quả thống kê máy tính xuất ra có thể diễn giải trực tiếp thành tác động chính sách mà không gây nhầm lẫn.
  * *Hành động can thiệp:* Luôn thực hiện bước chuẩn hóa tịnh tiến tâm ($x_i - x_0$) đối với biến gán trước khi chạy hồi quy; điều này bảo đảm kiểm định $t$-test của hệ số biến can thiệp $\beta_2$ chính là kiểm định ý nghĩa thống kê của hiệu ứng can thiệp tại điểm ngưỡng.
* **Theo góc nhìn Kiểm soát Rủi ro Sai lệch Dạng hàm (Functional Form Sensitivity):**
  * *Mục tiêu:* Loại trừ nguy cơ kết luận sai về hiệu quả của chính sách do áp đặt sai dạng phương trình hồi quy.
  * *Hành động can thiệp:* Tiến hành phân tích độ nhạy bằng cách báo cáo kết quả ước lượng $\hat{\rho}$ qua nhiều dạng hàm khác nhau (tuyến tính, bậc hai, bậc ba có và không có biến tương tác độ dốc); nếu giá trị $\hat{\rho}$ thay đổi quá lớn hoặc đổi dấu khi đổi bậc đa thức, không được vội vàng đưa ra kết luận can thiệp.
* **Theo góc nhìn Chuyển tiếp Phương pháp luận Sang Phi tham số (Non-parametric Transition):**
  * *Mục tiêu:* Vượt qua bế tắc kỹ thuật khi dữ liệu thực tế quá phân tán và không thể mô hình hóa chính xác bằng đa thức toàn cục.
  * *Hành động can thiệp:* Xuất phát từ thách thức nhận diện phương trình ở Slide 15, nhà phân tích cần chuyển dịch trọng tâm từ hồi quy tham số toàn cục sang các phương pháp hồi quy phi tham số cục bộ (Non-parametric Local Linear Regression) trong một cửa sổ băng thông hẹp quanh ngưỡng để giảm thiểu tối đa độ chệch mô hình.
## Ước Lượng Phi Tham Số Trong Thiết Kế Hồi Quy Gián Đoạn (Non-parametric Estimation of RD Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–4, 7–9 & Transcript P1–P9)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Bán thực nghiệm Cận biên Phi tham số (Non-parametric Boundary Causal Inference - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Tiếp cận bài toán đánh giá hiệu ứng can thiệp cận biên mà không cần áp đặt cấu trúc dạng hàm toán học toàn cục đối với kỳ vọng có điều kiện $\mathbb{E}(y_{0i} \mid x_i)$ hay $\mathbb{E}(y_{1i} \mid x_i)$.
  * Đo lường chênh lệch trung bình trong lân cận cực nhỏ (Mean difference at cutoffs):
    $$\tau_{\text{LATE}} = \lim_{x \downarrow x_0} \mathbb{E}[Y \mid X = x] - \lim_{x \uparrow x_0} \mathbb{E}[Y \mid X = x]$$
    * Thu hẹp mẫu khảo sát trong một cửa sổ đối xứng $[x_0 - h, x_0 + h]$ quanh điểm ngưỡng $x_0$, với $h$ là băng thông (bandwidth).
    * So sánh giá trị kỳ vọng biến kết quả giữa các quan sát ngay sát bên phải ($x_0 \le x_i \le x_0 + h$) và bên trái ($x_0 - h \le x_i < x_0$) của ngưỡng cắt.
  * Phương pháp hàm hạt nhân (Kernel Method):
    $$w_i = K\left(\frac{x_i - x_0}{h}\right)$$
    * Hàm hạt nhân $K(\cdot)$ đóng vai trò là hàm gán trọng số liên tục hoặc gián đoạn, gán tỷ trọng đóng góp cao nhất cho các quan sát nằm sát điểm cắt $x_0$ và suy giảm dần khi khoảng cách $|x_i - x_0|$ tiến dần về biên giới hạn $h$.
  * Hồi quy tuyến tính cục bộ (Local Linear Regression): Khắc phục hiện tượng chệch biên (Boundary problem) bằng cách khớp hai đường thẳng tuyến tính riêng biệt cho hai phân nhóm trong cửa sổ băng thông $h$:
    $$\min_{\alpha, \beta, \rho, \gamma} \sum_{i: |x_i - x_0| \le h} \left[ Y_i - \alpha - \beta (x_i - x_0) - \rho D_i - \gamma D_i (x_i - x_0) \right]^2 K\left(\frac{x_i - x_0}{h}\right)$$
    Trong đó, hệ số $\rho$ chính là độ cao bước nhảy gián đoạn tại đúng tọa độ biên $x_0$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Tính hợp lệ của ước lượng phi tham số hoàn toàn độc lập với giả định hiệu ứng can thiệp không đổi ($y_{1i} - y_{0i} = \rho$) và không phụ thuộc vào nguy cơ định dạng sai dạng hàm (functional form misspecification) của hồi quy tham số.
  * Ước lượng thu được mang bản chất là Hiệu ứng can thiệp trung bình cục bộ (**Local Average Treatment Effect - Local ATE**).
  * Đánh đổi kỹ thuật (Trade-off): Giảm thiểu triệt để độ chệch mô hình (Bias) nhưng phải chấp nhận phương sai lớn hơn (tính chính xác/độ chuẩn xác thống kê giảm do kích thước mẫu bị thu hẹp trong khoảng băng thông hẹp).
### 2. Phân tích các ví dụ minh họa (Slide 2–8 & Transcript P2–P8)
* **Vấn đề Chệch Biên trong Phương pháp Hạt nhân Truyền thống (Boundary Problems in Kernel Methods - Slide 7):**
  * *Biểu diễn logic:* 
    $$f(X) \text{ có xu hướng dốc} \implies \mathbb{E}[Y \mid x_0 \le X \le x_0 + h] - \mathbb{E}[Y \mid x_0 - h \le X < x_0] = A'B' \neq AB$$
  * *Cơ chế thực tế:* Khi hàm kết quả tiềm năng $f(X)$ biểu hiện xu hướng tăng hoặc giảm rõ rệt theo biến chạy $X$, việc áp dụng hàm hạt nhân chữ nhật (hoặc tính trung bình giản đơn từng bên lân cận) sẽ lấy trọng tâm của nửa khoảng $[x_0, x_0 + h]$ và $[x_0 - h, x_0]$ để đại diện cho giá trị tại điểm biên $x_0$. Do độ dốc của hàm số, khoảng cách giữa hai giá trị trung bình này ($A'B'$) bị dịch chuyển lệch hẳn so với bước nhảy gián đoạn thực tế tại đúng điểm cắt ($AB$), gây ra độ chệch hệ thống (systematic bias).
* **Cơ chế Khắc phục của Hồi quy Tuyến tính Cục bộ (Local Linear Regression - Slide 8–9):**
  * *Biểu diễn logic:* 
    $$\text{Thu hẹp băng thông } h \longrightarrow \text{Bậc đa thức cần thiết } p \downarrow \longrightarrow \hat{\rho} \text{ duy trì ổn định mà không cần nhiều biến kiểm soát}$$
  * *Cơ chế thực tế:* Thay vì coi giá trị dự báo là một đường phẳng nằm ngang ở mỗi bên, hồi quy tuyến tính cục bộ cho phép đường khớp dữ liệu có độ dốc riêng biệt. Độ dốc này hấp thụ hoàn toàn xu hướng tăng/giảm tự nhiên của $f(X)$, từ đó ngoại suy chính xác về tung độ gốc tại điểm biên $x_0$ của cả hai phía. Nhờ đó, bài toán ước lượng không cần phải đưa thêm các số hạng đa thức bậc cao ($x^2, x^3$) hay tập biến kiểm soát phức tạp mà vẫn bóc tách được bước nhảy gián đoạn thuần túy.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 3, 7, 8–9 & Transcript P3, P7, P8–P9)
* **Theo góc nhìn Cân bằng Tối ưu giữa Độ chệch và Độ chính xác (Bandwidth Selection & Bias-Precision Tradeoff):**
  * *Mục tiêu:* Lựa chọn độ rộng băng thông $h$ để đạt được sai số toàn phương trung bình (MSE) nhỏ nhất.
  * *Hành động can thiệp:* Băng thông $h$ quyết định độ rộng cửa sổ dữ liệu quanh ngưỡng; $h$ càng nhỏ thì độ chệch càng thấp nhưng phương sai càng cao do ít quan sát, ngược lại $h$ lớn thì tăng độ chuẩn xác thống kê nhưng tăng nguy cơ sai lệch do phi tuyến. Nhà phân tích cần sử dụng các thuật toán lựa chọn băng thông tự động tối ưu dựa trên dữ liệu (Data-driven optimal bandwidth algorithms) và báo cáo kiểm tra độ nhạy tại các dải băng thông khác nhau ($0.5h^*, h^*, 2h^*$).
* **Theo góc nhìn Lựa chọn Hàm Trọng số Cận biên (Kernel Weighting Strategy):**
  * *Mục tiêu:* Tối ưu hóa mức độ nhạy cảm của các điểm quan sát đối với ước lượng hiệu ứng can thiệp.
  * *Hành động can thiệp:* Ưu tiên sử dụng hàm hạt nhân tam giác (Triangular Kernel) hoặc hạt nhân Epanechnikov thay cho hàm hạt nhân chữ nhật (Uniform/Rectangular Kernel); điều này đảm bảo các quan sát nằm tiệm cận sát điểm cắt $x_0$ sẽ được trao quyền quyết định lớn nhất trong ước lượng LATE, triệt tiêu tối đa ảnh hưởng từ các điểm dữ liệu xa ngưỡng.
* **Theo góc nhìn Thực thi Mô hình Chuẩn tắc trong Đánh giá Chính sách (Best Practice Implementation):**
  * *Mục tiêu:* Xây dựng mô hình ước lượng cận biên có tính vững chắc và thuyết phục cao trong công bố khoa học và hoạch định quyết sách.
  * *Hành động can thiệp:* Thay vì chỉ dựa vào hồi quy tham số toàn cục dễ bị chỉ trích do giả định dạng hàm chủ quan, thực hành kinh tế lượng hiện đại yêu cầu lấy kết quả từ Hồi quy tuyến tính cục bộ (Local Linear Regression) làm kết quả tham chiếu trọng tâm; luôn kết hợp minh họa trực quan bằng biểu đồ phân cụm (Binned Scatter Plot) để khẳng định tính chân thực của bước nhảy tại ngưỡng.## Workshop 1: Stata-Based Analysis of RD

## Thực Hành Phân Tích Thiết Kế Hồi Quy Gián Đoạn (RD) Trên Phần Mềm Stata (Workshop 1: Stata-Based Analysis of RD Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–3 & Transcript P1–P3)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Tác động Bán thực nghiệm Cận biên trên Stata (Empirical Causal Inference & Semi-parametric Boundary Estimation on Stata - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Cấu trúc triển khai mô hình Hồi quy Gián đoạn (RD) trong Stata thông qua việc xác lập đồng thời 3 thành tố:
    * *Biến chạy/Biến gán (Running variable - $X$):* Thang đo liên tục quyết định trạng thái can thiệp (ví dụ: Chênh lệch tỷ lệ phiếu bầu `d`).
    * *Biến kết quả (Outcome variable - $Y$):* Chỉ số mục tiêu cần đánh giá tác động nhân quả (ví dụ: Logarithm chi tiêu liên bang `lne`).
    * *Điểm cắt/Ngưỡng can thiệp (Cutoff - $c$):* Ranh giới chính sách xác định sự thay đổi trạng thái can thiệp (mặc định trong Stata là $c = 0$).
  * Nguyên lý vận hành của gói lệnh chuyên dụng `rd` trong Stata:
    * Cài đặt và cấu hình: Triển khai qua lệnh `ssc inst rd, replace` hoặc `net get rd` để nạp các thuật toán hồi quy phi tham số và bán tham số cận biên.
    * Ước lượng hồi quy tuyến tính cục bộ có trọng số hạt nhân (Kernel-weighted Local Linear Regression):
      $$\min_{\alpha, \beta, \rho, \gamma} \sum_{i: \vert{}d_i\vert{} \le h} \left[ Y_i - \alpha - \beta d_i - \rho \mathbf{1}_{\{d_i \ge 0\}} - \gamma (d_i \times \mathbf{1}_{\{d_i \ge 0\}}) \right]^2 K\left(\frac{d_i}{h}\right)$$
      Thuật toán tự động tính toán băng thông tối ưu $h^*$ (Optimal Bandwidth theo tiêu chuẩn Imbens-Kalyanaraman) và bóc tách bước nhảy gián đoạn $\rho$ làm ước lượng LATE.
    * Kiểm soát độ nhạy băng thông với tùy chọn `mbw()` (Multiple Bandwidth): Phân tích ước lượng tại 3 mức quy chuẩn gồm $100\% h^*$ (băng thông chuẩn), $50\% h^*$ (thu hẹp mẫu để giảm độ chệch), và $200\% h^*$ (mở rộng mẫu để tăng độ chuẩn xác thống kê/giảm phương sai).
    * Kiểm tra tính liên tục của hiệp biến ngoại sinh (Covariate Continuity Check): Tùy chọn `x(varlist)` (ví dụ: `x(pop-vet)`) thực hiện kiểm định RD đồng thời trên toàn bộ các biến đặc tính nền tảng để xác minh tính cân bằng trước can thiệp.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Thay vì thực hiện hồi quy OLS gượng ép trên toàn bộ dải dữ liệu toàn cục, câu lệnh `rd` tự động thu hẹp cửa sổ phân tích quanh ngưỡng $c=0$, áp dụng hàm trọng số hạt nhân tam giác để gán ưu tiên cho các điểm lân cận sát biên, đồng thời tích hợp xuất trực quan hóa phân bố điểm gom cụm (binned scatter) và đường khớp hai phía.
### 2. Phân tích các ví dụ minh họa (Slide 3–6 & Transcript P3–P6)
* **Ước lượng Tác động của Thắng cử lên Chi tiêu Ngân sách Liên bang (Slide 3, 4 & Transcript P3, P4):**
  * *Biểu diễn logic:* 
    $$d_i = \text{DemVoteShare} - \text{RepubVoteShare} \xrightarrow{c = 0} \begin{cases}        d_i < 0 \implies \text{Đảng Cộng hòa thắng} \\        d_i \ge 0 \implies \text{Đảng Dân chủ thắng}      \end{cases}$$
    $$\text{Cú pháp Stata: } \text{rd lne d, gr mbw(100) line(' 'xla(-.2 ''Repub'' 0 .3 ''Democ'', noticks)' ')}$$
  * *Cơ chế thực tế:* Tại các đơn vị bầu cử có tỷ lệ phiếu bầu sít sao ($d \approx 0$), chiến thắng giữa hai đảng mang tính ngẫu nhiên tương đương một cuộc tung đồng xu. Lệnh `rd` với tùy chọn `gr` vẽ biểu đồ phân tán và hai đường cong hồi quy ở hai phía điểm cắt $0$. Bước nhảy gián đoạn thẳng đứng tại $d = 0$ minh chứng thực nghiệm cho tác động nhân quả thuần túy: Việc ứng viên Đảng Dân chủ đắc cử làm thay đổi đột ngột quy mô dòng vốn ngân sách liên bang (`lne`) rót về địa phương đó.
* **Kiểm định Tính Liên tục của Biến Kiểm soát Ngoại sinh `fedwrkr` (Slide 5, 6 & Transcript P5, P6):**
  * *Biểu diễn logic:* 
    $$\lim_{d \downarrow 0} \mathbb{E}[\text{fedwrkr} \mid d] - \lim_{d \uparrow 0} \mathbb{E}[\text{fedwrkr} \mid d] = 0 \implies \Delta \text{fedwrkr}\vert{}_{d=0} \approx 0 \quad (\text{Không xuất hiện bước nhảy})$$
    $$\text{Cú pháp Stata: } \text{rd lne d, gr mbw(100) x(fedwrkr)}$$
  * *Cơ chế thực tế:* Tỷ lệ công chức/lao động liên bang (`fedwrkr` - Fed Worker Population Share) là một biến nhân khẩu học - thị trường lao động cố định trước bầu cử. Kết quả đồ thị và bảng ước lượng cho thấy các điểm phân tán nằm trơn tru và liên tục qua ngưỡng $d = 0$. Không có bước nhảy đứt gãy nào xảy ra tại điểm cắt. Điều này xác thực giả định rằng các khu vực cử tri nghiêng nhẹ về Đảng Dân chủ hoàn toàn tương đồng về cơ cấu lao động so với các khu vực nghiêng nhẹ về Đảng Cộng hòa.
* **Bản chất Bước nhảy Tuyệt đối của Biến Chiến thắng Bầu cử `win` (Slide 5, 6 & Transcript P5, P6):**
  * *Biểu diễn logic:* 
    $$\text{win}_i = \mathbf{1}_{\{d_i \ge 0\}} = \begin{cases} 0 & \text{khi } d_i < 0 \\ 1 & \text{khi } d_i \ge 0 \end{cases} \implies \lim_{d \downarrow 0} \Pr(\text{win} = 1 \mid d) - \lim_{d \uparrow 0} \Pr(\text{win} = 1 \mid d) = 1 - 0 = 1$$
  * *Cơ chế thực tế:* Khi chạy lệnh `rd lne d, gr mbw(100) x(win)`, đồ thị của biến `win` xuất hiện một bước nhảy dựng đứng từ đúng giá trị $0$ lên $1$ tại $d = 0$. Biến `win` không thể được phân tích như một biến kết quả hay biến kiểm soát thông thường cần chứng minh tính liên tục, bởi vì bản thân `win` chính là biến trạng thái can thiệp tất định được tạo ra bởi biến chạy $d$. Bước nhảy $100\%$ này xác nhận thiết kế thuộc dạng Gián đoạn sắc nét (Sharp RD) hoàn hảo, nơi quy tắc bầu cử được thực thi tuyệt đối mà không có bất kỳ hiện tượng bất tuân thủ (non-compliance) nào.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–6 & Transcript P2–P6)
* **Theo góc nhìn Kiểm chứng Giả định Cốt lõi & Chẩn đoán Thao túng (Covariate Continuity & Zero-Manipulation):**
  * *Mục tiêu:* Bảo đảm tính hợp lệ nội tại (internal validity) của nghiên cứu, loại trừ khả năng bước nhảy kết quả bị ngụy tạo bởi sai lệch chọn lọc.
  * *Hành động can thiệp:* Bắt buộc chạy cú pháp `rd outcome running, x(covariates)` trên toàn bộ hệ thống biến nhân khẩu học và kinh tế địa phương (`pop` đến `vet`); nếu phát hiện bất kỳ biến nền tảng nào bị gián đoạn tại điểm cắt, phải dừng việc kết luận nhân quả vì đã xuất hiện hành vi thao túng kết quả bầu cử hoặc sai lệch mẫu có hệ thống.
* **Theo góc nhìn Thẩm định Tính Vững qua Đa tầng Băng thông (Multi-Bandwidth Sensitivity Analysis):**
  * *Mục tiêu:* Khẳng định kết luận tác động chính sách không phải là sản phẩm ngẫu nhiên do sự lựa chọn chủ quan về kích thước mẫu cận biên.
  * *Hành động can thiệp:* Luôn đối chiếu kết quả ước lượng tại cả ba mức băng thông $50\%$, $100\%$ và $200\%$ qua tùy chọn `mbw()`; nếu hệ số tác động $\hat{\rho}$ duy trì sự ổn định về dấu, độ lớn và mức ý nghĩa thống kê, kết quả nghiên cứu đủ độ tin cậy để đề xuất điều chỉnh cơ chế phân bổ ngân sách công.
* **Theo góc nhìn Phối hợp Giữa Trực quan Đồ thị và Ước lượng Kinh tế lượng (Visual-Econometric Triangulation):**
  * *Mục tiêu:* Tránh ngộ nhận thống kê từ các mô hình "hộp đen" khi chưa thấu hiểu hình dạng thực tế của đám mây dữ liệu.
  * *Hành động can thiệp:* Bắt buộc kích hoạt tùy chọn `gr` để quan sát trực quan sự đứt gãy của đường xu hướng trước khi diễn giải các bảng số liệu hồi quy; đồ thị minh họa trực quan từ Stata đóng vai trò là bằng chứng định tính thuyết phục nhất trong các báo cáo chính sách gửi tới các nhà lập pháp và cơ quan điều hành.
## Thiết Kế Hồi Quy Gián Đoạn Mờ (Fuzzy Regression Discontinuity Design - Fuzzy RD) và Ước Lượng Biến Công Cụ 2SLS
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–10 & Transcript P1–P10)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Bán thực nghiệm với Tuân thủ Không Hoàn hảo (Empirical Causal Inference & Quasi-Experimental Evaluation with Imperfect Compliance - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Tiếp cận bài toán đánh giá tác động khi việc vượt qua điểm ngưỡng ($x_0$) không quyết định tuyệt đối trạng thái can thiệp ($D_i$), mà chỉ tạo ra một sự thay đổi đột ngột (bước nhảy gián đoạn) về xác suất hoặc kỳ vọng có điều kiện nhận can thiệp:
    $$0 < \lim_{x \downarrow x_0} \Pr(D_i = 1 \mid X_i = x) - \lim_{x \uparrow x_0} \Pr(D_i = 1 \mid X_i = x) < 1$$
    Trạng thái can thiệp thực tế $D_i$ trở thành một biến nội sinh (endogenous variable) do chịu ảnh hưởng từ sự tự chọn (self-selection) hoặc quyết định áp dụng linh hoạt của cơ quan thực thi.
  * Bản chất Ước lượng Wald Cận biên (Wald Estimator near Cutoff):
    $$\tau_{\text{FRD}} = \frac{\lim_{x \downarrow x_0} \mathbb{E}[Y_i \mid X_i = x] - \lim_{x \uparrow x_0} \mathbb{E}[Y_i \mid X_i = x]}{\lim_{x \downarrow x_0} \mathbb{E}[D_i \mid X_i = x] - \lim_{x \uparrow x_0} \mathbb{E}[D_i \mid X_i = x]} = \frac{\text{Bước nhảy của Biến Kết quả } Y}{\text{Bước nhảy của Biến Can thiệp } D}$$
    Tỷ số này đại diện cho Hiệu ứng Can thiệp Trung bình Cục bộ (**Local Average Treatment Effect - LATE**) dành riêng cho nhóm đối tượng tuân thủ quy tắc ngưỡng (Compliers).
  * Khung ước lượng Hồi quy Bình phương Tối thiểu Hai giai đoạn (Two-Stage Least Squares - 2SLS): Khai thác biến chỉ định quy tắc ngưỡng $T_i = \mathbf{1}_{\{X_i \ge x_0\}}$ (hoặc biến quy mô phân bổ dự báo) làm Biến công cụ (Instrumental Variable - IV) cho biến can thiệp nội sinh $D_i$:
    * *Giai đoạn 1 (First Stage):* Dự báo mức độ tiếp nhận can thiệp thực tế dựa trên biến công cụ ngưỡng và hàm đa thức của biến chạy $g(X_i)$:
      $$D_i = \gamma_0 + g(X_i) + \pi T_i + v_i \quad (\text{với } \pi = g_1(x_0) - g_0(x_0) \neq 0)$$
    * *Giai đoạn 2 (Second Stage):* Ước lượng tác động nhân quả thuần túy $\rho$ lên biến kết quả $Y_i$ qua giá trị khớp $\hat{D}_i$:
      $$Y_i = \alpha_0 + g(X_i) + \rho \hat{D}_i + \varepsilon_i$$
    * *Trường hợp mở rộng đa thức tương tác (Slide 9–10):* Khi dạng hàm biến chạy ở hai bên ngưỡng khác nhau ($g_0(x_i) \neq g_1(x_i)$), từng số hạng tương tác $T_i \times (X_i - x_0)^k$ đều được đưa vào hệ phương trình giai đoạn 1 để làm biến công cụ tương ứng.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Sharp RD là một trường hợp đặc biệt của Fuzzy RD khi mẫu số bằng $1$ (xác suất nhận can thiệp nhảy vọt tuyệt đối từ $0$ lên $1$). Trong Fuzzy RD, sự tồn tại của hiện tượng bất tuân thủ (Non-compliance / Crossover) khiến hồi quy OLS ngây thơ bị chệch; phương pháp 2SLS cho phép bóc tách độ chệch nội sinh bằng cách phóng đại ước lượng dạng rút gọn (Reduced Form) tỷ lệ nghịch với độ lớn bước nhảy xác suất tiếp nhận tại ngưỡng.
### 2. Phân tích các ví dụ minh họa (Slide 5, 11–16 & Transcript P5, P11–P16)
* **Sự Tương Đồng Giữa Nhiễu Đổi Nhóm trong RCT và Fuzzy RD (Slide 5):**
  * *Biểu diễn logic:* 
    $$\text{Chỉ định theo quy tắc } (T_i) \longrightarrow \begin{cases} \text{Nhóm tuân thủ (Compliers): } D_i = T_i \\ \text{Nhóm đổi nhóm (Crossovers/Defiers): } D_i \neq T_i \end{cases} \implies \text{Cov}(D_i, \varepsilon_i) \neq 0$$
  * *Cơ chế thực tế:* Trong thử nghiệm lâm sàng ngẫu nhiên (RCT), một số cá nhân được xếp vào nhóm can thiệp nhưng từ chối điều trị, hoặc nhóm đối chứng nhưng tự tìm cách tiếp cận điều trị. Tương tự trong Fuzzy RD, điểm cắt $x_0$ chỉ mang tính định hướng: một số đối tượng ở dưới ngưỡng vẫn tìm cách nhận can thiệp và ngược lại. Việc sử dụng $T_i$ làm biến công cụ giúp phân lập phần biến thiên ngoại sinh của $D_i$ do chính quy tắc tạo ra, vô hiệu hóa hoàn toàn độ chệch do hiện tượng đổi nhóm gây ra.
* **Nghiên cứu Quy mô Lớp học và Thành tích Học tập của Angrist & Lavy (1999 - Slide 11–16):**
  * *Biểu diễn logic:* 
    $$e_s \text{ (Tổng tuyển sinh)} \xrightarrow{\text{Quy tắc Maimonides}} m_{sc} = \frac{e_s}{\lfloor (e_s - 1)/40 \rfloor + 1} \xrightarrow{\text{Biến công cụ (IV)}} n_{sc} \text{ (Sĩ số thực tế)} \longrightarrow y_{isc} \text{ (Điểm thi)}$$
    $$\text{Stage 1: } n_{sc} = \gamma_0 + \gamma_1 e_s + \pi m_{sc} + \mathbf{X}'\boldsymbol{\delta} + v_{sc}$$
    $$\text{Stage 2: } y_{isc} = \alpha_0 + \alpha_1 e_s + \rho \hat{n}_{sc} + \mathbf{X}'\boldsymbol{\beta} + \varepsilon_{isc}$$
  * *Cơ chế thực tế:* Quy tắc cổ Maimonides tại các trường học Israel quy định sĩ số lớp tối đa là 40 học sinh. Về mặt lý thuyết, một trường có 40 học sinh sẽ chỉ có 1 lớp (sĩ số 40), nhưng nếu có thêm học sinh thứ 41 ghi danh ($e_s = 41$), trường buộc phải chia thành 2 lớp (sĩ số dự báo $m_{sc} \approx 20.5$). Tuy nhiên, trên thực tế, một số trường có điều kiện tài chính đã chủ động tách thành 2 lớp ngay khi sĩ số mới đạt 35 học sinh $\rightarrow$ Thiết kế rơi vào trạng thái Gián đoạn Mờ (Fuzzy RD). Angrist & Lavy đã sử dụng sĩ số dự báo theo luật $m_{sc}$ làm biến công cụ cho sĩ số thực tế $n_{sc}$, đồng thời kiểm soát biến chạy tuyển sinh $e_s$ và tỷ lệ học sinh có hoàn cảnh khó khăn $pd_s$. Kết quả hồi quy 2SLS (Slide 16, khung viền đỏ) khẳng định hệ số của sĩ số lớp học mang dấu âm có ý nghĩa thống kê ở khối lớp 4 và lớp 5, chứng minh quy mô lớp học nhỏ thực sự giúp nâng cao thành tích đọc và toán mà không bị bóp méo bởi quyết định chia lớp chủ quan của hiệu trưởng.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 6, 8, 14–16 & Transcript P6, P8, P14–P16)
* **Theo góc nhìn Đo lường Hiệu ứng Chính sách Khi Đối tượng Có Quyền Tự quyết (Policy Evaluation under Imperfect Compliance):**
  * *Mục tiêu:* Đánh giá chính xác hiệu quả can thiệp công trong bối cảnh người dân hoặc tổ chức có quyền lựa chọn tham gia hay từ chối.
  * *Hành động can thiệp:* Không loại bỏ các quan sát bất tuân thủ (để tránh chệch chọn mẫu); khai thác các ngưỡng tiêu chuẩn thể chế (như ngưỡng điểm trợ cấp, ranh giới tuổi nghỉ hưu, quy định sĩ số) làm biến công cụ trong mô hình Fuzzy RD để thu được hiệu ứng LATE khách quan của nhóm đối tượng phản ứng theo chính sách.
* **Theo góc nhìn Kiểm soát Bẫy Biến Công cụ Yếu và Kiểm định Giai đoạn 1 (Instrument Strength Verification):**
  * *Mục tiêu:* Bảo đảm tính vững và độ chính xác của ước lượng 2SLS cận biên.
  * *Hành động can thiệp:* Trước khi diễn giải tác động can thiệp ở giai đoạn 2, nhà phân tích bắt buộc phải thẩm định độ mạnh của biến công cụ tại giai đoạn 1 thông qua trị thống kê $F$ của công cụ loại trừ ($F > 10$); kiểm tra xem bước nhảy xác suất tiếp nhận $\pi$ tại điểm cắt có đủ lớn hay không để tránh hiện tượng phóng đại phương sai sai số.
* **Theo góc nhìn Khắc phục Độ chệch OLS Ngây thơ trong Hoạch định Giáo dục (Correcting Naive Estimations in Public Policy):**
  * *Mục tiêu:* Tránh việc đưa ra các quyết định cắt giảm ngân sách sai lầm dựa trên các mối tương quan giả tạo.
  * *Hành động can thiệp:* Đối chiếu giữa kết quả OLS thông thường và 2SLS như bài toán Angrist & Lavy: OLS thường đánh giá thấp hiệu quả của việc giảm sĩ số do các trường vùng nghèo thường được ưu tiên sĩ số nhỏ (tương quan âm giữa sĩ số và hoàn cảnh khó khăn). Mô hình Fuzzy RD bóc tách trọn vẹn yếu tố nội sinh này nhờ việc kiểm soát biến $pd_s$, cung cấp cơ sở khoa học thuyết phục để chính phủ phân bổ ngân sách tuyển dụng thêm giáo viên và mở rộng phòng học.
## Tính Hợp Lệ và Kiểm Định Giả Thuyết Trong Thiết Kế Hồi Quy Gián Đoạn (Validity and Hypothesis Testing of RD Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6, 9–13 & Transcript P1–P13)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Thẩm định Tính Hợp lệ & Kiểm định Chẩn đoán Bán thực nghiệm (Empirical Causal Inference & Quasi-Experimental Diagnostic Testing - Evaluative & Explanatory Modeling)**.
* **Bản chất kỹ thuật:** 
  * Xác lập hệ thống kiểm định giả thuyết và phân tích độ nhạy nhằm bảo vệ tính hợp lệ nội tại (Internal Validity) và làm rõ giới hạn của tính hợp lệ bên ngoài (External Validity) trong thiết kế Hồi quy Gián đoạn (RD):
    * *Tính hợp lệ bên ngoài và Bản chất LATE:* Ước lượng RD chỉ đo lường Hiệu ứng Can thiệp Trung bình Cục bộ (**Local Average Treatment Effect - LATE**) dành riêng cho phân nhóm đối tượng có giá trị biến chạy nằm sát ngưỡng $[x_0 - h, x_0 + h]$. Hiệu ứng này không mặc nhiên mang tính đại diện cho toàn bộ tổng thể ở xa ngưỡng cắt.
    * *Giả định tính liên tục cốt lõi (Core Continuity Assumption):*
      $$\lim_{x \to x_0} \mathbb{E}(Y_{0i} \mid X = x) = \mathbb{E}(Y_{0i} \mid X = x_0) \quad \text{và} \quad \lim_{x \to x_0} \mathbb{E}(Y_{1i} \mid X = x) = \mathbb{E}(Y_{1i} \mid X = x_0)$$
      Toàn bộ các yếu tố quyết định không quan sát được khác của biến kết quả $Y$ đều phải biến thiên liên tục qua điểm cắt $x_0$, cho phép nhóm nằm ngay dưới ngưỡng trở thành trạng thái phản thực tế (counterfactual) hợp lệ của nhóm nằm ngay trên ngưỡng.
    * *Kiểm định tính liên tục của hàm mật độ biến chạy (Density Continuity Test / McCrary Test):* Kiểm tra giả định "Không có hành vi thao túng chính xác" (No precise manipulation). Nếu các cá nhân tự điều chỉnh vị trí để vượt qua ngưỡng, tính ngẫu nhiên hóa cục bộ bị phá vỡ.
    * *Kiểm định tính liên tục của các biến kiểm soát ngoại sinh (Continuity of Covariates / Placebo Balance Test):*
      $$\lim_{x \downarrow x_0} \mathbb{E}(W_i \mid X = x) = \lim_{x \uparrow x_0} \mathbb{E}(W_i \mid X = x) \quad (\forall \text{ biến nền tảng } W)$$
    * *Đánh đổi Băng thông (Bandwidth Bias-Variance Trade-off):* Trong ước lượng phi tham số, việc chọn băng thông $h$ là bài toán cân bằng tối ưu giữa độ chệch và phương sai:
      $$\min_{h} \text{MSE}(h) = \text{Bias}^2(h) + \text{Var}(h)$$
      Băng thông $h$ lớn mở rộng cỡ mẫu quan sát, giúp giảm sai số chuẩn ($\text{SE} \downarrow$) nhưng làm tăng độ chệch mô hình do hiện tượng phi tuyến ($\text{Bias} \uparrow$). Ngược lại, $h$ nhỏ giúp triệt tiêu độ chệch ($\text{Bias} \downarrow$) nhưng làm tăng độ không chắc chắn của ước lượng ($\text{SE} \uparrow$).
    * *Lựa chọn băng thông tối ưu theo dữ liệu (Data-driven Optimal Bandwidth):* Triển khai thuật toán Imbens & Kalyanaraman (2012) để xác định $h^*$ tối ưu hóa MSE, kết hợp kiểm định tính vững trước các mức băng thông thay thế ($0.5h^*, 2h^*$).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khác với các mô hình thống kê thông thường đánh giá qua hệ số $R^2$, sức mạnh khoa học của RD nằm ở hệ thống kiểm định phản chứng (Falsification/Placebo Tests): Chứng minh không có bước nhảy ở các biến kiểm soát, không có bước nhảy tại các ngưỡng giả định phi can thiệp, và kết quả ước lượng không bị phụ thuộc vào một giá trị băng thông đơn lẻ.
### 2. Phân tích các ví dụ minh họa (Slide 4–6, 8, 13 & Transcript P4–P13)
* **Kiểm định Thao túng Mật độ Biến chạy (Running Variable Manipulation & McCrary Test - Slide 4):**
  * *Biểu diễn logic:* 
    $$\lim_{x \downarrow x_0} f_X(x) \neq \lim_{x \uparrow x_0} f_X(x) \implies \text{Hiện tượng dồn ứ (Bunching)} \implies \text{Vi phạm giả định ngẫu nhiên hóa cục bộ}$$
  * *Cơ chế thực tế:* Nếu xét chính sách cấp học bổng tại điểm số 60 hoặc ưu đãi thuế tại mức doanh thu xác định: Nếu đối tượng có thể can thiệp hoặc xin điểm để vừa vặn vượt ngưỡng ($X = 60$), phân phối mật độ xác suất $f_X(x)$ sẽ xuất hiện bước nhảy phình to bất thường ngay phía trên ngưỡng và hõm sâu ngay phía dưới ngưỡng. Sự tích tụ này phản ánh nhóm vượt ngưỡng có năng lực, quan hệ hoặc động cơ cao hơn nhóm dưới ngưỡng, làm biến dạng hoàn toàn bản chất thử nghiệm ngẫu nhiên tự nhiên.
* **Kiểm định Giả dược trên Hiệp biến và Ngưỡng Giả định (Placebo Tests - Slide 5, 6):**
  * *Biểu diễn logic:* 
    $$\Delta W|_{X = x_0} = \lim_{x \downarrow x_0} \mathbb{E}[W \mid X] - \lim_{x \uparrow x_0} \mathbb{E}[W \mid X] = 0 \quad \text{và} \quad \tau_{\text{RD}}|_{X = x_{\text{placebo}}} = 0 \quad (\forall x_{\text{placebo}} \neq x_0)$$
  * *Cơ chế thực tế:* Thay thế biến kết quả $Y$ bằng các biến đặc trưng nhân khẩu học cố định trước can thiệp $W$ (như tuổi, giới tính, học vấn gia đình). Nếu xuất hiện bước nhảy có ý nghĩa thống kê của $W$ tại $x_0$, mô hình bị chệch do hai nhóm vốn không tương đồng. Đồng thời, chạy thử nghiệm RD tại các điểm cắt giả định ($x_{\text{placebo}} \neq x_0$) nơi không hề có chính sách: Nếu vẫn xuất hiện bước nhảy giả, điều đó vạch trần việc dạng hàm đa thức chưa kiểm soát hết độ cong phi tuyến của dữ liệu, khiến sự uốn lượn tự nhiên bị ngộ nhận thành tác động chính sách.
* **Kiểm định Độ bền Băng thông Đa tầng (Bandwidth Sensitivity Analysis - Slide 9, 13):**
  * *Biểu diễn logic:* 
    $$h \in \{0.5h^*, h^*, 2h^*\} \implies \hat{\tau}_{\text{RD}}(0.5h^*) \approx \hat{\tau}_{\text{RD}}(h^*) \approx \hat{\tau}_{\text{RD}}(2h^*) \implies \text{Ước lượng đạt tính vững}$$
  * *Cơ chế thực tế:* Sau khi xác định băng thông tối ưu $h^*$ theo phương pháp Imbens & Kalyanaraman (2012), mô hình được tái ước lượng tại các mức băng thông một nửa ($0.5h^*$), gấp đôi ($2h^*$) hoặc một phần tư ($0.25h^*$). Mặc dù độ lớn sai số chuẩn và giá trị hệ số có dao động theo quy mô mẫu, nhưng nếu dấu và mức ý nghĩa thống kê của $\hat{\tau}_{\text{RD}}$ duy trì ổn định, kết quả được xác nhận là vững chắc, loại trừ nghi vấn về việc cố tình lựa chọn băng thông để thao túng kết quả (p-hacking).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 7–8, 13 & Transcript P2–P13)
* **Theo góc nhìn Thiết lập Quy trình Thẩm định Độ tin cậy Nghiên cứu (Verification Protocol):**
  * *Mục tiêu:* Ngăn ngừa rủi ro ban hành chính sách sai lầm dựa trên các tương quan ngẫu nhiên hoặc dữ liệu bị can thiệp.
  * *Hành động can thiệp:* Bắt buộc xuất báo cáo chẩn đoán đầy đủ trước khi công bố hiệu quả chương trình: Thực hiện kiểm định mật độ McCrary để khẳng định không có hiện tượng chạy chọt/lách luật vượt ngưỡng; chạy kiểm định cân bằng biến nền tảng để bảo đảm nhóm đối chứng và can thiệp thực sự tương đồng; và đối chiếu chẩn đoán đồ thị trực quan với kiểm định Hausman (Slide 8) để xác định đúng mô hình là Sharp RD hay Fuzzy RD.
* **Theo góc nhìn Quản trị Đánh đổi Băng thông & Phòng tránh Ngộ nhận Phi tuyến:**
  * *Mục tiêu:* Đạt sự cân bằng tối ưu giữa độ chính xác thống kê và độ tin cậy kinh tế lượng.
  * *Hành động can thiệp:* Tuyệt đối không tự ý chọn băng thông theo cảm tính chủ quan; sử dụng các thuật toán chuẩn hóa dữ liệu (như Imbens-Kalyanaraman hoặc CCT) và báo cáo công khai ma trận kết quả ước lượng trên nhiều mức băng thông ($0.5h^*, h^*, 2h^*$) để chứng minh kết luận can thiệp không phụ thuộc vào một ngưỡng cửa sổ cục bộ hẹp.
* **Theo góc nhìn Giới hạn Vùng Suy luận & Thận trọng khi Khái quát hóa Chính sách (External Validity Caution):**
  * *Mục tiêu:* Tránh việc nhân rộng mô hình can thiệp trên diện rộng khi hiệu quả chỉ được kiểm chứng cục bộ.
  * *Hành động can thiệp:* Nhà hoạch định cần phân định rõ ước lượng RD là LATE tại cận biên $X \approx x_0$; việc mở rộng chính sách cho toàn thể đối tượng ở xa ngưỡng đòi hỏi phải kết hợp thêm các phương pháp thực nghiệm khác hoặc phân tích cơ chế hành vi, tránh giả định rằng toàn bộ cộng đồng đều thu được lợi ích biên tương tự như nhóm nằm sát ranh giới can thiệp.
## Thực Hành Nâng Cao Thiết Kế Hồi Quy Gián Đoạn (RD) Trên Phần Mềm Stata (Workshop 2: Advanced Stata-Based Analysis of RD Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–5 & Transcript P1–P5)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm Nâng cao & Thẩm định Tính Vững Bán Thực nghiệm trên Stata (Advanced Empirical Causal Inference & Robustness Verification on Stata - Evaluative & Diagnostic Modeling)**.
* **Bản chất kỹ thuật:** 
  * Xác lập chu trình chẩn đoán toàn diện và triển khai ước lượng thực nghiệm cho cả hai thiết kế Hồi quy Gián đoạn Sắc nét (Sharp RD) và Gián đoạn Mờ (Fuzzy RD) thông qua hệ sinh thái lệnh chuyên dụng trên Stata:
    1. *Kiểm định tính liên tục của hàm mật độ biến chạy (Density Test of Running Variable):*
       Tùy chọn `ddens` kiểm tra tính liên tục của biến chỉ định $d$ tại ngưỡng $c=0$. Nếu không có bước nhảy đột ngột của mật độ xác suất ($\lim_{d \downarrow 0} f_D(d) = \lim_{d \uparrow 0} f_D(d)$), giả định "không có hành vi thao túng chính xác vị trí" (no precise manipulation) được giữ vững.
    2. *Phân tích độ nhạy và tính phụ thuộc băng thông (Bandwidth Sensitivity / Dependence Analysis):*
       Tùy chọn `bdep` và dải quét đa tầng `mbw(start(step)end)` khảo sát sự biến thiên của ước lượng tác động $\hat{\tau}_{\text{RD}}$ và khoảng tin cậy $95\%$ qua phổ băng thông từ hẹp đến rộng ($25\%$ đến $300\% h^*$), với tùy chọn `ox` đánh dấu vị trí băng thông tham chiếu tối ưu $100\%$.
    3. *Mô hình hóa Hồi quy Gián đoạn Mờ dạng 3 biến (Three-variable Fuzzy RD Form):*
       $$\text{Cú pháp: } \text{rd Outcome Treatment Running} \longrightarrow \text{rd lne ranwin d, mbw(100)}$$
       Đại diện cho ước lượng Wald / 2SLS cận biên khi xuất hiện hiện tượng tuân thủ không hoàn hảo (imperfect compliance), bóc tách phần biến thiên ngoại sinh của biến can thiệp thực tế dựa trên quy tắc ngưỡng.
    4. *Làm trơn phi tuyến thủ công bằng đa thức cục bộ (Manual Smoothing via `lpoly`):*
       Sử dụng lệnh `lpoly` với hàm hạt nhân Epanechnikov, bậc đa thức cục bộ $p=2$ (`deg(2)`) và băng thông cố định để dựng đường xu hướng phi tuyến kèm dải băng khoảng tin cậy $95\%$ độc lập ở hai bên ngưỡng.
    5. *Hệ thống thư viện kinh tế lượng hiện đại `rdrobust` (Calonico, Cattaneo & Titiunik):*
       Cung cấp bộ công cụ tiêu chuẩn hiện đại gồm vẽ biểu đồ gom cụm tối ưu (`rdplot, binselect(es)`), ước lượng độ chệch hiệu chỉnh mạnh (Robust Bias-Corrected Inference), cho phép hai băng thông độc lập ở hai bên ngưỡng (`bwselect(msetwo)`), và kiểm soát sai số chuẩn phân cụm (`vce(nncluster ...)`).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Chuyển hóa từ việc chỉ báo cáo một ước lượng điểm đơn lẻ sang quy trình kiểm định chẩn đoán đa tầng (Diagnostic Pipeline). Phân biệt rõ giữa gói lệnh truyền thống `rd` (ước lượng hồi quy hạt nhân đơn giản) và gói thư viện hiện đại tiêu chuẩn quốc tế `rdrobust` (cho phép tính toán sai số chuẩn mạnh trước sai lệch dạng hàm và kiểm soát đồng thời nhiều biến quan sát nền tảng).
### 2. Phân tích các ví dụ minh họa (Slide 2–5 & Transcript P2–P5)
* **Chẩn đoán Mật độ Biến chạy và Kiểm định Băng thông Đa tầng (Slide 2 & Transcript P2):**
  * *Biểu diễn logic:* 
    $$\text{Kiểm định mật độ: } \text{rd lne d, gr ddens} \implies \text{Không xuất hiện bước nhảy } (\text{Density jump} \approx 0)$$
    $$\text{Quét độ nhạy: } h \in [0.25h^*, 3.00h^*] \xrightarrow{\text{rd lne d, mbw(25(25)300) bdep ox}} \hat{\tau}_{\text{RD}} \approx 0.29 \text{ (Duy trì ổn định)}$$
  * *Cơ chế thực tế:* Sử dụng dữ liệu bầu cử quốc hội Mỹ với biến chạy $d$ là chênh lệch tỷ lệ phiếu bầu giữa Đảng Dân chủ và Đảng Cộng hòa. Lệnh `ddens` khẳng định hàm mật độ cử tri trơn tru tại điểm cắt $d = 0$, loại trừ khả năng gian lận bầu cử cục bộ. Tiếp đó, lệnh `mbw(25(25)300) bdep ox` tạo đồ thị biến thiên hệ số: Khi băng thông mở rộng từ $25\%$ lên $300\%$, khoảng tin cậy hẹp dần (phương sai giảm do cỡ mẫu tăng), nhưng hệ số tác động lên chi tiêu liên bang (`lne`) dao động ổn định quanh mức $0.29$, khẳng định kết quả ước lượng không phải là sản phẩm ngẫu nhiên do việc chọn băng thông.
* **Mô phỏng Dữ liệu Gián đoạn Mờ với Biến Nhiễu Che Phủ (Slide 3 & Transcript P3):**
  * *Biểu diễn logic:* 
    $$\text{g byte ranwin=cond(uniform()<.1, 1-win, win)} \implies \Delta \Pr(\text{ranwin}=1 \mid d)\vert{}_{d=0} \approx 0.8 < 1.0$$
    $$\text{rd lne ranwin d, mbw(100)} \implies \hat{\tau}_{\text{FRD}} = \frac{\Delta \mathbb{E}(\text{lne} \mid d)\vert{}_{d=0}}{\Delta \mathbb{E}(\text{ranwin} \mid d)\vert{}_{d=0}} = \frac{\text{Bước nhảy của } Y}{\text{Bước nhảy của } D}$$
  * *Cơ chế thực tế:* Lệnh `cond(uniform()<.1, 1-win, win)` đảo ngược trạng thái ngẫu nhiên của $10\%$ mẫu quan sát, giả lập tình trạng bất tuân thủ (ví dụ: ứng viên thắng cử nhưng không nhậm chức hoặc ngược lại). Khi so sánh giữa `x(win)` và `x(ranwin)`, bước nhảy xác suất can thiệp tại $d = 0$ sụt giảm từ $1.0$ (Sharp RD) xuống còn $0.8$. Khi áp dụng cú pháp 3 biến `rd lne ranwin d`, mô hình 2SLS tự động chia bước nhảy của biến kết quả cho bước nhảy xác suất thực tế ($0.8$), khôi phục chính xác quy mô hiệu ứng nhân quả LATE trên nhóm đối tượng tuân thủ quy tắc.
* **Khớp Đa thức Cục bộ Hai Phía Thủ công (`lpoly`) và Gói Nâng cao `rdrobust` (Slide 4, 5 & Transcript P4, P5):**
  * *Biểu diễn logic:* 
    $$\text{Khớp độc lập hai bên: } \begin{cases}        \text{lpoly lne d if d<0, bw(0.05) deg(2) n(100) gen(x0 s0) ci se(se0)} \\        \text{lpoly lne d if d>=0, bw(0.05) deg(2) n(100) gen(x1 s1) ci se(se1)}      \end{cases}$$
    $$\text{Quy trình rdrobust: } \text{rdplot vote margin, binselect(es) ci(95)} \longrightarrow \text{rdrobust vote margin, covs(...) bwselect(msetwo)}$$
  * *Cơ chế thực tế:* Lệnh `lpoly` minh chứng cấu trúc giải tích vi mô của RD: Bằng việc làm trơn đa thức bậc 2 riêng biệt trên hai tập dữ liệu con ($d < 0$ và $d \ge 0$) với băng thông cố định $0.05$, đồ thị phản ánh độ lệch tung độ gốc rõ rệt tại ranh giới $d = 0$. Gói `rdrobust` nâng cấp quy trình này lên tầm cao mới: `rdplot` tự động chia các rổ dữ liệu có độ rộng bằng nhau (`binselect(es)`) để biểu diễn các điểm trung bình quan sát kèm đường cong đa thức bậc 4; trong khi đó lệnh `rdrobust` cho phép lựa chọn hai băng thông tối ưu khác nhau ở hai bên ngưỡng (`bwselect(msetwo)`), đồng thời kiểm soát sai số chuẩn phân cụm theo đơn vị bang (`vce(nncluster state)`).
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–5 & Transcript P2–P5)
* **Theo góc nhìn Thiết lập Bằng chứng Khoa học Vững chắc (Empirical Robustness Standards):**
  * *Mục tiêu:* Vô hiệu hóa các nghi vấn học thuật và bảo vệ kết luận nhân quả trước các phản biện chính sách.
  * *Hành động can thiệp:* Bắt buộc thực hiện trọn bộ chẩn đoán: (1) Xuất biểu đồ kiểm định mật độ `ddens` để loại trừ gian lận chính sách; (2) Xuất biểu đồ biến thiên băng thông `bdep` từ $25\%$ đến $300\%$ để chứng minh tính vững chắc của tham số ước lượng; (3) Báo cáo khoảng tin cậy hiệu chỉnh độ chệch mạnh từ thư viện `rdrobust`.
* **Theo góc nhìn Đo lường Hiệu quả trong Bối cảnh Tuân thủ Thực tế (Pragmatic Policy Evaluation):**
  * *Mục tiêu:* Đánh giá đúng giá trị kinh tế của chính sách khi triển khai trên diện rộng có độ trễ hoặc tỷ lệ từ chối tham gia nhất định.
  * *Hành động can thiệp:* Sử dụng cú pháp Fuzzy RD 3 biến `rd Y D X` thay cho OLS thông thường khi phát hiện có hiện tượng đổi nhóm (crossover); hiểu rõ rằng hiệu ứng thu được phản ánh tác động trên nhóm tuân thủ (Compliers), từ đó xây dựng các giải pháp bổ trợ nhằm nâng cao tỷ lệ chấp hành chính sách.
* **Theo góc nhìn Chuẩn hóa Công cụ Phân tích Dữ liệu Hiện đại (Adopting State-of-the-Art Toolkits):**
  * *Mục tiêu:* Tối ưu hóa độ chính xác và tính đại diện của mô hình trong các dự án dữ liệu lớn và phức tạp.
  * *Hành động can thiệp:* Chuyển dịch thực hành phân tích sang thư viện `rdrobust`; tận dụng khả năng kiểm soát vector hiệp biến (`covs()`) để triệt tiêu phương sai dư thừa, sử dụng cấu trúc sai số chuẩn phân cụm (`vce(cluster)`) phù hợp với cấp độ chính sách địa phương, và ứng dụng `rdplot` để xuất bản các báo cáo trực quan hóa dữ liệu chuẩn mực phục vụ hội đồng thẩm định.
# Propensity Score Matching
## Sử Dụng Dữ Liệu Quan Sát Để Giảm Thiểu Chệch Chọn Lọc: So Sánh OLS, Phân Tầng và Kiểm Soát Biến (Using Observational Data to Reduce Selection Bias)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–6, 15, 18 & Transcript P1–P6, P15, P18)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm từ Dữ liệu Quan sát / Đánh giá Tác động Can thiệp Khử Chệch Chọn lọc (Empirical Causal Inference on Observational Data - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Trong các nghiên cứu quan sát phi thực nghiệm, cá nhân tự quyết định tham gia can thiệp (Self-selection), dẫn đến sự hiện diện của các biến gây nhiễu (Confounders) cùng tác động lên cả quyết định nhận can thiệp ($D$) và biến kết quả ($Y$). Sự mất cân bằng này tạo ra hiện tượng Chệch chọn lọc (Selection Bias):
    $$\mathbb{E}[Y \mid D = 1] - \mathbb{E}[Y \mid D = 0] = \text{Tác động Can thiệp Thực} + \text{Chệch Chọn Lọc}$$
  * Ba cơ chế kỹ thuật tiếp cận nhằm giảm thiểu chệch chọn lọc từ dữ liệu quan sát:
    1. *Hồi quy OLS đơn biến ngây thơ (Naive OLS):* $Y_i = \beta_0 + \beta_1 D_i + u_i$. Hệ số $\beta_1$ bị chệch nghiêm trọng do vi phạm giả định ngoại sinh ($\text{Cov}(D_i, u_i) \neq 0$).
    2. *Phương pháp Phân tầng (Stratification / Subclassification):* Chia không gian dữ liệu quan sát thành $S$ tầng con đồng nhất dựa trên các biến kiểm soát $X$ (ví dụ: các nhóm mức thu nhập). Trong từng tầng con $s$, mức độ can thiệp $D$ được giả định là độc lập có điều kiện với các yếu tố tiềm năng:
       $$(Y_1, Y_0) \perp D \mid X \in \text{Strata } s$$
       * *Hiệu ứng can thiệp trung bình toàn thể (Average Treatment Effect - ATE):*
         $$\text{ATE} = \sum_{s=1}^S w_s \cdot \Delta_s = \sum_{s=1}^S \left( \frac{N_s}{N} \right) \big( \bar{Y}_{1, s} - \bar{Y}_{0, s} \big)$$
       * *Hiệu ứng can thiệp trên nhóm can thiệp (Average Treatment Effect on the Treated - ATT):*
         $$\text{ATT} = \sum_{s=1}^S w_{s,1} \cdot \Delta_s = \sum_{s=1}^S \left( \frac{N_{s,1}}{N_1} \right) \big( \bar{Y}_{1, s} - \bar{Y}_{0, s} \big)$$
    3. *Hồi quy OLS có kiểm soát biến (OLS with Control Variables):* Đưa trực tiếp vector biến kiểm soát $\mathbf{X}$ vào phương trình hồi quy tuyến tính: $Y_i = \beta_0 + \beta_1 D_i + \mathbf{X}_i'\boldsymbol{\gamma} + u_i$.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * *Hạn chế của Phân tầng:* Vấn đề dữ liệu thưa thớt (Data Sparsity Problem / Curse of Dimensionality). Khi phân tầng theo nhiều biến hoặc biến liên tục, tần số quan sát trong từng ô (cell frequency) bị teo nhỏ hoặc bằng 0, dẫn đến vi phạm vùng hỗ trợ chung (Lacking common support), khiến ước lượng bị bất ổn định, phương sai bùng nổ và không thể so sánh được.
  * *Hạn chế của OLS:* Buộc phải áp đặt các giả định cấu trúc toán học ngặt nghèo (hiệu ứng can thiệp là như nhau trên mọi đơn vị, dạng hàm tuyến tính, phương sai sai số không đổi - homoskedasticity).
### 2. Phân tích các ví dụ minh họa (Slide 5, 7–14 & Transcript P5, P7–P14)
* **Tập dữ liệu Khảo sát Giáo dục Dọc Quốc gia NELS:88 (Slide 5, 7–8):**
  * *Biểu diễn logic:* 
    $$\text{Đặc tính gia đình (Thu nhập } X\text{)} \longrightarrow \begin{cases} \text{Quyết định chọn trường tư } (D = \text{CATHOLIC}) \\ \text{Điểm thi toán Lớp 12 } (Y = \text{MATH12}) \end{cases} \implies \text{Chệch nội sinh}$$
    $$\text{Hồi quy OLS đơn biến: } \text{MATH12}_i = \beta_0 + \beta_1 \text{CATHOLIC}_i + u_i \implies \hat{\beta}_1 = 3.895 \quad (p < 0.001)$$
  * *Cơ chế thực tế:* Phân tích mẫu $N = 5671$ học sinh có thu nhập gia đình dưới $\$75,000$ từ cơ sở dữ liệu NELS:88. Nếu chỉ so sánh đơn giản bằng OLS, học sinh trường tư Công giáo có điểm toán lớp 12 vượt trội $3.895$ điểm so với trường công lập. Tuy nhiên, việc theo học trường tư chịu ảnh hưởng bởi hiện tượng tự chọn (phụ huynh quan tâm hơn, động lực học tập cao hơn, điều kiện kinh tế khá giả hơn). Do đó, con số $3.895$ đã bị thổi phồng bởi chệch chọn lọc dương.
* **Cơ chế Phân Tầng Theo Nhóm Thu Nhập (Stratification on Family Income - Slide 9–12):**
  * *Biểu diễn logic:* 
    $$\text{Độ dốc tổng thể OLS (Đường nét đứt)} > \text{Độ dốc trung bình trong từng tầng (Đường nét liền)} \implies \text{Độ chệch dương}$$
    $$\text{Tầng 1 (Thu nhập thấp): } \Delta_1 = 2.12 \quad (N_{0,1}=1969, N_{1,1}=344)$$
    $$\text{Tầng 2 (Thu nhập trung bình): } \Delta_2 = 3.52 \quad (N_{0,2}=1745, N_{1,2}=177)$$
    $$\text{Tầng 3 (Thu nhập cao): } \Delta_3 = 3.76 \quad (N_{0,3}=1365, N_{1,3}=71)$$
    $$\text{ATE} = \frac{(1969+344)(2.12) + (1745+177)(3.52) + (1365+71)(3.76)}{1969+344+1745+177+1365+71} = 3.01$$
    $$\text{ATT} = \frac{344(2.12) + 177(3.52) + 71(3.76)}{344+177+71} = \frac{1622.36}{592} = 2.74$$
  * *Cơ chế thực tế:* Biểu đồ Slide 9 chỉ ra rằng độ dốc tổng thể lớn hơn độ dốc bên trong từng tầng thu nhập, chứng minh việc bỏ qua tác động đồng thời của thu nhập đã tạo ra chệch chọn lọc. Khi phân tách mẫu thành 3 tầng thu nhập:
    * Ở cả 3 tầng, tác động thực chất của trường tư dao động từ $2.12$ đến $3.76$, đều thấp hơn ước lượng OLS ngây thơ ($3.895$).
    * Khi tính bình quân theo tỷ trọng toàn bộ mẫu, $\text{ATE} = 3.01$.
    * Khi tính bình quân theo tỷ trọng của riêng nhóm học sinh trường tư, $\text{ATT} = 2.74$.
    * Cả hai chỉ số sau khi khử chệch bằng phân tầng đều giảm mạnh so với OLS, chứng minh rằng phần lớn lợi thế điểm số ban đầu thực chất là do ưu thế kinh tế gia đình mang lại.
* **Khủng hoảng Dữ liệu Thưa thớt khi Kiểm soát Thêm Điểm Đầu vào MATH8 (Slide 13–15, 18):**
  * *Biểu diễn logic:* 
    $$\text{Phân tầng theo } \{\text{FAMINC} \times \text{MATH8}\} \longrightarrow \text{Số lượng ô phân tầng } S \uparrow \uparrow \implies \text{Tần số ô } n_s \to 0 \lor N_{1,s} = 0$$
  * *Cơ chế thực tế:* Khi nhà nghiên cứu muốn kiểm soát thêm điểm xuất phát lớp 8 (`MATH8`) và các yếu tố nhân khẩu học khác, số lượng phân tầng con bùng nổ theo cấp số nhân. Rất nhiều ô dữ liệu hoàn toàn không có học sinh trường tư hoặc không có đối chứng trường công tương đồng để so sánh. Việc thiếu hụt vùng hỗ trợ chung khiến phương pháp phân tầng truyền thống bị tê liệt hoàn toàn, đặt ra yêu cầu bức thiết phải chuyển dịch sang phương pháp Ghép điểm xu hướng (Propensity Score Matching - PSM).

### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 6, 12, 16–18 & Transcript P6, P12, P16–P18)
* **Theo góc nhìn Nhận diện và Bóc tách Chệch Chọn lọc trong Đánh giá Chính sách (Selection Bias Awareness):**
  * *Mục tiêu:* Ngăn ngừa sai lầm trong việc ca tụng hoặc cấp bù ngân sách bất hợp lý cho các mô hình giáo dục/y tế tư nhân dựa trên tương quan thô.
  * *Hành động can thiệp:* Không bao giờ sử dụng kết quả so sánh trung bình OLS ngây thơ ($\beta_1 = 3.895$) để làm căn cứ ban hành chính sách voucher học tập; bắt buộc phải thực hiện các bước chuẩn hóa và kiểm soát biến nền tảng để định lượng chính xác phần giá trị gia tăng (Value-Added) thực sự của nhà trường.
* **Theo góc nhìn Quản trị Đánh đổi Phương pháp luận: Phân tầng vs. OLS (Methodological Trade-off):**
  * *Mục tiêu:* Lựa chọn công cụ xử lý dữ liệu phù hợp với quy mô mẫu và số lượng biến kiểm soát.
  * *Hành động can thiệp:* Khi số lượng biến kiểm soát ít và mang tính phân loại rời rạc, ưu tiên dùng Phân tầng để tránh áp đặt giả định dạng hàm tuyến tính; khi số lượng biến kiểm soát lớn và có nhiều biến liên tục, nếu dùng OLS phải kiểm tra nghiêm ngặt tính đồng phương sai và tính bất biến của hiệu ứng; nếu các giả định OLS không đảm bảo, bắt buộc phải sử dụng PSM để nén không gian đa chiều về điểm xu hướng một chiều $e(X) = \Pr(D=1 \mid X)$.
* **Theo góc nhìn Phân định Mục tiêu Chính sách Giữa ATE và ATT (Target Population Strategy):**
  * *Mục tiêu:* Xác định đúng đối tượng thụ hưởng để tối ưu hóa nguồn lực công.
  * *Hành động can thiệp:* Nhận diện rõ sự chênh lệch giữa $\text{ATE} = 3.01$ và $\text{ATT} = 2.74$: Nếu nhà hoạch định chính sách muốn mở rộng diện bao phủ trường tư cho toàn bộ học sinh nghèo trường công (phổ cập diện rộng), chỉ số ATE là căn cứ tham chiếu; nếu chính sách chỉ nhắm tới việc duy trì và tối ưu hóa chính sách cho nhóm học sinh hiện đang theo học trường tư, chỉ số ATT mới là thước đo phản ánh đúng hiệu quả can thiệp trên nhóm mục tiêu.
## Xây Dựng Mô Hình Ghép Điểm Xu Hướng (Modeling of Propensity Score Matching - PSM)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–8, 13 & Transcript tương ứng)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Giảm Chiều và Khử Chệch Chọn lọc Bán thực nghiệm (Empirical Causal Inference & Semi-parametric Dimensionality Reduction - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Hiện thực hóa Khung Kết quả Tiềm năng Rubin (Rubin Causal Model) cho các nghiên cứu quan sát phi thực nghiệm (được đề xuất lần đầu bởi Paul Rosenbaum và Donald Rubin năm 1983).
  * Giải quyết vấn đề "lời nguyền số chiều" (Curse of Dimensionality) của phương pháp phân tầng truyền thống: Thay vì phải kiểm soát đồng thời một vector đa chiều các hiệp biến $\mathbf{X}$, Định lý Cân bằng Rosenbaum & Rubin chứng minh rằng chỉ cần điều hòa trên một chỉ số vô hướng một chiều duy nhất gọi là **Điểm xu hướng (Propensity Score)**:
    $$e(\mathbf{X}) \equiv \Pr(D = 1 \mid \mathbf{X}) = \mathbb{E}[D \mid \mathbf{X}]$$
  * Hai giả định nhận dạng cốt lõi:
    1. *Khả năng bỏ qua có điều kiện / Tính ngoại sinh có điều kiện (Unconfoundedness / Conditional Independence Assumption - CIA):*
       $$(Y_1, Y_0) \perp D \mid \mathbf{X} \implies (Y_1, Y_0) \perp D \mid e(\mathbf{X})$$
       Sau khi kiểm soát điểm xu hướng, trạng thái can thiệp độc lập với các kết quả tiềm năng.
    2. *Vùng hỗ trợ chung (Common Support / Overlap Assumption):*
       $$0 < \Pr(D = 1 \mid \mathbf{X}) < 1$$
       Mọi đối tượng với đặc tính $\mathbf{X}$ bất kỳ đều có xác suất dương được nhận hoặc không nhận can thiệp, đảm bảo luôn tìm được đối chứng tương đồng.
  * Quy trình 2 bước chuẩn tắc của PSM:
    * *Bước 1: Ước lượng Điểm xu hướng (Estimate p-scores):* Hồi quy mô hình xác suất lựa chọn nhị phân (thông dụng nhất là Logit hoặc Probit) với biến phụ thuộc là trạng thái can thiệp $D_i \in \{0, 1\}$ và các biến giải thích là toàn bộ vector hiệp biến gây nhiễu $\mathbf{X}$:
      $$\hat{e}_i = \Lambda(\mathbf{X}_i'\boldsymbol{\beta}) = \frac{\exp(\mathbf{X}_i'\boldsymbol{\beta})}{1 + \exp(\mathbf{X}_i'\boldsymbol{\beta})}$$
    * *Bước 2: Ghép cặp (Matching):* Tìm kiếm cho mỗi quan sát thuộc nhóm can thiệp ($D_i=1$) một hoặc nhiều quan sát thuộc nhóm đối chứng ($D_j=0$) có điểm xu hướng tương đồng nhất ($\hat{e}_j \approx \hat{e}_i$) để kiến tạo giá trị phản thực tế (counterfactual), từ đó ước lượng hiệu ứng can thiệp trung bình trên nhóm can thiệp (ATT).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * PSM là một kỹ thuật tiền xử lý dữ liệu (data preprocessing) phi tham số: Nó không đặt ra bất kỳ giả định dạng hàm tuyến tính nào về mối quan hệ giữa biến can thiệp $D$, biến kiểm soát $\mathbf{X}$ và biến kết quả $Y$.
  * Ranh giới phương pháp luận: PSM chỉ khử được chệch chọn lọc bắt nguồn từ các biến quan sát được (**Selection on Observables**); hoàn toàn bất lực trước chệch do biến không quan sát được (unobserved confounders).
### 2. Phân tích các ví dụ minh họa (Slide 6–14 & Transcript tương ứng)
* **Quy tắc Ghép cặp: Có lặp lại vs. Không lặp lại (Matching With vs. Without Replacement - Slide 6, 7):**
  * *Biểu diễn logic:* 
    $$\text{Ghép không lặp lại: } \forall i \neq k, \; \mathcal{C}(i) \cap \mathcal{C}(k) = \emptyset \implies \text{Phụ thuộc thứ tự sắp xếp mẫu}$$
    $$\text{Ghép có lặp lại: } \exists j \in \text{Control} \text{ sao cho } j \in \mathcal{C}(i) \land j \in \mathcal{C}(k) \implies \text{Độ chệch } \downarrow, \; \text{Phương sai } \uparrow$$
  * *Cơ chế thực tế:* Ghép không lặp lại khiến các quan sát đối chứng tốt nhất bị cạn kiệt nhanh chóng, buộc các cá nhân can thiệp phía sau phải ghép với các đối chứng có khoảng cách điểm xu hướng xa hơn (tăng độ chệch). Ghép có lặp lại cho phép một đối chứng có điểm số lý tưởng được ghép cho nhiều đối tượng can thiệp khác nhau, giúp tối thiểu hóa độ chệch khoảng cách, nhưng đánh đổi bằng việc giảm số quan sát đối chứng độc lập (làm tăng phương sai sai số chuẩn).
* **Bốn Thuật toán Ghép cặp Cốt lõi (Slide 8–13):**
  * *Biểu diễn logic:* 
    $$\text{1. Láng giềng gần nhất (NN): } j = \arg\min_{k \in \mathcal{C}} |\hat{e}_i - \hat{e}_k|$$
    $$\text{2. Bán kính / Dung sai (Caliper \& Radius): } \mathcal{C}(i) = \{k \in \mathcal{C} \mid |\hat{e}_i - \hat{e}_k| \le \varepsilon\}$$
    $$\text{3. Phân tầng \& Khoảng (Stratification): } \text{Chia vùng common support thành } K \text{ tầng} \implies \text{ATT} = \sum_{k=1}^K \frac{N_{1k}}{N_1} (\bar{Y}_{1k} - \bar{Y}_{0k})$$
    $$\text{4. Hàm hạt nhân (Kernel Matching): } \hat{Y}_{0i} = \sum_{j \in \mathcal{C}} w(i, j) Y_{0j} \quad \left(w(i,j) = \frac{K\big(\frac{\hat{e}_i - \hat{e}_j}{h}\big)}{\sum_{k} K\big(\frac{\hat{e}_i - \hat{e}_k}{h}\big)}\right)$$
  * *Cơ chế thực tế:* NN ghép cặp điểm gần nhất nhưng dễ gặp rủi ro "ghép tồi" (bad matches) nếu điểm gần nhất vẫn cách quá xa; Caliper đặt ra ngưỡng khoảng cách tối đa $\varepsilon$ để loại trừ các cặp ghép kém phẩm chất; Radius matching lấy trung bình của tất cả đối chứng rơi vào trong vòng tròn bán kính $\varepsilon$; Ghép phân tầng gom các cá nhân vào từng khối điểm đồng nhất; Kernel matching sử dụng toàn bộ mẫu đối chứng, gán trọng số suy giảm phi tuyến theo khoảng cách hạt nhân, tiệm cận nguyên lý Ước lượng Trọng số Nghịch đảo Xác suất (IPW).
* **Cân bằng Phân phối Sau Ghép (Distribution Balancing - Slide 14):**
  * *Biểu diễn logic:* 
    $$f(e \mid D = 1) \neq f(e \mid D = 0) \xrightarrow{\text{Kernel Matching}} f^*(e \mid D = 1) \approx f^*(e \mid D = 0)$$
  * *Cơ chế thực tế:* Biểu đồ Slide 14 minh chứng trực quan: Trước khi ghép (đồ thị Raw Data bên trái), phân phối mật độ điểm xu hướng của nhóm can thiệp lệch hẳn sang phải trong khi nhóm đối chứng lệch sang trái, thể hiện chệch chọn lọc nghiêm trọng. Sau khi thực hiện Kernel Matching (đồ thị Matched Data bên phải), hai đường cong phân phối trở nên tiệm cận trùng khít lên nhau. Điều này chứng minh toàn bộ các đặc tính quan sát được $\mathbf{X}$ đã đạt trạng thái cân bằng tuyệt đối giữa hai nhóm.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 3–4, 8–14 & Transcript tương ứng)
* **Theo góc nhìn Lựa chọn Thuật toán & Quản trị Đánh đổi (Algorithm Selection Strategy):**
  * *Mục tiêu:* Đạt sự cân bằng tối ưu giữa độ chệch mô hình (Bias) và độ chuẩn xác thống kê (Efficiency).
  * *Hành động can thiệp:* Khi tập đối chứng rất lớn so với nhóm can thiệp, ưu tiên sử dụng NN kết hợp Caliper hẹp để loại bỏ các điểm quan sát biên giới; khi cỡ mẫu đối chứng hạn chế hoặc phân tán mỏng, chuyển sang Kernel Matching hoặc Radius Matching để tận dụng thông tin của nhiều đối chứng, tránh làm bùng nổ phương sai ước lượng.
* **Theo góc nhìn Kiểm định Tính Cân bằng của Hiệp biến (Balancing Diagnostics Protocol):**
  * *Mục tiêu:* Ngăn chặn việc chạy mô hình kết quả trên một tập dữ liệu ghép kém chất lượng.
  * *Hành động can thiệp:* Sau khi ghép cặp, bắt buộc phải thực hiện kiểm định cân bằng (Balancing Test): so sánh trung bình chuẩn hóa (standardized bias) của từng biến kiểm soát giữa hai nhóm; nếu mức chệch chuẩn hóa vượt quá $10\%$ hoặc kiểm định $t$-test cho thấy còn sự khác biệt có ý nghĩa thống kê, phải quay lại Bước 1 để tái cấu trúc phương trình Logit bằng cách thêm biến tương tác hoặc đa thức bậc hai.
* **Theo góc nhìn Phối hợp Phương pháp Luận Đa tầng (Methodological Integration):**
  * *Mục tiêu:* Khắc phục điểm yếu chí tử của PSM trước các yếu tố gây nhiễu không quan sát được.
  * *Hành động can thiệp:* Trong các đề tài đánh giá chính sách phức tạp, không dừng lại ở PSM đơn thuần; tích hợp PSM với mô hình Sai biệt kép thành phương pháp PSM-DID (Propensity Score Matching with Difference-in-Differences), tận dụng PSM để tạo nhóm đối chứng tương đồng nhất về biến quan sát và dùng DID để triệt tiêu toàn bộ các yếu tố nhiễu cố định bất biến theo thời gian không quan sát được.
## Kiểm Định và Thẩm Định Tính Hợp Lệ Của Mô Hình Ghép Điểm Xu Hướng (Testing and Validation of Propensity Score Matching - PSM)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–4, 7 & Transcript P1–P4, P7)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Kiểm định Chẩn đoán và Đánh giá Tính Hợp lệ Bán thực nghiệm (Empirical Causal Inference & Quasi-Experimental Diagnostic Testing - Evaluative & Diagnostic Modeling)**.
* **Bản chất kỹ thuật:** 
  * Xác lập chu trình kiểm chứng khoa học nhằm đảm bảo mô hình Ghép điểm xu hướng (PSM) đáp ứng đầy đủ các tiền đề toán học trước khi ước lượng tác động can thiệp, bác bỏ ngộ nhận rằng PSM là "công cụ vạn năng" tự động tạo ra ước lượng không chệch mà không cần kiểm soát điều kiện.
  * Ba trụ cột kiểm định tính hợp lệ của PSM (PSM Validation Pipeline):
    1. *Thẩm định Tính Hiệu quả của Mô hình Giai đoạn 1 (Effectiveness of First-Stage Model):*
       * Mô hình lựa chọn nhị phân (thường là Logit hoặc Probit) dùng để ước lượng điểm xu hướng $e(\mathbf{X}) \equiv \Pr(D=1 \mid \mathbf{X})$ phải có cơ sở lý thuyết vững chắc và đạt độ phù hợp thống kê tổng thể.
       * Các chỉ số đánh giá bao gồm: Kiểm định mức ý nghĩa của từng hệ số hiệp biến ($t$-test / $z$-test), Kiểm định Chi-square cho toàn bộ hệ số mô hình ($\chi^2$-test), Kiểm định độ phù hợp Pearson Chi-square, Kiểm định Hosmer-Lemeshow Goodness-of-Fit, và Hệ số xác định giả ($\text{Pseudo } R^2$).
    2. *Kiểm tra Vùng Hỗ trợ Chung và Độ Chồng Lấn (Common Support & Overlap Check):*
       * Bảo đảm giả định nhận dạng then chốt:
         $$0 < \Pr(D = 1 \mid \mathbf{X}) < 1 \iff \text{Supp}\big(e(\mathbf{X}) \mid D = 1\big) \cap \text{Supp}\big(e(\mathbf{X}) \mid D = 0\big) \neq \emptyset$$
       * Xác nhận rằng với mọi mức điểm xu hướng quan sát được, luôn tồn tại đồng thời các cá nhân thuộc nhóm can thiệp và nhóm đối chứng để ghép cặp, tránh việc ngoại suy phi căn cứ ở các vùng xác suất cực đoan ($0$ hoặc $1$).
    3. *Kiểm định Tính Cân bằng của Hiệp biến (Balance Test):*
       * Dựa trên Định lý Cân bằng của Rosenbaum & Rubin (1983): Nếu điều hòa trên điểm xu hướng, phân phối của các biến dự báo $\mathbf{X}$ giữa nhóm can thiệp và nhóm đối chứng phải đạt trạng thái độc lập có điều kiện:
         $$\mathbf{X} \perp D \mid e(\mathbf{X})$$
       * Tiêu chuẩn định lượng: Mức chệch chuẩn hóa (Standardized Bias / Standardized Mean Difference - SMD) của mỗi biến sau khi ghép cặp phải giảm xuống dưới ngưỡng an toàn ($\text{SB} < 10\%$, lý tưởng là $< 5\%$), đồng thời kiểm định khác biệt trung bình ($t$-test) giữa hai nhóm không còn ý nghĩa thống kê ($p > 0.05$).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khác với các bài toán hồi quy dự báo thông thường vốn tối đa hóa $R^2$, mô hình giai đoạn 1 của PSM không đặt mục tiêu tối đa hóa khả năng phân loại tách biệt hoàn toàn giữa hai nhóm (vì nếu dự báo trúng $100\%$, $e(\mathbf{X})$ sẽ bằng $0$ hoặc $1$, làm sụp đổ hoàn toàn vùng hỗ trợ chung). Trọng tâm cốt lõi của PSM là tối ưu hóa **tính cân bằng** của các hiệp biến nền tảng giữa hai nhóm sau khi ghép cặp.
### 2. Phân tích các ví dụ minh họa (Slide 2, 4–8 & Transcript P2, P4–P8)
* **Phá vỡ Ngụy biện "PSM thay thế hoàn toàn RCT" (Slide 2 & Transcript P2):**
  * *Biểu diễn logic:* 
    $$\text{Ngộ nhận: PSM} \xrightarrow{\text{Dữ liệu quan sát}} \text{Ước lượng hoàn toàn không chệch} \equiv \text{RCT} \quad (\text{SAI})$$
    $$\text{Thực tế: PSM} \xrightarrow{\text{Chỉ xử lý Selection on Observables}} \text{Nếu tồn tại biến ẩn } U \notin \mathbf{X} \implies \text{Chệch nội sinh vẫn tồn tại}$$
  * *Cơ chế thực tế:* Slide 2 cảnh báo luận điểm sai lầm khi cho rằng PSM đơn giản, không đau đớn và thay thế hoàn toàn được các thử nghiệm ngẫu nhiên (RCT). Trên thực tế, PSM chỉ loại trừ được chệch chọn lọc bắt nguồn từ các biến kiểm soát quan sát được đưa vào mô hình. Nếu có các yếu tố nhiễu không quan sát được (như động lực cá nhân, năng khiếu bẩm sinh, sở thích ngầm) ảnh hưởng đồng thời đến quyết định tham gia và kết quả, ước lượng PSM vẫn bị chệch nghiêm trọng.
* **Kiểm tra Độ Chồng Lấn và Vùng Hỗ trợ Chung (Overlap Examination - Slide 5, 6 & Transcript P5, P6):**
  * *Biểu diễn logic:* 
    $$e_i \in [0, 1] \longrightarrow \begin{cases}        e_i < \min(e \mid D = 1) \lor e_i > \max(e \mid D = 0) \implies \text{Off-support (Loại bỏ / Trimming)} \\        e_i \in [\max(\min_1, \min_0), \min(\max_1, \max_0)] \implies \text{On-support (Giữ lại để ghép)}      \end{cases}$$
  * *Cơ chế thực tế:* Biểu đồ mật độ phân phối điểm xu hướng ở Slide 6 chỉ ra rằng ở hai đầu mút, một số quan sát nhóm đối chứng có xác suất tiếp cận can thiệp gần bằng 0 và một số cá nhân nhóm can thiệp có xác suất gần bằng 1. Những đối tượng này không thể tìm được đối chứng tương đồng. Quy tắc Common Support thiết lập một ngưỡng chặn biên, loại bỏ các quan sát nằm ngoài vùng giao thoa, đảm bảo việc so sánh chỉ diễn ra giữa các cá nhân thực sự có cơ hội lựa chọn tương đương nhau.
* **Kiểm định Cân bằng Trước và Sau Ghép Cặp (Balance Test Implementation - Slide 7, 8 & Transcript P7, P8):**
  * *Biểu diễn logic:* 
    $$\text{Trước ghép (Raw): } \text{SB}_k \gg 10\% \land p(t\text{-test}) < 0.01 \xrightarrow{\text{Ghép cặp thành công}} \text{Sau ghép (Matched): } \text{SB}_k < 5\% \land p(t\text{-test}) > 0.1$$
  * *Cơ chế thực tế:* Bảng kiểm định cân bằng ở Slide 8 minh họa sự chuyển hóa cơ bản của dữ liệu: Trước khi ghép, nhóm can thiệp và nhóm đối chứng có sự chênh lệch rất lớn về các đặc trưng nền tảng (học vấn, thu nhập, tình trạng hôn nhân) với $p$-value của kiểm định $t$ cực nhỏ ($p < 0.001$). Sau khi tiến hành ghép điểm xu hướng, mức chênh lệch trung bình chuẩn hóa của toàn bộ các biến rơi về sát trục $0\%$ và giá trị kiểm định $t$-test đều không có ý nghĩa thống kê ($p > 0.1$). Điều này xác nhận rằng hai phân nhóm sau khi ghép đã đạt trạng thái cân bằng tương đương như kết quả của một thử nghiệm ngẫu nhiên hóa thành công.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–4, 6–9 & Transcript P2–P4, P6–P9)
* **Theo góc nhìn Kiểm chứng Tiền đề & Phòng chống Ngộ nhận Phương pháp (Methodological Vigilance):**
  * *Mục tiêu:* Ngăn ngừa rủi ro ngộ nhận kết quả và đưa ra các chính sách sai lầm dựa trên mô hình PSM chưa đạt chuẩn.
  * *Hành động can thiệp:* Không bao giờ công bố hiệu quả can thiệp (ATT) nếu chưa hoàn thành đầy đủ 3 bước kiểm tra: đánh giá mô hình giai đoạn 1, kiểm tra độ chồng lấn, và kiểm định cân bằng hiệp biến; luôn minh bạch báo cáo các giả định chưa thể kiểm chứng về biến không quan sát được.
* **Theo góc nhìn Quản trị Mẫu và Cắt tỉa Vùng Biên (Trimming & Sample Selection):**
  * *Mục tiêu:* Đạt sự cân bằng tối ưu giữa việc giảm độ chệch so sánh và bảo toàn tính đại diện của mẫu nghiên cứu.
  * *Hành động can thiệp:* Theo dõi chặt chẽ tỷ lệ quan sát bị loại bỏ khỏi vùng hỗ trợ chung (Off-support); nếu tỷ lệ đối tượng can thiệp bị cắt tỉa vượt quá mức cho phép ($> 10\% - 15\%$), nhà nghiên cứu phải xác định lại phạm vi kết luận, làm rõ rằng hiệu ứng thu được chỉ áp dụng cho phân nhóm có đặc tính nằm trong vùng chồng lấn thay vì toàn bộ tổng thể ban đầu.
* **Theo góc nhìn Chuẩn hóa Quy trình Chẩn đoán Thực hành (Diagnostic Workflow Protocol):**
  * *Mục tiêu:* Thiết lập chu trình kiểm định chuẩn mực đáp ứng các tiêu chuẩn công bố khoa học quốc tế (tham chiếu theo Imbens & Wooldridge, 2009 ở Slide 9).
  * *Hành động can thiệp:* Bắt buộc xuất đồ thị trực quan hóa độ chồng lấn trước và sau ghép cặp; sử dụng các lệnh chẩn đoán chuyên dụng trên phần mềm (như `pstest` trên Stata) để báo cáo bảng đối chiếu độ chệch chuẩn hóa trước - sau của từng biến; nếu kiểm định cân bằng thất bại, phải quay lại hiệu chỉnh phương trình Logit bằng cách bổ sung thêm biến tương tác hoặc số hạng phi tuyến bậc hai cho đến khi đạt được sự cân bằng hiệp biến toàn diện.## Workshop 1: Stata-Based Analysis of PSM
## Thực Hành Phân Tích Ghép Điểm Xu Hướng (PSM) Trên Phần Mềm Stata (Workshop 1: Stata-Based Analysis of PSM Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–5, 8 & Transcript P1–P5, P8)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Can thiệp Bán thực nghiệm trên Stata (Empirical Causal Inference & Semi-parametric Treatment Effect Estimation on Stata - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Giải quyết vấn đề chệch chọn lọc (Selection bias) phát sinh từ các khác biệt hệ thống có sẵn giữa nhóm can thiệp và nhóm đối chứng khi việc tiếp nhận can thiệp không được phân bổ ngẫu nhiên (chẳng hạn do đối tượng tự đăng ký tham gia hoặc dự án sàng lọc theo điều kiện). Nếu sử dụng OLS trực tiếp, hệ số ước lượng sẽ bị trộn lẫn giữa tác động can thiệp thực và chệch chọn lọc.
  * Quy trình phân tích 4 bước chuẩn tắc của PSM trên Stata:
    1. *Ước lượng Điểm xu hướng (Estimate Propensity Score):*
       $$e(\mathbf{X}) \equiv \Pr(D = 1 \mid \mathbf{X}) = \Lambda(\mathbf{X}'\boldsymbol{\beta})$$
       Dự báo xác suất tiếp nhận can thiệp của từng cá nhân dựa trên các biến hiệp biến $\mathbf{X}$ bằng mô hình Logit hoặc Probit (`logit treat x1 x2 x3` $\rightarrow$ `predict pscore`).
    2. *Thực hiện Ghép cặp (Make a Match):*
       Ghép các cá nhân có điểm xu hướng tương đồng giữa hai nhóm để tạo mẫu tương đương (`psmatch2 treat x1 x2 x3, outcome(y) neighbor(1)` hoặc ghép bán kính/caliper).
    3. *Kiểm định Tính Cân bằng (Check Balance):*
       Kiểm tra xem sau khi ghép cặp, phân phối của các biến kiểm soát giữa hai nhóm đã tiệm cận tương đương hay chưa (`pstest x1 x2 x3, both`). Tiêu chuẩn quy chuẩn là mức chệch chuẩn hóa sau ghép cặp phải giảm mạnh xuống dưới ngưỡng an toàn:
       $$\text{Standardized Bias} = \frac{\vert{}\bar{X}_T - \bar{X}_C\vert{}}{\sqrt{\frac{s_T^2 + s_C^2}{2}}} \times 100\% < 10\%$$
    4. *Tính toán Hiệu ứng Can thiệp (Calculate Treatment Effects):*
       Ước lượng hiệu ứng can thiệp trung bình trên nhóm can thiệp (ATT) hoặc trên toàn thể mẫu (ATE):
       $$\text{ATT} = \mathbb{E}[Y_1 - Y_0 \mid D = 1], \quad \text{ATE} = \mathbb{E}[Y_1 - Y_0]$$
  * Hệ sinh thái câu lệnh trên Stata:
    * *Gói lệnh do cộng đồng phát triển `psmatch2`:* Hỗ trợ ghép cặp láng giềng gần nhất (Nearest Neighbor), ghép bán kính (Radius/Caliper), chẩn đoán cân bằng (`pstest`) và trực quan hóa phân phối điểm xu hướng (`psgraph`).
    * *Hệ sinh thái chính thức `teffects` của Stata:* Mở rộng sang các kỹ thuật ước lượng hiện đại gồm Hồi quy điều chỉnh (`teffects ra`), Ghép điểm xu hướng (`teffects psmatch`), Trọng số nghịch đảo xác suất (`teffects ipw`), và Ước lượng kép vững (`teffects aipw`).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Khác với hồi quy tuyến tính OLS áp đặt dạng hàm toán học toàn cục, PSM là phương pháp tiền xử lý dữ liệu bán tham số phi tuyến. PSM tách biệt hoàn toàn giữa giai đoạn thiết kế nghiên cứu (cân bằng hiệp biến mà không cần nhìn vào biến kết quả) và giai đoạn đánh giá hiệu quả, giúp triệt tiêu thiên kiến xác nhận của người phân tích.
### 2. Phân tích các ví dụ minh họa (Slide 6, 7, 9 & Transcript P6, P7, P9)
* **Tác động của Hành vi Hút thuốc của Người mẹ lên Cân nặng Trẻ sơ sinh (Slide 6 & Transcript P6):**
  * *Biểu diễn logic:* 
    $$\text{mbsmoke} \in \{0, 1\} \xrightarrow{\mathbf{X} = \{\text{mmarried}, \text{mage}, \text{prenatal1}, \text{fbaby}\}} \text{bweight (gram)}$$
    $$\text{Cú pháp Stata: } \text{psmatch2 mbsmoke mmarried mage prenatal1 fbaby, outcome(bweight) neighbor(1)}$$
  * *Cơ chế thực tế:* Sử dụng bộ dữ liệu khảo sát thai sản `cattaneo2.dta`. Biến can thiệp là hành vi hút thuốc của người mẹ trong thai kỳ (`mbsmoke`), biến kết quả là cân nặng khi sinh của trẻ sơ sinh (`bweight`). Những phụ nữ hút thuốc thường có độ tuổi trẻ hơn, tỷ lệ kết hôn thấp hơn và ít khám thai định kỳ trong 3 tháng đầu. Thuật toán ghép $1:1$ láng giềng gần nhất tìm cho mỗi bà mẹ hút thuốc một bà mẹ không hút thuốc có điểm xu hướng gần nhất (ví dụ mẹ nhóm hút thuốc có $e = 0.72$ ghép với mẹ nhóm không hút thuốc có $e \approx 0.71$ hoặc $0.73$), từ đó cô lập ảnh hưởng độc lập của thuốc lá lên cân nặng của trẻ.
* **Chẩn đoán Cân bằng và Trực quan Hóa Vùng Hỗ trợ Chung (Slide 7 & Transcript P7):**
  * *Biểu diễn logic:* 
    $$\text{pstest \dots, both graph} \implies \text{Standardized \% bias của } \{\text{mmarried}, \text{prenatal1}, \text{mage}, \text{fbaby}\} \to 0\%$$
    $$\text{psgraph} \implies \text{Mật độ } e(\mathbf{X}) \text{ của Treated và Untreated có sự giao thoa rộng khắp trên đoạn } [0.1, 0.5]$$
  * *Cơ chế thực tế:* Lệnh `pstest, both graph` xuất biểu đồ chấm phân bố độ chệch: Trước khi ghép (mẫu thô `Unmatched`), biến tình trạng kết hôn (`mmarried`) và khám thai (`prenatal1`) có độ lệch rất xa trục $0\%$. Sau khi ghép (`Matched`), toàn bộ các điểm rơi sát về trục $0\%$ (độ lệch $< 10\%$). Biểu đồ `psgraph` xác nhận thêm rằng nhóm can thiệp và nhóm đối chứng có vùng hỗ trợ chung (Common Support) rộng lớn, bảo đảm tính hợp lệ của việc ghép cặp.
* **Ước lượng Tác động Thực tế Bằng Câu lệnh Tích hợp `teffects psmatch` (Slide 9 & Transcript P9):**
  * *Biểu diễn logic:* 
    $$\text{Cú pháp: } \text{teffects psmatch (bweight) (mbsmoke mmarried mage prenatal1 fbaby)}$$
    $$\hat{\tau}_{\text{ATE}} = -211.397 \quad (\text{SE} = 27.702, \ z = -7.63, \ p < 0.001, \ 95\% \text{ CI: } [-265.69, -157.10])$$
  * *Cơ chế thực tế:* Bảng kết quả chạy dòng lệnh 25-33 trên Slide 9 hiển thị ước lượng ATE từ mô hình ghép điểm xu hướng tự động: Hành vi hút thuốc của người mẹ làm giảm trung bình $211.4$ gram cân nặng của trẻ sơ sinh với mức ý nghĩa thống kê tuyệt đối ($p < 0.001$). Khi đối chiếu với các phương pháp khác như Hồi quy điều chỉnh (`teffects ra`), Trọng số nghịch đảo (`teffects ipw`) hay Ước lượng kép vững (`teffects aipw`), kết luận định lượng về tác động tiêu cực của thuốc lá lên sức khỏe thai nhi duy trì tính vững và nhất quán cao.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2, 4–9 & Transcript P2, P4–P9)
* **Theo góc nhìn Thiết lập Chiến lược Lựa chọn Hiệp biến (Covariate Selection Strategy):**
  * *Mục tiêu:* Thỏa mãn Giả định Bỏ qua Có điều kiện (Unconfoundedness / CIA) mà không làm phát sinh sai lệch dạng biến gây nhiễu xấu (bad controls).
  * *Hành động can thiệp:* Lựa chọn các biến kiểm soát dựa trên cơ sở lý thuyết y sinh học và xã hội học vững chắc; chỉ đưa vào mô hình Logit các biến số xảy ra trước can thiệp (Pre-treatment characteristics như tuổi mẹ `mage`, tình trạng kết hôn `mmarried`, con đầu lòng `fbaby`); tuyệt đối không đưa các biến xuất hiện sau can thiệp hoặc là hệ quả trung gian của việc hút thuốc vào phương trình ước lượng điểm xu hướng.
* **Theo góc nhìn Thẩm định Chất lượng Ghép cặp (Matching Quality Assurance Protocol):**
  * *Mục tiêu:* Ngăn ngừa rủi ro ngoại suy phi căn cứ và suy luận sai lệch khi phân phối giữa hai nhóm không tương đồng.
  * *Hành động can thiệp:* Luôn tuân thủ quy trình chẩn đoán kép trước khi công bố kết quả: Sử dụng `pstest, both` để đảm bảo mức chệch chuẩn hóa của toàn bộ các biến kiểm soát sau ghép đều $< 10\%$, và dùng `psgraph` để kiểm tra độ chồng lấn phân phối; nếu số lượng quan sát giữa hai nhóm quá chênh lệch hoặc xuất hiện cặp ghép kém phẩm chất, chủ động chuyển đổi từ ghép $1:1$ sang thuật toán ghép bán kính (Radius/Caliper Matching) để loại bỏ các điểm quan sát nằm ngoài vùng hỗ trợ chung.
* **Theo góc nhìn Đối chiếu Đa Mô hình và Lựa chọn Công cụ Ước lượng (Multi-Estimator Robustness Workflow):**
  * *Mục tiêu:* Nâng cao độ tin cậy và giá trị khoa học của kết quả phân tích phục vụ tham mưu chính sách y tế công cộng.
  * *Hành động can thiệp:* Không chỉ dừng lại ở lệnh truyền thống `psmatch2`, nhà nghiên cứu cần tận dụng hệ sinh thái `teffects` để đối chiếu kết quả giữa `psmatch`, `ipw`, và đặc biệt là `aipw` (Augmented IPW); khai thác đặc tính "kép vững" (Double Robustness) của `aipw` để đảm bảo ước lượng tác động vẫn không chệch ngay cả khi một trong hai mô hình (mô hình điểm xu hướng hoặc mô hình phương trình kết quả) bị đặc tả sai, cung cấp bằng chứng định lượng vững chắc cho các chương trình vận động cai thuốc lá thai kỳ.
## Mở Rộng Các Phương Pháp Suy Luận Nhân Quả Dựa Trên Dữ Liệu Quan Sát: RA, IPW, IPWRA và AIPW (Expansion of Causal Inference Methods Based on Observational Data)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–15 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Đánh giá Can thiệp Nâng cao từ Dữ liệu Quan sát (Empirical Causal Inference & Advanced Treatment Effect Estimation on Observational Data - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Giải quyết vấn đề biến gây nhiễu (Confounders) — những yếu tố tác động đồng thời lên cả việc phân bổ can thiệp ($T$) và biến kết quả ($Y$), khiến việc ước lượng bằng OLS truyền thống bị chệch nội sinh.
  * Bốn chiến lược mở rộng vượt ra ngoài phương pháp ghép cặp điểm xu hướng (PSM):
    1. *Hồi quy Điều chỉnh (Regression Adjustment - RA):* Xây dựng mô hình kỳ vọng kết quả tiềm năng (Potential Outcomes Mean - POM) độc lập cho từng nhóm xử lý nhằm tránh đưa biến giả can thiệp nội sinh vào chung một mô hình OLS:
       $$\text{Nhóm can thiệp } (T = 1): \quad Y_{1i} = \alpha_1 + \mathbf{X}_i'\boldsymbol{\beta}_1 + e_{1i}$$
       $$\text{Nhóm đối chứng } (T = 0): \quad Y_{0i} = \alpha_0 + \mathbf{X}_i'\boldsymbol{\beta}_0 + e_{0i}$$
       Kỳ vọng kết quả tiềm năng được dự báo cho toàn bộ mẫu dựa trên hệ số ước lượng của từng nhóm: $\text{POM}_1 = \mathbb{E}[Y_1 \mid \hat{\boldsymbol{\beta}}_1]$, $\text{POM}_0 = \mathbb{E}[Y_0 \mid \hat{\boldsymbol{\beta}}_0]$. Tác động can thiệp trung bình được tính bằng hiệu số:
       $$\text{ATE} = \text{POM}_1 - \text{POM}_0 = \frac{1}{N}\sum_{i=1}^N \left(\hat{Y}_{1i} - \hat{Y}_{0i}\right)$$
    2. *Trọng số Nghịch đảo Xác suất (Inverse Probability Weighting - IPW):* Khắc phục xác suất quan sát không đồng đều bằng cách gán trọng số nghịch đảo với điểm xu hướng $e(\mathbf{X}) \equiv \Pr(T = 1 \mid \mathbf{X})$:
       $$w_i = \frac{T_i}{e(\mathbf{X}_i)} + \frac{1 - T_i}{1 - e(\mathbf{X}_i)}$$
       Trọng số này tái cấu trúc mật độ phân phối của các biến hiệp biến giữa hai nhóm, tạo nên một quần thể giả lập (pseudo-population) đạt trạng thái cân bằng và hỗ trợ chung toàn diện.
    3. *Hồi quy Điều chỉnh có Trọng số Nghịch đảo (Inverse Probability Weighted Regression Adjustment - IPWRA):* Quy trình tích hợp hai giai đoạn giữa IPW và RA:
       $$\text{Mô hình xác suất can thiệp } \longrightarrow \text{Tính trọng số } w_i \longrightarrow \text{Ước lượng hồi quy RA có gán trọng số } w_i \longrightarrow \text{Dự báo kịch bản phản thực tế}$$
       Mô hình mang đặc tính **Kép vững (Doubly Robust)**: Ước lượng ATE vẫn đảm bảo tính nhất quán (consistent) ngay cả khi một trong hai mô hình (mô hình can thiệp hoặc mô hình kết quả) bị đặc tả sai dạng hàm.
    4. *Trọng số Nghịch đảo Xác suất Mở rộng (Augmented Inverse Probability Weighting - AIPW):* Kết hợp trực tiếp dự báo từ hồi quy điều chỉnh với số hạng hiệu chỉnh (correction term) dựa trên phần dư có gán trọng số IPW qua công thức chuẩn:
       $$\hat{\tau}_{\text{AIPW}} = \frac{1}{N}\sum_{i=1}^N \left[ \hat{\mu}_1(\mathbf{X}_i) - \hat{\mu}_0(\mathbf{X}_i) + \frac{T_i \big(Y_i - \hat{\mu}_1(\mathbf{X}_i)\big)}{\hat{e}(\mathbf{X}_i)} - \frac{(1 - T_i)\big(Y_i - \hat{\mu}_0(\mathbf{X}_i)\big)}{1 - \hat{e}(\mathbf{X}_i)} \right]$$
       Phương pháp đạt tính kép vững và tối ưu hóa hiệu quả thống kê bán tham số (semiparametric efficiency bound).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * PSM tiếp cận bằng cách ghép cặp chọn lọc (dễ loại bỏ bớt quan sát), RA tiếp cận bằng cách mô hình hóa kết quả $Y \mid \mathbf{X}$, còn IPW tiếp cận bằng cách mô hình hóa xác suất can thiệp $T \mid \mathbf{X}$. IPWRA và AIPW là sự kết hợp ưu việt của cả hai luồng tư duy, mang lại cơ chế tự sửa sai (self-correcting mechanism) khi một trong hai mô hình thành phần gặp sai sót về dạng hàm.
### 2. Phân tích các ví dụ minh họa (Slide 2, 7–11, 14–15 & Transcript)
* **Mô hình Thai sản: Hành vi Hút thuốc của Mẹ và Cân nặng Trẻ sơ sinh (Slide 2–6):**
  * *Biểu diễn logic:* 
    $$\text{Độ tuổi người mẹ (Age - Confounder)} \longrightarrow \begin{cases} 
      \text{Hành vi hút thuốc } (T \in \{0, 1\}) \\ 
      \text{Cân nặng sơ sinh } (Y = \text{bweight}) 
    \end{cases}$$
    $$\text{Mô hình OLS ngây thơ: } Y_i = \beta_0 + \beta_1 T_i + \beta_2 \text{Age}_i + u_i \quad (\text{Áp đặt chung hệ số góc } \beta_2)$$
    $$\text{Mô hình RA: } \begin{cases} Y_{1i} = \alpha_1 + \beta_1 \text{Age}_i + e_{1i} \quad (T_i = 1) \\ Y_{0i} = \alpha_0 + \beta_0 \text{Age}_i + e_{0i} \quad (T_i = 0) \end{cases} \implies \hat{Y}_{1i} - \hat{Y}_{0i} = (\hat{\alpha}_1 - \hat{\alpha}_0) + (\hat{\beta}_1 - \hat{\beta}_0)\text{Age}_i$$
  * *Cơ chế thực tế:* Độ tuổi của người mẹ ảnh hưởng đồng thời đến tỷ lệ hút thuốc và sự phát triển sinh học của thai nhi. Hồi quy OLS gộp áp đặt giả định phi lý rằng tác động của tuổi mẹ lên cân nặng con ở hai nhóm là như nhau. Phương pháp RA khắc phục điều này bằng cách ước lượng riêng hai phương trình hồi quy, sau đó dự phóng giá trị phản thực tế: Nếu toàn bộ bà mẹ trong mẫu đều hút thuốc thì cân nặng trung bình là bao nhiêu ($\text{POM}_1$), và nếu toàn bộ không hút thuốc thì con số này là bao nhiêu ($\text{POM}_0$). Hiệu số $\text{POM}_1 - \text{POM}_0$ phản ánh trung thực tác động ròng của việc hút thuốc.
* **Mô hình Trường Công giáo: Cơ chế Trọng số IPW của Andy, Bob, Yves và Zack (Slide 8–11):**
  * *Biểu diễn logic:* 
    $$\text{Nhóm can thiệp (Catholic): } p_{\text{Andy}} \gg p_{\text{Bob}} \implies w_{\text{Andy}} = \frac{1}{p_{\text{Andy}}} \ll w_{\text{Bob}} = \frac{1}{p_{\text{Bob}}}$$
    $$\text{Nhóm đối chứng (Public): } (1 - p_{\text{Yves}}) \gg (1 - p_{\text{Zack}}) \implies w_{\text{Yves}} = \frac{1}{1 - p_{\text{Yves}}} \ll w_{\text{Zack}} = \frac{1}{1 - p_{\text{Zack}}}$$
  * *Cơ chế thực tế:* Andy có điều kiện gia đình rất thuận lợi nên xác suất vào trường Công giáo $p$ rất cao; việc Andy vào trường Công giáo là điều bình thường nên thông tin mang lại ít, được gán trọng số $1/p$ rất nhỏ. Ngược lại, Bob có hoàn cảnh khó khăn (xác suất $p$ rất thấp) nhưng vẫn vào được trường Công giáo; trường hợp của Bob cung cấp thông tin cực kỳ quý giá để so sánh với học sinh nghèo trường công, nên được gán trọng số $1/p$ rất lớn. Tương tự đối với Yves và Zack ở trường công. Cơ chế này tái lập sự cân bằng mẫu quan sát mà không cần loại bỏ bất kỳ học sinh nào khỏi dữ liệu.
* **Cơ chế Hiệu chỉnh Phần dư Tự sửa sai trong AIPW (Slide 15):**
  * *Biểu diễn logic:* 
    $$\text{Correction Term} = \frac{1}{N}\sum_{i=1}^N \left[ \frac{T_i \big(Y_i - \hat{\mu}_1(\mathbf{X}_i)\big)}{\hat{e}(\mathbf{X}_i)} - \frac{(1 - T_i)\big(Y_i - \hat{\mu}_0(\mathbf{X}_i)\big)}{1 - \hat{e}(\mathbf{X}_i)} \right]$$
  * *Cơ chế thực tế:* Nếu mô hình kết quả $\hat{\mu}_t(\mathbf{X})$ dự báo hoàn hảo, phần dư $(Y_i - \hat{\mu}_t(\mathbf{X}_i)) \to 0$, số hạng hiệu chỉnh triệt tiêu và kết quả quy về RA. Nếu mô hình kết quả bị sai lệch dạng hàm, phần dư lệch khỏi 0 sẽ lập tức được điều hòa bởi trọng số nghịch đảo xác suất $\hat{e}(\mathbf{X})$, kéo độ chệch ước lượng trở về 0. Cơ chế bù trừ này mang lại tính kép vững vượt trội cho mô hình AIPW.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 1, 11, 13–15 & Transcript)
* **Theo góc nhìn Quản trị Rủi ro Sai lệch Dạng hàm (Model Misspecification Risk):**
  * *Mục tiêu:* Đảm bảo tính nhất quán của các kết luận nhân quả ngay cả khi hiểu biết lý thuyết về quy trình sinh dữ liệu chưa hoàn hảo.
  * *Hành động can thiệp:* Thay vì phụ thuộc vào một phương pháp đơn lẻ (chỉ dựa vào RA dễ bị sai dạng hàm hồi quy, chỉ dựa vào IPW dễ bị sai mô hình xác suất Logit), nhà phân tích nên chuẩn hóa việc sử dụng các công cụ kép vững như IPWRA hoặc AIPW; khi đó, chỉ cần một trong hai mô hình thành phần được chỉ định đúng, chính sách đưa ra vẫn dựa trên các ước lượng không chệch.
* **Theo góc nhìn Kiểm soát Ổn định Trọng số & Rủi ro Điểm Xu hướng Cực đoan (Extreme Weights Hazard):**
  * *Mục tiêu:* Tránh hiện tượng phương sai bùng nổ làm mất độ tin cậy của khoảng tin cậy thống kê khi áp dụng IPW/AIPW.
  * *Hành động can thiệp:* Giám sát chặt chẽ phân bố của điểm xu hướng $\hat{e}(\mathbf{X})$. Nếu xuất hiện các giá trị tiệm cận sát $0$ hoặc $1$ (khiến mẫu số tiến về $0$ và trọng số tăng vọt), cần áp dụng quy tắc cắt tỉa vùng hỗ trợ chung (Trimming) hoặc sử dụng trọng số chuẩn hóa (Stabilized Weights) để bảo vệ tính ổn định của các chỉ số hiệu quả can thiệp.
* **Theo góc nhìn Thiết lập Chiến lược Lựa chọn Công cụ Ước lượng (Method Selection Strategy):**
  * *Mục tiêu:* Tối ưu hóa nguồn lực tính toán và nâng cao tính thuyết phục của các báo cáo nghiên cứu chính sách y tế và xã hội.
  * *Hành động can thiệp:* Áp dụng lộ trình kiểm tra đa tầng: Sử dụng RA như mô hình cơ sở khi mối quan hệ nhân quả có dạng hàm rõ ràng; chuyển sang IPW khi cần trực quan hóa việc tái phân bố dữ liệu trên toàn mẫu; và chốt hạ bằng AIPW để xuất bản các kết quả chính thức nhờ đặc tính kép vững và sai số chuẩn đạt hiệu quả tối ưu theo lý thuyết bán tham số.
## Nhận Diện Biến Kiểm Soát Tồi (Bad Controls) Trong Suy Luận Nhân Quả
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7, 11 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Nhận diện và Xử lý Sai số Chọn lọc (Empirical Causal Inference & Causal Identification - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Phân biệt ranh giới phương pháp luận giữa "Biến kiểm soát tốt" (Good Controls) và "Biến kiểm soát tồi" (Bad Controls):
    * *Good Controls:* Các biến đặc trưng xác định trước can thiệp (Pre-treatment variables) nhằm loại bỏ chệch do biến bị bỏ sót (Omitted Variable Bias - OVB) và thỏa mãn giả định bỏ qua có điều kiện:
      $$(Y_1, Y_0) \perp D \mid X_{\text{pre}}$$
    * *Bad Controls:* Các biến số bản thân nó là một kết quả tiềm năng (Post-treatment variables / Mediators) phát sinh một phần do chính sự can thiệp gây ra ($D \rightarrow W$). 
  * Cơ chế sinh chệch chọn lọc nhân tạo (Induced Selection Bias): Việc kiểm soát hoặc cố định một biến hậu can thiệp $W$ vô tình chia nhỏ mẫu nghiên cứu theo trạng thái kết quả, biến $W$ thành một biến đóng vai trò điểm hội tụ (Collider). Khi điều hòa trên Collider, một mối tương quan giả tạo giữa trạng thái can thiệp $D$ và yếu tố tiềm ẩn không quan sát được $U$ (năng lực, phẩm chất cá nhân) bị kích hoạt:
    $$D \rightarrow W \leftarrow U \implies (D \not\perp U) \mid W$$
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Một biến kiểm soát dù có tương quan cực kỳ chặt chẽ với cả biến can thiệp (giáo dục) và biến kết quả (tiền lương) vẫn hoàn toàn có thể là một biến kiểm soát tồi. Tiêu chuẩn chọn biến kiểm soát không nằm ở độ lớn tương quan thống kê hay mức tăng của $R^2$, mà nằm ở **trình tự thời gian và cấu trúc nhân quả** của biến số trong chu trình sinh dữ liệu.
### 2. Phân tích các ví dụ minh họa (Slide 3–6, 8–10 & Transcript)
* **Kinh nghiệm làm việc tiềm năng: Biến kiểm soát tốt (Good Control - Slide 3–6):**
  * *Biểu diễn logic:* 
    $$\text{Tuổi cố định} \implies \text{Kinh nghiệm } (X_i) = \text{Tuổi} - S_i - 6 \implies \text{Cov}(S_i, X_i) < 0$$
    $$\text{Mô hình rút gọn: } \text{Wage} = \alpha_0 + \rho_{\text{short}} S_i + \varepsilon_i \implies \rho_{\text{short}} = \rho_{\text{long}} + \underbrace{\gamma \cdot \delta_{X, S}}_{(-)} < \rho_{\text{long}}$$
  * *Cơ chế thực tế:* Ở cùng một độ tuổi, một người đi học đại học thêm nhiều năm ($S_i$ tăng) thì số năm tích lũy kinh nghiệm làm việc ($X_i$) bắt buộc phải giảm đi ($\delta < 0$). Do kinh nghiệm có đóng góp dương vào tiền lương ($\gamma > 0$), tích $\gamma \cdot \delta < 0$ tạo ra chệch âm (downward bias). Hồi quy đơn biến ngây thơ ước lượng tỷ suất sinh lời của giáo dục thấp hơn thực tế. Khi kiểm soát kinh nghiệm làm việc, nhà nghiên cứu bóc tách được yếu tố hao hụt thời gian, giúp tỷ suất sinh lời thực của nam giới da trắng tăng lên đúng $11\%$ cho mỗi năm học bổ sung.
* **Nghề nghiệp Cổ cồn Xanh vs Cổ cồn Trắng: Nghịch lý Biến kiểm soát tồi (Bad Control - Slide 8–10):**
  * *Biểu diễn logic:* 
    $$\text{Tác động thực: } Y(1) - Y(0) = \$500 \quad (\forall \text{ cá nhân})$$
    $$\text{Phân tầng theo nghề White-Collar:} \begin{cases} 
      \mathbb{E}[Y \mid \text{Không học ĐH, White}] = \$3000 & (\text{Chỉ gồm nhóm Always White - AW}) \\ 
      \mathbb{E}[Y \mid \text{Có học ĐH, White}] = \frac{\$2500 + \$3500}{2} = \$3000 & (\text{Gồm cả Blue-to-White - BW và AW}) 
    \end{cases}$$
    $$\Delta_{\text{White}} = \mathbb{E}[Y \mid \text{ĐH, White}] - \mathbb{E}[Y \mid \text{Không ĐH, White}] = \$3000 - \$3000 = \$0 \neq \$500$$
  * *Cơ chế thực tế:* Giả định xã hội có 3 nhóm người: Luôn làm thợ (Always Blue - AB), Chuyển từ thợ lên văn phòng nhờ bằng cấp (Blue to White - BW), và Luôn làm văn phòng nhờ năng lực xuất sắc (Always White - AW). Bằng đại học giúp mọi cá nhân tăng đều đặn $\$500$. 
  Tuy nhiên, nếu đưa biến giả "Nghề nghiệp = White-Collar" vào làm biến kiểm soát: Ở nhóm không học đại học, chỉ những người có năng lực bẩm sinh cực cao (AW) mới vào được văn phòng ($\text{Lương} = \$3000$). Ở nhóm có bằng đại học, văn phòng tiếp nhận cả người xuất sắc (AW, lương $\$3500$) lẫn người năng lực trung bình (BW, lương $\$2500$), kéo thu nhập trung bình của nhóm đại học xuống còn $\$3000$. So sánh giữa hai nhóm trong cùng phân khúc White-Collar cho ra mức chênh lệch bằng $\$0$, xóa sạch hoàn toàn giá trị thực của tấm bằng đại học do sự bất tương đồng về năng lực nền tảng.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 7, 11–12 & Transcript)
* **Theo góc nhìn Thiết kế Mô hình & Nguyên tắc Chọn Biến (Pre-Treatment Protocol):**
  * *Mục tiêu:* Bảo toàn tính không chệch của ước lượng tác động can thiệp tổng thể.
  * *Hành động can thiệp:* Áp dụng triệt để "Quy tắc tiền can thiệp" (Pre-treatment Rule): Chỉ đưa vào mô hình các biến số được thiết lập hoặc quan sát trước khi biến can thiệp xảy ra (giới tính, học vấn cha mẹ, điểm số đầu vào); kiên quyết loại bỏ các biến số hậu can thiệp (chức vụ hiện tại, ngành nghề, số năm thâm niên tại công ty sau khi tốt nghiệp) ra khỏi danh sách biến kiểm soát của mô hình đo lường tác động tổng thể.
* **Theo góc nhìn Phân tích Cơ chế & Phân rã Trung gian (Causal Mediation Strategy):**
  * *Mục tiêu:* Tránh ngộ nhận giữa việc ước lượng Tổng Tác động (Total Effect) và Tác động Trực tiếp (Direct Effect).
  * *Hành động can thiệp:* Nếu mục tiêu nghiên cứu nhằm trả lời câu hỏi "Giáo dục tăng lương thông qua con đường thăng tiến nghề nghiệp hay qua nâng cao năng suất cá nhân", nhà phân tích không được dùng hồi quy OLS gộp đơn giản; bắt buộc phải chuyển sang khung Phân tích Trung gian Nhân quả (Causal Mediation Analysis / Thuyết đồ thị DAGs) để bóc tách rõ Tác động Trực tiếp Tự nhiên (Natural Direct Effect) và Tác động Gián tiếp Tự nhiên (Natural Indirect Effect).
* **Theo góc nhìn Đánh giá Hiệu quả Đào tạo Doanh nghiệp & Chính sách Nhân sự:**
  * *Mục tiêu:* Đánh giá chuẩn xác ROI của các chương trình đào tạo và nâng cao kỹ năng nhân viên.
  * *Hành động can thiệp:* Tránh sai lầm kinh điển trong đo lường hiệu quả đào tạo: So sánh tiền thưởng giữa nhân viên tham gia khóa học và không tham gia khóa học nhưng lại "kiểm soát cấp bậc quản lý hiện tại". Việc kiểm soát cấp bậc sẽ làm triệt tiêu phần lớn lợi ích của khóa học (vốn phát huy giá trị thông qua việc giúp nhân viên được thăng chức), dẫn đến việc đánh giá sai và khai tử nhầm các chương trình đào tạo nhân sự chất lượng cao.

## Mô Hình Tác Động Cố Định Học Sinh Xuyên Môn Học (Cross-Subject Student Fixed Effects Model)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–13, 23–24 & Transcript)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm / Phương pháp Tác động Cố định Nội tại Bán thực nghiệm (Empirical Causal Inference & Within-Student Quasi-Experimental Fixed Effects Modeling - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Giải quyết rủi ro chệch nội sinh bắt nguồn từ hiện tượng phân bổ không ngẫu nhiên (Non-random assignment / Sorting) giữa học sinh và giáo viên trong các trường trung học: Nhà trường thường có xu hướng xếp giáo viên giỏi, có thâm niên hoặc bằng cấp cao vào dạy các lớp nâng cao/lớp chọn (nơi tập trung học sinh có năng lực và động lực học tập cao). Hồi quy OLS thông thường sẽ gây chệch nghiêm trọng do trộn lẫn phẩm chất của giáo viên với năng lực tiềm ẩn của học sinh.
  * Hai phương án kiến tạo biến thiên nội tại học sinh (Within-Student Variation):
    1. *Phương án A - Mô hình Tác động Cố định Theo Thời gian (Longitudinal Student Fixed Effects):*
       $$A_{it} = \beta T_{it} + \lambda_i + \varepsilon_{it}$$
       Theo dõi cùng một học sinh $i$ qua nhiều năm $t$. Hạn chế ở cấp THPT: Rất khó thu thập các phép đo lặp lại của cùng một môn học qua nhiều năm liên tiếp cho cùng một học sinh.
    2. *Phương án B - Mô hình Tác động Cố định Học sinh Xuyên Môn học (Cross-Subject / Interdisciplinary Student Fixed Effects):*
       Khai thác điểm số của cùng một học sinh $i$ tại cùng một thời điểm nhưng **trên nhiều môn học khác nhau $s$**:
       $$A_{ijsk} = \alpha + \beta T_{ijsk} + \lambda_i + e_{ijsk}$$
       Trong đó: $A_{ijsk}$ là kết quả học tập của học sinh $i$ môn $s$ tại trường $k$ do giáo viên $j$ giảng dạy; $T_{ijsk}$ là vector trình độ giáo viên; $\lambda_i$ là tác động cố định cá nhân học sinh; $e_{ijsk}$ là phần dư ngẫu nhiên.
  * Cơ chế Biến đổi Khử Trung bình Cá nhân Xuyên Môn (Cross-Subject Within-Transformation):
    $$(A_{is} - \bar{A}_i) = \beta (T_{is} - \bar{T}_i) + (\varepsilon_{is} - \bar{\varepsilon}_i) + (e_{is} - \bar{e}_i)$$
    * $(A_{is} - \bar{A}_i)$: Điểm môn $s$ đo lường tương đối so với điểm trung bình tất cả các môn của học sinh $i$.
    * $(T_{is} - \bar{T}_i)$: Trình độ giáo viên môn $s$ đo lường tương đối so với trình độ trung bình của toàn bộ giáo viên giảng dạy học sinh $i$.
    * $(\varepsilon_{is} - \bar{\varepsilon}_i)$: Năng lực đặc thù của học sinh theo từng môn học so với năng lực chung.
    * $(e_{is} - \bar{e}_i)$: Sai số ngẫu nhiên cấp giáo viên/môn học.
  * Điều kiện nhận diện tham số không chệch: $\text{Cov}\big((T_{is} - \bar{T}_i), (\varepsilon_{is} - \bar{\varepsilon}_i)\big) = 0$ và các số hạng sai số không tương quan với nhau.
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Biến đổi dữ liệu theo chiều "môn học" thay vì chiều "thời gian" truyền thống, giúp triệt tiêu hoàn toàn mọi đặc tính bất biến xuyên môn của học sinh (năng lực nhận thức chung $\lambda_i$, nền tảng gia đình, điều kiện kinh tế, gen di truyền, giới tính, chủng tộc).
  * Đánh đổi phương pháp luận (Methodological Trade-off): Toàn bộ các biến đặc trưng cố định của học sinh ($X_i$) đều bị triệt tiêu khi khử trung bình, không thể ước lượng trực tiếp tác động riêng của giới tính, chủng tộc hay điểm kiểm tra đầu vào.
### 2. Phân tích các ví dụ minh họa (Slide 2–4, 14–19, 20–25 & Transcript)
* **Nghiên cứu Điển hình: Trình độ Giáo viên THPT và Điểm số Học sinh (Slide 2–4, 9–13):**
  * *Biểu diễn logic:* 
    $$\text{Phân lớp chọn lọc: } \begin{cases} \text{Học sinh giỏi / Nâng cao } \longleftrightarrow \text{Giáo viên thâm niên / Điểm thi chứng chỉ cao} \\ \text{Học sinh yếu / Phổ thông } \longleftrightarrow \text{Giáo viên mới / Hợp đồng ngắn hạn} \end{cases} \implies \text{Chệch nội sinh}$$
    $$(A_{is} - \bar{A}_i) = \beta (T_{is} - \bar{T}_i) + u_{is}$$
  * *Cơ chế thực tế:* Một học sinh THPT học đồng thời 5 môn (Toán, Tiếng Anh, Vật lý, Địa lý, Sinh học), mỗi môn do một thầy cô với thâm niên và điểm thi sát hạch khác nhau phụ trách. Mô hình Cross-Subject so sánh: Khi học sinh $i$ học môn có giáo viên sở hữu trình độ vượt trội hơn mức trung bình của các giáo viên dạy em đó ($T_{is} - \bar{T}_i > 0$), thì điểm môn đó có cao hơn điểm trung bình các môn còn lại của chính em ($A_{is} - \bar{A}_i > 0$) hay không.
* **Kiểm định Tính Hợp lệ: Năng lực Tương đối của Học sinh vs. Trình độ Tương đối của Giáo viên (Slide 14–19):**
  * *Biểu diễn logic:* 
    $$H_0: \text{Cov}(T_{is} - \bar{T}_i, \varepsilon_{is} - \bar{\varepsilon}_i) = 0 \quad \text{vs.} \quad H_1: \text{Cov}(T_{is} - \bar{T}_i, \varepsilon_{is} - \bar{\varepsilon}_i) \neq 0$$
    $$\text{Phương pháp 1 (Phân nhóm): Năng lực tuyệt đối } \longleftrightarrow \text{Lớp nâng cao (Rất mạnh)}; \quad \text{Năng lực tương đối } \longleftrightarrow \text{Lớp nâng cao (Không đáng kể)}$$
    $$\text{Phương pháp 2 (Hồi quy trực tiếp): } (\varepsilon_{is} - \bar{\varepsilon}_i) = \gamma (T_{is} - \bar{T}_i) + \nu_{is} \implies \hat{\gamma} \text{ không có ý nghĩa thống kê} \implies \text{Chấp nhận } H_0$$
  * *Cơ chế thực tế:* Mối lo ngại lớn nhất là học sinh có thiên khiếu về một môn cụ thể (ví dụ giỏi Toán hơn Văn) lại được xếp vào học giáo viên dạy giỏi môn đó. Hai phương pháp kiểm định đã bác bỏ điều này: Nhà trường chỉ xếp lớp dựa trên năng lực chung (General ability), không xếp lớp theo năng lực tương đối từng môn. Hồi quy thực nghiệm chứng minh không tồn tại tương quan có ý nghĩa thống kê giữa trình độ tương đối của giáo viên và thiên khiếu tương đối của học sinh, khẳng định mô hình Cross-Subject Student FE cho ra ước lượng $\beta$ hoàn toàn không chệch.
* **Đối chiếu Mô hình Student Fixed Effects vs. School Fixed Effects (Slide 20–25):**
  * *Biểu diễn logic:* 
    $$\text{Model 1 (Student FE): } A_{is} = \beta T_{is} + \lambda_i + \text{Cohort} + (\text{Subject} \times \text{Grade}) + e_{is}$$
    $$\text{Model 2 (School FE): } A_{isk} = \beta T_{isk} + \mathbf{X}_i'\boldsymbol{\gamma} + \eta_k + \text{Cohort} + e_{isk}$$
  * *Cơ chế thực tế:* Model 1 kiểm soát cố định cấp học sinh ($\lambda_i$), loại bỏ toàn bộ chệch phân bổ trong trường nhưng không thể ước lượng biến đặc trưng học sinh $X_i$. Model 2 kiểm soát cố định cấp trường ($\eta_k$), cho phép đưa vào các biến nhân khẩu học $X_i$ (giới tính, sắc tộc, điểm đầu vào) để so sánh độ lớn hiệu ứng, nhưng không giải quyết triệt để vấn đề xếp lớp chọn lọc giữa các lớp trong cùng một trường. Kết quả thực nghiệm ở Slide 21–22 cho thấy các chiều kích trình độ giáo viên (năm kinh nghiệm, điểm thi chứng chỉ) đều mang hệ số dương tương đồng ở cả hai mô hình, trong đó Model 1 là chuẩn mực tin cậy hơn cho suy luận nhân quả.

### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 4, 7–8, 11, 23–25 & Transcript)
* **Theo góc nhìn Đột phá Phương pháp Luận khi Thiếu Dữ liệu Bảng Dọc (Methodological Strategy):**
  * *Mục tiêu:* Đánh giá tác động nhân quả của đội ngũ giáo viên ở bậc trung học phổ thông khi không có dữ liệu theo dõi dọc nhiều năm.
  * *Hành động can thiệp:* Triển khai mô hình Cross-Subject Student FE như một công cụ thay thế cho dữ liệu bảng thời gian; tận dụng kết quả kiểm tra đa môn của cùng một học kỳ để kiến tạo biến thiên nội tại học sinh, giúp tiết kiệm ngân sách khảo sát dọc mà vẫn đạt tiêu chuẩn suy luận nhân quả khắt khe.
* **Theo góc nhìn Hoạch định Phân công Chuyên môn & Tái cân bằng Sư phạm (Teacher Allocation Reform):**
  * *Mục tiêu:* Ngăn ngừa sự bất bình đẳng giáo dục xuất phát từ việc dồn giáo viên chất lượng cao vào các lớp chuyên/chọn.
  * *Hành động can thiệp:* Nhận diện rõ thâm niên và năng lực chuyên môn của giáo viên (thể hiện qua điểm thi chứng chỉ hành nghề) tạo ra tác động tích cực thực chất lên thành tích học sinh; các nhà quản lý giáo dục cần điều chỉnh quy chế xếp lớp, luân chuyển giáo viên có trình độ cao sang hỗ trợ các lớp có xuất phát điểm thấp nhằm thu hẹp khoảng cách chất lượng giảng dạy nội bộ trường.
* **Theo góc nhìn Thiết lập Báo cáo Đối sánh Đa Mô hình (Complementary Reporting Protocol):**
  * *Mục tiêu:* Vừa đảm bảo tính vững nhân quả, vừa đáp ứng nhu cầu phân tích cơ cấu theo nhóm nhân khẩu học của người học.
  * *Hành động can thiệp:* Áp dụng chiến lược báo cáo song hành: Dùng Mô hình Student FE (Model 1) làm căn cứ khoa học chính để khẳng định giá trị gia tăng thuần túy của giáo viên; song song đó trình bày Mô hình School FE (Model 2) để minh họa sự phân hóa kết quả học tập theo giới tính, sắc tộc và hoàn cảnh kinh tế - xã hội, phục vụ việc ban hành các chính sách hỗ trợ người học toàn diện.

## Thực Hành Nâng Cao Ghép Điểm Xu Hướng (PSM) Trên Phần Mềm Stata: Can Thiệp Đa Nhóm Và Mô Hình Hồi Quy Xử Lý Nội Sinh (Workshop 2: Stata-Based Analysis of PSM Settings)
### 1. Bản chất & Định nghĩa cốt lõi (Slide 1–7 & Transcript P1–P7)
* **Phân loại nhiệm vụ:** **Suy luận Nhân quả Thực nghiệm Nâng cao & Ước lượng Can thiệp Nội sinh trên Stata (Advanced Empirical Causal Inference & Endogenous Treatment Effects Estimation on Stata - Explanatory & Evaluative Modeling)**.
* **Bản chất kỹ thuật:** 
  * Mở rộng khung phân tích điểm xu hướng từ can thiệp nhị phân thông thường ($D \in \{0, 1\}$) sang hai cấu trúc thực nghiệm phức tạp:
    1. *Can thiệp Đa nhóm (Multi-valued / Multi-group Treatment PSM):*
       * Biến can thiệp mang tính phân loại với nhiều cấp độ ($T \in \{0, 1, \dots, J\}$). Xác suất nhận can thiệp được mở rộng thành xác suất đa thức (Generalized Propensity Score):
         $$e_j(\mathbf{X}) \equiv \Pr(T = j \mid \mathbf{X}) \quad (j = 0, 1, \dots, J)$$
       * Ứng dụng các thuật toán kép vững (Doubly Robust) kết hợp dạng hàm linh hoạt (như phân phối Poisson hoặc Log-linear cho biến kết quả tiền lương):
         * *Kỳ vọng Kết quả Tiềm năng (Potential Outcome Means - POM):* $\text{POM}_j = \mathbb{E}[Y(j)]$.
         * *Hiệu ứng Can thiệp Trung bình (ATE):* $\text{ATE}_{j \text{ vs } k} = \mathbb{E}[Y(j) - Y(k)]$.
         * *Hiệu ứng Can thiệp trên Nhóm Can thiệp (ATT):* $\text{ATT}_{j \text{ vs } k \mid T=j} = \mathbb{E}[Y(j) - Y(k) \mid T = j]$.
         * *Kiểm định Tương phản (Contrast Analysis):* So sánh đối chuẩn theo nhóm tham chiếu (`contrast r.var`) hoặc so sánh tương đối giữa các bậc liền kề (`contrast ar.var` - adjacent rate/level contrast).
    2. *Mô hình Hồi quy Xử lý Nội sinh (Endogenous Treatment Regression - `etregress`):*
       * Khắc phục triệt để hạn chế cốt tử của PSM truyền thống (chỉ xử lý chệch dựa trên biến quan sát được - Selection on Observables) bằng cách mô hình hóa đồng thời phương trình kết quả và phương trình lựa chọn can thiệp có tính đến các yếu tố gây nhiễu không quan sát được (Selection on Unobservables):
         $$\text{Phương trình kết quả: } Y_i = \mathbf{X}_i'\boldsymbol{\beta} + \delta D_i + \varepsilon_i$$
         $$\text{Phương trình can thiệp nhị phân: } D_i = \mathbf{1}(\mathbf{W}_i'\boldsymbol{\gamma} + u_i > 0)$$
         Trong đó phần dư tuân theo phân phối chuẩn hai chiều:
         $$(\varepsilon_i, u_i) \sim \mathcal{N}\left( \mathbf{0}, \begin{bmatrix} \sigma^2 & \rho\sigma \\ \rho\sigma & 1 \end{bmatrix} \right)$$
       * Hai cơ chế ước lượng: Ước lượng Hợp lý Cực đại Toàn phần (Full Information Maximum Likelihood - FIML) và Ước lượng Hai bước Heckman (Heckman Two-Step Method) thông qua việc chèn tỷ số Mills nghịch đảo (Inverse Mills Ratio - IMR).
* **Điểm khác biệt / Điểm đặc trưng:** 
  * Multi-group PSM giải quyết bài toán lựa chọn bậc thang (ví dụ: các bậc học vấn nối tiếp nhau), cho phép bóc tách tỷ suất sinh lời cận biên giữa từng nấc thang kế tiếp.
  * Lệnh `etregress` cung cấp kiểm định thống kê trực tiếp cho tham số tương quan $\rho$ (hoặc $\lambda = \rho\sigma$). Nếu kiểm định bác bỏ giả thuyết $H_0: \rho = 0$, điều đó chứng minh có sự hiện diện của biến ẩn không quan sát được; khi đó các phương pháp PSM thông thường đều bị chệch, và việc áp dụng `etregress` là bắt buộc để khôi phục ước lượng nhân quả nhất quán.
### 2. Phân tích các ví dụ minh họa (Slide 2–7 & Transcript P2–P7)
* **Can thiệp Đa nhóm: Bậc Học Vấn và Tiền Lương (`bdsianesi5.dta` - Slide 2–4):**
  * *Biểu diễn logic:* 
    $$\text{ed} \in \{\text{None}, \text{A-level}, \text{H-level}, \text{Degree}\} \xrightarrow{\text{teffects ipwra / aipw}} \begin{cases}        \text{pom} \implies \mathbb{E}[\text{wage}(\text{ed})] \\        \text{contrast r.ed} \implies \mathbb{E}[\text{wage}(j) - \text{wage}(\text{None})] \\        \text{contrast ar.ed} \implies \mathbb{E}[\text{wage}(j) - \text{wage}(j-1)]      \end{cases}$$
    $$\text{Cú pháp Stata: } \text{teffects ipwra (wage \dots, poisson) (ed \dots), atet control(A) tlevel(H)}$$
  * *Cơ chế thực tế:* Trình độ học vấn cao nhất (`ed`) được phân chia thành 4 bậc rời rạc. Lệnh `teffects ipwra` mô hình hóa tiền lương theo họ phân phối Poisson và mô hình hóa xác suất chọn bậc học theo Multinomial Logit. Việc chỉ định `control(A) tlevel(H)` tính toán ATT cho riêng phân nhóm học sinh thực tế đã hoàn thành bậc H so với kịch bản phản thực tế nếu chính họ chỉ dừng lại ở bậc A. Lệnh `contrast ar.ed` kiểm tra bước nhảy thu nhập khi nâng cấp từng bậc giáo dục liền kề, bóc tách giá trị gia tăng cận biên của mỗi cấp độ đào tạo.
* **Mô hình Hồi quy Xử lý Nội sinh: Công Đoàn và Tiền Lương (`union3.dta` - Slide 5–7):**
  * *Biểu diễn logic:* 
    $$\text{wage}_i = \mathbf{X}_i'\boldsymbol{\beta} + \delta \text{union}_i + \varepsilon_i \quad \text{với} \quad \text{union}_i = \mathbf{1}\big(\gamma_0 + \gamma_1 \text{south} + \gamma_2 \text{black} + \gamma_3 \text{tenure} + u_i > 0\big)$$
    $$\text{Cú pháp Stata: } \text{etregress wage age grade smsa black tenure, treat(union = south black tenure) two}$$
    $$\text{Đối chiếu: } \text{heckman wage age grade smsa black tenure, select(union = south black tenure) twostep}$$
  * *Cơ chế thực tế:* Việc người lao động tham gia công đoàn (`union`) không mang tính ngẫu nhiên mà chịu ảnh hưởng của cả các biến quan sát được (vùng miền `south`, chủng tộc `black`, thâm niên `tenure`) lẫn các đặc tính tiềm ẩn (năng lực thương lượng ngầm, mức độ e ngại rủi ro trong $u_i$). Khi sử dụng tùy chọn `two`, Stata chuyển từ ước lượng ML phức tạp sang quy trình 2 bước Heckman: Bước 1 ước lượng mô hình Probit cho biến `union` để tính toán tỷ số Mills nghịch đảo (IMR); Bước 2 đưa IMR vào phương trình tiền lương `wage` như một biến kiểm soát bổ sung nhằm triệt tiêu phần hiệp phương sai giữa $\text{union}_i$ và $\varepsilon_i$, giúp ước lượng hệ số $\delta$ của quyền lợi công đoàn không còn bị chệch.
### 3. Ý nghĩa thực tiễn & Ứng dụng ra quyết định (Slide 2–7 & Transcript P2–P7)
* **Theo góc nhìn Hoạch định Chính sách Phân tầng Giáo dục (Educational Ladder Strategy):**
  * *Mục tiêu:* Tối ưu hóa nguồn lực ngân sách nhà nước cho các bậc giáo dục mang lại giá trị gia tăng kinh tế cao nhất.
  * *Hành động can thiệp:* Khai thác lệnh `contrast ar.ed` để so sánh lợi tức cận biên giữa các bậc học liền kề; nếu bước nhảy từ A-level lên H-level mang lại mức tăng trưởng tiền lương vượt trội so với các nấc thang khác, chính phủ cần ưu tiên mở rộng hạn mức tín dụng sinh viên và học bổng cho giai đoạn chuyển tiếp then chốt này.
* **Theo góc nhìn Phân định Chiến lược giữa ATE và ATT trong Can thiệp Đa nhóm:**
  * *Mục tiêu:* Đánh giá đúng quy mô tác động can thiệp phù hợp với đối tượng mục tiêu của dự án.
  * *Hành động can thiệp:* Áp dụng ATE khi thiết kế các chính sách công mang tính phổ cập toàn dân; chuyển sang tính toán ATT (`atet control(...) tlevel(...)`) khi đánh giá hiệu quả thực chất trên nhóm đối tượng tự nguyện tham gia hoặc nhóm mục tiêu được thụ hưởng chính sách, tránh ngộ nhận rằng toàn bộ người dân đều đạt được hiệu quả tương đương như nhóm tham gia thực tế.
* **Theo góc nhìn Kiểm soát Chệch Ẩn và Lựa chọn Mô hình Thực chứng (Unobserved Confounder Protocol):**
  * *Mục tiêu:* Bảo đảm tính vững của các kết luận nghiên cứu kinh tế lao động trước các chỉ trích về biến nội sinh tiềm ẩn.
  * *Hành động can thiệp:* Trong các nghiên cứu quan sát có sự tham gia tự nguyện của con người (như gia nhập công đoàn, tham gia bảo hiểm, đào tạo nghề), luôn thực hiện kiểm định $\rho$ trong lệnh `etregress`; nếu $\rho$ có ý nghĩa thống kê, kiên quyết loại bỏ mô hình OLS và PSM ngây thơ, sử dụng kết quả ước lượng từ `etregress` (với tùy chọn `twostep` hoặc FIML) kết hợp với các biến công cụ ngoại sinh vững chắc để tham mưu chính sách lao động - tiền lương.
# Hierarchical Linear Model
## Logic and estimation methods of HLM

## Three-layer model

## Centering

## Workshop 1: Stata-Based Analysis of HLM

## Longitudinal data and model growth

## Meta-analysis

## Workshop 2: Stata-Based Analysis of HLM
