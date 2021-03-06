#!/usr/bin/env node

const Printer = require('./printer');
const _ = require('lodash');
const Card = require('./card');

const action = (config) => (user, options) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options, config);
    const assignee = (user || "currentUser()").replace("@", "\\u0040");

    return proxy.get("/rest/api/2/search?jql=assignee=" + assignee + " AND resolution=Unresolved AND sprint in openSprints() order by updated DESC", {strictSSL: false})
        .then(printer.printResponse((body) => {
            body.issues
                .filter((story) => story.fields.status.name != "Done")
                .forEach((story) => {
                    const card = new Card({ colour: story.fields.status.statusCategory.colorName.replace("-gray", "") })
                    let cardContents = [
                            [ { content: story.fields.summary.replace(/\r\n/g, " ") } ],
                        ];

                    if (options.detailed) {
                        cardContents.push([ { content: story.fields.description.replace(/\r\n/g, " ") } ])
                    }

                    cardContents.unshift([
                        { content: story.key, width: 12, colour: "cyan" },
                        { content: story.fields.status.name, width: 20 },
                        { content: story.fields.assignee ? story.fields.assignee.displayName : "Unassigned", colour: "green" }
                    ]);

                    card.render(cardContents);
                });
        }))
        .catch((err) => console.error(err));
};

const command = (program, config) => {
    program
        .command('me [user]')
        .option('-v, --detailed', 'Display card details')
        .description("Displays my stories (or the stories for the specified user).")
        .action(action(config));
};

exports.action = action;
exports.command = command;