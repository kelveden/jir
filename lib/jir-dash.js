#!/usr/bin/env node

const Printer = require('./printer');
const Table = require('cli-table');
const initials = require('initials');
const _ = require('lodash');

const action = (id, options) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options);

    return proxy.get("/rest/agile/1.0/board/" + id + "/issue", { strictSSL: false })
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
                        var result = story.key,
                            colour = story.color;

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

const command = (program) => {
    program
        .command('dash <id>')
        .description("Displays details of the specified board.")
        .action(action);
};

exports.action = action;
exports.command = command;