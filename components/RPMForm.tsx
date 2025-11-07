
import React, { useState, useEffect } from 'react';
import type { FormData } from '../types';
import { EducationLevel, PedagogicalPractice, GraduateDimension } from '../types';
import { EDUCATION_LEVELS, GRADES, PEDAGOGICAL_PRACTICES, GRADUATE_DIMENSIONS } from '../constants';

interface RPMFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputField: React.FC<{label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; type?: string;}> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        <input id={id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...props} />
    </div>
);

const TextareaField: React.FC<{label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean; placeholder?: string; rows?: number;}> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        <textarea id={id} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...props}></textarea>
    </div>
);

const SelectField: React.FC<{label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; required?: boolean; children: React.ReactNode}> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        <select id={id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...props} />
    </div>
);


export const RPMForm: React.FC<RPMFormProps> = ({ onSubmit, isLoading }) => {
  const [formState, setFormState] = useState<FormData>({
    schoolName: '',
    teacherName: '',
    teacherNip: '',
    principalName: '',
    principalNip: '',
    educationLevel: EducationLevel.SMP,
    grade: '7',
    subject: '',
    learningOutcomes: '',
    learningObjectives: '',
    learningMaterial: '',
    meetings: 1,
    meetingDuration: '2 x 45 menit',
    pedagogicalPractices: [PedagogicalPractice.INQUIRY_DISCOVERY],
    graduateDimensions: [],
  });
  
  const [grades, setGrades] = useState<string[]>(GRADES[formState.educationLevel]);

  useEffect(() => {
    setGrades(GRADES[formState.educationLevel]);
    setFormState(prev => ({ ...prev, grade: GRADES[formState.educationLevel][0] }));
  }, [formState.educationLevel]);

  useEffect(() => {
    const numMeetings = formState.meetings > 0 ? formState.meetings : 1;
    setFormState(prev => ({
      ...prev,
      pedagogicalPractices: Array(numMeetings).fill(prev.pedagogicalPractices[0] || PedagogicalPractice.INQUIRY_DISCOVERY)
    }));
  }, [formState.meetings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'meetings' ? parseInt(value, 10) : value }));
  };
  
  const handleDimensionChange = (dimension: GraduateDimension) => {
    setFormState(prev => {
        const newDimensions = prev.graduateDimensions.includes(dimension)
            ? prev.graduateDimensions.filter(d => d !== dimension)
            : [...prev.graduateDimensions, dimension];
        return { ...prev, graduateDimensions: newDimensions };
    });
  };

  const handlePedagogyChange = (index: number, value: PedagogicalPractice) => {
    setFormState(prev => {
      const newPractices = [...prev.pedagogicalPractices];
      newPractices[index] = value;
      return { ...prev, pedagogicalPractices: newPractices };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <InputField label="Nama Satuan Pendidikan" id="schoolName" name="schoolName" value={formState.schoolName} onChange={handleChange} required placeholder="Contoh: SMP Negeri 1" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nama Guru" id="teacherName" name="teacherName" value={formState.teacherName} onChange={handleChange} required placeholder="Nama lengkap Anda" />
        <InputField label="NIP Guru" id="teacherNip" name="teacherNip" value={formState.teacherNip} onChange={handleChange} required placeholder="NIP Anda" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nama Kepala Sekolah" id="principalName" name="principalName" value={formState.principalName} onChange={handleChange} required placeholder="Nama kepala sekolah" />
        <InputField label="NIP Kepala Sekolah" id="principalNip" name="principalNip" value={formState.principalNip} onChange={handleChange} required placeholder="NIP kepala sekolah" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField label="Jenjang Pendidikan" id="educationLevel" name="educationLevel" value={formState.educationLevel} onChange={handleChange} required>
          {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
        </SelectField>
        <SelectField label="Kelas" id="grade" name="grade" value={formState.grade} onChange={handleChange} required>
          {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
        </SelectField>
      </div>
      <InputField label="Mata Pelajaran" id="subject" name="subject" value={formState.subject} onChange={handleChange} required placeholder="Contoh: Ilmu Pengetahuan Alam" />
      <TextareaField label="Capaian Pembelajaran (CP)" id="learningOutcomes" name="learningOutcomes" value={formState.learningOutcomes} onChange={handleChange} required placeholder="Deskripsikan CP di sini" rows={3}/>
      <TextareaField label="Tujuan Pembelajaran" id="learningObjectives" name="learningObjectives" value={formState.learningObjectives} onChange={handleChange} required placeholder="Deskripsikan tujuan pembelajaran di sini" rows={3} />
      <TextareaField label="Materi Pelajaran" id="learningMaterial" name="learningMaterial" value={formState.learningMaterial} onChange={handleChange} required placeholder="Sebutkan materi pelajaran secara ringkas" rows={2}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Jumlah Pertemuan" id="meetings" name="meetings" type="number" min="1" value={formState.meetings.toString()} onChange={handleChange} required />
        <InputField label="Durasi Setiap Pertemuan" id="meetingDuration" name="meetingDuration" value={formState.meetingDuration} onChange={handleChange} required placeholder="Contoh: 2 x 45 menit" />
      </div>

       <div>
         <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Praktik Pedagogis per Pertemuan</label>
         <div className="space-y-2">
            {Array.from({ length: formState.meetings }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-24">Pertemuan {i + 1}:</span>
                    <select
                        value={formState.pedagogicalPractices[i]}
                        onChange={(e) => handlePedagogyChange(i, e.target.value as PedagogicalPractice)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        {PEDAGOGICAL_PRACTICES.map(practice => <option key={practice} value={practice}>{practice}</option>)}
                    </select>
                </div>
            ))}
         </div>
       </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dimensi Lulusan</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GRADUATE_DIMENSIONS.map(dim => (
            <label key={dim} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={formState.graduateDimensions.includes(dim)} onChange={() => handleDimensionChange(dim)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <span>{dim}</span>
            </label>
          ))}
        </div>
      </div>
      
      <button type="submit" disabled={isLoading} className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center">
        {isLoading ? 'Memproses...' : 'Buat RPM Sekarang'}
      </button>
    </form>
  );
};
