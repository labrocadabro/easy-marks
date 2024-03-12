import { useState, useEffect } from 'react'
import { Button, Label, TextInput, Toast, Flowbite } from 'flowbite-react'
import { HiLink, HiCheck, HiOutlineExclamation } from 'react-icons/hi'

function SingleAdd() {
	const [url, setUrl] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const [validUrl, setValidUrl] = useState(false)

	const customTheme = {
		button: {
			color: {
				primary: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
			}
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setSubmitted(false)
			setValidUrl(false)
		}, 3000)
		return () => clearTimeout(timer)
	}, [submitted, validUrl])

	const handleSubmit = () =>{
		setSubmitted(true)
		setValidUrl(isValidUrl(url))
	}

	const updateInput = (e) => {
		setUrl(e.target.value)
	}

	const isValidUrl = urlString => {
		const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
		'(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator

		return !!urlPattern.test(urlString);
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
				<Flowbite theme={{ theme:customTheme }}>
					<Button color='primary'
						onClick={handleSubmit}>Add URL</Button>
				</Flowbite>
			</form>

			{submitted && validUrl &&
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

			{submitted && !validUrl &&
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