import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
    calculateItemChance,
    CraftableItem,
    Cuirass,
    formatNumber,
    Helmet,
    Ingredient,
    LegArmor,
    LootboxItem,
    Recipe,
    Shield,
    Weapon,
    Item,
    items,
} from "../lib/library.js";
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateRecipeMarkdown(recipe: Recipe): string {
    const ingredientsMarkdown = recipe.ingredients
        .map((ingredient) => {
            if (ingredient instanceof Ingredient) {
                return `| ${ingredient.item.name} | ${ingredient.amount} |`;
            } else if (ingredient instanceof Item) {
                return `| ${ingredient.name} | 1 |`;
            } else {
                return `| Unknown | N/A |`;
            }
        })
        .join("\n");

    return `
### Recipe (${recipe.amount})

| Ingredient       | Quantity |
|------------------|----------|
${ingredientsMarkdown}
`;
}

function generateItemMD(item: Item): string {
    let markdown = `# ${item.name}\n\n`;
    let type = "Resource";
    if (item instanceof Cuirass) type = "Cuirass";
    else if (item instanceof Helmet) type = "Helmet";
    else if (item instanceof LegArmor) type = "Leg Armor";
    else if (item instanceof Shield) type = "Shield";
    else if (item instanceof Weapon) type = "Weapon";
    else if (item instanceof CraftableItem) type = "Craftable";
    else if (item instanceof LootboxItem) type = "Lootbox";
    markdown += `- **Type**: ${type}\n`;
    markdown += `- **Size**: ${item.size}\n`;
    markdown += `- **Value**: $${item.value}\n`;
    markdown += `- **Drop Chance**: ${item.weight} (${formatNumber(calculateItemChance(item.name)!)}%)\n`;
    markdown += `- **Buyable**: ${item.buy ? "Yes" : "No"}\n`;
    markdown += `- **Sellable**: ${item.sell ? "Yes" : "No"}\n`;
    markdown += `- **Can Scavenge**: ${item.canScavenge ? "Yes" : "No"}\n`;
    markdown += `- **In Lootboxes**: ${item.inLootbox ? "Yes" : "No"}\n`;
    if (
        item instanceof Cuirass ||
        item instanceof Helmet ||
        item instanceof LegArmor ||
        item instanceof Shield ||
        item instanceof Weapon
    ) {
        markdown += `- **Equipment Type**: ${item.type.join(", ")}\n`;
        if (item instanceof Weapon) {
            markdown += `- **Damage**: ${item.damage}\n`;
        } else {
            markdown += `- **Armor**: ${item.armor}\n`;
        }
        markdown += `- **Attributes**: ${item.attributes.join(", ")}\n`;
    }

    if (item instanceof CraftableItem) {
        markdown += `${generateRecipeMarkdown(item.recipe)}`;
    }

    return markdown;
}

async function writeItemFile(item: Item) {
    const directoryPath = path.join(__dirname, "../../wiki/items/");
    const markdown = generateItemMD(item);
    const htmlContent = await marked(markdown);

    // Add dark Bootstrap theme
    const fullHTMLContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${item.name}</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/5.2.3/darkly/bootstrap.min.css">
      <style>
        body { background-color: #343a40; color: #f8f9fa; }
        .container { padding-top: 20px; }
        .list-group-item { background-color: #495057; color: #f8f9fa; }
        .list-group-item a { color: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="container">
        ${htmlContent}
      </div>
    </body>
    </html>`;

    const htmlFilePath = path.join(directoryPath, `${item.name.replace(/\s+/g, '-')}.html`);

    fs.writeFileSync(htmlFilePath, fullHTMLContent);

    console.log(`HTML file for ${item.name} saved successfully.`);
}

function generateIndexHTML(items: any[]) {
    let indexHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Item Index</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/5.2.3/darkly/bootstrap.min.css">
      <style>
        body { background-color: #343a40; color: #f8f9fa; }
        .container { padding-top: 20px; }
        .list-group-item { background-color: #343a40; color: #f8f9fa; }
        .list-group-item a { color: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="my-4">Item Index</h1>
        <ul class="list-group">`;

    items.sort((a: any, b: any) => a.name.localeCompare(b.name)).forEach(item => {
        const itemName = item.name.replace(/\s+/g, '-');
        indexHTML += `  <li class="list-group-item"><a href="items/${itemName}.html">${item.name}</a></li>\n`;
    });

    indexHTML += `    </ul>
      </div>
    </body>
    </html>`;

    const indexFilePath = path.join(__dirname, "../../wiki/", 'index.html');

    fs.writeFileSync(indexFilePath, indexHTML);
    console.log('Index HTML file created successfully.');
}

function setup() {
    const directoryPath = path.join(__dirname, "../../wiki/items/");
    fs.mkdirSync(directoryPath, { recursive: true });

    generateIndexHTML(Object.values(items));

    for (const item of Object.values(items)) {
        writeItemFile(item);
    }
}

setup();
