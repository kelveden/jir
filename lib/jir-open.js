#!/usr/bin/env node

const open = require('open');

const action = (config) => (id) => {
    open(`https://${config.host}/browse/${id}`);
};

const command = (program, config) => {
    program
        .command('open <id>')
        .description("Opens the specified card in the browser for viewing.")
        .action(action(config));
};

exports.action = action;
exports.command = command;