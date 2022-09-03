async function getLeaderboard() {
    const response = await fetch("https://api.litecraft.org/prestigious/v1/get/leaderboard", { 
      method: "GET",
    });

    const data = await response.json();
    const body = document.getElementById("leaderboardBody");

    data.forEach((v, i) => {
        const row = document.createElement("tr");
        row.classList.add("leaderboard");
        body.appendChild(row);
        const placement = document.createElement("td");
        placement.classList.add("leaderboard");
        placement.innerHTML = `#${i+1}`;
        row.appendChild(placement);
        const user = document.createElement("td");
        user.classList.add("leaderboard");
        user.innerHTML = `<a href="/user?id=${v.id}">${v.tag}</a>`;
        row.appendChild(user);
        const prestige = document.createElement("td");
        prestige.classList.add("leaderboard");
        prestige.innerHTML = `${v.prestige}`;
        row.appendChild(prestige);
        const level = document.createElement("td");
        level.classList.add("leaderboard");
        level.innerHTML = `${v.level}`;
        row.appendChild(level);
        const xp = document.createElement("td");
        xp.classList.add("leaderboard");
        xp.innerHTML = `${v.xp}`;
        row.appendChild(xp);
        const coins = document.createElement("td");
        coins.classList.add("leaderboard");
        coins.innerHTML = `${v.coins}`;
        row.appendChild(coins);
    })
}

async function getUser() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const response = await fetch(`https://api.litecraft.org/prestigious/v1/get/player?id=${id}`, { 
      method: "GET",
    });

    const inventory = await fetch(`https://api.litecraft.org/prestigious/v1/get/inventory?id=${id}`, { 
      method: "GET",
    });
    
    const player = await response.json();
    const items = await inventory.json();
    
    document.getElementById("playerName").innerHTML = `${player.tag}`;
    const playerStats = document.getElementById("playerStats");
    const stats = document.createElement("h2");
    stats.innerHTML = `Prestige: ${player.prestige} - Level: ${player.level}<br>Exp: ${player.xp} - Coins: ${player.coins}`;
    playerStats.appendChild(stats);

    const body = document.getElementById("inventory");

    for(const item of items) {
        const row = document.createElement("tr");
        row.style.backgroundColor = item.rarity.color;
        body.appendChild(row);
        const amount = document.createElement("td");
        const itemName = document.createElement("td");
        const rarity = document.createElement("td");
        amount.innerHTML = `${item.amount}`;
        itemName.innerHTML = `${item.name}`;
        rarity.innerHTML = `${item.rarity.name}`;
        row.appendChild(amount);
        row.appendChild(itemName);
        row.appendChild(rarity);
    };
};