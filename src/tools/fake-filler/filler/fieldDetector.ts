import type { DetectedField, FieldType } from "../types";

function getLabel(element: HTMLElement): string {
  if (element.id) {
    const label = document.querySelector(
      `label[for="${CSS.escape(element.id)}"]`,
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

function getFieldText(element: HTMLElement): string {
  const input = element as HTMLInputElement;

  return `
    ${input.type || ""}
    ${input.name || ""}
    ${input.id || ""}
    ${input.placeholder || ""}
    ${input.getAttribute("autocomplete") || ""}
    ${input.getAttribute("aria-label") || ""}
    ${getLabel(element)}
  `.toLowerCase();
}

function detectFieldType(element: HTMLElement): FieldType {
  const tagName = element.tagName.toLowerCase();

  if (tagName === "select") {
    return "select";
  }

  const input = element as HTMLInputElement;

  const inputType = input.type?.toLowerCase() || "";
  const autocomplete = input.getAttribute("autocomplete")?.toLowerCase() || "";

  const text = getFieldText(element);

  // Radio
  if (inputType === "radio") {
    return "radio";
  }

  // Checkbox
  if (inputType === "checkbox") {
    return "checkbox";
  }

  // Name
  if (
    autocomplete.includes("given-name") ||
    /\b(first|fname|first-name|firstname)\b/.test(text)
  ) {
    return "firstName";
  }

  if (
    autocomplete.includes("family-name") ||
    /\b(last|lname|last-name|lastname|surname)\b/.test(text)
  ) {
    return "lastName";
  }

  if (/\b(full[-_ ]?name|fullname)\b/.test(text)) {
    return "fullName";
  }

  // Email
  if (
    inputType === "email" ||
    autocomplete.includes("email") ||
    /\b(email|e-mail)\b/.test(text)
  ) {
    return "email";
  }

  // Phone
  if (
    inputType === "tel" ||
    autocomplete.includes("tel") ||
    /\b(phone|mobile|telephone|contact[-_ ]?number)\b/.test(text)
  ) {
    return "phone";
  }

  // Username
  if (
    autocomplete.includes("username") ||
    /\b(username|user[-_ ]?name|login)\b/.test(text)
  ) {
    return "username";
  }

  // Password
  if (
    inputType === "password" ||
    autocomplete.includes("password") ||
    /\b(password|passwd|pwd)\b/.test(text)
  ) {
    return "password";
  }

  // Address
  if (
    autocomplete.includes("street-address") ||
    /\b(address|street|street-address|addr)\b/.test(text)
  ) {
    return "address";
  }

  // City
  if (autocomplete.includes("address-level2") || /\b(city|town)\b/.test(text)) {
    return "city";
  }

  // State
  if (
    autocomplete.includes("address-level1") ||
    /\b(state|province|region)\b/.test(text)
  ) {
    return "state";
  }

  // Country
  if (autocomplete.includes("country") || /\b(country|nation)\b/.test(text)) {
    return "country";
  }

  // ZIP / postal code
  if (
    autocomplete.includes("postal-code") ||
    /\b(zip|zipcode|zip-code|postal|postcode|pin|pincode)\b/.test(text)
  ) {
    return "zip";
  }

  // Company
  if (/\b(company|organization|organisation|business|employer)\b/.test(text)) {
    return "company";
  }

  // Website
  if (
    inputType === "url" ||
    autocomplete.includes("url") ||
    /\b(website|url|web[-_ ]?site)\b/.test(text)
  ) {
    return "website";
  }

  // Job title
  if (/\b(job[-_ ]?title|job|designation|position|role)\b/.test(text)) {
    return "jobTitle";
  }

  // Occupation
  if (/\b(occupation|profession|career)\b/.test(text)) {
    return "occupation";
  }

  // Description
  if (
    /\b(description|details|about[-_ ]?project|project[-_ ]?description)\b/.test(
      text,
    )
  ) {
    return "description";
  }

  // Message
  if (/\b(message|msg|inquiry|enquiry|contact[-_ ]?message)\b/.test(text)) {
    return "message";
  }

  // Bio
  if (/\b(bio|biography|about[-_ ]?me|profile[-_ ]?description)\b/.test(text)) {
    return "bio";
  }

  // Subject
  if (/\b(subject|email[-_ ]?subject|mail[-_ ]?subject)\b/.test(text)) {
    return "subject";
  }

  // Comment
  if (/\b(comment|feedback|review|remark)\b/.test(text)) {
    return "comment";
  }

  // Notes
  if (/\b(notes|note|internal[-_ ]?notes|additional[-_ ]?notes)\b/.test(text)) {
    return "notes";
  }

  // Search
  if (
    inputType === "search" ||
    /\b(search|query|keyword|keywords)\b/.test(text)
  ) {
    return "search";
  }

  // Number
  if (inputType === "number") {
    return "number";
  }

  // Date
  if (inputType === "date") {
    return "date";
  }

  // Textarea
  if (element instanceof HTMLTextAreaElement) {
    return "text";
  }

  // Normal text input
  if (inputType === "text" || inputType === "") {
    return "text";
  }

  return "unknown";
}

function shouldSkip(element: HTMLElement): boolean {
  const input = element as HTMLInputElement;

  if (element.hasAttribute("disabled")) {
    return true;
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    if (input.readOnly) {
      return true;
    }
  }

  const type = input.type?.toLowerCase();

  if (
    type === "hidden" ||
    type === "submit" ||
    type === "reset" ||
    type === "button" ||
    type === "image"
  ) {
    return true;
  }

  const style = window.getComputedStyle(element);

  if (style.display === "none" || style.visibility === "hidden") {
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
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select"),
  );

  return elements
    .map((element, index) => ({
      element,
      field: {
        index,
        type: detectFieldType(element),
        tagName: element.tagName.toLowerCase(),
        inputType: (element as HTMLInputElement).type || "",
        name: (element as HTMLInputElement).name || "",
        id: element.id || "",
        placeholder: (element as HTMLInputElement).placeholder || "",
        label: getLabel(element),
      },
    }))
    .filter(
      ({ element, field }) => field.type !== "unknown" && !shouldSkip(element),
    )
    .map(({ field }) => field);
}
