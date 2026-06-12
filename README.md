# 대한건강운동재활협회 공식 홈페이지

Korea Association of Health & Exercise Rehabilitation (K.A.H.E.R)

순수 HTML/CSS/JS 정적 사이트입니다. **일방향 정보 제공(공시·홍보)** 목적으로 설계되어
서버, 데이터베이스, 회원 기능이 없으며 GitHub + Vercel로 바로 배포됩니다.

---

## 1. 폴더 구성

```
├── index.html          메인
├── about.html          협회소개 (소개 / 인사말 / 조직도·임원 명부)
├── certificates.html   자격과정 (공인 자격 4종 상세)
├── rules.html          협회규정 (정관 전문 / 교육강사부장 운영규정 전문)
├── notice.html         공지사항 (공시형, 펼침 목록)
├── css/style.css       디자인 (:root 변수에서 색상 변경)
├── js/data.js          ★ 내용 수정은 대부분 이 파일 ★
├── js/main.js          렌더링 스크립트 (수정 불필요)
├── assets/             로고·직인 이미지
├── robots.txt / sitemap.xml
```

## 2. 내용 수정 (js/data.js)

| 바꾸고 싶은 것 | 수정 위치 |
|---|---|
| 임원 명부 (회장/이사·감사/자문위원/교육강사부장) | `CHAIRMAN`, `DIRECTORS`, `ADVISORS`, `INSTRUCTORS` |
| 명부 기준일 | `ORG_DATE` |
| 자격과정 4종 내용 | `CERTS` |
| 공지사항 | `NOTICES` 맨 위에 추가 |
| 연락처·주소 | `SITE` |
| 메인 "협회가 하는 일" | `BUSINESS` |
| 자격 구분 배지 | `CERTS`의 `reg` ("registered"=등록 민간자격, "association"=협회 인증) |
| 자격증 견본 이미지 | `assets/certs/` 폴더 + `CERTS`의 `image` 경로 |

새 공지 예시 — `NOTICES` 맨 위에:
```js
{ date: "2026-09-01", title: "공지 제목", body: "공지 내용 문단." },
```

저작권 연도는 자동 갱신됩니다(설립연도–현재연도). 정관·운영규정 본문을 고칠 일이 있으면
`rules.html` 에서 직접 수정합니다.

GitHub 웹에서 직접 수정: 저장소 → `js/data.js` → 연필 아이콘 → 수정 → **Commit changes**
→ 약 1분 내 Vercel 자동 반영.

## 3. 배포

```bash
cd kaher-site
git init && git add . && git commit -m "협회 홈페이지"
git branch -M main
git remote add origin https://github.com/<계정명>/kaher-site.git
git push -u origin main
```

Vercel: https://vercel.com → Add New → Project → 저장소 Import →
Framework **Other**, 기본값 그대로 → Deploy.

### ⚠️ 배포 직후 1회 작업: 도메인 치환

SEO 태그(canonical/OG)와 sitemap에 임시 주소 `https://kaher-site.vercel.app` 가 들어 있습니다.
실제 발급된 주소(또는 협회 도메인)로 한 번에 치환하세요:

- VS Code: 전체 검색(Ctrl+Shift+F)으로 `kaher-site.vercel.app` → 실제 도메인 바꾸기
- 대상 파일: html 5개, robots.txt, sitemap.xml

## 4. 설계 원칙 (유지 시 참고)

- 게시판·신청 폼·로그인 등 **양방향 기능은 의도적으로 없음** — 오해 방지를 위해 추가하지 말 것
- 자격과정 안내에는 "의료행위·진단·치료를 표방하지 않음" 문구를 유지할 것 (법적 과장 방지)
- 공지는 시간이 지나도 유효한 공시 위주로 작성
- 자격증 견본 이미지는 개인정보(생년월일)를 블러 처리하고 SAMPLE 워터마크를 넣은 가공본만 게시할 것 (원본 업로드 금지)
- MPI만 등록 민간자격이며, 나머지 3종은 협회 인증 자격 — 표기를 섞지 말 것
