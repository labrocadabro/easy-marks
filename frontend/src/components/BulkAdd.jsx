import { useState, useEffect } from 'react'
import { Button, Label, FileInput, Flowbite, Toast } from 'flowbite-react'
import { HiCheck, HiOutlineExclamation } from 'react-icons/hi'

const customTheme = {
	button: {
		color: {
			primary: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
		}
	}
}

function BulkAdd() {
	const [fileName, setFileName] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [validFile, setValidFile] = useState(false);
	let fileReader;

	useEffect(() => {
		const timer = setTimeout(() => {
			setSubmitted(false);
			setValidFile(false);
		}, 3000)
		return () => clearTimeout(timer);
	}, [submitted, validFile]);

	const handleFileRead = (e) => {
		const content = fileReader.result;
		console.log(content); // Remove later before deployment
	}

	const handleFileChosen = (file) => {
		setFileName(file.name);
		fileReader = new FileReader();
		fileReader.onloadend = handleFileRead;
		fileReader.readAsText(file);
	}

	const handleUpload = () => {
		setSubmitted(true)
		if (fileName.split('.').pop() === 'csv' || fileName.split('.').pop() === 'md') {
			setValidFile(true);
		}
	}

  return (
    <>
      <div id='fileUpload' className="flex flex-col">
				<div className="mb-2">
					<Label htmlFor='file' value='Upload File' />
				</div>
				<FileInput id='file' name='file'
					onChange={e => handleFileChosen(e.target.files[0])}
					helperText='Upload .csv or .md files to import bookmarks' />
				<Flowbite theme={{ theme:customTheme }}>
					<Button className='mt-6' type='submit'
						onClick={handleUpload}
						color='primary'>Upload File</Button>
				</Flowbite>
			</div>

			{submitted && validFile &&
				<div className='flex flex-col items-center mt-6'>
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
							<HiCheck className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">File uploaded.</div>
						<Toast.Toggle />
					</Toast>
				</div>
			}

			{submitted && !validFile &&
				<div className='flex flex-col items-center mt-6'>
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
							<HiOutlineExclamation className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">Invalid file type.</div>
						<Toast.Toggle />
					</Toast>
				</div>
			}
    </>
  )
}

export default BulkAdd