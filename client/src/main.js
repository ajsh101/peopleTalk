import Vue from "vue";

import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./Store/store";
import Alert from "./components/Shared/Alert";
import "@fortawesome/fontawesome-free/css/all.css";
import Loading from "@/components/Shared/Loader.vue";
import Notify from "@/components/Shared/Notification.vue";
import PassChanged from "@/components/Shared/PassChanged.vue";
import PassIncorrect from "@/components/Shared/PassIncorrect.vue";
import LoginAlertError from "@/components/Shared/LoginErrorAlert.vue";

Vue.config.productionTip = false;
Vue.component("app-alert", Alert);
Vue.component("app-loading", Loading);
Vue.component("app-notify", Notify);
Vue.component("pass-wrong", PassIncorrect);
Vue.component("login-alert-error", LoginAlertError);
Vue.component("pass-changed", PassChanged);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
