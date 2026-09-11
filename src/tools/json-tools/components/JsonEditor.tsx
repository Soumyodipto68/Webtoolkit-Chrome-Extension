type JsonEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-400">JSON Input</label>

        <span className="text-[10px] text-zinc-600">
          {value.length} characters
        </span>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        placeholder={`{
          "name": "John",
          "age": 25,
          "developer": true
        }`}
        className="min-h-[260px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-zinc-600"
      />
    </div>
  );
}
