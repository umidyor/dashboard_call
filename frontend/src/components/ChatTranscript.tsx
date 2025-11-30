import type { Segment } from '../types';

interface ChatTranscriptProps {
  segments: Segment[];
  onSeekToTime?: (time: number) => void;
}

const ChatTranscript = ({ segments, onSeekToTime }: ChatTranscriptProps) => {
  const getSpeakerColor = (speaker: string) => {
    // Operator - blue, Client/Others - gray
    return speaker.includes('00') ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200';
  };

  const getSpeakerName = (speaker: string) => {
    return speaker.includes('00') ? 'Operator' : 'Mijoz';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Suhbat Transkripti
      </h2>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${getSpeakerColor(segment.speaker)}`}
            onClick={() => onSeekToTime && onSeekToTime(segment.start)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  segment.speaker.includes('00') ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  <span className="text-white text-xs font-medium">
                    {getSpeakerName(segment.speaker)[0]}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {getSpeakerName(segment.speaker)}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded">
                {formatTime(segment.start)} - {formatTime(segment.end)}
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed pl-10">
              {segment.text}
            </p>
          </div>
        ))}
      </div>

      {segments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>Transkript mavjud emas</p>
        </div>
      )}
    </div>
  );
};

export default ChatTranscript;
