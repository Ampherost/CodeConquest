import { useState, useId } from "react";

export default function MCQ({ options = [], onAnswer, title }) {
  const [selected, setSelected] = useState(null);
  const groupName = useId();

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="flex justify-center py-10 px-4 md:px-10 font-sans">
      <div className="max-w-4xl w-full flex flex-col">
        {title && (
          <p className="text-white text-base md:text-lg font-semibold mb-6 px-2 md:px-0">
            {title}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <label
              key={option}
              className={`
                flex items-center gap-4 rounded-xl border p-4 cursor-pointer
                transition-all select-none
                ${selected === option ? "border-[#58a6ff] bg-zinc-800" : "border-[#30363d] bg-transparent"}
                hover:border-[#58a6ff]`}
            >
              <span className="relative w-6 h-6 grid place-items-center shrink-0">
                <input
                  type="radio"
                  name={groupName}
                  value={option}
                  checked={selected === option}
                  onChange={() => handleSelect(option)}
                  className="
                    peer appearance-none w-6 h-6 rounded-full border-2 border-[#30363d]
                    bg-transparent checked:border-[#58a6ff] focus:outline-none
                    focus:ring-2 focus:ring-[#58a6ff80]"
                />
                <span className="absolute w-3 h-3 bg-[#58a6ff] rounded-full opacity-0 peer-checked:opacity-100" />
              </span>

              <p className="text-white text-base font-medium leading-normal">
                {option}
              </p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FRQ({ onAnswer, description, hints, title }) {
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setResponse(value);
    onAnswer(value);
  };

  const handleTabInsert = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updated =
        response.substring(0, start) + "\t" + response.substring(end);
      setResponse(updated);
      onAnswer(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <header className="mb-10 border-b border-zinc-300 dark:border-zinc-700 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </header>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="md:w-[40%] bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl shadow-inner border border-zinc-300 dark:border-zinc-700">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 border-b border-blue-300 dark:border-blue-500 pb-2 mb-3">
                Description
              </h2>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 text-base leading-relaxed">
                {description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 border-b border-blue-300 dark:border-blue-500 pb-2 mb-3">
                Hint
              </h2>
              <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 text-base leading-relaxed space-y-1">
                {Array.isArray(hints) && hints.length > 0 ? (
                  hints.map((hint, index) => (
                    <li key={`${hint}-${index}`}>{hint}</li>
                  ))
                ) : (
                  <li>No hints available.</li>
                )}
              </ul>
            </section>
          </aside>

          {/* Textarea */}
          <div className="md:w-[60%] relative">
            <textarea
              value={response}
              onChange={handleChange}
              onKeyDown={handleTabInsert}
              placeholder="Type your answer here..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              rows={20}
              className="
                w-full min-h-[600px] p-5 font-mono text-base text-zinc-900 dark:text-zinc-100
                resize-y rounded-xl bg-zinc-100 dark:bg-zinc-800
                border border-zinc-300 dark:border-zinc-700 shadow-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
                placeholder:text-zinc-500 dark:placeholder:text-zinc-400 caret-blue-500
                scrollbar-thin scrollbar-thumb-blue-400/70 scrollbar-track-transparent
                transition duration-300"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-xl border border-blue-300 dark:border-blue-500 blur-sm opacity-20 pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
