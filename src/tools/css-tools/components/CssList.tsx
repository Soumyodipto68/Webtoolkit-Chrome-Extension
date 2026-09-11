import CssItem from './CssItem'
import type { CssItem as CssItemType } from '../../../content/cssUtils'

type CssListProps = {
  title: string
  items: CssItemType[]
  prefix: '.' | '#'
  search: string
}

export default function CssList({
  title,
  items,
  prefix,
  search,
}: CssListProps) {
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-medium text-zinc-400">
          {title}
        </h2>

        <span className="text-[10px] text-zinc-600">
          {filteredItems.length}
        </span>
      </div>

      <div className="min-h-[120px] flex-1 space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <CssItem
              key={`${prefix}${item.name}`}
              name={item.name}
              count={item.count}
              prefix={prefix}
            />
          ))
        ) : (
          <div className="flex h-full min-h-[100px] items-center justify-center text-center">
            <p className="text-[11px] text-zinc-600">
              {search
                ? 'No matching items'
                : `No ${title.toLowerCase()} found`}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}