export type FieldType =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "username"
  | "password"
  | "address"
  | "city"
  | "state"
  | "country"
  | "zip"
  | "company"
  | "website"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "jobTitle"
  | "occupation"
  | "description"
  | "message"
  | "bio"
  | "subject"
  | "title"
  | "comment"
  | "notes"
  | "search"
  | "text"
  | "unknown";

export type DetectedField = {
  index: number;
  type: FieldType;
  tagName: string;
  inputType: string;
  name: string;
  id: string;
  placeholder: string;
  label: string;
};