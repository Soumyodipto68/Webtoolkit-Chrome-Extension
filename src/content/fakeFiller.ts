console.log("WebToolKit Fake Filler content script loaded");

import { detectFields } from "../tools/fake-filler/filler/fieldDetector";
import { fillFields } from "../tools/fake-filler/filler/formFiller";

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type !== "FILL_FAKE_FORM") {
      return;
    }

    console.log("WebToolKit: FILL_FAKE_FORM received");

    try {
      const fields = detectFields();
      const filledCount = fillFields(fields);

      sendResponse({
        success: true,
        filledCount,
      });
    } catch (error) {
      console.error("WebToolKit Fake Filler error:", error);

      sendResponse({
        success: false,
        error: "Failed to fill the form.",
      });
    }

    return true;
  },
);
