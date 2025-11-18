// auth.js - registrasi & login sederhana
(function(){
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  showRegister.addEventListener('click', (e)=>{ e.preventDefault(); toggleForms(); });
  showLogin.addEventListener('click', (e)=>{ e.preventDefault(); toggleForms(); });

  function toggleForms(){
    registerForm.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
  }

  registerForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const age = parseInt(document.getElementById('regAge').value);
    const pass = document.getElementById('regPassword').value;

    const users = DB.loadUsers();
    if(users.find(u=>u.email===email)) return alert('Email sudah terdaftar');

    // simpan sederhana (bukan untuk produksi). Kita gunakan btoa agar tak langsung teks.
    const stored = {name, email, age, pass: btoa(pass)};
    users.push(stored);
    DB.saveUsers(users);
    alert('Daftar sukses. Silakan login.');
    toggleForms();
  });

  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPassword').value;

    const users = DB.loadUsers();
    const user = users.find(u=>u.email===email && u.pass===btoa(pass));
    if(!user) return alert('Email atau password salah');

    // set session sederhana
    localStorage.setItem('wk_session', JSON.stringify({email:user.email,name:user.name,age:user.age}));
    // tampilkan halaman utama
    showMain();
  });

  // jika sudah login, tampilkan langsung
  window.showMain = function(){
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    const s = JSON.parse(localStorage.getItem('wk_session'));
    document.getElementById('welcomeText').innerText = `Halo, ${s.name}`;
  }

  // logout handler dari app.js
})();
