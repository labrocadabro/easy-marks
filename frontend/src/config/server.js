const dev = "http://127.0.0.1:5000";
const prod = window.location.origin;

export const server = process.env.NODE_ENV === "development" ? dev : prod;