import { useState, useEffect } from 'react'
import { Button, Label, TextInput, Toast } from 'flowbite-react'
import { HiLink, HiCheck, HiOutlineExclamation } from 'react-icons/hi'

function SingleAdd() {
	const [url, setUrl] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const [validUrl, setValidUrl] = useState(false)

	useEffect(() => {
		if (submitted && isValidUrl(url)) {
			setTimeout(() => {
				setSubmitted(false)
			}, 5000)
		}
	}, [submitted, url])

	const handleSubmit = () =>{
		if (isValidUrl(url)) {
			setSubmitted(true)
			setValidUrl(true)
		}
	}

	const updateInput = (e) => {
		setUrl(e.target.value)
	}

	const isValidUrl = (url) => {
		try {
			return Boolean(new URL(url))
		} catch (e) {
			return false
		}
	}

  return (
    <>
      <form className="flex flex-col">
				<div>
					<div className='mb-2'>
						<Label htmlFor='url' value='URL' />
					</div>
					<TextInput id='url' type='link' name='url'
						className='mb-6'
						placeholder='https://example.com'
						required rightIcon={HiLink}
						onChange={updateInput} />
				</div>
				<Button color='green'
					onClick={handleSubmit}>Add URL</Button>
			</form>

			{submitted && isValidUrl(url) &&
				<div className='flex flex-col items-center mt-6'>
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
							<HiCheck className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">Bookmark added successfully.</div>
						<Toast.Toggle />
					</Toast>
				</div>
			}
			{submitted && !isValidUrl(url) &&
				<div className='flex flex-col items-center mt-6'>
					<Toast>
						<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
							<HiOutlineExclamation className="h-5 w-5" />
						</div>
						<div className="ml-3 text-sm font-normal">Invalid URL.</div>
						<Toast.Toggle />
					</Toast>
				</div>
			}
    </>
  )
}

export default SingleAdd