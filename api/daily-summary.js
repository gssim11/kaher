// 대한건강운동재활협회 · 진위확인 일일 요약 메일 (Vercel Cron + Resend)
// 매일 1회 자동 실행되어 전날(한국시간) 진위확인 조회 요약을 이메일로 보냅니다.
// 필요한 환경변수(Vercel > Settings > Environment Variables):
//   - RESEND_API_KEY : Resend 대시보드의 API 키
//   - CRON_SECRET    : 아무 임의 문자열(무단 호출 방지용)
//   - RECIPIENT_EMAIL(선택) : 받는 주소. 미설정 시 jjangdal@naver.com

const SUPABASE_URL = "https://ribzwzkejsdvkrpbyppc.supabase.co";
const SUPABASE_ANON = "sb_publishable_ZTzC775HUWiTqB5VX2Th0w_b82IaNQf";

module.exports = async (req, res) => {
  // 무단 호출 방지: CRON_SECRET 설정 시 Vercel Cron 요청만 허용
  if (process.env.CRON_SECRET && req.headers.authorization !== "Bearer " + process.env.CRON_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const RECIPIENT = process.env.RECIPIENT_EMAIL || "jjangdal@naver.com";
  try {
    // 전날(한국시간 KST) 날짜 계산
    const kst = new Date(Date.now() + 9 * 3600 * 1000);
    kst.setUTCDate(kst.getUTCDate() - 1);
    const day = kst.toISOString().slice(0, 10);

    // Supabase 집계 함수 호출(개인정보 없음, 숫자만)
    const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/verify_daily_summary", {
      method: "POST",
      headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON, "Content-Type": "application/json" },
      body: JSON.stringify({ day })
    });
    const data = await r.json();
    const s = Array.isArray(data) ? (data[0] || {}) : (data || {});
    const total = Number(s.total || 0), found = Number(s.found || 0), notFound = Number(s.not_found || 0);

    const warn = notFound > 0
      ? '<p style="margin:14px 0;padding:12px 14px;background:#fdeceb;border:1px solid #f1b6ae;border-radius:8px;color:#922b21;"><b>⚠ 위조의심(미등록 번호) 조회 ' + notFound + '건</b> — 발급 기록에 없는 번호로 조회가 있었습니다.</p>'
      : '<p style="margin:14px 0;color:#1f8a4c;">✅ 위조의심 조회 없음</p>';

    const html =
      '<div style="font-family:Apple SD Gothic Neo,Malgun Gothic,sans-serif;max-width:520px;margin:auto;color:#1c2430;">' +
      '<div style="background:#16385c;color:#fff;padding:18px 20px;border-radius:10px 10px 0 0;">' +
      '<h2 style="margin:0;font-size:17px;">대한건강운동재활협회</h2>' +
      '<div style="font-size:12px;opacity:.85;">자격증 진위확인 · 일일 요약</div></div>' +
      '<div style="border:1px solid #dde3ec;border-top:none;border-radius:0 0 10px 10px;padding:20px;">' +
      '<p style="margin:0 0 10px;color:#667;">대상일자: <b>' + day + '</b> (한국시간 기준)</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:15px;">' +
      '<tr><td style="padding:8px 0;color:#667;">총 진위확인 조회</td><td style="text-align:right;font-weight:bold;">' + total + ' 건</td></tr>' +
      '<tr><td style="padding:8px 0;color:#667;">정상(발급 확인)</td><td style="text-align:right;font-weight:bold;color:#1f8a4c;">' + found + ' 건</td></tr>' +
      '<tr><td style="padding:8px 0;color:#667;">미등록(위조의심)</td><td style="text-align:right;font-weight:bold;color:#c0392b;">' + notFound + ' 건</td></tr>' +
      '</table>' + warn +
      '<p style="font-size:12px;color:#8a94a3;margin-top:16px;">본 메일은 자동 발송되었습니다. 상세 내역은 발급관리 시스템에서 확인하실 수 있습니다.</p>' +
      '</div></div>';

    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "대한건강운동재활협회 <onboarding@resend.dev>",
        to: [RECIPIENT],
        subject: "[KAHER] 자격증 진위확인 일일요약 (" + day + ")",
        html
      })
    });
    const eb = await er.json();
    return res.status(200).json({ ok: true, day, total, found, notFound, email: eb });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
};
