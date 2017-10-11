# Skyrim Mod Dependencies

This project uses a web page containing an alpaca-generated form to work out Skyrim mod dependencies.

## How it Works

The principle of it is this: Based on what base game you have (standard, with/without expansion DLC or Special edition), what mods do you have installed? What mods depend on those and can thus be installed with reduced risk of crashes due to missing dependencies?

The form takes advantage of [Alpaca JS's](http://alpacajs.org/) ability to use [conditional dependencies](http://www.alpacajs.org/docs/api/conditional-dependencies.html) for fields, only showing one or more when certain values in other fields match.

_Note:_ Where applicable/possible, warnings about collisions will be shown as help information for a particular mod. This is meant as a guide only; no logic is built into the form to prevent you choosing conflicting/incompatible mods.

_Warning:_ There is **no guarantee** that installing/loading mods in the order suggested by filling in the form **will not** cause the game to become unstable, freeze or crash.
