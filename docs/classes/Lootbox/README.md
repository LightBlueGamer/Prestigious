[**prestigious**](../../README.md) • **Docs**

***

[prestigious](../../README.md) / classes/Lootbox

# classes/Lootbox

## Index

### Namespaces

- [Lootbox](namespaces/Lootbox.md)

## Classes

### Lootbox

#### Constructors

##### new Lootbox()

> **new Lootbox**(`name`, `type`, `rarity`, `loot`): [`Lootbox`](README.md#lootbox)

###### Parameters

• **name**: `string`

• **type**: [`Standard`](namespaces/Lootbox.md#standard)

• **rarity**: [`Rarity`](namespaces/Lootbox.md#rarity)

• **loot**: [`Item`](../Item.md#item)[]

###### Returns

[`Lootbox`](README.md#lootbox)

###### Defined in

[classes/Lootbox.ts:9](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Lootbox.ts#L9)

#### Properties

##### loot

> **loot**: [`Item`](../Item.md#item)[]

###### Defined in

[classes/Lootbox.ts:8](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Lootbox.ts#L8)

##### name

> **name**: `string`

###### Defined in

[classes/Lootbox.ts:5](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Lootbox.ts#L5)

##### rarity

> **rarity**: [`Rarity`](namespaces/Lootbox.md#rarity)

###### Defined in

[classes/Lootbox.ts:7](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Lootbox.ts#L7)

##### type

> **type**: [`Standard`](namespaces/Lootbox.md#standard)

###### Defined in

[classes/Lootbox.ts:6](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Lootbox.ts#L6)

#### Methods

##### open()

> **open**(): [`Item`](../Item.md#item)

Opens the lootbox and returns a random item based on the item weights.

###### Returns

[`Item`](../Item.md#item)

- The randomly selected item from the lootbox.

###### Defined in

[classes/Lootbox.ts:26](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Lootbox.ts#L26)
