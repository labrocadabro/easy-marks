import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<GoogleOAuthProvider clientId="523044784161-ndlm9lud1pr8fi0jmgp331ukgr5dub3d.apps.googleusercontent.com">
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</GoogleOAuthProvider>
);
