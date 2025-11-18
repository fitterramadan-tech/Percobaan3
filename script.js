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

    // 3. Klasifikasi BMI
    let statusBmi = '';
    let statusClass = '';
    if (bmi < 18.5) {
        statusBmi = 'Tak Ideal (Kurang Berat Badan)';
        statusClass = 'non-ideal';
    } else if (bmi >= 18.5 && bmi < 25.0) {
        statusBmi = 'Idealis';
        statusClass = 'ideal';
    } else if (bmi >= 25.0 && bmi < 30.0) {
        statusBmi = 'Tak Ideal (Kelebihan Berat Badan)';
        statusClass = 'non-ideal';
    } else {
        statusBmi = 'Obesitas';
        statusClass = 'obese';
    }

    // 4. Hitung Skor Keseharian
    let score = 0;
    // Ambil semua checkbox dalam grup
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Ambil nilai dari attribute value (misalnya: "-3", "+4")
            score += parseInt(checkbox.value); 
        }
    });

    // 5. Tentukan Judul dan Saran
    let resultTitle = '';
    let suggestions = [];

    if (statusClass === 'ideal') {
        resultTitle = `Selamat, ${name}! Hebat! Kamu Ada di Jalur Ceria Terbaik! ✨`;
        suggestions.push("Pertahankan konsistensi dalam pola makan dan olahraga.");
        suggestions.push("Tingkatkan kualitas tidur dan manajemen stres.");
        if (score < 5) suggestions.push(`Skor keseharianmu (${score}) masih bisa ditingkatkan! Perhatikan faktor kelelahan, mood, atau sakit.`);

    } else if (statusBmi.includes('Kurang Berat Badan')) {
        resultTitle = `Halo, ${name}! Semangat! Sedikit Lagi Mencapai Ideal! 💪`;
        suggestions.push("Fokus pada peningkatan massa otot dan asupan kalori yang berkualitas.");
        suggestions.push("Makan lebih sering dengan porsi kecil, utamakan protein dan lemak sehat.");
        suggestions.push("Latihan beban ringan sangat dianjurkan.");

    } else if (statusBmi.includes('Kelebihan Berat Badan')) {
        resultTitle = `Halo, ${name}! Semangat! Sedikit Lagi Mencapai Ideal! 🏃`;
        suggestions.push("Fokus pada defisit kalori ringan dan bertahap. Hindari diet ekstrem.");
        suggestions.push("Tingkatkan olahraga kardio (jalan kaki, jogging) dan tambahkan latihan beban.");
        suggestions.push("Kurangi asupan gula dan minuman manis.");

    } else if (statusClass === 'obese') {
        resultTitle = `Perhatian, ${name}! Waktunya Ambil Langkah Serius! 🛑`;
        suggestions.push("Prioritas Utama: Penurunan berat badan harus menjadi fokus kesehatan Anda.");
        suggestions.push("Sangat disarankan untuk berkonsultasi dengan ahli gizi dan/atau dokter.");
        suggestions.push("Mulai dari hal kecil: jalan kaki 30 menit sehari dan mengurangi porsi makan perlahan.");
    }
    
    // Tambahkan saran umum terkait skor keseharian jika nilainya rendah
    if (score <= 0 && statusClass !== 'obese') {
        suggestions.push("🔴 Peringatan Skor Rendah: Keluhan lelah/sakit/mood menunjukkan kualitas keseharian perlu diperbaiki. Cek lagi pola tidur dan hidrasi Anda!");
    }

    // 6. Tampilkan Hasil
    const resultDiv = document.getElementById('result');
    
    let suggestionHtml = suggestions.map(s => `<li>${s}</li>`).join('');

    resultDiv.innerHTML = `
        <h2 class="${statusClass}">${resultTitle}</h2>
        <div class="result-data ${statusClass}">
            <p><strong>Nilai BMI Anda:</strong> ${bmi.toFixed(2)} (${statusBmi})</p>
            <p><strong>Skor Keseharian Anda:</strong> <span class="result-status ${statusClass}">${score}</span> Poin</p>
        </div>
        
        <h3>✅ Saran Spesifik Untukmu:</h3>
        <ul class="suggestion-list">
            ${suggestionHtml}
        </ul>
    `;
    
    // Tampilkan div hasil
    resultDiv.classList.remove('hidden');
    
    // Gulir ke hasil
    resultDiv.scrollIntoView({ behavior: 'smooth' });
});
