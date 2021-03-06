# generator-beet
[![License]](https://opensource.org/licenses/MIT)
[![NPM version]][npm-url]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> [Yeoman](https://yeoman.io/) generator for [Beet](https://github.com/mcbeet/beet) projects

## Table of Contents
- [Getting started](#Getting-started)
    - [Install generator](#Install-generator)
    - [Install Poetry](#Install-Poetry)
    - [Generate a new beet project](#Generate-a-new-beet-project)
- [Features](#Features)
    - [Datapack boilerplate](#Datapack-boilerplate)
    - [Resourcepack boilerplate](#Resourcepack-boilerplate)
    - [Github Releases](#Github-Releases)
- [Available commands](#Available-commands)
- [Contributing](#Contributing)

## Getting started
### Install generator
Install [Yeoman](http://yeoman.io) and generator-beet using [npm](https://www.npmjs.com/) (assuming you have pre-installed [node.js](https://nodejs.org/))

```bash
npm install -g yo generator-beet
```

### Install Poetry
It's recommended to create a Python project:
- Ensures you have beet correctly installed
- Required for Github releases
- Easier beet plugin development

Generating Python projects requires [Poetry](https://python-poetry.org/docs/#installation):
<br>
OSX / Linux:
```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
```
Windows (Powershell):
```bash
(Invoke-WebRequest -Uri https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py -UseBasicParsing).Content | python -
```
([More on how to install Poetry](https://python-poetry.org/docs/#installation))

### Generate a new beet project
```bash
yo beet
```

## Features
### Datapack boilerplate
```bash
datapack
└╴data
  ├╴minecraft
  │ └╴tags
  │   └╴functions
  │     ├╴load.json # Registers 'load' function
  │     └╴tick.json # Registers 'tick' function
  └╴<authorNamspace>
    └╴functions
      └╴<projectNamespace>
        ├╴tick.mcfunction # Called once every tick
        └╴load.mcfunction # Called after datapack is (re)loaded
```
To prevent naming conflicts between datapacks, all your functions, advancements, etc are located in the unique namespace `<authorNamespace>:<projectNamespace>`.<br>
E.g. if the author is `Oran9eUtan` and the project name is `Teleporter`, the `load` function can be called like this: `function oran9eutan:teleporter/load`

### Resourcepack boilerplate
```bash
resourcepack
├╴assets
│ ├╴.mcassetsroot
│ └╴minecraft
│   ├╴models
│   └╴textures
└╴pack.png
```

### Github Releases
![](https://raw.githubusercontent.com/OrangeUtan/generator-beet/main/images/github_release.png)

Automatically generates releases of your data-/resourcepacks on Github.

```bash
.github
└╴workflows
  └╴release.yml
```

How to create a new release:
1. Push/Pull-Request to the <b>release branch</b> on Github
2. The <b>release action</b> gets automatically triggered
3. [semantic-release](https://python-semantic-release.readthedocs.io/en/latest/) analyses commits to determin if a new version is required
4.  [semantic-release](https://python-semantic-release.readthedocs.io/en/latest/) bumps version, updates CHANGELOG.md, runs `beet -c beet-release.json build` and creates a new Github release

([More on Github Actions](https://docs.github.com/en/actions))

## Available commands
```bash
# Generate new beet project
yo beet [project-name]
    --datapack       # Generate datapack
    --resourcepack   # Generate resourcepack
    --license        # Include a license
    --git            # Initialize git repository
    --python         # Create a Python project

# Only generate datapack
yo beet:datapack

# Only generate resourcepack
yo beet:resourcepack
```

## Contributing

### Generator structure
A yeoman generator consists out of multiple sub-generators composed together. Each of them has their own directory in `generators`, the default beeing `generators/app`.
Each sub-generator can be run like so: `yo beet:<sub-generator>`.

```shell
# Directory structure:
generators/
├─app
├─datapack
├─git
├─poetry
└─resourcepack
```

### Test the generator
To try out the generator during development, run this command from the root of the project.
It installs your local files as a symlinked global module.
```shell
npm link
```
To remove it run this command from the root directory of the project.
```
npm unlink generator-beet
```

## License

MIT © [Oran9eUtan](https://github.com/OrangeUtan)

[License]: https://img.shields.io/badge/License-MIT-blue.svg
[npm-url]: https://npmjs.org/package/generator-beet
[NPM version]: https://img.shields.io/npm/v/generator-beet.svg