// ==================== QUEUE CLASS ====================
class ExerciseQueue {
  constructor() {
    this.items = [];
  }

  // Enqueue: Tambah item ke belakang antrian
  enqueue(item) {
    this.items.push(item);
  }

  // Dequeue: Hapus dan kembalikan item pertama
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  // Peek: Lihat item pertama tanpa menghapus
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  // Check if queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get queue size
  size() {
    return this.items.length;
  }

  // Clear all items
  clear() {
    this.items = [];
  }

  // Get all items
  getAll() {
    return this.items;
  }
}

// Initialize Queue
const exerciseQueue = new ExerciseQueue();
let exerciseData = [];
let categories = new Set();

// ==================== LOAD JSON DATA ====================
async function loadExerciseData() {
  try {
    const response = await fetch('/static/json/DataOlahraga1.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    exerciseData = await response.json();
    
    console.log('✅ Data olahraga berhasil dimuat:', exerciseData.length, 'olahraga');
    
    // Extract categories
    exerciseData.forEach(ex => {
      if (ex.Category) {
        categories.add(ex.Category);
      }
    });
    
    // Populate category filter
    const filterSelect = document.getElementById('filterCategory');
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filterSelect.appendChild(option);
    });
    
    // Initialize dengan semua data
    currentFilteredExercises = exerciseData;
    displayExerciseList(exerciseData);
    
  } catch (error) {
    console.error('❌ Error loading exercise data:', error);
    alert('Gagal memuat data olahraga. Pastikan file exercises.json ada di folder static/');
    
    // Show error in modal
    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          <h6>Error Loading Data</h6>
          <p class="mb-0">Gagal memuat data olahraga. Pastikan file <code>static/exercises.json</code> ada dan formatnya benar.</p>
        </div>
      </div>
    `;
  }
}

// ==================== DISPLAY EXERCISE LIST ====================
function displayExerciseList(exercises) {
  const exerciseList = document.getElementById('exerciseList');
  
  console.log('📋 Menampilkan', exercises.length, 'olahraga');
  
  if (!exercises || exercises.length === 0) {
    exerciseList.innerHTML = `
      <div class="col-12 text-center py-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-inbox text-muted mb-3" viewBox="0 0 16 16">
          <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"/>
        </svg>
        <p class="text-muted">Tidak ada olahraga yang ditemukan</p>
        <small class="text-muted">Coba ubah kata kunci pencarian atau filter kategori</small>
      </div>
    `;
    return;
  }
  
  exerciseList.innerHTML = exercises.map((exercise, index) => {
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 exercise-card" onclick="selectExerciseByIndex(${index})" style="cursor: pointer;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="card-title mb-0 flex-grow-1">${exercise.Activity}</h6>
              <span class="badge bg-success ms-2">${exercise.MET}</span>
            </div>
            <p class="card-text small text-muted mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-tag me-1" viewBox="0 0 16 16">
                <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
              </svg>
              ${exercise.Category || 'Olahraga'}
            </p>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  console.log('✅ Tampilan list berhasil diupdate');
}

// ==================== SEARCH & FILTER ====================
let currentFilteredExercises = [];

document.getElementById('searchExercise').addEventListener('input', (e) => {
  filterExercises();
});

document.getElementById('filterCategory').addEventListener('change', (e) => {
  filterExercises();
});

function filterExercises() {
  const searchTerm = document.getElementById('searchExercise').value.toLowerCase();
  const selectedCategory = document.getElementById('filterCategory').value;
  
  console.log('🔍 Searching:', searchTerm, 'Category:', selectedCategory);
  
  // Jika tidak ada filter, tampilkan semua
  if (!searchTerm && !selectedCategory) {
    currentFilteredExercises = exerciseData;
  } else {
    currentFilteredExercises = exerciseData.filter(ex => {
      const matchSearch = !searchTerm || ex.Activity.toLowerCase().includes(searchTerm);
      const matchCategory = !selectedCategory || ex.Category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }
  
  console.log('📊 Found:', currentFilteredExercises.length, 'exercises');
  displayExerciseList(currentFilteredExercises);
}

// ==================== SELECT EXERCISE ====================
function selectExerciseByIndex(index) {
  // Gunakan currentFilteredExercises yang sedang ditampilkan
  const exercise = currentFilteredExercises[index];
  
  if (!exercise) {
    console.error('❌ Exercise not found at index:', index);
    alert('Error: Olahraga tidak ditemukan. Silakan coba lagi.');
    return;
  }
  
  console.log('✅ Selected:', exercise.Activity);
  selectExercise(exercise.Activity, exercise.MET, exercise.Category || 'Olahraga');
}

function selectExercise(name, met, category) {
  console.log('📝 Setting exercise:', name, 'MET:', met, 'Category:', category);
  
  document.getElementById('selectedExerciseName').textContent = name;
  document.getElementById('selectedExerciseData').value = JSON.stringify({name, met, category});
  
  // Close exercise modal
  const exerciseModal = bootstrap.Modal.getInstance(document.getElementById('exerciseModal'));
  exerciseModal.hide();
  
  // Open duration modal
  const durationModal = new bootstrap.Modal(document.getElementById('durationModal'));
  durationModal.show();
  
  // Focus on duration input
  setTimeout(() => {
    document.getElementById('duration').focus();
  }, 500);
}

// ==================== ADD TO QUEUE ====================
document.getElementById('addToQueueBtn').addEventListener('click', () => {
  const duration = parseInt(document.getElementById('duration').value);
  const exerciseData = JSON.parse(document.getElementById('selectedExerciseData').value);
  
  if (!duration || duration <= 0) {
    alert('⚠️ Masukkan durasi yang valid!');
    return;
  }
  
  // Enqueue item
  exerciseQueue.enqueue({
    name: exerciseData.name,
    met: exerciseData.met,
    category: exerciseData.category,
    duration: duration,
    timestamp: new Date().toLocaleString('id-ID')
  });
  
  // Reset form
  document.getElementById('duration').value = '';
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('durationModal'));
  modal.hide();
  
  // Update display
  updateQueueDisplay();
  
  // Show success message
  showToast('success', `✅ ${exerciseData.name} ditambahkan ke antrian!`);
});

// ==================== UPDATE QUEUE DISPLAY ====================
function updateQueueDisplay() {
  const queueDisplay = document.getElementById('queueDisplay');
  const emptyState = document.getElementById('emptyState');
  const queueControls = document.getElementById('queueControls');
  const queueCount = document.getElementById('queueCount');
  
  const items = exerciseQueue.getAll();
  queueCount.textContent = items.length;
  
  if (items.length === 0) {
    emptyState.style.display = 'block';
    queueDisplay.innerHTML = '';
    queueControls.style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  queueControls.style.display = 'block';
  
  queueDisplay.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-success">
          <tr>
            <th style="width: 60px;" class="text-center">Urutan</th>
            <th>Nama Olahraga</th>
            <th class="text-center" style="width: 120px;">Waktu (menit)</th>
            <th class="text-end" style="width: 150px;">Total Kalori</th>
            <th style="width: 100px;" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => {
            const weight = parseFloat(document.getElementById('beratBadan').value) || 0;
            const calories = weight > 0 ? calculateCalories(item.met, weight, item.duration) : 0;
            
            return `
              <tr class="${index === 0 ? 'table-primary' : ''}">
                <td class="text-center">
                  ${index === 0 ? 
                    '<span class="badge bg-success">FIRST</span>' : 
                    `<span class="badge bg-secondary">${index + 1}</span>`
                  }
                </td>
                <td>
                  <div>
                    <strong>${item.name}</strong>
                    <br>
                    <small class="text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-tag me-1" viewBox="0 0 16 16">
                        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
                      </svg>
                      ${item.category} | MET: ${item.met}
                    </small>
                  </div>
                </td>
                <td class="text-center">
                  <span class="badge bg-info text-dark fs-6">${item.duration}</span>
                </td>
                <td class="text-end">
                  ${weight > 0 ? 
                    `<strong class="text-success">${calories.toFixed(2)} kal</strong>` : 
                    '<small class="text-muted">Masukkan berat badan</small>'
                  }
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-danger" onclick="removeFromQueue(${index})" title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==================== REMOVE FROM QUEUE ====================
function removeFromQueue(index) {
  if (confirm('Hapus olahraga ini dari antrian?')) {
    const item = exerciseQueue.items[index];
    exerciseQueue.items.splice(index, 1);
    updateQueueDisplay();
    showToast('info', `🗑️ ${item.name} dihapus dari antrian`);
  }
}

// ==================== DEQUEUE ====================
document.getElementById('dequeueBtn').addEventListener('click', () => {
  const item = exerciseQueue.dequeue();
  if (item) {
    updateQueueDisplay();
    showToast('primary', `✅ ${item.name} diproses dan dihapus dari antrian (Dequeue)`);
  } else {
    alert('❌ Antrian kosong!');
  }
});

// ==================== PEEK ====================
document.getElementById('peekBtn').addEventListener('click', () => {
  const item = exerciseQueue.peek();
  if (item) {
    alert(`👀 Olahraga Pertama (Peek):\n\n📌 ${item.name}\n⏱️ Durasi: ${item.duration} menit\n🔥 MET: ${item.met}`);
  } else {
    alert('❌ Antrian kosong!');
  }
});

// ==================== CLEAR QUEUE ====================
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('⚠️ Hapus semua olahraga dari antrian?')) {
    exerciseQueue.clear();
    updateQueueDisplay();
    showToast('danger', '🗑️ Semua olahraga telah dihapus dari antrian');
  }
});

