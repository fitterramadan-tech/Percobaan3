/* script.js
   Semua logic client-side:
   - Simple auth (LocalStorage) dengan hash (WebCrypto)
   - Navigasi & UI
   - BMI calculator + Devine & Broca
   - Aktivitas rekomendasi berdasarkan cuaca/musim/waktu
   - Self-test otomatis untuk memvalidasi fitur
*/

/* ---------- Utility & Storage ---------- */
const LS_USERS_KEY = 'hb_users_v1';
const LS_SESS_KEY = 'hb_session_v1';

// helper: get users object from localstorage
function loadUsers(){
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) {
    console.error('loadUsers err', e);
    return {};
  }
}
function saveUsers(obj){
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(obj));
}

// Session (store username when logged in)
function setSession(username){
  localStorage.setItem(LS_SESS_KEY, JSON.stringify({ username, ts: Date.now() }));
}
function clearSession(){
  localStorage.removeItem(LS_SESS_KEY);
}
function getSession(){
  try { return JSON.parse(localStorage.getItem(LS_SESS_KEY)); } catch { return null; }
}

/* helper: hash password using SHA-256 (Web Crypto API) */
async function sha256hex(text){
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  // convert to hex
  const arr = Array.from(new Uint8Array(hash));
  return arr.map(b => b.toString(16).padStart(2,'0')).join('');
}

/* ---------- DOM refs ---------- */
const authScreen = document.getElementById('auth-screen');
const dashboard = document.getElementById('dashboard');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');

const greeting = document.getElementById('greeting');
const sideUsername = document.getElementById('side-username');

const avatarSvg = document.getElementById('avatar-svg');
const heroAvatar = document.getElementById('hero-avatar');
const chatBubble = document.getElementById('chat-bubble');
const bubbleClose = document.getElementById('bubble-close');
const bubbleBmi = document.getElementById('bubble-bmi');
const bubbleActivity = document.getElementById('bubble-activity');

const navButtons = document.querySelectorAll('.nav-item');

const profileUsername = document.getElementById('profile-username');
const profileCreated = document.getElementById('profile-created');
const profileAgent = document.getElementById('profile-agent');
const btnLogout = document.getElementById('btn-logout');
const btnDelete = document.getElementById('btn-delete');

const devTestEl = document.getElementById('dev-test');

/* ---------- Auth Logic ---------- */
// Toggle tabs
tabLogin.addEventListener('click', ()=> { tabLogin.classList.add('active'); tabRegister.classList.remove('active'); formLogin.classList.remove('hidden'); formRegister.classList.add('hidden'); });
tabRegister.addEventListener('click', ()=> { tabRegister.classList.add('active'); tabLogin.classList.remove('active'); formRegister.classList.remove('hidden'); formLogin.classList.add('hidden'); });

document.getElementById('btn-show-register').addEventListener('click', ()=> { tabRegister.click(); });
document.getElementById('btn-show-login').addEventListener('click', ()=> { tabLogin.click(); });

// Register
document.getElementById('btn-register').addEventListener('click', async (e)=>{
  e.preventDefault();
  registerError.textContent = '';
  const username = document.getElementById('reg-username').value.trim();
  const pw = document.getElementById('reg-password').value;
  const pw2 = document.getElementById('reg-password2').value;

  if(!username || username.length < 3) { registerError.textContent = 'Username minimal 3 karakter.'; return; }
  if(pw.length < 6) { registerError.textContent = 'Password minimal 6 karakter.'; return; }
  if(pw !== pw2) { registerError.textContent = 'Password konfirmasi tidak cocok.'; return; }

  const users = loadUsers();
  if(users[username]) { registerError.textContent = 'Username sudah terdaftar.'; return; }

  const hash = await sha256hex(pw);
  users[username] = { passwordHash: hash, created: new Date().toISOString() };
  saveUsers(users);

  // auto login
  setSession(username);
  showDashboard();
});

// Login
document.getElementById('btn-login').addEventListener('click', async (e)=>{
  e.preventDefault();
  loginError.textContent = '';
  const username = document.getElementById('login-username').value.trim();
  const pw = document.getElementById('login-password').value;
  if(!username || !pw){ loginError.textContent = 'Isi username & password.'; return; }

  const users = loadUsers();
  if(!users[username]){ loginError.textContent = 'Akun tidak ditemukan.'; return; }

  const hash = await sha256hex(pw);
  if(hash !== users[username].passwordHash){ loginError.textContent = 'Password salah.'; return; }

  setSession(username);
  showDashboard();
});

