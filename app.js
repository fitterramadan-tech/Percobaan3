// app.js - UI, tema, sidebar, cek kesehatan, chat & history
(function(){
  // tema
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('wk_theme') || 'light';
  setTheme(currentTheme);
  themeToggle.addEventListener('click', ()=>{
    const t = document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark';
    setTheme(t);
  });
  function setTheme(t){
    if(t==='dark'){ document.documentElement.setAttribute('data-theme','dark'); themeToggle.innerText='☀️'; }
    else{ document.documentElement.removeAttribute('data-theme'); themeToggle.innerText='🌙'; }
    localStorage.setItem('wk_theme', t);
  }

  // sidebar
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  menuBtn.addEventListener('click', ()=> sidebar.classList.add('show'));
  closeSidebar.addEventListener('click', ()=> sidebar.classList.remove('show'));

  // logout
  document.getElementById('navLogout').addEventListener('click', ()=>{
    localStorage.removeItem('wk_session');
    location.reload();
  });

  // health form
  const healthForm = document.getElementById('healthForm');
  const healthResult = document.getElementById('healthResult');
  healthForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const h = parseFloat(document.getElementById('height').value);
    const w = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const syms = Array.from(healthForm.querySelectorAll('input[name="sym"]:checked')).map(i=>i.value);

    const bmi = w / ((h/100)*(h/100));
    let cat='';
    if(bmi<18.5) cat='Kurus (underweight)';
    else if(bmi<25) cat='Normal';
    else if(bmi<30) cat='Kelebihan berat (overweight)';
    else cat='Obesitas';

    // saran sederhana (AI-like heuristics)
    let advice = [];
    if(cat==='Kurus (underweight)'){ advice.push('Pertimbangkan menambah asupan kalori bergizi: protein, karbohidrat kompleks, lemak sehat.'); }
    if(cat==='Normal'){ advice.push('Pertahankan pola makan seimbang dan olahraga teratur.'); }
    if(cat==='Kelebihan berat (overweight)'){ advice.push('Kurangi kalori berlebih, tingkatkan aktivitas fisik. Konsultasi dokter/gizi jika perlu.'); }
    if(cat==='Obesitas'){ advice.push('Konsultasikan ke dokter atau ahli gizi. Pertimbangkan program penurunan berat badan terstruktur.'); }

    if(syms.includes('lelahan')) advice.push('Biasanya kebutuhan tidur, stres, atau anemia. Periksa kualitas tidur dan asupan zat besi.');
    if(syms.includes('marah')) advice.push('Perhatikan manajemen emosi: teknik napas, jeda, atau berkonsultasi ke profesional bila mengganggu.');
    if(syms.includes('sakit')) advice.push('Periksakan ke fasilitas kesehatan bila sering sakit, cek imunisasi dan pola hidup.');

    // rekomendasi umur-aktif
    if(age<18) advice.push('Pastikan nutrisi berkembang; minta saran dari orang tua/penanggung jawab.');
    if(age>=60) advice.push('Perhatikan pencegahan penyakit kronis dan jaga kekuatan otot melalui latihan ringan.');

    const resultText = `BMI: ${bmi.toFixed(1)} (${cat})\nRekomendasi:\n- ${advice.join('\n- ')}`;
    healthResult.innerText = resultText;
    healthResult.classList.remove('hidden');

    // simpan history untuk user
    const session = JSON.parse(localStorage.getItem('wk_session'));
    if(session){
      DB.saveHistory(session.email, {time: new Date().toISOString(), height:h, weight:w, age, bmi: bmi.toFixed(1), category:cat, symptoms:syms, advice});
      renderHistory(session.email);
    }
  });

  // render history into sidebar
  function renderHistory(email){
    const list = DB.loadHistory(email);
    const container = document.getElementById('historyList');
    container.innerHTML = '';
    if(list.length===0){ container.innerHTML = '<p class="muted">Belum ada history</p>'; return; }
    list.slice(0,20).forEach(it=>{
      const el = document.createElement('div');
      el.className = 'card';
      el.style.margin='8px 0';
      el.innerHTML = `<strong>${new Date(it.time).toLocaleString()}</strong><div>BMI: ${it.bmi} — ${it.category}</div>`;
      container.appendChild(el);
    });
  }

  // saat membuka menu klik history
  document.getElementById('navHealthHistory').addEventListener('click', ()=>{
    const s = JSON.parse(localStorage.getItem('wk_session'));
    if(!s) return alert('Belum login');
    renderHistory(s.email);
    sidebar.classList.add('show');
  });

  // profil
  document.getElementById('navProfile').addEventListener('click', ()=>{
    const s = JSON.parse(localStorage.getItem('wk_session'));
    if(!s) return alert('Belum login');
    const p = document.createElement('div');
    p.className='card';
    p.innerHTML = `<h4>Profil</h4><p>Nama: ${s.name}</p><p>Email: ${s.email}</p><p>Umur: ${s.age}</p>`;
    const container = document.getElementById('historyList');
    container.innerHTML='';
    container.appendChild(p);
    sidebar.classList.add('show');
  });

  // chat sederhana (respons berbasis aturan)
  const chatHistory = document.getElementById('chatHistory');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  function addMessage(who, text){
    const el = document.createElement('div');
    el.style.margin='6px 0';
    el.innerHTML = `<strong>${who}:</strong> <div>${text}</div>`;
    chatHistory.appendChild(el);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  chatSend.addEventListener('click', ()=> sendChat());
  chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendChat(); });

  function sendChat(){
    const t = chatInput.value.trim(); if(!t) return;
    addMessage('Kamu', t);
    chatInput.value='';
    // respons sederhana
    let r = 'Maaf, aku belum paham. Coba tanyakan tentang tidur, diet, olahraga, atau mood.';
    const low = t.toLowerCase();
    if(low.includes('tidur')) r = 'Usahakan tidur 7-9 jam tiap malam, buat rutinitas tidur (matiin layar 30 menit sebelum).';
    if(low.includes('olahraga') || low.includes('latih')) r = 'Latihan kombinasi kardio & strength 3-5x/minggu, mulai dari intensitas ringan.';
    if(low.includes('perut')|| low.includes('diet')|| low.includes('berat')) r = 'Jaga defisit kalori kecil tiap hari, perbanyak protein dan sayur.';
    if(low.includes('stres')|| low.includes('marah')) r = 'Coba teknik napas 4-4-4, istirahat singkat, atau catat pemicu emosimu.';
    addMessage('Bot', r);
  }

  // inisialisasi jika sudah session
  document.addEventListener('DOMContentLoaded', ()=>{
    const s = localStorage.getItem('wk_session');
    if(s) showMain();
  });

})();
