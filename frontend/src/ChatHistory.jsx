import { useState, useEffect } from "react";
import axios from "axios";

export default function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/history");
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#25D366] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-4 glass-panel">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Chat History</h2>
          <p className="text-slate-400">View all incoming and outgoing messages.</p>
        </div>
        <button onClick={fetchHistory} className="wa-button !px-4 !py-2 text-sm flex gap-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21v-5h5"></path></svg>
          Refresh
        </button>
      </header>

      <div className="glass-panel overflow-hidden flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No messages found.</div>
          ) : (
            history.map((msg, idx) => (
              <div key={msg._id || idx} className={`flex flex-col ${msg.isAI ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.isAI ? 'bg-[#25D366]/20 border border-[#25D366]/30 text-white rounded-br-sm' : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-sm'}`}>
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                    {msg.isAI ? (
                      <><span className="text-[#25D366]">AI Assistant / You</span> • {msg.receiver}</>
                    ) : (
                      <><span className="text-slate-300">{msg.sender}</span> • Incoming</>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap break-words text-sm">{msg.message}</div>
                  <div className="text-[10px] text-slate-500 mt-2 text-right">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
