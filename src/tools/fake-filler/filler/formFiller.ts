import {
  generateFakeData,
  generateSelectValue,
  shouldCheckCheckbox,
} from "./dataGenerator";

import type { DetectedField } from "../types";

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

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

  if (checkbox.checked) {
    return false;
  }

  checkbox.checked = true;

  dispatchInputEvents(checkbox);

  return true;
}

function getRadioGroup(radio: HTMLInputElement): HTMLInputElement[] {
  const radios = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
  );

  // Named radio groups
  if (radio.name) {
    return radios.filter((item) => item.name === radio.name);
  }

  // Unnamed radios are treated as
  // separate groups.
  return [radio];
}

function fillRadioGroup(radio: HTMLInputElement): boolean {
  const group = getRadioGroup(radio);

  if (group.length === 0) {
    return false;
  }

  // Remove disabled radios.
  const availableRadios = group.filter(
    (item) => !item.disabled && item.offsetParent !== null,
  );

  if (availableRadios.length === 0) {
    return false;
  }

  // If the user already selected
  // something, don't change it.
  const alreadyChecked = availableRadios.find((item) => item.checked);

  if (alreadyChecked) {
    return false;
  }

  // Pick a random option.
  const randomIndex = Math.floor(Math.random() * availableRadios.length);

  const selectedRadio = availableRadios[randomIndex];

  selectedRadio.checked = true;

  dispatchInputEvents(selectedRadio);

  return true;
}

function clampValueToMaxLength(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
): string {
  const maxLength = element.maxLength;

  if (maxLength > 0 && value.length > maxLength) {
    return value.slice(0, maxLength);
  }

  return value;
}

function getNumberConstraints(input: HTMLInputElement) {
  const min = input.min ? Number(input.min) : null;

  const max = input.max ? Number(input.max) : null;

  const step = input.step && input.step !== "any" ? Number(input.step) : null;

  return {
    min: min !== null && !Number.isNaN(min) ? min : null,

    max: max !== null && !Number.isNaN(max) ? max : null,

    step: step !== null && !Number.isNaN(step) && step > 0 ? step : null,
  };
}

function generateConstrainedNumber(input: HTMLInputElement): string {
  const { min, max, step } = getNumberConstraints(input);

  let lower = min !== null ? min : 1;

  let upper = max !== null ? max : 100;

  if (lower > upper) {
    [lower, upper] = [upper, lower];
  }

  let value = Math.random() * (upper - lower) + lower;

  if (step !== null) {
    value = Math.round((value - lower) / step) * step + lower;
  }

  value = Math.min(Math.max(value, lower), upper);

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function generateConstrainedDate(input: HTMLInputElement): string {
  const min = input.min ? new Date(input.min) : null;

  const max = input.max ? new Date(input.max) : null;

  const today = new Date();

  let start =
    min && !Number.isNaN(min.getTime())
      ? min
      : new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

  let end = max && !Number.isNaN(max.getTime()) ? max : today;

  if (start > end) {
    [start, end] = [end, start];
  }

  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  const date = new Date(timestamp);

  return date.toISOString().split("T")[0];
}

function generateConstrainedDateTime(input: HTMLInputElement): string {
  const min = input.min ? new Date(input.min) : null;

  const max = input.max ? new Date(input.max) : null;

  const now = new Date();

  let start =
    min && !Number.isNaN(min.getTime())
      ? min
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let end =
    max && !Number.isNaN(max.getTime())
      ? max
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (start > end) {
    [start, end] = [end, start];
  }

  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  const date = new Date(timestamp);

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function generateConstrainedTime(input: HTMLInputElement): string {
  const min = input.min || "09:00";

  const max = input.max || "18:00";

  const [minHour, minMinute] = min.split(":").map(Number);

  const [maxHour, maxMinute] = max.split(":").map(Number);

  const minTotal = minHour * 60 + minMinute;

  const maxTotal = maxHour * 60 + maxMinute;

  const total =
    minTotal + Math.floor(Math.random() * Math.max(1, maxTotal - minTotal + 1));

  const hour = Math.floor(total / 60);

  const minute = total % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function generateValueForInput(
  input: HTMLInputElement,
  field: DetectedField,
  generatedEmail: string,
  generatedPassword: string,
): string {
  let value = generateFakeData(field.type);

  const inputType = input.type.toLowerCase();

  if (inputType === "number") {
    return generateConstrainedNumber(input);
  }

  if (inputType === "date") {
    return generateConstrainedDate(input);
  }

  if (inputType === "datetime-local") {
    return generateConstrainedDateTime(input);
  }

  if (inputType === "time") {
    return generateConstrainedTime(input);
  }

  if (field.type === "email") {
    if (isConfirmationField(field)) {
      value = generatedEmail || value;
    }
  }

  if (field.type === "password") {
    if (isConfirmationField(field)) {
      value = generatedPassword || value;
    }
  }

  return clampValueToMaxLength(input, value);
}

export function fillFields(fields: DetectedField[]): number {
  const elements = Array.from(
    document.querySelectorAll<FormElement>("input, textarea, select"),
  );

  const processedRadioGroups = new Set<string>();

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

      if (processedRadioGroups.has(groupName)) {
        return;
      }

      if (fillRadioGroup(radio)) {
        processedRadioGroups.add(groupName);

        filledCount++;
      } else {
        // Mark the group as processed
        // even when it already has a
        // selected value.
        processedRadioGroups.add(groupName);
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

      if (select.value && select.selectedIndex > 0) {
        return;
      }

      if (fillSelect(select)) {
        filledCount++;
      }

      return;
    }

    // --------------------------------
    // Input / textarea
    // --------------------------------

    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      if (hasExistingValue(element)) {
        return;
      }

      let value: string;

      if (element instanceof HTMLInputElement) {
        value = generateValueForInput(
          element,
          field,
          generatedEmail,
          generatedPassword,
        );
      } else {
        value = clampValueToMaxLength(element, generateFakeData(field.type));
      }

      if (field.type === "email" && !isConfirmationField(field)) {
        generatedEmail = value;
      }

      if (field.type === "password" && !isConfirmationField(field)) {
        generatedPassword = value;
      }

      setInputValue(element, value);

      filledCount++;
    }
  });

  return filledCount;
}
