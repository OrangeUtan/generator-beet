"use strict";

const BaseGenerator = require("../generator-base");
const utils = require("../utils");
const promptPlugins = require("./plugins");

const BEET_CONFIG_PATH = "beet.json";

module.exports = class extends BaseGenerator {
	constructor(args, options) {
		super(args, options);

		this.option("name", {
			type: String,
			required: true
		});

		this.option("datapack", {
			type: Boolean,
			require: false,
			description: "Generate datapack"
		});

		this.option("resourcepack", {
			type: Boolean,
			require: false,
			description: "Generate resourcepack"
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
	}

	async prompting() {
		await this._promptProjectInfo();
		await promptPlugins(this);
		await this._promptSubGenerators();
	}

	async _promptProjectInfo() {
		await this.promptAndUpdateOptions([
			{
				type: "input",
				name: "name",
				message: "Project name",
				default: this.appname,
				when: this.options.name === undefined,
				validate: (input, _) => (input === "" ? "Project name cannot be empty" : true)
			},
			{
				type: "input",
				name: "description",
				message: "Description",
				when: this.options.description === undefined
			},
			{
				type: "input",
				name: "version",
				message: "Version",
				default: "0.0.0",
				when: this.options.version === undefined
			},
			{
				type: "input",
				name: "author",
				message: "Author",
				default: this.user.git.name(),
				when: this.options.author === undefined
			},
			{
				type: "input",
				name: "email",
				message: "Author Email",
				default: this.user.git.email()
			}
		]);
	}

	async _promptSubGenerators() {
		await this.promptAndUpdateOptions([
			{
				type: "confirm",
				name: "datapack",
				message: "Generate datapack?",
				default: true,
				when: this.options.datapack === undefined
			},
			{
				type: "confirm",
				name: "resourcepack",
				message: "Generate resourcepack?",
				default: true,
				when: this.options.resourcepack === undefined
			},
			{
				type: "confirm",
				name: "license",
				message: "Include a license?",
				default: true,
				when: this.options.license === undefined
			}
		]);

		await this.promptAndUpdateOptions([
			{
				type: "input",
				name: "authorWebsite",
				message: "Author Website",
				default: this.options.githubUsername
					? `https://github.com/${this.options.githubUsername}`
					: "",
				when: this.options.license
			},
			{
				type: "confirm",
				name: "git",
				message: "Initialize git repository?",
				default: !this.isGitDir("."),
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
		if (this.options.datapack) {
			this.composeWith(require.resolve("../datapack/index"), { ...this.options });
		}

		if (this.options.resourcepack) {
			this.composeWith(require.resolve("../resourcepack/index"), { ...this.options });
		}

		if (this.options.license) {
			this.composeWith(require.resolve("generator-license"), {
				name: this.options.author,
				email: this.options.email,
				website: this.options.authorWebsite,
				defaultLicense: "MIT"
			});
		}

		if (this.options.git) {
			this.composeWith(require.resolve("../git/index"), { ...this.options });
		}

		if (this.options.python) {
			this.composeWith(require.resolve("../poetry/index"), { ...this.options });
		}
	}

	configuring() {
		this.fs.copyTpl(this.templatePath(), this.destinationPath(), { ...this.options });
	}
};
