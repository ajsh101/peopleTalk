import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Dashboard from "./views/User/Dashboard.vue";
import ChatRoom from "./views/app/ChatRoom.vue";
import Login from "./views/User/Login.vue";
import Signup from "./views/User/Signup.vue";
import SendConfirmationEmail from "./views/User/SendConfirmationEmail.vue";
import UserAuth from "./views/User/UserAuth.vue";
import AccountVerified from "./views/User/AccountVerified.vue";
import ForgetPassword from "./views/User/ForgetPassword.vue";
import ResetPassword from "./views/User/ResetPassword.vue";
import UserAlreadyOnline from "./views/User/UserAlreadyOnline.vue";
import UrlExpired from "./views/User/UrlExpired.vue";
import AuthGuard from "./auth_guard";
import AuthGuard1 from "./auth_guard1";
//import AuthGuard2 from "./auth_guard2";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,

  routes: [{
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: AuthGuard
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: AuthGuard1
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      beforeEnter: AuthGuard1
    },
    {
      path: "/userAuth",
      name: "accAuth",
      component: UserAuth,
      beforeEnter: AuthGuard1
    },
    {
      path: "/sendMail",
      name: "SendConfirmationEmail",
      component: SendConfirmationEmail,
      beforeEnter: AuthGuard1
    },
    {
      path: "/accountVerified",
      name: "AccountVerified",
      component: AccountVerified,
      beforeEnter: AuthGuard1
    },
    {
      path: "/urlExpired",
      name: "UrlExpired",
      component: UrlExpired,
      beforeEnter: AuthGuard1
    },
    {
      path: "/forgotPassword",
      name: "ForgotPassword",
      component: ForgetPassword,
      beforeEnter: AuthGuard1
    },
    {
      path: "/resetPassword",
      name: "ResetPassword",
      component: ResetPassword,
      beforeEnter: AuthGuard1
    },
    {
      path: "/userOnline",
      name: "UserAlreadyOnline",
      component: UserAlreadyOnline,
      beforeEnter: AuthGuard1
    },
    {
      path: "/chatRoom",
      name: "chatRoom",
      component: ChatRoom,
      beforeEnter: AuthGuard
    }
  ]
});