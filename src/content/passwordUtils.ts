export type PasswordOptions = {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const CHARACTERS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export function generatePassword(options: PasswordOptions): string {
  const {
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
  } = options

  let characters = ''

  if (uppercase) characters += CHARACTERS.uppercase
  if (lowercase) characters += CHARACTERS.lowercase
  if (numbers) characters += CHARACTERS.numbers
  if (symbols) characters += CHARACTERS.symbols

  if (!characters) return ''

  const randomValues = new Uint32Array(length)
  crypto.getRandomValues(randomValues)

  return Array.from(randomValues, (value) =>
    characters[value % characters.length],
  ).join('')
}