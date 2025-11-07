
import { EducationLevel, PedagogicalPractice, GraduateDimension } from './types';

export const EDUCATION_LEVELS: EducationLevel[] = [
  EducationLevel.SD,
  EducationLevel.SMP,
  EducationLevel.SMA,
];

export const GRADES: Record<EducationLevel, string[]> = {
  [EducationLevel.SD]: ['1', '2', '3', '4', '5', '6'],
  [EducationLevel.SMP]: ['7', '8', '9'],
  [EducationLevel.SMA]: ['10', '11', '12'],
};

export const PEDAGOGICAL_PRACTICES: PedagogicalPractice[] = [
  PedagogicalPractice.INQUIRY_DISCOVERY,
  PedagogicalPractice.PJBL,
  PedagogicalPractice.PROBLEM_SOLVING,
  PedagogicalPractice.GAME_BASED,
  PedagogicalPractice.STATION,
];

export const GRADUATE_DIMENSIONS: GraduateDimension[] = [
  GraduateDimension.FAITH,
  GraduateDimension.CITIZENSHIP,
  GraduateDimension.CRITICAL_REASONING,
  GraduateDimension.CREATIVITY,
  GraduateDimension.COLLABORATION,
  GraduateDimension.INDEPENDENCE,
  GraduateDimension.HEALTH,
  GraduateDimension.COMMUNICATION,
];
