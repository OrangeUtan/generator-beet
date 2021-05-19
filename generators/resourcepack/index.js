"use strict";

const mkdirp = require("mkdirp");
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
	writing() {
		this.fs.copy(this.templatePath(), this.destinationPath("resourcepack"));
		this.fs.copy(this.templatePath("**/.*"), this.destinationPath("resourcepack"));

		mkdirp(this.destinationPath("resourcepack/assets/minecraft/models"));
		mkdirp(this.destinationPath("resourcepack/assets/minecraft/textures"));
	}
};
