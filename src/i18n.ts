export const ui = {
  home: ['Trang chủ', 'Home'],
  projects: ['Dự án', 'Projects'],
  blog: ['Blog kiến thức', 'Knowledge blog'],
  about: ['Giới thiệu', 'About'],
  featured: ['Dự án nổi bật', 'Featured projects'],
  allProjects: ['Tất cả dự án', 'All projects'],
  topics: ['Chủ đề', 'Topics'],
  notes: ['bài', 'notes'],
  search: ['Tìm bài viết…', 'Search notes…'],
  inThisSection: ['Trong mục này', 'In this section'],
  projectNotes: ['Ghi chép của dự án', 'Project notes'],
  prev: ['Bài trước', 'Previous'],
  next: ['Bài sau', 'Next'],
  source: ['Nguồn', 'Source'],
  deadline: ['Hạn', 'Due'],
  status: ['Trạng thái', 'Status'],
  active: ['Đang làm', 'In progress'],
  done: ['Hoàn thành', 'Completed'],
  paused: ['Tạm dừng', 'Paused'],
  readMore: ['Xem chi tiết', 'View details'],
  browseBlog: ['Khám phá blog', 'Browse the blog'],
  contact: ['Liên hệ', 'Contact'],
  footer: ['Nội dung được đồng bộ từ Second Brain (Obsidian) của mình.', 'Content synced from my Obsidian Second Brain.'],
  noResults: ['Không tìm thấy bài nào.', 'No matching notes.'],
  latestTopics: ['Blog kiến thức theo chủ đề', 'Knowledge blog by topic'],
} as const;

export type UiKey = keyof typeof ui;

/** Display names for top-level vault sections. */
export const sectionNames: Record<string, [string, string]> = {
  'Sinh học': ['Sinh học', 'Biology'],
  'AI và DEV': ['AI và Lập trình', 'AI & Development'],
  Business: ['Kinh doanh', 'Business'],
  'Tiếng Pháp': ['Tiếng Pháp', 'French'],
  'Tiếng Anh': ['Tiếng Anh', 'English'],
  'Học phần đại cương': ['Học phần đại cương', 'General university courses'],
};
