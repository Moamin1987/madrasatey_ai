// نظام إعلانات تطبيق مدرستي
let adTimer;
let adCountdown = 15;
let currentActionUrl = '';

// تهيئة الإعلانات
function initializeAds(){ console.log('تم تهيئة نظام الإعلانات'); }

// إخفاء إعلان Banner (لا تُظهر مساحات فارغة)
function hideBannerAd(){
  document.querySelectorAll('.ad-banner-container').forEach(c=>{ c.style.display='none'; });
}

// عرض إعلان مكافأة عند الطلب
function showAd(url){
  currentActionUrl = url || '';
  const popup = document.getElementById('adPopup');
  if(!popup) return;
  popup.style.display='flex';
  startAdCountdown();
  setTimeout(()=>{
    const holder = document.querySelector('.ad-placeholder');
    if(holder){ holder.textContent = 'إعلان نشط هنا'; }
  }, 600);
}

function startAdCountdown(){
  adCountdown = 15;
  updateCountdownDisplay();
  clearInterval(adTimer);
  adTimer = setInterval(()=>{
    adCountdown--;
    updateCountdownDisplay();
    if(adCountdown<=0){
      clearInterval(adTimer);
      completeAd();
    }
  },1000);
}

function updateCountdownDisplay(){
  const el = document.getElementById('adCountdown');
  if(el){ el.textContent = adCountdown; }
}

function completeAd(){
  document.getElementById('adPopup').style.display='none';
  executeAction();
}

function skipAd(){
  clearInterval(adTimer);
  document.getElementById('adPopup').style.display='none';
  alert('شاهد الإعلان لدعم التطبيق!');
}

function executeAction(){
  if(!currentActionUrl) return;
  if (currentActionUrl.includes('.pdf') || currentActionUrl.includes('.txt')) {
    window.open(currentActionUrl, '_blank');
  } else if (currentActionUrl.includes('.html') || currentActionUrl === '#') {
    alert('جاري فتح اللعبة...');
  }
}

// إعلان Native مُدمج
function insertNativeAd(container, index){
  if(!container) return;
  if ((index + 1) % 3 === 0) {
    const ad = document.createElement('div');
    ad.className = 'native-ad';
    ad.innerHTML = `
      <div class="lesson-item">
        <div class="lesson-info">
          <h4>إعلان مدعوم</h4>
          <p>يدعم تطوير التطبيق</p>
        </div>
      </div>`;
    container.appendChild(ad);
  }
}