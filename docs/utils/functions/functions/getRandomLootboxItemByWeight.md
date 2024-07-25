[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [utils/functions](../README.md) / getRandomLootboxItemByWeight

# Function: getRandomLootboxItemByWeight()

> **getRandomLootboxItemByWeight**(`items`): [`Item`](../../../classes/Item/classes/Item.md)

A function to get a random lootbox item from the lootbox item array based on their weights.
The weight of each item is multiplied by its bonus to determine its likelihood of being selected.

## Parameters

• **items**: [`Item`](../../../classes/Item/classes/Item.md)[]

An array of lootbox items. Each item has an `item` property (of type `Item`) and a `bonus` property (number).

## Returns

[`Item`](../../../classes/Item/classes/Item.md)

- A randomly selected lootbox item from the lootbox item array.

## Remarks

The total weight of all items is calculated, and a random number between 0 and the total weight is generated.
The function then iterates through the lootbox item array, subtracting the weighted weight of each item from the random number.
When the random number becomes less than or equal to 0, the corresponding item is returned.
If something goes wrong and no item is selected, the last item in the array is returned.

## Example

```ts
const lootboxItems: LootboxItem[] = [
  { item: { name: "Example Item 1", weight: 1 }, bonus: 2 },
  { item: { name: "Example Item 2", weight: 2 }, bonus: 1 },
];
const randomLootboxItem = getRandomLootboxItemByWeight(lootboxItems);
console.log(randomLootboxItem.item.name); // "Example Item 1" or "Example Item 2"
```

## Defined in

[utils/functions.ts:141](https://github.com/LightBlueGamer/Prestigious/blob/bceae299d5416ea8756fa7d0aa42b82d959295c3/src/lib/utils/functions.ts#L141)
