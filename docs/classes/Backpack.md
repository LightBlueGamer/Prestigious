[**prestigious**](../README.md) • **Docs**

***

[prestigious](../README.md) / classes/Backpack

# classes/Backpack

## Classes

### Backpack

Represents a backpack with a name, size, slots, and contents.

#### Constructors

##### new Backpack()

> **new Backpack**(`name`, `size`, `slots`, `contents`): [`Backpack`](Backpack.md#backpack)

Constructs a new instance of the Backpack class.

###### Parameters

• **name**: `string`

The name of the backpack.

• **size**: `number`

The total size of the backpack.

• **slots**: `number`

The number of slots available in the backpack.

• **contents**: [`BackpackItem`](BackpackItem.md#backpackitem)[]

The items currently in the backpack.

###### Returns

[`Backpack`](Backpack.md#backpack)

###### Defined in

[classes/Backpack.ts:35](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L35)

#### Properties

##### contents

> **contents**: [`BackpackItem`](BackpackItem.md#backpackitem)[]

The items currently in the backpack.

###### Defined in

[classes/Backpack.ts:26](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L26)

##### name

> **name**: `string`

The name of the backpack.

###### Defined in

[classes/Backpack.ts:11](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L11)

##### size

> **size**: `number`

The total size of the backpack.

###### Defined in

[classes/Backpack.ts:16](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L16)

##### slots

> **slots**: `number`

The number of slots available in the backpack.

###### Defined in

[classes/Backpack.ts:21](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L21)

#### Methods

##### addItem()

> **addItem**(`item`, `amount`): [`Backpack`](Backpack.md#backpack)

Adds an item to the backpack.
If the item already exists in the backpack, the amount is increased.

###### Parameters

• **item**: [`Item`](Item.md#item)

The item to add.

• **amount**: `number`

The quantity of the item to add.

###### Returns

[`Backpack`](Backpack.md#backpack)

The updated backpack instance.

###### Defined in

[classes/Backpack.ts:76](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L76)

##### getContents()

> **getContents**(): [`BackpackItem`](BackpackItem.md#backpackitem)[]

Retrieves the contents of the backpack.

###### Returns

[`BackpackItem`](BackpackItem.md#backpackitem)[]

The items currently in the backpack.

###### Defined in

[classes/Backpack.ts:51](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L51)

##### getFreeSpace()

> **getFreeSpace**(): `number`

Calculates the remaining free space in the backpack.

###### Returns

`number`

The number of free slots in the backpack.

###### Defined in

[classes/Backpack.ts:59](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/classes/Backpack.ts#L59)
