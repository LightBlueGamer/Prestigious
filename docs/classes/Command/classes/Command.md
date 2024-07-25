[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [classes/Command](../README.md) / Command

# Class: Command

Represents a command for a Discord bot.

## Constructors

### new Command()

> **new Command**(`devMode`, `module`, `data`, `execute`): [`Command`](Command.md)

Constructs a new Command instance.

#### Parameters

• **devMode**: `boolean`

Indicates whether the command is in development mode.

• **module**: [`Modules`](../../../enums/Modules/enumerations/Modules.md)

The module the command belongs to.

• **data**: `SlashCommandBuilder`

The data for the command, including its name, description, options, etc.

• **execute**

The function to execute when the command is invoked.

#### Returns

[`Command`](Command.md)

#### Defined in

[classes/Command.ts:38](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Command.ts#L38)

## Properties

### data

> **data**: `SlashCommandBuilder`

The data for the command, including its name, description, options, etc.

#### Defined in

[classes/Command.ts:24](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Command.ts#L24)

***

### devMode

> **devMode**: `boolean`

Indicates whether the command is in development mode.

#### Defined in

[classes/Command.ts:14](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Command.ts#L14)

***

### execute

> **execute**: `Function`

The function to execute when the command is invoked.

#### Defined in

[classes/Command.ts:29](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Command.ts#L29)

***

### module

> **module**: [`Modules`](../../../enums/Modules/enumerations/Modules.md)

The module the command belongs to.

#### Defined in

[classes/Command.ts:19](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Command.ts#L19)
