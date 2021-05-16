"use strict";

const Generator = require("yeoman-generator");

const defaultPackFormat = 7;

module.exports = class extends Generator {
  async prompting() {
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
      },
      {
        type: "confirm",
        name: "generateDatapack",
        message: "Generate datapack?",
        default: true
      }
    ]);

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

    this.composeWith(require.resolve("generator-license"), {
      name: this.answers.author,
      email: this.answers.email,
      defaultLicense: "MIT"
    });
  }

  writing() {
    // Create beet configuration file
    this.fs.copyTpl(
      this.templatePath("beet.json"),
      this.destinationPath("beet.json"),
      { ...this.answers }
    );

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
  }

  end() {
    this.fs.delete(this.destinationPath("**/__yeoman_placeholder__"));
  }
};
