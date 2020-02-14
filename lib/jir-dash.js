#!/usr/bin/env node

const Table = require('cli-table');
const initials = require('initials');

const action = (config) => (id, options) => {
    const proxy = require('./proxy')(options, config);
    const boardId = (id || config.defaultBoard);

    return Promise.all([
        proxy.get("/rest/agile/1.0/board/" + boardId + "/issue?jql=sprint in openSprints()", {strictSSL: false}),
        proxy.get("/rest/agile/1.0/board/" + boardId + "/configuration", {strictSSL: false})]
    ).then(([board, config]) => {
        const phases = JSON.parse(config.body).columnConfig.columns.map(col => col.name);

        const data = phases.map(
            (phase) => JSON.parse(board.body).issues.filter((issue) => issue.fields.status.name === phase)
        );

        const table = new Table({
                chars: {
                    'top': '═',
                    'top-mid': '╤',
                    'top-left': '╔',
                    'top-right': '╗',
                    'bottom': '═',
                    'bottom-mid': '╧',
                    'bottom-left': '╚',
                    'bottom-right': '╝',
                    'left': '║',
                    'left-mid': '╟',
                    'mid': '─',
                    'mid-mid': '┼',
                    'right': '║',
                    'right-mid': '╢',
                    'middle': '│'
                },
                style: {head: ["inverse"]},
                head: phases
            }),
            contents = data.map((col) =>
                col.map((story) => {
                    var result = story.key;

                    if (story.fields.assignee) {
                        result = result + " [" + initials(story.fields.assignee.displayName).cyan + "]";
                    }

                    return result;
                })
            );

        for (let i = 0; i < 10; i++) {
            table.push(contents.map((phaseArray) => {
                if (phaseArray.length > i) {
                    return phaseArray[i];
                } else {
                    return "";
                }
            }));
        }

        console.log(table.toString());
    })
        .catch((err) => console.error(err));
};

const command = (program, config) => {
    program
        .command('dash [id]')
        .description("Displays details of the specified board (or the default board) for the current sprint.")
        .action(action(config));
};

exports.action = action;
exports.command = command;