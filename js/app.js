let currentGrade = '';
let currentTerm = '';
let currentSubject = '';
let currentView = 'lessons';

document.addEventListener('DOMContentLoaded', () => {
  showPage('homePage');
  initializeAds();
  checkForUpdates();
});

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  hideBannerAd();
}

function goHome(){ showPage('homePage'); currentGrade=currentTerm=currentSubject=''; }
function goToGrade(){ showPage('gradePage'); }
function goToTerm(){ showPage('termPage'); }

function navigateToGrade(gradeId){
  currentGrade = gradeId;
  const names = {
    grade1:'الصف الأول الابتدائي', grade2:'الصف الثاني الابتدائي', grade3:'الصف الثالث الابتدائي',
    grade4:'الصف الرابع الابتدائي', grade5:'الصف الخامس الابتدائي', grade6:'الصف السادس الابتدائي'
  };
  document.getElementById('gradeTitle').textContent = names[gradeId] || '';
  showPage('gradePage');
}

function navigateToTerm(termId){
  currentTerm = termId;
  const names = { term1:'الترم الأول', term2:'الترم الثاني' };
  document.getElementById('termTitle').textContent = names[termId] || '';
  loadSubjects();
  showPage('termPage');
}

function loadSubjects(){
  const container = document.getElementById('subjectsContainer');
  let subjects = [];
  if(['grade1','grade2','grade3'].includes(currentGrade)){
    subjects = [
      { id:'arabic',  name:'اللغة العربية',     icon:'fas fa-book' },
      { id:'islamic', name:'التربية الإسلامية', icon:'fas fa-mosque' }
    ];
  }else if(['grade4','grade5','grade6'].includes(currentGrade)){
    subjects = [
      { id:'arabic',  name:'اللغة العربية',     icon:'fas fa-book' },
      { id:'islamic', name:'التربية الإسلامية', icon:'fas fa-mosque' },
      { id:'science', name:'العلوم',           icon:'fas fa-flask' },
      { id:'social',  name:'الدراسات الاجتماعية', icon:'fas fa-globe' },
      { id:'ict',     name:'ICT',              icon:'fas fa-laptop' }
    ];
  }
  container.innerHTML='';
  subjects.forEach((subject, index)=>{
    const btn = document.createElement('button');
    btn.className = 'subject-btn';
    btn.innerHTML = `<span><i class="${subject.icon}"></i> ${subject.name}</span><i class="fas fa-chevron-left"></i>`;
    btn.onclick = ()=>navigateToSubject(subject.id);
    container.appendChild(btn);

    // إعلان Native بعد كل 3 مواد
    if((index+1)%3===0){
      const ad = document.createElement('div');
      ad.className='native-ad';
      ad.innerHTML = `<div class="lesson-item"><div class="lesson-info"><h4>إعلان مدعوم</h4><p>يدعم تطوير التطبيق</p></div></div>`;
      container.appendChild(ad);
    }
  });
}

function navigateToSubject(subjectId){
  currentSubject = subjectId;
  currentView = 'lessons';
  const names = { arabic:'اللغة العربية', islamic:'التربية الإسلامية', science:'العلوم', social:'الدراسات الاجتماعية', ict:'ICT' };
  document.getElementById('subjectTitle').textContent = names[subjectId] || '';
  showPage('subjectPage');
  showLessons();
}

function showLessons(){ currentView='lessons'; loadSubjectScript(); }
function showGames(){ currentView='games'; loadSubjectScript(); }

function loadSubjectScript(){
  const path = `content/grades/${currentGrade}/${currentTerm}/${currentSubject}/${currentSubject}.js`;
  const old = document.getElementById('subjectScript');
  if(old) old.remove();
  const s = document.createElement('script');
  s.id = 'subjectScript';
  s.src = path;
  s.onerror = ()=>{ showDefaultContent(); };
  document.head.appendChild(s);
}

function showDefaultContent(){
  const c = document.getElementById('lessonsContainer');
  if(currentView==='lessons'){
    c.innerHTML = `
      <div class="empty-state"><i class="fas fa-book-open"></i>
        <h3>لا توجد دروس حالياً</h3><p>سيتم إضافة الدروس قريباً</p>
      </div>`;
  }else{
    c.innerHTML = `
      <div class="empty-state"><i class="fas fa-gamepad"></i>
        <h3>لا توجد ألعاب حالياً</h3><p>سيتم إضافة الألعاب قريباً</p>
      </div>`;
  }
}

function navigateToGames(){
  showPage('gamesPage');
  const container = document.getElementById('gamesContainer');
  container.innerHTML = `
    <div class="lesson-item">
      <div class="lesson-info">
        <h4>لعبة الحساب السريع</h4><p>تدرب على العمليات الحسابية البسيطة</p>
      </div>
      <div class="lesson-actions">
        <button class="action-btn game" onclick="playGame('#')"><i class="fas fa-play"></i> العب</button>
      </div>
    </div>
    <div class="lesson-item">
      <div class="lesson-info">
        <h4>لعبة الحروف</h4><p>تعلم الحروف العربية بطريقة ممتعة</p>
      </div>
      <div class="lesson-actions">
        <button class="action-btn game" onclick="playGame('#')"><i class="fas fa-play"></i> العب</button>
      </div>
    </div>`;
}

function downloadLesson(url){ showAd(url); }
function playGame(url){ showAd(url); }

function showCopyright(){
  const el = document.getElementById('copyrightPopup');
  if(el) el.style.display='flex';
}
function hideCopyright(){
  const el = document.getElementById('copyrightPopup');
  if(el) el.style.display='none';
}

// إشعارات/تنبيهات التحديثات
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg || 'تحديث جديد متاح';
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 3500);
}

// التحقق من وجود تحديثات (محاكاة)
function checkForUpdates(){
  const current = '1.0.0';
  const latest  = '1.0.1';
  if(current !== latest){
    const btn = document.getElementById('updateButton');
    if(btn) btn.style.display='inline-flex';
    showToast('تحديث جديد متاح: ' + latest);
    if('Notification' in window){
      if(Notification.permission === 'granted'){
        new Notification('مدرستي', { body: 'تحديث جديد متاح للإصدار ' + latest, icon: 'content/assets/icon-192.png' });
      }else if(Notification.permission !== 'denied'){
        Notification.requestPermission();
      }
    }
  }
}

// تحديث التطبيق + تنظيف الكاش
function updateApp(){
  alert('سيتم تحميل التحديث وإعادة تشغيل التطبيق');
  if(navigator.serviceWorker?.controller){
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).finally(()=>location.reload());
  }else{
    location.reload();
  }
}

// إغلاق أي نافذة منبثقة بالنقر خارجها
document.querySelectorAll('.popup-overlay').forEach(p=>{
  p.addEventListener('click', e=>{ if(e.target===p){ p.style.display='none'; } });
});