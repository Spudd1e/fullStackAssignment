const getFeed = () => {
  return fetch("http://localhost:3333/feed", {
    headers: {
      "X-Authorization": localStorage.getItem("session_token"),
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 500) {
        throw "Server Error";
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

const getSinglePost = (id) => {
  return fetch("http://localhost:3333/posts/" + id)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 404) {
        throw "Post not found";
      } else {
        throw "Server Error";
      }
    })
    .then((resJson) => {
      return resJson;
    });
};
const addNewPost = (textContent) => {
  return fetch("http://localhost:3333/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token"),
    },
    body: JSON.stringify({
      text: textContent,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw "Bad request";
      }
      if (response.status === 401) {
        throw "Login is required";
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
      Promise.reject(error);
    });
};

const updatePost = (post_id, text) => {
  return fetch("http://localhost:3333/posts/" + post_id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token"),
    },
    body: JSON.stringify({
      text: text,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return;
      }
      if (response.status === 400) {
        throw "Bad request";
      }
      if (response.status === 401) {
        throw "Unauthorised";
      }
      if (response.status === 403) {
        throw "You can only update your own posts";
      }
      if (response.status === 404) {
        throw "Not Found";
      }
      if (response.status === 500) {
        throw "Server Error";
      }
    })
    .catch((error) => {
      console.log("Err", error);
      Promise.reject(error);
    });
};

const deletePost = (post_id) => {
  return fetch("http://localhost:3333/posts/" + post_id, {
    method: "DELETE",
    headers: {
      "X-Authorization": localStorage.getItem("session_token"),
    },
  }).then((response) => {
    if (response.status === 200) {
      return;
    }
    if (response.status === 401) {
      throw "Unauthorised";
    }
    if (response.status === 403) {
      throw "You can only delete your own posts";
    }
    if (response.status === 404) {
      throw "Not Found";
    }
    if (response.status === 500) {
      throw "Server Error";
    }
  });
};

export const postService = {
  getFeed,
  getSinglePost,
  addNewPost,
  updatePost,
  deletePost,
};
