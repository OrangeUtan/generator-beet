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
        this.log(chalk.white("Creating Lincense"));
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

    async _promptGenerateDatapack() {
        const { generateDatapack } = await this.prompt([
            {
                type: "confirm",
                name: "generateDatapack",
                message: "Generate datapack?",
                default: true
            }
        ]);
        this.answers.generateDatapack = generateDatapack;
        if (generateDatapack) {
            const { authorNamespace, datapackNamespace } = await this.prompt([
                {
                    type: "input",
                    name: "authorNamespace",
                    message: "Root namespace for all of your datapacks",
                    default: this.answers.author.toLowerCase()
                },
                {
                    type: "input",
                    name: "datapackNamespace",
                    message: "Namespace of the datapack",
                    default: this.answers.name.toLowerCase()
                }
            ]);
            this.answers.authorNamespace = authorNamespace;
            this.answers.datapackNamespace = datapackNamespace;

            this.log(
                chalk.green(
                    `Creating datapack with namespace: '${authorNamespace}:${datapackNamespace}'`
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

        // Generate datapack
        if (this.answers.generateDatapack) {
            this._writeDatapack();
        }
    }

    _writeDatapack() {
        // Copy minecraft namespace
        this.fs.copyTpl(
            this.templatePath("datapack/data/minecraft"),
            this.destinationPath("datapack/data/minecraft"),
            { ...this.answers }
        );

        // Copy global namespace
        this.fs.copyTpl(
            this.templatePath("datapack/data/global/advancements/root.json"),
            this.destinationPath("datapack/data/global/advancements/root.json"),
            { ...this.answers }
        );
        this.fs.copyTpl(
            this.templatePath("datapack/data/global/advancements/__author_namespace__.json"),
            this.destinationPath(
                `datapack/data/global/advancements/${this.answers.authorNamespace}.json`
            ),
            { ...this.answers }
        );

        // Copy __author_namespace__ namespace
        this.fs.copyTpl(
            this.templatePath("datapack/data/__author_namespace__/functions/__namespace__"),
            this.destinationPath(
                `datapack/data/${this.answers.authorNamespace}/functions/${this.answers.datapackNamespace}`
            ),
            { ...this.answers }
        );
        this.fs.copyTpl(
            this.templatePath("datapack/data/__author_namespace__/advancements/__namespace__"),
            this.destinationPath(
                `datapack/data/${this.answers.authorNamespace}/advancements/${this.answers.datapackNamespace}`
            ),
            { ...this.answers }
        );
    }

    install() {
        this.log(chalk.green("Initializing git repository"));
        this.spawnCommandSync("git init");
    }

    end() {
        this.fs.delete(this.destinationPath("**/__empty_dir_placeholder__"));
    }
};
