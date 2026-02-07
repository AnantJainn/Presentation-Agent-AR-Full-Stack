// import React, { useState } from 'react';
// import { BookOpen, RefreshCw, Download, Send, Zap } from 'lucide-react';

// const API_URL = import.meta.env.PROD ? "" : "http://localhost:8000";

// export default function App() {
//   const [mode, setMode] = useState('arxiv');
//   const [inputVal, setInputVal] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [session, setSession] = useState(null);
//   const [slides, setSlides] = useState([]);
//   const [feedback, setFeedback] = useState('');

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/generate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ source_type: mode, input_value: inputVal })
//       });
//       const data = await res.json();
//       setSession(data.session_id);
//       setSlides(data.slides);
//     } catch (e) {
//       alert("Error generating: " + e.message);
//     }
//     setLoading(false);
//   };

//   const handleRefine = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/refine`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ session_id: session, feedback })
//       });
//       const data = await res.json();
//       setSlides(data.slides);
//       setFeedback('');
//     } catch (e) {
//       alert("Error refining: " + e.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
//       {/* Hero Section */}
//       <div className="max-w-5xl mx-auto px-6 py-12">
//         <header className="mb-12 text-center">
//           <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
//             Research to Slides <span className="text-white">AI</span>
//           </h1>
//           <p className="text-gray-400 text-lg">Turn ArXiv papers into professional presentations in seconds.</p>
//         </header>

//         {/* Input Card */}
//         <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
//           <div className="flex gap-4 mb-6 justify-center">
//             <button 
//               onClick={() => setMode('arxiv')}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'arxiv' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
//             >
//               🔗 ArXiv Link
//             </button>
//             <button 
//               onClick={() => setMode('dummy')}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'dummy' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
//             >
//               🎲 Try Demo
//             </button>
//           </div>

//           <div className="flex gap-4">
//             {mode === 'arxiv' && (
//               <input
//                 type="text"
//                 placeholder="https://arxiv.org/abs/2401.xxxxx"
//                 className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-all"
//                 value={inputVal}
//                 onChange={(e) => setInputVal(e.target.value)}
//               />
//             )}
//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
//             >
//               {loading ? <RefreshCw className="animate-spin" /> : <Zap />}
//               {loading ? "Thinking..." : "Generate"}
//             </button>
//           </div>
//         </div>

//         {/* Results Section */}
//         {slides.length > 0 && (
//           <div className="mt-12 animate-fade-in-up">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold flex items-center gap-2">
//                 <BookOpen className="text-blue-400" /> Generated Outline
//               </h2>
//               <a 
//                 href={`${API_URL}/api/download/${session}`} 
//                 target="_blank"
//                 className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
//               >
//                 <Download size={20} /> Download PPTX
//               </a>
//             </div>

//             {/* Slide Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//               {slides.map((slide, idx) => (
//                 <div key={idx} className="bg-white text-gray-900 p-6 rounded-xl shadow-lg border-l-8 border-blue-500">
//                   <h3 className="font-bold text-xl mb-3">{slide.title}</h3>
//                   <ul className="list-disc list-inside space-y-1 text-gray-700">
//                     {slide.key_points?.slice(0, 3).map((kp, i) => (
//                       <li key={i}>{kp}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>

//             {/* Refinement Chat */}
//             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//               <h3 className="text-xl font-semibold mb-4">Not satisfied? Refine it.</h3>
//               <div className="flex gap-4">
//                 <input
//                   type="text"
//                   placeholder="e.g., 'Make the explanation of the algorithm simpler' or 'Add a slide about limitations'"
//                   className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                 />
//                 <button
//                   onClick={handleRefine}
//                   disabled={loading}
//                   className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
//                 >
//                   {loading ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
//                   Refine
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








// import React, { useState } from 'react';
// import { BookOpen, RefreshCw, Download, Send, Zap } from 'lucide-react';

// const API_URL = import.meta.env.PROD ? "" : "http://localhost:8000";

// export default function App() {
//   const [mode, setMode] = useState('arxiv');
//   const [inputVal, setInputVal] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [session, setSession] = useState(null);
//   const [slides, setSlides] = useState([]);
//   const [feedback, setFeedback] = useState('');

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/generate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ source_type: mode, input_value: inputVal })
//       });
//       const data = await res.json();
//       setSession(data.session_id);
//       setSlides(data.slides);
//     } catch (e) {
//       alert("Error generating: " + e.message);
//     }
//     setLoading(false);
//   };

