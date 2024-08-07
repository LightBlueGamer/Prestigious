![Lines of Code by Language](https://prestigious-bot.xyz/assets/code-stats.png)

# Prestigious

Prestigious is an RPG/Adventure bot with hard-core leveling to keep you at the grind always! With features such as scavenging, levels, prestiges and more there will always be things to do!

## Features

### Leveling

Level up and prestige infinitely to become #1 and earn massive rewards at the end of the season!

### Economy

Earn money to buy items from the shop or sell them to reach the top of the leaderboard and earn rewards at the end of the season! (More features coming soon!)

### Lootboxes

Find lootboxes while scavenging to get random rewards to help you reach the top of the leaderboard

### Scavenging

Scavenge for items & lost treasures to either sell or use to reach the top of the leaderboard

### Crafting

Craft new items with resources gained from scavenging

### Trading

Trade with other players!

## V-1.4.3

-   Leaderboard now loads faster
-   /ping now works as intended

## V-1.4.2

-   Fixed infinite money glitch with sell command

## V-1.4.1

-   Fixed an issue causing all items without a weight to get pity

## V-1.4.0

-   /recipe command now shows nested recipes
-   Added new recipes
-   Added new item type "healing"
-   Data saves before bot shuts down/restarts
-   Amount is now optional for the /sell command

## V-1.3.0

-   Massive overhaul of the Player class for more efficiency.
-   Backpack in the /user command now only displays 10 items.
-   Bot now uses a save queue system to discourage duplicate players.
-   Leaderboard now has buttons to go to next, previous, and the page with yourself on it.
-   Improved /trade command.
-   Damage and Armor now shows correct values.
-   Player.get() now gets from cache if existing before fetching from database.
-   Documentation is now hosted [here](https://prestigious-bot.xyz/docs).
-   Bot now automatically deploys commands on startup to update commands.
-   Added /backpack command to view your entire backpack

## V-1.2.0

-   Changed prices of items
-   All craftable items now have the combined price of all ingredients
-   The wiki is now fully dynamic and shows your pity
-   The API system has been merged to include the server-side
-   The wiki has been changed to be served from the public/ folder
-   Added a function to get a existing player from the ID without the client
-   Added API for fetching all existing items
-   Added API for fetching a singular item
-   Added API for fetching a players pity %
-   The /item command now links to the new wiki page
-   Changed the pity system to use a formula for adding pity rather than a set number
-   Added a pity system, increases the chance to get items you haven't received yet resetting when you get the item.
-   Added player trading.

## V-1.1.0

-   Added health, damage and armor stats
-   Fixed bug with /shop and /recipe commands
-   Fixed Ingredients list on wiki
-   Lootbox can no longer be bought
-   Added new backpack **Satchel**.
-   Made leaderboard load faster.
-   Wiki now have ingredients link to the item page.
-   Items can no longer be bought by default.
-   CraftableItems, Recipes, and Items are now combined into one singular file.
-   Scavenging now shows the time left until you can scavenge again
-   Scavenging now gives the correct amount of xp
-   /user command now shows the slots items take up
-   Fixed a bug causing you not to be able to sell items with a full backpack
-   /attributes command now shows you the amount of stat points you have available to use
-   Added premium
-   Wiki page generated on bot start
-   Made wiki look slightly better
-   Added wiki generation for items.
-   Added support for equipping items.
-   Fixed circular dependency error between recipes.ts and items.ts files
-   Refactored recipe system
-   Added equipment information to the user command
-   Added Equipment and classes for different types of Equipment
-   Added craft command
-   Added recipe command
-   Added Recipe, RecipeResult and Ingredient classes

## V-1.0.0

-   Bot edits status when it's added to a new server
-   Fixed bug with Scavenging see [Scavenging crashes with full backpack](https://github.com/LightBlueGamer/Prestigious/issues/1)
-   Minor change to Player class
-   Fixed bug causing you to lose backpack slots when adding items to it.
-   Fixed error in deployment file
-   Moved the version handling to functions file
-   Added botinfo command
-   Bug fixes
-   Public release of the bot!
