'use strict';

const moment = require('moment');

const log = str => {
  console.log(`${moment().format('YYYY-MM-DD hh:mm:ss')} ${str}`);
};

const build_message = ({ message, command, username }) => {
  return Buffer.from(`user:${username}\ncommand:${command}\nmessage:${message}\n\n`);
};

const parse_message = buffer => {
  const matches = buffer.toString().match(/^user:([^\n]*)\ncommand:([^\n]*)\nmessage:([^\n]*)\n\n$/);
  if (!matches || !matches[1] || !matches[2]) {
    return false;
  }
  if (!['JOIN', 'TALK', 'LEAVE'].includes(matches[2])) {
    return false;
  }
  if (matches[2] === 'TALK' && !matches[3]) {
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
      log(`${data.username} has joined!\n`);
      break;
    case 'TALK':
      log(`${data.username}: ${data.message}\n`);
      break;
    case 'LEAVE':
      log(`${data.username} left!\n\n`);
      break;
    default:
      console.error('Recieved bad message\n');
      break;
  }
};

module.exports = {
  log,
  parse_message,
  build_message,
  print,
};
