const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (username, coords) => {
  const { latitude, longitude } = coords;
  return {
    username,
    locationURL: `https://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};
