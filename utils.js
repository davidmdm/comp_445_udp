'use strict';

const moment = require('moment');

const users = [];

const log = (...args) => {
  console.log(`${moment().format('YYYY-MM-DD hh:mm:ss')}`, ...args);
};

const build_message = ({ message, command, username }) => {
  return Buffer.from(`user:${username}\ncommand:${command}\nmessage:${message}\n\n`);
};

const parse_message = buffer => {
  const matches = buffer.toString().match(/^user:([^\n]*)\ncommand:([^\n]*)\nmessage:([^\n]*)\n\n$/);
  if (!matches) {
    return false;
  }

  const [username, command, message] = matches.slice(1);

  if (!username || !command) {
    return false;
  }
  if (!['JOIN', 'TALK', 'LEAVE', 'WHO', 'QUIT'].includes(command)) {
    return false;
  }
  if (command === 'TALK' && !message) {
    return false;
  }

  if (command === 'QUIT') {
    console.log('Disconnecting from chat application...');
    process.exit(0);
  }

  if (command === 'JOIN') {
    users.push(username);
  }

  if (command === 'LEAVE') {
    const index = users.indexOf(username);
    if (index > -1) {
      users.splice(index, 1);
    }
  }

  return { username, command, message };
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
    case 'WHO':
      log(JSON.stringify(users, null, 4), '\n');
      break;
    default:
      console.error('Received bad message\n');
      break;
  }
};

module.exports = {
  log,
  parse_message,
  build_message,
  print,
};
