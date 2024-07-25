[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [utils/functions](../README.md) / getRandomItemByWeight

# Function: getRandomItemByWeight()

> **getRandomItemByWeight**(`items`): [`Item`](../../../classes/Item/classes/Item.md)

A function to get a random item from the item array based on their weights.

## Parameters

• **items**: [`Item`](../../../classes/Item/classes/Item.md)[]

## Returns

[`Item`](../../../classes/Item/classes/Item.md)

- A randomly selected item from the item array.

## Remarks

The weight of each item determines its likelihood of being selected.
The total weight of all items is calculated, and a random number between 0 and the total weight is generated.
The function then iterates through the item array, subtracting the weight of each item from the random number.
When the random number becomes less than or equal to 0, the corresponding item is returned.
If something goes wrong and no item is selected, the last item in the array is returned.

## Example

```ts
const randomItem = getRandomItemByWeight();
console.log(randomItem.name); // "Example Item"
```

## Defined in

[utils/functions.ts:105](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/utils/functions.ts#L105)
