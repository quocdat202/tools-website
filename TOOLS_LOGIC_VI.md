# Tài Liệu Logic Các Tool

Tài liệu này mô tả chi tiết logic và thuật toán được sử dụng trong từng tool của dự án.

---

## Mục Lục

1. [Converters (Công cụ chuyển đổi)](#1-converters-công-cụ-chuyển-đổi)
2. [Developer Tools (Công cụ lập trình)](#2-developer-tools-công-cụ-lập-trình)
3. [Language & Text (Ngôn ngữ & Văn bản)](#3-language--text-ngôn-ngữ--văn-bản)
4. [Finance Tools (Công cụ tài chính)](#4-finance-tools-công-cụ-tài-chính)
5. [Data Tools (Công cụ dữ liệu)](#5-data-tools-công-cụ-dữ-liệu)

---

## 1. Converters (Công cụ chuyển đổi)

### 1.1 Number to Words (Chuyển số thành chữ)

**Mô tả**: Chuyển đổi số thành dạng chữ viết trong nhiều ngôn ngữ (Tiếng Anh, Tiếng Việt).

**Đầu vào**:
- Số (số nguyên hoặc số thập phân)
- Lựa chọn ngôn ngữ

**Đầu ra**: Chuỗi văn bản biểu diễn số

**Thuật toán**:
1. **Phân tách đệ quy theo hàng đơn vị**: Chia số theo các hàng nghìn tỷ (trillion), tỷ (billion), triệu (million), nghìn (thousand), trăm (hundred), chục (tens), đơn vị (ones)
2. **Xử lý đặc biệt cho số 10-19**: Các số này có cách đọc riêng (eleven, twelve... hoặc mười một, mười hai...)
3. **Xử lý số thập phân**: Đọc từng chữ số sau dấu phẩy (VD: 3.14 → "ba phẩy một bốn")
4. **Quy tắc tiếng Việt đặc biệt**:
   - "mười" cho 10-19
   - "mốt" thay "một" khi ở vị trí cuối hàng chục (21 → hai mươi mốt)
   - "lăm" thay "năm" khi ở vị trí cuối hàng chục (25 → hai mươi lăm)

**Phạm vi hỗ trợ**: Lên đến hàng nghìn tỷ

---

### 1.2 Date Format Converter (Chuyển đổi định dạng ngày)

**Mô tả**: Chuyển đổi ngày tháng giữa nhiều định dạng khác nhau.

**Đầu vào**: Chuỗi ngày tháng ở nhiều định dạng (ISO 8601, US/EU, Unix timestamp, ngày tương đối)

**Đầu ra**: 10 định dạng ngày khác nhau đồng thời

**Thuật toán**:
1. **Nhận dạng định dạng**: Thử 8 định dạng khác nhau để parse ngày
2. **Tính toán thời gian tương đối**: Phút, giờ, ngày, tuần, tháng, năm trước
3. **Chuyển đổi động**: Sử dụng JavaScript Date API

**Các định dạng hỗ trợ**:
- ISO 8601 (2024-01-15)
- US Format (01/15/2024)
- EU Format (15/01/2024)
- UK Format (15.01.2024)
- Long US/EU
- Short Format
- Unix Timestamp
- RFC 2822
- Relative (2 days ago)

---

### 1.3 Unit Converter (Chuyển đổi đơn vị)

**Mô tả**: Chuyển đổi giữa các đơn vị đo lường khác nhau.

**Đầu vào**: Giá trị số + đơn vị nguồn + đơn vị đích

**Đầu ra**: Giá trị đã chuyển đổi

**Thuật toán**:
1. **Chuyển đổi về đơn vị cơ sở**: Tất cả đơn vị được quy về đơn vị gốc (mét, kilogram, giây...)
2. **Công thức**: `(giá_trị × hệ_số_nguồn) / hệ_số_đích`
3. **Xử lý nhiệt độ đặc biệt**: Phi tuyến tính (Celsius ↔ Fahrenheit ↔ Kelvin)
   - C to F: `(C × 9/5) + 32`
   - F to C: `(F - 32) × 5/9`
   - C to K: `C + 273.15`

**Danh mục**: 8 loại (Độ dài, Khối lượng, Nhiệt độ, Diện tích, Thể tích, Tốc độ, Thời gian)

**Tổng số đơn vị**: 50+

---

### 1.4 File Size Converter (Chuyển đổi kích thước file)

**Mô tả**: Chuyển đổi giữa các đơn vị kích thước file.

**Đầu vào**: Giá trị số + đơn vị kích thước file

**Đầu ra**: Chuyển đổi sang tất cả đơn vị (Binary và SI)

**Thuật toán**:
1. **Binary (IEC)**: Cơ số 1024 (1 KB = 1024 bytes)
2. **SI (Decimal)**: Cơ số 1000 (1 kB = 1000 bytes)
3. **Công thức**: `giá_trị × (cơ_số ^ mũ_nguồn) / (cơ_số ^ mũ_đích)`

**Đơn vị**: Bit, Byte, KB/kB, MB, GB, TB, PB

**Tính năng**: Toggle giữa Binary và SI standard

---

### 1.5 Case Converter (Chuyển đổi kiểu chữ)

**Mô tả**: Chuyển đổi văn bản giữa các kiểu chữ khác nhau.

**Đầu vào**: Văn bản thuần

**Đầu ra**: 14 kiểu chữ khác nhau đồng thời

**Thuật toán cho từng kiểu**:

| Kiểu | Thuật toán |
|------|-----------|
| lowercase | `text.toLowerCase()` |
| UPPERCASE | `text.toUpperCase()` |
| Title Case | Tách theo khoảng trắng, viết hoa chữ cái đầu |
| Sentence case | Viết hoa sau dấu chấm câu (. ! ?) |
| camelCase | Xóa ký tự đặc biệt, viết hoa chữ cái tiếp theo |
| PascalCase | Như camelCase, viết hoa cả chữ đầu |
| snake_case | Thay ký tự đặc biệt bằng `_` |
| kebab-case | Thay ký tự đặc biệt bằng `-` |
| CONSTANT_CASE | snake_case + uppercase |
| dot.case | Thay ký tự đặc biệt bằng `.` |
| path/case | Thay ký tự đặc biệt bằng `/` |
| aLtErNaTe | Xen kẽ hoa/thường từng ký tự |
| InVeRsE | Đảo ngược hoa/thường của input |

---

### 1.6 Base Converter (Chuyển đổi cơ số)

**Mô tả**: Chuyển đổi số giữa các cơ số khác nhau.

**Đầu vào**: Chuỗi số + cơ số nguồn (2, 8, 10, 16, 32, 36)

**Đầu ra**: Chuyển đổi sang tất cả cơ số được hỗ trợ

**Thuật toán**:
1. **Validate input**: Kiểm tra ký tự hợp lệ với cơ số nguồn
2. **Chuyển về decimal**: `parseInt(input, sourceBase)`
3. **Chuyển sang cơ số đích**: `decimal.toString(targetBase)`

**Tính năng**: Tự động nhận diện và loại bỏ prefix (0x, 0b, 0o)

**Cơ số hỗ trợ**:
- Binary (2): 0-1
- Octal (8): 0-7
- Decimal (10): 0-9
- Hexadecimal (16): 0-9, A-F
- Base32 (32): 0-9, A-V
- Base36 (36): 0-9, A-Z

---

### 1.7 Color Converter (Chuyển đổi màu)

**Mô tả**: Chuyển đổi màu giữa các định dạng HEX, RGB, HSL, HSV.

**Đầu vào**: Màu ở bất kỳ định dạng nào

**Đầu ra**: HEX, RGB, RGBA, HSL, HSLA, HSV + preview trực quan + slider

**Thuật toán chuyển đổi**:

#### HEX ↔ RGB:
```
HEX to RGB: Parse hex string thành 3 giá trị 0-255
RGB to HEX: Format 3 giá trị thành hex với padding (00-FF)
```

#### RGB ↔ HSL:
```
1. Chuẩn hóa RGB về 0-1 (chia cho 255)
2. Tìm max, min của R, G, B
3. L = (max + min) / 2
4. Nếu max = min: S = 0, H = 0
5. Ngược lại:
   - d = max - min
   - S = d / (2 - max - min) nếu L > 0.5
   - S = d / (max + min) nếu L <= 0.5
   - H phụ thuộc vào màu nào là max:
     - R: H = ((G - B) / d + 6) % 6
     - G: H = (B - R) / d + 2
     - B: H = (R - G) / d + 4
6. H = H × 60 (chuyển về độ 0-360)
```

#### RGB ↔ HSV:
```
1. Chuẩn hóa RGB về 0-1
2. V = max(R, G, B)
3. S = (max - min) / max nếu max > 0, ngược lại S = 0
4. H tính tương tự HSL
```

---

### 1.8 Timestamp Converter (Chuyển đổi Timestamp)

**Mô tả**: Chuyển đổi giữa Unix timestamp và ngày tháng.

**Đầu vào**: Unix timestamp (giây hoặc milliseconds) hoặc chọn ngày/giờ

**Đầu ra**: Nhiều biểu diễn (Local time, UTC, ISO 8601, thứ trong tuần, giây/ms)

**Thuật toán**:
1. **Nhận dạng timestamp**: 10 chữ số = giây, 13 chữ số = milliseconds
2. **Cập nhật realtime**: Timestamp hiện tại cập nhật mỗi giây
3. **Tính ngược**: Từ Date → timestamp (hỗ trợ cả giây và ms)

**Công thức**:
```javascript
// Timestamp to Date
date = new Date(timestamp * 1000)  // nếu là giây
date = new Date(timestamp)          // nếu là ms

// Date to Timestamp
timestamp = Math.floor(date.getTime() / 1000)  // giây
timestamp = date.getTime()                       // ms
```

---

## 2. Developer Tools (Công cụ lập trình)

### 2.1 JSON Formatter

**Mô tả**: Format và validate dữ liệu JSON.

**Đầu vào**: Chuỗi JSON thô (minified hoặc không hợp lệ)

**Đầu ra**: JSON đã format với indent có thể tùy chỉnh + trạng thái hợp lệ

**Thuật toán**:
1. **Validate**: `JSON.parse()` - throw error nếu không hợp lệ
2. **Format**: `JSON.stringify(obj, null, indent)` - indent là 2/4 spaces hoặc tab
3. **Minify**: `JSON.stringify(obj)` - không có whitespace

**Tính năng**:
- 3 tùy chọn indent (2 spaces, 4 spaces, 1 tab)
- Load sample data
- Copy/Paste clipboard
- Hiển thị số ký tự và số dòng

---

### 2.2 XML Formatter

**Mô tả**: Format và validate dữ liệu XML.

**Đầu vào**: Chuỗi XML (minified, không format, hoặc không hợp lệ)

**Đầu ra**: XML đã format với indent phù hợp + validation

**Thuật toán**:
```
1. Tách dòng bằng regex: /(>)(<)(\/*)/g
2. Chuẩn hóa whitespace
3. Theo dõi indent level:
   - Giảm indent khi gặp closing tag (</tag>)
   - Tăng indent khi gặp opening tag (<tag>)
   - Nhận diện self-closing tag (<tag/>)
4. Validate bằng DOMParser
5. Minify: Xóa tất cả whitespace giữa các tags
```

**Xử lý chi tiết**:
```javascript
// Tách thành các dòng
xml = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3')

// Xử lý từng dòng
for (line of lines) {
  if (line.match(/^<\/\w/))      // Closing tag
    indent--
  else if (line.match(/^<\w[^>]*[^\/]>.*$/))  // Opening tag
    indent++
  // Self-closing tag: không thay đổi indent
}
```

---

### 2.3 SQL Formatter

**Mô tả**: Format câu truy vấn SQL.

**Đầu vào**: Câu SQL (một dòng hoặc đã format)

**Đầu ra**: SQL đã format với keywords trên dòng mới + indent

**Thuật toán**:
1. **Chuẩn hóa keyword**: Uppercase tất cả SQL keywords
2. **Chèn newline**: Thêm dòng mới trước các keywords cụ thể:
   - SELECT, FROM, WHERE, JOIN, ON, AND, OR, ORDER BY, GROUP BY, HAVING, LIMIT, OFFSET, INSERT, UPDATE, DELETE, SET, VALUES

3. **Quản lý indent**:
   - Tăng khi gặp `(` (trừ `()` rỗng)
   - Giảm khi gặp `)`
   - Theo dõi context chuỗi để tránh xử lý trong quoted strings

4. **Xử lý comment**:
   - Xóa `--` line comments
   - Xóa `/* */` block comments

5. **Minify**: Gộp nhiều khoảng trắng thành một

**Keywords được nhận diện**:
```
SELECT, FROM, WHERE, JOIN, LEFT JOIN, RIGHT JOIN, INNER JOIN,
OUTER JOIN, ON, AND, OR, ORDER BY, GROUP BY, HAVING, LIMIT,
OFFSET, UNION, INSERT, INTO, VALUES, UPDATE, SET, DELETE, CREATE,
ALTER, DROP, TABLE, INDEX, VIEW, AS, DISTINCT, COUNT, SUM, AVG,
MIN, MAX, CASE, WHEN, THEN, ELSE, END, NULL, NOT, IN, LIKE,
BETWEEN, EXISTS, IS
```

---

### 2.4 Regex Tester

**Mô tả**: Test và debug biểu thức chính quy (Regular Expression).

**Đầu vào**: Pattern regex + flags (g, i, m, s) + chuỗi test

**Đầu ra**: Tất cả matches với preview được highlight + bảng chi tiết matches

**Thuật toán**:
```javascript
// 1. Compile regex động
const regex = new RegExp(pattern, flags)

// 2. Tìm tất cả matches (với flag g)
const matches = []
let match
while ((match = regex.exec(testString)) !== null) {
  matches.push({
    match: match[0],
    index: match.index,
    groups: match.slice(1)  // Capture groups
  })
  if (!flags.includes('g')) break  // Tránh infinite loop
}

// 3. Highlight realtime: Build HTML với <mark> tags
let highlighted = testString
for (match of matches.reverse()) {  // Reverse để không ảnh hưởng index
  highlighted = highlighted.slice(0, match.index) +
    '<mark>' + match.match + '</mark>' +
    highlighted.slice(match.index + match.match.length)
}
```

**Templates có sẵn**:
| Pattern | Regex |
|---------|-------|
| Email | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` |
| URL | `https?://[^\s]+` |
| Phone | `\d{3}[-.]?\d{3}[-.]?\d{4}` |
| IP Address | `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}` |
| Date (YYYY-MM-DD) | `\d{4}-\d{2}-\d{2}` |
| UUID | `[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}` |
| Hex Color | `#[0-9a-fA-F]{6}` |

**Flags hỗ trợ**:
- `g` (global): Tìm tất cả matches
- `i` (case-insensitive): Không phân biệt hoa/thường
- `m` (multiline): `^` và `$` match đầu/cuối mỗi dòng
- `s` (dotAll): `.` match cả newline

---

### 2.5 Hash Generator

**Mô tả**: Tạo hash MD5, SHA-1, SHA-256 và các giá trị ngẫu nhiên.

**Đầu vào**: Text để hash + lựa chọn thuật toán

**Đầu ra**: Chuỗi hash + UUID v4 + chuỗi ngẫu nhiên 32 ký tự

**Thuật toán**:
```javascript
// 1. Hash sử dụng Web Crypto API
async function hash(text, algorithm) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 2. UUID v4
const uuid = crypto.randomUUID()

// 3. Random string
function randomString(length, charset) {
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, x => charset[x % charset.length]).join('')
}
```

**Thuật toán hash**:
| Algorithm | Output Length | Độ bảo mật |
|-----------|--------------|------------|
| SHA-1 | 40 hex chars | Thấp (đã bị crack) |
| SHA-256 | 64 hex chars | Cao |
| SHA-384 | 96 hex chars | Rất cao |
| SHA-512 | 128 hex chars | Rất cao |

**Lưu ý**: Sử dụng `crypto.subtle` đảm bảo tính bảo mật với random generation.

---

### 2.6 JWT Decoder

**Mô tả**: Decode và kiểm tra JWT tokens.

**Đầu vào**: Chuỗi JWT token (format: `header.payload.signature`)

**Đầu ra**: Header, Payload đã decode + signature + trạng thái hợp lệ

**Thuật toán**:
```javascript
// 1. Base64URL decode
function base64UrlDecode(str) {
  // Thay thế URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  // Thêm padding
  while (str.length % 4) str += '='
  return JSON.parse(atob(str))
}

// 2. Tách token
const [headerB64, payloadB64, signature] = token.split('.')

// 3. Decode
const header = base64UrlDecode(headerB64)
const payload = base64UrlDecode(payloadB64)

// 4. Kiểm tra hết hạn
const isExpired = payload.exp && (payload.exp * 1000 < Date.now())

// 5. Parse timestamps
const timestamps = {
  exp: new Date(payload.exp * 1000),   // Expiration
  iat: new Date(payload.iat * 1000),   // Issued At
  nbf: new Date(payload.nbf * 1000)    // Not Before
}
```

**Các trường thường gặp trong JWT**:
| Trường | Ý nghĩa |
|--------|---------|
| `alg` | Algorithm (HS256, RS256...) |
| `typ` | Type (JWT) |
| `iss` | Issuer |
| `sub` | Subject |
| `aud` | Audience |
| `exp` | Expiration time |
| `iat` | Issued at |
| `nbf` | Not before |

**Giới hạn**: Chỉ decode, không verify signature (cần secret key)

---

## 3. Language & Text (Ngôn ngữ & Văn bản)

### 3.1 Word Counter (Đếm từ)

**Mô tả**: Đếm từ, ký tự, câu, đoạn và thống kê tần suất từ.

**Đầu vào**: Văn bản thuần

**Đầu ra**: 8 thống kê + top 20 từ xuất hiện nhiều nhất

**Thuật toán**:
```javascript
// Số ký tự
const chars = text.length

// Số ký tự (không khoảng trắng)
const charsNoSpace = text.replace(/\s/g, '').length

// Số từ
const words = text.trim().split(/\s+/).filter(w => w.length > 0)
const wordCount = words.length

// Số câu
const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
const sentenceCount = sentences.length

// Số đoạn văn
const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
const paragraphCount = paragraphs.length

// Thời gian đọc (200 từ/phút)
const readingTime = Math.ceil(wordCount / 200)

// Thời gian nói (150 từ/phút)
const speakingTime = Math.ceil(wordCount / 150)

// Tần suất từ
const frequency = {}
words.forEach(word => {
  const normalized = word.toLowerCase().replace(/[^\w]/g, '')
  if (normalized) {
    frequency[normalized] = (frequency[normalized] || 0) + 1
  }
})
// Sắp xếp giảm dần và lấy top 20
const topWords = Object.entries(frequency)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
```

---

### 3.2 Vietnamese ↔ Katakana Converter

**Mô tả**: Chuyển đổi giữa tiếng Việt và chữ Katakana (Nhật).

**Đầu vào**: Văn bản tiếng Việt hoặc Katakana

**Đầu ra**: Văn bản đã chuyển đổi sang script đối lập

**Thuật toán Vietnamese → Katakana**:
```javascript
// Greedy matching - ưu tiên chuỗi dài hơn
function vietnameseToKatakana(text) {
  let result = ''
  let i = 0

  while (i < text.length) {
    let matched = false

    // Thử 3 ký tự trước (VD: "ngh" → "NG")
    if (i + 3 <= text.length) {
      const three = text.slice(i, i + 3).toLowerCase()
      if (mappings[three]) {
        result += mappings[three]
        i += 3
        matched = true
        continue
      }
    }

    // Thử 2 ký tự (VD: "ng", "ch", "tr")
    if (i + 2 <= text.length) {
      const two = text.slice(i, i + 2).toLowerCase()
      if (mappings[two]) {
        result += mappings[two]
        i += 2
        matched = true
        continue
      }
    }

    // Ký tự đơn
    const one = text[i].toLowerCase()
    result += mappings[one] || one
    i++
  }

  return result
}
```

**Bảng mapping chính**:
| Tiếng Việt | Katakana | Ghi chú |
|------------|----------|---------|
| a | ア | |
| ă | ア | Cùng âm |
| â | ア | Cùng âm |
| e | エ | |
| ê | エ | Cùng âm |
| i | イ | |
| o | オ | |
| ô | オ | Cùng âm |
| ơ | オ | Cùng âm |
| u | ウ | |
| ư | ウ | Cùng âm |
| ng | ン | N cuối |
| ch | チ | |
| tr | チ | Tương đương |
| kh | カ | |
| nh | ニャ | |
| space | ・ | Middle dot |

**Xử lý dấu thanh**: 6 thanh điệu tiếng Việt đều map về cùng một Katakana (mất thông tin thanh điệu)

**Giới hạn**: Chỉ là xấp xỉ phiên âm, không bảo toàn thanh điệu

---

### 3.3 Text Diff (So sánh văn bản)

**Mô tả**: So sánh hai đoạn văn bản và tìm sự khác biệt.

**Đầu vào**: Hai khối văn bản để so sánh

**Đầu ra**: Diff từng dòng với màu sắc (+ thêm, - xóa, không đổi)

**Thuật toán - Longest Common Subsequence (LCS)**:
```javascript
function computeLCS(lines1, lines2) {
  const m = lines1.length
  const n = lines2.length

  // 1. Xây dựng bảng DP
  // dp[i][j] = độ dài LCS của lines1[0..i-1] và lines2[0..j-1]
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i-1] === lines2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
      }
    }
  }

  // 2. Backtrack để tìm LCS
  const lcs = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    if (lines1[i-1] === lines2[j-1]) {
      lcs.unshift({ line: lines1[i-1], index1: i-1, index2: j-1 })
      i--; j--
    } else if (dp[i-1][j] > dp[i][j-1]) {
      i--
    } else {
      j--
    }
  }

  return lcs
}

// 3. Tạo diff từ LCS
function generateDiff(lines1, lines2, lcs) {
  const diff = []
  let i = 0, j = 0, lcsIndex = 0

  while (i < lines1.length || j < lines2.length) {
    if (lcsIndex < lcs.length &&
        i === lcs[lcsIndex].index1 &&
        j === lcs[lcsIndex].index2) {
      // Dòng không đổi
      diff.push({ type: 'unchanged', line: lines1[i] })
      i++; j++; lcsIndex++
    } else if (i < lines1.length &&
               (lcsIndex >= lcs.length || i < lcs[lcsIndex].index1)) {
      // Dòng bị xóa
      diff.push({ type: 'removed', line: lines1[i] })
      i++
    } else {
      // Dòng được thêm
      diff.push({ type: 'added', line: lines2[j] })
      j++
    }
  }

  return diff
}
```

**Độ phức tạp**: O(m × n) thời gian và không gian

**Hiển thị**:
- Màu xanh: Dòng được thêm (+)
- Màu đỏ: Dòng bị xóa (-)
- Không màu: Dòng không đổi

---

### 3.4 Text Normalizer (Chuẩn hóa văn bản)

**Mô tả**: Chuẩn hóa và làm sạch văn bản với nhiều tùy chọn.

**Đầu vào**: Văn bản cần chuẩn hóa

**Đầu ra**: Văn bản đã chuẩn hóa theo các tùy chọn được chọn

**Các thuật toán chuẩn hóa** (theo thứ tự áp dụng):

| Tùy chọn | Regex/Method | Mô tả |
|----------|--------------|-------|
| Xóa HTML tags | `/<[^>]*>/g` | Xóa tất cả thẻ HTML |
| Xóa URLs | `/https?:\/\/[^\s]+/g` | Xóa các đường link |
| Xóa Emails | `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g` | Xóa địa chỉ email |
| Xóa Emojis | Unicode ranges với flag `u` | Xóa emoji |
| Xóa dấu | NFD + `/[\u0300-\u036f]/g` | Bỏ dấu tiếng Việt |
| Xóa số | `/[0-9]/g` | Xóa chữ số |
| Xóa dấu câu | `/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g` | Xóa punctuation |
| Xóa ký tự đặc biệt | Giữ alphanumeric + Latin extended | |
| Xóa xuống dòng | `/[\r\n]+/g` | Xóa line breaks |
| Gộp xuống dòng | `/[\r\n]{3,}/g` → `\n\n` | Giữ tối đa 1 dòng trống |
| Trim dòng | Split + trim + join | Xóa whitespace đầu/cuối mỗi dòng |
| Gộp khoảng trắng | `/[ \t]+/g` → ` ` | Nhiều space → 1 space |
| Chuyển lowercase | `toLowerCase()` | |
| Chuyển UPPERCASE | `toUpperCase()` | |

**Xóa dấu tiếng Việt chi tiết**:
```javascript
function removeAccents(text) {
  // NFD: phân tách ký tự có dấu thành base + combining character
  // VD: "ă" → "a" + "̆" (combining breve)
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Xóa combining diacritical marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}
```

**Xóa Emoji - Unicode ranges**:
```javascript
const emojiRegex = /[\u{1F600}-\u{1F64F}]|  // Emoticons
                   [\u{1F300}-\u{1F5FF}]|   // Symbols & Pictographs
                   [\u{1F680}-\u{1F6FF}]|   // Transport & Map
                   [\u{1F700}-\u{1F77F}]|   // Alchemical Symbols
                   [\u{1F780}-\u{1F7FF}]|   // Geometric Shapes Extended
                   [\u{1F800}-\u{1F8FF}]|   // Supplemental Arrows-C
                   [\u{1F900}-\u{1F9FF}]|   // Supplemental Symbols
                   [\u{1FA00}-\u{1FA6F}]|   // Chess Symbols
                   [\u{2600}-\u{26FF}]|     // Misc symbols
                   [\u{2700}-\u{27BF}]/gu   // Dingbats
```

---

## 4. Finance Tools (Công cụ tài chính)

### 4.1 Vietnam Salary Calculator (Tính lương Việt Nam)

**Mô tả**: Tính lương Gross → Net và ngược lại theo quy định Việt Nam.

**Đầu vào**: Lương Gross HOẶC lương Net mong muốn + số người phụ thuộc

**Đầu ra**: Bảng chi tiết các khoản khấu trừ và chi phí người sử dụng lao động

**Hằng số (Luật thuế 2024)**:
```javascript
const CONSTANTS = {
  // Mức lương đóng BHXH tối đa
  SOCIAL_INSURANCE_CAP: 46_800_000,      // 46.8 triệu
  UNEMPLOYMENT_INSURANCE_CAP: 93_600_000, // 93.6 triệu

  // Tỷ lệ đóng BHXH (người lao động)
  EMPLOYEE_SOCIAL_INSURANCE: 0.08,    // 8%
  EMPLOYEE_HEALTH_INSURANCE: 0.015,   // 1.5%
  EMPLOYEE_UNEMPLOYMENT: 0.01,        // 1%

  // Tỷ lệ đóng BHXH (người sử dụng lao động)
  EMPLOYER_SOCIAL_INSURANCE: 0.175,   // 17.5%
  EMPLOYER_HEALTH_INSURANCE: 0.03,    // 3%
  EMPLOYER_UNEMPLOYMENT: 0.01,        // 1%

  // Giảm trừ
  PERSONAL_DEDUCTION: 11_000_000,     // 11 triệu/tháng
  DEPENDENT_DEDUCTION: 4_400_000,     // 4.4 triệu/người phụ thuộc

  // Thuế TNCN lũy tiến
  TAX_BRACKETS: [
    { threshold: 5_000_000, rate: 0.05 },
    { threshold: 10_000_000, rate: 0.10 },
    { threshold: 18_000_000, rate: 0.15 },
    { threshold: 32_000_000, rate: 0.20 },
    { threshold: 52_000_000, rate: 0.25 },
    { threshold: 80_000_000, rate: 0.30 },
    { threshold: Infinity, rate: 0.35 }
  ]
}
```

**Thuật toán Gross → Net**:
```javascript
function calculateNet(gross, dependents) {
  // 1. Tính BHXH (có cap)
  const insuranceBase = Math.min(gross, SOCIAL_INSURANCE_CAP)
  const unemploymentBase = Math.min(gross, UNEMPLOYMENT_INSURANCE_CAP)

  const socialInsurance = insuranceBase * 0.08
  const healthInsurance = insuranceBase * 0.015
  const unemployment = unemploymentBase * 0.01
  const totalInsurance = socialInsurance + healthInsurance + unemployment

  // 2. Tính thu nhập chịu thuế
  const personalDeduction = 11_000_000
  const dependentDeduction = dependents * 4_400_000
  const taxableIncome = Math.max(0,
    gross - totalInsurance - personalDeduction - dependentDeduction
  )

  // 3. Tính thuế TNCN lũy tiến
  let tax = 0
  let remaining = taxableIncome
  let prevThreshold = 0

  for (const bracket of TAX_BRACKETS) {
    const taxableInBracket = Math.min(
      remaining,
      bracket.threshold - prevThreshold
    )
    if (taxableInBracket <= 0) break

    tax += taxableInBracket * bracket.rate
    remaining -= taxableInBracket
    prevThreshold = bracket.threshold
  }

  // 4. Tính Net
  const net = gross - totalInsurance - tax

  return { net, tax, totalInsurance, taxableIncome }
}
```

**Thuật toán Net → Gross (Binary Search)**:
```javascript
function calculateGross(targetNet, dependents) {
  // Binary search để tìm Gross khớp với Net mong muốn
  let low = targetNet
  let high = targetNet * 2

  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2)
    const { net } = calculateNet(mid, dependents)

    if (net < targetNet) {
      low = mid
    } else {
      high = mid
    }
  }

  return high  // Gross tìm được
}
```

**Bậc thuế TNCN chi tiết**:
| Bậc | Thu nhập tính thuế/tháng | Thuế suất |
|-----|-------------------------|-----------|
| 1 | Đến 5 triệu | 5% |
| 2 | 5 - 10 triệu | 10% |
| 3 | 10 - 18 triệu | 15% |
| 4 | 18 - 32 triệu | 20% |
| 5 | 32 - 52 triệu | 25% |
| 6 | 52 - 80 triệu | 30% |
| 7 | Trên 80 triệu | 35% |

---

### 4.2 VAT Calculator (Tính VAT)

**Mô tả**: Tính thuế VAT cho Việt Nam.

**Đầu vào**: Giá (trước hoặc sau VAT) + thuế suất VAT

**Đầu ra**: Giá trước VAT, số tiền VAT, giá sau VAT

**Thuật toán**:
```javascript
// Chế độ "Thêm VAT" (từ giá chưa VAT)
function addVAT(price, rate) {
  const vatAmount = price * rate
  const totalWithVAT = price + vatAmount
  return { priceBeforeVAT: price, vatAmount, totalWithVAT }
}

// Chế độ "Tách VAT" (từ giá đã có VAT)
function removeVAT(priceWithVAT, rate) {
  const priceBeforeVAT = priceWithVAT / (1 + rate)
  const vatAmount = priceWithVAT - priceBeforeVAT
  return { priceBeforeVAT, vatAmount, totalWithVAT: priceWithVAT }
}
```

**Các mức thuế suất VAT Việt Nam 2024**:
| Thuế suất | Áp dụng cho |
|-----------|------------|
| 0% | Hàng xuất khẩu |
| 5% | Hàng thiết yếu (thực phẩm, sách...) |
| 8% | Mức ưu đãi (đến 31/12/2024) |
| 10% | Mức thông thường |

**Format tiền tệ**: VND, không có chữ số thập phân

---

### 4.3 Currency Converter (Chuyển đổi tiền tệ)

**Mô tả**: Chuyển đổi giữa các loại tiền tệ.

**Đầu vào**: Số tiền + tiền tệ nguồn + tiền tệ đích

**Đầu ra**: Số tiền đã chuyển đổi + tỷ giá + bảng chuyển đổi nhanh

**Thuật toán**:
```javascript
// Tất cả tỷ giá lưu theo USD (pivot currency)
const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  VND: 24500,
  JPY: 149.50,
  // ... các tiền tệ khác
}

function convert(amount, fromCurrency, toCurrency) {
  // Chuyển về USD trước, rồi chuyển sang tiền đích
  const amountInUSD = amount / exchangeRates[fromCurrency]
  const result = amountInUSD * exchangeRates[toCurrency]
  return result
}

// Tính tỷ giá trực tiếp A → B
function getExchangeRate(from, to) {
  return exchangeRates[to] / exchangeRates[from]
}
```

**Các tiền tệ hỗ trợ**: 20 loại (USD, EUR, GBP, JPY, VND, CNY, KRW, THB, SGD, ...)

**Xử lý số thập phân**:
```javascript
function formatCurrency(value, currency) {
  // Không có số thập phân cho JPY, KRW, VND, IDR
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR']
  const decimals = noDecimalCurrencies.includes(currency) ? 0 : 2

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}
```

**Lưu ý**: Tỷ giá được hardcode (tháng 12/2024), không real-time

---

## 5. Data Tools (Công cụ dữ liệu)

### 5.1 Pivot Table

**Mô tả**: Tạo bảng pivot từ file CSV/Excel.

**Đầu vào**: File CSV hoặc Excel (.csv, .xlsx, .xls)

**Đầu ra**: Bảng pivot có thể cấu hình với drag-and-drop

**Quy trình xử lý**:
```
1. Upload file
2. Parse file (CSV bằng PapaParse, Excel bằng xlsx)
3. Detect column types (string, number, date, boolean)
4. Auto-configure:
   - Numeric columns → Metrics (tính toán)
   - String columns → Group by (nhóm)
5. User configure qua drag-drop
6. Render pivot table với virtualization
```

**Các phép tính aggregation**:
| Phép tính | Công thức |
|-----------|----------|
| Sum | `values.reduce((a, b) => a + b, 0)` |
| Count | `values.length` |
| Average | `sum / count` |
| Min | `Math.min(...values)` |
| Max | `Math.max(...values)` |

**Detect column types**:
```javascript
function detectColumnType(values) {
  const sample = values.slice(0, 100)

  // Thử parse số
  if (sample.every(v => !isNaN(parseFloat(v)))) {
    return 'number'
  }

  // Thử parse date
  if (sample.every(v => !isNaN(Date.parse(v)))) {
    return 'date'
  }

  // Thử boolean
  if (sample.every(v => ['true', 'false', '1', '0'].includes(v.toLowerCase()))) {
    return 'boolean'
  }

  return 'string'
}
```

**Thư viện sử dụng**:
- `papaparse`: Parse CSV
- `xlsx`: Parse Excel
- `@tanstack/react-virtual`: Virtualized rendering cho dataset lớn
- `@dnd-kit`: Drag and drop configuration

**Virtualization**: Chỉ render các rows visible trên viewport, giúp handle hàng triệu rows

---

## Patterns chung trong codebase

### State Management
- Sử dụng React hooks: `useState`, `useEffect`, `useMemo`, `useRef`
- Computation realtime trong `useEffect` với dependency tracking

### Validation Patterns
```javascript
// Parse số với fallback
const num = parseFloat(value.replace(/,/g, ''))
if (isNaN(num)) return

// Trim whitespace
const cleaned = text.trim()
if (!cleaned) return
```

### Copy to Clipboard
```javascript
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text)
  setIsCopied(true)
  setTimeout(() => setIsCopied(false), 2000)
}
```

### UI Components
- Tất cả sử dụng shadcn/ui (Radix UI + Tailwind)
- Icons từ `lucide-react`
- Format tiền tệ với `Intl.NumberFormat`

---

## Kết luận

Các tool trong dự án được thiết kế với các nguyên tắc:

1. **Client-side processing**: Tất cả xử lý trên browser, không cần server
2. **Privacy-first**: Dữ liệu không được gửi đi đâu
3. **Real-time feedback**: Kết quả cập nhật ngay khi nhập
4. **Accessibility**: Hỗ trợ reduced-motion, ARIA labels
5. **Internationalization**: Sẵn sàng cho đa ngôn ngữ với next-intl

Mỗi tool được tách thành:
- `page.tsx`: Server component với metadata SEO
- `_client.tsx`: Client component chứa logic và UI
