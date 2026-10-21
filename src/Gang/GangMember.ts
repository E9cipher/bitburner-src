import { IGangMemberTask } from "./GangMemberTask";
import { IGangMemberTasks } from "./GangMemberTasks";
import { GangMemberUpgrade } from "./GangMemberUpgrade";
import { GangMemberUpgrades } from "./GangMemberUpgrades";
import { IAscensionResult } from "./IAscensionResult";
import { Player } from "@player";
import { Gang } from "./Gang";
import { GangConstants } from "./data/Constants";
import { type IReviverValue, Generic_fromJSON } from "../utils/JSONReviver";
import { makeSerializable } from "../utils/GenericReviver";
import {
  calculateRespectGain,
  calculateMoneyGain,
  calculateWantedLevelGain,
  calculateAscensionMult,
  calculateAscensionPointsGain,
} from "./formulas/formulas";
import { GangMemberExpGain, GangTaskName } from "@nsdefs";
import { convertV2GangEquipmentNames } from "../utils/APIBreaks/3.0.0";
import { GangTaskNameEnum } from "./Enums";

interface IGangMemberMults {
  hack: number;
  str: number;
  def: number;
  dex: number;
  agi: number;
  cha: number;
}

interface IGangMemberStats {
  hack: number;
  str: number;
  def: number;
  dex: number;
  agi: number;
  cha: number;
}

interface IGangMemberStatsExp {
  hack_exp: number;
  str_exp: number;
  def_exp: number;
  dex_exp: number;
  agi_exp: number;
  cha_exp: number;
}

interface IGangMemberStatsMults {
  hack_mult: number;
  str_mult: number;
  def_mult: number;
  dex_mult: number;
  agi_mult: number;
  cha_mult: number;
}

interface IGangMemberAscensionPoints {
  hack_asc_points: number;
  str_asc_points: number;
  def_asc_points: number;
  dex_asc_points: number;
  agi_asc_points: number;
  cha_asc_points: number;
}

export class GangMember {
  name: string;
  taskName: GangTaskName = GangTaskNameEnum.Unassigned;

  earnedRespect = 0;

  stats: IGangMemberStats = {
    hack: 1,
    str: 1,
    def: 1,
    dex: 1,
    agi: 1,
    cha: 1,
  };

  statsMults: IGangMemberStatsMults = {
    hack_mult: 1,
    str_mult: 1,
    def_mult: 1,
    dex_mult: 1,
    agi_mult: 1,
    cha_mult: 1,
  };

  statsExp: IGangMemberStatsExp = {
    hack_exp: 0,
    str_exp: 0,
    def_exp: 0,
    dex_exp: 0,
    agi_exp: 0,
    cha_exp: 0,
  };

  ascensionPoints: IGangMemberAscensionPoints = {
    hack_asc_points: 0,
    str_asc_points: 0,
    def_asc_points: 0,
    dex_asc_points: 0,
    agi_asc_points: 0,
    cha_asc_points: 0,
  };

  upgrades: string[] = []; // Names of upgrades
  augmentations: string[] = []; // Names of augmentations only

  constructor(name = "") {
    this.name = name;
  }

  calculateSkill(exp: number, mult = 1): number {
    return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
  }

  calculateAscensionMult(points: number): number {
    return calculateAscensionMult(points);
  }

  updateSkillLevels(): void {
    this.stats.hack = this.calculateSkill(
      this.statsExp.hack_exp,
      this.statsMults.hack_mult * this.calculateAscensionMult(this.ascensionPoints.hack_asc_points),
    );
    this.stats.str = this.calculateSkill(
      this.statsExp.str_exp,
      this.statsMults.str_mult * this.calculateAscensionMult(this.ascensionPoints.str_asc_points),
    );
    this.stats.def = this.calculateSkill(
      this.statsExp.def_exp,
      this.statsMults.def_mult * this.calculateAscensionMult(this.ascensionPoints.def_asc_points),
    );
    this.stats.dex = this.calculateSkill(
      this.statsExp.dex_exp,
      this.statsMults.dex_mult * this.calculateAscensionMult(this.ascensionPoints.dex_asc_points),
    );
    this.stats.agi = this.calculateSkill(
      this.statsExp.agi_exp,
      this.statsMults.agi_mult * this.calculateAscensionMult(this.ascensionPoints.agi_asc_points),
    );
    this.stats.cha = this.calculateSkill(
      this.statsExp.cha_exp,
      this.statsMults.cha_mult * this.calculateAscensionMult(this.ascensionPoints.cha_asc_points),
    );
  }

