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

        await this._promptGenerateDatapack();

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
            "0.0.0",
            this.answers.description,
            this.answers.author
        );
    }

    async _promptGenerateDatapack() {
        this.answers.generateDatapack = await this.prompt([
            {
                type: "confirm",
                name: "generateDatapack",
                message: "Generate datapack?",
                default: true
            }
        ]);
        if (this.answers.generateDatapack) {
            const { rootNamespace, datapackNamespace } = await this.prompt([
                {
                    type: "input",
                    name: "rootNamespace",
                    message: "Root namespace of the datapack",
                    default: this.answers.author.toLowerCase()
                },
                {
                    type: "input",
                    name: "datapackNamespace",
                    message: "Sub-Namespace of the datapack",
                    default: this.answers.name.toLowerCase()
                }
            ]);
            this.answers.rootNamespace = rootNamespace;
            this.answers.datapackNamespace = datapackNamespace;

            this.log(
                chalk.green(
                    `Creating datapack with namespace: '${rootNamespace}:${datapackNamespace}'`
                )
            );
        }
    }

    async _promptGeneratePoetryProject(name, version, description, author) {
        this.composeWith(require.resolve("../poetry/index"), {
            name,
            version,
            description,
            author
        });
    }

    writing() {
        // Create beet configuration file
        this.fs.copyTpl(this.templatePath("beet.json"), this.destinationPath("beet.json"), {
            ...this.answers
        });

        // Create beet release configuration file
        this.fs.copyTpl(
            this.templatePath("beet-release.json"),
            this.destinationPath("beet-release.json"),
            { ...this.answers }
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

        // Generate datapack
        if (this.answers.generateDatapack) {
            // Copy function tags
            this.fs.copyTpl(
                this.templatePath("datapack/data/minecraft"),
                this.destinationPath("datapack/data/minecraft"),
                { ...this.answers }
            );

            // Copy functions templates
            this.fs.copyTpl(
                this.templatePath(
                    "datapack/data/__root_namespace__/functions/__sub_namespace__"
                ),
                this.destinationPath(
                    `datapack/data/${this.answers.rootNamespace}/functions/${this.answers.datapackNamespace}`
                ),
                { ...this.answers }
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
