import {
  generateFakeData,
  generateSelectValue,
  shouldCheckCheckbox,
} from "./dataGenerator";

import type { DetectedField } from "../types";

function dispatchInputEvents(element: HTMLElement) {
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

function setInputValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;

  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  dispatchInputEvents(element);
}

function fillSelect(select: HTMLSelectElement): boolean {
  const value = generateSelectValue(select);

  if (value === null) {
    return false;
  }

  select.value = value;

  dispatchInputEvents(select);

  return true;
}

function fillCheckbox(checkbox: HTMLInputElement): boolean {
  if (!shouldCheckCheckbox(checkbox)) {
    return false;
  }

  checkbox.checked = true;

  dispatchInputEvents(checkbox);

  return true;
}

function fillRadio(radio: HTMLInputElement): boolean {
  radio.checked = true;

  dispatchInputEvents(radio);

  return true;
}

export function fillFields(fields: DetectedField[]): number {
  const elements = Array.from(
    document.querySelectorAll("input, textarea, select"),
  );

  const radioGroups = new Set<string>();

  let filledCount = 0;

  fields.forEach((field) => {
    const element = elements[field.index];

    if (!element) {
      return;
    }

    // Radio buttons
    if (field.type === "radio") {
      const radio = element as HTMLInputElement;

      const groupName = radio.name || `radio-${field.index}`;

      if (radioGroups.has(groupName)) {
        return;
      }

      if (fillRadio(radio)) {
        radioGroups.add(groupName);
        filledCount++;
      }

      return;
    }

    // Checkboxes
    if (field.type === "checkbox") {
      if (fillCheckbox(element as HTMLInputElement)) {
        filledCount++;
      }

      return;
    }

    // Select dropdowns
    if (field.type === "select") {
      if (fillSelect(element as HTMLSelectElement)) {
        filledCount++;
      }

      return;
    }

    // Text / textarea / other supported fields
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const value = generateFakeData(field.type);

      setInputValue(element, value);

      filledCount++;
    }
  });

  return filledCount;
}
