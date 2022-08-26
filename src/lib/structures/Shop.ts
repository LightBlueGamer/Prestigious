export class Shop {
    stock: Shop.StockItem[];
    register: number;
    level: number;
    constructor(
        stock: Shop.StockItem[] = [],
        register: number = 0,
        level: number = 0,
    ) {
        this.stock = stock;
        this.register = register;
        this.level = level;
    };

    addItem(itemName: string, amount: number) {
        const item = this.stock.find(itm => itm.name === itemName);
        if(item) {
            item.amount += amount;
        } else {
            this.stock.push({
                name: itemName,
                amount: amount,
                price: 10,
            });
        }
        return this;
    }

    sellItem(itemName: string, amount: number) {
        const item = this.stock.find(itm => itm.name === itemName)!;
        if(item.amount! - amount < 1) {
            this.stock.splice(this.stock.indexOf(item))
        } else {
            item.amount -= amount;
        };
        return this;
    }
};

export namespace Shop {
    export interface StockItem {
        name: string;
        price: number;
        amount: number;
    }
};