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

    writing() {
        this.fs.copyTpl(this.templatePath(), this.destinationPath(), {
            ...this.options
        });
    }

    install() {
        this.log(chalk.green("Setting up poetry project"));
        this.spawnCommandSync("poetry install -n");
        this.spawnCommandSync("poetry run pre-commit install");
    }
};
