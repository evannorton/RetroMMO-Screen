import { Ability } from "../../classes/Ability";
import { Battler } from "../../classes/Battler";
import {
  CombatDamageEvent,
  CombatDeathEvent,
  CombatEvent,
  CombatEventType,
  CombatHealEvent,
  CombatInstakillFinishEvent,
  CombatRejuvenateEvent,
  CombatRenewEvent,
  CombatUseAbilityEvent,
  CombatUseItemEvent,
  CombatantType,
} from "retrommo-types";
import { Item } from "../../classes/Item";
import { definableExists, getDefinable } from "definables";
import { playAudioSource } from "pixel-pigeon";
import { sfxVolumeChannelID } from "../../volumeChannels";

const getCombatEventSFXAudioPath = (
  combatEvent: CombatEvent,
): string | undefined => {
  switch (combatEvent.type) {
    case CombatEventType.BleedStart: {
      return "sfx/actions/impact/bleed-tick";
    }
    case CombatEventType.Damage: {
      const damageEvent: CombatDamageEvent = combatEvent as CombatDamageEvent;
      if (damageEvent.isPoison === true) {
        return "sfx/actions/impact/poison-tick";
      }
      if (damageEvent.isBleed === true) {
        return "sfx/actions/impact/bleed-tick";
      }
      if (damageEvent.isCrit === true) {
        if (typeof damageEvent.abilityID === "undefined") {
          throw new Error("No damage event ability ID");
        }
        const ability: Ability = getDefinable(Ability, damageEvent.abilityID);
        return ability.impactCritAudioPath;
      }
      if (damageEvent.isInstakill === true) {
        if (typeof damageEvent.abilityID === "undefined") {
          throw new Error("No damage event ability ID");
        }
        const ability: Ability = getDefinable(Ability, damageEvent.abilityID);
        return ability.impactInstakillAudioPath;
      }
      if (typeof damageEvent.abilityID === "undefined") {
        throw new Error("No damage event ability ID");
      }
      const ability: Ability = getDefinable(Ability, damageEvent.abilityID);
      return ability.impactAudioPath;
    }
    case CombatEventType.Death: {
      const deathEvent: CombatDeathEvent = combatEvent as CombatDeathEvent;
      if (typeof deathEvent.target.battlerID === "undefined") {
        throw new Error("No death event target battler ID");
      }
      if (definableExists(Battler, deathEvent.target.battlerID)) {
        const battler: Battler = getDefinable(
          Battler,
          deathEvent.target.battlerID,
        );
        switch (battler.type) {
          case CombatantType.Monster:
            return battler.monster.deathAudioPath;
          case CombatantType.Player:
            return "sfx/actions/death/player";
        }
      }
      break;
    }
    case CombatEventType.FleeFailure:
      return "sfx/fail";
    case CombatEventType.FleeSuccess:
      return "sfx/actions/flee";
    case CombatEventType.FriendlyTargetFailure: {
      return "sfx/fail";
    }
    case CombatEventType.Heal: {
      const healEvent: CombatHealEvent = combatEvent as CombatHealEvent;
      const ability: Ability = getDefinable(Ability, healEvent.abilityID);
      return ability.impactAudioPath;
    }
    case CombatEventType.InstakillFinish: {
      const instakillFinishEvent: CombatInstakillFinishEvent =
        combatEvent as CombatInstakillFinishEvent;
      const ability: Ability = getDefinable(
        Ability,
        instakillFinishEvent.abilityID,
      );
      return ability.impactInstakillAudioPath;
    }
    case CombatEventType.Miss: {
      return "sfx/actions/miss";
    }
    case CombatEventType.PoisonStart: {
      return "sfx/actions/impact/poison-tick";
    }
    case CombatEventType.Rejuvenate: {
      const rejuvenateEvent: CombatRejuvenateEvent =
        combatEvent as CombatRejuvenateEvent;
      const ability: Ability = getDefinable(Ability, rejuvenateEvent.abilityID);
      return ability.impactAudioPath;
    }
    case CombatEventType.RejuvenateFailure: {
      return "sfx/fail";
    }
    case CombatEventType.Renew: {
      const renewEvent: CombatRenewEvent = combatEvent as CombatRenewEvent;
      const ability: Ability = getDefinable(Ability, renewEvent.abilityID);
      return ability.impactAudioPath;
    }
    case CombatEventType.UseAbility: {
      const useAbilityEvent: CombatUseAbilityEvent =
        combatEvent as CombatUseAbilityEvent;
      const ability: Ability = getDefinable(Ability, useAbilityEvent.abilityID);
      if (ability.hasChargeAudioPath()) {
        return ability.chargeAudioPath;
      }
      break;
    }
    case CombatEventType.UseItem: {
      const useItemEvent: CombatUseItemEvent =
        combatEvent as CombatUseItemEvent;
      const item: Item = getDefinable(Item, useItemEvent.itemID);
      if (item.ability.hasChargeAudioPath()) {
        return item.ability.chargeAudioPath;
      }
      break;
    }
  }
};

export const playCombatEventSFX = (combatEvent: CombatEvent): void => {
  const audioPath: string | undefined = getCombatEventSFXAudioPath(combatEvent);
  if (typeof audioPath !== "undefined") {
    playAudioSource(audioPath, {
      volumeChannelID: sfxVolumeChannelID,
    });
  }
};
