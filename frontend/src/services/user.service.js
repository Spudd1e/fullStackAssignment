const login = (username, password) => {
  return fetch("http://localhost:3333/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      if (response.status === 400) {
        throw "Incorrect username/password";
      }
      if (response.status === 500) {
        throw "Server Error";
      }
    })
    .then((resJson) => {
      localStorage.setItem("user_id", resJson.user_id);
      localStorage.setItem("session_token", resJson.session_token);
      return resJson;
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

const logout = () => {
  return fetch("http://localhost:3333/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token"),
    },
  })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("user_id"),
          localStorage.removeItem("session_token");
        return;
      } else if (response.status === 401) {
        throw "Not logged In";
      } else {
        throw "Something went wrong";
      }
    })
    .catch((error) => {
      localStorage.clear();
      location.reload();
      console.log("Err", error);
      return Promise.reject(error);
    });
};
const getSingleUser = (id) => {
  return fetch("http://localhost:3333/users/" + id)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 404) {
        throw "user does not exist";
      }
      if (response.status === 500) {
        throw "Something went wrong";
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};
const addNewUser = (firstname, lastname, username, password) => {
  return fetch("http://localhost:3333/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: firstname,
      last_name: lastname,
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw response.json();
      }
      if (response.status === 500) {
        throw "something went wrong";
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

export const userService = {
  login,
  logout,
  getSingleUser,
  addNewUser,
};
