import React, { useState } from 'react';
import { BookOpen, RefreshCw, Download, Send, Zap } from 'lucide-react';

const API_URL = import.meta.env.PROD ? "" : "http://localhost:8000";

export default function App() {
  const [mode, setMode] = useState('arxiv');
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [slides, setSlides] = useState([]);
  const [feedback, setFeedback] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: mode, input_value: inputVal })
      });
      const data = await res.json();
      setSession(data.session_id);
      setSlides(data.slides);
    } catch (e) {
      alert("Error generating: " + e.message);
    }
    setLoading(false);
  };

  const handleRefine = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session, feedback })
      });
      const data = await res.json();
      setSlides(data.slides);
      setFeedback('');
    } catch (e) {
      alert("Error refining: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Research to Slides <span className="text-white">AI</span>
          </h1>
          <p className="text-gray-400 text-lg">Turn ArXiv papers into professional presentations in seconds.</p>
        </header>

        {/* Input Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex gap-4 mb-6 justify-center">
            <button 
              onClick={() => setMode('arxiv')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'arxiv' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
            >
              🔗 ArXiv Link
            </button>
            <button 
              onClick={() => setMode('dummy')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'dummy' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
            >
              🎲 Try Demo
            </button>
          </div>

          <div className="flex gap-4">
            {mode === 'arxiv' && (
              <input
                type="text"
                placeholder="https://arxiv.org/abs/2401.xxxxx"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Zap />}
              {loading ? "Thinking..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {slides.length > 0 && (
          <div className="mt-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="text-blue-400" /> Generated Outline
              </h2>
              <a 
                href={`${API_URL}/api/download/${session}`} 
                target="_blank"
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Download size={20} /> Download PPTX
              </a>
            </div>

            {/* Slide Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {slides.map((slide, idx) => (
                <div key={idx} className="bg-white text-gray-900 p-6 rounded-xl shadow-lg border-l-8 border-blue-500">
                  <h3 className="font-bold text-xl mb-3">{slide.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {slide.key_points?.slice(0, 3).map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Refinement Chat */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Not satisfied? Refine it.</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="e.g., 'Make the explanation of the algorithm simpler' or 'Add a slide about limitations'"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  onClick={handleRefine}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
                  Refine
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}