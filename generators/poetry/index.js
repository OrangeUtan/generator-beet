"use strict";
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

		this.option("githubReleases", {
			type: String,
			description: "Author",
			require: true
		});

		this.props = {
			name: this.options.name,
			version: this.options.version,
			description: this.options.description,
			author: this.options.author,
			git: this.options.git
		};

		if (!this.props.git) {
			this.props.githubReleases = false;
		}
	}

	async prompting() {
		await this._promptAndUpdateProps([
			{
				type: "confirm",
				name: "githubReleases",
				message: "Automatically create Github releases?",
				default: true,
				when: this.props.githubReleases === undefined
			}
		]);
	}

	async _promptAndUpdateProps(prompts) {
		this.props = Object.assign({}, this.props, await this.prompt(prompts));
	}

	writing() {
		this.fs.copyTpl(
			[
				this.templatePath("poetry.toml"),
				this.templatePath("pyproject.toml"),
				this.templatePath(".pre-commit-config.yaml")
			],
			this.destinationPath(),
			{ ...this.props }
		);

		if (this.props.githubReleases) {
			this.fs.copyTpl([this.templatePath(".github")], this.destinationPath(".github"), {
				...this.props
			});
		}
	}

	install() {
		this.spawnCommandSync("poetry install -n");
		if (this.props.git) {
			this.spawnCommandSync("poetry run pre-commit install");
		}
	}
};
