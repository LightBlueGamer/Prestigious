[**prestigious**](../README.md) • **Docs**

***

[prestigious](../README.md) / resources/emojis

# resources/emojis

## Variables

### emojis

> `const` **emojis**: `object`[]

An array of objects representing different emoji names and their IDs.
Each object has two properties: `name` (string) and `id` (string).

#### Example

```typescript
const emoji = emojis.find(e => e.name === 'empty_left');
console.log(emoji.id); // Output: "1250067781702123600"
```

#### Defined in

[resources/emojis.ts:11](https://github.com/LightBlueGamer/Prestigious/blob/85a20b132e245a5deb00df242c82d7c6845a7ed4/src/lib/resources/emojis.ts#L11)
