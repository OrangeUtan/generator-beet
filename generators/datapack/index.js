"use strict";
const { default: chalk } = require("chalk");
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option("name", {
            type: String,
            description: "Project name",
            require: true
        });

        this.option("version", {
            type: String,
            description: "Version",
            default: "0.0.0",
            require: true
        });

        this.option("description", {
            type: String,
            description: "Description",
            require: true
        });

        this.option("author", {
            type: String,
            description: "Author",
            require: true
        });
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "authorNamespace",
                message: "Root namespace for all of your datapacks",
                default: this.options.author.toLowerCase()
            },
            {
                type: "input",
                name: "datapackNamespace",
                message: "Namespace of the datapack",
                default: this.options.name.toLowerCase()
            }
        ]);

        this.log(
            chalk.green(
                `Creating datapack with namespace: '${this.answers.authorNamespace}:${this.answers.datapackNamespace}'`
            )
        );
    }

    writing() {
        // Copy minecraft namespace
        this.fs.copyTpl(
            this.templatePath("data/minecraft"),
            this.destinationPath("datapack/data/minecraft"),
            { ...this.answers, ...this.options }
        );

        // Copy global namespace
        this.fs.copyTpl(
            this.templatePath("data/global/advancements/root.json"),
            this.destinationPath("datapack/data/global/advancements/root.json"),
            { ...this.answers, ...this.options }
        );
        this.fs.copyTpl(
            this.templatePath("data/global/advancements/__author_namespace__.json"),
            this.destinationPath(
                `datapack/data/global/advancements/${this.answers.authorNamespace}.json`
            ),
            { ...this.answers, ...this.options }
        );

        // Copy __author_namespace__ namespace
        this.fs.copyTpl(
            this.templatePath("data/__author_namespace__/functions/__namespace__"),
            this.destinationPath(
                `datapack/data/${this.answers.authorNamespace}/functions/${this.answers.datapackNamespace}`
            ),
            { ...this.answers, ...this.options }
        );
        this.fs.copyTpl(
            this.templatePath("data/__author_namespace__/advancements/__namespace__"),
            this.destinationPath(
                `datapack/data/${this.answers.authorNamespace}/advancements/${this.answers.datapackNamespace}`
            ),
            { ...this.answers, ...this.options }
        );
    }
};
