---
title: Điện và Quang – chép từ ảnh chụp bảng lớp Vật lý đại cương
type: note
tags:
  - general-education
  - physics
  - electromagnetism
  - optics
section: Học phần đại cương
folder: Học phần đại cương
vaultPath: Resources/Học phần đại cương/03a - Điện và Quang.md
order: 3
description: >-
  Chép lại ý chính từ 15 ảnh chụp bảng trong folder Drive Điện Quang (bài chữa
  trên lớp Vật lý đại cương, khoảng tháng 5/2022). Theo quy ước của vault, ảnh
  không lưu vào vault; xem ảnh gốc trên Drive. Danh mục tài liệu Vật
isIndex: false
---
> Chép lại ý chính từ 15 ảnh chụp bảng trong folder Drive [Điện Quang](https://drive.google.com/drive/folders/1-zgvhjKQ9M4RSJ1cZhnZcG_OxPzllZ2Y) (bài chữa trên lớp Vật lý đại cương, khoảng tháng 5/2022). Theo quy ước của vault, ảnh không lưu vào vault; xem ảnh gốc trên Drive. Danh mục tài liệu Vật lý ở [Vật lý đại cương](/blog/hoc-phan-dai-cuong/03-vat-ly/).

<details class="callout callout-question">
<summary>Cần kiểm tra</summary>

- Chỗ có `(?)` là chữ trên bảng bị mờ, bị che hoặc bị cắt khỏi khung ảnh.
- Các bước có ghi *(Claude bổ sung)* không có trên bảng, do Claude tính hoặc suy ra để note đọc liền mạch.
- Bài 13: bảng ghi kết quả $1{,}4\cdot10^{-6}$ và $1{,}4\pi\cdot10^{-6}$, nhưng tính lại với $I = 7$ A, $R = 0{,}1$ m thì ra $10^{-5}$ (xem mục 3).

</details>

## 1. Điện trường của phân bố điện tích liên tục

- Nguyên lý chung: chia vật thành các điện tích nhỏ $dq$, rồi cộng (tích phân) đóng góp:
	- $d\vec E = \dfrac{1}{4\pi\varepsilon_0}\dfrac{dq}{r^2}\hat r$, $\vec E = \int d\vec E$
	- $V = \dfrac{q}{4\pi\varepsilon_0 r}$ cho điện tích điểm; $V = \sum V_i = \int dV = \dfrac{1}{4\pi\varepsilon_0}\int\dfrac{dq}{r}$
	- Do đối xứng, chỉ cần cộng thành phần không bị triệt tiêu (ví dụ $dE_s = |d\vec E|\cos\theta$).

### 1.1. Thanh thẳng dài $2a$, mật độ điện dài $\lambda$ – tìm $\vec E$ và $V$ tại $H$

- $H$ nằm trên trung trực, cách thanh khoảng $h$; $\theta_0$ là góc nhìn nửa thanh từ $H$ ($\tan\theta_0 = a/h$).
- $|d\vec E| = \dfrac{1}{4\pi\varepsilon_0}\dfrac{\lambda\,ds}{s^2 + h^2}$; thành phần theo phương $h$: $dE = |d\vec E|\dfrac{h}{\sqrt{h^2 + s^2}} = \dfrac{1}{4\pi\varepsilon_0}\dfrac{\lambda h\,ds}{(s^2 + h^2)^{3/2}}$.
- Đổi biến $s = h\tan\theta$, $ds = \dfrac{h}{\cos^2\theta}d\theta$ → $dE = \dfrac{\lambda}{4\pi\varepsilon_0 h}\cos\theta\,d\theta$.
- **Kết quả**: $|\vec E| = 2\int_0^{\theta_0} dE = \dfrac{\lambda\sin\theta_0}{2\pi\varepsilon_0 h}$.
	- Thanh dài vô hạn ($a \to \infty$, $\theta_0 \to 90°$): $E = \dfrac{\lambda}{2\pi\varepsilon_0 h}$.
- **Điện thế**: $V = \dfrac{1}{4\pi\varepsilon_0}\int_{-a}^{a}\dfrac{\lambda\,ds}{\sqrt{s^2 + h^2}}$, dùng $\int\dfrac{dx}{\sqrt{x^2 + h^2}} = \ln\left(x + \sqrt{x^2 + h^2}\right)$.
	- → $V = \dfrac{\lambda}{2\pi\varepsilon_0}\ln\dfrac{a + \sqrt{a^2 + h^2}}{h}$ *(Claude bổ sung bước cuối)*.

### 1.2. Dây dài vô hạn – dùng định lý Gauss

- Mặt Gauss là hình trụ bán kính $h$, chiều cao $\ell$, gồm hai đáy $S_1$, $S_2$ và mặt bên $S_3$.
- Thông lượng qua $S_1$, $S_2$ bằng 0 vì $\vec E \perp$ pháp tuyến hai đáy, nên chỉ còn $S_3$: $\oint\vec E\,d\vec S = E\cdot 2\pi h\ell = \dfrac{\lambda\ell}{\varepsilon_0}$.
- → $E = \dfrac{\lambda}{2\pi\varepsilon_0 h}$, trùng kết quả 1.1 khi $a \to \infty$.
- **Định lý Gauss**: $\Phi = \oint\vec E\,d\vec S = \dfrac{q_{in}}{\varepsilon_0}$.

### 1.3. Vòng tròn bán kính $R$, mật độ $\lambda$ – $H$ trên trục, cách tâm $h$

- $dE_n = dE\cos\theta$; tích phân theo góc $\varphi$ từ 0 đến $2\pi$; tổng điện tích $\int dq = 2\pi R\lambda$.
- **Kết quả**:
	- $E = \dfrac{\lambda R h}{2\varepsilon_0 (R^2 + h^2)^{3/2}}$
	- $V = \int\dfrac{dq}{4\pi\varepsilon_0\sqrt{R^2 + h^2}} = \dfrac{2\pi R\lambda}{4\pi\varepsilon_0\sqrt{R^2 + h^2}} = \dfrac{\lambda R}{2\varepsilon_0\sqrt{R^2 + h^2}}$

### 1.4. Đĩa tròn bán kính $R$, mật độ mặt $\sigma$ – $H$ trên trục, cách tâm $h$

- Chia đĩa thành phần tử $dq = \sigma\,x\,d\varphi\,dx$ (toạ độ cực).
- $E = \dfrac{\sigma h}{2\varepsilon_0}\int_0^R\dfrac{x\,dx}{(x^2 + h^2)^{3/2}} = \dfrac{\sigma}{2\varepsilon_0}\left(1 - \dfrac{h}{\sqrt{R^2 + h^2}}\right)$
- $V = \dfrac{1}{4\pi\varepsilon_0}\iint\dfrac{\sigma\,x\,d\varphi\,dx}{\sqrt{x^2 + h^2}} = \dfrac{\sigma}{2\varepsilon_0}\left(\sqrt{R^2 + h^2} - h\right)$
- Khi $h \to 0$ (sát mặt đĩa): $E = \dfrac{\sigma}{2\varepsilon_0}$.

### 1.5. Mặt phẳng tích điện và vỏ cầu (shell)

- Mặt Gauss là hình trụ xuyên qua mặt phẳng tích điện $\sigma$: $\int_{S_1} = \int_{S_2} = 0$ (hai đáy song song với $\vec E$), còn lại $EA = \dfrac{\sigma A}{\varepsilon_0}$ → $E = \dfrac{\sigma}{\varepsilon_0}$ (?).
	- *(Claude bổ sung)* $E = \sigma/\varepsilon_0$ đúng cho điện trường giữa hai bản tụ hoặc sát bề mặt vật dẫn; một mặt phẳng cô lập tích điện đều cho $E = \sigma/2\varepsilon_0$, khớp với giới hạn $h \to 0$ của đĩa ở 1.4.
- Vỏ cầu tích điện đều: bảng đặt câu hỏi "E = ?" bên trong vỏ. *(Claude bổ sung)* Bên trong $E = 0$ (mặt Gauss không bao điện tích); bên ngoài $E = \dfrac{q}{4\pi\varepsilon_0 r^2}$.

## 2. Tụ điện

- Định nghĩa: $q = CV$.
- Quy trình 3 bước tính điện dung:
	1. $q \to E$ (dùng định lý Gauss)
	2. $V = \int E\,dx$
	3. $q = CV$ → rút ra $C$

### 2.1. Tụ phẳng (diện tích bản $A$, khoảng cách $d$)

- $E = \dfrac{\sigma}{\varepsilon_0} = \dfrac{\Delta V}{\Delta d}$, $q = \sigma A$; tổng quát $E = -\dfrac{\partial V}{\partial x}$.
- $V = \int E\,dx = Ed = \dfrac{\sigma d}{\varepsilon_0} = \dfrac{d}{\varepsilon_0 A}q$ → $q = \dfrac{\varepsilon_0 A}{d}V$ → $C = \dfrac{\varepsilon_0 A}{d}$.

### 2.2. Tụ trụ (bán kính $a < b$, dài $L$)

- Gauss: $E\cdot 2\pi x L = \dfrac{\lambda L}{\varepsilon_0}$, $\lambda = \dfrac{q}{L}$ → $E = \dfrac{\lambda}{2\pi\varepsilon_0 x}$.
- $V = \int_a^b E\,dx = \dfrac{\lambda}{2\pi\varepsilon_0}\ln\dfrac{b}{a} = \dfrac{q}{2\pi\varepsilon_0 L}\ln\dfrac{b}{a}$.
- → $C = \dfrac{2\pi\varepsilon_0 L}{\ln(b/a)}$.

### 2.3. Tụ cầu (bán kính $a$, $b$)

- Gauss: $\oint\vec E\,d\vec A = E\cdot 4\pi r^2 = \dfrac{q}{\varepsilon_0}$.
- $V = \int_a^b E\,dr = \int_a^b\dfrac{q}{4\pi\varepsilon_0}\dfrac{dr}{r^2} = \dfrac{q}{4\pi\varepsilon_0}\left(\dfrac{1}{b} - \dfrac{1}{a}\right)$ (về độ lớn).
- → bảng ghi $C = \dfrac{4\pi\varepsilon_0 ab}{a - b}$. *(Claude bổ sung)* Lấy độ lớn, với $b > a$: $C = \dfrac{4\pi\varepsilon_0 ab}{b - a}$.

### 2.4. Năng lượng tụ điện

- $U = \tfrac{1}{2}qV = \dfrac{q^2}{2C} = \dfrac{CV^2}{2} = \dfrac{\varepsilon_0 A V^2}{2d} = \dfrac{\varepsilon_0 (Ad) E^2}{2}$, trong đó $Ad$ là thể tích (volume) giữa hai bản.
- **Mật độ năng lượng điện trường**: $u = \dfrac{U}{\text{Volume}} = \dfrac{\varepsilon_0 E^2}{2}$.

## 3. Từ trường – định luật Biot–Savart

- $d\vec B = \dfrac{\mu_0}{4\pi}\dfrac{I\,d\vec\ell \times \hat r}{r^2}$, $\mu_0 = 4\pi\cdot10^{-7}$ T·m/A.
- Đoạn dây thẳng có dòng $I$, chiều dài $d$; điểm khảo sát trên trung trực, cách dây $R$:
	- $B = \dfrac{\mu_0 I}{4\pi}\int_{-d/2}^{d/2}\dfrac{R\,dx}{(R^2 + x^2)^{3/2}}$; đổi biến $x = R\tan\theta$, $dx = \dfrac{R\,d\theta}{\cos^2\theta}$, dùng $\cos^2\theta(1 + \tan^2\theta) = 1$.
	- → $B = \dfrac{\mu_0 I}{4\pi R}\int_{-\theta_0}^{\theta_0}\cos\theta\,d\theta = \dfrac{\mu_0 I}{4\pi R}\dfrac{d}{\sqrt{R^2 + d^2/4}}$.
- Ví dụ khung vuông cạnh 40 cm, $I = 10$ A, tính $B$ tại tâm: $R = 0{,}2$ m, $d = 0{,}4$ m, $\vec B = \vec B_1 + \vec B_2 + \vec B_3 + \vec B_4$ (4 cạnh cho $\vec B$ cùng chiều).
	- $B = 4\dfrac{\mu_0 I}{4\pi R}\dfrac{d}{\sqrt{R^2 + d^2/4}} \approx 2{,}83\cdot10^{-5}$ T *(Claude bổ sung số)*.

### Bài 13 – dây thẳng dài và vòng tròn

- Dữ kiện: $I = 7$ A, $R = 10$ cm; trên hình là một dây thẳng dài kèm một vòng tròn, $\vec B$ hướng ra khỏi mặt phẳng (?).
- Dây thẳng (cho $d \to \infty$ trong công thức trên): $B_1 = \dfrac{\mu_0 I}{4\pi R}\cdot\dfrac{1}{\sqrt{1/4}} = \dfrac{\mu_0 I}{2\pi R}$.
- Vòng tròn tại tâm: $B_2 = \dfrac{\mu_0 I}{2R}$.
- $|\vec B| = |\vec B_1| + |\vec B_2|$ (cùng chiều).
- Số: bảng ghi $B_1 = 1{,}4\cdot10^{-6}$ (?), $B_2 = 1{,}4\pi\cdot10^{-6}$ (?). *(Claude tính lại)* $B_1 = \dfrac{2\cdot10^{-7}\cdot 7}{0{,}1} = 1{,}4\cdot10^{-5}$ T; $B_2 = \dfrac{4\pi\cdot10^{-7}\cdot 7}{0{,}2} = 1{,}4\pi\cdot10^{-5} \approx 4{,}4\cdot10^{-5}$ T; $B \approx 5{,}8\cdot10^{-5}$ T.

### Bài 15 – hai cung tròn 60°

- Dữ kiện: $\theta = 60°$, $a = 20$ cm, $b = 40$ cm, $I = 1{,}\dots$ A (?) (bị xoá); mạch gồm các đoạn thẳng 1, 3, 5 và hai cung 2 (bán kính $b$), 4 (bán kính $a$), cùng tâm $P$.
- Các đoạn thẳng hướng qua $P$ nên $d\vec\ell \parallel \hat r$ → $B = 0$ (bảng ghi "$B_1 = B_2 = B_5 = 0$", có lẽ là $B_1 = B_3 = B_5 = 0$ (?)).
- Cung 60° bằng $\tfrac{1}{6}$ vòng: $B = B_2 - B_4 = \dfrac{1}{6}\dfrac{\mu_0 I}{2}\left(\dfrac{1}{R_2} - \dfrac{1}{R_4}\right)$ → độ lớn $\dfrac{\mu_0 I}{12}\cdot\dfrac{b - a}{ab}$ (bảng viết $\dfrac{a - b}{ab}$, chỉ khác dấu).

### Bài 16 – hai nửa vòng tròn

- Dữ kiện: $I = 15$ A (?), $a = 10$ cm, $b = 15$ cm; hai nửa vòng tròn đồng tâm 2 (ngoài) và 4 (trong) nối bởi hai đoạn thẳng 1, 3 nằm trên đường kính.
- $B_1 = B_3 = 0$. Phần còn lại bị khuất. *(Claude bổ sung)* Nếu dòng trong hai nửa vòng chạy ngược chiều quay: $B = \dfrac{\mu_0 I}{4}\left(\dfrac{1}{a} - \dfrac{1}{b}\right) \approx 1{,}6\cdot10^{-5}$ T.

## 4. Cảm ứng điện từ

- **Định luật Faraday**: $\mathcal{E} = -\dfrac{d\Phi_B}{dt} = -\dfrac{d}{dt}\int B\cos\varphi\,dA$; dạng tích phân $\oint\vec E\,d\vec\ell = -\dfrac{d}{dt}\int_A B\cos\varphi\,dA$. Từ trường biến thiên $B(t)$ sinh ra dòng điện $i$.
- **Truyền tải điện** (ví dụ trên bảng): cùng công suất 1 MW, truyền ở điện áp thấp thì dòng tới khoảng 1000 A, còn ở 500 kV thì dòng chỉ cỡ 1 A → phải tăng áp để giảm hao phí trên dây; nơi dùng hạ về 220 V.
- **Hỗ cảm** giữa cuộn 1 và cuộn 2: $N_2\Phi_{21} \sim I_1$, $M_{21} = \dfrac{N_2\Phi_{21}}{I_1}$; $\mathcal{E}_2 = -M_{21}\dfrac{dI_1}{dt}$, $\mathcal{E}_1 = -M_{12}\dfrac{dI_2}{dt}$.
- **Máy biến áp** (cuộn sơ cấp T, thứ cấp S): $U_T = -N_T\dfrac{d\Phi}{dt}$, $U_S = -N_S\dfrac{d\Phi}{dt}$ → $\dfrac{U_T}{U_S} = \dfrac{N_T}{N_S}$; bỏ qua hao phí: $U_T I_T = U_S I_S$.

## 5. Mạch RC, RL và năng lượng từ trường

- Mạch RL (định luật Kirchhoff đi một vòng từ điểm $a$): $V_a + \mathcal{E} - L\dfrac{dI}{dt} - RI = V_a$ → $\mathcal{E} = RI + L\dfrac{dI}{dt}$.
- Nhân hai vế với $I$: $\mathcal{E}I = RI^2 + LI\dfrac{dI}{dt}$ → công suất nguồn ($P_{input}$) = nhiệt Joule + phần tích luỹ vào từ trường $B$.
- **Năng lượng cuộn cảm**: $W_B = \int_0^I LI\,dI = \dfrac{LI^2}{2}$.
- Ống dây: $L = \mu_0 n^2 S\ell$, $B = \mu_0 nI$ → **mật độ năng lượng từ trường** $\dfrac{W_B}{V} = \dfrac{LI^2}{2\ell S} = \dfrac{(\mu_0 nI)^2}{2\mu_0} = \dfrac{B^2}{2\mu_0}$.

## 6. Hệ phương trình Maxwell và sóng điện từ

| Định luật | Phương trình |
| --- | --- |
| Gauss (điện) | $\oint\vec E\,d\vec A = \dfrac{Q_{in}}{\varepsilon_0}$ |
| Gauss (từ) | $\oint\vec B\,d\vec A = 0$ |
| Faraday | $\oint\vec E\,d\vec\ell = -\dfrac{d\Phi_B}{dt} = -\dfrac{d}{dt}\int\vec B\,d\vec A$ |
| Ampère – Maxwell | $\oint\vec B\,d\vec\ell = \mu_0\left(i + \varepsilon_0\dfrac{d\Phi_E}{dt}\right)$, $\Phi_E = \int\vec E\,d\vec A$ |

- Số hạng $\varepsilon_0\dfrac{d\Phi_E}{dt}$ là **dòng điện dịch**: điện trường biến thiên sinh ra từ trường.
- **Sóng điện từ**: $\vec E$ và $\vec B$ dao động vuông góc nhau và vuông góc phương truyền.
- **Mạch dao động LC**: $U_C = \dfrac{1}{2}\dfrac{Q^2}{C} = \dfrac{1}{2}\dfrac{Q_0^2}{C}\cos^2\omega t$, $U_L = \dfrac{1}{2}LI^2 = \dfrac{1}{2}L\omega^2 Q_0^2\sin^2\omega t$ → năng lượng chuyển qua lại giữa điện trường và từ trường.
- Mật độ năng lượng: $u_B = \dfrac{B^2}{2\mu_0}$, $u_E = \dfrac{\varepsilon_0 E^2}{2}$.

## 7. Giao thoa ánh sáng

- Bảng ghi "Midterm" ở góc trái (?) – có thể là phạm vi thi giữa kì.
- Điều kiện giao thoa: hai nguồn $S_1$, $S_2$ **kết hợp (coherent)**. Ánh sáng từ hai nguồn độc lập không giao thoa.
- Các cách tạo hai nguồn kết hợp từ một nguồn $S$: **gương Fresnel**, **hai nửa thấu kính Billet**, **gương Lloyd**, **lưỡng lăng kính Fresnel**. Vân giao thoa trong các bố trí này là **giao thoa không định xứ**.
	- Gương Lloyd: tại mép gương là vân **tối**, do tia phản xạ bị đổi pha $\pi$.
- Hai sóng $I_1 = I_0\cos(\omega t)$, $I_2 = I_0\cos(\omega t + \varphi)$ (?) chồng chập cho cường độ:
	- $I = 4I_0\cos^2\dfrac{\varphi}{2}$, với $\varphi = \dfrac{2\pi d}{\lambda}\sin\theta$.
- Vị trí vân sáng trên màn cách khe $D$: $y = m\dfrac{\lambda D}{d}$ ($m = 0$: vân trung tâm $y = 0$); khoảng vân $i = \dfrac{\lambda D}{d}$.
