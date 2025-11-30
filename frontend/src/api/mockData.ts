import type { AnalysesResponse, AnalysisDetail, StatusResponse } from '../types';

export const mockAnalyses: AnalysesResponse = {
  total: 3,
  completed: 2,
  returned: 3,
  processing_time_ms: 1.5,
  results: [
    {
      analysis_id: 'be3e5763-c4d7-4684-a796-343055d44011',
      filename: 'Recording (1).wav',
      created_at: '2025-11-30T15:09:13.186670',
      completed_at: '2025-11-30T15:09:24.603904',
      status: 'completed',
    },
    {
      analysis_id: 'a2b3c4d5-e6f7-8901-2345-6789abcdef01',
      filename: 'call_client_petrov.wav',
      created_at: '2025-11-29T14:20:00.000000',
      completed_at: '2025-11-29T14:23:10.000000',
      status: 'completed',
    },
    {
      analysis_id: 'a3b4c5d6-e7f8-9012-3456-789abcdef012',
      filename: 'processing_call.wav',
      created_at: '2025-11-29T09:15:00.000000',
      status: 'processing',
    },
  ],
  message: '✅ 3 ta tahlil yuklandi'
};

export const mockAnalysisDetail: AnalysisDetail = {
  analysis_id: 'be3e5763-c4d7-4684-a796-343055d44011',
  filename: 'Recording (1).wav',
  status: 'completed',
  created_at: '2025-11-30T15:09:13.186670',
  completed_at: '2025-11-30T15:09:24.603904',
  transcript: {
    filename: 'be3e5763-c4d7-4684-a796-343055d44011.wav',
    segments: [
      {
        speaker: 'Speaker_SPEAKER_00',
        start: 1.72,
        end: 3.86,
        text: 'nima deb gapirishim kerak edi? karochi.',
      },
      {
        speaker: 'Speaker_SPEAKER_00',
        start: 4.32,
        end: 7.81,
        text: "xo'p ipvaniya haqida ma'lumot olmoqchiman nima u",
      },
    ],
    full_text: "Speaker_SPEAKER_00: nima deb gapirishim kerak edi? karochi.\nSpeaker_SPEAKER_00: xo'p ipvaniya haqida ma'lumot olmoqchiman nima u",
  },
  statistics: {
    lead_sifati: {
      lead_type: 'sovuq',
      purchase_probability: 20,
      sabablar: [
        "Mijozning aniq ehtiyoji yo'q",
        'Mijozning savollari noaniq',
        "Qo'ng'iroqning maqsadi aniq emas",
        'Mijozning qiziqishi past',
      ],
    },
    baholash: {
      kirish_qismi: 20,
      ehtiyojni_aniqlash: 10,
      togri_savollar: 15,
      objection_handling: 0,
      closing: 0,
      muloqot_madaniyati: 30,
      intonatsiya_pauzalar: 40,
      umumiy_baho: 20,
    },
    operator_xatolari: [
      {
        time: '00:01',
        error: 'Mijoz bilan salomlashmadi',
        tavsiyalar: "Qo'ng'iroq boshida salomlashish kerak",
        severity: 'yuqori',
      },
    ],
    skript_check: {
      salomlashish: {
        status: 'bajarilmadi',
        izoh: 'Operator salomlashmadi',
      },
      tanishtirish: {
        status: 'bajarilmadi',
        izoh: "Operator o'zini tanishtirmadi",
      },
      ehtiyojni_aniqlash: {
        status: 'qisman',
        izoh: 'Ehtiyojni aniqlash uchun savollar berilmadi',
      },
      taklif_berish: {
        status: 'bajarilmadi',
        izoh: 'Taklif berilmadi',
      },
      etirozlarni_qayta_ishlash: {
        status: 'bajarilmadi',
        izoh: "E'tirozlar qayta ishlanmadi",
      },
      closing: {
        status: 'bajarilmadi',
        izoh: 'Closing amalga oshirilmadi',
      },
      next_step: {
        status: 'bajarilmadi',
        izoh: 'Keyingi qadamlar belgilanmadi',
      },
      follow_up: {
        status: 'bajarilmadi',
        izoh: 'Follow-up rejalashtirilmagan',
      },
    },
    signallar: [
      {
        type: "e'tiroz",
        text: 'nima deb gapirishim kerak edi?',
        time: '00:01',
        impact: "o'rtacha",
      },
    ],
    gapirish_balansi: {
      operator_foiz: 70,
      mijoz_foiz: 30,
      ideal_mi: false,
      izoh: "Operator ko'p gapirdi, mijozga kamroq imkoniyat berildi",
    },
    closing_tahlili: {
      sotuvga_chaqirdi: {
        status: "yo'q",
        izoh: 'Sotuvga chaqirilmadi',
      },
      next_step_oldi: {
        status: "yo'q",
        izoh: 'Keyingi qadamlar belgilanmadi',
      },
      uchrashuv_belgiladi: {
        status: "yo'q",
        izoh: 'Uchrashuv belgilanmadi',
      },
      tolov_yonaltirdi: {
        status: "yo'q",
        izoh: "To'lovga yo'naltirilmagan",
      },
      umumiy_baho: 'poor',
    },
    yoqotish_sabablari: [
      'Operatorning salomlashmasligi',
      'Ehtiyojni aniqlashda qiyinchilik',
      'Mijozning qiziqishi past',
      'Taklif berilmasligi',
      'Closing amalga oshirilmasligi',
    ],
    umumiy_xulosa: [
      'Operator salomlashmadi',
      'Mijozning ehtiyoji aniqlanmadi',
      'Taklif berilmadi',
      'Closing amalga oshirilmadi',
      'Muloqot madaniyati yaxshilanishi kerak',
      'Operator skriptga rioya qilishi kerak',
    ],
    keyingi_qadamlar: [
      "Operator uchun trening o'tkazish",
      'Skriptdan foydalanishni yaxshilash',
      'Mijoz bilan muloqot madaniyatini oshirish',
    ],
    reyting: {
      umumiy_ball: 20,
      daraja: 'F',
      operator_salohiyati: 'past',
    },
  },
};

export const mockStatus: StatusResponse = {
  analysis_id: 'be3e5763-c4d7-4684-a796-343055d44011',
  filename: 'Recording (1).wav',
  status: 'completed',
  created_at: '2025-11-30T15:09:13.186670',
  progress: 'Tugatildi',
};
