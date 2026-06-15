/* =====================================================================
   대한건강운동재활협회 — 렌더링 스크립트
   js/data.js 의 내용을 읽어 각 페이지에 자동으로 표시합니다.
   (이 파일은 직접 수정할 필요가 없습니다)
   ===================================================================== */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* ---------- 모바일 내비게이션 (+ 배경 오버레이) ---------- */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    backdrop.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  backdrop.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();

/* ---------- 푸터/문의 공통 정보 ---------- */
(function () {
  if (typeof SITE === "undefined") return;
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.getAttribute("data-site");
    if (SITE[key] != null) el.textContent = SITE[key];
  });
  document.querySelectorAll("[data-site-mailto]").forEach((a) => {
    a.href = "mailto:" + SITE.email; a.textContent = SITE.email;
  });
  document.querySelectorAll("[data-site-tel]").forEach((a) => {
    a.href = "tel:" + SITE.phone.replace(/-/g, ""); a.textContent = SITE.phone;
  });
  // 카카오톡 채널 링크 연결 (data.js 의 SITE.kakaoChannel)
  document.querySelectorAll("[data-site-kakao]").forEach((a) => {
    if (SITE.kakaoChannel) a.href = SITE.kakaoChannel;
  });

  // 저작권 연도 자동 갱신 (설립연도–현재연도)
  document.querySelectorAll("[data-copyright]").forEach((el) => {
    const now = new Date().getFullYear();
    const from = SITE.establishedYear;
    el.textContent = String(from) === String(now) ? String(now) : from + "–" + now;
  });
})();

/* ---------- 조직도 (about.html) ---------- */
(function () {
  const chairEl = document.getElementById("org-chairman");
  if (!chairEl) return;

  if (typeof CHAIRMAN !== "undefined") {
    chairEl.innerHTML =
      '<div class="role">' + esc(CHAIRMAN.role) + "</div>" +
      '<div class="name">' + esc(CHAIRMAN.name) + "</div>" +
      (CHAIRMAN.title ? '<div class="title">' + esc(CHAIRMAN.title) + "</div>" : "");
  }
  const dateEl = document.getElementById("org-date");
  if (dateEl && typeof ORG_DATE !== "undefined") dateEl.textContent = ORG_DATE + " 기준";

  const card = (p, cls) =>
    '<li class="org-card">' +
    '<div class="role' + (cls ? " " + cls : "") + '">' + esc(p.role) + "</div>" +
    '<div class="name">' + esc(p.name) + "</div>" +
    '<div class="title">' + esc(p.title) + "</div></li>";

  const fill = (id, list, cls) => {
    const el = document.getElementById(id);
    if (el && list) el.innerHTML = list.map((p) => card(p, p.role === "감사" ? "green" : cls)).join("");
  };
  fill("org-directors", typeof DIRECTORS !== "undefined" ? DIRECTORS : null, "");
  fill("org-advisors", typeof ADVISORS !== "undefined" ? ADVISORS : null, "");
  fill("org-instructors", typeof INSTRUCTORS !== "undefined" ? INSTRUCTORS : null, "");
})();


function regBadge(c) {
  if (c.reg === "registered")
    return '<span class="cert-badge reg">등록 민간자격</span>';
  return '<span class="cert-badge assoc">협회 인증 자격</span>';
}

/* ---------- 자격과정 ---------- */
(function () {
  // 메인 화면: 요약 카드
  const featEl = document.getElementById("featured-certs");
  if (featEl && typeof CERTS !== "undefined") {
    featEl.innerHTML = CERTS.map((c) =>
      '<a class="course-card has-thumb" href="certificates.html#' + esc(c.abbr.toLowerCase()) + '">' +
      (c.image ? '<img class="c-thumb" src="' + esc(c.image) + '" alt="' + esc(c.nameKo) + ' 자격증 견본" loading="lazy" />' : "") +
      '<span class="c-abbr">' + esc(c.abbr) + "</span> " + regBadge(c) +
      "<h3>" + esc(c.nameKo) + "</h3>" +
      '<p class="c-en">' + esc(c.nameEn) + "</p>" +
      "<p>" + esc(c.tagline) + "</p>" +
      '<span class="arrow">자세히 보기 →</span></a>'
    ).join("");
  }
  // 자격과정 페이지: 상세 블록
  const listEl = document.getElementById("cert-list");
  if (listEl && typeof CERTS !== "undefined") {
    listEl.innerHTML = CERTS.map((c, i) =>
      '<article class="cert" id="' + esc(c.abbr.toLowerCase()) + '">' +
      '<header class="cert-head">' +
      '<span class="c-abbr">' + esc(c.abbr) + "</span> " + regBadge(c) +
      "<h2>" + esc(c.nameKo) + '<span class="cert-tag">' + esc(c.tagline) + "</span></h2>" +
      '<p class="c-en">' + esc(c.nameEn) + "</p>" +
      "</header>" +
      '<div class="cert-body">' +
      (c.image
        ? '<figure class="cert-figure"><a href="' + esc(c.image) + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(c.image) + '" alt="' + esc(c.nameKo) + ' 자격증 견본" loading="lazy" /></a>' +
          "<figcaption>자격증 견본 (클릭 시 확대)</figcaption></figure>"
        : "") +
      '<div class="cert-main">' +
      '<p class="cert-summary">' + esc(c.summary) + "</p>" +
      '<div class="cert-cols">' +
      '<div><h3>교육 주요 내용</h3><ul class="cert-contents">' +
      c.contents.map((x) => "<li>" + esc(x) + "</li>").join("") +
      "</ul></div>" +
      '<div><h3>활용 분야</h3><p class="cert-fields">' + esc(c.fields) + "</p></div>" +
      "</div>" +
      (c.disclaimer
        ? '<p class="cert-note">※ 본 과정은 의료행위를 목적으로 하지 않으며, 운동지도 및 기능적 움직임 교육을 목적으로 합니다.</p>'
        : "") +
      "</div></div></article>"
    ).join("");
  }
})();

/* ---------- 공지사항 ---------- */
(function () {
  // 메인: 최신 3건 (제목만)
  const latestEl = document.getElementById("latest-notices");
  if (latestEl && typeof NOTICES !== "undefined") {
    latestEl.innerHTML = NOTICES.slice(0, 3).map((n) =>
      '<li><a href="notice.html"><span class="n-title">' + esc(n.title) +
      '</span><span class="n-date">' + esc(n.date) + "</span></a></li>"
    ).join("");
  }
  // 공지 페이지: 펼쳐 볼 수 있는 전체 목록
  const allEl = document.getElementById("all-notices");
  if (allEl && typeof NOTICES !== "undefined") {
    allEl.innerHTML = NOTICES.map((n, i) =>
      '<details class="notice-item"' + (i === 0 ? " open" : "") + ">" +
      '<summary><span class="n-title">' + esc(n.title) +
      '</span><span class="n-date">' + esc(n.date) + "</span></summary>" +
      (n.body ? '<div class="n-body">' + esc(n.body) + "</div>" : "") +
      "</details>"
    ).join("");
  }
})();

/* ---------- 핵심 사업 (메인) ---------- */
(function () {
  const el = document.getElementById("biz-grid");
  if (!el || typeof BUSINESS === "undefined") return;
  el.innerHTML = BUSINESS.map((b) =>
    '<div class="biz-card"><h3>' + esc(b.title) + "</h3><p>" + esc(b.desc) + "</p></div>"
  ).join("");
})();
