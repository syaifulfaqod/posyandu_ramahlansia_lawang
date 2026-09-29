export const initialLansiaData = [
  { id: 'L001', nik: '3201010101500001', nama: 'Siti Aminah', jk: 'P', usia: 72, tglLahir: '1954-01-15', alamat: 'Jl. Merpati No. 12', kelurahan: 'Lawang', rw: '01', rt: '02', lastVisit: '2026-09-01', status: 'Rujuk', skilas: 'Abnormal', aks: 18, puma: 4, riwayat: [{ tglKunjungan: '2026-09-01', bb: '55', tb: '150', tdSistole: '150', tdDiastole: '90', skilas: 'Abnormal', aks: 18, puma: 4, status: 'Rujuk' }] },
  { id: 'L002', nik: '3201010202450002', nama: 'Budi Santoso', jk: 'L', usia: 81, tglLahir: '1945-02-20', alamat: 'Gg. Kancil', kelurahan: 'Kalirejo', rw: '03', rt: '05', lastVisit: '2026-09-05', status: 'Pantau', skilas: 'Normal', aks: 21, puma: 7, riwayat: [{ tglKunjungan: '2026-09-05', bb: '60', tb: '165', tdSistole: '130', tdDiastole: '80', skilas: 'Normal', aks: 21, puma: 7, status: 'Pantau' }] },
  { id: 'L003', nik: '3201010303600003', nama: 'Ratna Ningsih', jk: 'P', usia: 66, tglLahir: '1960-03-10', alamat: 'Perum Asri Blok B/4', kelurahan: 'Lawang', rw: '02', rt: '01', lastVisit: '2026-09-10', status: 'Normal', skilas: 'Normal', aks: 24, puma: 2, riwayat: [{ tglKunjungan: '2026-09-10', bb: '58', tb: '155', tdSistole: '120', tdDiastole: '80', skilas: 'Normal', aks: 24, puma: 2, status: 'Normal' }] },
  { id: 'L004', nik: '3201010404550004', nama: 'Agus Wijaya', jk: 'L', usia: 71, tglLahir: '1955-04-25', alamat: 'Jl. Kenangan No. 8', kelurahan: 'Kalirejo', rw: '01', rt: '03', lastVisit: '2026-08-20', status: 'Rujuk', skilas: 'Abnormal', aks: 15, puma: 8, riwayat: [{ tglKunjungan: '2026-08-20', bb: '65', tb: '160', tdSistole: '160', tdDiastole: '95', skilas: 'Abnormal', aks: 15, puma: 8, status: 'Rujuk' }] },
  { id: 'L005', nik: '3201010505620005', nama: 'Endang Lestari', jk: 'P', usia: 64, tglLahir: '1962-05-30', alamat: 'Jl. Mawar No. 3', kelurahan: 'Lawang', rw: '04', rt: '02', lastVisit: '2026-09-12', status: 'Terdaftar', skilas: '-', aks: 0, puma: 0, riwayat: [{ tglKunjungan: '2026-09-12', bb: '62', tb: '158', tdSistole: '125', tdDiastole: '80', skilas: '-', aks: 0, puma: 0, status: 'Terdaftar' }] },
  { id: 'L006', nik: '3201010606580006', nama: 'Suroso', jk: 'L', usia: 68, tglLahir: '1958-06-12', alamat: 'Desa Suka Maju', kelurahan: 'Kalirejo', rw: '05', rt: '01', lastVisit: '2026-09-14', status: 'Pantau', skilas: 'Normal', aks: 22, puma: 5 },
  { id: 'L007', nik: '3201010707500007', nama: 'Ngatini', jk: 'P', usia: 76, tglLahir: '1950-07-18', alamat: 'Jl. Anggrek 2', kelurahan: 'Lawang', rw: '01', rt: '04', lastVisit: '2026-08-15', status: 'Normal', skilas: 'Normal', aks: 23, puma: 3 },
  { id: 'L008', nik: '3201010808480008', nama: 'Hasanudin', jk: 'L', usia: 78, tglLahir: '1948-08-22', alamat: 'Gg. Buntu', kelurahan: 'Kalirejo', rw: '02', rt: '02', lastVisit: '2026-09-02', status: 'Rujuk', skilas: 'Abnormal', aks: 19, puma: 9 },
  { id: 'L009', nik: '3201010909650009', nama: 'Yulianti', jk: 'P', usia: 61, tglLahir: '1965-09-05', alamat: 'Perum Ceria', kelurahan: 'Lawang', rw: '03', rt: '03', lastVisit: '2026-09-11', status: 'Normal', skilas: 'Normal', aks: 24, puma: 0 },
  { id: 'L010', nik: '3201011010590010', nama: 'Bambang', jk: 'L', usia: 67, tglLahir: '1959-10-11', alamat: 'Jl. Pahlawan', kelurahan: 'Kalirejo', rw: '04', rt: '01', lastVisit: '2026-09-08', status: 'Normal', skilas: 'Normal', aks: 24, puma: 2 },
  { id: 'L011', nik: '3201011111520011', nama: 'Karsih', jk: 'P', usia: 74, tglLahir: '1952-11-28', alamat: 'Desa Makmur', kelurahan: 'Lawang', rw: '02', rt: '05', lastVisit: '2026-08-25', status: 'Pantau', skilas: 'Normal', aks: 20, puma: 4 },
  { id: 'L012', nik: '3201011212490012', nama: 'Joko Anwar', jk: 'L', usia: 77, tglLahir: '1949-12-03', alamat: 'Gg. Sepi No 1', kelurahan: 'Kalirejo', rw: '01', rt: '02', lastVisit: '2026-09-14', status: 'Rujuk', skilas: 'Normal', aks: 16, puma: 5 },
];

