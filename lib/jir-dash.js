#!/usr/bin/env node

const Printer = require('./printer');
const Table = require('cli-table');
const initials = require('initials');
const _ = require('lodash');

const action = (config) => (id, options) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options, config);

    return proxy.get("/rest/agile/1.0/board/" + (id || config.defaultBoard) + "/issue", { strictSSL: false })
        .then(printer.printResponse((board) => {
            const phases = _.uniq(board.issues.map((story) => story.fields.status.name));
            const data = phases.map(
                (phase) => board.issues.filter((issue) => issue.fields.status.name === phase)
            );

            var table = new Table({
                    chars: { 'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│' },
                    style: { head: ["inverse"]},
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

            for (var i = 0; i < 10; i++) {
                table.push(contents.map((phaseArray) => {
                    if (phaseArray.length > i) {
                        return phaseArray[i];
                    } else {
                        return "";
                    }
                }));
            }

            console.log(table.toString());
        }))
        .catch((err) => console.error(err));
};

const command = (program, config) => {
    program
        .command('dash [id]')
        .description("Displays details of the specified board (or the default board).")
        .action(action(config));
};

exports.action = action;
exports.command = command;