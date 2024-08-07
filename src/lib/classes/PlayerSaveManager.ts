import type { Player } from "./Player.js";

export class PlayerSaveManager {
    private static instance: PlayerSaveManager;
    private saveQueue: Map<string, Player> = new Map();
    private debounceDelay: number = 1000 * 60;
    private debounceTimer: NodeJS.Timeout | null = null;
    private playerCache: Map<string, Player> = new Map();

    private constructor() {}

    public static getInstance(): PlayerSaveManager {
        if (!PlayerSaveManager.instance) {
            PlayerSaveManager.instance = new PlayerSaveManager();
        }
        return PlayerSaveManager.instance;
    }

    public cachePlayer(player: Player) {
        this.playerCache.set(player.id, player);
    }

    public getPlayerFromCache(id: string): Player | undefined {
        return this.playerCache.get(id);
    }

    public async save(player: Player) {
        this.saveQueue.set(player.id, player);

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(async () => {
            await this.processQueue();
        }, this.debounceDelay);
    }

    private async processQueue() {
        console.log(
            `Starting queue processing: ${this.saveQueue.size} items in queue...`
        );
        while (this.saveQueue.size > 0) {
            console.log(
                `Processing queue: ${this.saveQueue.size} items left...`
            );
            const [playerId, player] = this.saveQueue.entries().next().value;
            this.saveQueue.delete(playerId);
            try {
                await player.saveToDatabase();
            } catch (error) {
                console.error(`Failed to save player ${playerId}:`, error);
                this.saveQueue.set(playerId, player);
            }
        }
        console.log(`All queue items finished processing...`);
    }

    public async flushQueue() {
        console.log("Flushing save queue before shutdown...");
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        await this.processQueue();
    }
}
