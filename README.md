![Lines of Code by Language](LOC_bar_chart.png)

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

## V-1.2.0

### B-4

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

### B-3

-   Changed the pity system to use a formula for adding pity rather than a set number

### B-2

-   Added a pity system, increases the chance to get items you haven't received yet resetting when you get the item.

### B-1

-   Added player trading.

## V-1.1.0

### B-23

-   Added health, damage and armor stats

### B-22

-   Fixed bug with /shop and /recipe commands

### B-21

-   Fixed Ingredients list on wiki
-   Lootbox can no longer be bought

### B-20

-   Added new backpack **Satchel**.
-   Made leaderboard load faster.
-   Wiki now have ingredients link to the item page.
-   Items can no longer be bought by default.
-   CraftableItems, Recipes, and Items are now combined into one singular file.

### B-19

-   Scavenging now shows the time left until you can scavenge again

### B-18

-   Scavenging now gives the correct amount of xp

### B-17

-   /user command now shows the slots items take up
-   Fixed a bug causing you not to be able to sell items with a full backpack
-   /attributes command now shows you the amount of stat points you have available to use

### B-16

-   Added premium

### B-15

-   Wiki page generated on bot start

### B-14

-   Made wiki look slightly better

### B-13

-   Added wiki generation for items.

### B-12

-   Added support for equipping items.

### B-11

-   Fixed circular dependency error between recipes.ts and items.ts files

### B-10

-   Refactored recipe system

### B-9

-   Added equipment information to the user command

### B-7

-   Added Equipment and classes for different types of Equipment

### B-6

-   Added craft command

### B-5

-   Added recipe command

### B-1

-   Added Recipe, RecipeResult and Ingredient classes

## V-1.0.0

### B-13

-   Bot edits status when it's added to a new server

### B-12

-   Fixed bug with Scavenging see [Scavenging crashes with full backpack](https://github.com/LightBlueGamer/Prestigious/issues/1)

### B-6

-   Minor change to Player class

### B-5

-   Fixed bug causing you to lose backpack slots when adding items to it.

### B-4

-   Fixed error in deployment file

### B-3

-   Moved the version handling to functions file
-   Added botinfo command

### B-2

-   Bug fixes

### B-1

-   Public release of the bot!