/* ---------- Dashboard & Navigation ---------- */
function showDashboard(){
  const sess = getSession();
  if(!sess){ showAuth(); return; }

  // update UI
  authScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');

  const username = sess.username;
  greeting.textContent = `Hai, ${username.split('')[0].toUpperCase()+username.slice(1)}!`;
  sideUsername.textContent = username;
  profileUsername.textContent = username;

  const users = loadUsers();
  const created = users[username] && users[username].created ? new Date(users[username].created).toLocaleString() : '-';
  profileCreated.textContent = created;
  profileAgent.textContent = navigator.userAgent;

  // default show home
  navigateTo('home');
}

function showAuth(){
  dashboard.classList.add('hidden');
  authScreen.classList.remove('hidden');
}

// hamburger toggle
hamburger && hamburger.addEventListener('click', ()=>{
  sidebar.classList.toggle('show');
});

// nav click
navButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    navigateTo(view);
    // close sidebar on mobile
    sidebar.classList.remove('show');
  });
});

function navigateTo(view){
  pages.forEach(p=> p.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const el = document.getElementById('view-' + view);
  if(el){
    el.classList.remove('hidden');
    el.classList.add('active');
    pageTitle.textContent = view === 'home' ? 'Beranda' : view === 'bmi' ? 'Cek Tubuh Ideal' : view === 'activity' ? 'Rekomendasi Aktivitas' : 'Profil';
  }
}

/* Avatar chat pop */
function openBubble(message){
  chatBubble.classList.remove('hidden');
  if(message) document.getElementById('bubble-content').innerHTML = `<p>${message}</p>`;
}
function closeBubble(){ chatBubble.classList.add('hidden'); }
avatarSvg && avatarSvg.addEventListener('click', ()=> openBubble());
heroAvatar && heroAvatar.addEventListener('click', ()=> openBubble());
bubbleClose.addEventListener('click', ()=> closeBubble());
bubbleBmi.addEventListener('click', ()=> { navigateTo('bmi'); closeBubble(); });
bubbleActivity.addEventListener('click', ()=> { navigateTo('activity'); closeBubble(); });

/* Logout & delete */
btnLogout.addEventListener('click', ()=>{
  clearSession();
  showAuth();
});
btnDelete.addEventListener('click', ()=>{
  const sess = getSession();
  if(!sess) return;
  if(confirm('Yakin akan menghapus akun? Tindakan ini permanen.')) {
    const users = loadUsers();
    delete users[sess.username];
    saveUsers(users);
    clearSession();
    alert('Akun dihapus.');
    showAuth();
  }
});

/* ---------- BMI Calculator ---------- */
document.getElementById('btn-calc-bmi').addEventListener('click', (e)=>{
  e.preventDefault();
  const age = parseInt(document.getElementById('bmi-age').value);
  const gender = document.getElementById('bmi-gender').value;
  const height = parseFloat(document.getElementById('bmi-height').value);
  const weight = parseFloat(document.getElementById('bmi-weight').value);
  const symptoms = Array.from(document.querySelectorAll('.symp:checked')).map(i => i.value);

  const err = [];
  if(!age || age < 5) err.push('Umur minimal 5 tahun.');
  if(!gender) err.push('Pilih jenis kelamin.');
  if(!height || height < 50) err.push('Masukkan tinggi valid.');
  if(!weight || weight < 10) err.push('Masukkan berat valid.');
  if(err.length){ alert(err.join(' ')); return; }

  const bmi = +(weight / ((height/100) ** 2)).toFixed(1);
  const status = interpretBMI(bmi);
  const broca = calcBroca(height);
  const devine = calcDevine(height, gender);
  const advice = generateAdvice(bmi, status, symptoms);

  document.getElementById('bmi-value').textContent = bmi;
  document.getElementById('bmi-status').textContent = status;
  document.getElementById('ideal-broca').textContent = `Broca: ~${broca} kg`;
  document.getElementById('ideal-devine').textContent = `Devine: ~${devine} kg`;
  document.getElementById('bmi-advice').innerHTML = advice;

  document.getElementById('bmi-result').classList.remove('hidden');
});

document.getElementById('btn-clear-bmi').addEventListener('click', ()=>{
  document.getElementById('bmi-form').reset();
  document.getElementById('bmi-result').classList.add('hidden');
});

function interpretBMI(bmi){
  if(bmi < 18.5) return 'Kurus';
  if(bmi >= 18.5 && bmi <= 24.9) return 'Ideal';
  if(bmi >= 25 && bmi <= 29.9) return 'Berlebih';
  return 'Obesitas';
}

function calcBroca(heightCm){
  // Broca: berat ideal = (tinggi - 100) - 10% dari (tinggi - 100)
  const base = heightCm - 100;
  const ideal = Math.round(base - (0.1 * base));
  return ideal;
}
function calcDevine(heightCm, gender){
  // Devine formula: for men: 50 + 0.9*(height_cm - 152)
  // for women: 45.5 + 0.9*(height_cm - 152)
  let res;
  if(gender === 'male') res = 50 + 0.9 * (heightCm - 152);
  else if(gender === 'female') res = 45.5 + 0.9 * (heightCm - 152);
  else res = (50 + 45.5)/2 + 0.9 * (heightCm - 152);
  return Math.round(res);
}
function generateAdvice(bmi, status, symptoms){
  let base = '';
  if(status === 'Kurus'){
    base += `<p>Anda termasuk <strong>kurus</strong>. Tambahkan 300-500 kalori sehat per hari, fokus pada protein berkualitas (telur, ikan, kacang), dan latihan kekuatan ringan.</p>`;
  } else if(status === 'Ideal'){
    base += `<p>Berat badan anda <strong>ideal</strong>. Pertahankan pola makan seimbang dan aktivitas fisik rutin (150 menit/minggu aktivitas sedang).</p>`;
  } else if(status === 'Berlebih'){
    base += `<p>Kategori <strong>berlebih</strong>. Kurangi kalori sedikit (200-300 kcal), prioritaskan sayur, protein tinggi, dan cardio ringan.</p>`;
  } else {
    base += `<p>Kategori <strong>obesitas</strong>. Pertimbangkan konsultasi ke profesional kesehatan. Mulai program diet terukur & aktivitas bertahap.</p>`;
  }

  if(symptoms && symptoms.length){
    base += `<p><strong>Gejala yang dipilih:</strong> ${symptoms.join(', ')}. Perhatikan istirahat, hidrasi, dan bila perlu konsultasi bila gejala menetap.</p>`;
  }

  base += `<p class="muted small">Catatan: ini hanya rekomendasi umum. Untuk diagnosa bersifat klinis, hubungi tenaga medis.</p>`;
  return base;
}

/* ---------- Activity Recommendation ---------- */
document.getElementById('btn-act').addEventListener('click', (e)=>{
  e.preventDefault();
  const weather = document.getElementById('act-weather').value;
  const season = document.getElementById('act-season').value;
  const time = document.getElementById('act-time').value;

  if(!weather || !season || !time){ alert('Pilih cuaca, musim & waktu.'); return; }

  const recs = recommendActivities(weather, season, time);
  renderActivityCards(recs);
});

document.getElementById('btn-act-clear').addEventListener('click', ()=>{
  document.getElementById('activity-form').reset();
  document.getElementById('act-results').classList.add('hidden');
  document.getElementById('act-results').innerHTML = '';
});

function recommendActivities(weather, season, time){
  // Rule-based small engine
  const options = [];

  // helper to push card
  function push(title, reason, icon='🏃') { options.push({title, reason, icon}); }

  if(weather === 'cerah'){
    if(time === 'pagi' || time === 'siang') {
      push('Jogging / Lari ringan', 'Matahari cerah cocok untuk olahraga luar, tingkatkan vitamin D & mood.', '🏃‍♂️');
      push('Bersepeda santai', 'Udara segar dan pemandangan membuat aktivitas lebih menyenangkan.', '🚴');
    } else {
      push('Stretching & Yoga', 'Suhu lebih sejuk di pagi/ malam, cocok untuk fleksibilitas', '🧘');
    }
  } else if(weather === 'mendung'){
    push('Jalan santai / brisk walk', 'Tidak terlalu panas, aman untuk cardio ringan.', '🚶‍♀️');
    push('Latihan kekuatan di luar (bodyweight)', 'Mendung mengurangi risiko overheat.', '🏋️');
  } else if(weather === 'hujan'){
    push('Yoga indoor', 'Permukaan basah lebih berisiko, lakukan aktivitas indoor.', '🧘‍♀️');
    push('HIIT singkat di rumah', 'Latihan intens pendek menjaga detak jantung aktif saat hujan.', '🔥');
    push('Senam ringan', 'Aktivitas ringan untuk keluarga di dalam rumah.', '🤸');
  } else if(weather === 'panas'){
    push('Renang / Water aerobics', 'Suhu tinggi cocok untuk aktivitas air untuk pendinginan.', '🏊‍♂️');
    push('Senam pagi atau sore', 'Hindari jam puncak panas; lakukan pagi atau sore hari.', '☀️');
  } else if(weather === 'badai'){
    push('Istirahat & pemulihan', 'Prioritaskan keselamatan. Tetap di dalam dan lakukan peregangan ringan.', '🛌');
  }

  // season-based adjustments
  if(season === 'hujan_season'){
    options.push({title:'Jadwalkan olahraga indoor mingguan', reason:'Musim hujan sering membuat outdoor sulit — siapkan alternatif indoor.', icon:'🏠'});
  } else if(season === 'kemarau'){
    options.push({title:'Lindungi kulit & hidrasi', reason:'Cuaca kering; bawa air & pakai tabir saat aktivitas luar.', icon:'💧'});
  } else if(season === 'dingin'){
    options.push({title:'Pemanasan lebih lama', reason:'Suhu dingin perlukan pemanasan ekstra untuk mencegah cedera.', icon:'❄️'});
  }

  // time adjustments
  if(time === 'tengah_malam'){
    options.unshift({title:'Hindari aktivitas berat', reason:'Tubuh membutuhkan istirahat; lebih baik peregangan ringan.', icon:'🌙'});
  }
  if(time === 'malam'){
    options.push({title:'Yoga ringan sebelum tidur', reason:'Membantu relaksasi & tidur lebih nyenyak.', icon:'🛌'});

  }

  // remove duplicates (by title)
  const unique = [];
  const seen = new Set();
  for(const o of options){
    if(!seen.has(o.title)){ unique.push(o); seen.add(o.title); }
  }
  return unique.slice(0,6);
}

function renderActivityCards(recs){
  const container = document.getElementById('act-results');
  container.innerHTML = '';
  recs.forEach(r=>{
    const d = document.createElement('div');
    d.className = 'card activity-card';
    d.innerHTML = `<div style="display:flex;align-items:center;gap:.6rem;"><div style="font-size:1.6rem">${r.icon}</div><div><strong>${r.title}</strong><div class="muted small">${r.reason}</div></div></div>`;
    container.appendChild(d);
  });
  container.classList.remove('hidden');
}

/* ---------- Small Helper: On load, check session ---------- */
window.addEventListener('load', ()=>{
  const sess = getSession();
  if(sess && loadUsers()[sess.username]) {
    showDashboard();
  } else {
    showAuth();
  }

  // run self-tests
  runSelfTests();
});

/* ---------- Self Test Suite (runs on load) ---------- */
async function runSelfTests(){
  const results = [];
  // Test 1: user register & login flow (simulate)
  try {
    const testUser = 'hb_test_user';
    const testPass = 'testpass123';
    // cleanup
    const usersBefore = loadUsers();
    if(usersBefore[testUser]) delete usersBefore[testUser];
    saveUsers(usersBefore);

    // perform register
    const hash = await sha256hex(testPass);
    const users = loadUsers();
    users[testUser] = { passwordHash: hash, created: new Date().toISOString() };
    saveUsers(users);

    // check saved
    const loaded = loadUsers();
    if(loaded[testUser] && loaded[testUser].passwordHash === hash) results.push('Auth register: OK');
    else results.push('Auth register: FAIL');

    // emulate login
    const hashCheck = await sha256hex(testPass);
    if(hashCheck === loaded[testUser].passwordHash) results.push('Auth login hash check: OK');
    else results.push('Auth login hash check: FAIL');

    // cleanup test user (but keep to allow manual test) - remove to be tidy
    delete loaded[testUser];
    saveUsers(loaded);
  } catch(e){
    console.error(e);
    results.push('Auth tests: ERROR');
  }

  // Test 2: BMI calculation correctness
  try {
    // Example: height 170, weight 68 => BMI ~23.5 => Ideal
    const bmiExample = +(68 / ((170/100)**2)).toFixed(1);
    const status = interpretBMI(bmiExample);
    if(Math.abs(bmiExample - 23.5) < 0.2 && status === 'Ideal') results.push('BMI calc: OK');
    else results.push('BMI calc: FAIL');
  } catch(e){ results.push('BMI calc: ERROR'); }

  // Test 3: Activity engine basic behavior
  try {
    const rec = recommendActivities('hujan','hujan_season','malam');
    if(rec && rec.length >= 2) results.push('Activity engine: OK');
    else results.push('Activity engine: FAIL');
  } catch(e){ results.push('Activity engine: ERROR'); }

  // Output results to UI & console
  console.group('HealthBuddy Self-Test');
  results.forEach(r => console.log(r));
  console.groupEnd();

  devTestEl.textContent = 'Developer / Test: ' + results.join(' • ');
}

/* ---------- End of script.js ---------- */
