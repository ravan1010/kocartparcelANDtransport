import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      order: "Order",
      pickupLocation: "Pickup Location",
      dropLocation: "Drop Location",
      tripDetails: "Trip Details",
      pickupToDrop: "Pickup → Drop",
      goodsDetails: "Goods Details",
      item: "Item",
      weight: "Weight",
      helpers: "Helpers",
      loading: "Loading",
      unloading: "Unloading",
      instructions: "Instructions",
      enterYourAmount: "Enter Your Amount",
      enterAmount: "Enter amount",
      submitAmount: "Submit Amount",
      submitting: "Submitting...",
      amountSubmitted: "Amount Submitted",
      waitingForCustomer: "Waiting for customer",
      waitingForCustomerDescription:
        "Your price has been sent to the customer. Please wait while they compare driver offers.",
      yourAmount: "Your Amount",
      pickupDistance: "Pickup Distance",
      eta: "ETA",
      navigate: "Navigate →",
      noAcceptedOrder: "No Accepted Order",
      noActiveOrder: "You don't have an active order.",
      yes: "Yes",
      no: "No"
    }
  },

  kn: {
    translation: {
      order: "ಆರ್ಡರ್",
      pickupLocation: "ಪಿಕಪ್ ಸ್ಥಳ",
      dropLocation: "ಡ್ರಾಪ್ ಸ್ಥಳ",
      tripDetails: "ಪ್ರಯಾಣದ ವಿವರಗಳು",
      pickupToDrop: "ಪಿಕಪ್ → ಡ್ರಾಪ್",
      goodsDetails: "ಸರಕುಗಳ ವಿವರಗಳು",
      item: "ವಸ್ತು",
      weight: "ತೂಕ",
      helpers: "ಸಹಾಯಕರು",
      loading: "ಲೋಡಿಂಗ್",
      unloading: "ಅನ್‌ಲೋಡಿಂಗ್",
      instructions: "ಸೂಚನೆಗಳು",
      enterYourAmount: "ನಿಮ್ಮ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ",
      enterAmount: "ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ",
      submitAmount: "ಮೊತ್ತವನ್ನು ಸಲ್ಲಿಸಿ",
      submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
      amountSubmitted: "ಮೊತ್ತವನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ",
      waitingForCustomer: "ಗ್ರಾಹಕರಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
      waitingForCustomerDescription:
        "ನಿಮ್ಮ ಬೆಲೆಯನ್ನು ಗ್ರಾಹಕರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಅವರು ಚಾಲಕರ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸುವವರೆಗೆ ಕಾಯಿರಿ.",
      yourAmount: "ನಿಮ್ಮ ಮೊತ್ತ",
      pickupDistance: "ಪಿಕಪ್ ದೂರ",
      eta: "ತಲುಪುವ ಸಮಯ",
      navigate: "ನ್ಯಾವಿಗೇಟ್ →",
      noAcceptedOrder: "ಯಾವುದೇ ಸ್ವೀಕರಿಸಿದ ಆರ್ಡರ್ ಇಲ್ಲ",
      noActiveOrder: "ನಿಮ್ಮಲ್ಲಿ ಯಾವುದೇ ಸಕ್ರಿಯ ಆರ್ಡರ್ ಇಲ್ಲ.",
      yes: "ಹೌದು",
      no: "ಇಲ್ಲ"
    }
  }
};

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;