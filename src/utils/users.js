const users = [];

// add user
const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required'
    };
  }

  // check for existing user
  const existingUser = users.find((user) => user.room === room && user.username === username);

  // validate username
  if (existingUser) {
    return {
      error: 'Username is in use'
    };
  }

  // store the user
  const user = { id, username, room };
  users.push(user);
  return {
    user
  };
};

// remove user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get user
const getUser = (id) => {
  const foundUser = users.find((user) => user.id === id);
  return foundUser ? foundUser : undefined;
};

// get users in room
const getUsersInRoom = (room) => {
  const usersInRoom = users.filter((user) => user.room == room);
  return usersInRoom ? usersInRoom : [];
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
