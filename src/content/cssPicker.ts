type SelectedElement = {
  tagName: string;
  id: string;
  classes: string[];
  selector: string;
  attributes: Record<string, string>;
  width: number;
  height: number;
};

const HIGHLIGHT_ID = "__webtoolkit_css_picker__";

let pickerActive = false;
let highlightedElement: HTMLElement | null = null;

function getSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }

  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.classList.length > 0) {
      selector += Array.from(current.classList)
        .slice(0, 2)
        .map((className) => `.${CSS.escape(className)}`)
        .join("");
    }

    const parent = current.parentElement;

    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName,
      );

      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    parts.unshift(selector);
    current = current.parentElement;
  }

  return parts.join(" > ");
}

function highlight(element: HTMLElement | null) {
  if (highlightedElement === element) return;

  if (highlightedElement) {
    highlightedElement.style.outline = "";
    highlightedElement.style.outlineOffset = "";
  }

  highlightedElement = element;

  if (element) {
    element.style.outline = "2px solid #3b82f6";
    element.style.outlineOffset = "2px";
  }
}

function createSelectedElement(element: HTMLElement): SelectedElement {
  const rect = element.getBoundingClientRect();

  const attributes: Record<string, string> = {};

  Array.from(element.attributes).forEach((attribute) => {
    attributes[attribute.name] = attribute.value;
  });

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id,
    classes: Array.from(element.classList),
    selector: getSelector(element),
    attributes,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

function stopPicker() {
  pickerActive = false;

  highlight(null);

  document.removeEventListener("mousemove", handleMouseMove, true);

  document.removeEventListener("click", handleClick, true);

  document.body.style.cursor = "";
}

function handleMouseMove(event: MouseEvent) {
  if (!pickerActive) return;

  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  if (target.id === HIGHLIGHT_ID) return;

  highlight(target);
}

function handleClick(event: MouseEvent) {
  if (!pickerActive) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    stopPicker();
    return;
  }

  const selectedElement = createSelectedElement(target);

  stopPicker();

  chrome.storage.local.set({
    cssPickerSelection: selectedElement,
  });

  chrome.runtime.sendMessage({
    type: "CSS_ELEMENT_SELECTED",
    data: selectedElement,
  });
}

function startPicker() {
  if (pickerActive) return;

  pickerActive = true;

  document.body.style.cursor = "crosshair";

  document.addEventListener("mousemove", handleMouseMove, true);

  document.addEventListener("click", handleClick, true);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "START_CSS_PICKER") {
    startPicker();
  }

  if (message.type === "STOP_CSS_PICKER") {
    stopPicker();
  }
});
