import { Ability } from "../../classes/Ability";
import { BattleStateSchema } from "../../state";
import { Battler } from "../../classes/Battler";
import { Boost } from "../../classes/Boost";
import {
  CombatAmbushEvent,
  CombatBleedStartEvent,
  CombatBoostEvent,
  CombatDamageEvent,
  CombatDeathEvent,
  CombatDefeatEvent,
  CombatDropEvent,
  CombatEvent,
  CombatEventType,
  CombatExperienceEvent,
  CombatFriendlyTargetFailureEvent,
  CombatGainStatEvent,
  CombatGoldEvent,
  CombatInstakillEvent,
  CombatInstakillFinishEvent,
  CombatInventoryFullEvent,
  CombatLevelUpEvent,
  CombatNewLevelEvent,
  CombatObtainEvent,
  CombatPoisonStartEvent,
  CombatRejuvenateEvent,
  CombatRenewEvent,
  CombatUseAbilityEvent,
  CombatUseItemEvent,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  CreateLabelOptionsTextTrim,
  State,
} from "pixel-pigeon";
import { Item } from "../../classes/Item";
import { getBattleState } from "../state/getBattleState";
import { getCombatantName } from "./getCombatantName";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../getFormattedInteger";
import { getStatName } from "../stats/getStatName";

