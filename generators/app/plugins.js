class PluginInfo {
	constructor(name, pipeline_id, config_section = null) {
		this.name = name;
		this.id = pipeline_id;
		this.config_section = config_section;
	}
}

class ContribPluginInfo extends PluginInfo {
	constructor(name, configurable = false) {
		super(name, `beet.contrib.${name}`, configurable ? name : null);
	}
}

const BEET_PLUGINS = Object.fromEntries(
	[
		new ContribPluginInfo("installation_advancement", true),
		new ContribPluginInfo("yellow_shulker_box", true),
		new ContribPluginInfo("babelbox", true),
		new ContribPluginInfo("dundervar"),
		new ContribPluginInfo("format_json", true),
		new ContribPluginInfo("function_header", true),
		new ContribPluginInfo("hangman", true),
		new ContribPluginInfo("inline_function"),
		new ContribPluginInfo("inline_function_tag"),
		new ContribPluginInfo("lantern_load"),
		new ContribPluginInfo("load_yaml", true),
		new ContribPluginInfo("minify_function"),
		new ContribPluginInfo("minify_json"),
		new ContribPluginInfo("relative_function_path"),
		new ContribPluginInfo("scoreboard", true),
		new ContribPluginInfo("render", true),
		new ContribPluginInfo("sandstone", true),
		new ContribPluginInfo("template_context"),
		new ContribPluginInfo("template_sandbox")
	].map(p => [p.id, p])
);

async function promptPlugins(generator) {
	let choices = [];
	for (let plugin of Object.values(BEET_PLUGINS)) {
		choices.push({
			name: plugin.name,
			value: plugin.id
		});
	}

	let answers = await generator.prompt([
		{
			type: "checkbox",
			name: "selectedPluginIds",
			message: "Choose which plugins to include",
			choices
		}
	]);

	generator.options.selectedPluginIds = new Set(answers.selectedPluginIds);
	generator.options.configMeta = {};
	for (let id of generator.options.selectedPluginIds) {
		let plugin = BEET_PLUGINS[id];
		if (plugin.config_section) {
			generator.options.configMeta[plugin.config_section] = {};
		}
	}
}

module.exports = promptPlugins;
