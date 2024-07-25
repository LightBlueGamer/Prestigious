[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [classes/Player](../README.md) / Player

# Class: Player

The base Player class with the ID, Name and Data of the player.

## Example

```ts
const player = await Player.get(interaction.user.id, interaction.client);
 player
     .save();
```

## Param

The ID of the player

## Param

The Name of the player

## Param

The Data of the player

## Constructors

### new Player()

> **new Player**(`id`, `name`, `data`): [`Player`](Player.md)

#### Parameters

• **id**: `string`

• **name**: `string`

• **data**: [`Data`](../namespaces/Player/interfaces/Data.md) = `...`

#### Returns

[`Player`](Player.md)

#### Defined in

[classes/Player.ts:35](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L35)

## Properties

### data

> **data**: [`Data`](../namespaces/Player/interfaces/Data.md)

#### Defined in

[classes/Player.ts:34](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L34)

***

### id

> **id**: `string`

#### Defined in

[classes/Player.ts:32](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L32)

***

### name

> **name**: `string`

#### Defined in

[classes/Player.ts:33](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L33)

## Methods

### addItem()

> **addItem**(`item`, `amount`): [`Player`](Player.md)

Adds an item to the player's backpack.

#### Parameters

• **item**: [`Item`](../../Item/classes/Item.md)

The item to add to the backpack.

• **amount**: `number` = `1`

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
const sword = new Item('Sword', 100, 'A shiny sword.');
player.addItem(sword);
// The sword will be added to the player's backpack.
```

#### Defined in

[classes/Player.ts:296](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L296)

***

### addStatistic()

> **addStatistic**(`statName`, `amount`): [`Player`](Player.md)

Adds a statistic to the player's statistics list.
If the statistic already exists, the amount is incremented.
If the statistic does not exist, a new Statistic instance is created and added to the list.

#### Parameters

• **statName**: `string`

The name of the statistic to add.

• **amount**: `number` = `1`

The amount to increment the statistic's value by. Default is 1.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.addStatistic('kills', 5);
// The player's statistics list will contain a Statistic instance with the name 'kills' and the amount 5.
```

#### Defined in

[classes/Player.ts:414](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L414)

***

### canPrestige()

> **canPrestige**(): `boolean`

Checks if the player can prestige.
A player can prestige when they have reached a level of 20 or more.

#### Returns

`boolean`

`true` if the player can prestige, `false` otherwise.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.level = 20;
console.log(player.canPrestige()); // Output: true

player.data.level = 19;
console.log(player.canPrestige()); // Output: false
```

#### Defined in

[classes/Player.ts:438](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L438)

***

### decreaseAttribute()

> **decreaseAttribute**(`name`, `amount`): [`Player`](Player.md)

Decreases the value of the attribute with the specified name by the provided amount.
If the attribute is found, its value is updated and the updated Player instance is returned.
If the attribute is not found, the function does nothing and returns the original Player instance.

#### Parameters

• **name**: `string`

The name of the attribute to decrease.

• **amount**: `number`

The amount to decrease the attribute's value by.

#### Returns

[`Player`](Player.md)

The updated Player instance with the decreased attribute value.
         If the attribute is not found, the original Player instance is returned.

#### Defined in

[classes/Player.ts:517](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L517)

***

### generateBar()

> **generateBar**(): `string`

Generates a visual representation of the player's XP progression as a bar of emojis.
The bar consists of 10 segments, each representing 10% of the total XP required for the next level.
The bar is filled with different emojis based on the player's XP progression.

#### Returns

`string`

A string representing the XP bar with emojis.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.xp = 2351;
player.data.level = 1;
const xpBar = player.generateBar();
// xpBar === "<:full_left:1234567890> <:full_middle:1234567890> <:full_middle:1234567890> <:full_middle:1234567890> <:5_middle:1234567890> <:empty_middle:1234567890> <:empty_middle:1234567890> <:empty_middle:1234567890> <:empty_middle:1234567890> <:empty_right:1234567890>"
```

#### Defined in

[classes/Player.ts:182](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L182)

***

### getAttribute()

> **getAttribute**(`name`): [`Attribute`](../../Attribute/classes/Attribute.md)

Retrieves an attribute from the player's attributes list based on the provided name.
The search is case-insensitive and matches the beginning of the attribute's name.
If no attribute is found, it throws an error.

#### Parameters

• **name**: `string`

The name of the attribute to retrieve.

#### Returns

[`Attribute`](../../Attribute/classes/Attribute.md)

The attribute with the matching name.

#### Throws

Will throw an error if no attribute is found with the provided name.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.attributes = [
    new Attribute('Strength', 10),
    new Attribute('Dexterity', 8),
];
const strengthAttribute = player.getAttribute('Strength');
// strengthAttribute will be the Attribute instance with the name 'Strength'.
```

#### Defined in

[classes/Player.ts:483](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L483)

***

### getAttributes()

> **getAttributes**(): [`Attribute`](../../Attribute/classes/Attribute.md)[]

Retrieves the attributes of the player.

#### Returns

[`Attribute`](../../Attribute/classes/Attribute.md)[]

An array of Attribute objects representing the player's attributes.

#### Defined in

[classes/Player.ts:461](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L461)

***

### getBackpack()

> **getBackpack**(): [`Backpack`](../../Backpack/classes/Backpack.md)

Returns the current backpack of the player.

#### Returns

[`Backpack`](../../Backpack/classes/Backpack.md)

The current backpack of the player.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
const backpack = player.getBackpack();
// backpack === player.data.backpack
```

#### Defined in

[classes/Player.ts:266](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L266)

***

### getBackpackContents()

> **getBackpackContents**(): [`BackpackItem`](../../BackpackItem/classes/BackpackItem.md)[]

Retrieves the contents of the player's backpack.

#### Returns

[`BackpackItem`](../../BackpackItem/classes/BackpackItem.md)[]

An array of BackpackItem objects representing the contents of the player's backpack.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
const backpackContents = player.getBackpackContents();
// backpackContents will contain the items in the player's backpack.
```

#### Defined in

[classes/Player.ts:280](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L280)

***

### getBalance()

> **getBalance**(): `number`

Returns the current balance of the player.

#### Returns

`number`

The current balance of the player.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.balance = 500;
const balance = player.getBalance();
// balance === 500
```

#### Defined in

[classes/Player.ts:252](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L252)

***

### getLootboxes()

> **getLootboxes**(): [`Lootbox`](../../Lootbox/classes/Lootbox.md)[]

Retrieves the lootboxes of the player.

#### Returns

[`Lootbox`](../../Lootbox/classes/Lootbox.md)[]

An array of Lootbox objects representing the player's lootboxes.
If the player does not have any lootboxes, it will return `null`.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.lootboxes = [
    new Lootbox(Lootbox.Type.COMMON, [new Item('Common Item', 10, 'A common item.')]),
    new Lootbox(Lootbox.Type.RARE, [new Item('Rare Item', 100, 'A rare item.')]),
];
const lootboxes = player.getLootboxes();
// lootboxes will contain the player's lootboxes.
```

#### Defined in

[classes/Player.ts:347](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L347)

***

### increaseAttribute()

> **increaseAttribute**(`name`, `amount`): [`Player`](Player.md)

Increases the value of the attribute with the specified name by the provided amount.
If the attribute is found, its value is updated and the updated Player instance is returned.
If the attribute is not found, the function does nothing and returns the original Player instance.

#### Parameters

• **name**: `string`

The name of the attribute to increase.

• **amount**: `number`

The amount to increase the attribute's value by.

#### Returns

[`Player`](Player.md)

The updated Player instance with the increased attribute value.
         If the attribute is not found, the original Player instance is returned.

#### Defined in

[classes/Player.ts:500](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L500)

***

### increaseBalance()

> **increaseBalance**(`minAmount`, `maxAmount`): [`Player`](Player.md)

Increases the player's balance by a random amount between the given minimum and maximum amounts.

#### Parameters

• **minAmount**: `number`

The minimum amount of balance to increase.

• **maxAmount**: `number`

The maximum amount of balance to increase.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.increaseBalance(10, 50);
// player.data.balance will be increased by a random amount between 10 and 50.
```

#### Defined in

[classes/Player.ts:72](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L72)

***

### increaseXP()

> **increaseXP**(`minAmount`, `maxAmount`): [`Player`](Player.md)

Increases the player's XP by a random amount between the given minimum and maximum amounts.

#### Parameters

• **minAmount**: `number`

The minimum amount of XP to increase.

• **maxAmount**: `number`

The maximum amount of XP to increase.

#### Returns

[`Player`](Player.md)

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.increaseXP(10, 50);
// player.data.xp will be increased by a random amount between 10 and 50.
```

#### Defined in

[classes/Player.ts:52](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L52)

***

### levelUp()

> **levelUp**(): `void`

Calculates and updates the player's level based on their XP.
If the player's XP is greater than or equal to the required XP for their current level,
the player's level is increased by 1 and the players xp is reset to 0 with the excess xp added.

#### Returns

`void`

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.xp = 2351;
player.data.level = 1;
player.levelUp();
// player.data.level === 2
// player.data.xp === 351
```

#### Defined in

[classes/Player.ts:160](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L160)

***

### modifyBalance()

> **modifyBalance**(`amount`): [`Player`](Player.md)

Modifies the player's balance by adding the given amount.

#### Parameters

• **amount**: `number`

The amount to increase the player's balance by.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.modifyBalance(50);
// player.data.balance will be increased by 50.
```

#### Defined in

[classes/Player.ts:108](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L108)

***

### modifyXp()

> **modifyXp**(`amount`): [`Player`](Player.md)

Modifies the player's XP by adding the given amount.

#### Parameters

• **amount**: `number`

The amount to increase the player's XP by.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.modifyXp(50);
// player.data.xp will be increased by 50.
```

#### Defined in

[classes/Player.ts:91](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L91)

***

### openLootbox()

> **openLootbox**(`lootbox`): `object`

Opens a lootbox of the specified type and adds the resulting item to the player's backpack.
If the player does not have any lootboxes of the specified type, the function does nothing.

#### Parameters

• **lootbox**: [`Lootbox`](../../Lootbox/classes/Lootbox.md)

The type of lootbox to open.

#### Returns

`object`

- Returns an object containing the player instance and the item obtained from the lootbox.

- The player instance.

- The item obtained from the lootbox.

##### item

> **item**: [`Item`](../../Item/classes/Item.md)

##### player

> **player**: [`Player`](Player.md)

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.lootboxes = [
    new Lootbox(Lootbox.Type.COMMON, [new Item('Common Item', 10, 'A common item.')]),
    new Lootbox(Lootbox.Type.RARE, [new Item('Rare Item', 100, 'A rare item.')]),
];
const { player, item } = player.openLootbox(Lootbox.Type.COMMON);
// The player's backpack will contain the 'Common Item'.
```

#### Defined in

[classes/Player.ts:326](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L326)

***

### payToUser()

> **payToUser**(`player`, `amount`): [`Player`](Player.md)

Transfers the specified amount of balance from the current player to another player.

#### Parameters

• **player**: [`Player`](Player.md)

The player to transfer the balance to.

• **amount**: `number`

The amount of balance to transfer.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player1 = new Player('1234567890', 'John Doe');
const player2 = new Player('9876543210', 'Jane Doe');
player1.payToUser(player2, 50);
// player1.data.balance will be decreased by 50.
// player2.data.balance will be increased by 50.
```

#### Defined in

[classes/Player.ts:235](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L235)

***

### prestige()

> **prestige**(): [`Player`](Player.md)

Performs a prestige action for the player.
Resets the player's level, XP, and increments the prestige count by 1.
Adds a statistic to the player's statistics list indicating the number of times prestiged.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Defined in

[classes/Player.ts:449](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L449)

***

### removeBalance()

> **removeBalance**(`amount`): [`Player`](Player.md)

Removes the specified amount of balance from the current player.

#### Parameters

• **amount**: `number`

The amount of balance to remove.

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.removeBalance(50);
// player.data.balance will be decreased by 50.
```

#### Defined in

[classes/Player.ts:363](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L363)

***

### removeItem()

> **removeItem**(`item`, `amount`): [`Player`](Player.md)

Removes the specified item from the player's backpack.
If the item has more than one quantity, it decreases the quantity by one.
If the item has only one quantity, it removes the item from the backpack.

#### Parameters

• **item**: [`Item`](../../Item/classes/Item.md)

The item to remove from the backpack.

• **amount**: `number` = `1`

#### Returns

[`Player`](Player.md)

- Returns the instance of the Player class for method chaining.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
const sword = new Item('Sword', 100, 'A shiny sword.');
player.addItem(sword);
player.addItem(sword);
player.removeItem(sword);
// The player's backpack will contain only one 'Sword'.
```

#### Defined in

[classes/Player.ts:384](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L384)

***

### save()

> **save**(): `Promise`\<`Josh`\<[`JSON`](../namespaces/Player/interfaces/JSON.md)\>\>

Saves the current state of the Player instance to the database.

#### Returns

`Promise`\<`Josh`\<[`JSON`](../namespaces/Player/interfaces/JSON.md)\>\>

A Promise that resolves to the result of the database set operation.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
await player.save();
// The player's data is now saved to the database.
```

#### Defined in

[classes/Player.ts:593](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L593)

***

### setAttribute()

> **setAttribute**(`name`, `value`): [`Player`](Player.md)

Sets the value of the attribute with the specified name to the provided value.
If the attribute is found, its value is updated and the updated Player instance is returned.
If the attribute is not found, the function does nothing and returns the original Player instance.

#### Parameters

• **name**: `string`

The name of the attribute to set.

• **value**: `number`

The value to set the attribute's value to.

#### Returns

[`Player`](Player.md)

The updated Player instance with the set attribute value.
         If the attribute is not found, the original Player instance is returned.

#### Defined in

[classes/Player.ts:534](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L534)

***

### toJSON()

> **toJSON**(): `object`

Converts the Player instance into a JSON object.

#### Returns

`object`

A JSON object containing the Player's id and name.

##### data

> **data**: [`Data`](../namespaces/Player/interfaces/Data.md)

##### id

> **id**: `string`

##### name

> **name**: `string`

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
const playerJSON = player.toJSON();
// playerJSON = { id: '1234567890', name: 'John Doe' }
```

#### Defined in

[classes/Player.ts:577](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L577)

***

### xpLeft()

> **xpLeft**(): `number`

Calculates and returns the required XP for the next level.

#### Returns

`number`

The required XP for the next level.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.level = 1;
const requiredXP = player.requiredXp();
// requiredXP === 143
```

#### Defined in

[classes/Player.ts:124](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L124)

***

### xpRequired()

> **xpRequired**(): `number`

Calculates and returns the required XP for the next level.

#### Returns

`number`

The required XP for the next level.

#### Example

```ts
const player = new Player('1234567890', 'John Doe');
player.data.level = 1;
const requiredXP = player.xpRequired();
// requiredXP === 143
```

#### Defined in

[classes/Player.ts:139](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L139)

***

### fromJSON()

> `static` **fromJSON**(`object`): [`Player`](Player.md)

Static method to create a new Player instance from a JSON object.

#### Parameters

• **object**: [`JSON`](../namespaces/Player/interfaces/JSON.md)

The JSON object to create a Player instance from.

#### Returns

[`Player`](Player.md)

A new Player instance with the provided JSON object's properties.

#### Example

```ts
const playerJSON = { id: '1234567890', name: 'John Doe' };
const player = Player.fromJSON(playerJSON);
```

#### Defined in

[classes/Player.ts:565](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L565)

***

### get()

> `static` **get**(`id`, `client`): `Promise`\<[`Player`](Player.md)\>

Static method to get a player from the database or create a new one if not found.

#### Parameters

• **id**: `string`

The ID of the player.

• **client**: `Client`\<`boolean`\>

The Discord.js client instance.

#### Returns

`Promise`\<[`Player`](Player.md)\>

A new Player instance if the user is a bot, otherwise, a Player instance fetched from the database.

#### Example

```ts
const player = await Player.get(interaction.user.id, interaction.client);
```

#### Defined in

[classes/Player.ts:550](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/classes/Player.ts#L550)
