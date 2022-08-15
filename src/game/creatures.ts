import { Creature } from "../lib/structures/Creature";
import { creatures } from "../database/main";
import { common, epic, legendary, rare, uncommon, unique } from "./rarities";

(async () => {

    await Creature.get('Dog', 'A simple dog', 50, 30, common, 12500);
    await Creature.get('Cat', 'A simple cat', 50, 30, common, 12500);
    await Creature.get('Rat', 'A simple rat', 50, 30, common, 12500);
    await Creature.get('Hamster', 'A simple hamster', 50, 30, common, 12500);
    await Creature.get('Bird', 'A simple bird', 15, 10, common, 10000);
    await Creature.get('Rabbit', 'A simple rabbit', 20, 40, common, 10000);
    await Creature.get('Snake', 'A simple snake', 20, 40, common, 10000);
    await Creature.get('Lizard', 'A simple lizard', 20, 40, common, 10000);

    await Creature.get('Llama', 'A llama', 100, 30, uncommon, 8000);
    await Creature.get('Alpaca', 'A alpaca', 100, 30, uncommon, 8000);
    await Creature.get('Pig', 'A pig', 100, 30, uncommon, 8000);
    await Creature.get('Horse', 'A horse', 100, 30, uncommon, 8000);
    await Creature.get('Donkey', 'A donkey', 100, 30, uncommon, 6500);
    await Creature.get('Mule', 'A mule', 100, 30, uncommon, 6500);
    await Creature.get('Pony', 'A pony', 100, 30, uncommon, 6500);
    await Creature.get('Zebra', 'A zebra', 100, 30, uncommon, 6500);

    await Creature.get('Toad', 'A toad', 20, 10, rare, 4500);
    await Creature.get('Frog', 'A frog', 20, 10, rare, 4500);
    await Creature.get('Penguin', 'A penguin', 20, 10, rare, 4500);
    await Creature.get('Polar Bear', 'A polar bear', 20, 10, rare, 4500);
    await Creature.get('Fox', 'A fox', 25, 15, rare, 3750);
    await Creature.get('Mole', 'A mole', 20, 20, rare, 3750);
    await Creature.get('Bear', 'A bear', 20, 20, rare, 3750);
    await Creature.get('Lioness', 'A lioness', 20, 20, rare, 3750);

    await Creature.get('Parrot', 'A parrot', 15, 20, epic, 3000);
    await Creature.get('Otter', 'A otter', 20, 20, epic, 3000);
    await Creature.get('Seal', 'A seal', 20, 20, epic, 3000);
    await Creature.get('Iguana', 'A iguana', 20, 20, epic, 3000);
    await Creature.get('Cow', 'A cow', 100, 15, epic, 2500);
    await Creature.get('Wolf', 'A wolf', 80, 35, epic, 2500);
    await Creature.get('Raccoon', 'A raccoon', 80, 35, epic, 2500);
    await Creature.get('Squirrel', 'A squirrel', 80, 35, epic, 2500);

    await Creature.get('Tiger', 'A tiger', 80, 40, legendary, 750);
    await Creature.get('Leopard', 'A leopard', 80, 35, legendary, 750);
    await Creature.get('Elephant', 'A elephant', 80, 35, legendary, 750);
    await Creature.get('Rhino', 'A rhino', 80, 35, legendary, 750);
    await Creature.get('Lion', 'A lion', 100, 30, legendary, 250);
    await Creature.get('Catfish', 'A catfish', 30, 10, legendary, 250);
    await Creature.get('Whale', 'A whale', 100, 30, legendary, 250);
    await Creature.get('Dolphin', 'A dolphin', 100, 30, legendary, 250);

    await Creature.get('Maine Coon Cat', 'A maine coon cat', 500, 250, unique, 0);
    await Creature.get('Nova Scotia Duck Tolling Retriever Dog', 'A nova scotia duck tolling retriever dog', 500, 250, unique, 0);
    await Creature.get('Founding Titan', 'A founding titan', 500, 250, unique, 0);
    await Creature.get('Puck Cat', 'A puck cat', 500, 250, unique, 0);
    await Creature.get('Tiny Calico Cat', 'A tiny calico cat', 500, 250, unique, 0);
    await Creature.get('Drago The Dragon', 'A dragon named Drago', 500, 250, unique, 0);

})();

export default (await creatures.values);