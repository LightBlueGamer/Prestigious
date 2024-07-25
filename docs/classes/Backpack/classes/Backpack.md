[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [classes/Backpack](../README.md) / Backpack

# Class: Backpack

Represents a backpack with a name, size, slots, and contents.

## Constructors

### new Backpack()

> **new Backpack**(`name`, `size`, `slots`, `contents`): [`Backpack`](Backpack.md)

Constructs a new instance of the Backpack class.

#### Parameters

• **name**: `string`

The name of the backpack.

• **size**: `number`

The total size of the backpack.

• **slots**: `number`

The number of slots available in the backpack.

• **contents**: [`BackpackItem`](../../BackpackItem/classes/BackpackItem.md)[]

The items currently in the backpack.

#### Returns

[`Backpack`](Backpack.md)

#### Defined in

[classes/Backpack.ts:35](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L35)

## Properties

### contents

> **contents**: [`BackpackItem`](../../BackpackItem/classes/BackpackItem.md)[]

The items currently in the backpack.

#### Defined in

[classes/Backpack.ts:26](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L26)

***

### name

> **name**: `string`

The name of the backpack.

#### Defined in

[classes/Backpack.ts:11](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L11)

***

### size

> **size**: `number`

The total size of the backpack.

#### Defined in

[classes/Backpack.ts:16](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L16)

***

### slots

> **slots**: `number`

The number of slots available in the backpack.

#### Defined in

[classes/Backpack.ts:21](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L21)

## Methods

### addItem()

> **addItem**(`item`, `amount`): [`Backpack`](Backpack.md)

Adds an item to the backpack.
If the item already exists in the backpack, the amount is increased.

#### Parameters

• **item**: [`Item`](../../Item/classes/Item.md)

The item to add.

• **amount**: `number`

The quantity of the item to add.

#### Returns

[`Backpack`](Backpack.md)

The updated backpack instance.

#### Defined in

[classes/Backpack.ts:76](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L76)

***

### getContents()

> **getContents**(): [`BackpackItem`](../../BackpackItem/classes/BackpackItem.md)[]

Retrieves the contents of the backpack.

#### Returns

[`BackpackItem`](../../BackpackItem/classes/BackpackItem.md)[]

The items currently in the backpack.

#### Defined in

[classes/Backpack.ts:51](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L51)

***

### getFreeSpace()

> **getFreeSpace**(): `number`

Calculates the remaining free space in the backpack.

#### Returns

`number`

The number of free slots in the backpack.

#### Defined in

[classes/Backpack.ts:59](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Backpack.ts#L59)
