import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnalysisStatus, useAnalysisDetail } from '../hooks/useAnalysis';
import { formatDate, getStatusBadgeClass, downloadJSON } from '../utils/helpers';
import ChatTranscript from '../components/ChatTranscript';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const AnalysisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showJSON, setShowJSON] = useState(false);

  const { data: statusData } = useAnalysisStatus(id || '', !!id);
  const isCompleted = statusData?.status === 'completed';
  const { data: analysisData, isLoading } = useAnalysisDetail(id || '', isCompleted);

  const seekToTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      audioRef.current.play();
    }
  };

  if (!id) {
    return <div className="p-8">Noto'g'ri ID</div>;
  }

  if (isLoading || !isCompleted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {statusData?.status === 'processing' ? 'Tahlil qilinmoqda...' : 'Yuklanmoqda...'}
          </p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-900 font-semibold">Tahlil topilmadi</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">
            Orqaga
          </button>
        </div>
      </div>
    );
  }

  const { filename, created_at, completed_at, status, transcript, statistics } = analysisData;

  const baholashData = statistics?.baholash ? [
    { subject: 'Kirish', value: statistics.baholash.kirish_qismi, fullMark: 100 },
    { subject: 'Ehtiyoj', value: statistics.baholash.ehtiyojni_aniqlash, fullMark: 100 },
    { subject: 'Savollar', value: statistics.baholash.togri_savollar, fullMark: 100 },
    { subject: 'E\'tirozlar', value: statistics.baholash.objection_handling, fullMark: 100 },
    { subject: 'Closing', value: statistics.baholash.closing, fullMark: 100 },
    { subject: 'Madaniyat', value: statistics.baholash.muloqot_madaniyati, fullMark: 100 },
  ] : [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'past': return 'bg-blue-100 text-blue-800';
      case 'o\'rta': return 'bg-orange-100 text-orange-800';
      case 'yuqori': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkriptStatusIcon = (status: string) => {
    switch (status) {
      case 'bajarildi': return <span className="text-green-600">✓</span>;
      case 'qisman': return <span className="text-yellow-600">◐</span>;
      case 'bajarilmadi': return <span className="text-red-600">✗</span>;
      default: return <span className="text-gray-600">-</span>;
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Orqaga
          </button>
          <button onClick={() => downloadJSON(analysisData, `analysis_${id}.json`)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            JSON yuklash
          </button>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{filename}</h1>
          <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
        </div>
        <div className="flex gap-6 mt-4 text-sm text-gray-600">
          <div><span className="font-medium">Yaratilgan:</span> {formatDate(created_at)}</div>
          {completed_at && <div><span className="font-medium">Tugatilgan:</span> {formatDate(completed_at)}</div>}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {transcript && <ChatTranscript segments={transcript.segments} onSeekToTime={seekToTime} />}

            {statistics?.skript_check && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skript tekshiruvi</h2>
                <div className="space-y-2">
                  {Object.entries(statistics.skript_check).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getSkriptStatusIcon(value.status)}</span>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-600">{value.izoh}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {statistics?.operator_xatolari && statistics.operator_xatolari.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Operator xatolari</h2>
                <div className="space-y-3">
                  {statistics.operator_xatolari.map((error, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{error.error}</span>
                        <span className={`badge ${getSeverityColor(error.severity)}`}>{error.severity}</span>
                        <span className="text-xs text-gray-500">{error.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{error.tavsiyalar}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <button onClick={() => setShowJSON(!showJSON)} className="flex items-center justify-between w-full text-left">
                <h2 className="text-lg font-semibold text-gray-900">Raw JSON</h2>
                <svg className={`w-5 h-5 transition-transform ${showJSON ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showJSON && (
                <pre className="mt-4 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(analysisData, null, 2)}
                </pre>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {statistics?.lead_sifati && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead sifati</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Turi</p>
                    <p className="text-lg font-medium text-gray-900 capitalize">{statistics.lead_sifati.lead_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Xarid ehtimoli</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${statistics.lead_sifati.purchase_probability >= 70 ? 'bg-green-500' : statistics.lead_sifati.purchase_probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${statistics.lead_sifati.purchase_probability}%` }} />
                      </div>
                      <span className="text-lg font-medium">{statistics.lead_sifati.purchase_probability}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Sabablar</p>
                    <ul className="space-y-1">
                      {statistics.lead_sifati.sabablar.map((sabab, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{sabab}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {statistics?.baholash && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Baholash</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={baholashData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar name="Ball" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Umumiy baho</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.baholash.umumiy_baho}/100</p>
                </div>
              </div>
            )}

            {statistics?.reyting && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reyting</h2>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold ${statistics.reyting.daraja === 'A' ? 'bg-green-100 text-green-700' : statistics.reyting.daraja === 'B' ? 'bg-blue-100 text-blue-700' : statistics.reyting.daraja === 'C' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {statistics.reyting.daraja}
                  </div>
                  <p className="mt-3 text-lg font-medium text-gray-900">{statistics.reyting.umumiy_ball}/100</p>
                  <p className="text-sm text-gray-600 capitalize">{statistics.reyting.operator_salohiyati}</p>
                </div>
              </div>
            )}

            {statistics?.keyingi_qadamlar && statistics.keyingi_qadamlar.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Keyingi qadamlar</h2>
                <ol className="space-y-2 list-decimal list-inside">
                  {statistics.keyingi_qadamlar.map((step, index) => (
                    <li key={index} className="text-sm text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {statistics?.gapirish_balansi && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Gapirish balansi</h2>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 bg-blue-500 h-8 rounded flex items-center justify-center text-white text-sm font-medium" style={{ width: `${statistics.gapirish_balansi.operator_foiz}%` }}>
                    {statistics.gapirish_balansi.operator_foiz}%
                  </div>
                  <div className="flex-1 bg-gray-500 h-8 rounded flex items-center justify-center text-white text-sm font-medium" style={{ width: `${statistics.gapirish_balansi.mijoz_foiz}%` }}>
                    {statistics.gapirish_balansi.mijoz_foiz}%
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Operator</span>
                  <span>Mijoz</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">{statistics.gapirish_balansi.izoh}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;
