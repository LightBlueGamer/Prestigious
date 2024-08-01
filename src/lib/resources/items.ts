import { BackpackEquipment } from "../classes/BackpackEquipment.js";
import { CraftableItem } from "../classes/CraftableItem.js";
import { Ingredient } from "../classes/Ingredient.js";
import { Item } from "../classes/Item.js";
import { LootboxItem } from "../classes/LootboxItem.js";
import { Recipe } from "../classes/Recipe.js";
import { Weapon } from "../classes/Weapon.js";
import { backpacks } from "./backpacks.js";

// Initialize items first
const items: { [key: string]: Item } = {
    // General Items
    Pebble: new Item("Pebble", 1, 1, 10000000),
    Twig: new Item("Twig", 1, 2, 9500000),
    Stick: new Item("Stick", 1, 4, 9250000),
    Fibers: new Item("Fibers", 1, 3, 9500000),
    Bark: new Item("Bark", 1, 4, 9250000),
    Rock: new Item("Rock", 1, 5, 9250000),
    Feather: new Item("Feather", 1, 6, 9200000),
    Fur: new Item("Fur", 1, 7, 9200000),
    Scales: new Item("Scales", 1, 8, 9175000),
    Leather: new Item("Leather", 1, 9, 9175000),
    Potatoes: new Item("Potatoes", 1, 10, 9170000),
    Carrot: new Item("Carrot", 1, 11, 9170000),
    SandPouch: new Item("Sand Pouch", 1, 3, 9500000),
    RibBones: new Item("Rib Bones", 2, 5, 7600000),
    Skull: new Item("Skull", 1, 7, 6850000),
    Femur: new Item("Femur", 2, 12, 5000000),
    Log: new Item("Log", 2, 16, 4300000),
    Leaf: new Item("Leaf", 1, 1, 9800000),
    Stone: new Item("Stone", 1, 5, 9100000),
    Clay: new Item("Clay", 1, 6, 9000000),
    Mushroom: new Item("Mushroom", 1, 8, 8950000),
    Coal: new Item("Coal", 1, 10, 8900000),
    Vine: new Item("Vine", 1, 7, 9050000),
    Berry: new Item("Berry", 1, 3, 9450000),
    Shell: new Item("Shell", 1, 4, 9350000),
    Horn: new Item("Horn", 2, 12, 5000000),
    Root: new Item("Root", 1, 5, 9250000),
    Pinecone: new Item("Pinecone", 1, 2, 9500000),
    Apple: new Item("Apple", 1, 15, 9150000),
    Bread: new Item("Bread", 1, 20, 9100000),
    Fish: new Item("Fish", 1, 30, 9050000),
    Meat: new Item("Meat", 1, 25, 9000000),
    Cheese: new Item("Cheese", 1, 35, 8950000),
    Egg: new Item("Egg", 1, 10, 9400000),
    IronOre: new Item("Iron Ore", 2, 50, 4000000),
    CopperOre: new Item("Copper Ore", 2, 40, 4500000),
    GoldOre: new Item("Gold Ore", 2, 100, 2500000),
    SilverOre: new Item("Silver Ore", 2, 80, 3000000),
    Wool: new Item("Wool", 1, 20, 8700000),
    Flax: new Item("Flax", 1, 10, 8900000),
    Thorn: new Item("Thorn", 1, 2, 9600000),
    Ash: new Item("Ash", 1, 1, 9700000),
    Lichen: new Item("Lichen", 1, 3, 9450000),
    PebblePouch: new Item("Pebble Pouch", 1, 12, 9000000),
    DriedLeaves: new Item("Dried Leaves", 1, 2, 9500000),
    BoneShard: new Item("Bone Shard", 1, 6, 9100000),
    SnailShell: new Item("Snail Shell", 1, 4, 9300000),
    Moss: new Item("Moss", 1, 3, 9500000),
    Branch: new Item("Branch", 1, 5, 9250000),
    Thistle: new Item("Thistle", 1, 7, 9200000),
    Mud: new Item("Mud", 1, 1, 9500000),
    Charcoal: new Item("Charcoal", 1, 15, 8700000),
    Herb: new Item("Herb", 1, 12, 9150000),
    Grains: new Item("Grains", 1, 10, 9200000),
    Seashell: new Item("Seashell", 1, 4, 9300000),
    Acorn: new Item("Acorn", 1, 2, 9600000),
    PebbleStack: new Item("Pebble Stack", 2, 20, 8500000),
    Flower: new Item("Flower", 1, 6, 9300000),
    Hay: new Item("Hay", 1, 5, 9400000),
    Wheat: new Item("Wheat", 1, 8, 9250000),
    LeafBundle: new Item("Leaf Bundle", 1, 10, 9100000),
    Resin: new Item("Resin", 1, 5, 9200000),
    StoneFragment: new Item("Stone Fragment", 1, 7, 9050000),
    WoodChip: new Item("Wood Chip", 1, 3, 9450000),
    TwigBundle: new Item("Twig Bundle", 2, 20, 8500000),
    Cattail: new Item("Cattail", 1, 4, 9350000),
    FernLeaf: new Item("Fern Leaf", 1, 2, 9600000),
    MushroomCap: new Item("Mushroom Cap", 1, 8, 8950000),
    CrushedStone: new Item("Crushed Stone", 1, 7, 9100000),
    CharredWood: new Item("Charred Wood", 1, 15, 8700000),
    PineNeedles: new Item("Pine Needles", 1, 6, 9200000),
    PalmLeaf: new Item("Palm Leaf", 1, 8, 9100000),
    SeashellFragment: new Item("Seashell Fragment", 1, 4, 9300000),
    ThistleLeaf: new Item("Thistle Leaf", 1, 5, 9400000),
    OakLeaf: new Item("Oak Leaf", 1, 3, 9500000),
    MapleLeaf: new Item("Maple Leaf", 1, 3, 9500000),
    Reed: new Item("Reed", 1, 5, 9250000),
    BambooStick: new Item("Bamboo Stick", 1, 6, 9200000),
    FossilFragment: new Item("Fossil Fragment", 1, 10, 9000000),
    ObsidianShard: new Item("Obsidian Shard", 1, 12, 8800000),
    Quartz: new Item("Quartz", 1, 14, 8700000),
    Flint: new Item("Flint", 1, 15, 8600000),
    Amber: new Item("Amber", 1, 18, 8500000),

    // Treasures
    MinorGemstone: new Item("Minor Gemstone", 1, 1250, 22000, false),
    MajorGemstone: new Item("Major Gemstone", 2, 5000, 1000, false),
    MinorArtifact: new Item("Minor Artifact", 1, 1500, 21000, false),
    MajorArtifact: new Item("Major Artifact", 2, 6000, 800, false),
    RareCoin: new Item("Rare Coin", 1, 500, 15000, false),
    AntiqueJewelry: new Item("Antique Jewelry", 1, 4000, 12000, false),

    // Magical Items
    MagicDust: new Item("Magic Dust", 1, 750, 900000, false, true, true, false),
    EnchantedStone: new Item(
        "Enchanted Stone",
        1,
        2000,
        30000,
        false,
        true,
        true,
        false
    ),
    MysticOrb: new Item("Mystic Orb", 1, 10000, 500, false, false, true, false),
    AncientScroll: new Item(
        "Ancient Scroll",
        1,
        5000,
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
        5000,
        1200,
        true,
        false,
        true,
        false
    ),
};

// Define recipes after items
const recipes: { [key: string]: Recipe } = {
    StoneHatchet: new Recipe([items.Rock, items.Fibers, items.Stick]),
    LeatherStrap: new Recipe([new Ingredient(items.Leather, 2), items.Resin]),
};

// Initialize craftables after recipes are defined
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

export { items, recipes };
