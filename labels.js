#!/usr/bin/env node

// Dependencies
var GitHubLabeller = require("github-labeller");
var chalk          = require('chalk');
var prompt         = require('prompt');

/**
 * Used constants.
 *
 * log      = Short function for the console log.
 * error    = The terminal text styling for error messages.
 * success  = The terminal text styling for success messages.
 */
const log     = console.log;
const error   = chalk.bold.red;
const success = chalk.keyword('green');

/**
 * Prompt schema for the terminal questioner.
 *
 * @type {{properties: {Owner: {message: string, required: boolean}, Repository: {message: string, required: boolean}, Token: {message: string, required: boolean}}}}
 */
var schema = {
    properties: {
        Owner      : { message : 'Uw Github username', required: true },
        Repository : { message : 'De GitHub repository waar de labels geplaatst moeten worden.', required : true },
        Token      : { message : 'De GitHub token voor je account', required : true }
    }
};

/**
 * The default labels for the github repositories of Activisme_BE
 *
 * @see https://github.com/CPSB/Internals/blob/master/documentatie/github-default-labels.md
 * @see https://github.com/CPSB/Internals/blob/master/styleguide/GIT-tagging-styleguide.md
 *
 * @type {[*]}
 */
var labels = [
    { color: "#d93f0b", name: "Bug" },
    { color: "#0e8a16", name: "Chore" },
    { color: "#d93f0b", name: "Confirmed" },
    { color: "#b60205", name: "Critical Priority" },
    { color: "#1d76db", name: "Discussion" },
    { color: "#d4c5f9", name: "Duplicate" },
    { color: "#fef2c0", name: "Enhancement" },
    { color: "#fef2c0", name: "Feature" },
    { color: "#e99695", name: "High Priority" },
    { color: "#d4c5f9", name: "Invalid" },
    { color: "#5319e7", name: "Legal" },
    { color: "#e99695", name: "Low priority" },
    { color: "#e99695", name: "Medium Priority" },
    { color: "#d4c5f9", name: "On hold" },
    { color: "#0e8a16", name: "Optimalization" },
    { color: "#1d76db", name: "Question" },
    { color: "#d93f0b", name: "Security" },
    { color: "#d4c5f9", name: "Wontfix" }
];

// Start the execution of the prompt package in the terminal.
prompt.start();

// Start Questioning in the prompt.
prompt.get(schema, function (err, input) {
    var User  = input.Owner;
    var Repo  = input.Repository;
    var Token = input.Token;

    GitHubLabeller(labels, { repo: User + "/" + Repo, token: Token}, function (err, data) {
        log(); // Needed for the empty line between prompt and output.

        if (err) return log(error(err));

        data.forEach(function(label) {
            log(success('[SUCCESS]: ' + User + '/' + Repo) + label.name + ' label is toegevoegd');
        });
    });
});
