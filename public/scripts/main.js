(async function fetchItems() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user") || "0";

        const response = await fetch("/api/v1/get/items");

        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }
        const data = await response.json();

        data.sort((a, b) => a.name.localeCompare(b.name));

        const list = document.getElementById("itemList");
        list.innerHTML = "";

        for (const item of data) {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";

            const link = document.createElement("a");
            link.href = `wiki/item?item=${item.name}&user=${user}`;
            link.textContent = item.name;
            listItem.appendChild(link);
            list.appendChild(listItem);
        }
        const homeButton = document.getElementById("homeButton");
        homeButton.href = `/wiki?user=${user}`;
    } catch (error) {
        console.error("Error fetching items:", error);
    }
})();