  calculatePower(): number {
    return (this.stats.hack + this.stats.str + this.stats.def + this.stats.dex + this.stats.agi + this.stats.cha) / 95;
  }

  assignToTask(taskName: GangTaskName): boolean {
    if (!Object.hasOwn(GangTaskNameEnum, taskName)) {
      this.taskName = taskName;
      return false;
    }
    this.taskName = taskName;
    return true;
  }

  unassignFromTask(): void {
    this.taskName = GangTaskNameEnum.Unassigned;
  }

  getTask(): IGangMemberTask {
    if (Object.hasOwn(IGangMemberTasks, this.taskName)) {
      return IGangMemberTasks[this.taskName];
    }
    return IGangMemberTasks.Unassigned;
  }

  calculateRespectGain(gang: Gang): number {
    const task = this.getTask();
    const g = {
      respect: gang.respect,
      wantedLevel: gang.wanted,
      territory: gang.getTerritory(),
    };
    return calculateRespectGain(g, this, task);
  }

  calculateWantedLevelGain(gang: Gang): number {
    const task = this.getTask();
    const g = {
      respect: gang.respect,
      wantedLevel: gang.wanted,
      territory: gang.getTerritory(),
    };
    return calculateWantedLevelGain(g, this, task);
  }

  calculateMoneyGain(gang: Gang): number {
    const task = this.getTask();
    const g = {
      respect: gang.respect,
      wantedLevel: gang.wanted,
      territory: gang.getTerritory(),
    };
    return calculateMoneyGain(g, this, task);
  }

  expMult(): IGangMemberMults {
    return {
      hack: (this.statsMults.hack_mult - 1) / 4 + 1,
      str: (this.statsMults.str_mult - 1) / 4 + 1,
      def: (this.statsMults.def_mult - 1) / 4 + 1,
      dex: (this.statsMults.dex_mult - 1) / 4 + 1,
      agi: (this.statsMults.agi_mult - 1) / 4 + 1,
      cha: (this.statsMults.cha_mult - 1) / 4 + 1,
    };
  }

  // Calculate our gain for each stat based on each modifier of member
  // if no task is assigned to that member we return null, other wise we
  // return an object containing our per-cycle gains for each stat.
  calculateExpGain(numCycles = 1): GangMemberExpGain | null {
    const task = this.getTask();
    if (task === IGangMemberTasks.Unassigned) return null;

    const expValues = {
      hack_exp: 0,
      str_exp: 0,
      def_exp: 0,
      dex_exp: 0,
      agi_exp: 0,
      cha_exp: 0,
    };

    const difficultyMult = Math.pow(task.difficulty, 0.9);
    const difficultyPerCycles = difficultyMult * numCycles;
    const weightDivisor = 1500;
    const expMult = this.expMult();

    expValues.hack_exp +=
      (task.hackWeight / weightDivisor) *
      difficultyPerCycles *
      expMult.hack *
      this.calculateAscensionMult(this.ascensionPoints.hack_asc_points);

    expValues.str_exp +=
      (task.strWeight / weightDivisor) *
      difficultyPerCycles *
      expMult.str *
      this.calculateAscensionMult(this.ascensionPoints.str_asc_points);

    expValues.def_exp +=
      (task.defWeight / weightDivisor) *
      difficultyPerCycles *
      expMult.def *
      this.calculateAscensionMult(this.ascensionPoints.def_asc_points);

    expValues.dex_exp +=
      (task.dexWeight / weightDivisor) *
      difficultyPerCycles *
      expMult.dex *
      this.calculateAscensionMult(this.ascensionPoints.dex_asc_points);

    expValues.agi_exp +=
      (task.agiWeight / weightDivisor) *
      difficultyPerCycles *
      expMult.agi *
      this.calculateAscensionMult(this.ascensionPoints.agi_asc_points);

    expValues.cha_exp +=
      (task.chaWeight / weightDivisor) *
      difficultyPerCycles *
      expMult.cha *
      this.calculateAscensionMult(this.ascensionPoints.cha_asc_points);

    return expValues;
  }

