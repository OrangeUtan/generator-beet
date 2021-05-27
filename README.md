# generator-beet
[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

> [Yeoman](https://yeoman.io/) generator for [Beet](https://github.com/mcbeet/beet) projects

## Table of Contents
- [Features](#Features)
    - [Datapack boilerplate](#Datapack-boilerplate)
    - [Datapack Advancement](#Datapack-Advancement)
    - [Resourcepack boilerplate](#Resourcepack-boilerplate)
    - [Github Releases](#Github-Releases)
    - Generated Changelog
- [Getting started](#Getting-started)
    - [Install generator](#Install-generator)
    - [Install Poetry](#Install-Poetry)
    - [Generate a new beet project](#Generate-a-new-beet-project)
- [Available commands](#Available-commands)

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

### Datapack Advancement
Datapack advancements give users an overview of all their installed datapacks.

![](https://raw.githubusercontent.com/OrangeUtan/generator-beet/main/images/demo_datapack_advancement.gif)

```bash
datapack
└╴data
  ├╴global
  │ └╴advancements
  │   ├╴root.json              # 1. Root advancement
  │   └╴<authorNamespace>.json # 2. Author advancement
  └╴<authorNamspace>
    └╴advancements
      └╴<projectNamespace>
          └╴installed.json     # 3. Datapack advancement
```
([More on Datapack Advancements](https://mc-datapacks.github.io/en/conventions/datapack_advancement.html))

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

Generating Python projects requires [Poetry](https://python-poetry.org/docs/
#installation):
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

## License

MIT © [Oran9eUtan](https://github.com/OrangeUtan)


[npm-image]: https://badge.fury.io/js/generator-beet.svg
[npm-url]: https://npmjs.org/package/generator-beet
[daviddm-image]: https://david-dm.org/OrangeUtan/generator-beet.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/OrangeUtan/generator-beet