// ==================== CALCULATE TOTAL ====================
document.getElementById('calculateBtn').addEventListener('click', () => {
  const weight = parseFloat(document.getElementById('beratBadan').value);
  
  if (!weight || weight <= 0) {
    alert('⚠️ Masukkan berat badan terlebih dahulu!');
    document.getElementById('beratBadan').focus();
    return;
  }
  
  const items = exerciseQueue.getAll();
  
  if (items.length === 0) {
    alert('❌ Antrian kosong! Tambahkan olahraga terlebih dahulu.');
    return;
  }
  
  let totalDuration = 0;
  let totalCalories = 0;
  
  const results = items.map((item, index) => {
    const calories = calculateCalories(item.met, weight, item.duration);
    totalDuration += item.duration;
    totalCalories += calories;
    
    return {
      no: index + 1,
      name: item.name,
      category: item.category,
      met: item.met,
      duration: item.duration,
      calories: calories
    };
  });
  
  showResult(results, totalDuration, totalCalories, weight);
});

// ==================== CALCULATE CALORIES ====================
function calculateCalories(met, weight, durationMinutes) {
  const durationHours = durationMinutes / 60;
  return met * weight * durationHours;
}

// ==================== SHOW RESULT ====================
function showResult(results, totalDuration, totalCalories, weight) {
  const resultContent = document.getElementById('resultContent');
  
  const avgCaloriesPerMinute = totalCalories / totalDuration;
  const foodEquivalent = Math.floor(totalCalories / 150); // 1 mangkuk nasi ~150 kal
  
  resultContent.innerHTML = `
    <div class="alert alert-success d-flex align-items-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check-circle me-3 flex-shrink-0" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
      </svg>
      <div>
        <h5 class="mb-1">Perhitungan Selesai!</h5>
        <p class="mb-0">Berat Badan: <strong>${weight} kg</strong> | Total Olahraga: <strong>${results.length}</strong></p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4 g-3">
      <div class="col-md-4">
        <div class="card bg-primary text-white h-100">
          <div class="card-body text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-clock mb-2" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
            </svg>
            <h6>Total Waktu</h6>
            <h2 class="mb-0">${totalDuration}</h2>
            <small>menit</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-danger text-white h-100">
          <div class="card-body text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-fire mb-2" viewBox="0 0 16 16">
              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
            </svg>
            <h6>Total Kalori</h6>
            <h2 class="mb-0">${totalCalories.toFixed(2)}</h2>
            <small>kalori</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-info text-white h-100">
          <div class="card-body text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-graph-up mb-2" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"/>
            </svg>
            <h6>Rata-rata</h6>
            <h2 class="mb-0">${avgCaloriesPerMinute.toFixed(2)}</h2>
            <small>kal/menit</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Table -->
    <div class="table-responsive mb-4">
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr>
            <th class="text-center" style="width: 50px;">No</th>
            <th>Nama Olahraga</th>
            <th class="text-center" style="width: 100px;">MET</th>
            <th class="text-center" style="width: 120px;">Waktu (menit)</th>
            <th class="text-end" style="width: 150px;">Total Kalori</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(item => `
            <tr>
              <td class="text-center">${item.no}</td>
              <td>
                <strong>${item.name}</strong>
                <br>
                <small class="text-muted">${item.category}</small>
              </td>
              <td class="text-center"><span class="badge bg-info text-dark">${item.met}</span></td>
              <td class="text-center"><strong>${item.duration}</strong></td>
              <td class="text-end"><strong class="text-success">${item.calories.toFixed(2)} kal</strong></td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot class="table-light">
          <tr class="fw-bold">
            <td colspan="3" class="text-end">TOTAL:</td>
            <td class="text-center text-primary">${totalDuration} menit</td>
            <td class="text-end text-danger">${totalCalories.toFixed(2)} kal</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Additional Info -->
    <div class="row g-3">
      <div class="col-md-6">
        <div class="card border-warning">
          <div class="card-body">
            <h6 class="text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-egg-fried me-1" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
              </svg>
              Setara Makanan
            </h6>
            <p class="mb-0">
              <strong class="fs-4">${foodEquivalent}</strong> mangkuk nasi putih
              <br>
              <small class="text-muted">(~150 kalori per mangkuk)</small>
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-info">
          <div class="card-body">
            <h6 class="text-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calculator me-1" viewBox="0 0 16 16">
                <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
              </svg>
              Rumus Perhitungan
            </h6>
            <p class="mb-0">
              <code>Kalori = MET × Berat Badan × (Durasi / 60)</code>
              <br>
              <small class="text-muted">MET = Metabolic Equivalent of Task</small>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-light border mt-3">
      <small class="text-muted">
        <strong>💡 Tips:</strong> Untuk hasil yang optimal, lakukan olahraga secara teratur dan sesuaikan dengan kemampuan tubuh Anda. 
        Konsultasikan dengan dokter atau ahli gizi untuk program olahraga yang sesuai.
      </small>
    </div>
  `;
  
  const modal = new bootstrap.Modal(document.getElementById('resultModal'));
  modal.show();
}

// ==================== TOAST NOTIFICATION ====================
function showToast(type, message) {
  const colors = {
    success: '#198754',
    danger: '#dc3545',
    info: '#0dcaf0',
    warning: '#ffc107',
    primary: '#0d6efd'
  };
  
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 p-3';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show shadow" role="alert" style="min-width: 300px;">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==================== UPDATE DISPLAY ON WEIGHT CHANGE ====================
document.getElementById('beratBadan').addEventListener('input', () => {
  if (exerciseQueue.size() > 0) {
    updateQueueDisplay();
  }
});

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
  loadExerciseData();
  updateQueueDisplay();
  
  // Initialize currentFilteredExercises
  currentFilteredExercises = [];
});

// Allow Enter key to add to queue
document.getElementById('duration').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('addToQueueBtn').click();
  }
});
