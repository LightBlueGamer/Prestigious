[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [resources/embeds](../README.md) / redEmbed

# Function: redEmbed()

> **redEmbed**(): `EmbedBuilder`

Creates a new Discord Embed with a red color and a default footer.

## Returns

`EmbedBuilder`

A new Discord Embed with the specified color and footer.

## Example

```typescript
const redEmbed = createRedEmbed();
// Send the redEmbed to a Discord channel
await channel.send({ embeds: [redEmbed] });
```

## Defined in

[resources/embeds.ts:51](https://github.com/LightBlueGamer/Prestigious/blob/bceae299d5416ea8756fa7d0aa42b82d959295c3/src/lib/resources/embeds.ts#L51)
