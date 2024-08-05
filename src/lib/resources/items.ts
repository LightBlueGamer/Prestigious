import { BackpackEquipment } from "../classes/BackpackEquipment.js";
import { CraftableItem } from "../classes/CraftableItem.js";
import { Ingredient } from "../classes/Ingredient.js";
import { Item } from "../classes/Item.js";
import { LootboxItem } from "../classes/LootboxItem.js";
import { Recipe } from "../classes/Recipe.js";
import { Weapon } from "../classes/Weapon.js";
import { backpacks } from "./backpacks.js";

const items: { [key: string]: Item } = {
    // General Items
    Pebble: new Item("Pebble", 1, 10, 10000000),
    Leaf: new Item("Leaf", 1, 10, 9800000),
    Ash: new Item("Ash", 1, 10, 9700000),
    Thorn: new Item("Thorn", 1, 20, 9600000),
    Acorn: new Item("Acorn", 1, 20, 9600000),
    FernLeaf: new Item("Fern Leaf", 1, 20, 9600000),
    Twig: new Item("Twig", 1, 20, 9500000),
    Fibers: new Item("Fibers", 1, 20, 9500000),
    SandPouch: new Item("Sand Pouch", 1, 20, 9500000),
    Pinecone: new Item("Pinecone", 1, 20, 9500000),
    DriedLeaves: new Item("Dried Leaves", 1, 20, 9500000),
    Moss: new Item("Moss", 1, 20, 9500000),
    Mud: new Item("Mud", 1, 20, 9500000),
    OakLeaf: new Item("Oak Leaf", 1, 20, 9500000),
    MapleLeaf: new Item("Maple Leaf", 1, 20, 9500000),
    Berry: new Item("Berry", 1, 20, 9450000),
    Lichen: new Item("Lichen", 1, 20, 9450000),
    WoodChip: new Item("Wood Chip", 1, 20, 9450000),
    Egg: new Item("Egg", 1, 30, 9400000),
    Hay: new Item("Hay", 1, 30, 9400000),
    ThistleLeaf: new Item("Thistle Leaf", 1, 30, 9400000),
    Shell: new Item("Shell", 1, 30, 9350000),
    Cattail: new Item("Cattail", 1, 30, 9350000),
    SnailShell: new Item("Snail Shell", 1, 30, 9300000),
    Seashell: new Item("Seashell", 1, 30, 9300000),
    Flower: new Item("Flower", 1, 30, 9300000),
    SeashellFragment: new Item("Seashell Fragment", 1, 30, 9300000),
    Stick: new Item("Stick", 1, 30, 9250000),
    Bark: new Item("Bark", 1, 30, 9250000),
    Rock: new Item("Rock", 1, 30, 9250000),
    Root: new Item("Root", 1, 30, 9250000),
    Branch: new Item("Branch", 1, 30, 9250000),
    Wheat: new Item("Wheat", 1, 30, 9250000),
    Reed: new Item("Reed", 1, 30, 9250000),
    Feather: new Item("Feather", 1, 40, 9200000),
    Fur: new Item("Fur", 1, 40, 9200000),
    Thistle: new Item("Thistle", 1, 40, 9200000),
    Grains: new Item("Grains", 1, 40, 9200000),
    Resin: new Item("Resin", 1, 40, 9200000),
    PineNeedles: new Item("Pine Needles", 1, 40, 9200000),
    BambooStick: new Item("Bamboo Stick", 1, 40, 9200000),
    Scales: new Item("Scales", 1, 40, 9175000),
    Leather: new Item("Leather", 1, 40, 9175000),
    Potatoes: new Item("Potatoes", 1, 40, 9170000),
    Carrot: new Item("Carrot", 1, 40, 9170000),
    Apple: new Item("Apple", 1, 40, 9150000),
    Herb: new Item("Herb", 1, 40, 9150000),
    Stone: new Item("Stone", 1, 50, 9100000),
    Bread: new Item("Bread", 1, 50, 9100000),
    BoneShard: new Item("Bone Shard", 1, 50, 9100000),
    LeafBundle: new Item("Leaf Bundle", 1, 50, 9100000),
    CrushedStone: new Item("Crushed Stone", 1, 50, 9100000),
    PalmLeaf: new Item("Palm Leaf", 1, 50, 9100000),
    Vine: new Item("Vine", 1, 50, 9050000),
    Fish: new Item("Fish", 1, 50, 9050000),
    StoneFragment: new Item("Stone Fragment", 1, 50, 9050000),
    Clay: new Item("Clay", 1, 50, 9000000),
    Meat: new Item("Meat", 1, 50, 9000000),
    PebblePouch: new Item("Pebble Pouch", 1, 50, 9000000),
    FossilFragment: new Item("Fossil Fragment", 1, 50, 9000000),
    Mushroom: new Item("Mushroom", 1, 50, 8950000),
    Cheese: new Item("Cheese", 1, 50, 8950000),
    MushroomCap: new Item("Mushroom Cap", 1, 50, 8950000),
    Coal: new Item("Coal", 1, 60, 8900000),
    Flax: new Item("Flax", 1, 60, 8900000),
    ObsidianShard: new Item("Obsidian Shard", 1, 60, 8800000),
    Wool: new Item("Wool", 1, 70, 8700000),
    Charcoal: new Item("Charcoal", 1, 70, 8700000),
    CharredWood: new Item("Charred Wood", 1, 70, 8700000),
    Quartz: new Item("Quartz", 1, 70, 8700000),
    Flint: new Item("Flint", 1, 70, 8600000),
    PebbleStack: new Item("Pebble Stack", 2, 70, 8500000),
    TwigBundle: new Item("Twig Bundle", 2, 70, 8500000),
    Amber: new Item("Amber", 1, 70, 8500000),
    RibBones: new Item("Rib Bones", 2, 150, 7600000),
    Skull: new Item("Skull", 1, 220, 6850000),
    Femur: new Item("Femur", 2, 280, 5000000),
    Horn: new Item("Horn", 2, 280, 5000000),
    CopperOre: new Item("Copper Ore", 2, 340, 4500000),
    Log: new Item("Log", 2, 350, 4300000),
    IronOre: new Item("Iron Ore", 2, 370, 4000000),
    SilverOre: new Item("Silver Ore", 2, 450, 3000000),
    GoldOre: new Item("Gold Ore", 2, 480, 2500000),

    // Treasures
    MinorGemstone: new Item("Minor Gemstone", 1, 1250, 22000, false),
    MinorArtifact: new Item("Minor Artifact", 1, 1250, 21000, false),
    AntiqueJewelry: new Item("Antique Jewelry", 1, 1500, 12000, false),
    RareCoin: new Item("Rare Coin", 1, 2500, 4000, false),
    MajorGemstone: new Item("Major Gemstone", 2, 3000, 1000, false),
    MajorArtifact: new Item("Major Artifact", 2, 3500, 800, false),

    // Magical Items
    MagicDust: new Item("Magic Dust", 1, 100, 900000, false, true, true, false),
    EnchantedStone: new Item(
        "Enchanted Stone",
        1,
        750,
        30000,
        false,
        true,
        true,
        false
    ),
    MysticOrb: new Item("Mystic Orb", 1, 4000, 500, false, false, true, false),
    AncientScroll: new Item(
        "Ancient Scroll",
        1,
        3750,
        700,
        false,
        false,
        true,
        false
    ),

    // Lootboxes
    CommonLootboxItem: new LootboxItem(
        "Common Lootbox",
        2,
        3250,
        1200,
        false,
        false,
        true,
        false
    ),
};

const recipes: { [key: string]: Recipe } = {
    StoneHatchet: new Recipe([items.Rock, items.Fibers, items.Stick]),
    LeatherStrap: new Recipe([new Ingredient(items.Leather, 2), items.Resin]),
};

items.StoneHatchetItem = new Weapon(
    "Stone Hatchet",
    2,
    15,
    0,
    recipes.StoneHatchet,
    ["Simple", "Melee"],
    2,
    ["str"]
);

items.LeatherStrap = new CraftableItem(
    "Leather Strap",
    1,
    20,
    0,
    recipes.LeatherStrap
);

recipes.Satchel = new Recipe([
    new Ingredient(items.LeatherStrap, 2),
    new Ingredient(items.Resin, 2),
    items.Leather,
]);

items.Satchel = new BackpackEquipment(
    "Satchel",
    1,
    50,
    0,
    recipes.Satchel,
    backpacks.Satchel
);

for (const item of Object.values(items)) {
    if (item instanceof CraftableItem) {
        let price = 0;
        for (const ingredient of item.recipe.getIngredients()) {
            price += ingredient.item.value * ingredient.amount;
        }
        item.value = price;
    }
}

export { items, recipes };
