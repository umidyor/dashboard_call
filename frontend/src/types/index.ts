export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Analysis {
  analysis_id: string;
  filename: string;
  created_at: string;
  completed_at?: string;
  status: AnalysisStatus;
}

export interface AnalysesResponse {
  total: number;
  completed: number;
  returned: number;
  processing_time_ms: number;
  results: Analysis[];
  message?: string;
}

export interface Segment {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

export interface Transcript {
  filename: string;
  segments: Segment[];
  full_text: string;
}

export interface LeadSifati {
  lead_type: string;
  purchase_probability: number;
  sabablar: string[];
}

export interface Baholash {
  kirish_qismi: number;
  ehtiyojni_aniqlash: number;
  togri_savollar: number;
  objection_handling: number;
  closing: number;
  muloqot_madaniyati: number;
  intonatsiya_pauzalar: number;
  umumiy_baho: number;
}

export interface OperatorError {
  time: string;
  error: string;
  tavsiyalar: string;
  severity: 'past' | 'o\'rta' | 'yuqori';
}

export interface SkriptItem {
  status: 'bajarildi' | 'bajarilmadi' | 'qisman';
  izoh: string;
}

export interface SkriptCheck {
  salomlashish: SkriptItem;
  tanishtirish: SkriptItem;
  ehtiyojni_aniqlash: SkriptItem;
  taklif_berish: SkriptItem;
  etirozlarni_qayta_ishlash: SkriptItem;
  closing: SkriptItem;
  next_step: SkriptItem;
  follow_up: SkriptItem;
}

export interface Signal {
  type: string;
  text: string;
  time: string;
  impact: string;
}

export interface GapirishBalansi {
  operator_foiz: number;
  mijoz_foiz: number;
  ideal_mi: boolean;
  izoh: string;
}

export interface ClosingItem {
  status: 'ha' | 'yo\'q';
  izoh: string;
}

export interface ClosingTahlili {
  sotuvga_chaqirdi: ClosingItem;
  next_step_oldi: ClosingItem;
  uchrashuv_belgiladi: ClosingItem;
  tolov_yonaltirdi: ClosingItem;
  umumiy_baho: string;
}

export interface Reyting {
  umumiy_ball: number;
  daraja: string;
  operator_salohiyati: string;
}

export interface Statistics {
  lead_sifati: LeadSifati;
  baholash: Baholash;
  operator_xatolari: OperatorError[];
  skript_check: SkriptCheck;
  signallar: Signal[];
  gapirish_balansi: GapirishBalansi;
  closing_tahlili: ClosingTahlili;
  yoqotish_sabablari: string[];
  umumiy_xulosa: string[];
  keyingi_qadamlar: string[];
  reyting: Reyting;
}

export interface AnalysisDetail {
  analysis_id: string;
  filename: string;
  status: AnalysisStatus;
  created_at: string;
  completed_at?: string;
  transcript?: Transcript;
  statistics?: Statistics;
}

export interface StatusResponse {
  analysis_id: string;
  filename: string;
  status: AnalysisStatus;
  created_at: string;
  progress?: string;
  statistics?: Statistics;
  error?: string;
}
