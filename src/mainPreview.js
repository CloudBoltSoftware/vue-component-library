import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from "./plugins/vuetify";
import i18n from './plugins/i18n';

const app = createApp(App)

const pinia = createPinia();
// Vue i18n Internationalization and translations
// https://vue-i18n.intlify.dev/
app.use(i18n)

// Vuetify - our main Component library
// https://vuetifyjs.com/en/
app.use(vuetify)

// Pinia - the official Vue 3 state management library
// https://pinia.esm.dev/
app.use(pinia)

app.mount('#app')
