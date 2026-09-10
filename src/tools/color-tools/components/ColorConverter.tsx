import {
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  type HSL,
  type RGB,
} from '../../../content/colorUtils'

type ColorConverterProps = {
  color: string
  onColorChange: (color: string) => void
}



function ColorConverter({
  color,
  onColorChange,
}: ColorConverterProps) {
  const rgb =
    hexToRgb(color) ?? {
      r: 0,
      g: 0,
      b: 0,
    }

  const hsl = rgbToHsl(rgb)

  const updateRgb = (
    key: keyof RGB,
    value: string,
  ) => {
    const numberValue = Math.min(
      255,
      Math.max(0, Number(value) || 0),
    )

    const newRgb: RGB = {
      ...rgb,
      [key]: numberValue,
    }

    onColorChange(rgbToHex(newRgb))
  }

  const updateHsl = (
    key: keyof HSL,
    value: string,
  ) => {
    const max =
      key === 'h' ? 360 : 100

    const numberValue = Math.min(
      max,
      Math.max(0, Number(value) || 0),
    )

    const newHsl: HSL = {
      ...hsl,
      [key]: numberValue,
    }

    const newRgb = hslToRgb(newHsl)

    onColorChange(rgbToHex(newRgb))
  }

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Converter
      </h2>

      <div className="space-y-3">
        {/* RGB */}
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-500">
            RGB
          </p>

          <div className="grid grid-cols-3 gap-2">
            <ColorInput
              label="R"
              value={rgb.r}
              onChange={(value) =>
                updateRgb('r', value)
              }
              max={255}
            />

            <ColorInput
              label="G"
              value={rgb.g}
              onChange={(value) =>
                updateRgb('g', value)
              }
              max={255}
            />

            <ColorInput
              label="B"
              value={rgb.b}
              onChange={(value) =>
                updateRgb('b', value)
              }
              max={255}
            />
          </div>
        </div>

        {/* HSL */}
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-500">
            HSL
          </p>

          <div className="grid grid-cols-3 gap-2">
            <ColorInput
              label="H"
              value={hsl.h}
              onChange={(value) =>
                updateHsl('h', value)
              }
              max={360}
            />

            <ColorInput
              label="S"
              value={hsl.s}
              onChange={(value) =>
                updateHsl('s', value)
              }
              max={100}
            />

            <ColorInput
              label="L"
              value={hsl.l}
              onChange={(value) =>
                updateHsl('l', value)
              }
              max={100}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

type ColorInputProps = {
  label: string
  value: number
  max: number
  onChange: (value: string) => void
}

function ColorInput({
  label,
  value,
  max,
  onChange,
}: ColorInputProps) {
  return (
    <label className="rounded-xl border border-zinc-800 bg-zinc-900 p-2">
      <span className="mb-1 block text-[10px] font-semibold text-zinc-600">
        {label}
      </span>

      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full bg-transparent text-sm text-white outline-none"
      />
    </label>
  )
}

export default ColorConverter