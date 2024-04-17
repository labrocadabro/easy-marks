import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { server } from "../config/server";
import { Avatar, Dropdown } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function Header() {
	const [loggedIn, setLoggedIn, photo, setPhoto, firstName, setFirstName] =
		useContext(UserContext);
	const navigate = useNavigate();

	const login = useGoogleLogin({
		flow: "auth-code",
		onSuccess: (response) => {
			fetch(`${server}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code: response.code }),
			})
				.then((res) => {
					if (!res.ok) throw new Error("Something went wrong");
					return res.json();
				})
				.then((data) => {
					if (data) {
						setLoggedIn(true);
						setPhoto(data.photo);
						setFirstName(data.firstName);
						window.sessionStorage.setItem("accessToken", data.accessToken);
						window.sessionStorage.setItem("userId", data.userId);
						navigate("/bookmarks");
					}
				})
				.catch((e) => {
					console.log(e);
				});
		},
		onError: (errorResponse) => {
			console.log(errorResponse);
			setLoggedIn(false);
		},
	});

	const logOut = () => {
		googleLogout();
		window.sessionStorage.removeItem("accessToken");
		window.sessionStorage.removeItem("userId");
		setLoggedIn(false);
	};

	return (
		<header className="px-8 py-2 flex justify-between h-20 items-center">
			<nav>
				<ul className="flex gap-6">
					<li>
						<Link to="/" className="nav-link">
							Home
						</Link>
					</li>
					{loggedIn && (
						<li>
							<Link to="/bookmarks" className="nav-link">
								View Bookmarks
							</Link>
						</li>
					)}
					{loggedIn && (
						<li>
							<Link to="/add" className="nav-link">
								Add New Bookmark
							</Link>
						</li>
					)}
				</ul>
			</nav>
			{loggedIn ? (
				<>
					<Dropdown
						label={<Avatar alt="User settings" img={photo} rounded />}
						arrowIcon={false}
						inline
					>
						<Dropdown.Header>
							<span className="block text-sm">Logged in as {firstName}</span>
						</Dropdown.Header>
						<Dropdown.Item>
							{" "}
							<Link to="/bookmarks">View Bookmarks</Link>
						</Dropdown.Item>
						<Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
					</Dropdown>
				</>
			) : (
				<button onClick={login}>Sign in with Google</button>
			)}
		</header>
	);
}

export default Header;
