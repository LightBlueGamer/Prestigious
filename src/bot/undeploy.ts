import { client } from '.';

(async () => {
    const commands = await client?.application?.commands.fetch();
    if(!commands) return;
    for (const command of commands) {
        command[1].delete();
        console.log(`Deleted command ${command[1].name}`)
    }
})()

