import { useState } from 'react'

import PasswordDisplay from './components/PasswordDisplay'
import PasswordLength from './components/PasswordLength'
import PasswordOptions from './components/PasswordOptions'
import StrengthIndicator from './components/StrengthIndicator'
import { generatePassword } from '../../content/passwordUtils'

type Strength = 'Weak' | 'Medium' | 'Strong' | 'Unbreakable'

function PasswordGenerator() {
  const [length, setLength] = useState(8)

  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)

  const [password, setPassword] = useState('')

const getStrength = (): Strength => {
  const selectedOptions = [
    uppercase,
    lowercase,
    numbers,
    symbols,
  ].filter(Boolean).length

  if (length >= 16 && selectedOptions >= 3) {
    return 'Unbreakable'
  }

  // Strong: 16–20 characters + at least 3 character types
  if (length >= 10 && selectedOptions >= 3) {
    return 'Strong'
  }

  // Medium: 12–15 characters + at least 2 character types
  if (length >= 8 && selectedOptions >= 2) {
    return 'Medium'
  }

  return 'Weak'
}
  const handleGenerate = () => {
    const newPassword = generatePassword({
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
    })

    setPassword(newPassword)
  }

  const handleCopy = async () => {
    if (!password) return

    await navigator.clipboard.writeText(password)
  }

  const strength = getStrength()

  return (
    <main className="min-h-[500px] w-[380px] bg-zinc-950 p-5 text-white">
      {/* Header */}

      <header className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <h1 className="text-lg font-bold">
            🔐 Password Generator
          </h1>

          <p className="text-xs text-zinc-500">
            Create a strong password
          </p>
        </div>
      </header>

      {/* Password */}

      <PasswordDisplay
        password={password}
        onCopy={handleCopy}
      />

      {/* Strength */}

      {password && (
        <StrengthIndicator
          strength={strength}
        />
      )}

      {/* Length */}

      <PasswordLength
        length={length}
        onChange={setLength}
      />

      {/* Options */}

      <PasswordOptions
        uppercase={uppercase}
        lowercase={lowercase}
        numbers={numbers}
        symbols={symbols}
        onUppercaseChange={setUppercase}
        onLowercaseChange={setLowercase}
        onNumbersChange={setNumbers}
        onSymbolsChange={setSymbols}
      />

      {/* Generate */}

      <button
        onClick={handleGenerate}
        className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        🔄 Generate Password
      </button>
    </main>
  )
}

export default PasswordGenerator