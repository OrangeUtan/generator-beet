"use strict";

const Generator = require("yeoman-generator");

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.argument("name", {
            type: String,
            required: false
        });

        this.option("datapack", {
            type: Boolean,
            require: false,
            description: "Generate datapack boilerplate"
        });

        this.option("resourcepack", {
            type: Boolean,
            require: false,
            description: "Generate resourcepack boilerplate"
        });

        this.option("license", {
            type: Boolean,
            require: false,
            description: "Include a license"
        });

        this.option("git", {
            type: Boolean,
            require: false,
            description: "Initialize git repository"
        });

        this.option("python", {
            type: Boolean,
            require: false,
            description: "Create a Python project"
        });

        this.props = {
            name: this.options.name,
            datapack: this.options.datapack,
            resourcepack: this.options.resourcepack,
            license: this.options.license,
            git: this.options.git,
            python: this.options.python
        };
    }

    async prompting() {
        await this._promptArgs();

        this.props.githubUsername = await this._fetchGithubUsername();
        this.props.packFormat = 7;
        await this._promptAndUpdateProps([
            {
                type: "input",
                name: "description",
                message: "Description"
            },
            {
                type: "input",
                name: "version",
                message: "Version",
                default: "0.0.0"
            },
            {
                type: "input",
                name: "author",
                message: "Author",
                default: this.user.git.name()
            },
            {
                type: "input",
                name: "email",
                message: "Author Email",
                default: this.user.git.email()
            },
            {
                type: "input",
                name: "authorWebsite",
                message: "Author Website",
                default: this.props.githubUsername
                    ? `https://github.com/${this.props.githubUsername}`
                    : ""
            }
        ]);

        await this._promptOptions();
    }

    async _fetchGithubUsername() {
        try {
            return await this.user.github.username();
        } catch {
            return "";
        }
    }

    async _promptAndUpdateProps(prompts) {
        this.props = Object.assign({}, this.props, await this.prompt(prompts));
    }

    async _promptArgs() {
        await this._promptAndUpdateProps([
            {
                type: "input",
                name: "name",
                message: "Project name",
                default: this.appname,
                when: this.options.name === undefined,
                validate: (input, _) => (input === "" ? "Project name cannot be empty" : true)
            }
        ]);
    }

    async _promptOptions() {
        await this._promptAndUpdateProps([
            {
                type: "confirm",
                name: "datapack",
                message: "Generate datapack boilerplate?",
                default: true,
                when: this.options.datapack === undefined
            },
            {
                type: "confirm",
                name: "resourcepack",
                message: "Generate resourcepack boilerplate?",
                default: true,
                when: this.options.resourcepack === undefined
            },
            {
                type: "confirm",
                name: "license",
                message: "Include a license?",
                default: true,
                when: this.options.license === undefined
            },
            {
                type: "confirm",
                name: "git",
                message: "Initialize git repository?",
                default: true,
                when: this.options.git === undefined
            },
            {
                type: "confirm",
                name: "python",
                message: "Create a Python project? (recommended)",
                default: true,
                when: this.options.python === undefined
            }
        ]);
    }

    default() {
        if (this.props.datapack) {
            this.composeWith(require.resolve("../datapack/index"), { ...this.props });
        }

        if (this.props.resourcepack) {
            this.composeWith(require.resolve("../resourcepack/index"), { ...this.props });
        }

        if (this.props.license) {
            this.composeWith(require.resolve("generator-license"), {
                name: this.props.author,
                email: this.props.email,
                website: this.props.authorWebsite,
                defaultLicense: "MIT"
            });
        }

        if (this.props.git) {
            this.composeWith(require.resolve("../git/index"), { ...this.props });
        }

        if (this.props.python) {
            this.composeWith(require.resolve("../poetry/index"), { ...this.props });
        }
    }

    writing() {
        this.fs.copyTpl(this.templatePath(), this.destinationPath(), { ...this.props });
    }
};