//   const handleRefine = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/refine`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ session_id: session, feedback })
//       });
//       const data = await res.json();
//       setSlides(data.slides);
//       setFeedback('');
//     } catch (e) {
//       alert("Error refining: " + e.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
//       color: 'white',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       overflowX: 'hidden',
//       position: 'relative'
//     }}>
//       {/* Animated Background Particles */}
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//         zIndex: 1
//       }}>
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             style={{
//               position: 'absolute',
//               width: '4px',
//               height: '4px',
//               background: 'rgba(59, 130, 246, 0.3)',
//               borderRadius: '50%',
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${20 + Math.random() * 10}s infinite linear`,
//               animationDelay: `${Math.random() * 10}s`
//             }}
//           />
//         ))}
//       </div>

//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
//           50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes pulseGlow {
//           0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
//         }
//         @keyframes shimmer {
//           0% { background-position: -468px 0; }
//           100% { background-position: 468px 0; }
//         }
//       `}</style>

//       {/* Main Container */}
//       <div style={{
//         maxWidth: '1400px',
//         margin: '0 auto',
//         padding: '2rem 1.5rem',
//         position: 'relative',
//         zIndex: 10
//       }}>

//         {/* Hero Section */}
//         <header style={{
//           textAlign: 'center',
//           marginBottom: '4rem',
//           animation: 'fadeInUp 1s ease-out'
//         }}>
//           <h1 style={{
//             fontSize: 'clamp(2.5rem, 8vw, 5rem)',
//             fontWeight: 900,
//             background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             backgroundClip: 'text',
//             marginBottom: '1.5rem',
//             letterSpacing: '-0.02em'
//           }}>
//             Research to Slides <span style={{ 
//               background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text'
//             }}>AI</span>
//           </h1>
//           <p style={{
//             fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
//             color: 'rgba(156, 163, 175, 0.9)',
//             maxWidth: '600px',
//             margin: '0 auto',
//             lineHeight: 1.6
//           }}>
//             Transform ArXiv papers and research into stunning, professional presentations in seconds.
//           </p>
//         </header>

//         {/* Input Card */}
//         <div style={{
//           background: 'rgba(15, 23, 42, 0.8)',
//           backdropFilter: 'blur(20px)',
//           border: '1px solid rgba(59, 130, 246, 0.2)',
//           borderRadius: '24px',
//           padding: '2.5rem',
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
//           marginBottom: '3rem',
//           animation: 'fadeInUp 0.8s ease-out 0.2s both'
//         }}>

//           {/* Mode Toggle */}
//           <div style={{
//             display: 'flex',
//             gap: '1rem',
//             justifyContent: 'center',
//             marginBottom: '2rem',
//             flexWrap: 'wrap'
//           }}>
//             <button 
//               onClick={() => setMode('arxiv')}
//               style={{
//                 padding: '0.75rem 1.75rem',
//                 borderRadius: '50px',
//                 fontWeight: 600,
//                 border: '1px solid transparent',
//                 background: mode === 'arxiv' 
//                   ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
//                   : 'rgba(75, 85, 99, 0.3)',
//                 color: mode === 'arxiv' ? 'white' : 'rgba(156, 163, 175, 0.8)',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 boxShadow: mode === 'arxiv' 
//                   ? '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(59, 130, 246, 0.2)' 
//                   : 'none',
//                 fontSize: '0.95rem'
//               }}
//               onMouseEnter={(e) => {
//                 if (mode !== 'arxiv') {
//                   e.target.style.background = 'rgba(75, 85, 99, 0.4)';
//                   e.target.style.transform = 'translateY(-2px)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (mode !== 'arxiv') {
//                   e.target.style.background = 'rgba(75, 85, 99, 0.3)';
//                   e.target.style.transform = 'translateY(0)';
//                 }
//               }}
//             >
//               🔗 ArXiv Link
//             </button>
//             <button 
//               onClick={() => setMode('dummy')}
//               style={{
//                 padding: '0.75rem 1.75rem',
//                 borderRadius: '50px',
//                 fontWeight: 600,
//                 border: '1px solid transparent',
//                 background: mode === 'dummy' 
//                   ? 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)'
//                   : 'rgba(75, 85, 99, 0.3)',
//                 color: mode === 'dummy' ? 'white' : 'rgba(156, 163, 175, 0.8)',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 boxShadow: mode === 'dummy' 
//                   ? '0 10px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(139, 92, 246, 0.2)' 
//                   : 'none',
//                 fontSize: '0.95rem'
//               }}
//               onMouseEnter={(e) => {
//                 if (mode !== 'dummy') {
//                   e.target.style.background = 'rgba(139, 92, 246, 0.2)';
//                   e.target.style.transform = 'translateY(-2px)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (mode !== 'dummy') {
//                   e.target.style.background = 'rgba(75, 85, 99, 0.3)';
//                   e.target.style.transform = 'translateY(0)';
//                 }
//               }}
//             >
//               🎲 Try Demo
//             </button>
//           </div>

//           {/* Input & Generate Button */}
//           <div style={{
//             display: 'flex',
//             gap: '1.5rem',
//             flexDirection: 'column',
//             alignItems: 'stretch'
//           }}>
//             <div style={{
//               display: 'flex',
//               gap: '1.5rem',
//               flexDirection: window.innerWidth < 768 ? 'column' : 'row'
//             }}>
//               {mode === 'arxiv' && (
//                 <input
//                   type="text"
//                   placeholder="https://arxiv.org/abs/2401.xxxxx"
//                   style={{
//                     flex: 1,
//                     background: 'rgba(17, 24, 39, 0.8)',
//                     border: '1px solid rgba(55, 65, 81, 0.5)',
//                     borderRadius: '16px',
//                     padding: '1.25rem 1.75rem',
//                     color: 'white',
//                     fontSize: '1.1rem',
//                     outline: 'none',
//                     transition: 'all 0.3s ease',
//                     boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#3b82f6';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
//                     e.target.style.transform = 'scale(1.02)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = 'rgba(55, 65, 81, 0.5)';
//                     e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)';
//                     e.target.style.transform = 'scale(1)';
//                   }}
//                   value={inputVal}
//                   onChange={(e) => setInputVal(e.target.value)}
//                 />
//               )}
//               <button
//                 onClick={handleGenerate}
//                 disabled={loading}
//                 style={{
//                   background: loading 
//                     ? 'rgba(59, 130, 246, 0.4)' 
//                     : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
//                   color: 'white',
//                   padding: '1.25rem 2.5rem',
//                   borderRadius: '16px',
//                   fontWeight: 700,
//                   fontSize: '1.1rem',
//                   border: 'none',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.75rem',
//                   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                   boxShadow: '0 12px 30px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(59, 130, 246, 0.3)',
//                   minWidth: '160px',
//                   justifyContent: 'center'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!loading) {
//                     e.target.style.transform = 'translateY(-3px)';
//                     e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.5), 0 8px 20px rgba(59, 130, 246, 0.3)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!loading) {
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(59, 130, 246, 0.3)';
//                   }
//                 }}
//               >
//                 {loading ? <RefreshCw style={{ animation: 'spin 1s linear infinite' }} size={24} /> : <Zap size={24} />}
//                 {loading ? "Thinking..." : "Generate"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Results Section */}
//         {slides.length > 0 && (
//           <div style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>

//             {/* Header with Download */}
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '2.5rem',
//               flexWrap: 'wrap',
//               gap: '1rem'
//             }}>
//               <h2 style={{
//                 fontSize: '1.75rem',
//                 fontWeight: 800,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '1rem',
//                 color: 'white'
//               }}>
//                 <BookOpen style={{ color: '#3b82f6', width: '32px', height: '32px' }} />
//                 Generated Presentation Outline
//               </h2>
//               <a 
//                 href={`${API_URL}/api/download/${session}`} 
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                   background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                   color: 'white',
//                   padding: '0.875rem 1.75rem',
//                   borderRadius: '12px',
//                   fontWeight: 600,
//                   fontSize: '0.95rem',
//                   textDecoration: 'none',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.75rem',
//                   transition: 'all 0.3s ease',
//                   boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.transform = 'translateY(-2px)';
//                   e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.5)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
//                 }}
//               >
//                 <Download size={20} />
//                 Download PPTX
//               </a>
//             </div>

//             {/* Slide Grid */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
//               gap: '1.75rem',
//               marginBottom: '3rem'
//             }}>
//               {slides.map((slide, idx) => (
//                 <div key={idx} style={{
//                   background: 'rgba(255, 255, 255, 0.08)',
//                   backdropFilter: 'blur(12px)',
//                   color: '#f8fafc',
//                   padding: '2rem',
//                   borderRadius: '20px',
//                   boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
//                   borderLeft: '5px solid #3b82f6',
//                   transition: 'all 0.3s ease',
//                   animation: `fadeInUp 0.6s ease-out ${0.1 + idx * 0.1}s both`
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-8px)';
//                   e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)';
//                 }}
//                 >
//                   <h3 style={{
//                     fontSize: '1.25rem',
//                     fontWeight: 800,
//                     marginBottom: '1.25rem',
//                     color: 'white'
//                   }}>
//                     {slide.title}
//                   </h3>
//                   <ul style={{
//                     listStyle: 'none',
//                     padding: 0,
//                     spaceY: '0.75rem'
//                   }}>
//                     {slide.key_points?.slice(0, 3).map((kp, i) => (
//                       <li key={i} style={{
//                         color: 'rgba(248, 250, 252, 0.9)',
//                         marginBottom: '0.75rem',
//                         paddingLeft: '1.5rem',
//                         position: 'relative',
//                         fontSize: '0.95rem',
//                         lineHeight: 1.5
//                       }}>
//                         <span style={{
//                           position: 'absolute',
//                           left: 0,
//                           top: '0.2rem',
//                           width: '6px',
//                           height: '6px',
//                           background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
//                           borderRadius: '50%'
//                         }} />
//                         {kp}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>

