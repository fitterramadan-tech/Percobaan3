// auth.js - Register & Login menggunakan localStorage

// Simpan user baru
function registerUser(name, email, pass){
  const users = JSON.parse(localStorage.getItem('simple_users') || '[]');
  if(users.find(u=>u.email===email)) return false;
  users.push({name, email, pass: btoa(pass)});
  localStorage.setItem('simple_users', JSON.stringify(users));
  return true;
}

// Validasi login
function loginUser(email, pass){
  const users = JSON.parse(localStorage.getItem('simple_users') || '[]');
  return users.find(u => u.email===email && u.pass===btoa(pass));
}

// Handle form
const regForm = document.getElementById('registerForm');
if(regForm){
  regForm.onsubmit = (e)=>{
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    if(registerUser(name,email,pass)){
      alert('Akun berhasil dibuat!');
      location.href = 'index.html';
    } else alert('Email sudah terdaftar!');
  }
}

const logForm = document.getElementById('loginForm');
if(logForm){
  logForm.onsubmit = (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    const user = loginUser(email,pass);
    if(!user) return alert('Email atau password salah');

    localStorage.setItem('simple_session', JSON.stringify(user));
    location.href = 'home.html';
  }
                         }
