#!/usr/bin/env node

const Printer = require('./printer');
const Card = require('./card');

const action = (config) => (id, options) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options, config);

    return proxy.get("/rest/api/2/issue/" + id, { strictSSL: false })
        .then(printer.printResponse((story) => {
            var card = new Card({ colour: story.fields.status.statusCategory.colorName.replace("-gray", "") }),
                cardContents = [
                    [ { content: story.fields.summary.replace(/\r\n/g, " ") } ],
                    [ { content: story.fields.description.replace(/\r\n/g, " ") } ]
                ];

            cardContents.unshift([
                { content: story.key, width: 12, colour: "cyan" },
                { content: story.fields.status.name, width: 20 },
                { content: story.fields.assignee ? story.fields.assignee.displayName : "Unassigned", colour: "green" }
            ]);

            card.render(cardContents);
        }))
        .catch((err) => console.error(err));
};

const command = (program, config) => {
    program
        .command('card <id>')
        .description("Displays details of the specified card.")
        .action(action(config));
};

exports.action = action;
exports.command = command;