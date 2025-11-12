import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((req) => {
  const stored = JSON.parse(localStorage.getItem("userInfo") || "null");
  const token = stored?.token;
  if (token) {
    console.log("Inside interceptors")
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Sending request", req.url);
  console.log("Authorization header ", req.headers.Authorization);
  return req;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem("userInfo");
            window.location.assign("/login");
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};
