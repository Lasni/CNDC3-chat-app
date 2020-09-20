const generateMessage = (text) => {
	return {
		text,
		createdAt: new Date().getTime()
	}
}

const generateLocationMessage = (coords) => {
	const {latitude, longitude} = coords
	return {
		locationURL: `https://google.com/maps?q=${latitude},${longitude}`,
		createdAt: new Date().getTime()
	}
}

module.exports = {
	generateMessage,
	generateLocationMessage
}