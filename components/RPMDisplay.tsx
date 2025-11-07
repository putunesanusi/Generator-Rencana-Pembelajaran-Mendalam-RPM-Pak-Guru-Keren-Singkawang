import React, { useRef, useState } from 'react';
import type { RPMData } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { GoogleDocsIcon } from './icons/GoogleDocsIcon';
import { PdfIcon } from './icons/PdfIcon';

// Declare global variables from CDN scripts for TypeScript
declare const html2canvas: any;
declare const jspdf: any;

interface RPMDisplayProps {
  data: RPMData;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <tr>
        <td colSpan={2} className="bg-gray-200 dark:bg-gray-700 p-2 font-bold text-lg text-gray-800 dark:text-gray-100">
            {children}
        </td>
    </tr>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="p-2 align-top font-semibold w-1/4">{label}</td>
        <td className="p-2 align-top text-justify">{children}</td>
    </tr>
);

export const RPMDisplay: React.FC<RPMDisplayProps> = ({ data }) => {
    const outputRef = useRef<HTMLDivElement>(null);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
    const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

    const handleCopy = () => {
        if (!outputRef.current) return;

        const htmlContent = outputRef.current.innerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': blob });

        navigator.clipboard.write([clipboardItem]).then(() => {
            setCopyStatus('copied');
            window.open('https://docs.google.com/document/create', '_blank');
            setTimeout(() => setCopyStatus('idle'), 2000);
        }).catch(err => {
            console.error('Failed to copy content: ', err);
            alert('Gagal menyalin konten.');
        });
    };

    const handleExportPdf = async () => {
        if (!outputRef.current) return;
        setIsGeneratingPdf(true);

        try {
            const { jsPDF } = jspdf;
            const canvas = await html2canvas(outputRef.current, {
                scale: 2, // Higher scale for better quality
            });

            // A4 page size in mm: 210 x 297
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 15;
            
            const contentWidth = pageWidth - (margin * 2);
            const contentHeight = canvas.height * contentWidth / canvas.width;
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            let position = 0;
            const pageContentHeight = pageHeight - (margin * 2);

            let heightLeft = contentHeight;
            
            pdf.addImage(canvas, 'PNG', margin, position + margin, contentWidth, contentHeight);
            heightLeft -= pageContentHeight;

            while (heightLeft > 0) {
                position -= pageContentHeight;
                pdf.addPage();
                pdf.addImage(canvas, 'PNG', margin, position + margin, contentWidth, contentHeight);
                heightLeft -= pageContentHeight;
            }

            pdf.save(`RPM-${data.identitas.mataPelajaran.replace(/\s/g, '_')}.pdf`);

        } catch (err) {
            console.error("Failed to generate PDF:", err);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-end mb-4 space-x-2">
                 <button
                    onClick={handleExportPdf}
                    disabled={isGeneratingPdf}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
                >
                    <PdfIcon />
                    {isGeneratingPdf ? 'Membuat PDF...' : 'Ekspor ke PDF'}
                </button>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                >
                    {copyStatus === 'idle' ? <CopyIcon /> : <GoogleDocsIcon />}
                    {copyStatus === 'idle' ? 'Salin & Buka Google Docs' : 'Disalin! Buka Docs'}
                </button>
            </div>
            <div ref={outputRef}>
                <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>RENCANA PEMBELAJARAN MENDALAM (RPM)</h2>
                <table className="w-full border-collapse text-sm text-gray-800 dark:text-gray-200" style={{ fontFamily: 'Times New Roman, serif' }}>
                    <tbody>
                        <SectionTitle>A. IDENTITAS</SectionTitle>
                        <Row label="Nama Satuan Pendidikan">{data.identitas.namaSatuanPendidikan}</Row>
                        <Row label="Mata Pelajaran">{data.identitas.mataPelajaran}</Row>
                        <Row label="Kelas/Semester">{data.identitas.kelasSemester}</Row>
                        <Row label="Durasi Pertemuan">{data.identitas.durasiPertemuan}</Row>
                        
                        <SectionTitle>B. IDENTIFIKASI</SectionTitle>
                        <Row label="Siswa">{data.identifikasi.siswa}</Row>
                        <Row label="Materi Pelajaran">{data.identifikasi.materiPelajaran}</Row>
                        <Row label="Capaian Dimensi Lulusan">
                            <ul className="list-disc list-inside">
                                {data.identifikasi.capaianDimensiLulusan.map((dim, i) => <li key={i}>{dim}</li>)}
                            </ul>
                        </Row>
                        
                        <SectionTitle>C. DESAIN PEMBELAJARAN</SectionTitle>
                        <Row label="Capaian Pembelajaran (CP)">{data.desainPembelajaran.capaianPembelajaran}</Row>
                        <Row label="Lintas Disiplin Ilmu">{data.desainPembelajaran.lintasDisiplinIlmu}</Row>
                        <Row label="Tujuan Pembelajaran">{data.desainPembelajaran.tujuanPembelajaran}</Row>
                        <Row label="Topik Pembelajaran">
                             <ul className="list-decimal list-inside">
                                {data.desainPembelajaran.topikPembelajaran.map((topic, i) => <li key={i}>{topic}</li>)}
                            </ul>
                        </Row>
                        <Row label="Praktik Pedagogis">{data.desainPembelajaran.praktikPedagogis.map((p, i) => `Pertemuan ${i+1}: ${p}`).join(', ')}</Row>
                        <Row label="Kemitraan Pembelajaran">{data.desainPembelajaran.kemitraanPembelajaran}</Row>
                        <Row label="Lingkungan Pembelajaran">{data.desainPembelajaran.lingkunganPembelajaran}</Row>
                        <Row label="Pemanfaatan Digital">{data.desainPembelajaran.pemanfaatanDigital}</Row>

                        <SectionTitle>D. PENGALAMAN BELAJAR</SectionTitle>
                        {data.pengalamanBelajar.map((pertemuan, index) => (
                           <React.Fragment key={index}>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td colSpan={2} className="p-2 bg-gray-100 dark:bg-gray-700/50 font-semibold">
                                        Pertemuan ke-{pertemuan.pertemuan}
                                    </td>
                                </tr>
                                <Row label="Memahami">{pertemuan.memahami.kegiatan} <span className="italic text-gray-500">({pertemuan.memahami.fokus})</span></Row>
                                <Row label="Mengaplikasi">{pertemuan.mengaplikasi.kegiatan} <span className="italic text-gray-500">({pertemuan.mengaplikasi.fokus})</span></Row>
                                <Row label="Refleksi">{pertemuan.refleksi.kegiatan} <span className="italic text-gray-500">({pertemuan.refleksi.fokus})</span></Row>
                           </React.Fragment>
                        ))}
                        
                        <SectionTitle>E. ASESMEN PEMBELAJARAN</SectionTitle>
                        <Row label="Asesmen Awal (Diagnostik/Apersepsi)">{data.asesmenPembelajaran.asesmenAwal}</Row>
                        <Row label="Asesmen Proses (Observasi, Rubrik, Diskusi)">{data.asesmenPembelajaran.asesmenProses}</Row>
                        <Row label="Asesmen Akhir (Produk, Tugas, Presentasi)">{data.asesmenPembelajaran.asesmenAkhir}</Row>
                    </tbody>
                </table>
                 <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'Times New Roman, serif', fontSize: '0.875rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>Mengetahui,</p>
                        <p>Kepala Sekolah</p>
                        <br /><br /><br /><br />
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{data.signatures.principalName}</p>
                        <p>NIP. {data.signatures.principalNip}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p>Guru Mata Pelajaran</p>
                        <br /><br /><br /><br /><br />
                        <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{data.signatures.teacherName}</p>
                        <p>NIP. {data.signatures.teacherNip}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};