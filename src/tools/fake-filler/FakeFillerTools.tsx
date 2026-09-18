import { useState } from "react";
import { ArrowLeft, Check, Zap } from "lucide-react";

type FakeFillerToolsProps = {
  onBack: () => void;
};

export default function FakeFillerTools({
  onBack,
}: FakeFillerToolsProps) {
  const [status, setStatus] = useState<
    "idle" | "filling" | "success" | "error"
  >("idle");

  const [filledCount, setFilledCount] = useState(0);

  const fillForm = async () => {
    setStatus("filling");
    setFilledCount(0);

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab found.");
      }

      const result = await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        func: () => {
          const randomItem = <T,>(items: T[]): T => {
            return items[
              Math.floor(Math.random() * items.length)
            ];
          };

          const randomNumber = (
            min: number,
            max: number,
          ) => {
            return Math.floor(
              Math.random() * (max - min + 1),
            ) + min;
          };

          const firstNames = [
            "Alex",
            "John",
            "Sarah",
            "Michael",
            "Emma",
            "David",
          ];

          const lastNames = [
            "Anderson",
            "Smith",
            "Johnson",
            "Brown",
            "Wilson",
            "Taylor",
          ];

          const inputs = Array.from(
            document.querySelectorAll<
              HTMLInputElement | HTMLTextAreaElement
            >("input, textarea"),
          );

          let count = 0;

          inputs.forEach((element) => {
            if (element.disabled || element.readOnly) {
              return;
            }

            if (element.type === "hidden") {
              return;
            }

            const style =
              window.getComputedStyle(element);

            if (
              style.display === "none" ||
              style.visibility === "hidden"
            ) {
              return;
            }

            const type =
              element.type?.toLowerCase() || "";

            const text = `
              ${type}
              ${element.name}
              ${element.id}
              ${element.placeholder}
              ${element.getAttribute("autocomplete") || ""}
              ${element.getAttribute("aria-label") || ""}
            `.toLowerCase();

            let value = "";

            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);

            if (
              type === "email" ||
              text.includes("email")
            ) {
              value =
                `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
            } else if (
              type === "password" ||
              text.includes("password")
            ) {
              value = "Test@12345";
            } else if (
              type === "tel" ||
              text.includes("phone") ||
              text.includes("mobile")
            ) {
              value = `+91 ${randomNumber(
                7000000000,
                9999999999,
              )}`;
            } else if (
              text.includes("first name") ||
              text.includes("firstname") ||
              text.includes("fname")
            ) {
              value = firstName;
            } else if (
              text.includes("last name") ||
              text.includes("lastname") ||
              text.includes("lname") ||
              text.includes("surname")
            ) {
              value = lastName;
            } else if (
              text.includes("full name") ||
              text.includes("fullname")
            ) {
              value = `${firstName} ${lastName}`;
            } else if (
              text.includes("username") ||
              text.includes("user name")
            ) {
              value =
                `${firstName.toLowerCase()}${randomNumber(
                  10,
                  99,
                )}`;
            } else if (
              text.includes("address") ||
              text.includes("street")
            ) {
              value = "42 Park Street";
            } else if (text.includes("city")) {
              value = "Kolkata";
            } else if (
              text.includes("state") ||
              text.includes("province")
            ) {
              value = "West Bengal";
            } else if (
              text.includes("country")
            ) {
              value = "India";
            } else if (
              text.includes("zip") ||
              text.includes("postal") ||
              text.includes("postcode") ||
              text.includes("pin")
            ) {
              value = "700016";
            } else if (
              text.includes("company") ||
              text.includes("organization")
            ) {
              value = "TechNova Solutions";
            } else if (type === "url") {
              value = "https://example.com";
            } else if (type === "number") {
              value = String(randomNumber(1, 100));
            } else if (type === "date") {
              value = new Date()
                .toISOString()
                .split("T")[0];
            } else if (
              element instanceof HTMLTextAreaElement
            ) {
              value =
                "This is sample test data generated by WebToolKit.";
            } else if (
              type === "text" ||
              type === ""
            ) {
              value = "Sample test data";
            }

            if (!value) {
              return;
            }

            const prototype =
              element instanceof HTMLTextAreaElement
                ? HTMLTextAreaElement.prototype
                : HTMLInputElement.prototype;

            const descriptor =
              Object.getOwnPropertyDescriptor(
                prototype,
                "value",
              );

            if (descriptor?.set) {
              descriptor.set.call(
                element,
                value,
              );
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

            count++;
          });

          return count;
        },
      });

      const count = result[0]?.result ?? 0;

      setFilledCount(count);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-[500px] w-[380px] rounded-2xl bg-zinc-950 p-5 text-white shadow-xl">
      <header className="mb-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-lg font-bold">
            🎲 Fake Filler
          </h1>

          <p className="text-xs text-zinc-500">
            Automatically fill forms with test data
          </p>
        </div>
      </header>

      <section>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-5 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
              <Zap
                size={28}
                className="text-yellow-400"
              />
            </div>
          </div>

          <h2 className="text-center text-base font-semibold">
            Fill Current Page
          </h2>

          <p className="mt-2 text-center text-xs leading-relaxed text-zinc-500">
            Detect form fields and automatically
            generate realistic test data.
          </p>

          <button
            onClick={fillForm}
            disabled={status === "filling"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap size={16} />

            {status === "filling"
              ? "Filling..."
              : "Fill Form"}
          </button>
        </div>

        {status === "success" && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-green-900 bg-green-950/30 px-4 py-3">
            <Check
              size={18}
              className="text-green-400"
            />

            <div>
              <p className="text-sm font-medium text-green-400">
                Form filled successfully
              </p>

              <p className="text-xs text-zinc-500">
                {filledCount} field
                {filledCount !== 1 ? "s" : ""} filled
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3">
            <p className="text-sm font-medium text-red-400">
              Could not fill the page
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Make sure the current page allows
              extension scripts.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-zinc-800 pt-4 text-center">
        <p className="text-xs text-zinc-600">
          WebToolKit Fake Filler
        </p>
      </footer>
    </main>
  );
}
