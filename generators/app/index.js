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
    this.fs.writeJSON(
      this.destinationPath("beet.json"),
      this._createBeetConfig()
    );

    this.fs.writeJSON(
      this.destinationPath("beet-release.json"),
      this._createBeetReleaseConfig()
    );
  }

  _createBeetConfig() {
    const config = {
      name: this.answers.name,
      author: this.answers.author,
      description: this.answers.description,
      output: "build"
    };

    // Add resourcepack
    if (this.answers.generateResourcepack) {
      config.resource_pack = {
        load: ["resourcepack"],
        pack_format: this.answers.packFormat
      };
    }

    // Add datapack
    if (this.answers.generateDatapack) {
      config.data_pack = {
        load: ["datapack"],
        pack_format: this.answers.packFormat
      };
    }

    return config;
  }

  _createBeetReleaseConfig() {
    const config = {
      extend: ["beet.json"],
      version: "0.0.0",
      pipeline: ["beet.contrib.minify_json"],
      output: "dist"
    };

    // Add resourcepack
    if (this.answers.generateResourcepack) {
      config.resource_pack = {
        zipped: true,
        name: `${this.answers.name}-resourcepack`
      };
    }

    // Add datapack
    if (this.answers.generateDatapack) {
      config.data_pack = {
        zipped: true,
        name: `${this.answers.name}-datapack`
      };
    }

    return config;
  }
};
