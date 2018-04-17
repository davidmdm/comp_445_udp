'use strict';

const build_message = ({ message, command, username }) => {
  return Buffer.from(`user:${username}\ncommand:${command}\nmessage:${message}\n\n`);
};

const parse_message = buffer => {
  const matches = buffer.toString().match(/^user:([^\n]*)\ncommand:([^\n]*)\nmessage:([^\n]*)\n\n$/);
  if (!matches || !matches[1] || !matches[2] || !matches[3]) {
    return false;
  }
  if (!['JOIN', 'TALK'].includes(matches[2])) {
    return false;
  }
  return {
    username: matches[1],
    command: matches[2],
    message: matches[3],
  };
};

const print = data => {
  switch (data.command) {
    case 'JOIN':
      console.log(`${data.username} has joined!\n`);
      break;
    case 'TALK':
      console.log(`${data.username}: ${data.message}\n`);
      break;
    default:
      console.error('Recieved bad message');
      break;
  }
};

module.exports = {
  parse_message,
  build_message,
  print,
};
