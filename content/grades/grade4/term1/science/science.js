// debug_auto.js - نسخة تشخيصية من auto.js
const GITHUB_USER = "Moamin1987";
const GITHUB_REPO = "madrasatey_ai";
const BRANCH = "main";

function logAndShow(msg, isError = false) {
  console[isError ? "error" : "log"]("[debug_auto] " + msg);
  const container = document.getElementById("lessonsContainer");
  if (container) {
    const el = document.createElement("div");
    el.style.border = isError ? "1px solid #e44" : "1px solid #4a4";
    el.style.padding = "8px";
    el.style.margin = "8px 0";
    el.style.background = isError ? "#fee" : "#efe";
    el.textContent = "[debug_auto] " + msg;
    container.prepend(el);
  }
}

function detectSubjectPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  logAndShow("pathParts: " + JSON.stringify(parts));
  // 1) if 'content' present, use from there
  const contentIdx = parts.indexOf("content");
  if (contentIdx !== -1) {
    const p = parts.slice(contentIdx).join("/");
    logAndShow("Detected subject path from 'content': " + p);
    return p;
  }
  // 2) if repo name present, try after repo
  const repoIdx = parts.indexOf(GITHUB_REPO);
  if (repoIdx !== -1 && parts.length > repoIdx + 1) {
    const maybe = parts.slice(repoIdx + 1).join("/");
    logAndShow("Tried path after repo: " + maybe);
    if (maybe.startsWith("content")) return maybe;
    // if not start with content, still might be correct if site served from repo root
    return maybe;
  }
  // 3) fallback: use last 4 segments (common structure: content/grades/gradeX/termY/subject)
  if (parts.length >= 4) {
    const fallback = parts.slice(-4).join("/");
    logAndShow("Fallback subject path (last 4 segments): " + fallback);
    return fallback;
  }
  logAndShow("لم أتمكن من تحديد مسار المادة تلقائياً.", true);
  return null;
}

async function fetchFiles(subjectPath) {
  if (!subjectPath) throw new Error("subjectPath is null");
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${subjectPath}?ref=${BRANCH}`;
  logAndShow("API URL: " + apiUrl);
  const res = await fetch(apiUrl);
  logAndShow("API response status: " + res.status);
  if (res.status === 403) {
    const text = await res.text();
    logAndShow("403 Forbidden — احتمال تجاوز limit أو حاجة خاصة: " + text.slice(0,200), true);
    throw new Error("403 Forbidden from GitHub API (rate limit or access).");
  }
  if (res.status === 404) {
    logAndShow("404 — المجلد غير موجود عند المسار. تحقق من المسار/حالة الفرع أو اسم المجلد.", true);
    throw new Error("404 Not Found");
  }
  if (!res.ok) {
    const txt = await res.text();
    logAndShow("خطأ في استدعاء API: " + res.status + " " + txt.slice(0,200), true);
    throw new Error("GitHub API error " + res.status);
  }
  const data = await res.json();
  logAndShow("تم استلام " + data.length + " عنصر من GitHub API.");
  return data;
}

function classifyAndRender(files) {
  const container = document.getElementById("lessonsContainer");
  if (!container) {
    logAndShow("العنصر #lessonsContainer غير موجود في الصفحة!", true);
    return;
  }
  container.innerHTML = ""; // إفراغ
  const lessons = [];
  const games = [];
  files.forEach(f => {
    if (f.type === "dir") return; // نتجاهل المجلدات
    const ext = f.name.split(".").pop().toLowerCase();
    const title = f.name.replace(/\.[^/.]+$/, "");
    if (ext === "html") {
      games.push({title, url: f.download_url, ext});
    } else {
      lessons.push({title, url: f.download_url, ext});
    }
  });

  if (lessons.length === 0 && games.length === 0) {
    logAndShow("لا توجد ملفات قابلة للعرض داخل المجلد.", true);
    container.innerHTML = "<p>لا توجد محتويات حالياً.</p>";
    return;
  }

  if (lessons.length) {
    const h = document.createElement("h3"); h.textContent = "دروس ومذكرات"; container.appendChild(h);
    lessons.forEach(l => {
      const div = document.createElement("div"); div.className = "lesson-item";
      div.innerHTML = `<div class="lesson-info"><h4>${l.title}</h4><div class="lesson-meta">${l.ext.toUpperCase()}</div></div>
        <div class="lesson-actions"><button onclick="window.open('${l.url}','_blank')">تحميل</button></div>`;
      container.appendChild(div);
    });
  }

  if (games.length) {
    const h = document.createElement("h3"); h.textContent = "ذاكر والعب"; container.appendChild(h);
    games.forEach(g => {
      const div = document.createElement("div"); div.className = "lesson-item";
      div.innerHTML = `<div class="lesson-info"><h4>${g.title}</h4><div class="lesson-meta">تفاعلي</div></div>
        <div class="lesson-actions"><button onclick="window.open('${g.url}','_blank')">ابدأ</button></div>`;
      container.appendChild(div);
    });
  }
}

async function runDebug() {
  try {
    logAndShow("debug_auto بدأ...");
    const subjectPath = detectSubjectPath();
    if (!subjectPath) return;
    const files = await fetchFiles(subjectPath);
    classifyAndRender(files);
  } catch (err) {
    logAndShow("Exception: " + err.message, true);
    console.error(err);
  }
}

// شغّل
runDebug();
