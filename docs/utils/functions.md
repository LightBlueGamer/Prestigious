[**prestigious**](../README.md) • **Docs**

***

[prestigious](../README.md) / utils/functions

# utils/functions

## Functions

### generateData()

> **generateData**(): [`Data`](../classes/Player/namespaces/Player.md#data)

A function to generate the default player data.

#### Returns

[`Data`](../classes/Player/namespaces/Player.md#data)

- The default player data.

#### Example

```typescript
const playerData = generateData();
console.log(playerData); // { balance: 0, xp: 0, level: 1, prestige: 0, backpack: Pouch, lootboxes: [] };
```

#### Defined in

[utils/functions.ts:17](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L17)

***

### getEmoji()

> **getEmoji**(`name`): `string`

A function to get an emoji by its name.

#### Parameters

• **name**: `string`

The name of the emoji.

#### Returns

`string`

A string representation of the emoji in Discord format.
         If the emoji is not found, an empty string is returned.

#### Example

```typescript
const happyEmoji = getEmoji('smile');
console.log(happyEmoji); // <:smile:1234567890>
```

#### Remarks

The `emojis` array is assumed to be defined elsewhere in the codebase.
Each emoji object in the array should have properties `name` and `id`.

#### Defined in

[utils/functions.ts:58](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L58)

***

### getRandomHexColor()

> **getRandomHexColor**(): `string`

A function to generate a random hexadecimal color code.

#### Returns

`string`

- A random hexadecimal color code in the format '#RRGGBB'.

#### Example

```ts
const randomColor = getRandomHexColor();
console.log(randomColor); // "#FFA07A" or any other random color
```

#### Defined in

[utils/functions.ts:165](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L165)

***

### getRandomItemByWeight()

> **getRandomItemByWeight**(`items`): [`Item`](../classes/Item.md#item)

A function to get a random item from the item array based on their weights.

#### Parameters

• **items**: [`Item`](../classes/Item.md#item)[]

#### Returns

[`Item`](../classes/Item.md#item)

- A randomly selected item from the item array.

#### Remarks

The weight of each item determines its likelihood of being selected.
The total weight of all items is calculated, and a random number between 0 and the total weight is generated.
The function then iterates through the item array, subtracting the weight of each item from the random number.
When the random number becomes less than or equal to 0, the corresponding item is returned.
If something goes wrong and no item is selected, the last item in the array is returned.

#### Example

```ts
const randomItem = getRandomItemByWeight();
console.log(randomItem.name); // "Example Item"
```

#### Defined in

[utils/functions.ts:105](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L105)

***

### getRandomLootboxItemByWeight()

> **getRandomLootboxItemByWeight**(`items`): [`Item`](../classes/Item.md#item)

A function to get a random lootbox item from the lootbox item array based on their weights.
The weight of each item is multiplied by its bonus to determine its likelihood of being selected.

#### Parameters

• **items**: [`Item`](../classes/Item.md#item)[]

An array of lootbox items. Each item has an `item` property (of type `Item`) and a `bonus` property (number).

#### Returns

[`Item`](../classes/Item.md#item)

- A randomly selected lootbox item from the lootbox item array.

#### Remarks

The total weight of all items is calculated, and a random number between 0 and the total weight is generated.
The function then iterates through the lootbox item array, subtracting the weighted weight of each item from the random number.
When the random number becomes less than or equal to 0, the corresponding item is returned.
If something goes wrong and no item is selected, the last item in the array is returned.

#### Example

```ts
const lootboxItems: LootboxItem[] = [
  { item: { name: "Example Item 1", weight: 1 }, bonus: 2 },
  { item: { name: "Example Item 2", weight: 2 }, bonus: 1 },
];
const randomLootboxItem = getRandomLootboxItemByWeight(lootboxItems);
console.log(randomLootboxItem.item.name); // "Example Item 1" or "Example Item 2"
```

#### Defined in

[utils/functions.ts:141](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L141)

***

### numberToWord()

> **numberToWord**(`number`): `string`

Converts a number to its corresponding word representation.

#### Parameters

• **number**: `number`

The number to convert.

#### Returns

`string`

The word representation of the number.

#### Example

```ts
const word = numberToWord(5);
console.log(word); // "five"
```

#### Defined in

[utils/functions.ts:73](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L73)

***

### randomNumber()

> **randomNumber**(`min`, `max`): `number`

A function to generate a random number between min and max.

#### Parameters

• **min**: `number`

The minimum value.

• **max**: `number`

The maximum value.

#### Returns

`number`

A random number between min and max.

#### Defined in

[utils/functions.ts:37](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/utils/functions.ts#L37)
