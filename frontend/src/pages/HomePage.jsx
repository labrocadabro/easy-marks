import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Card } from "flowbite-react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { server } from "../config/server";
import { useNavigate } from "react-router-dom";
import BookmarkIcon from "../components/BookmarkIcon";

function HomePage() {
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

	return (
		<>
			{/* {loggedIn ? (
				<></>
			) : (
				<>
					<div
						style={{ marginTop: "35px", marginLeft: "20px" }}
						className="absolute max-w-72 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
							You are not logged in
						</h5>

						<button
							onClick={login}
							className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Sign in with Google
							<svg
								className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 10"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 5h12m0 0L9 1m4 4L9 9"
								/>
							</svg>
						</button>
					</div>
				</>
			)} */}

			<Card
				className="bg-slate-50"
				style={{ marginBottom: "25px", backgroundColor: "#E8D9BF" }}
			>
				<div className="flex items-center justify-center">
					<h1 className="font-homeFont">
						<BookmarkIcon className="text-black h-8 -mt-1" />
						EasyMarks
					</h1>
				</div>
			</Card>

			<div className="grid grid-cols-4 grid-rows-2 gap-5 content-start">
				<Card
					className="col-span-3 row-span-2"
					style={{ backgroundColor: "#E8D9BF" }}
				>
					<div className="flex flex-col h-full">
						<h3 className="font-homeFont"> Neural Narwhals Presents</h3>
						<h1 className="font-homeFont"> EasyMarks</h1>
						<br></br>
						<p className="font-homeFont">Change log</p>
						<ul className="list-disc list-inside">
							<li className="font-homeFont">
								Implemented basic functionality within Flask endpoints.
							</li>
							<li className="font-homeFont">
								Utilized separate threads in Flask endpoints to establish
								connections to message queue for improved performance.
							</li>
							<li className="font-homeFont">
								Implemented message queue communication to publish URLs for
								worker consumption.
							</li>
							<li className="font-homeFont">
								Configured worker to consume messages and process URLs in a
								separate process, decoupled from Flask.
							</li>
							<li className="font-homeFont">
								Integrated scraper (playwright) to retrieve website title, text,
								and take screenshots upon receiving URLs.
							</li>
							<li className="font-homeFont">
								Implemented queue worker to handle communication with summarizer
								and embedder for processing text.
							</li>
							<li className="font-homeFont">
								Stored URL, title, summary, screenshot URL, and embedding in the
								database for future reference.
							</li>
						</ul>
					</div>
				</Card>
			</div>
		</>
	);
}

export default HomePage;