  gainExperience(numCycles: number): void {
    // Do the calculations if our function returns null meaning no task is assigned
    // then we return otherwise we add our exp gains to our total values
    const gains = this.calculateExpGain(numCycles);
    if (gains === null) {
      return;
    }

    this.statsExp.hack_exp += gains.hack_exp;
    this.statsExp.str_exp += gains.str_exp;
    this.statsExp.def_exp += gains.def_exp;
    this.statsExp.dex_exp += gains.dex_exp;
    this.statsExp.agi_exp += gains.agi_exp;
    this.statsExp.cha_exp += gains.cha_exp;
  }

  earnRespect(numCycles = 1, gang: Gang): number {
    const earnedRespect = this.calculateRespectGain(gang) * numCycles;
    this.earnedRespect += earnedRespect;
    return earnedRespect;
  }

  getGainedAscensionPoints(): IGangMemberMults {
    return {
      hack: calculateAscensionPointsGain(this.statsExp.hack_exp),
      str: calculateAscensionPointsGain(this.statsExp.str_exp),
      def: calculateAscensionPointsGain(this.statsExp.def_exp),
      dex: calculateAscensionPointsGain(this.statsExp.dex_exp),
      agi: calculateAscensionPointsGain(this.statsExp.agi_exp),
      cha: calculateAscensionPointsGain(this.statsExp.cha_exp),
    };
  }

  canAscend(): boolean {
    const points = this.getGainedAscensionPoints();
    return points.hack > 0 || points.str > 0 || points.def > 0 || points.dex > 0 || points.agi > 0 || points.cha > 0;
  }

  getCurrentAscensionMults(): IGangMemberMults {
    return {
      hack: this.calculateAscensionMult(this.ascensionPoints.hack_asc_points),
      str: this.calculateAscensionMult(this.ascensionPoints.str_asc_points),
      def: this.calculateAscensionMult(this.ascensionPoints.def_asc_points),
      dex: this.calculateAscensionMult(this.ascensionPoints.dex_asc_points),
      agi: this.calculateAscensionMult(this.ascensionPoints.agi_asc_points),
      cha: this.calculateAscensionMult(this.ascensionPoints.cha_asc_points),
    };
  }

  getAscensionMultsAfterAscend(): IGangMemberMults {
    const points = this.getGainedAscensionPoints();
    return {
      hack: this.calculateAscensionMult(this.ascensionPoints.hack_asc_points + points.hack),
      str: this.calculateAscensionMult(this.ascensionPoints.str_asc_points + points.str),
      def: this.calculateAscensionMult(this.ascensionPoints.def_asc_points + points.def),
      dex: this.calculateAscensionMult(this.ascensionPoints.dex_asc_points + points.dex),
      agi: this.calculateAscensionMult(this.ascensionPoints.agi_asc_points + points.agi),
      cha: this.calculateAscensionMult(this.ascensionPoints.cha_asc_points + points.cha),
    };
  }

  getAscensionResults(): IGangMemberMults {
    const postAscend = this.getAscensionMultsAfterAscend();
    const preAscend = this.getCurrentAscensionMults();

    return {
      hack: postAscend.hack / preAscend.hack,
      str: postAscend.str / preAscend.str,
      def: postAscend.def / preAscend.def,
      dex: postAscend.dex / preAscend.dex,
      agi: postAscend.agi / preAscend.agi,
      cha: postAscend.cha / preAscend.cha,
    };
  }

