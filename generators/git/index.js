"use strict";

const Generator = require("yeoman-generator");

module.exports = class extends Generator {
	writing() {
		this.fs.copy(
			[this.templatePath("*.*"), this.templatePath(".*")],
			this.destinationPath()
		);
	}

	install() {
		this.spawnCommandSync("git init");
	}
};