export const initialMasterRegions = {
  'Lawang': { '01': ['01', '02', '03', '04'], '02': ['01', '02', '05'], '03': ['01', '03'], '04': ['02'] },
  'Kalirejo': { '01': ['02', '03'], '02': ['02'], '03': ['05'], '04': ['01'], '05': ['01'] }
};

export const initialUsers = [
  { id: 'U001', nama: 'Kader Lestari', username: 'lestari.kader', role: 'Kader', lastLogin: 'Hari ini, 07:00', kelurahan: 'Lawang', rw: '01' },
  { id: 'U002', nama: 'Bidan Siti', username: 'siti.bidan', role: 'Bidan', lastLogin: 'Kemarin, 14:30', kelurahan: 'Lawang' },
  { id: 'U003', nama: 'Admin Puskesmas', username: 'admin.utama', role: 'Admin', lastLogin: 'Hari ini, 08:00' },
  { id: 'U004', nama: 'KKN RAMAH LANSIA', username: 'kkn', password: 'tahap1kknterbaik', role: 'Admin', lastLogin: 'Belum pernah login', isPermanent: true },
];

export const initialJadwalData = [
    { id: 'J001', desa: 'Lawang', rw: '01', tgl: '2026-09-18', waktu: '08:00', tempat: 'Balai RW 01 Lawang' },
    { id: 'J002', desa: 'Lawang', rw: '02', tgl: '2026-09-19', waktu: '08:00', tempat: 'Halaman Masjid At-Taqwa' },
    { id: 'J003', desa: 'Kalirejo', rw: '01', tgl: '2026-09-25', waktu: '07:30', tempat: 'Balai Desa Kalirejo' },
    { id: 'J004', desa: 'Kalirejo', rw: '03', tgl: '2026-10-02', waktu: '08:00', tempat: 'Balai RW 03 Kalirejo' },
    { id: 'J005', desa: 'Lawang', rw: '04', tgl: '2026-10-05', waktu: '08:00', tempat: 'Posko Kesehatan RW 04' },
];

