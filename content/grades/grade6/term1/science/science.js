const items = [
  { title: "الدرس الأول", description: "", type: "pdf", url: "الدرس الأول.pdf" },
  { title: "الدرس الثاني", description: "", type: "pdf", url: "الدرس الثاني.pdf" },
  { title: "لعبة تفاعلية", description: "", type: "html", url: "لعبة تفاعلية.html" }
];

async function displayContent(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'lesson-item';
    const safeUrl = encodeURI(item.url);

    if(item.type === 'html') {
      el.innerHTML = `
        <div class="lesson-info">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="lesson-meta"><span><i class="fas fa-gamepad"></i> تفاعلي</span></div>
        </div>
        <div class="lesson-actions">
          <button class="action-btn game" onclick="playGame('${safeUrl}')">
            <i class="fas fa-play"></i> العب
          </button>
        </div>`;
    } else {
      el.innerHTML = `
        <div class="lesson-info">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="lesson-meta"><span><i class="fas fa-file"></i> ${item.type.toUpperCase()}</span></div>
        </div>
        <div class="lesson-actions">
          <button class="action-btn" onclick="handleDownload('${safeUrl}')">
            <i class="fas fa-download"></i> تحميل
          </button>
        </div>`;
    }

    container.appendChild(el);
    if(((index+1)%2)===0) insertNativeAd(container, index); // إعلان اختياري
  });
}

function handleDownload(url) {
  // لاحقًا يمكن إضافة إعلان قبل التحميل
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  a.click();
}

displayContent('lessonsContainer');
