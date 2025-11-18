document.getElementById('healthForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Ambil Nilai dari Input Dasar
    const name = document.getElementById('name').value;
    const heightCm = parseFloat(document.getElementById('height').value);
    const weightKg = parseFloat(document.getElementById('weight').value);

    // 2. Hitung BMI
    const heightM = heightCm / 100;
    // Formula BMI: Berat Badan (kg) / (Tinggi Badan (m))^2
    const bmi = weightKg / (heightM * heightM);

    // 3. Klasifikasi BMI dan Tentukan Bobot Awal (Weight Factor)
    let statusBmi = '';
    let statusClass = '';
    let healthScoreWeight = 0; // Bobot awal berdasarkan BMI, 0 = netral/ideal

    if (bmi < 18.5) {
        statusBmi = 'Tak Ideal (Kurang Berat Badan)';
        statusClass = 'non-ideal';
        healthScoreWeight = -15; // Bobot negatif besar untuk kurang berat
    } else if (bmi >= 18.5 && bmi < 25.0) {
        statusBmi = 'Idealis';
        statusClass = 'ideal';
        healthScoreWeight = 10; // Bobot positif untuk ideal
    } else if (bmi >= 25.0 && bmi < 30.0) {
        statusBmi = 'Tak Ideal (Kelebihan Berat Badan)';
        statusClass = 'non-ideal';
        healthScoreWeight = -10; // Bobot negatif untuk kelebihan berat
    } else {
        statusBmi = 'Obesitas';
        statusClass = 'obese';
        healthScoreWeight = -30; // Bobot negatif sangat besar untuk obesitas
    }

    // 4. Hitung Skor Keseharian (Gaya Hidup)
    let lifestyleScore = 0;
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const hasFatigue = document.getElementById('fatigue').checked;
    const hasMoody = document.getElementById('moody').checked;
    const hasSick = document.getElementById('sick').checked;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            lifestyleScore += parseInt(checkbox.value); 
        }
    });

    // 5. PENILAIAN AI SEDERHANA: Gabungkan BMI dan Gaya Hidup
    // Total Health Index = Bobot BMI + Skor Gaya Hidup
    const totalHealthIndex = healthScoreWeight + lifestyleScore;

    // Tentukan Level Kesehatan Berdasarkan Total Index
    let healthLevel = '';
    if (totalHealthIndex >= 15) {
        healthLevel = 'Luar Biasa!'; // Ideal BMI + Skor Gaya Hidup Tinggi
    } else if (totalHealthIndex >= 5) {
        healthLevel = 'Sangat Baik'; // Ideal BMI + Skor Gaya Hidup Menengah
    } else if (totalHealthIndex > -10) {
        healthLevel = 'Perlu Perhatian'; // BMI Non-Ideal RINGAN atau Ideal BMI + Skor Gaya Hidup Rendah
    } else {
        healthLevel = 'Waspada Tinggi'; // Obesitas atau BMI Non-Ideal + Skor Gaya Hidup Negatif
    }

    // 6. Tentukan Judul dan Saran Berdasarkan Kombinasi (AI Logic)
    let resultTitle = '';
    let suggestions = [];

    // Kasus 1: IDEAL (BMI NORMAL)
    if (statusClass === 'ideal') {
        resultTitle = `Selamat, ${name}! Status Berat Badanmu ${statusBmi}. 🎉`;
        suggestions.push("✅ **Pertahankan!** Berat badan dan BMI Anda sudah ideal.");
        
        if (lifestyleScore >= 5) {
            suggestions.push(`👍 **Skor Gaya Hidup (${lifestyleScore}) Luar Biasa!** Terus jaga pola tidur dan hidrasi.`);
        } else if (lifestyleScore < 0) {
            resultTitle = `Selamat, ${name}! Status Berat Badanmu ${statusBmi}, TAPI... 😔`;
            suggestions.push(`⚠️ **Skor Gaya Hidup (${lifestyleScore}) Rendah!** Meskipun badan ideal, keluhan (Lelah, Sakit, Mood) menunjukkan ada yang salah di keseharian Anda.`);
            suggestions.push("Fokus pada kualitas nutrisi, bukan hanya kuantitas, dan manajemen stres.");
        }

    // Kasus 2: NON-IDEAL (Kurang/Lebih Berat Badan)
    } else if (statusClass === 'non-ideal') {
        resultTitle = `Halo, ${name}! Status Berat Badanmu ${statusBmi}. 🚧`;
        
        if (statusBmi.includes('Kurang Berat Badan')) {
            suggestions.push("Fokus utama: Kenaikan berat badan yang sehat melalui peningkatan massa otot.");
            suggestions.push("Makan makanan padat nutrisi lebih sering; utamakan protein.");
        } else { // Kelebihan Berat Badan
            suggestions.push("Fokus utama: Penurunan berat badan secara perlahan dan terencana (defisit kalori).");
            suggestions.push("Tingkatkan aktivitas fisik harian (jalan kaki, tangga).");
        }

        if (hasSick || hasFatigue || hasMoody) {
            suggestions.push("😥 Keluhan kesehatan (lelah/sakit/mood) sering terkait dengan ketidakseimbangan nutrisi. Cek asupan vitamin dan mineral Anda.");
        } else {
            suggestions.push("👍 Poin positif: Walau BMI non-ideal, keseharian Anda tampak bertenaga. Terus dorong perubahan gaya hidup!");
        }

    // Kasus 3: OBESITAS
    } else if (statusClass === 'obese') {
        resultTitle = `Waspada, ${name}! Status Berat Badanmu ${statusBmi}. 🚨`;
        suggestions.push("🛑 **Prioritas Utama:** Berat badan berlebih sangat meningkatkan risiko penyakit. Segera buat rencana aksi.");
        suggestions.push("Konsultasi profesional (Ahli Gizi/Dokter) sangat diwajibkan untuk program penurunan berat badan yang aman.");
        
        if (lifestyleScore < 0) {
            suggestions.push("🔥 **Kondisi Berlipat Ganda:** Skor Gaya Hidup Negatif menambah risiko Anda. Perbaiki tidur dan kurangi makanan olahan secara drastis.");
        }
    }

    // 7. Tampilkan Hasil (Menggunakan Total Health Index)
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
    resultDiv.scrollIntoView({ behavior: 'smooth' });
});
