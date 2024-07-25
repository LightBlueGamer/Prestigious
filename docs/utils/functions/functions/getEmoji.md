[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [utils/functions](../README.md) / getEmoji

# Function: getEmoji()

> **getEmoji**(`name`): `string`

A function to get an emoji by its name.

## Parameters

• **name**: `string`

The name of the emoji.

## Returns

`string`

A string representation of the emoji in Discord format.
         If the emoji is not found, an empty string is returned.

## Example

```typescript
const happyEmoji = getEmoji('smile');
console.log(happyEmoji); // <:smile:1234567890>
```

## Remarks

The `emojis` array is assumed to be defined elsewhere in the codebase.
Each emoji object in the array should have properties `name` and `id`.

## Defined in

[utils/functions.ts:58](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/utils/functions.ts#L58)
