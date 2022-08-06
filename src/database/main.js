import Josh from '@joshdb/core';
import provider from '@joshdb/sqlite';

export const players = new Josh({
    name: 'Players',
    provider,
});

export const creatures = new Josh({
    name: 'Creatures',
    provider,
});