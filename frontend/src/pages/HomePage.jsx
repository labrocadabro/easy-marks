import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function HomePage() {
	const [loggedIn] = useContext(UserContext);

	return (
		<>
			<h1>Home Page</h1>
			{loggedIn ? "You are logged in" : "You are not logged in"}
		</>
	);
}

export default HomePage;
