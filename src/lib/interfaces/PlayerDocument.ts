import type { Player } from "../library.js";

export interface PlayerDocument {
    key: string;
    value: PlayerDocumentValue;
}

interface PlayerDocumentValue {
    id: string;
    name: string;
    data: Player.Data;
}
