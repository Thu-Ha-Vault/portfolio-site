---
title: 2. Foundations of Agentic AI in GitHub
type: note
tags: []
section: AI và DEV
folder: AI và DEV / GitHub / Developing in Agentic AI Systems
vaultPath: >-
  Resources/AI và DEV/GitHub/Developing in Agentic AI Systems/2. Foundations of
  Agentic AI in GitHub.md
url: /blog/foundations-of-agentic-ai-in-github/
topic: ai-development
updated: '2026-10-14'
order: 2
description: >-
  Trước kia: AI gợi ý code, người dùng copy lại paste vào IDE Bây giờ: Hệ thống
  có hành động trong suốt vòng đời phát triển phần mềm [SDLC] - software
  development lifecycle. - Giống như trong Github, ta có Copilot: khám ph
isIndex: false
---
- Trước kia: AI gợi ý code, người dùng copy lại paste vào IDE
- Bây giờ: Hệ thống có hành động trong suốt vòng đời phát triển phần mềm [SDLC] - software development lifecycle.
	- Giống như trong Github, ta có Copilot: khám phá kho lưu trữ [repository], đề xuất kế hoạch [plan], thực hiện thay đổi trên một nhánh [nhánh] và mở pull request [PR] để bạn xem xét.
	- Bạn không chỉ còn viết mã nữa. Bạn còn hướng dẫn, giám sát và xác nhận các hệ thống có thể lập kế hoạch, hành động và cải thiện theo thời gian trong quy trình làm việc của bạn.
- Quy trình làm việc của Agent (Agent Workflow): plan → act → evaluate (→ [AI in Education](/blog/artificial-intelligence-in-education/))
# 2.2. Xác định AI Agent trong SDLC
|          | Assistant-Based                                                                                                                                                                                                           | Agent-Based                                                                                                                                                                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Đặc điểm** | - Chúng phụ thuộc vào người dùng để quyết định bước tiếp theo cần làm gì.   <br>- Có thể đề xuất mã, giải thích kết quả đầu ra hoặc tóm tắt các thay đổi.   <br>- Không tự mình thúc đẩy tiến độ công việc bên trong repo | - Có thể hiểu rõ nhiệm vụ, xây dựng phương pháp tiếp cận và thực hiện các bước để hoàn thành nó.<br>- Có thể sử dụng các công cụ (ví dụ: API của GitHub, quy trình CI hoặc các thao tác ghi vào kho lưu trữ) để tạo ra các kết quả bền vững như nhánh, cam kết và yêu cầu kéo.<br>- Có thể cải tiến dựa trên phản hồi (kiểm tra, đánh giá, quét). |
| **Lựa chọn** | - Đưa ra các đề xuất hoặc giải thích.<br>- Không thực hiện các thao tác trên repo.<br>- Yêu cầu người dùng thực hiện từng bước thủ công.                                                                                  | - Duy trì mục tiêu xuyên suốt nhiều bước.<br>- Quyết định các hành động trung gian<br>- Sử dụng các công cụ <br>- Tạo hoặc chỉnh sửa các thành phần có thể lưu trữ lâu dài (nhánh/cam kết/yêu cầu kéo) <br>- Lặp lại dựa trên tín hiệu phản hồi                                                                                                   |
- Các hành động của AI Agent trên Github: Trong GitHub, hành vi của tác nhân được hiển thị thông qua các cấu trúc mà các nhà phát triển đã sử dụng:
	- Các nhánh và commit (những thay đổi)
	- Yêu cầu kéo (đề xuất, lý do và để xem xét)
	- Quy trình làm việc và kiểm tra (những bằng chứng hiện có)
	- Nhận xét và phê duyệt (những gì con người chấp nhận hoặc từ chối
- Một tác nhân không thay thế quy trình làm việc. Nó tham gia vào quy trình làm việc với tư cách là một thành viên.
# 2.3. Giải thích vòng đời của tác nhân - lập kế hoạch, hành động, đánh giá.
- Các hệ thống tác nhân không chỉ đưa ra một quyết định rồi dừng lại. Chúng hoạt động theo chu kỳ. Một mô hình nền tảng là vòng đời của plan → action → evaluate. Vòng đời này không phải là một chuỗi diễn ra một lần. Nó là một vòng lặp: các tác nhân liên tục lập kế hoạch, hành động và đánh giá cho đến khi nhiệm vụ đáp ứng các tiêu chí thành công đã định
## a. Plan
