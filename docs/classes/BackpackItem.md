[**prestigious**](../README.md) • **Docs**

***

[prestigious](../README.md) / classes/BackpackItem

# classes/BackpackItem

## Classes

### BackpackItem

Represents an item that can be stored in a backpack.
Extends the base `Item` class with an additional `amount` property.

#### Extends

- [`Item`](Item.md#item)

#### Constructors

##### new BackpackItem()

> **new BackpackItem**(`name`, `size`, `value`, `weight`, `buy`, `sell`, `canScavenge`, `inLootbox`, `amount`): [`BackpackItem`](BackpackItem.md#backpackitem)

Constructs a new instance of `BackpackItem`.

###### Parameters

• **name**: `string`

The name of the item.

• **size**: `number`

The size of the item in backpack slots.

• **value**: `number`

The value of the item in currency.

• **weight**: `number`

The weight of the item in kilograms.

• **buy**: `boolean`

Indicates whether the item can be bought from vendors.

• **sell**: `boolean`

Indicates whether the item can be sold to vendors.

• **canScavenge**: `boolean`

Indicates whether the item can be found in scavenger hunts.

• **inLootbox**: `boolean`

Indicates whether the item can be found in lootboxes.

• **amount**: `number`

The amount of this item in the backpack.

###### Returns

[`BackpackItem`](BackpackItem.md#backpackitem)

###### Overrides

[`Item`](Item.md#item).[`constructor`](Item.md#constructors)

###### Defined in

[classes/BackpackItem.ts:24](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/BackpackItem.ts#L24)

#### Properties

##### amount

> **amount**: `number`

The amount of this item in the backpack.

###### Defined in

[classes/BackpackItem.ts:9](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/BackpackItem.ts#L9)

##### buy

> **buy**: `boolean`

###### Inherited from

[`Item`](Item.md#item).[`buy`](Item.md#buy)

###### Defined in

[classes/Item.ts:19](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L19)

##### canScavenge

> **canScavenge**: `boolean`

###### Inherited from

[`Item`](Item.md#item).[`canScavenge`](Item.md#canscavenge)

###### Defined in

[classes/Item.ts:21](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L21)

##### inLootbox

> **inLootbox**: `boolean`

###### Inherited from

[`Item`](Item.md#item).[`inLootbox`](Item.md#inlootbox)

###### Defined in

[classes/Item.ts:22](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L22)

##### name

> **name**: `string`

###### Inherited from

[`Item`](Item.md#item).[`name`](Item.md#name)

###### Defined in

[classes/Item.ts:15](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L15)

##### sell

> **sell**: `boolean`

###### Inherited from

[`Item`](Item.md#item).[`sell`](Item.md#sell)

###### Defined in

[classes/Item.ts:20](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L20)

##### size

> **size**: `number`

###### Inherited from

[`Item`](Item.md#item).[`size`](Item.md#size)

###### Defined in

[classes/Item.ts:16](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L16)

##### value

> **value**: `number`

###### Inherited from

[`Item`](Item.md#item).[`value`](Item.md#value)

###### Defined in

[classes/Item.ts:17](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L17)

##### weight

> **weight**: `number`

###### Inherited from

[`Item`](Item.md#item).[`weight`](Item.md#weight)

###### Defined in

[classes/Item.ts:18](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Item.ts#L18)
