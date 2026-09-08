type PasswordOptionsProps = {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean

  onUppercaseChange: (value: boolean) => void
  onLowercaseChange: (value: boolean) => void
  onNumbersChange: (value: boolean) => void
  onSymbolsChange: (value: boolean) => void
}

type OptionProps = {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}

function Option({
  label,
  checked,
  onChange,
}: OptionProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-zinc-300">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-white"
      />
    </label>
  )
}

function PasswordOptions({
  uppercase,
  lowercase,
  numbers,
  symbols,
  onUppercaseChange,
  onLowercaseChange,
  onNumbersChange,
  onSymbolsChange,
}: PasswordOptionsProps) {
  return (
    <section className="mt-5 space-y-3">
      <Option
        label="Uppercase letters"
        checked={uppercase}
        onChange={onUppercaseChange}
      />

      <Option
        label="Lowercase letters"
        checked={lowercase}
        onChange={onLowercaseChange}
      />

      <Option
        label="Numbers"
        checked={numbers}
        onChange={onNumbersChange}
      />

      <Option
        label="Symbols"
        checked={symbols}
        onChange={onSymbolsChange}
      />
    </section>
  )
}

export default PasswordOptions