//             {/* Refinement Chat */}
//             <div style={{
//               background: 'rgba(15, 23, 42, 0.8)',
//               backdropFilter: 'blur(20px)',
//               padding: '2.5rem',
//               borderRadius: '20px',
//               border: '1px solid rgba(139, 92, 246, 0.2)',
//               animation: 'fadeInUp 0.8s ease-out 0.6s both'
//             }}>
//               <h3 style={{
//                 fontSize: '1.5rem',
//                 fontWeight: 700,
//                 marginBottom: '1.75rem',
//                 color: 'white'
//               }}>
//                 Not perfect yet? Refine it.
//               </h3>
//               <div style={{
//                 display: 'flex',
//                 gap: '1.5rem',
//                 flexDirection: window.innerWidth < 768 ? 'column' : 'row'
//               }}>
//                 <input
//                   type="text"
//                   placeholder="e.g., 'Simplify algorithm explanation' or 'Add limitations slide'"
//                   style={{
//                     flex: 1,
//                     background: 'rgba(17, 24, 39, 0.8)',
//                     border: '1px solid rgba(55, 65, 81, 0.5)',
//                     borderRadius: '12px',
//                     padding: '1rem 1.5rem',
//                     color: 'white',
//                     fontSize: '1rem',
//                     outline: 'none',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#8b5cf6';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = 'rgba(55, 65, 81, 0.5)';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                 />
//                 <button
//                   onClick={handleRefine}
//                   disabled={loading}
//                   style={{
//                     background: loading 
//                       ? 'rgba(139, 92, 246, 0.4)' 
//                       : 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
//                     color: 'white',
//                     padding: '1rem 2rem',
//                     borderRadius: '12px',
//                     fontWeight: 600,
//                     fontSize: '1rem',
//                     border: 'none',
//                     cursor: loading ? 'not-allowed' : 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '0.75rem',
//                     transition: 'all 0.3s ease',
//                     boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
//                     whiteSpace: 'nowrap'
//                   }}
//                 >
//                   {loading ? <RefreshCw style={{ animation: 'spin 1s linear infinite' }} size={20} /> : <Send size={20} />}
//                   Refine
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Additional Global Styles */}
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         * {
//           box-sizing: border-box;
//         }
//         input::placeholder {
//           color: rgba(156, 163, 175, 0.6);
//         }
//         @media (max-width: 768px) {
//           div[style*="grid"] {
//             grid-template-columns: 1fr !important;
//           }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           *, *::before, *::after {
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: 0.01ms !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }






