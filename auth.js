// db.js - penyimpanan sederhana menggunakan localStorage
const DB = {
  key_users: 'wk_users_v1',
  key_history: (email)=> `wk_history_${email}`,

  loadUsers(){
    return JSON.parse(localStorage.getItem(this.key_users) || '[]');
  },
  saveUsers(users){ localStorage.setItem(this.key_users, JSON.stringify(users)); },

  saveHistory(email, entry){
    const k = this.key_history(email);
    const arr = JSON.parse(localStorage.getItem(k) || '[]');
    arr.unshift(entry); // terbaru di depan
    localStorage.setItem(k, JSON.stringify(arr));
  },
  loadHistory(email){
    const k = this.key_history(email);
    return JSON.parse(localStorage.getItem(k) || '[]');
  }
}

// contoh: DB.saveUsers([...]);
