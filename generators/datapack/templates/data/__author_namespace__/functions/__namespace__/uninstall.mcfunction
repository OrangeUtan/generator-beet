# Uninstall datapack

# Remove scoreboard objectives
# scoreboard objectives remove  <%= datapackNamespace %>.cfg

# Revoke advancements
# advancement revoke @a from <%= authorNamespace %>:<%= datapackNamespace %>.root

# Goodbye message
tellraw @a[tag=!global.ignore,tag=!global.ignore.gui] ["",{"text":"Uninstalling ","color":"gold"},{"text":"<%= name %> ","color":"red"}, {"text": "v", "color": "red"}, {"storage": "<%= authorNamespace %>.<%= datapackNamespace %>", "nbt": "version", "color":"red"}]

# Remove storage
data remove storage minecraft:<%= authorNamespace %> <%= datapackNamespace %>