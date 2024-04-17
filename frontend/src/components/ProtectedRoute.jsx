import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Spinner from "./Spinner";

function ProtectedRoutes() {
	const [loggedIn] = useContext(UserContext);

	if (loggedIn === null) {
		return <Spinner className="w-48 text-[#E8D9BF] opacity-80 mx-auto" />; // You can render a loading spinner while waiting for the loggedIn state
	}

	return loggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;
