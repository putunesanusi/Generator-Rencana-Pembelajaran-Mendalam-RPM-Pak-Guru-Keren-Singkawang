
export enum EducationLevel {
  SD = 'SD',
  SMP = 'SMP',
  SMA = 'SMA',
}

export enum PedagogicalPractice {
  INQUIRY_DISCOVERY = 'Inkuiri-Discovery Learning',
  PJBL = 'Project Based Learning (PjBL)',
  PROBLEM_SOLVING = 'Problem Based Learning',
  GAME_BASED = 'Game Based Learning',
  STATION = 'Station Learning',
}

export enum GraduateDimension {
  FAITH = 'Keimanan & Ketakwaan',
  CITIZENSHIP = 'Kewargaan',
  CRITICAL_REASONING = 'Penalaran Kritis',
  CREATIVITY = 'Kreativitas',
  COLLABORATION = 'Kolaborasi',
  INDEPENDENCE = 'Kemandirian',
  HEALTH = 'Kesehatan',
  COMMUNICATION = 'Komunikasi',
}

export interface FormData {
  schoolName: string;
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  educationLevel: EducationLevel;
  grade: string;
  subject: string;
  learningOutcomes: string;
  learningObjectives: string;
  learningMaterial: string;
  meetings: number;
  meetingDuration: string;
  pedagogicalPractices: PedagogicalPractice[];
  graduateDimensions: GraduateDimension[];
}

export interface PengalamanBelajarDetail {
    kegiatan: string;
    fokus: 'berkesadaran' | 'bermakna' | 'menggembirakan';
}

export interface PengalamanBelajarPertemuan {
    pertemuan: number;
    memahami: PengalamanBelajarDetail;
    mengaplikasi: PengalamanBelajarDetail;
    refleksi: PengalamanBelajarDetail;
}


export interface RPMData {
  identitas: {
    namaSatuanPendidikan: string;
    mataPelajaran: string;
    kelasSemester: string;
    durasiPertemuan: string;
  };
  identifikasi: {
    siswa: string;
    materiPelajaran: string;
    capaianDimensiLulusan: string[];
  };
  desainPembelajaran: {
    capaianPembelajaran: string;
    lintasDisiplinIlmu: string;
    tujuanPembelajaran: string;
    topikPembelajaran: string[];
    praktikPedagogis: string[];
    kemitraanPembelajaran: string;
    lingkunganPembelajaran: string;
    pemanfaatanDigital: string;
  };
  pengalamanBelajar: PengalamanBelajarPertemuan[];
  asesmenPembelajaran: {
    asesmenAwal: string;
    asesmenProses: string;
    asesmenAkhir: string;
  };
  signatures: {
    teacherName: string;
    teacherNip: string;
    principalName: string;
    principalNip: string;
  };
}
