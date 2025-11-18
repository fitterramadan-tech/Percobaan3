// Status kondisi
let kondisi = {
    lelah: false,
    sakit: false,
    emosi: false
};

// Toggle tombol kondisi
function toggleCond(kond) {
    kondisi[kond] = !kondisi[kond];

    const btnId = {
        lelah: "btnLelah",
        sakit: "btnSakit",
        emosi: "btnEmosi"
    };

    let btn = document.getElementById(btnId[kond]);
    btn.classList.toggle("selected");

    updateHealth(); // Update real-time
}

// Analisa Kesehatan
function updateHealth() {
    let tb = parseFloat(document.getElementById("tb").value);
    let bb = parseFloat(document.getElementById("bb").value);
    let umur = parseFloat(document.getElementById("umur").value);

    if (!tb || !bb || !umur) {
        document.getElementById("hasilBMI").innerText = "BMI: -";
        document.getElementById("hasilSkor").innerText = "Skor Kesehatan: -";
        document.getElementById("aiSaran").innerText = "AI Saran: -";
        return;
    }

    // Hitung BMI
    let meter = tb / 100;
    let bmi = (bb / (meter * meter)).toFixed(1);
    document.getElementById("hasilBMI").innerText = "BMI: " + bmi;

    // Nilai dasar BMI
    let ideal = "";
    if (bmi < 18.5) ideal = "Kurus";
    else if (bmi <= 24.9) ideal = "Ideal";
    else if (bmi <= 29.9) ideal = "Berlebih";
    else ideal = "Obesitas";

    // Skor awal
    let skor = 100;

    if (ideal === "Kurus") skor -= 10;
    if (ideal === "Berlebih") skor -= 15;
    if (ideal === "Obesitas") skor -= 25;

    // Penalti kondisi
    if (kondisi.lelah) skor -= 15;
    if (kondisi.sakit) skor -= 20;
    if (kondisi.emosi) skor -= 10;

    // Penalti umur
    if (umur < 12) skor -= 5;
    else if (umur > 40) skor -= 10;

    if (skor < 0) skor = 0;

    document.getElementById("hasilSkor").innerText = "Skor Kesehatan: " + skor + "/100";

    // Saran AI
    let saran = "Kondisi cukup stabil.";

    if (skor >= 85) saran = "Kondisi kamu ideal! Tetap jaga pola makan dan aktivitas.";
    else if (skor >= 65) saran = "Cukup baik. Olahraga ringan 2–3x seminggu disarankan.";
    else if (skor >= 40) saran = "Perhatikan pola tidur, nutrisi, dan aktivitas fisik.";
    else if (skor < 40) saran = "Kondisi kurang ideal. Konsultasi kesehatan dan istirahat cukup.";

    // Saran khusus kondisi
    if (kondisi.lelah) saran += " • Cepat lelah, perbaiki pola tidur dan gizi.";
    if (kondisi.sakit) saran += " • Mudah sakit, tingkatkan imun dan olahraga ringan.";
    if (kondisi.emosi) saran += " • Mudah berubah ekspresi, lakukan relaksasi.";

    document.getElementById("aiSaran").innerText = saran;
}

// Update otomatis real-time saat input berubah
document.getElementById("tb").addEventListener("input", updateHealth);
document.getElementById("bb").addEventListener("input", updateHealth);
document.getElementById("umur").addEventListener("input", updateHealth);
 

      
