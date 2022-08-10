import Josh from '@joshdb/core';
import provider from '@joshdb/sqlite';
import type { Clan } from '../lib/structures/Clan';
import type { Creature } from '../lib/structures/Creature';
import type { Player } from '../lib/structures/Player';

export const players = new Josh<Player.JSON>({
    name: 'Players',
    provider,
});

export const creatures = new Josh<Creature.JSON>({
    name: 'Creatures',
    provider,
});

export const clans = new Josh<Clan.JSON>({
    name: 'Clans',
    provider,
})