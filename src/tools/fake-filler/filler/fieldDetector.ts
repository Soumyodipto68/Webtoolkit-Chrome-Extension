import type { DetectedField, FieldType } from "../types";

function getLabel(element: HTMLElement): string {
  const id = element.id;

  if (id) {
    const label = document.querySelector(
      `label[for="${CSS.escape(id)}"]`,
    );

    if (label) {
      return label.textContent?.trim() || "";
    }
  }

  const parentLabel = element.closest("label");

  if (parentLabel) {
    return parentLabel.textContent?.trim() || "";
  }

  return "";
}

function detectFieldType(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): FieldType {
  const tagName = element.tagName.toLowerCase();

  if (tagName === "select") {
    return "select";
  }

  const input = element as HTMLInputElement;

  const type = input.type?.toLowerCase() || "";
  const name = input.name?.toLowerCase() || "";
  const id = input.id?.toLowerCase() || "";
  const placeholder =
    input.placeholder?.toLowerCase() || "";

  const autocomplete =
    element.getAttribute("autocomplete")?.toLowerCase() || "";

  const ariaLabel =
    element.getAttribute("aria-label")?.toLowerCase() || "";

  const label = getLabel(element).toLowerCase();

  const combined = `
    ${type}
    ${name}
    ${id}
    ${placeholder}
    ${autocomplete}
    ${ariaLabel}
    ${label}
  `.toLowerCase();

  if (type === "radio") {
    return "radio";
  }

  if (type === "checkbox") {
    return "checkbox";
  }

  if (
    autocomplete.includes("given-name") ||
    /\b(first|fname|first-name|firstname)\b/.test(combined)
  ) {
    return "firstName";
  }

  if (
    autocomplete.includes("family-name") ||
    /\b(last|lname|last-name|lastname|surname)\b/.test(combined)
  ) {
    return "lastName";
  }

  if (
    /\b(full[-_ ]?name|fullname)\b/.test(combined)
  ) {
    return "fullName";
  }

  if (
    type === "email" ||
    autocomplete.includes("email") ||
    /\b(email|e-mail)\b/.test(combined)
  ) {
    return "email";
  }

  if (
    type === "tel" ||
    autocomplete.includes("tel") ||
    /\b(phone|mobile|telephone|contact)\b/.test(combined)
  ) {
    return "phone";
  }

  if (
    autocomplete.includes("username") ||
    /\b(username|user[-_ ]?name|login)\b/.test(combined)
  ) {
    return "username";
  }

  if (
    type === "password" ||
    autocomplete.includes("password") ||
    /\b(password|passwd|pwd)\b/.test(combined)
  ) {
    return "password";
  }

  if (
    autocomplete.includes("street-address") ||
    /\b(address|street|addr)\b/.test(combined)
  ) {
    return "address";
  }

  if (/\b(city|town)\b/.test(combined)) {
    return "city";
  }

  if (
    autocomplete.includes("address-level1") ||
    /\b(state|province|region)\b/.test(combined)
  ) {
    return "state";
  }

  if (
    autocomplete.includes("country") ||
    /\b(country|nation)\b/.test(combined)
  ) {
    return "country";
  }

  if (
    autocomplete.includes("postal-code") ||
    /\b(zip|zipcode|zip-code|postal|postcode|pin|pincode)\b/.test(
      combined,
    )
  ) {
    return "zip";
  }

  if (
    /\b(company|organization|organisation|business|employer)\b/.test(
      combined,
    )
  ) {
    return "company";
  }

  if (
    type === "url" ||
    autocomplete.includes("url") ||
    /\b(website|url|web[-_ ]?site)\b/.test(combined)
  ) {
    return "website";
  }

  if (type === "number") {
    return "number";
  }

  if (type === "date") {
    return "date";
  }

  if (element instanceof HTMLTextAreaElement) {
    return "text";
  }

  if (type === "text" || type === "") {
    return "text";
  }

  return "unknown";
}

function shouldSkip(
  element:
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement,
): boolean {
  if (element.disabled) {
    return true;
  }

  if (
    (element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement) &&
    element.readOnly
  ) {
    return true;
  }

  const input = element as HTMLInputElement;

  if (
    input.type === "hidden" ||
    input.type === "submit" ||
    input.type === "reset" ||
    input.type === "button" ||
    input.type === "image"
  ) {
    return true;
  }

  const style = window.getComputedStyle(element);

  if (
    style.display === "none" ||
    style.visibility === "hidden"
  ) {
    return true;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return true;
  }

  return false;
}

export function detectFields(): DetectedField[] {
  const elements = Array.from(
    document.querySelectorAll<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >("input, textarea, select"),
  );

  return elements
    .map((element, index) => {
      const type = detectFieldType(element);

      return {
        element,
        field: {
          index,
          type,
          tagName: element.tagName.toLowerCase(),
          inputType:
            (element as HTMLInputElement).type || "",
          name: element.name || "",
          id: element.id || "",
          placeholder:
            (element as HTMLInputElement).placeholder || "",
          label: getLabel(element),
        },
      };
    })
    .filter(({ element, field }) => {
      if (field.type === "unknown") {
        return false;
      }

      return !shouldSkip(element);
    })
    .map(({ field }) => field);
}