  getPostInstallPoints(): IGangMemberMults {
    return {
      hack: this.ascensionPoints.hack_asc_points * GangConstants.InstallAscensionPenalty,
      str: this.ascensionPoints.str_asc_points * GangConstants.InstallAscensionPenalty,
      def: this.ascensionPoints.def_asc_points * GangConstants.InstallAscensionPenalty,
      dex: this.ascensionPoints.dex_asc_points * GangConstants.InstallAscensionPenalty,
      agi: this.ascensionPoints.agi_asc_points * GangConstants.InstallAscensionPenalty,
      cha: this.ascensionPoints.cha_asc_points * GangConstants.InstallAscensionPenalty,
    };
  }

  ascend(): IAscensionResult {
    const res = this.getAscensionResults();
    const points = this.getGainedAscensionPoints();
    this.ascensionPoints.hack_asc_points += points.hack;
    this.ascensionPoints.str_asc_points += points.str;
    this.ascensionPoints.def_asc_points += points.def;
    this.ascensionPoints.dex_asc_points += points.dex;
    this.ascensionPoints.agi_asc_points += points.agi;
    this.ascensionPoints.cha_asc_points += points.cha;

    // Remove upgrades. Then re-calculate multipliers and stats
    this.upgrades.length = 0;
    this.statsMults.hack_mult = 1;
    this.statsMults.str_mult = 1;
    this.statsMults.def_mult = 1;
    this.statsMults.dex_mult = 1;
    this.statsMults.agi_mult = 1;
    this.statsMults.cha_mult = 1;
    for (let i = 0; i < this.augmentations.length; ++i) {
      const aug = GangMemberUpgrades[this.augmentations[i]];
      this.applyUpgrade(aug);
    }

    // Clear exp and recalculate stats
    this.statsExp.hack_exp = 0;
    this.statsExp.str_exp = 0;
    this.statsExp.def_exp = 0;
    this.statsExp.dex_exp = 0;
    this.statsExp.agi_exp = 0;
    this.statsExp.cha_exp = 0;
    this.updateSkillLevels();

    const respectToDeduct = this.earnedRespect;
    this.earnedRespect = 0;
    return {
      respect: respectToDeduct,
      hack: res.hack,
      str: res.str,
      def: res.def,
      dex: res.dex,
      agi: res.agi,
      cha: res.cha,
    };
  }

  applyUpgrade(upg: GangMemberUpgrade): void {
    if (upg.mults.str != null) this.statsMults.str_mult *= upg.mults.str;
    if (upg.mults.def != null) this.statsMults.def_mult *= upg.mults.def;
    if (upg.mults.dex != null) this.statsMults.dex_mult *= upg.mults.dex;
    if (upg.mults.agi != null) this.statsMults.agi_mult *= upg.mults.agi;
    if (upg.mults.cha != null) this.statsMults.cha_mult *= upg.mults.cha;
    if (upg.mults.hack != null) this.statsMults.hack_mult *= upg.mults.hack;
  }

  buyUpgrade(upg: GangMemberUpgrade): boolean {
    if (!Player.gang) throw new Error("Tried to buy a gang member upgrade when no gang was present");

    // Prevent purchasing of already-owned upgrades
    if (this.augmentations.includes(upg.name) || this.upgrades.includes(upg.name)) return false;

    if (Player.money < Player.gang.getUpgradeCost(upg)) return false;
    Player.loseMoney(Player.gang.getUpgradeCost(upg), "gang_expenses");
    if (upg.type === "g") {
      this.augmentations.push(upg.name);
    } else {
      this.upgrades.push(upg.name);
    }
    this.applyUpgrade(upg);
    return true;
  }

  /** Custom load handling */
  static jsonReviver(value: IReviverValue): GangMember {
    const member = Generic_fromJSON(GangMember, value.data, GangMember.includedKeys);
    for (let i = 0; i < member.upgrades.length; ++i) {
      member.upgrades[i] = convertV2GangEquipmentNames(member.upgrades[i]);
    }
    return member;
  }

  static includedKeys = makeSerializable("GangMember", GangMember);
}
