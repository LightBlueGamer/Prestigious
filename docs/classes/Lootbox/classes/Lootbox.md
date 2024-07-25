[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [classes/Lootbox](../README.md) / Lootbox

# Class: Lootbox

## Constructors

### new Lootbox()

> **new Lootbox**(`name`, `type`, `rarity`, `loot`): [`Lootbox`](Lootbox.md)

#### Parameters

• **name**: `string`

• **type**: [`Standard`](../namespaces/Lootbox/enumerations/Type.md#standard)

• **rarity**: [`Rarity`](../namespaces/Lootbox/enumerations/Rarity.md)

• **loot**: [`Item`](../../Item/classes/Item.md)[]

#### Returns

[`Lootbox`](Lootbox.md)

#### Defined in

[classes/Lootbox.ts:9](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Lootbox.ts#L9)

## Properties

### loot

> **loot**: [`Item`](../../Item/classes/Item.md)[]

#### Defined in

[classes/Lootbox.ts:8](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Lootbox.ts#L8)

***

### name

> **name**: `string`

#### Defined in

[classes/Lootbox.ts:5](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Lootbox.ts#L5)

***

### rarity

> **rarity**: [`Rarity`](../namespaces/Lootbox/enumerations/Rarity.md)

#### Defined in

[classes/Lootbox.ts:7](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Lootbox.ts#L7)

***

### type

> **type**: [`Standard`](../namespaces/Lootbox/enumerations/Type.md#standard)

#### Defined in

[classes/Lootbox.ts:6](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Lootbox.ts#L6)

## Methods

### open()

> **open**(): [`Item`](../../Item/classes/Item.md)

Opens the lootbox and returns a random item based on the item weights.

#### Returns

[`Item`](../../Item/classes/Item.md)

- The randomly selected item from the lootbox.

#### Defined in

[classes/Lootbox.ts:26](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Lootbox.ts#L26)
