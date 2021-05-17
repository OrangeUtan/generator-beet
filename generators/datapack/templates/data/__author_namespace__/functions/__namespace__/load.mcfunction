# Executed once when Minecraft loads/reloads the datapack

# Install datapack if it is not already install
# execute unless data storage minecraft:<%= authorNamespace %>.<%= datapackNamespace %> {"version": "<%= version %>"} run function <%= authorNamespace %>:<%= datapackNamespace %>/install