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

function hasExistingValue(
  element: HTMLInputElement | HTMLTextAreaElement,
): boolean {
  return element.value.trim().length > 0;
}

function isConfirmationField(field: DetectedField): boolean {
  const text = `
    ${field.name}
    ${field.id}
    ${field.placeholder}
    ${field.label}
  `.toLowerCase();

  return (
    text.includes("confirm") ||
    text.includes("confirmation") ||
    text.includes("retype") ||
    text.includes("repeat")
  );
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

  // Don't modify an already checked checkbox.
  if (checkbox.checked) {
    return false;
  }

  checkbox.checked = true;

  dispatchInputEvents(checkbox);

  return true;
}

function fillRadio(radio: HTMLInputElement): boolean {
  // Don't modify an already selected radio.
  if (radio.checked) {
    return false;
  }

  radio.checked = true;

  dispatchInputEvents(radio);

  return true;
}

export function fillFields(fields: DetectedField[]): number {
  const elements = Array.from(
    document.querySelectorAll("input, textarea, select"),
  );

  const radioGroups = new Set<string>();

  let generatedEmail = "";
  let generatedPassword = "";

  let filledCount = 0;

  fields.forEach((field) => {
    const element = elements[field.index];

    if (!element) {
      return;
    }

    // --------------------------------
    // Radio buttons
    // --------------------------------

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

    // --------------------------------
    // Checkboxes
    // --------------------------------

    if (field.type === "checkbox") {
      if (fillCheckbox(element as HTMLInputElement)) {
        filledCount++;
      }

      return;
    }

    // --------------------------------
    // Select dropdowns
    // --------------------------------

    if (field.type === "select") {
      const select = element as HTMLSelectElement;

      // Don't overwrite an already
      // selected meaningful option.
      if (select.value && select.selectedIndex > 0) {
        return;
      }

      if (fillSelect(select)) {
        filledCount++;
      }

      return;
    }

    // --------------------------------
    // Text inputs / textarea
    // --------------------------------

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      // Don't overwrite existing user input.
      if (hasExistingValue(element)) {
        return;
      }

      let value = generateFakeData(field.type);

      // --------------------------------
      // Email
      // --------------------------------

      if (field.type === "email") {
        if (isConfirmationField(field)) {
          value = generatedEmail || value;
        } else {
          generatedEmail = value;
        }
      }

      // --------------------------------
      // Password
      // --------------------------------

      if (field.type === "password") {
        if (isConfirmationField(field)) {
          value = generatedPassword || value;
        } else {
          generatedPassword = value;
        }
      }

      setInputValue(element, value);

      filledCount++;
    }
  });

  return filledCount;
}
