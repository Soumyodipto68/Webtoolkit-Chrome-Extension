import type { DetectedField, FieldType } from "../types";

function detectFieldType(
  element: HTMLInputElement | HTMLTextAreaElement,
): FieldType {
  const type = element.type?.toLowerCase() || "";
  const name = element.name?.toLowerCase() || "";
  const id = element.id?.toLowerCase() || "";
  const placeholder = element.placeholder?.toLowerCase() || "";
  const autocomplete =
    element.getAttribute("autocomplete")?.toLowerCase() || "";
  const ariaLabel =
    element.getAttribute("aria-label")?.toLowerCase() || "";

  const combined = `
    ${type}
    ${name}
    ${id}
    ${placeholder}
    ${autocomplete}
    ${ariaLabel}
  `.toLowerCase();

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
    autocomplete.includes("name") ||
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
    /\b(zip|zipcode|zip-code|postal|postcode|pin|pincode)\b/.test(combined)
  ) {
    return "zip";
  }

  if (
    /\b(company|organization|organisation|business|employer)\b/.test(combined)
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

export function detectFields(): DetectedField[] {
  const elements = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea",
    ),
  );

  return elements
    .map((element, index) => {
      const field: DetectedField = {
        index,
        type: detectFieldType(element),
        tagName: element.tagName.toLowerCase(),
        inputType: element.type || "",
        name: element.name || "",
        id: element.id || "",
        placeholder: element.placeholder || "",
      };

      return {
        element,
        field,
      };
    })
    .filter(({ element, field }) => {
      if (field.type === "unknown") {
        return false;
      }

      if (element.disabled) {
        return false;
      }

      if (element.readOnly) {
        return false;
      }

      if (element.type === "hidden") {
        return false;
      }

      if (
        element.type === "submit" ||
        element.type === "reset" ||
        element.type === "button"
      ) {
        return false;
      }

      const style = window.getComputedStyle(element);

      if (
        style.display === "none" ||
        style.visibility === "hidden"
      ) {
        return false;
      }

      return true;
    })
    .map(({ field }) => field);
}
