// ملف JavaScript خاص بمادة islamic - grade4 - term1
function displayLessons(){
  const container = document.getElementById('lessonsContainer');
  const lessons = [
    {
      title: 'الدرس الأول',
      description: 'مقدمة في المادة',
      type: 'pdf',
      url: 'https://example.com/grade4/term1/islamic/lesson1.pdf'
    },
    {
      title: 'الدرس الثاني',
      description: 'الأجزاء الأساسية',
      type: 'text',
      url: 'https://example.com/grade4/term1/islamic/lesson2.txt'
    },
    {
      title: 'الدرس الثالث',
      description: 'تطبيقات عملية',
      type: 'pdf',
      url: 'https://example.com/grade4/term1/islamic/lesson3.pdf'
    }
  ];
  container.innerHTML='';
  lessons.forEach((lesson, index)=>{
    const el = document.createElement('div');
    el.className = 'lesson-item';
    el.innerHTML = `
      <div class="lesson-info">
        <h4>${lesson.title}</h4>
        <p>${lesson.description}</p>
        <div class="lesson-meta"><span><i class="fas fa-file"></i> ${lesson.type.toUpperCase()}</span></div>
      </div>
      <div class="lesson-actions">
        <button class="action-btn" onclick="downloadLesson('${lesson.url}')"><i class="fas fa-download"></i> تحميل</button>
      </div>`;
    container.appendChild(el);
    if(((index+1)%2)===0) insertNativeAd(container, index);
  });
}

function displayGames(){
  const container = document.getElementById('lessonsContainer');
  const games = [
    {
      title: 'لعبة تفاعلية',
      description: 'اختبار الدرس الأول',
      type: 'html',
      url: 'https://example.com/grade4/term1/islamic/game1.html'
    },
    {
      title: 'لعبة التطبيق',
      description: 'تطبيق عملي للمفاهيم',
      type: 'html',
      url: 'https://example.com/grade4/term1/islamic/game2.html'
    }
  ];
  container.innerHTML='';
  games.forEach((game, index)=>{
    const el = document.createElement('div');
    el.className = 'lesson-item';
    el.innerHTML = `
      <div class="lesson-info">
        <h4>${game.title}</h4>
        <p>${game.description}</p>
        <div class="lesson-meta"><span><i class="fas fa-gamepad"></i> تفاعلي</span></div>
      </div>
      <div class="lesson-actions">
        <button class="action-btn game" onclick="playGame('${game.url}')"><i class="fas fa-play"></i> العب</button>
      </div>`;
    container.appendChild(el);
    insertNativeAd(container, index);
  });
}

// تحميل المحتوى الافتراضي عند إدراج الملف
if (typeof currentView !== 'undefined' && currentView === 'lessons') {
  displayLessons();
} else {
  displayGames();
}
