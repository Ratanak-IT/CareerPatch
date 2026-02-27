import { useMemo, useState } from "react";

export default function SkillsInput({ value = [], onChange }) {
  const [draft, setDraft] = useState("");

  const skills = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const addSkill = () => {
    const s = draft.trim();
    if (!s) return;
    if (skills.some((x) => String(x).toLowerCase() === s.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...skills, s]);
    setDraft("");
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((x) => x !== skill));
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 outline-none"
          placeholder="Type skill and press Enter"
        />
        <button
          type="button"
          onClick={addSkill}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add skill
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map((s) => (
          <span
            key={s}
            className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-2"
          >
            {s}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => removeSkill(s)}
              aria-label="remove skill"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}