# Game Mod Dependencies

This project uses web pages utilising alpaca-generated forms to work out mod dependencies for Fallout 4, Elder Scrolls III, IV &amp; V.

## How it Works

The principle of it is this: Based on what base game you have (standard, with/without expansion DLC or Special edition), what mods do you have installed? What mods depend on those and can thus be installed with reduced risk of crashes due to missing dependencies?

The forms takes advantage of [Alpaca JS's](http://alpacajs.org/) ability to use [conditional dependencies](http://www.alpacajs.org/docs/api/conditional-dependencies.html) for fields, only showing one or more when certain values in other fields match.

### Llama: A Helper Library for Alpaca

Each form is built dynamicalls in JS, using a helper library built for that purpose and named "Llama". The intent is to make extending the forms easy, without writing a long JSON schema or setting up and fiddling with a boilerplate JS object for each form. Llama provides a skeleton schema object for a quick start, and various functions for rapidly building apon that.

## Disclaimer

Where applicable/possible, warnings about collisions will be shown as help information for a particular mod. It may be possible to ensure that selecting a mod hides incompatible mods, but this might not be the case. This is meant as a guide only; no logic is built into the form to prevent you choosing conflicting/incompatible mods.

There is **no guarantee** that installing/loading mods in the order suggested by filling in the form **will not** cause the game to become unstable, freeze or crash. **Proceed at your own risk.**

Please read the official documentation for any mod's requirements, known bugs and conflicts/incompatibilities _before_ installing it and modifying the load order. This project's mod entries are short at best and do not make provision for all eventualities; the documentation should be far more detailed.

If you encounter issues with a particular mod or set thereof, please contact the mod author/developer to resolve it; this project does not offer support for the mods listed.

Other than being a community member/regular account holder, I am _in no way_ associated with the moderators/administrators or mod creators for either Nexus or Lovers' Lab. **I take no responsibility for any content that you do or do not view on those sites, nor for any access to adult content on those sites by any person below the age of 18; that responsibility lies with you and/or your legal guardian.**

_Note:_ This project makes use of Twitter Bootstrap (v3.3.7) and ECMAScript (JavaScript) 6, often referred to as ES6. [^1] It might not function correctly on MS IE or Edge.

[^1]:  To avoid confusion, this project will use Roman numerals (such as VI) when referring to the Elder Scrolls games. `ES6` means "ECMAScript 6", while `ES VI` means "Elder Scrolls 6" (assuming it's ever released).
