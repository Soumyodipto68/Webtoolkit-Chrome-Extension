import type { FieldType } from "../types";

const firstNames = [
  "Alex",
  "John",
  "Sarah",
  "Michael",
  "David",
  "Emma",
  "Olivia",
  "Daniel",
  "Sophia",
  "James",
];

const lastNames = [
  "Anderson",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Miller",
  "Wilson",
  "Taylor",
  "Thomas",
  "Martin",
];

const cities = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
];

const states = [
  "West Bengal",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
];

const companies = [
  "TechNova Solutions",
  "Pixel Labs",
  "CodeCraft Technologies",
  "NextGen Systems",
  "CloudByte",
];

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

const jobTitles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Web Developer",
  "UI Developer",
  "Software Developer",
  "Product Designer",
  "Project Manager",
  "Data Analyst",
];

const occupations = [
  "Software Developer",
  "Web Developer",
  "Software Engineer",
  "UI Designer",
  "Data Analyst",
  "Product Manager",
  "Business Analyst",
  "Consultant",
];

const descriptions = [
  "Looking for a reliable solution to improve our workflow.",
  "I am interested in learning more about your services.",
  "This is sample content generated for form testing.",
  "I would like to discuss this opportunity in more detail.",
  "We are looking for a solution that can simplify our process.",
];

const messages = [
  "Hello, I would like to know more about your services.",
  "Please contact me with more information.",
  "I am interested in learning more about this.",
  "Could you please provide some additional details?",
  "I would like to discuss this further.",
];

const bios = [
  "Software developer interested in building modern web applications.",
  "Web developer focused on creating useful and responsive applications.",
  "Technology enthusiast who enjoys building and learning new things.",
  "Developer interested in web technologies and software development.",
];

const subjects = [
  "Request for more information",
  "Website development inquiry",
  "Product information",
  "General inquiry",
  "Service request",
];

const titles = [
  "Software Development",
  "Website Project",
  "New Project",
  "Product Development",
  "Web Application",
];

const comments = [
  "Looks good. I would like to know more.",
  "This is useful information.",
  "I have a question about this.",
  "Please provide some additional details.",
  "I would like to discuss this further.",
];

const notes = [
  "Follow up with the customer.",
  "Review this information later.",
  "Additional details required.",
  "Contact the user for more information.",
  "Check this item again.",
];

const searchTerms = [
  "software development",
  "web development",
  "React",
  "technology",
  "digital solutions",
];

const textSamples = [
  "Looking forward to hearing from you.",
  "This is some sample content for testing.",
  "I would like to learn more about your services.",
  "Please provide more information about this.",
  "This is a randomly generated test value.",
  "Testing the form with sample information.",
  "I am interested in exploring this opportunity.",
  "Please contact me with additional details.",
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePassword(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  return Array.from({ length: 12 }, () =>
    characters.charAt(
      randomNumber(0, characters.length - 1),
    ),
  ).join("");
}

function generateText(): string {
  return randomItem(textSamples);
}

export function generateFakeData(type: FieldType): string {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);

  switch (type) {
    case "firstName":
      return firstName;

    case "lastName":
      return lastName;

    case "fullName":
      return `${firstName} ${lastName}`;

    case "email":
      return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(
        10,
        99,
      )}@example.com`;

    case "phone":
      return `+91 ${randomNumber(7000000000, 9999999999)}`;

    case "username":
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber(
        10,
        99,
      )}`;

    case "password":
      return generatePassword();

    case "address":
      return `${randomNumber(10, 999)} Park Street`;

    case "city":
      return randomItem(cities);

    case "state":
      return randomItem(states);

    case "country":
      return randomItem(countries);

    case "zip":
      return String(randomNumber(700001, 799999));

    case "company":
      return randomItem(companies);

    case "website":
      return "https://example.com";

    case "number":
      return String(randomNumber(1, 100));

    case "date": {
      const date = new Date();

      date.setDate(
        date.getDate() - randomNumber(0, 365),
      );

      return date.toISOString().split("T")[0];
    }

    case "jobTitle":
      return randomItem(jobTitles);

    case "occupation":
      return randomItem(occupations);

    case "description":
      return randomItem(descriptions);

    case "message":
      return randomItem(messages);

    case "bio":
      return randomItem(bios);

    case "subject":
      return randomItem(subjects);

    case "title":
      return randomItem(titles);

    case "comment":
      return randomItem(comments);

    case "notes":
      return randomItem(notes);

    case "search":
      return randomItem(searchTerms);

    case "text":
      return generateText();

    default:
      return generateText();
  }
}

export function generateSelectValue(
  select: HTMLSelectElement,
): string | null {
  const options = Array.from(select.options).filter(
    (option) =>
      !option.disabled &&
      option.value.trim() !== "",
  );

  if (options.length === 0) {
    return null;
  }

  const fieldText = `
    ${select.name}
    ${select.id}
    ${select.getAttribute("aria-label") || ""}
  `.toLowerCase();

  const preferredOption = options.find((option) => {
    const text = `
      ${option.value}
      ${option.textContent || ""}
    `.toLowerCase();

    if (fieldText.includes("country")) {
      return text.includes("india");
    }

    if (
      fieldText.includes("state") ||
      fieldText.includes("province")
    ) {
      return text.includes("west bengal");
    }

    return false;
  });

  return preferredOption?.value ?? randomItem(options).value;
}

export function shouldCheckCheckbox(
  checkbox: HTMLInputElement,
): boolean {
  const text = `
    ${checkbox.name}
    ${checkbox.id}
    ${checkbox.value}
    ${checkbox.placeholder}
    ${checkbox.getAttribute("aria-label") || ""}
  `.toLowerCase();

  // --------------------------------
  // Legal / consent checkboxes
  // --------------------------------

  const legalKeywords = [
    "terms",
    "terms-and-conditions",
    "terms_conditions",
    "condition",
    "conditions",
    "privacy",
    "privacy-policy",
    "privacy_policy",
    "consent",
    "agreement",
    "legal",
    "waiver",
    "accept-policy",
    "accept_terms",
    "accept-terms",
  ];

  const isLegalCheckbox =
    legalKeywords.some((keyword) =>
      text.includes(keyword),
    );

  if (isLegalCheckbox) {
    return false;
  }

  // --------------------------------
  // Preference / optional checkboxes
  // --------------------------------

  const preferenceKeywords = [
    "newsletter",
    "subscribe",
    "subscription",
    "notification",
    "notifications",
    "notify",
    "updates",
    "update",
    "marketing",
    "promotional",
    "promotion",
    "offers",
    "offer",
    "remember-me",
    "remember_me",
    "remember",
    "preference",
    "preferences",
  ];

  const isPreferenceCheckbox =
    preferenceKeywords.some((keyword) =>
      text.includes(keyword),
    );

  if (isPreferenceCheckbox) {
    return true;
  }

  // --------------------------------
  // Generic checkbox
  // --------------------------------
  //
  // If it isn't clearly a legal/consent
  // checkbox, allow Fake Filler to
  // select it.
  //

  return true;
}