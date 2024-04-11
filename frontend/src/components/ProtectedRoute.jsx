import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function ProtectedRoutes() {
	const [loggedIn] = useContext(UserContext);

	return loggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;
