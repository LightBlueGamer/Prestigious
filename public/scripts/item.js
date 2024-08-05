(async function fetchItemFromUrl() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const itemName = urlParams.get("item");
        const user = urlParams.get("user") || "0";

        if (!itemName) {
            throw new Error("Item parameter is missing in the URL");
        }

        const requestUrl = `/api/v1/get/item?item=${encodeURIComponent(itemName)}`;

        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }

        const data = await response.json();
        const div = document.getElementById("item");
        div.innerHTML = "";

        const header = document.createElement("h1");
        header.innerHTML = data.name;

        const ul = document.createElement("ul");
        const size = document.createElement("li");
        size.innerHTML = `<strong>Size</strong>: ${data.size}`;
        const value = document.createElement("li");
        value.innerHTML = `<strong>Value</strong>: ${data.value}`;
        const drop = document.createElement("li");
        drop.innerHTML = `<strong>Drop Chance</strong>: ${data.weight} (${formatNumber(await calculateItemChance(data.weight))}%${(await calculateItemPityChance(data.name, user)).pity === 0 ? "" : `, ${formatNumber((await calculateItemChance(data.weight)) + (await calculateItemPityChance(data.name, user)).pity)}% pity`})`;
        const buyable = document.createElement("li");
        buyable.innerHTML = `<strong>Buyable</strong>: ${data.buy ? "Yes" : "No"}`;
        const sellable = document.createElement("li");
        sellable.innerHTML = `<strong>Sellable</strong>: ${data.sell ? "Yes" : "No"}`;
        const scavenge = document.createElement("li");
        scavenge.innerHTML = `<strong>Can Scavenge</strong>: ${data.canScavenge ? "Yes" : "No"}`;
        const lootbox = document.createElement("li");
        lootbox.innerHTML = `<strong>In Lootboxes</strong>: ${data.inLootbox ? "Yes" : "No"}`;

        const frag = document.createDocumentFragment();

        frag.appendChild(size);
        frag.appendChild(value);
        frag.appendChild(drop);
        frag.appendChild(buyable);
        frag.appendChild(sellable);
        frag.appendChild(scavenge);
        frag.appendChild(lootbox);

        ul.appendChild(frag);

        const divFrag = document.createDocumentFragment();
        divFrag.appendChild(header);
        divFrag.appendChild(ul);

        const recipe = data.recipe;
        if (recipe) {
            const iName = document.createElement("h3");
            iName.innerHTML = `Recipe (outputs x${recipe.amount})`;

            const table = document.createElement("table");
            table.className =
                "table table-dark table-striped table-hover table-responsive";

            const head = document.createElement("thead");
            const row = document.createElement("tr");
            const th1 = document.createElement("th");
            th1.innerHTML = "Ingredient";
            const th2 = document.createElement("th");
            th2.innerHTML = "Quantity";

            const recFrag = document.createDocumentFragment();

            recFrag.appendChild(th1);
            recFrag.appendChild(th2);

            row.appendChild(recFrag);
            head.appendChild(row);

            const body = document.createElement("tbody");
            for (const ingredient of recipe.ingredients) {
                const row = document.createElement("tr");

                const inName = document.createElement("td");
                const amount = document.createElement("td");

                if (ingredient.item) {
                    const link = document.createElement("a");
                    link.href = `/item?item=${ingredient.item.name}&user=${user}`;
                    link.className = "text-light";

                    link.innerHTML = ingredient.item.name;
                    inName.appendChild(link);
                    amount.innerHTML = ingredient.amount;
                } else {
                    const link = document.createElement("a");
                    link.href = `/item?item=${ingredient.name}&user=${user}`;
                    link.className = "text-light";

                    link.innerHTML = ingredient.name;
                    inName.appendChild(link);
                    amount.innerHTML = "1";
                }

                const fragment = document.createDocumentFragment();
                fragment.appendChild(inName);
                fragment.appendChild(amount);
                row.appendChild(fragment);
                body.appendChild(row);
            }
            const tableFragment = document.createDocumentFragment();
            tableFragment.appendChild(head);
            tableFragment.appendChild(body);
            table.appendChild(tableFragment);

            divFrag.appendChild(table);
        }
        div.appendChild(divFrag);
        const homeButton = document.getElementById("homeButton");
        homeButton.href = `/wiki?user=${user}`;
    } catch (error) {
        console.error("Error fetching item:", error);
    }
})();

async function calculateItemChance(weight) {
    try {
        const response = await fetch("/api/v1/get/items");

        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }
        const data = await response.json();
        const items = Object.values(data);

        const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);

        return (weight / totalWeight) * 100;
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

async function calculateItemPityChance(itemName, user = 0) {
    try {
        const response = await fetch(
            `/api/v1/get/pity?item=${itemName}&user=${user}`
        );

        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

function formatNumber(value) {
    if (value === 0) return "0";

    const magnitude = Math.floor(Math.log10(Math.abs(value)));
    let precision;

    if (magnitude >= 0) {
        precision = 2;
    } else {
        precision = Math.max(0, -magnitude + 2);
    }

    return value.toFixed(precision);
}
