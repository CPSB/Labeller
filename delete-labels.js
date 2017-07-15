#!/usr/bin/env node

// Dependencies
var GithubApi      = require('github');
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

// Start the execution of the prompt package in the terminal.
prompt.start();

// Start Questioning in the prompt.
prompt.get(schema, function (err, input) {
    var User  = input.Owner.trim();
    var Repo  = input.Repository.trim();
    var Token = input.Token.trim();

    /**
     * Connection to the github API. 
     */
    var github = new GithubApi({
        debug: false,
        protocol: 'https', 
        host: 'api.github.com', 
        // pathPrefix: '/api/v3' // for some GHE's; none for Github. 
        headers : { "user-agent": 'ActivismeBE-Github-Labeller' }, 
        Promise: require('bluebird'), 
        followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
        timeout: 5000
    });

    github.authenticate({type: "token", token: Token});

    github.issues.getLabels({
        owner : User, 
        repo  : Repo, 
    }, function (err, res) {
        if (err) return log(error(err));
        
        var labelNames = res.data; 

        labelNames.forEach(function(label) {
            github.issues.deleteLabel({
                owner : User, 
                repo  : Repo, 
                name  : label.name
            }, function (err, res) {
                if (err) return log(error(err));
                log(success('[SUCCESS]: ' + User + '/' + Repo + ' ') + label.name + ' label is verwijderd');
            });
        });
    });
});