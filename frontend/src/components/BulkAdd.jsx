import { useState, useEffect } from "react";
import { Button, Label, FileInput, Flowbite, Toast } from "flowbite-react";
import { HiCheck, HiOutlineExclamation } from "react-icons/hi";
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

function BulkAdd() {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [validFile, setValidFile] = useState(false);

	// UseEffect to handle file submission/POST request
	useEffect(() => {
		if (validFile) {
			// Create form data to transmit file
			let data = new FormData();
			data.append("file", file);
			data.append("userId", window.sessionStorage.getItem("userId"));

			// Send file to server in POST request
			fetch(`${server}/api/urls`, {
				method: "POST",
				body: data,
				headers: {
					Authorization: `${window.sessionStorage.getItem("accessToken")}`,
				},
			})
				.then((res) => {
					if (!res.ok) throw new Error("Something went wrong");
					// Reset flags after 3 seconds if toast not dismissed
					const timer = setTimeout(() => {
						setSubmitted(false);
						setValidFile(false);
					}, 3000);
					return () => clearTimeout(timer);
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	}, [submitted, validFile, file, fileName]);

	// Update variables when file is chosen
	const handleFileChosen = (file) => {
		setFileName(file.name);
		setFile(file);
	};

	// Handle file upload
	const handleUpload = (e) => {
		e.preventDefault();
		setSubmitted(true);

		// Grab file extension from fileName
		let ext = fileName.split(".").pop();

		if (ext === "csv") {
			setValidFile(true);
		}
	};

	// Reset flags after Toast is dismissed
	const resetFlags = () => {
		setSubmitted(false);
		setValidFile(false);
	};

	return (
		<>
			<div id="fileUpload" className="flex flex-col">
				<div className="mb-2">
					<Label htmlFor="file" value="Upload File" />
				</div>
				<FileInput
					id="file"
					name="file"
					onChange={(e) => handleFileChosen(e.target.files[0])}
					helperText="Upload .csv file to import bookmarks"
				/>
				<Flowbite theme={{ theme: customTheme }}>
					<Button
						className="mt-6"
						type="submit"
						onClick={handleUpload}
						color="primary"
					>
						Upload File
					</Button>
				</Flowbite>
			</div>

			{/* Successful upload */}
			{submitted && validFile && (
				<div className="flex flex-col items-center mt-6">
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
							<HiCheck className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">File uploaded.</div>
						<Toast.Toggle onDismiss={resetFlags} />
					</Toast>
				</div>
			)}

			{/* Invalid file type */}
			{submitted && !validFile && (
				<div className="flex flex-col items-center mt-6">
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
							<HiOutlineExclamation className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">Invalid file type.</div>
						<Toast.Toggle onDismiss={resetFlags} />
					</Toast>
				</div>
			)}
		</>
	);
}

export default BulkAdd;
