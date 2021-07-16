const Generator = require("yeoman-generator");
const path = require("path");

module.exports = class BaseGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}

	isGitDir(dir) {
		return fs.existsSync(path.join(dir, ".git"));
	}

	async promptAndUpdateOptions(prompts) {
		this.options = Object.assign({}, this.options, await this.prompt(prompts));
	}
};
