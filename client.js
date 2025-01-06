const { open } = require('node:fs/promises');
const argv = require('yargs').argv
const axios = require('axios')

const { filePath, serverUrl } = argv

const handleEvents = async () => {
	console.log(filePath)
	const file = await open(filePath);
	const url = `${serverUrl}/liveEvent`
	const headers = {
		'Authorization': 'secret'
	}

	for await (const line of file.readLines()) {
		await axios.post(url, JSON.parse(line), { headers })
	}
}

handleEvents().then(() => {
	console.log('Finished Successfully')
	process.exit(0)
}).catch((e) => {
	console.error(`failed during handle - ${e.message}`)
	process.exit(1)
})