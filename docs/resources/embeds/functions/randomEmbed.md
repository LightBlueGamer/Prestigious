[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [resources/embeds](../README.md) / randomEmbed

# Function: randomEmbed()

> **randomEmbed**(): `EmbedBuilder`

Creates a new Discord Embed with a random color and a default footer.

## Returns

`EmbedBuilder`

A new Discord Embed with a random color and the specified footer.

## Example

```typescript
const randomColorEmbed = randomEmbed();
// Send the randomColorEmbed to a Discord channel
await channel.send({ embeds: [randomColorEmbed] });
```

## Defined in

[resources/embeds.ts:33](https://github.com/LightBlueGamer/Prestigious/blob/bceae299d5416ea8756fa7d0aa42b82d959295c3/src/lib/resources/embeds.ts#L33)
