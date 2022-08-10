import { clans } from "../../database/main";
import { Player } from "./Player";

export enum ClanRanks {
    Member,
    Soldier,
    General,
    Leader,
}

export class Clan {
    name: string;
    level: number;
    vault: number;
    exp: number;
    members: Clan.Members;
    stats: Clan.Stats;
    statPoints: number;
    invites: string[];
    constructor(
        name: string,
        level: number = 1,
        vault: number = 0,
        exp: number = 0,
        members: Clan.Members = [],
        stats: Clan.Stats = {
            xpMultiplier: 1,
            coinMultiplier: 1,
        },
        statPoints: number = 0,
        invites: string[] = [],
    ) {
        this.name = name;
        this.level = level;
        this.vault = vault;
        this.exp = exp;
        this.members = members;
        this.stats = stats;
        this.statPoints = statPoints;
        this.invites = invites;
    }

    getMember(id: string) {
        return this.members.find(member => member.id === id);
    };

    getRank(member: Clan.Member) {
        if(member.rank === ClanRanks.Leader) return ClanRanks.Leader;
        if(member.rank === ClanRanks.General) return ClanRanks.General;
        if(member.rank === ClanRanks.Soldier) return ClanRanks.Soldier;
        return ClanRanks.Member;
    }

    getInvite(id: string) {
        return this.invites.find(invite => invite === id);
    }

    addInvite(id: string, invitee: Clan.Member) {
        if(this.getRank(invitee) < ClanRanks.Soldier) return;
        if(this.getInvite(id)) return;
        return this.invites.push(id), this.invites;
    }

    removeInvite(id: string, member: Clan.Member) {
        if(this.getRank(member) < ClanRanks.Soldier) return;
        if(!this.getInvite(id)) return;
        return this.invites.splice(this.invites.indexOf(id), 1), this.invites;
    }

    addMember(id: string, rank: ClanRanks = ClanRanks.Member) {
        if(!this.getInvite(id)) return
        this.invites.splice(this.invites.indexOf(id), 1);
        return this.members.push({
            id,
            rank,
            totalContribution: {
                xp: 0,
                coins: 0,
            },
            joined: Date.now(),
            autoContribute: 0,
        }), this.members;
    }

    removeMember(member: Clan.Member, executor: Clan.Member) {
        if(this.getRank(executor) < ClanRanks.General) return;
        if(!this.getMember(member.id)) return;
        return this.members.splice(this.members.indexOf(member), 1), this.members;
    }

    leave(member: Clan.Member) {
        if(this.getRank(member) === ClanRanks.Leader) this.getMembersRankSorted[0].rank = ClanRanks.Leader;
        return this.members.splice(this.members.indexOf(member), 1), this.members;
    }

    increaseXpBoost(amount: number) {
        if(this.statPoints - amount < 0) return;
        this.statPoints -= amount;
        return this.stats.xpMultiplier += (0.1 * amount), this.stats;
    }

    increaseCoinBoost(amount: number) {
        if(this.statPoints - amount < 0) return;
        this.statPoints -= amount;
        return this.stats.coinMultiplier += (0.1 * amount), this.stats;
    }

    get xpRequired() {
        return this.level * 3000;
    }

    canLevelUp() {
        const xpRequirement = this.exp >= this.xpRequired;
        const moneyRequirement = this.vault >= this.level * 10000;
        return xpRequirement && moneyRequirement;
    }

    levelUp(amount: number) {
        if(this.level === this.maxLevel) return;
        if(!this.canLevelUp()) return;
        this.exp -= amount;
        this.vault -= this.level * 10000;
        this.statPoints++;
        return this.level++;
    }

    get maxVaulted() {
        return this.level * 10000 * 1.5;
    }

    async deposit(member: Clan.Member, amount: number) {
        if(this.vault + amount > this.maxVaulted) return;
        const player = await Player.get(member.id);
        player.removeCoins(amount);
        player.save();
        return this.vault += amount, this.vault;
    }

    async withdraw(member: Clan.Member, amount: number) {
        if(this.vault - amount < 0) return;
        const player = await Player.get(member.id);
        player.addSetCoins(amount);
        player.save();
        return this.vault -= amount, this.vault;
    }

    async addXp(member: Clan.Member, amount: number) {
        const player = await Player.get(member.id);
        if(player.xp - amount < 0) return;
        player.xp -= amount;
        player.save();
        this.exp += amount;
        while(this.canLevelUp()) {
            this.levelUp(this.xpRequired);
        }
        return this.level;
    }

    promoteMember(member: Clan.Member, executor: Clan.Member) {
        if(this.getRank(executor) >= this.getRank(member)) return;
        if(this.getRank(member) <= ClanRanks.General) return;
        return member.rank++, member;
    }

    demoteMember(member: Clan.Member, executor: Clan.Member) {
        if(this.getRank(executor) >= this.getRank(member)) return;
        if(this.getRank(member) <= ClanRanks.Member) return;
        return member.rank--, member;
    }

    setLeader(member: Clan.Member, executor: Clan.Member) {
        if(this.getRank(executor) !== ClanRanks.Leader) return;
        member.rank = ClanRanks.Leader;
    }

    get getMembers() {
        return this.members.sort((a, b) => b.totalContribution.xp - a.totalContribution.xp || b.totalContribution.coins - a.totalContribution.coins);
    }

    get getMembersRankSorted() {
        return this.members.sort((a, b) => a.rank - b.rank);
    }

    get getInvites() {
        return this.invites.map(async (invite) => {
            return Player.get(invite);
        });
    }

    get maxLevel() {
        let max = 2;
        for(let i=1; i<=this.members.length; i++) {
            if(i === 1) continue;
            max += i;
        }
        return max;
    }

    toJSON() {
        return {
            name: this.name,
            level: this.level,
            vault: this.vault,
            exp: this.exp,
            members: this.members,
            stats: this.stats,
            statPoints: this.statPoints,
            invites: this.invites,
        };
    }

    static fromJSON(object: Clan.JSON) {
        return new Clan(
            object.name,
            object.level,
            object.vault,
            object.exp,
            object.members,
            object.stats,
            object.statPoints,
            object.invites,
        );
    }

    static async get(name: string, executor?: string) {
        const defaultClan = new Clan(name);
        if(executor) defaultClan.addMember(executor, ClanRanks.Leader);
        const dbClan = await clans.ensure(name, defaultClan.toJSON());
        return Clan.fromJSON(dbClan);
    }

    static async getFromUser(id: string) {
        const clan = await clans.find(clan => clan.members.find(member => member.id === id)?.id === id);
        if(!clan) return
        return Clan.fromJSON(clan);
    }

    static async getClan(name: string) {
        const clan = await clans.find(clan => clan.name === name);
        if(!clan) return
        return Clan.fromJSON(clan);
    }

    async save() {
        return clans.set(this.name, this.toJSON());
    }
}

export namespace Clan {
    export interface Member {
        id: string;
        rank: number;
        totalContribution: Clan.Contribution;
        joined: number;
        autoContribute: number;        
    }

    export type Members = Member[];

    export interface Stats {
        xpMultiplier: number;
        coinMultiplier: number;
    }

    export interface Contribution {
        xp: number;
        coins: number;
    }

    export interface JSON {
        name: string;
        level: number;
        vault: number;
        exp: number;
        members: Members;
        stats: Stats;
        statPoints: number;
        invites: string[];
    }
}