import { Creature } from "../lib/structures/Creature";
import { creatures } from "../database/main";
import { common } from "./rarities";

(async () => {
    const dog = await Creature.get('Dog', 'A simple dog', 50, 30, common, 5000);
    const cat = await Creature.get('Cat', 'A simple cat', 50, 30, common, 5000);
    const bird = await Creature.get('Bird', 'A simple bird', 50, 30, common, 5000);
    const rabbit = await Creature.get('Rabbit', 'A simple rabbit', 50, 30, common, 5000);

    console.log(`Initialized base creatures: ${dog.name}, ${cat.name}, ${bird.name}, ${rabbit.name}`);
})();

export default (await creatures.values);