
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, RPMData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        identitas: {
            type: Type.OBJECT,
            properties: {
                namaSatuanPendidikan: { type: Type.STRING },
                mataPelajaran: { type: Type.STRING },
                kelasSemester: { type: Type.STRING },
                durasiPertemuan: { type: Type.STRING },
            },
        },
        identifikasi: {
            type: Type.OBJECT,
            properties: {
                siswa: { type: Type.STRING },
                materiPelajaran: { type: Type.STRING },
                capaianDimensiLulusan: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        desainPembelajaran: {
            type: Type.OBJECT,
            properties: {
                capaianPembelajaran: { type: Type.STRING },
                lintasDisiplinIlmu: { type: Type.STRING },
                tujuanPembelajaran: { type: Type.STRING },
                topikPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
                praktikPedagogis: { type: Type.ARRAY, items: { type: Type.STRING } },
                kemitraanPembelajaran: { type: Type.STRING },
                lingkunganPembelajaran: { type: Type.STRING },
                pemanfaatanDigital: { type: Type.STRING },
            },
        },
        pengalamanBelajar: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    pertemuan: { type: Type.INTEGER },
                    memahami: { type: Type.OBJECT, properties: { kegiatan: { type: Type.STRING }, fokus: { type: Type.STRING } } },
                    mengaplikasi: { type: Type.OBJECT, properties: { kegiatan: { type: Type.STRING }, fokus: { type: Type.STRING } } },
                    refleksi: { type: Type.OBJECT, properties: { kegiatan: { type: Type.STRING }, fokus: { type: Type.STRING } } },
                }
            }
        },
        asesmenPembelajaran: {
            type: Type.OBJECT,
            properties: {
                asesmenAwal: { type: Type.STRING },
                asesmenProses: { type: Type.STRING },
                asesmenAkhir: { type: Type.STRING },
            },
        },
        signatures: {
            type: Type.OBJECT,
            properties: {
                teacherName: { type: Type.STRING },
                teacherNip: { type: Type.STRING },
                principalName: { type: Type.STRING },
                principalNip: { type: Type.STRING },
            },
        },
    }
};

const createPrompt = (formData: FormData): string => {
    return `
Anda adalah seorang ahli perancang kurikulum dan asisten pedagogis untuk guru di Indonesia. Tugas Anda adalah membuat Rencana Pembelajaran Mendalam (RPM) yang terstruktur, komprehensif, dan berkualitas tinggi dalam format JSON.

Gunakan data berikut untuk menghasilkan RPM:
- Satuan Pendidikan: ${formData.schoolName}
- Guru: ${formData.teacherName} (NIP: ${formData.teacherNip})
- Kepala Sekolah: ${formData.principalName} (NIP: ${formData.principalNip})
- Jenjang: ${formData.educationLevel}, Kelas: ${formData.grade}
- Mata Pelajaran: ${formData.subject}
- Capaian Pembelajaran (CP): ${formData.learningOutcomes}
- Tujuan Pembelajaran: ${formData.learningObjectives}
- Materi Pelajaran: ${formData.learningMaterial}
- Jumlah Pertemuan: ${formData.meetings}
- Durasi per Pertemuan: ${formData.meetingDuration}
- Dimensi Lulusan yang dituju: ${formData.graduateDimensions.join(', ')}
- Praktik Pedagogis per pertemuan: ${formData.pedagogicalPractices.map((p, i) => `Pertemuan ${i + 1}: ${p}`).join('; ')}

Instruksi untuk konten yang harus di-generate:
1.  **Identitas**: Isi berdasarkan data yang diberikan. Untuk 'kelasSemester', tentukan semester (Ganjil/Genap) secara logis berdasarkan kelas.
2.  **Identifikasi**:
    -   'siswa': Deskripsikan secara singkat karakteristik umum siswa pada jenjang dan kelas yang ditentukan.
    -   'materiPelajaran': Gunakan materi yang diberikan.
    -   'capaianDimensiLulusan': Gunakan dimensi yang dipilih pengguna.
3.  **Desain Pembelajaran**:
    -   'capaianPembelajaran' & 'tujuanPembelajaran': Gunakan data yang diberikan.
    -   'lintasDisiplinIlmu': Identifikasi dan jelaskan kaitan materi dengan 2-3 disiplin ilmu lain.
    -   'topikPembelajaran': Pecah 'Materi Pelajaran' menjadi topik-topik spesifik untuk setiap pertemuan.
    -   'praktikPedagogis': Gunakan yang sudah dipilih pengguna.
    -   'kemitraanPembelajaran': Sarankan kemitraan yang relevan (misal: orang tua, komunitas, profesional).
    -   'lingkunganPembelajaran': Deskripsikan lingkungan belajar yang ideal (fisik dan non-fisik).
    -   'pemanfaatanDigital': Rekomendasikan 2-3 alat/platform digital spesifik yang relevan dengan materi, sertakan contoh penggunaannya.
4.  **Pengalaman Belajar**: Untuk setiap pertemuan:
    -   Buat langkah-langkah kegiatan yang jelas dan berurutan untuk 'Memahami' (kegiatan awal/apersepsi), 'Mengaplikasi' (kegiatan inti), dan 'Refleksi' (kegiatan penutup).
    -   Pastikan kegiatan 'Mengaplikasi' SANGAT SESUAI dengan sintaks dari 'Praktik Pedagogis' yang dipilih untuk pertemuan tersebut. Contoh, jika PjBL, harus ada langkah seperti "Penentuan Pertanyaan Mendasar", "Mendesain Perencanaan Proyek", dst.
    -   Untuk 'fokus' di setiap tahap, pilih salah satu dari: 'berkesadaran', 'bermakna', atau 'menggembirakan' yang paling sesuai dengan deskripsi kegiatannya.
5.  **Asesmen Pembelajaran**:
    -   'asesmenAwal': Berikan contoh asesmen diagnostik atau apersepsi yang relevan.
    -   'asesmenProses': Berikan contoh teknik asesmen formatif (misal: rubrik observasi, pertanyaan diskusi).
    -   'asesmenAkhir': Berikan contoh asesmen sumatif yang mengukur ketercapaian tujuan (misal: proyek, presentasi, portofolio).
6.  **Signatures**: Isi nama dan NIP guru serta kepala sekolah.

Pastikan seluruh output dalam Bahasa Indonesia yang baik, benar, dan profesional. Teks pada bagian deskriptif harus dalam bentuk paragraf yang utuh dan rata kanan-kiri (justified).
`;
};

export const generateRPM = async (formData: FormData): Promise<RPMData> => {
    try {
        const prompt = createPrompt(formData);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText) as RPMData;
        return parsedData;

    } catch (error) {
        console.error("Error generating RPM with Gemini:", error);
        if (error instanceof Error && error.message.includes('JSON')) {
             throw new Error("Gagal mem-parsing respons dari AI. Coba ubah input Anda sedikit dan jalankan lagi.");
        }
        throw new Error("Terjadi kesalahan pada layanan AI. Mohon coba beberapa saat lagi.");
    }
};
