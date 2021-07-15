const Generator = require("yeoman-generator");

module.exports = class BaseGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}

	async promptAndUpdateOptions(prompts) {
		this.options = Object.assign({}, this.options, await this.prompt(prompts));
	}
};
