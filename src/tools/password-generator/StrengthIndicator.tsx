type Strength = 'Weak' | 'Medium' | 'Strong' | 'Unbreakable'

type StrengthIndicatorProps = {
  strength: Strength
}

function StrengthIndicator({
  strength,
}: StrengthIndicatorProps) {
  const strengthStyles = {
    Weak: {
      text: 'text-red-400',
      bar: 'w-1/3 bg-red-500',
    },
    Medium: {
      text: 'text-yellow-400',
      bar: 'w-2/3 bg-yellow-500',
    },
    Strong: {
      text: 'text-green-400',
      bar: 'w-full bg-green-500',
    },
    Unbreakable: {
      text: 'text-blue-400',
      bar: 'w-full bg-blue-500',
    },
  }

  const styles = strengthStyles[strength]

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-zinc-500">
          Strength
        </span>

        <span className={styles.text}>
          {strength}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${styles.bar}`}
        />
      </div>
    </div>
  )
}

export default StrengthIndicator