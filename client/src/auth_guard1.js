import store from "./Store/store";

export default (to, from, next) => {
  if (store.getters.user !== null && store.getters.user !== undefined) {
    console.log("The users are##: " + store.getters.user);
    next(false);
  } else {
    next();
  }
};
