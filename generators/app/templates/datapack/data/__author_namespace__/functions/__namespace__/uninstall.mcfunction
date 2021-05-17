# Uninstall datapack

# Remove scoreboard objectives
# e.g. scoreboard objectives remove  <%= datapackNamespace %>.math

# Revoke advancements
# e.g. advancements revoke @a from <%= authorNamespace %>:<%= datapackNamespace %>.root

# Remove storage
data remove storage minecraft:<%= authorNamespace %> <%= datapackNamespace %>

# Goodbye message
tellraw @a[tag=!global.ignore,tag=!global.ignore.gui] ["",{"text":"Uninstalling ","color":"gold"},{"text":"<%= name %> ","color":"red"}, {"text": "v", "color": "red"}, {"storage": "<%= authorNamespace %>.<%= datapackNamespace %>", "nbt": "version", "color":"red"}]