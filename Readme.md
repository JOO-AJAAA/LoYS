# 🧮 Calculator Calory, Obesity Prediction & Exercise Planning

**Calculator Calory** adalah web aplikasi berbasis **Flask** yang dirancang untuk membantu pengguna memahami kondisi tubuh mereka (melalui prediksi obesitas) dan merencanakan latihan fisik yang sesuai dengan kebutuhan kalori mereka.  
Aplikasi ini menggabungkan **machine learning (Random Forest)** untuk prediksi obesitas, serta sistem interaktif berbasis **JavaScript dan Bootstrap** untuk manajemen aktivitas olahraga dan perhitungan kalori.

---

## 🎯 Tujuan Proyek

Tujuan utama dari proyek ini adalah memberikan **alat bantu cerdas** yang:
1. Dapat **memprediksi tingkat obesitas** seseorang berdasarkan data pribadi dan kebiasaan hidup.
2. Membantu pengguna **merencanakan latihan olahraga yang tepat** sesuai kebutuhan.
3. Memberikan estimasi **kalori yang terbakar** dari berbagai aktivitas olahraga.

Proyek ini dikembangkan sebagai gabungan antara **machine learning, web development, dan health informatics**, sehingga bersifat **edukatif dan aplikatif**.

---

## 🧠 Fitur Utama

### 🔹 1. Prediksi Obesitas (Obesity Prediction)
- Menggunakan **model Random Forest** yang dilatih dengan dataset gaya hidup dan data tubuh.
- Input yang diminta antara lain:
  - Jenis kelamin  
  - Usia  
  - Tinggi dan berat badan  
  - Riwayat obesitas keluarga  
  - Kebiasaan makan (frekuensi makan cepat saji, minum air, ngemil, dsb)
- Data dikonversi menggunakan **Label Encoding** dan **MinMaxScaler** yang disimpan di file `.pkl` menggunakan `joblib`.
- Output berupa kategori hasil prediksi, seperti:
  - Insufficient Weight  
  - Normal Weight  
  - Overweight Level I / II  
  - Obesity Type I / II / III

📊 **Model Machine Learning**
- Algoritma: `RandomForestClassifier`
- Normalisasi numerik: `MinMaxScaler`
- Penyimpanan model & scaler: `joblib`

---

### 🔹 2. Exercise Planning (Perencanaan Latihan)
Fitur ini berfungsi sebagai **daftar latihan digital** yang memungkinkan pengguna memilih berbagai jenis olahraga dari database JSON.

- Data diambil dari file `/static/json/DataOlahraga1.json`.
- Tiap olahraga memiliki atribut:
  - **Activity** → Nama olahraga (misal: Jogging, Cycling, Swimming)
  - **MET (Metabolic Equivalent of Task)** → Tingkat intensitas aktivitas
  - **Category** → Jenis latihan (Cardio, Strength, Flexibility, dll.)
- Pengguna dapat:
  - Mencari olahraga berdasarkan nama.
  - Memfilter berdasarkan kategori.
  - Menambahkan olahraga ke **daftar antrian latihan (queue)**.
- Setiap aktivitas yang dipilih dapat diatur durasinya (dalam menit).

💡 Data olahraga ditampilkan secara dinamis menggunakan **Fetch API** dan **Bootstrap Cards**.

---

### 🔹 3. Calorie Calculator (Perhitungan Kalori)
Fitur ini menghitung total kalori yang terbakar berdasarkan durasi latihan dan berat badan pengguna.

📘 **Rumus yang digunakan:**
\[
Kalori = MET \times Berat\,(kg) \times Durasi\,(jam)
\]

- Nilai MET diambil dari data olahraga yang dipilih.
- Hasil langsung ditampilkan di halaman web dengan modal interaktif Bootstrap.
- Pengguna bisa menambahkan beberapa aktivitas sekaligus, dan aplikasi akan menghitung **total kalori keseluruhan**.

---

## 🧩 Arsitektur Aplikasi