import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, RefreshCw, Download, Send, Zap, Terminal, Clock } from 'lucide-react';

const API_URL = import.meta.env.PROD ? "" : "http://localhost:8000";

// --- Log Window Component (New) ---
const LogWindow = ({ logs }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{
      marginTop: '2rem',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '16px',
      overflow: 'hidden',
      animation: 'fadeInUp 0.5s ease-out'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#94a3b8'
      }}>
        <Terminal size={14} /> Agent Neural Logs
      </div>
      <div ref={scrollRef} style={{
        height: '200px',
        overflowY: 'auto',
        padding: '1rem 1.5rem',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {logs.length === 0 && <span style={{ color: '#64748b' }}>Initializing agent sequence...</span>}
        {logs.map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', color: '#e2e8f0' }}>
            <span style={{ color: '#3b82f6', opacity: 0.8 }}>
              [{log.split(']')[0].replace('[', '').slice(0, 8)}]
            </span>
            <span>{log.split(']')[1] || log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState('arxiv');
  const [inputVal, setInputVal] = useState('');
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'completed'
  const [logs, setLogs] = useState([]);
  const [slides, setSlides] = useState([]);
  const [feedback, setFeedback] = useState('');

  // --- Polling Logic (The "Brain") ---
  useEffect(() => {
    let interval;
    if (session && status === 'processing') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/status/${session}`);
          const data = await res.json();
          setLogs(data.logs || []);

          if (data.status === 'completed') {
            setStatus('completed');
            setSlides(data.slides || []);
            clearInterval(interval);
          } else if (data.status === 'failed') {
            setStatus('failed');
            alert("Generation failed. Check logs.");
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 1000); // Check every 1 second
    }
    return () => clearInterval(interval);
  }, [session, status]);

  const handleGenerate = async () => {
    if (!inputVal && mode === 'arxiv') return alert("Please enter a URL");

    setStatus('processing');
    setLogs([]);
    setSlides([]);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: mode, input_value: inputVal })
      });
      const data = await res.json();
      setSession(data.session_id);
    } catch (e) {
      alert("Error starting: " + e.message);
      setStatus('idle');
    }
  };

  const handleRefine = async () => {
    if (!feedback) return;
    setStatus('processing'); // Restart polling
    try {
      await fetch(`${API_URL}/api/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session, feedback })
      });
    } catch (e) {
      alert("Error refining: " + e.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Animated Background Particles */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${20 + Math.random() * 10}s infinite linear`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Hero Section */}
        <header style={{
          textAlign: 'center',
          marginBottom: '4rem',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Research to Slides <span>AI</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: 'rgba(156, 163, 175, 0.9)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Transform ArXiv papers into stunning presentations.
          </p>
        </header>

        {/* Input Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          marginBottom: '3rem',
          animation: 'fadeInUp 0.8s ease-out 0.2s both'
        }}>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => setMode('arxiv')}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '50px',
                fontWeight: 600,
                border: 'none',
                background: mode === 'arxiv' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'rgba(75, 85, 99, 0.3)',
                color: mode === 'arxiv' ? 'white' : 'rgba(156, 163, 175, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔗 ArXiv Link
            </button>
            <button
              onClick={() => setMode('dummy')}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '50px',
                fontWeight: 600,
                border: 'none',
                background: mode === 'dummy' ? 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)' : 'rgba(75, 85, 99, 0.3)',
                color: mode === 'dummy' ? 'white' : 'rgba(156, 163, 175, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🎲 Try Demo
            </button>
          </div>

          {/* Input & Generate */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {mode === 'arxiv' && (
              <input
                type="text"
                placeholder="https://arxiv.org/abs/2401.xxxxx"
                style={{
                  flex: 1,
                  minWidth: '250px',
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.75rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            )}
            <button
              onClick={handleGenerate}
              disabled={status === 'processing'}
              style={{
                background: status === 'processing' ? 'rgba(59, 130, 246, 0.4)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '1.25rem 2.5rem',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1.1rem',
                border: 'none',
                cursor: status === 'processing' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexGrow: mode === 'dummy' ? 1 : 0,
                justifyContent: 'center'
              }}
            >
              {status === 'processing' ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} />}
              {status === 'processing' ? "Thinking..." : "Generate"}
            </button>
          </div>

          {/* LOGS WINDOW (Inserted Here) */}
          {(status === 'processing' || logs.length > 0) && <LogWindow logs={logs} />}

        </div>

        {/* Results Section */}
        {/* Results Section */}
        {status === 'completed' && slides.length > 0 && (
          <div style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>

            {/* Header with Download */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <BookOpen style={{ color: '#3b82f6' }} /> Presentation Outline
              </h2>

              {/* UPDATED DOWNLOAD LINKS */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a
                  href={`${API_URL}/api/download/pptx/${session}`}  // <--- FIXED PATH
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Download size={20} /> PPTX
                </a>

                {/* Optional: Add TeX Download since your backend supports it */}
                <a
                  href={`${API_URL}/api/download/tex/${session}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <FileText size={20} /> TeX
                </a>
              </div>
            </div>

            {/* ... rest of the slide grid ... */}

            {/* Slide Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
              {slides.map((slide, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  padding: '2rem',
                  borderRadius: '20px',
                  borderLeft: '5px solid #3b82f6'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>{slide.title}</h3>
                  <ul style={{ paddingLeft: '1.5rem', color: 'rgba(248, 250, 252, 0.9)' }}>
                    {slide.key_points?.slice(0, 3).map((kp, i) => (
                      <li key={i} style={{ marginBottom: '0.75rem' }}>{kp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Refinement */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '2.5rem',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.75rem' }}>Not perfect? Refine it.</h3>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g., 'Simplify algorithm explanation'..."
                  style={{
                    flex: 1,
                    background: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    color: 'white',
                    outline: 'none',
                    minWidth: '200px'
                  }}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  onClick={handleRefine}
                  disabled={status === 'processing'}
                  style={{
                    background: status === 'processing' ? 'rgba(139, 92, 246, 0.4)' : 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: status === 'processing' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  {status === 'processing' ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
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