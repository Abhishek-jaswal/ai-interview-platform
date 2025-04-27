'use client';

import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';

const TOPICS = ['Frontend', 'Backend', 'DSA', 'System Design', 'HR'];

export default function InterviewPage() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  
  const startInterview = () => {
    if (!topic) return;
    const welcomeMessage = {
      role: 'assistant',
      content: `🚀 Awesome! Let's start your **${topic}** interview. Get ready for your first question!`,
    };
    setMessages([welcomeMessage]);
    setStarted(true);
    setQuestionCount(1);
  };

  const handleSend = async () => {
    if (!input.trim() || interviewEnded) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        body: JSON.stringify({ messages: updatedMessages, topic }),
      });
      const data = await res.json();

      const assistantMessage = { role: 'assistant', content: data.result };
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      // Extract and update score
      const scoreMatch = data.result.match(/⭐\sScore:\s(\d)\/5/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      setTotalScore((prev) => prev + score);

      if (questionCount >= 5) {
        // Interview finished
        const finalMessage = {
          role: 'assistant',
          content: `🎯 **Mock Interview Completed!**

✅ You answered ${questionCount} questions.

⭐ **Total Score:** ${totalScore + score}/25

Thanks for practicing! 🚀 Keep growing! 💪`,
        };
        setMessages([...newMessages, finalMessage]);
        setInterviewEnded(true);
      } else {
        setQuestionCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error during interview:', error);
      // Optional: You can show an error message in UI
    } finally {
      setLoading(false);
    }
  };

  const restartInterview = () => {
    setTopic('');
    setMessages([]);
    setInput('');
    setStarted(false);
    setQuestionCount(0);
    setInterviewEnded(false);
    setTotalScore(0);
    setLoading(false);
  };

  const typingAnimation = () => (
    <span className="italic text-gray-400">
      ⏳ AI is thinking
      <span className="animate-ping inline-block mx-1 text-xl">.</span>
      <span className="animate-ping inline-block mx-1 text-xl">.</span>
      <span className="animate-ping inline-block mx-1 text-xl">.</span>
    </span>
  );

  return (
    <div>
      <ProtectedRoute>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
    
      <div className="bg-gray-100 shadow-lg rounded-2xl p-8 max-w-3xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-purple-700">🎤 AI Mock Interview</h1>

        {!started ? (
          <div className="space-y-5 text-center">
            <p className="text-lg font-semibold text-gray-700">Select a topic to begin:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-5 py-2 rounded-full border-2 font-semibold ${
                    topic === t
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-purple-400 text-purple-600'
                  } transition hover:bg-purple-600 hover:text-white`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={startInterview}
              disabled={!topic}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-bold transition"
            >
              🚀 Start Interview
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>🎯 Question: {questionCount} / 5</div>
              <div>⭐ Score: {totalScore} / 25</div>
            </div>
             <hr className='border-gray-400'></hr>
            <div className=" rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-100 space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      msg.role === 'user' ? 'bg-blue-200' : 'bg-green-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && typingAnimation()}
            </div>

            {!interviewEnded ? (
              <div className="flex gap-3 mt-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 border-2 border-purple-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Type your answer here..."
                />
                <button
                  onClick={handleSend}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 mt-6">
                <div className="text-green-600 font-bold text-xl">🎉 Interview Completed!</div>
                <button
                  onClick={restartInterview}
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-full transition"
                >
                  🔁 Restart
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
    </div>
  );
}
