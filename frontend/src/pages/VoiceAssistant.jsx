import { useState, useRef, useEffect } from 'react';
import { Mic, Search, MicOff, Volume2, VolumeX, UploadCloud, CheckCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// SpeechRecognition setup (Browser Native)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
}

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // Messages array to hold conversation history
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I am your AI Government Assistant. How can I help you today?', type: 'text' }
  ]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  // Default to English. In app state, we would lift this to a Context
  // to sync with the Topbar selector.
  const currentLang = "en-IN"; 

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim() !== '') {
        handleSendToAI(transcript);
      }
    };

    // Cleanup
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
    };
  }, [transcript]);

  const toggleListening = () => {
    if (!recognition) {
        alert("Speech Recognition is not supported in this browser. Try Chrome/Edge.");
        return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = currentLang;
      recognition.start();
      setIsListening(true);
      setTranscript('');
      setAudioUrl(null);
    }
  };

  const handleSendToAI = async (text) => {
    if (!text.trim()) return;
    
    // Add user message to UI immediately
    const userMsg = { role: 'user', content: text, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setTranscript('');
    
    // Add temporary loading message
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: tempId, role: 'assistant', content: 'Thinking...', type: 'text' }]);
    
    // Simulate API Call or Call real backend when running
    try {
        const res = await fetch('http://localhost:8000/api/chat/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, language: "en" }) // Replace "en" with state lang code
        });
        
        const data = await res.json();
        
        // Replace loading message with actual response
        setMessages(prev => prev.map(msg => 
            msg.id === tempId ? { 
                role: 'assistant', 
                content: data.reply, 
                type: 'text',
                action: data.action,
                contextData: data.context_data
            } : msg
        ));
        
        if (data.audio_url) {
            setAudioUrl(data.audio_url);
        }

        // Handle Declarative Actions from Backend
        if (data.action) {
            handleAIAction(data.action, data.context_data);
        }
    } catch (err) {
        setMessages(prev => prev.map(msg => 
            msg.id === tempId ? { role: 'assistant', content: "Backend is not running. Please start the FastAPI server.", type: 'text' } : msg
        ));
    }
  };

  const handleAIAction = (action, contextData) => {
      switch(action) {
          case 'NAVIGATE_TO_SCHEMES':
              setTimeout(() => navigate('/schemes'), 2000);
              break;
          case 'NAVIGATE_TO_JOBS':
              setTimeout(() => navigate('/jobs'), 2000);
              break;
          case 'NAVIGATE_TO_SKILLS':
              setTimeout(() => navigate('/skills'), 2000);
              break;
          case 'NAVIGATE_TO_ADMIN':
              setTimeout(() => navigate('/admin'), 2000);
              break;
          case 'NAVIGATE_TO_HOME':
              setTimeout(() => navigate('/'), 2000);
              break;
          // You can also handle OPEN_SCHOLARSHIPS if you have a path
          default:
              console.log("Unhandled action:", action);
      }
  };

  // Auto-play audio when received
  useEffect(() => {
    if (audioUrl && audioRef.current && !isMuted) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
  }, [audioUrl, isMuted]);

  // Auto-scroll chat to bottom
  useEffect(() => {
     if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
  }, [messages]);

  const handleDocumentUpload = async (e, schemeContext) => {
      if (!e.target.files[0]) return;
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      try {
          // Add temporary upload status message
          const tempId = Date.now();
          setMessages(prev => [...prev, { id: tempId, role: 'user', content: `[Uploading ${e.target.files[0].name}...]`, type: 'text' }]);

          const res = await fetch('http://localhost:8000/api/docs/upload', {
              method: 'POST',
              body: formData
          });
          const data = await res.json();
          
          if (data.status === 'success') {
              setMessages(prev => prev.map(msg => msg.id === tempId ? { role: 'user', content: `Uploaded Document: ${e.target.files[0].name}`, type: 'text' } : msg));
              
              // AI Response simulated after upload
              setTimeout(() => {
                  setMessages(prev => [...prev, { 
                      role: 'assistant', 
                      content: `I have successfully scanned your ${data.extracted_data.id_type || 'document'}. Your eligibility for PM Kisan has been green-lighted!`, 
                      type: 'text',
                      action: 'ACTION_SHOW_ELIGIBILITY',
                      contextData: { eligible: true, scheme: schemeContext?.scheme || 'PM Kisan' }
                  }]);
              }, 1500);
          }
      } catch (err) {
          alert('Upload failed');
      } finally {
          setIsUploading(false);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 relative">
      <div className="w-full max-w-3xl card-bg flex flex-col items-center py-16 px-8 relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <h2 className="text-4xl font-extrabold mb-8 text-white z-10 text-center">
          Talk to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Intelligence</span>
        </h2>

        {/* Pulse Mic Button */}
        <div className="relative mb-8 flex justify-center items-center z-10 group cursor-pointer" onClick={toggleListening}>
           {isListening && <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-80 animate-pulse"></div>}
           <button className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-transform transform active:scale-95 z-20 ${isListening ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-gradient-to-br from-pink-500 to-purple-600'}`}>
             {isListening ? <MicOff size={48} className="text-white" /> : <Mic size={48} className="text-white" />}
             
           </button>
        </div>

        {/* Status Text */}
        <div className="bg-[#1a1532] border border-gray-700 rounded-full px-6 py-2 mb-8 z-10 shadow-inner">
          <p className="text-xs tracking-widest text-gray-400 uppercase font-semibold">
            {isListening ? "Listening... (Click to stop)" : "Click mic to speak"}
          </p>
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-xl relative z-10 mb-6 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
          <input 
            type="text" 
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendToAI(transcript)}
            placeholder="E.g. Explain PM Kisan..." 
            className="w-full bg-[#0F0C29] border border-gray-700 focus:border-pink-500 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none transition-colors shadow-inner"
          />
        </div>

        {/* Dynamic Chat History Zone */}
        <div ref={scrollRef} className="w-full max-w-2xl bg-[#110B19]/50 border border-gray-800 rounded-2xl flex-1 mb-8 p-6 overflow-y-auto z-10 space-y-4 max-h-[400px]">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-br-none' : 'bg-[#1a1532] border border-gray-700 text-gray-200 rounded-bl-none shadow-md animate-fade-in-up'}`}>
                        {msg.role === 'assistant' && (
                            <div className="flex items-center space-x-2 mb-2 text-pink-400 border-b border-gray-700/50 pb-2">
                                <Volume2 size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">AICORE</span>
                            </div>
                        )}
                        <p className="leading-relaxed">{msg.content}</p>
                        
                        {/* Interactive UI Action Widgets */}
                        {msg.action === 'ACTION_RECOMMEND_SCHEMES' && msg.contextData && (
                            <div className="mt-4 flex flex-col space-y-3">
                                {msg.contextData.map((scheme, sIdx) => (
                                    <div key={sIdx} className="bg-[#241d40] border border-pink-500/30 p-4 rounded-xl shadow-lg cursor-pointer hover:border-pink-500 transition-colors" onClick={() => navigate('/schemes')}>
                                        <h4 className="text-white font-bold text-sm mb-1">{scheme.title}</h4>
                                        <p className="text-xs text-gray-400 line-clamp-2">{scheme.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {msg.action === 'ACTION_REQUEST_DOCUMENT' && (
                            <div className="mt-4 bg-[#241d40] border border-blue-500/30 p-4 rounded-xl">
                                <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center"><FileText size={16} className="mr-2"/> Document Scan Required</h4>
                                <p className="text-xs text-gray-300 mb-4">Please upload your {msg.contextData?.required?.join(', ') || 'Identity Document'} to proceed.</p>
                                <label className="flex items-center justify-center space-x-2 btn-primary py-2 px-4 rounded-lg text-sm cursor-pointer shadow-lg w-full">
                                    {isUploading ? <Search className="animate-spin" size={16}/> : <UploadCloud size={16} />}
                                    <span>{isUploading ? "Scanning AI..." : "Upload Document"}</span>
                                    <input type="file" className="hidden" onChange={(e) => handleDocumentUpload(e, msg.contextData)} accept="image/*,.pdf" />
                                </label>
                            </div>
                        )}

                        {msg.action === 'ACTION_SHOW_ELIGIBILITY' && (
                            <div className="mt-4 bg-green-900/20 border border-green-500/50 p-4 rounded-xl text-center">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500">
                                    <CheckCircle size={24} className="text-green-500" />
                                </div>
                                <h4 className="text-green-400 font-bold text-sm mb-1">Eligibility Confirmed!</h4>
                                <p className="text-xs text-gray-300 mb-3">You meet all criteria for {msg.contextData?.scheme || 'this scheme'}.</p>
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold text-xs transition-colors shadow-lg" onClick={() => navigate('/schemes')}>
                                    Generate Pre-filled Form
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Action Button & Voice Controls */}
        <div className="w-full max-w-2xl flex space-x-4 z-10 mb-6">
            <button 
               onClick={() => handleSendToAI(transcript)}
               disabled={!transcript.trim()}
               className={`flex-1 py-4 text-lg font-bold uppercase tracking-wider transition-colors ${transcript.trim() ? 'btn-primary shadow-[0_0_20px_rgba(233,30,99,0.3)]' : 'bg-gray-800 text-gray-500 rounded-full cursor-not-allowed'}`}>
              Send to AI
            </button>
            <button
               onClick={() => {
                   setIsMuted(!isMuted);
                   if (!isMuted && audioRef.current) audioRef.current.pause();
               }}
               className={`w-16 flex items-center justify-center rounded-xl transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
               title={isMuted ? "Unmute AI Response" : "Mute AI Response"}
            >
               {isMuted ? <VolumeX className="text-white" size={24} /> : <Volume2 className="text-white" size={24} />}
            </button>
        </div>
        
        {/* Hidden Audio Player for TTS */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" controls />}
      </div>
    </div>
  );
};

export default VoiceAssistant;
