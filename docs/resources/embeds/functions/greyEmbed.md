[**prestigious**](../../../README.md) • **Docs**

***

[prestigious](../../../README.md) / [resources/embeds](../README.md) / greyEmbed

# Function: greyEmbed()

> **greyEmbed**(): `EmbedBuilder`

Creates a new Discord Embed with a grey color and a default footer.

## Returns

`EmbedBuilder`

A new Discord Embed with the specified color and footer.

## Remarks

This function is used to create a new Discord Embed with a specific color and footer.
The color is set to grey, and the footer text is set to "Prestigious 4 Made By Inferno and Tim".

## Example

```typescript
const greyEmbed = createGreyEmbed();
// Send the greyEmbed to a Discord channel
await channel.send({ embeds: [greyEmbed] });
```

## Defined in

[resources/embeds.ts:145](https://github.com/LightBlueGamer/Prestigious/blob/0cab475f7a09d3ad5cc01bbd453a1ccfa07d4865/src/lib/resources/embeds.ts#L145)
