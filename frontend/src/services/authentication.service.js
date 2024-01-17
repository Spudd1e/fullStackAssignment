const ifAuthenticated = (to, from, next) => {
  const loggedIn = localStorage.getItem("session_token");

  if (loggedIn) {
    if (to.path == "/login") {
      next(from.path);
      return;
    }
    if (to.path == "/users/" + localStorage.getItem("user_id")) {
      next("/profile");
      return;
    }
    next();
    return;
  }
  if (!loggedIn) {
    if (to.path == "/login") {
      next();
      return;
    }

    if (to.matched[0].path == "/users/:user_id") {
      next();
      return;
    }
  }

  next("/login");
};

export const auth = {
  ifAuthenticated,
};