export const getCombatEventText = (
  combatEvent: CombatEvent,
): CreateLabelOptionsText => {
  switch (combatEvent.type) {
    case CombatEventType.Ambush: {
      const battleAmbushEvent: CombatAmbushEvent =
        combatEvent as CombatAmbushEvent;
      const battleState: State<BattleStateSchema> = getBattleState();
      return {
        value:
          battleState.values.teamIndex === battleAmbushEvent.teamIndex
            ? "...but they don't notice you."
            : "They ambush you!",
      };
    }
    case CombatEventType.Approach: {
      const battleState: State<BattleStateSchema> = getBattleState();
      return {
        value:
          battleState.values.enemyBattlersCount > 1
            ? "Enemies approach."
            : "An enemy approaches.",
      };
    }
    case CombatEventType.BleedStart: {
      const bleedStartCombatEvent: CombatBleedStartEvent =
        combatEvent as CombatBleedStartEvent;
      const battlerName: string = getCombatantName({
        monsterName: bleedStartCombatEvent.target.monsterName,
        username: bleedStartCombatEvent.target.username,
      });
      return {
        trims: [
          {
            index: 0,
            length: battlerName.length,
          },
        ],
        value: `${battlerName} begins to bleed.`,
      };
    }
    case CombatEventType.Boost: {
      const boostCombatEvent: CombatBoostEvent =
        combatEvent as CombatBoostEvent;
      const boost: Boost = getDefinable(Boost, boostCombatEvent.boostID);
      return {
        trims: [
          {
            index: 0,
            length: boostCombatEvent.username.length,
          },
        ],
        value: `${boostCombatEvent.username} gains ${getFormattedInteger(
          boost.amount,
        )} ${getStatName(boost.stat)}.`,
      };
    }
    case CombatEventType.Crit: {
      return {
        value: "An excellent move!",
      };
    }
    case CombatEventType.Damage: {
      const damageCombatEvent: CombatDamageEvent =
        combatEvent as CombatDamageEvent;
      const damageAmount: string = getFormattedInteger(
        damageCombatEvent.amount,
      );
      const battlerName: string = getCombatantName({
        monsterName: damageCombatEvent.target.monsterName,
        username: damageCombatEvent.target.username,
      });
      const verb: string =
        damageCombatEvent.isPoison === true
          ? "sickens for"
          : damageCombatEvent.isBleed === true
            ? "bleeds for"
            : damageCombatEvent.isRedirected === true
              ? "guards for"
              : "takes";
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof damageCombatEvent.target.username !== "undefined") {
        trims.push({
          index: 0,
          length: battlerName.length,
        });
      }
      const value: string = `${battlerName} ${verb} ${damageAmount} damage.`;
      return {
        trims,
        value,
      };
    }
    case CombatEventType.Death: {
      const deathCombatEvent: CombatDeathEvent =
        combatEvent as CombatDeathEvent;
      const battlerName: string = getCombatantName({
        monsterName: deathCombatEvent.target.monsterName,
        username: deathCombatEvent.target.username,
      });
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof deathCombatEvent.target.username !== "undefined") {
        trims.push({
          index: 0,
          length: battlerName.length,
        });
      }
      return {
        trims,
        value: `${battlerName} is defeated!`,
      };
    }
    case CombatEventType.Defeat: {
      const defeatCombatEvent: CombatDefeatEvent =
        combatEvent as CombatDefeatEvent;
      const battleState: State<BattleStateSchema> = getBattleState();
      const verb: string = defeatCombatEvent.wasFled ? "evaded" : "defeated";
      if (defeatCombatEvent.winningTeamIndex === battleState.values.teamIndex) {
        if (battleState.values.enemyBattlersCount > 1) {
          return { value: `The enemies are ${verb}...` };
        }
        return { value: `The enemy is ${verb}...` };
      }
      return {
        value: `You are ${verb}...`,
      };
    }
    case CombatEventType.Drop: {
      const dropCombatEvent: CombatDropEvent = combatEvent as CombatDropEvent;
      return {
        trims: [
          {
            index: 0,
            length: dropCombatEvent.username.length,
          },
        ],
        value: `${dropCombatEvent.username} finds an item on the ground.`,
      };
    }
    case CombatEventType.Experience: {
      const experienceCombatEvent: CombatExperienceEvent =
        combatEvent as CombatExperienceEvent;
      return {
        value: `You gain ${getFormattedInteger(
          experienceCombatEvent.amount,
        )} experience.`,
      };
    }
    case CombatEventType.FleeFailure: {
      return {
        value: "...but fails to flee the battle.",
      };
    }
    case CombatEventType.FleeSuccess: {
      return {
        value: "...and successfully flees the battle!",
      };
    }
    case CombatEventType.FriendlyTargetFailure: {
      const friendlyTargetFailureCombatEvent: CombatFriendlyTargetFailureEvent =
        combatEvent as CombatFriendlyTargetFailureEvent;
      const battlerName: string = getCombatantName({
        monsterName: friendlyTargetFailureCombatEvent.target.monsterName,
        username: friendlyTargetFailureCombatEvent.target.username,
      });
      let value: string = "...but ";
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (
        typeof friendlyTargetFailureCombatEvent.target.username !== "undefined"
      ) {
        trims.push({
          index: value.length,
          length: battlerName.length,
        });
      }
      value += `${battlerName} is defeated.`;
      return {
        trims,
        value,
      };
    }
    case CombatEventType.Gold: {
      const goldCombatEvent: CombatGoldEvent = combatEvent as CombatGoldEvent;
      const battleState: State<BattleStateSchema> = getBattleState();
      const battler: Battler = getDefinable(
        Battler,
        battleState.values.battlerID,
      );
      return {
        value: `You ${
          goldCombatEvent.winningTeamIndex === battleState.values.teamIndex
            ? "find"
            : "lose"
        } ${
          goldCombatEvent.winningTeamIndex === battleState.values.teamIndex
            ? getFormattedInteger(goldCombatEvent.amount)
            : battler.gold
        } gold.`,
      };
    }
    case CombatEventType.GainStat: {
      const gainStatEvent: CombatGainStatEvent =
        combatEvent as CombatGainStatEvent;
      return {
        trims: [
          {
            index: 0,
            length: gainStatEvent.username.length,
          },
        ],
        value: `${gainStatEvent.username} gains ${getFormattedInteger(
          gainStatEvent.amount,
        )} ${getStatName(gainStatEvent.stat)}.`,
      };
    }
    case CombatEventType.Heal: {
      const damageCombatEvent: CombatDamageEvent =
        combatEvent as CombatDamageEvent;
      const battlerName: string = getCombatantName({
        monsterName: damageCombatEvent.target.monsterName,
        username: damageCombatEvent.target.username,
      });
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof damageCombatEvent.target.username !== "undefined") {
        trims.push({
          index: 0,
          length: battlerName.length,
        });
      }
      return {
        trims,
        value: `${battlerName} recovers ${getFormattedInteger(
          damageCombatEvent.amount,
        )} HP.`,
      };
    }
    case CombatEventType.Instakill: {
      const instakillCombatEvent: CombatInstakillEvent =
        combatEvent as CombatInstakillEvent;
      const battlerName: string = getCombatantName({
        monsterName: instakillCombatEvent.target.monsterName,
        username: instakillCombatEvent.target.username,
      });
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof instakillCombatEvent.target.username !== "undefined") {
        trims.push({
          index: 0,
          length: battlerName.length,
        });
      }
      return {
        trims,
        value: `${battlerName} is drawn into the light.`,
      };
    }
    case CombatEventType.InstakillFinish: {
      const instakillFinishCombatEvent: CombatInstakillFinishEvent =
        combatEvent as CombatInstakillFinishEvent;
      const battlerName: string = getCombatantName({
        monsterName: instakillFinishCombatEvent.target.monsterName,
        username: instakillFinishCombatEvent.target.username,
      });
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof instakillFinishCombatEvent.target.username !== "undefined") {
        trims.push({
          index: 0,
          length: battlerName.length,
        });
      }
      return {
        trims,
        value: `${battlerName} is drawn into the light.`,
      };
    }
    case CombatEventType.InventoryFull: {
      const inventoryFullEvent: CombatInventoryFullEvent =
        combatEvent as CombatInventoryFullEvent;
      let value: string = "...but ";
      const nameIndex: number = value.length;
      value += `${inventoryFullEvent.username} has no space for ${
        getDefinable(Item, inventoryFullEvent.itemID).name
      }.`;
      return {
        trims: [
          {
            index: nameIndex,
            length: inventoryFullEvent.username.length,
          },
        ],
        value,
      };
    }
    case CombatEventType.LevelUp: {
      const levelUpEvent: CombatLevelUpEvent =
        combatEvent as CombatLevelUpEvent;
      if (levelUpEvent.amount > 1) {
        return {
          trims: [
            {
              index: 0,
              length: levelUpEvent.username.length,
            },
          ],
          value: `${levelUpEvent.username} levels up ${getFormattedInteger(
            levelUpEvent.amount,
          )} times!`,
        };
      }
      return {
        trims: [
          {
            index: 0,
            length: levelUpEvent.username.length,
          },
        ],
        value: `${levelUpEvent.username} levels up!`,
      };
    }
    case CombatEventType.Miss: {
      return { value: "...but it misses." };
    }
    case CombatEventType.NewLevel: {
      const newLevelEvent: CombatNewLevelEvent =
        combatEvent as CombatNewLevelEvent;
      return {
        trims: [
          {
            index: 0,
            length: newLevelEvent.username.length,
          },
        ],
        value: `${newLevelEvent.username} is now level ${getFormattedInteger(
          newLevelEvent.level,
        )}.`,
      };
    }
    case CombatEventType.Obtain: {
      const obtainCombatEvent: CombatObtainEvent =
        combatEvent as CombatObtainEvent;
      return {
        trims: [
          {
            index: 0,
            length: obtainCombatEvent.username.length,
          },
        ],
        value: `${obtainCombatEvent.username} gets ${
          getDefinable(Item, obtainCombatEvent.itemID).name
        }!`,
      };
    }
    case CombatEventType.PoisonStart: {
      const poisonStartCombatEvent: CombatPoisonStartEvent =
        combatEvent as CombatPoisonStartEvent;
      const battlerName: string = getCombatantName({
        monsterName: poisonStartCombatEvent.target.monsterName,
        username: poisonStartCombatEvent.target.username,
      });
      return {
        trims: [
          {
            index: 0,
            length: battlerName.length,
          },
        ],
        value: `${battlerName} begins to sicken.`,
      };
    }
    case CombatEventType.Rejuvenate: {
      const rejuvenateEvent: CombatRejuvenateEvent =
        combatEvent as CombatRejuvenateEvent;
      const battlerName: string = getCombatantName({
        monsterName: rejuvenateEvent.target.monsterName,
        username: rejuvenateEvent.target.username,
      });
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof rejuvenateEvent.target.username !== "undefined") {
        trims.push({
          index: 0,
          length: battlerName.length,
        });
      }
      return {
        trims,
        value: `${battlerName} recovers ${getFormattedInteger(
          rejuvenateEvent.amount,
        )} MP.`,
      };
    }
    case CombatEventType.RejuvenateFailure: {
      const friendlyTargetFailureCombatEvent: CombatFriendlyTargetFailureEvent =
        combatEvent as CombatFriendlyTargetFailureEvent;
      const battlerName: string = getCombatantName({
        monsterName: friendlyTargetFailureCombatEvent.target.monsterName,
        username: friendlyTargetFailureCombatEvent.target.username,
      });
      let value: string = "...but ";
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (
        typeof friendlyTargetFailureCombatEvent.target.username !== "undefined"
      ) {
        trims.push({
          index: value.length,
          length: battlerName.length,
        });
      }
      value += `${battlerName} does not use MP.`;
      return {
        trims,
        value,
      };
    }
    case CombatEventType.Renew: {
      const renewCombatEvent: CombatRenewEvent =
        combatEvent as CombatRenewEvent;
      return {
        trims: [
          {
            index: 0,
            length: renewCombatEvent.username.length,
          },
        ],
        value: `${renewCombatEvent.username} begins renewing HP.`,
      };
    }
    case CombatEventType.UseAbility: {
      const useAbilityCombatEvent: CombatUseAbilityEvent =
        combatEvent as CombatUseAbilityEvent;
      const ability: Ability = getDefinable(
        Ability,
        useAbilityCombatEvent.abilityID,
      );
      const casterName: string = getCombatantName({
        monsterName: useAbilityCombatEvent.caster.monsterName,
        username: useAbilityCombatEvent.caster.username,
      });
      let value: string = `${casterName} uses ${ability.name}`;
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof useAbilityCombatEvent.caster.username !== "undefined") {
        trims.push({
          index: 0,
          length: casterName.length,
        });
      }
      if (typeof useAbilityCombatEvent.target !== "undefined") {
        const targetName: string = getCombatantName({
          monsterName: useAbilityCombatEvent.target.monsterName,
          username: useAbilityCombatEvent.target.username,
        });
        value += " on ";
        if (typeof useAbilityCombatEvent.target.username !== "undefined") {
          trims.push({
            index: value.length,
            length: targetName.length,
          });
        }
        value += targetName;
      }
      value += ".";
      return {
        trims,
        value,
      };
    }
    case CombatEventType.UseItem: {
      const useItemCombatEvent: CombatUseItemEvent =
        combatEvent as CombatUseItemEvent;
      const item: Item = getDefinable(Item, useItemCombatEvent.itemID);
      const casterName: string = getCombatantName({
        monsterName: useItemCombatEvent.caster.monsterName,
        username: useItemCombatEvent.caster.username,
      });
      let value: string = `${casterName} uses ${item.name}`;
      const trims: CreateLabelOptionsTextTrim[] = [];
      if (typeof useItemCombatEvent.caster.username !== "undefined") {
        trims.push({
          index: 0,
          length: casterName.length,
        });
      }
      if (typeof useItemCombatEvent.target !== "undefined") {
        const targetName: string = getCombatantName({
          monsterName: useItemCombatEvent.target.monsterName,
          username: useItemCombatEvent.target.username,
        });
        value += " on ";
        if (typeof useItemCombatEvent.target.username !== "undefined") {
          trims.push({
            index: value.length,
            length: targetName.length,
          });
        }
        value += targetName;
      }
      value += ".";
      return {
        trims,
        value,
      };
    }
  }
};
