jir
===

> Very much a work in progress...

A crude Jira CLI for those who want to avoid the UI.

Installation
------------
* Pull down the source.
* In the source folder run `npm install`.
* Run `npm link`.

Assuming that your nodejs global modules bin folder is on your path, `jir` should now be usable as a command from your shell.

Configuration
-------------

You'll need a file `~/.jirconfig` with the following structure:

```
{
  "user": "JIRA_USERNAME",
  "password": "JIRA_API_KEY",
  "host": "JIRA_HOST",
  "defaultBoard": <board-id>
}
```

Usage
-----

Run `jir --help`; currently this outputs:

```
  Usage: jir [options] [command]


  Commands:

    board [id]           Displays details of the specified board (or the default board) for the current sprint.
    card <id>            Displays details of the specified card.
    me [options] [user]  Displays my stories (or the stories for the specified user).
    open <id>            Opens the specified card in the browser for viewing.
    help                 Display this help
    help [cmd]           display help for [cmd]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format <format>  The output format (raw, json or yaml)
    --ugly                 Turn off prettification
    --debug                Print out diagnostics
    --dryRun               Print out diagnostics AND don't actually make any requests
```
