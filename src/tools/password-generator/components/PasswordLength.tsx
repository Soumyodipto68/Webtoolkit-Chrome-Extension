type PasswordLengthProps = {
  length: number
  onChange: (length: number) => void
}

function PasswordLength({
  length,
  onChange,
}: PasswordLengthProps) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex justify-between">
        <label
          htmlFor="password-length"
          className="text-sm text-zinc-300"
        >
          Password length
        </label>

        <span className="text-sm font-semibold">
          {length}
        </span>
      </div>

      <input
        id="password-length"
        type="range"
        min="6"
        max="20"
        value={length}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full accent-white"
      />

      <div className="mt-1 flex justify-between text-xs text-zinc-600">
        <span>6</span>
        <span>20</span>
      </div>
    </section>
  )
}

export default PasswordLength