import type { DetectedField } from "../types";
import { generateFakeData } from "./dataGenerator";

function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;

  const descriptor = Object.getOwnPropertyDescriptor(
    prototype,
    "value",
  );

  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(
    new Event("input", {
      bubbles: true,
    }),
  );

  element.dispatchEvent(
    new Event("change", {
      bubbles: true,
    }),
  );
}

export function fillFields(
  fields: DetectedField[],
): number {
  let filledCount = 0;

  const elements = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea",
    ),
  );

  fields.forEach((field) => {
    const element = elements[field.index];

    if (!element) {
      return;
    }

    const value = generateFakeData(field.type);

    setNativeValue(element, value);

    filledCount++;
  });

  return filledCount;
}
