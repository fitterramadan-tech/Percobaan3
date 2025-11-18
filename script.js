// Ganti seluruh isi file script.js dengan kode ini

function calculateScore() {
    // 1. Ambil Nilai dari Input Dasar
    const name = document.getElementById('name').value;
    const heightCm = parseFloat(document.getElementById('height').value);
    const weightKg = parseFloat(document.getElementById('weight').value);

    // Verifikasi Input Dasar
    if (!name || isNaN(heightCm) || heightCm <= 0 || isNaN(weightKg) || weightKg <= 0) {
        alert("Mohon lengkapi semua data dengan angka yang valid (Tinggi Badan, Berat Badan, dan Nama Panggilan).");
        return; 
    }

    // 2. Hitung BMI
    const heightM = heightCm / 100;
    // Formula BMI: Berat Badan (kg) / (Tinggi Badan (m))^2
    const bmi = weightKg / (heightM * heightM);

    // 3. Klasifikasi BMI dan Tentukan Bobot Awal (Weight Factor)
    let statusBmi = '';
    let statusClass = '';
    let healthScoreWeight = 0; // Bobot awal berdasarkan BMI

    if (bmi < 18.5) {
        statusBmi = 'Tak Ideal (Kurang Berat Badan)';
        statusClass = 'non-ideal';
        healthScoreWeight = -15; 
    } else if (bmi >= 18.5 && bmi < 25.0) {
        statusBmi = 'Idealis';
        statusClass = 'ideal';
        healthScoreWeight = 10; 
    } else if (bmi >= 25.0 && bmi < 30.0) {
        statusBmi = 'Tak Ideal (Kelebihan Berat Badan)';
        statusClass = 'non-ideal';
        healthScoreWeight = -10; 
    } else {
        statusBmi = 'Obesitas';
        statusClass = 'obese';
        healthScoreWeight = -30; 
    }

    // 4. Hitung Skor Keseharian (Gaya Hidup)
    let lifestyleScore = 0;
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const hasFatigue = document.getElementById('fatigue').checked;
    const hasMoody = document.getElementById('moody').checked;
    const hasSick = document.getElementById('sick').checked;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Pastikan nilai adalah angka sebelum ditambahkan
            const value = parseInt(checkbox.value);
            if (!isNaN(value)) {
                lifestyleScore += value; 
            }
        }
    });

    // 5. PENILAIAN AI SEDERHANA: Gabungkan BMI dan Gaya Hidup
    // Total Health Index = Bobot BMI + Skor Gaya Hidup
    const totalHealthIndex = healthScoreWeight + lifestyleScore;

    // Tentukan Level Kesehatan Berdasarkan Total Index
    let healthLevel = '';
    if (totalHealthIndex >= 15) {
        healthLevel = 'Luar Biasa!'; 
    } else if (totalHealthIndex >= 5) {
        healthLevel = 'Sangat Baik'; 
    } else if (totalHealthIndex > -10) {
        healthLevel = 'Perlu Perhatian'; 
    } else {
        healthLevel = 'Waspada Tinggi'; 
    }

    // 6. Tentukan Judul dan Saran Berdasarkan Kombinasi (AI Logic)
    let resultTitle = '';
    let suggestions = [];

    // Logika Judul Berdasarkan Status BMI
    if (statusClass === 'ideal') {
        resultTitle = `Selamat, ${name}! Status Berat Badanmu ${statusBmi}. 🎉`;
        suggestions.push("✅ **Pertahankan!** Berat badan dan BMI Anda sudah ideal.");
    } else if (statusClass === 'non-ideal') {
        resultTitle = `Halo, ${name}! Status Berat Badanmu ${statusBmi}. 🚧`;
    } else if (statusClass === 'obese') {
        resultTitle = `Waspada, ${name}! Status Berat Badanmu ${statusBmi}. 🚨`;
    }
    
    // Logika Saran Berdasarkan Detail Status BMI
    if (statusBmi.includes('Kurang Berat Badan')) {
        suggestions.push("Fokus utama: Kenaikan berat badan yang sehat melalui peningkatan massa otot dan asupan kalori berkualitas.");
    } else if (statusBmi.includes('Kelebihan Berat Badan')) {
        suggestions.push("Fokus utama: Penurunan berat badan secara perlahan dan terencana (defisit kalori ringan). Tingkatkan aktivitas fisik.");
    } else if (statusBmi.includes('Obesitas')) {
        suggestions.push("🛑 **Prioritas Utama:** Konsultasi profesional (Ahli Gizi/Dokter) sangat diwajibkan untuk program penurunan berat badan yang aman.");
    }

    // Logika Saran Berdasarkan Gaya Hidup (Skor Keseharian)
    if (hasSick || hasFatigue || hasMoody) {
        suggestions.push("😥 **Keluhan Kesehatan Ditemukan:** Perhatikan pola tidur, manajemen stres, dan pastikan asupan vitamin serta mineral Anda cukup. Jangan abaikan sinyal tubuh ini.");
    } else {
        suggestions.push("👍 **Keseharian Terjaga:** Anda tampak bertenaga. Terus jaga kebiasaan baik seperti tidur dan hidrasi yang cukup.");
    }
    
    // Logika Saran Tambahan Berdasarkan Total Index
    if (totalHealthIndex < -10) {
        suggestions.push("🔥 **INDEKS RENDAH:** Kombinasi berat badan dan gaya hidup yang buruk memerlukan perhatian segera dan komitmen serius untuk berubah.");
    }

    // 7. Tampilkan Hasil
    const resultDiv = document.getElementById('result');
    
    let suggestionHtml = suggestions.map(s => `<li>${s}</li>`).join('');

    resultDiv.innerHTML = `
        <h2 class="${statusClass}">${resultTitle}</h2>
        
        <div class="result-data ${statusClass}">
            <h3>Tingkat Kesehatanmu: ${healthLevel}</h3>
            <p><strong>Nilai BMI Anda:</strong> ${bmi.toFixed(2)} (${statusBmi})</p>
            <p><strong>Skor Gaya Hidup:</strong> <span class="result-status ${statusClass}">${lifestyleScore}</span> Poin</p>
            <p><strong>INDEKS KESEHATAN TOTAL (AI):</strong> <span class="result-status ${statusClass}">${totalHealthIndex}</span></p>
        </div>
        
        <h3>💡 Analisis dan Saran Spesifik:</h3>
        <ul class="suggestion-list">
            ${suggestionHtml}
        </ul>
    `;
    
    resultDiv.classList.remove('hidden');
    
    // Gulir ke hasil
    resultDiv.scrollIntoView({ behavior: 'smooth' });
              }
