# PROJECT_DOCUMENT.md

## 1. Tổng quan dự án

**Tên dự án (working title):** Universal Tools Platform  
**Mô tả:**
Một nền tảng web tập trung các công cụ (tools) tiện ích cho developer, data analyst và người dùng phổ thông. Dự án cung cấp các nhóm công cụ như Converter, Developer Tools, Language & Text Tools, Finance Tools và Data Tools.  

Khác với layout dạng card grid truyền thống như trong hình tham khảo, dự án này sử dụng **layout dạng dashboard + tool workspace**, tập trung vào trải nghiệm sử dụng từng tool, dễ mở rộng và phù hợp cho người dùng chuyên nghiệp.

---

## 2. Mục tiêu

- Tập trung nhiều tool phổ biến trong một nền tảng duy nhất
- Giao diện hiện đại, dễ mở rộng, thân thiện với developer
- Hiệu năng cao, client-side processing là chính (không upload server nếu không cần thiết)
- Dễ scale thêm tool mới trong tương lai

---

## 3. Đối tượng người dùng

- Developer (Frontend / Backend / Fullstack)
- Data Analyst / BI
- Marketer / Content creator
- Người dùng phổ thông cần các công cụ chuyển đổi nhanh

---

## 4. Công nghệ sử dụng

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI based)
- **TanStack Table** (cho Pivot Table Tool)
- **TanStack Virtual** (tối ưu render bảng lớn)

### Data & Utility
- Client-side parsing (CSV, XLSX)
- PapaParse (CSV)
- SheetJS / xlsx (Excel)

### Khác
- ESLint + Prettier
- Husky (pre-commit)
- Zod (validate input)

---

## 5. Kiến trúc tổng thể

```
app/
 ├─ (marketing)/
 ├─ (tools)/
 │   ├─ layout.tsx          // Layout chung cho tool workspace
 │   ├─ page.tsx            // Tool Explorer
 │   ├─ converters/
 │   ├─ developer/
 │   ├─ language/
 │   ├─ finance/
 │   └─ data/
 ├─ api/ (optional)
components/
 ├─ layout/
 ├─ tool-shell/
 ├─ sidebar/
 ├─ header/
 └─ ui/ (shadcn)
lib/
 ├─ utils/
 ├─ parsers/
 └─ constants/
```

---

## 6. Layout & UX Design

### 6.1 Layout tổng thể (khác layout trong hình)

- **Sidebar trái**: Danh sách category & tool
- **Header trên**: Search tool, theme switcher, quick actions
- **Main Workspace**:
  - Tool Config Panel (bên trái hoặc top)
  - Result / Preview Panel (bên phải hoặc center)

### 6.2 Điều hướng

- URL theo dạng:
  ```
  /tools/[category]/[tool]
  ```
- Mỗi tool là một page độc lập

---

## 7. Danh sách Tool

### 7.1 Converters & Data Tools

- Number to Words Converter
- Date Format Converter
- Unit Converter
- File Size Converter
- Case Converter
- Base Converter
- Color Converter
- Timestamp Converter

---

### 7.2 Developer Tools

- JSON Formatter
- XML Formatter
- SQL Formatter
- Regex Tester
- Hash Generator
- JWT Decoder

---

### 7.3 Language & Text Tools

- Word Counter
- Vietnamese ⇄ Katakana Converter
- Text Diff
- Text Normalizer

---

### 7.4 Finance Tools

- Vietnam Salary Gross ⇄ Net Calculator
- VAT Calculator Vietnam
- Currency Converter

---

### 7.5 Data Tools (NEW)

#### Pivot Table Tool (NEW)

**Mô tả:**
Công cụ cho phép người dùng import file dữ liệu và trực quan hóa dưới dạng Pivot Table ngay trên trình duyệt.

**Chức năng chính:**
- Import file: CSV / XLSX
- Auto-detect columns & data types
- Kéo-thả cấu hình:
  - Rows
  - Columns
  - Values (Sum, Count, Avg, Min, Max)
- Filter theo column
- Sort & group
- Virtualized table (hiệu năng cao)

**Công nghệ:**
- TanStack Table v8
- TanStack Virtual
- SheetJS / PapaParse

**Luồng hoạt động:**
1. User upload file
2. Parse dữ liệu client-side
3. Generate schema
4. User cấu hình pivot
5. Render bảng kết quả

---

## 8. State Management

- React state + hooks (useState, useMemo)
- TanStack Table internal state
- Không dùng Redux (trừ khi scale lớn)

---

## 9. Performance & Optimization

- Dynamic import cho từng tool
- Memo hóa heavy calculation
- Virtual scroll cho table lớn
- Web Worker (optional cho pivot nặng)

---

## 10. Security & Privacy

- Không upload file lên server (mặc định)
- Xử lý dữ liệu hoàn toàn client-side
- Clear data khi reload / leave page

---

## 11. Khả năng mở rộng

- Tool registry (config-based)
- Dễ thêm tool mới chỉ bằng 1 config + page
- Có thể tách tool thành micro-frontend sau này

---

## 12. Roadmap (đề xuất)

- v1.0: Core tools + Pivot Table
- v1.1: User favorites, recent tools
- v1.2: Export result (CSV, JSON, PNG)
- v2.0: Auth + workspace lưu cấu hình

---

## 13. Kết luận

Dự án hướng tới một **"All-in-one Tool Platform"** với trải nghiệm hiện đại, hiệu năng cao, dễ mở rộng. Việc sử dụng Next.js, TypeScript, shadcn/ui và TanStack Table giúp đảm bảo codebase sạch, maintainable và phù hợp cho sản phẩm lâu dài.

