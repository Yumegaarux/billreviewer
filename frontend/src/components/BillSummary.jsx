import { useState } from "react";

export default function BillSummary({ bill }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
                    content: "You are a civic education assistant helping Filipino citizens understand legislative bills. Explain bills in simple, clear English in 3-4 sentences. Avoid legal jargon."
                },
                {
                role: "user",
                content: `Explain this Philippine Senate bill in plain English:
                            Title: ${bill.long_title}
                            Subjects: ${bill.subjects.join(', ')}`
                }
            ]
        })
    }
    );

const data = await response.json();
console.log(data);
const text = data.choices?.[0]?.message?.content;
if (!text) throw new Error("No summary returned");
setSummary(text);

    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-3 p-4 bg-white border border-gray-200 rounded-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
          AI SUMMARY
        </span>
        <span className="font-semibold text-sm">What is this bill about?</span>
      </div>

      {!summary && !loading && (
        <p className="text-gray-500 text-sm">
          Click below to get a plain English explanation of this bill.
        </p>
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
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={generate}
        disabled={loading}
        className="mt-3 bg-blue-700 text-white text-sm px-4 py-2 rounded-md 
                   hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : summary ? "↺ Regenerate" : "Explain this bill"}
      </button>
    </div>
  );
}