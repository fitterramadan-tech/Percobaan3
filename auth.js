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
  return users.find
