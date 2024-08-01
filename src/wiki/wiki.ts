import * as fs from "fs/promises";
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
    Recipe,
    Shield,
    Weapon,
    Item,
    items,
} from "../lib/library.js";
import { marked } from "marked";

marked.setOptions({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateRecipeHTML(recipe: Recipe): string {
    const ingredientsHTML = recipe.ingredients
        .map((ingredient) => {
            if (ingredient instanceof Ingredient) {
                return `<tr><td><a href="/wiki/items/${ingredient.item.name.replace(/\s+/g, "-")}" class="text-light">${ingredient.item.name}</a></td><td>${ingredient.amount}</td></tr>`;
            } else if (ingredient instanceof Item) {
                return `<tr><td><a href="/wiki/items/${ingredient.name.replace(/\s+/g, "-")}" class="text-light">${ingredient.name}</a></td><td>1</td></tr>`;
            } else {
                return `<tr><td>Unknown</td><td>N/A</td></tr>`;
            }
        })
        .join("\n");

    return `
<h3>Recipe (outputs x${recipe.amount})</h3>
<table class="table table-dark table-striped table-hover table-responsive">
<thead>
  <tr>
    <th>Ingredient</th>
    <th>Quantity</th>
  </tr>
</thead>
<tbody>
  ${ingredientsHTML}
</tbody>
</table>
`;
}

function generateItemMD(item: Item): string {
    let markdown = `# ${item.name}\n\n`;
    const typeMap: { [key: string]: string } = {
        Cuirass: "Cuirass",
        Helmet: "Helmet",
        LegArmor: "Leg Armor",
        Shield: "Shield",
        Weapon: "Weapon",
        CraftableItem: "Craftable",
        LootboxItem: "Lootbox",
        BackpackEquipment: "Backpack",
    };

    const type = typeMap[item.constructor.name] || "Resource";
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
        markdown += `${generateRecipeHTML(item.recipe)}`;
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
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/5.2.3/darkly/bootstrap.min.css">
      <style>
        body { background-color: #343a40; color: #f8f9fa; }
        .container { padding-top: 20px; }
        .list-group-item { background-color: #495057; color: #f8f9fa; }
        .list-group-item a { color: #f8f9fa; }
      </style>
    </head>
    <body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
      <div class="container">
        ${htmlContent}
      </div>
    </body>
    </html>`;

    const htmlFilePath = path.join(
        directoryPath,
        `${item.name.replace(/\s+/g, "-")}.html`
    );

    try {
        await fs.writeFile(htmlFilePath, fullHTMLContent);
        console.log(`HTML file for ${item.name} saved successfully.`);
    } catch (err) {
        console.error(`Failed to save HTML file for ${item.name}:`, err);
    }
}

async function generateIndexHTML(items: Item[]) {
    let indexHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Item Index</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/5.2.3/darkly/bootstrap.min.css">
      <style>
        body { background-color: #343a40; color: #f8f9fa; }
        .container { padding-top: 20px; }
        .list-group-item { background-color: #343a40; color: #f8f9fa; }
        .list-group-item a { color: #f8f9fa; }
      </style>
    </head>
    <body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
      <div class="container">
        <h1 class="my-4">Item Index</h1>
        <ul class="list-group">`;

    items
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((item) => {
            const itemName = item.name.replace(/\s+/g, "-");
            indexHTML += `  <li class="list-group-item"><a href="items/${itemName}">${item.name}</a></li>\n`;
        });

    indexHTML += `    </ul>
      </div>
    </body>
    </html>`;

    const indexFilePath = path.join(__dirname, "../../wiki/", "index.html");

    try {
        await fs.writeFile(indexFilePath, indexHTML);
        console.log("Index HTML file created successfully.");
    } catch (err) {
        console.error("Failed to create index HTML file:", err);
    }
}

async function setup() {
    const directoryPath = path.join(__dirname, "../../wiki/items/");
    await fs.mkdir(directoryPath, { recursive: true });

    await generateIndexHTML(Object.values(items));

    await Promise.all(Object.values(items).map((item) => writeItemFile(item)));
}

setup()
    .then(() => process.exit(0))
    .catch((err) => console.error("Setup failed:", err));
