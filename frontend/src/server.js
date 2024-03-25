const dev = "http://127.0.0.1:5000";
const prod = "https://bookmark-e3b53799b0c3.herokuapp.com";

export const server = process.env.NODE_ENV === "development" ? dev : prod;