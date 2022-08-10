import { Creature } from "../lib/structures/Creature";
import { creatures } from "../database/main";
import { common, epic, legendary, rare, uncommon } from "./rarities";

(async () => {
    await Creature.get('Dog', 'A simple dog', 50, 30, common, 5000);
    await Creature.get('Cat', 'A simple cat', 50, 30, common, 5000);
    await Creature.get('Bird', 'A simple bird', 15, 10, common, 4750);
    await Creature.get('Rabbit', 'A simple rabbit', 20, 40, common, 4750);

    await Creature.get('Llama', 'A llama', 100, 30, uncommon, 4000);
    await Creature.get('Alpaca', 'A alpaca', 100, 30, uncommon, 4000);
    await Creature.get('Donkey', 'A donkey', 100, 30, uncommon, 3750);
    await Creature.get('Mule', 'A mule', 100, 30, uncommon, 3750);

    await Creature.get('Toad', 'A toad', 20, 10, rare, 3000);
    await Creature.get('Frog', 'A frog', 20, 10, rare, 3000);
    await Creature.get('Fox', 'A fox', 25, 15, rare, 2500);
    await Creature.get('Mole', 'A mole', 20, 20, rare, 2500);

    await Creature.get('Parrot', 'A parrot', 15, 20, epic, 2000);
    await Creature.get('Otter', 'A otter', 20, 20, epic, 2000);
    await Creature.get('Cow', 'A cow', 100, 15, epic, 1250);
    await Creature.get('Wolf', 'A wolf', 80, 35, epic, 1250);

    await Creature.get('Tiger', 'A tiger', 80, 40, legendary, 500);
    await Creature.get('Leopard', 'A leopard', 80, 35, legendary, 500);
    await Creature.get('Lion', 'A lion', 100, 30, legendary, 250);
    await Creature.get('Catfish', 'A catfish', 30, 10, legendary, 250);

    console.log(`Initialized base creatures.`);
})();

export default (await creatures.values);