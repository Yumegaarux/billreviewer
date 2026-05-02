import { useState } from "react";

export default function BillSummary({ bill }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    console.log(import.meta.env.VITE_GEMINI_KEY);

    try {
      const response = await fetch( "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_KEY}`
        },
        body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a civic education assistant helping Filipino citizens understand legislative bills
                    . Explain bills in simple, clear English in 3-4 sentences. 
                    Avoid legal jargon.`
          },
          {
            role: "user",
            content: `Explain this Philippine Senate bill in plain English:
                    Title: ${bill.long_title}
                    Subjects: ${bill.subjects.join(', ')}
                    . Also do not state how many sentences your summary contains.`
          }
        ]
        })
      } 
    );

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) throw new Error("No summary returned");

    setSummary(text);
    setGenerated(true);
    } 
    catch (err) {
      setError("Failed to generate summary. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col m-1.5 p-4 w-3/4 h-52 bg-white border border-gray-200 rounded-md pb-4" >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
          AI SUMMARY
        </span>
        <span className="font-semibold text-sm">What is this bill about?</span>
      </div>
      
      {!summary && !loading && (
        <p className="text-gray-500 text-sm ">
          Click below to get a plain English explanation of this bill.
        </p>
      )}

      {summary && loading && (
        <div className="bg-gray-200 w-full h-0.5"/> 
      )}

      {loading && (
        <div className="space-y-2">
          {[100, 90, 95, 75].map((w, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded animate-pulse"
                 style={{ width: `${w}%` }} />
          ))}
        </div>  
      )}

      {summary && (
        <div className="max-h-40 overflow-y-auto pr-2">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {!generated &&
        <button
          onClick={generate}
          disabled={loading | generated}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md cursor-pointer
                    hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed justify-end mt-auto" 
        >
          {loading ? "Generating..." : "Explain this bill"}
        </button>
      }
    </div>
  );
}