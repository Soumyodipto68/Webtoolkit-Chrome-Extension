interface EyeDropperResult {
  sRGBHex: string
}

interface EyeDropperOpenOptions {
  signal?: AbortSignal
}

interface EyeDropper {
  open(
    options?: EyeDropperOpenOptions,
  ): Promise<EyeDropperResult>
}

interface Window {
  EyeDropper?: new () => EyeDropper
}