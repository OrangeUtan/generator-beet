"use strict";

const { default: chalk } = require("chalk");
const Generator = require("yeoman-generator");

const defaultPackFormat = 7;

module.exports = class extends Generator {
    async prompting() {
        // General prompts
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname
            },
            {
                type: "input",
                name: "description",
                message: "Description"
            },
            {
                type: "input",
                name: "author",
                message: "Your name",
                default: this.user.git.name()
            },
            {
                type: "input",
                name: "email",
                message: "Your email (optional)",
                default: this.user.git.email()
            },
            {
                type: "confirm",
                name: "generateResourcepack",
                message: "Generate resourcepack?",
                default: true
            }
        ]);
        this.answers.version = "0.0.0";

        await this._promptGenerateDatapack(
            this.answers.name,
            this.answers.version,
            this.answers.description,
            this.answers.author
        );

        if (this.answers.generateResourcepack || this.answers.generateDatapack) {
            const { packFormat } = await this.prompt([
                {
                    type: "input",
                    name: "packFormat",
                    message: "Pack format",
                    default: defaultPackFormat
                }
            ]);
            this.answers.packFormat = packFormat;
        }

        // License prompts
        this.composeWith(require.resolve("generator-license"), {
            name: this.answers.author,
            email: this.answers.email,
            defaultLicense: "MIT"
        });

        await this._promptGeneratePoetryProject(
            this.answers.name,
            this.answers.version,
            this.answers.description,
            this.answers.author
        );
    }

    async _promptGeneratePoetryProject(name, version, description, author) {
        this.composeWith(require.resolve("../poetry/index"), {
            name,
            version,
            description,
            author
        });
    }

    async _promptGenerateDatapack(name, version, description, author) {
        const { generateDatapack } = await this.prompt([
            {
                type: "confirm",
                name: "generateDatapack",
                message: "Generate datapack?",
                default: true
            }
        ]);
        this.answers.generateDatapack = generateDatapack;

        if (this.answers.generateDatapack) {
            this.composeWith(
                require.resolve("../datapack/index"),
                {
                    name,
                    version,
                    description,
                    author
                },
                true
            );
        }
    }

    writing() {
        this.fs.copyTpl(
            [this.templatePath("*.*"), this.templatePath(".*")],
            this.destinationPath(),
            {
                ...this.answers
            }
        );

        // Generate resourepack
        if (this.answers.generateResourcepack) {
            this.fs.copy(
                this.templatePath("resourcepack"),
                this.destinationPath("resourcepack")
            );
            this.fs.copy(
                this.templatePath("resourcepack/**/.*"),
                this.destinationPath("resourcepack")
            );
        }
    }

    install() {
        this.log(chalk.green("Initializing git repository"));
        this.spawnCommandSync("git init");
    }

    end() {
        this.fs.delete(this.destinationPath("**/__empty_dir_placeholder__"));
    }
};
