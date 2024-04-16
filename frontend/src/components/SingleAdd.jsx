import { useState, useEffect } from "react";
import { Button, Label, TextInput, Toast, Flowbite } from "flowbite-react";
import { HiLink, HiCheck, HiOutlineExclamation } from "react-icons/hi";
import { server } from "../config/server";

// Custom theme to style submit button
const customTheme = {
	button: {
		color: {
			primary:
				"bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
		},
	},
};

function SingleAdd() {
	const [url, setUrl] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [validUrl, setValidUrl] = useState(false);

	useEffect(() => {
		if (validUrl) {
			// Send POST request to backend if URL is valid
			fetch(`${server}/api/url`, {
				method: "POST",
				headers: {
					Authorization: `${window.sessionStorage.getItem("accessToken")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: url,
					userId: window.sessionStorage.getItem("userId"),
				}),
			})
				.then((res) => {
					if (!res.ok) throw new Error("Something went wrong");
					// Clear url state
					setUrl("");
					// Reset flags after 2 seconds if toast not dismissed
					const timer = setTimeout(() => {
						setSubmitted(false);
						setValidUrl(false);
					}, 2000);
					return () => clearTimeout(timer);
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
		// url should not be in the dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submitted, validUrl]);

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		setValidUrl(isValidUrl(url));
	};

	// Validate URL using regex
	const isValidUrl = (urlString) => {
		const urlPattern = new RegExp(
			"^(https?:\\/\\/)?" + // validate protocol
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
				"((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
				"(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
				"(\\#[-a-z\\d_]*)?$",
			"i"
		); // validate fragment locator

		// Return T/F if URL passes regex test
		return !!urlPattern.test(urlString);
	};

	// Reset flags after Toast is dismissed
	const resetFlags = () => {
		setSubmitted(false);
		setValidUrl(false);
	};

	return (
		<>
			<form className="flex flex-col">
				<div>
					<div className="mb-2">
						<Label htmlFor="url" value="URL" />
					</div>
					<TextInput
						id="url"
						name="url"
						className="mb-6"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://example.com"
						rightIcon={HiLink}
						required
					/>
				</div>
				<Flowbite theme={{ theme: customTheme }}>
					<Button color="primary" onClick={handleSubmit}>
						Add URL
					</Button>
				</Flowbite>
			</form>

			{/* URL added successfully */}
			{submitted && validUrl && (
				<div className="flex flex-col items-center mt-6">
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center 		   justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
							<HiCheck className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">
							Bookmark added successfully.
						</div>
						<Toast.Toggle onDismiss={resetFlags} />
					</Toast>
				</div>
			)}

			{/* Invalid URL */}
			{submitted && !validUrl && (
				<div className="flex flex-col items-center mt-6">
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
							<HiOutlineExclamation className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">Invalid URL.</div>
						<Toast.Toggle onDismiss={resetFlags} />
					</Toast>
				</div>
			)}
		</>
	);
}

export default SingleAdd;
