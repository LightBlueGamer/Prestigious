interface TradeObject {
    p1: {
        name: string;
        money: number;
        items: TradeItem[];
        accepted: boolean;
    };
    p2: {
        name: string;
        money: number;
        items: TradeItem[];
        accepted: boolean;
    };
}
