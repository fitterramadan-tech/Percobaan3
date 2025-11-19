/* SIDEBAR */
function toggleMenu() {
    const bar = document.getElementById("sidebar");
    bar.style.left = bar.style.left === "0px" ? "-230px" : "0px";
}

/* SWITCH LOGIN/REGISTER */
function switchLogin() {
    document.getElementById("register").classList.remove("active");
    document.getElementById("login").classList.add("active");
}

function switchRegister() {
    document.getElementById("login").classList.remove("active");
    document.getElementById("register").classList.add("active");
}

/* REGISTER */
function register() {
    let u = document.getElementById("regUser").value;
    let p = document.getElementById("regPass").value;

    if (!u || !p) {
        document.getElementById("regMsg").innerHTML = "Isi semua data!";
        return;
    }

    localStorage.setItem("user", u);
    localStorage.setItem("pass", p);

    document.getElementById("regMsg").innerHTML = "Akun berhasil dibuat!";
}

/* LOGIN */
function login() {
    let u = document.getElementById("logUser").value;
    let p = document.getElementById("logPass").value;

    if (u === localStorage.getItem("user") && p === localStorage.getItem("pass")) {
        document.getElementById("login").classList.remove("active");
        document.getElementById("home").classList.add("active");
    } else {
        document.getElementById("logMsg").innerHTML = "Username atau password salah!";
    }
}

/* LOGOUT */
function logout() {
    showPage("login");
}

/* PAGE SWITCHER */
function showPage(id) {
    let pages = document.querySelectorAll(".page");
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* BMI CALCULATOR */
function calcBMI() {
    let h = parseFloat(document.getElementById("height").value);
    let w = parseFloat(document.getElementById("weight").value);
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;

    if (!h || !w) {
        document.getElementById("bmiResult").innerHTML = "Isi tinggi dan berat!";
        return;
    }

    let bmi = (w / ((h / 100) ** 2)).toFixed(1);

    let status = "";
    if (bmi < 18.5) status = "Kurus";
    else if (bmi < 25) status = "Ideal";
    else if (bmi < 30) status = "Berlebih";
    else status = "Obesitas";

    // Berat ideal (Broca modifikasi)
    let ideal = gender === "pria" ? (h - 100) - (h - 100) * 0.1 : (h - 100) - (h - 100) * 0.15;

    let saran = {
        "Kurus": "Perbanyak makanan tinggi protein & kalori sehat.",
        "Ideal": "Pertahankan pola makan seimbang.",
        "Berlebih": "Kurangi gula dan gorengan, perbanyak sayur.",
        "Obesitas": "Konsultasikan diet ketat & tingkatkan aktivitas."
    };

    document.getElementById("bmiResult").innerHTML = `
        <b>BMI:</b> ${bmi}<br>
        <b>Status:</b> ${status}<br>
        <b>Berat Ideal:</b> ${ideal.toFixed(1)} kg<br>
        <b>Saran:</b> ${saran[status]}
    `;
}

/* ACTIVITY RECOMMENDATION */
function recommend() {
    let weather = document.getElementById("weather").value;
    let season = document.getElementById("season").value;

    let rec = "";
    let reason = "";

    if (weather === "cerah") {
        rec = "Jogging / Bersepeda";
        reason = "Cuaca yang cerah sangat cocok untuk aktivitas luar ruangan.";
    } else if (weather === "mendung") {
        rec = "Jalan santai atau stretching outdoor";
        reason = "Cuaca tidak panas, nyaman untuk olahraga ringan.";
    } else if (weather === "hujan") {
        rec = "Yoga / Gym indoor";
        reason = "Hujan membuat aktivitas outdoor kurang aman.";
    } else if (weather === "panas") {
        rec = "Renang";
        reason = "Cuaca panas cocok untuk olahraga air.";
    } else if (weather === "badai") {
        rec = "Workout ringan di rumah";
        reason = "Badai sangat berbahaya untuk aktivitas luar.";
    }

    if (season === "hujan") {
        reason += " Musim hujan menambah risiko outdoor.";
    }

    document.getElementById("recResult").innerHTML = `
        <b>Rekomendasi Aktivitas:</b> ${rec}<br>
        <b>Alasan:</b> ${reason}
    `;
}
