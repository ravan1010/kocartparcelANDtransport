import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);

    localStorage.setItem("language", language);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      <option value="en">English</option>
      <option value="kn">ಕನ್ನಡ</option>
    </select>
  );
}