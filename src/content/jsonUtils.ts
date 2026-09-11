export type JsonResult =
  | {
      valid: true
      formatted: string
    }
  | {
      valid: false
      error: string
    }

export function formatJson(input: string, spaces = 2): JsonResult {
  try {
    const parsed = JSON.parse(input)

    return {
      valid: true,
      formatted: JSON.stringify(parsed, null, spaces),
    }
  } catch (error) {
    return {
      valid: false,
      error: getJsonError(error),
    }
  }
}

export function minifyJson(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input)

    return {
      valid: true,
      formatted: JSON.stringify(parsed),
    }
  } catch (error) {
    return {
      valid: false,
      error: getJsonError(error),
    }
  }
}

export function validateJson(input: string): JsonResult {
  try {
    JSON.parse(input)

    return {
      valid: true,
      formatted: input,
    }
  } catch (error) {
    return {
      valid: false,
      error: getJsonError(error),
    }
  }
}

function getJsonError(error: unknown): string {
  if (error instanceof SyntaxError) {
    return error.message
  }

  return 'Invalid JSON'
}