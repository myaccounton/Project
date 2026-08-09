import http from "./httpService";

const apiEndpoint =  "/users";

export function register(user){
    return http.post(apiEndpoint,{
        email: user.email,
        password: user.password,
        name:user.name
    })
}

export function getCurrentProfile() {
    return http.get(apiEndpoint + "/me");
}

export function upgradeToGold() {
    return http.post(apiEndpoint + "/me/upgrade");
}