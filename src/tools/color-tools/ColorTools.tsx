import { useEffect, useState } from 'react'

import ColorPicker from './components/ColorPicker'
import ColorValues from './components/ColorValues'
import ColorConverter from './components/ColorConverter'
import {
  hexToRgb,
  rgbToHsl,
} from '../../content/colorUtils'

type ColorToolsProps = {
  onBack: () => void
}

const DEFAULT_COLOR = '#6366F1'

function ColorTools({
  onBack,
}: ColorToolsProps) {
  const [color, setColor] =
    useState(DEFAULT_COLOR)

  const rgb = hexToRgb(color)

  useEffect(() => {
    if (!rgb) {
      return
    }
  }, [rgb])

  const handleColorChange = (
    newColor: string,
  ) => {
    const normalized =
      newColor.startsWith('#')
        ? newColor
        : `#${newColor}`

    if (
      /^#[0-9A-Fa-f]{6}$/.test(normalized)
    ) {
      setColor(normalized.toUpperCase())
    }
  }

  const handleConverterChange = (
    newColor: string,
  ) => {
    setColor(newColor)
  }

  const resetColor = () => {
    setColor(DEFAULT_COLOR)
  }

  const currentRgb =
    rgb ?? {
      r: 0,
      g: 0,
      b: 0,
    }

  const currentHsl =
    rgbToHsl(currentRgb)

  return (
    <main className="min-h-[500px] w-[380px] bg-zinc-950 text-white">
      <div className="p-5">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Go back"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <h1 className="text-lg font-bold">
              Color Tools
            </h1>

            <p className="text-xs text-zinc-500">
              Pick and convert colors
            </p>
          </div>
        </header>

        {/* Color Picker */}
        <ColorPicker
          color={color}
          onChange={handleColorChange}
        />

        {/* Color Values */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Color Values
            </h2>

            <button
              onClick={resetColor}
              className="text-xs text-zinc-600 transition hover:text-zinc-300"
            >
              Reset
            </button>
          </div>

          <ColorValues
            color={color}
            rgb={currentRgb}
            hsl={currentHsl}
          />
        </div>

        {/* Converter */}
        <ColorConverter
          color={color}
          onColorChange={handleConverterChange}
        />

        {/* Footer */}
        <footer className="mt-6 border-t border-zinc-800 pt-4 text-center">
          <p className="text-xs text-zinc-600">
            WebToolKit Color Tools
          </p>
        </footer>
      </div>
    </main>
  )
}

export default ColorTools