export const initialBeritaData = [
  { 
    id: 'B001', 
    title: 'Senam Sehat Bersama Lansia Lawang', 
    date: '2026-09-15', 
    author: 'Admin Puskesmas', 
    category: 'Kegiatan', 
    excerpt: 'Pagi ini, ratusan lansia berkumpul di alun-alun kecamatan Lawang untuk melaksanakan senam sehat bersama instruktur senam profesional.', 
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', 
    content: `
      <p>Kegiatan senam sehat ini rutin dilaksanakan setiap bulan untuk menjaga kebugaran para lansia di Kecamatan Lawang. Acara yang dimulai sejak pukul 06.00 WIB ini mendapat antusiasme yang luar biasa dari warga sekitar. Para instruktur yang berpengalaman telah menyiapkan gerakan-gerakan khusus yang aman dan bermanfaat bagi persendian serta kesehatan jantung lansia.</p>
      <br/>
      <p>Menurut Kepala Puskesmas Lawang, kegiatan fisik seperti senam pagi sangat penting untuk mencegah penurunan fungsi kognitif dan fisik seiring bertambahnya usia. "Kami selalu mendukung dan memfasilitasi program-program kesehatan preventif seperti ini. Selain menyehatkan, senam bersama juga menjadi ajang silaturahmi bagi para lansia," ujarnya.</p>
      <br/>
      <p>Setelah senam selesai, acara dilanjutkan dengan pemeriksaan kesehatan gratis yang meliputi cek tekanan darah, gula darah, dan kolesterol. Diharapkan dengan adanya program terpadu ini, angka harapan hidup dan kualitas hidup lansia di Lawang dapat terus meningkat.</p>
      <br/>
      <p>Para lansia juga diberikan edukasi tentang pentingnya menjaga pola makan dan istirahat yang cukup. Banyak dari mereka yang merasa sangat terbantu dengan adanya pemantauan rutin dari para kader posyandu.</p>
    ` 
  },
  { 
    id: 'B002', 
    title: 'Pembagian Makanan Tambahan Bergizi', 
    date: '2026-09-10', 
    author: 'Kader Lestari', 
    category: 'Kesehatan', 
    excerpt: 'Program pemberian makanan tambahan (PMT) bergizi tinggi sukses dilaksanakan di Balai Desa Kalirejo. Menu hari ini: bubur kacang hijau dan telur.', 
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80', 
    content: `
      <p>Sebagai bagian dari intervensi gizi bagi lansia, kader Posyandu Kalirejo hari ini mendistribusikan ratusan paket makanan tambahan (PMT). Menu yang disajikan kali ini berfokus pada asupan protein tinggi dan mudah dicerna, yaitu bubur kacang hijau hangat, telur rebus, dan buah pisang.</p>
      <br/>
      <p>Program PMT ini didanai oleh anggaran desa bekerja sama dengan Puskesmas setempat. Tujuan utamanya adalah memastikan para lansia mendapatkan asupan nutrisi yang memadai untuk menjaga sistem imun mereka, terutama di musim pancaroba.</p>
      <br/>
      <p>Kader Lestari mengungkapkan bahwa pembagian PMT ini dibarengi dengan penimbangan berat badan secara rutin. "Kami mencatat setiap perkembangan berat badan lansia. Jika ada yang mengalami penurunan berat badan drastis, kami akan langsung melaporkannya ke Bidan Desa untuk tindakan lebih lanjut," jelas Lestari.</p>
      <br/>
      <p>Masyarakat sangat mengapresiasi program ini dan berharap agar PMT dapat terus berlanjut karena memberikan dampak positif secara langsung terhadap kesejahteraan lansia di wilayah tersebut.</p>
    ` 
  },
  { 
    id: 'B003', 
    title: 'Penyuluhan Pencegahan Hipertensi', 
    date: '2026-09-05', 
    author: 'Bidan Siti', 
    category: 'Edukasi', 
    excerpt: 'Dokter dari Puskesmas Lawang memberikan edukasi mengenai cara mudah mengendalikan tekanan darah bagi lansia di rumah.', 
    image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?w=800&q=80', 
    content: `
      <p>Hipertensi menjadi salah satu penyakit kronis paling umum di kalangan lansia. Menyadari hal tersebut, tim kesehatan dari Puskesmas Lawang mengadakan sesi penyuluhan khusus bertajuk "Lansia Sehat Tanpa Hipertensi".</p>
      <br/>
      <p>Dalam pemaparannya, dr. Andi menjelaskan pentingnya mengurangi konsumsi garam, menghindari stres, dan rutin melakukan aktivitas fisik ringan seperti berjalan kaki. "Hipertensi sering disebut sebagai <i>silent killer</i> karena gejalanya tidak selalu terlihat. Oleh karena itu, pengecekan tensi secara rutin adalah langkah pencegahan terbaik," tuturnya.</p>
      <br/>
      <p>Selain edukasi, acara ini juga membuka sesi tanya jawab interaktif. Banyak lansia yang antusias bertanya mengenai mitos-mitos makanan yang diyakini dapat menurunkan atau menaikkan tekanan darah dengan cepat.</p>
      <br/>
      <p>Bidan Siti yang turut mendampingi menambahkan, "Kami membekali setiap kader dengan alat tensimeter portabel, sehingga pengecekan tidak harus menunggu jadwal posyandu bulanan. Keluarga juga diajarkan cara melakukan pengecekan mandiri di rumah agar kondisi lansia dapat terpantau setiap hari."</p>
    ` 
  }
];

export const POSYANDU_NAME = "Posyandu Ramah Lansia Lawang";
export const TODAY = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
