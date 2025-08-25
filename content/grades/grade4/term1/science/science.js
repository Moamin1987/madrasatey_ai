// auto.js - ملف عام يعرض الدروس/الألعاب تلقائيًا لكل مادة من GitHub

const GITHUB_USER = "Moamin1987";
const GITHUB_REPO = "madrasatey_ai";
const BRANCH = "main";

// استنتاج مسار المجلد الحالي من الـ URL
const pathParts = window.location.pathname.split("/").filter(Boolean);
const currentSubjectPath = pathParts.slice(pathParts.indexOf("content")).join("/");

// عنصر العرض في الصفحة
const container = document.getElementById("lessonsContainer");

// جلب قائمة الملفات من GitHub API
async function fetchFiles() {
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${currentSubjectPath}?ref=${BRANCH}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    container.innerHTML = "<p>تعذر تحميل المحتوى.</p>";
    return [];
  }
  return await response.json();
}

// تصنيف الملفات إلى دروس أو ألعاب
function classifyFiles(files) {
  const lessons = [];
  const games = [];
  files.forEach(file => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "html") {
      games.push({
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: file.download_url,
        type: "html"
      });
    } else {
      lessons.push({
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: file.download_url,
        type: ext
      });
    }
  });
  return { lessons, games };
}

// عرض الدروس
function displayLessons(lessons) {
  if (lessons.length === 0) return "";
  return `
    <h3>دروس ومذكرات</h3>
    ${lessons
      .map(
        lesson => `
      <div class="lesson-item">
        <div class="lesson-info">
          <h4>${lesson.title}</h4>
          <div class="lesson-meta"><span>${lesson.type.toUpperCase()}</span></div>
        </div>
        <div class="lesson-actions">
          <button class="action-btn" onclick="window.open('${lesson.url}','_blank')">تحميل</button>
        </div>
      </div>`
      )
      .join("")}
  `;
}

// عرض الألعاب
function displayGames(games) {
  if (games.length === 0) return "";
  return `
    <h3>ذاكر والعب</h3>
    ${games
      .map(
        game => `
      <div class="lesson-item">
        <div class="lesson-info">
          <h4>${game.title}</h4>
          <div class="lesson-meta"><span>تفاعلي</span></div>
        </div>
        <div class="lesson-actions">
          <button class="action-btn game" onclick="window.open('${game.url}','_blank')">ابدأ</button>
        </div>
      </div>`
      )
      .join("")}
  `;
}

// تحميل المحتوى
async function loadContent() {
  container.innerHTML = "<p>جارِ التحميل...</p>";
  const files = await fetchFiles();
  const { lessons, games } = classifyFiles(files);
  container.innerHTML = displayLessons(lessons) + displayGames(games);
}

loadContent();
