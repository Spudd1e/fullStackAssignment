const search = (search) => {
    let route = '';
    if(search === ""){
        route = "search"
    }
    else{
        route = "search?q=" + search
    }
    return fetch("http://localhost:3333/" + route)
    .then((response) => {
        if(response.status === 200){
            return response.json()
        }
        if(response.status === 400){
            throw "Bad data"
        }
        if(response.status === 500){
            throw "Something went wrong"
        }
    })
    .then((resJSon) => {
        return resJSon;
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const followUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow", {
        method:"POST",
        headers:{
            "Content-Type" : "application/json",
            "X-Authorization" : localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200){
            return response;
        }
        if(response.status === 401){
            throw "Unauthorized"
        }
        if(response.status === 403){
            throw "Already following"
        }
        if(response.status === 404){
            throw "User does not exist"
        }
        if(response.status === 500){
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        Promise.reject(error)
    })
}
const unFollowUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow", {
        method:"DELETE",
        headers:{
            "Content-Type" : "application/json",
            "X-Authorization" : localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200){
            return;
        }   
        if(response.status === 401){
            throw "Unauthorised"
        }
        if(response.status === 403){
            throw "Cannot unfollow user you are not already following"
        }
        if(response.status === 500){
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        Promise.reject(error)
    })

}

const likePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like", {
        method: "POST",
        headers:{
            "X-Authorization" : localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200){
            return response
        }
        if(response.status === 401){
            throw "Unauthorised"
        }
        if(response.status === 403){
            throw "Post already liked"
        }
        if(response.status === 404){
            throw "Post not found"
        }
        if(response.status === 500){
            throw "server error"
        }
    })
    .catch(error => {
        console.log(error, "HEY")
    })
}
const unlikePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like", {
        method: "DELETE",
        headers: {
            "X-Authorization" : localStorage.getItem("session_token")
        }
    } )
    .then((response) => {
        if(response.status === 200){
            return response
        }
        if(response.status === 401){
            throw "unauthorized"
        }
        if(response.status === 403){
            throw "cannot unlike an unliked post"
        }
        if(response.status === 404){
            throw "post not found"
        }
        if(response.status === 500){
            throw "server error"
        }
    })
}

export const socialService ={
    search, followUser, unFollowUser, likePost,unlikePost
}