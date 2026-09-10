type ColorPickerProps = {
  color: string
  onChange: (color: string) => void
}

function ColorPicker({color,onChange,}: ColorPickerProps) {
  return (
    <section className="mb-5">
      <div
        className="relative h-40 overflow-hidden rounded-2xl border border-zinc-800"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <label className="cursor-pointer rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/40">
            Pick Color

            <input
              type="color"
              value={color}
              onChange={(event) =>
                onChange(event.target.value.toUpperCase())
              }
              className="absolute h-0 w-0 opacity-0"
            />
          </label>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="h-10 w-10 shrink-0 rounded-lg border border-zinc-700"
          style={{ backgroundColor: color }}
        />

        <input
          type="text"
          value={color}
          onChange={(event) =>
            onChange(event.target.value.toUpperCase())
          }
          className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          placeholder="#6366F1"
          maxLength={7}
        />
      </div>
    </section>
  )
}

export default ColorPicker