import arg from 'arg';
import inquirer from 'inquirer'
import templateName from './templateName';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install'
        },
        {
            argv: rawArgs.slice(2)
        }
    )
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    }
}

async function promptForMissingOptions(options) {
    const defaultTemplate = "React";
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,

        }
    }

    const questions = [];
    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose your boilerplate',
            choices: [...templateName],
            default: defaultTemplate
        })
    }

    if (!options.git) {
        questions.push({
            type: "confirm",
            name: 'git',
            message: 'Initialize a git repository?',
            default: false,
        })
    }

    const answers = await inquirer.prompt(questions)
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args)
    options = await promptForMissingOptions(options)
    await createProject(options)
}