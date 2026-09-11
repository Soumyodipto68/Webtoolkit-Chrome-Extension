export type CssItem = {
  name: string;
  count: number;
};

export type CssScanResult = {
  classes: CssItem[];
  ids: CssItem[];
};

export function extractCssInfo(): CssScanResult {
  const classMap = new Map<string, number>();
  const idMap = new Map<string, number>();

  document.querySelectorAll("*").forEach((element) => {
    element.classList.forEach((className) => {
      if (!className.trim()) return;

      classMap.set(className, (classMap.get(className) ?? 0) + 1);
    });

    const id = element.id.trim();

    if (id) {
      idMap.set(id, (idMap.get(id) ?? 0) + 1);
    }
  });

  const classes = Array.from(classMap.entries())
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const ids = Array.from(idMap.entries())
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    classes,
    ids,
  };
}
