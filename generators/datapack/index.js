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

		this.option("description", {
			type: String,
			description: "Description",
			require: true
		});

		this.option("version", {
			type: String,
			description: "Version",
			default: "0.0.0",
			require: true
		});

		this.option("author", {
			type: String,
			description: "Author",
			require: true
		});

		this.props = {
			name: this.options.name,
			description: this.options.description,
			version: this.options.version,
			author: this.options.author
		};
	}

	async prompting() {
		await this._promptOptions();

		let defaultNamespace = "";
		if (this.props.author && this.props.name) {
			defaultNamespace = `${this.props.author
				.toLowerCase()
				.replaceAll(" ", "-")}:${this.props.name.toLowerCase().replaceAll(" ", "-")}`;
		}

		await this._promptAndUpdateProps([
			{
				type: "input",
				name: "namespace",
				message: "Namespace of the datapack",
				default: defaultNamespace,
				validate: ns => this._validateNamespace(ns)
			},
			{
				type: "confirm",
				name: "datapackAdvancement",
				message: "Include datapack advancement?",
				default: true
			}
		]);

		[
			this.props.authorNamespace,
			this.props.datapackNamespace
		] = this.props.namespace.split(":");
	}

	async _promptAndUpdateProps(prompts) {
		this.props = Object.assign({}, this.props, await this.prompt(prompts));
	}

	async _promptOptions() {
		await this._promptAndUpdateProps([
			{
				type: "input",
				name: "name",
				message: "Project name",
				default: this.appname,
				when: this.props.name === undefined
			},
			{
				type: "input",
				name: "description",
				message: "Description",
				when: this.props.description === undefined
			},
			{
				type: "input",
				name: "version",
				message: "Version",
				default: "0.0.0",
				when: this.props.version === undefined
			},
			{
				type: "input",
				name: "author",
				message: "Author",
				default: this.user.git.name(),
				when: this.props.author === undefined
			}
		]);
	}

	_validateNamespace(ns) {
		if (ns.split(":").length !== 2) {
			return "Namespace must be of form: <authorNamsespace>:<projectNamespace>";
		}

		if (ns.includes(" ")) {
			return "Namespace contains invalid characters";
		}

		return true;
	}

	writing() {
		if (this.props.datapackAdvancement) this._writeDatapackAdvancement();

		this._writeMinecraftFunctionTags();

		// Author namespace
		this.fs.copyTpl(
			this.templatePath("data/__author_namespace__/functions/__namespace__"),
			this.destinationPath(
				`datapack/data/${this.props.authorNamespace}/functions/${this.props.datapackNamespace}`
			),
			{ ...this.props }
		);
	}

	_writeMinecraftFunctionTags() {
		this.fs.copyTpl(
			[
				this.templatePath("data/minecraft/tags/functions/load.json"),
				this.templatePath("data/minecraft/tags/functions/tick.json")
			],
			this.destinationPath("datapack/data/minecraft/tags/functions"),
			{ ...this.props }
		);
	}

	_writeDatapackAdvancement() {
		// Root advancment
		this.fs.copyTpl(
			this.templatePath("data/global/advancements/root.json"),
			this.destinationPath("datapack/data/global/advancements/root.json"),
			{ ...this.props }
		);
		// Author namespace advancement
		this.fs.copyTpl(
			this.templatePath("data/global/advancements/__author_namespace__.json"),
			this.destinationPath(
				`datapack/data/global/advancements/${this.props.authorNamespace}.json`
			),
			{ ...this.props }
		);
		// Datapack namespace advancement
		this.fs.copyTpl(
			this.templatePath(
				"data/__author_namespace__/advancements/__namespace__/installed.json"
			),
			this.destinationPath(
				`datapack/data/${this.props.authorNamespace}/advancements/${this.props.datapackNamespace}/installed.json`
			),
			{ ...this.props }
		);
	}
};
