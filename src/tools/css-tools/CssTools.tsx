import { useEffect, useState } from 'react'
import CssItem from './components/CssItem'

type SelectedElement = {
  tagName: string
  id: string
  classes: string[]
  selector: string
  attributes: Record<string, string>
  width: number
  height: number
}

type CssToolsProps = {
  onBack: () => void
}

export default function CssTools({
  onBack,
}: CssToolsProps) {
  const [selected, setSelected] =
    useState<SelectedElement | null>(null)

  const [picking, setPicking] = useState(false)
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    chrome.storage.local.get(
      ['cssPickerSelection'],
      (result) => {
        const selection =
          result.cssPickerSelection as SelectedElement | undefined

        if (selection) {
          setSelected(selection)
        } else {
          setSelected(null)
        }

        setRestoring(false)
      }
    )

    const listener = (
      message: {
        type?: string
        data?: SelectedElement
      }
    ) => {
      if (
        message.type === 'CSS_ELEMENT_SELECTED' &&
        message.data
      ) {
        setSelected(message.data)
        setPicking(false)
        setRestoring(false)
      }
    }

    chrome.runtime.onMessage.addListener(listener)

    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, [])

  const startPicker = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (!tab.id) return

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'START_CSS_PICKER',
      })
    } catch {
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ['cssPicker.js'],
      })

      await chrome.tabs.sendMessage(tab.id, {
        type: 'START_CSS_PICKER',
      })
    }

    // Popup is intentionally allowed to close.
    window.close()
  } catch (error) {
    console.error('Failed to start CSS picker:', error)
  }
}

  const stopPicker = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'STOP_CSS_PICKER',
        })
      }
    } catch {
      // Ignore restricted pages.
    }

    setPicking(false)
  }

  const clearSelection = async () => {
    await chrome.storage.local.remove(
      'cssPickerSelection'
    )

    setSelected(null)
  }

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard unavailable.
    }
  }

  return (
    <div className="flex min-h-150 w-95 flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
          >
            ←
          </button>

          <div>
            <h1 className="text-sm font-semibold">
              CSS Picker
            </h1>

            <p className="text-[11px] text-zinc-500">
              Inspect elements directly from the page
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        <button
          onClick={picking ? stopPicker : startPicker}
          className="w-full rounded-lg bg-zinc-100 px-3 py-2.5 text-xs font-medium text-zinc-900 transition hover:bg-white"
        >
          {picking ? 'Stop Picking' : 'Pick Element'}
        </button>

        {picking && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
            <p className="text-[11px] text-blue-400">
              Move your mouse over an element and click it.
            </p>
          </div>
        )}

        {!selected && !picking && !restoring && (
          <div className="flex min-h-75 items-center justify-center rounded-xl border border-dashed border-zinc-800">
            <div className="px-8 text-center">
              <p className="text-sm text-zinc-400">
                No element selected
              </p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                Click Pick Element and select any element
                from the webpage.
              </p>
            </div>
          </div>
        )}

        {restoring && !selected && (
          <div className="flex min-h-75 items-center justify-center rounded-xl border border-dashed border-zinc-800">
            <div className="px-8 text-center">
              <p className="text-sm text-zinc-400">
                Restoring selection...
              </p>
            </div>
          </div>
        )}

        {selected && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-zinc-600">
                Selected Element
              </span>

              <button
                onClick={clearSelection}
                className="text-[10px] text-zinc-600 hover:text-zinc-300"
              >
                Clear
              </button>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-medium text-zinc-200">
                  &lt;{selected.tagName}&gt;
                </code>

                <span className="rounded-md bg-zinc-800 px-2 py-1 text-[9px] text-zinc-500">
                  {selected.width} × {selected.height}
                </span>
              </div>
            </div>

            {selected.id && (
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-wide text-zinc-600">
                  ID
                </p>

                <CssItem
                  name={selected.id}
                  count={1}
                  prefix="#"
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wide text-zinc-600">
                Classes
              </p>

              {selected.classes.length > 0 ? (
                <div className="space-y-2">
                  {selected.classes.map((className) => (
                    <CssItem
                      key={className}
                      name={className}
                      count={1}
                      prefix="."
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-600">
                  No classes
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                  CSS Selector
                </p>

                <button
                  onClick={() => copy(selected.selector)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-200"
                >
                  Copy
                </button>
              </div>

              <code className="block overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-[10px] leading-5 text-zinc-400">
                {selected.selector}
              </code>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wide text-zinc-600">
                Attributes
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                {Object.entries(selected.attributes).map(
                  ([name, value]) => (
                    <div
                      key={name}
                      className="flex gap-2 py-1 text-[10px]"
                    >
                      <span className="text-zinc-500">
                        {name}=
                      </span>

                      <span className="min-w-0 truncate text-zinc-300">
                        "{value}"
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-zinc-800 px-5 py-3 text-center">
        <span className="text-[10px] text-zinc-600">
          WebToolKit CSS Picker
        </span>
      </footer>
    </div>
  )
}