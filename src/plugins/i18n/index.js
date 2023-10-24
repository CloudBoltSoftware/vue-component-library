import { createI18n } from "vue-i18n";

// For options, see https://vue-i18n.intlify.dev/api/general.html#i18noptions and its inherited options
export default createI18n({
  locale: import.meta.env.VITE_I18N_LOCALE || "en",
  legacy: false,
});
