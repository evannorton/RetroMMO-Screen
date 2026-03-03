import { Ability } from "./classes/Ability";
import { Battler } from "./classes/Battler";
import {
  CombatBleedStartEvent,
  CombatDamageEvent,
  CombatDeathEvent,
  CombatEventType,
  CombatHealEvent,
  CombatInstakillFinishEvent,
  CombatPoisonStartEvent,
  CombatRejuvenateEvent,
  CombatRenewEvent,
  CombatUseAbilityEvent,
  Constants,
  Direction,
  ResourcePool,
  ServerTimeRequest,
} from "retrommo-types";
import { MusicTrack } from "./classes/MusicTrack";
import { PianoNote } from "./types/PianoNote";
import { WorldCharacter } from "./classes/WorldCharacter";
import { definableExists, getDefinable, getDefinables } from "definables";
import {
  emitToSocketioServer,
  fadeOutAudioSourceVolume,
  getCurrentTime,
  playAudioSource,
  removeEntity,
  setEntityPosition,
} from "pixel-pigeon";
import { getBattlerResourcePool } from "./functions/battle/getBattlerResourcePool";
import { getConstants } from "./functions/getConstants";
import { getPianoKeyAudioPath } from "./functions/getPianoKeyAudioPath";
import { handleWorldCharacterClick } from "./functions/handleWorldCharacterClick";
import { musicFadeDuration, serverTimeUpdateInterval } from "./constants";
import { playCombatEventSFX } from "./functions/combat/playCombatEventSFX";
import { playMusic } from "./functions/playMusic";
import { sfxVolumeChannelID } from "./volumeChannels";
import { state } from "./state";

export const tick = (): void => {
  const constants: Constants = getConstants();
  const currentTime: number = getCurrentTime();
  if (state.values.worldState !== null) {
    let clickedWorldCharacter: WorldCharacter | null = null;
    for (const worldCharacter of getDefinables(WorldCharacter).values()) {
      if (
        worldCharacter.wasClicked &&
        (clickedWorldCharacter === null ||
          worldCharacter.order > clickedWorldCharacter.order)
      ) {
        clickedWorldCharacter = worldCharacter;
      }
      worldCharacter.wasClicked = false;
      if (
        worldCharacter.hasEmote() &&
        worldCharacter.emote.usedAt < currentTime - constants["emote-duration"]
      ) {
        removeEntity(worldCharacter.emote.entityID);
        worldCharacter.emote = null;
      }
      let percentMoved: number | undefined;
      if (worldCharacter.hasMovedAt()) {
        percentMoved = Math.min(
          1,
          (currentTime - worldCharacter.movedAt) /
            constants["movement-duration"],
        );
      } else {
        percentMoved = 1;
      }
      const pixelsMoved: number = Math.round(
        percentMoved * constants["tile-size"],
      );
      switch (worldCharacter.direction) {
        case Direction.Down: {
          const x: number = worldCharacter.position.x * constants["tile-size"];
          const y: number =
            worldCharacter.position.y * constants["tile-size"] -
            (constants["tile-size"] - pixelsMoved);
          setEntityPosition(worldCharacter.entityID, {
            x,
            y,
          });
          if (worldCharacter.hasEmote()) {
            setEntityPosition(worldCharacter.emote.entityID, {
              x,
              y: y - constants["tile-size"],
            });
          }
          if (worldCharacter.hasMarkerEntity()) {
            setEntityPosition(worldCharacter.markerEntityID, {
              x,
              y,
            });
          }
          break;
        }
        case Direction.Left: {
          const x: number =
            worldCharacter.position.x * constants["tile-size"] +
            (constants["tile-size"] - pixelsMoved);
          const y: number = worldCharacter.position.y * constants["tile-size"];
          setEntityPosition(worldCharacter.entityID, {
            x,
            y,
          });
          if (worldCharacter.hasEmote()) {
            setEntityPosition(worldCharacter.emote.entityID, {
              x,
              y: y - constants["tile-size"],
            });
          }
          if (worldCharacter.hasMarkerEntity()) {
            setEntityPosition(worldCharacter.markerEntityID, {
              x,
              y,
            });
          }
          break;
        }
        case Direction.Right: {
          const x: number =
            worldCharacter.position.x * constants["tile-size"] -
            (constants["tile-size"] - pixelsMoved);
          const y: number = worldCharacter.position.y * constants["tile-size"];
          setEntityPosition(worldCharacter.entityID, {
            x,
            y,
          });
          if (worldCharacter.hasEmote()) {
            setEntityPosition(worldCharacter.emote.entityID, {
              x,
              y: y - constants["tile-size"],
            });
          }
          if (worldCharacter.hasMarkerEntity()) {
            setEntityPosition(worldCharacter.markerEntityID, {
              x,
              y,
            });
          }
          break;
        }
        case Direction.Up: {
          const x: number = worldCharacter.position.x * constants["tile-size"];
          const y: number =
            worldCharacter.position.y * constants["tile-size"] +
            (constants["tile-size"] - pixelsMoved);
          setEntityPosition(worldCharacter.entityID, {
            x,
            y,
          });
          if (worldCharacter.hasEmote()) {
            setEntityPosition(worldCharacter.emote.entityID, {
              x,
              y: y - constants["tile-size"],
            });
          }
          if (worldCharacter.hasMarkerEntity()) {
            setEntityPosition(worldCharacter.markerEntityID, {
              x,
              y,
            });
          }
          break;
        }
      }
    }
    if (clickedWorldCharacter !== null) {
      handleWorldCharacterClick(clickedWorldCharacter.id);
    }
    const updatedPianoNotes: PianoNote[] = [];
    for (const pianoNote of state.values.worldState.values.pianoNotes) {
      if (pianoNote.playAt <= currentTime) {
        playAudioSource(getPianoKeyAudioPath(pianoNote.index, pianoNote.type), {
          volumeChannelID: sfxVolumeChannelID,
        });
      } else {
        updatedPianoNotes.push(pianoNote);
      }
    }
    state.values.worldState.setValues({
      pianoNotes: updatedPianoNotes,
    });
    if (state.values.worldState.values.combatRound !== null) {
      if (state.values.serverTime !== null) {
        const elapsedServerTime: number =
          state.values.serverTime -
          state.values.worldState.values.combatRound.serverTime;
        for (const eventInstance of state.values.worldState.values.combatRound
          .eventInstances) {
          if (
            elapsedServerTime >= eventInstance.event.startedAt &&
            eventInstance.isProcessed === false
          ) {
            switch (eventInstance.event.type) {
              case CombatEventType.Heal: {
                const healEvent: CombatHealEvent =
                  eventInstance.event as CombatHealEvent;
                if (typeof healEvent.target.characterID === "undefined") {
                  throw new Error("No heal event target character ID");
                }
                if (
                  definableExists(WorldCharacter, healEvent.target.characterID)
                ) {
                  const worldCharacter: WorldCharacter = getDefinable(
                    WorldCharacter,
                    healEvent.target.characterID,
                  );
                  worldCharacter.resources = {
                    ...worldCharacter.resources,
                    hp: Math.min(
                      worldCharacter.resources.maxHP,
                      worldCharacter.resources.hp + healEvent.amount,
                    ),
                  };
                }
                break;
              }
              case CombatEventType.Rejuvenate: {
                const rejuvenateEvent: CombatRejuvenateEvent =
                  eventInstance.event as CombatRejuvenateEvent;
                if (typeof rejuvenateEvent.target.characterID === "undefined") {
                  throw new Error("No rejuvenate event target character ID");
                }
                if (
                  definableExists(
                    WorldCharacter,
                    rejuvenateEvent.target.characterID,
                  )
                ) {
                  const worldCharacter: WorldCharacter = getDefinable(
                    WorldCharacter,
                    rejuvenateEvent.target.characterID,
                  );
                  if (worldCharacter.resources.mp === null) {
                    throw new Error(
                      "WorldCharacter has no MP but is trying to be rejuvenated.",
                    );
                  }
                  if (worldCharacter.resources.maxMP === null) {
                    throw new Error(
                      "WorldCharacter has no max MP but is trying to be rejuvenated.",
                    );
                  }
                  worldCharacter.resources = {
                    ...worldCharacter.resources,
                    mp: Math.min(
                      worldCharacter.resources.maxMP,
                      worldCharacter.resources.mp + rejuvenateEvent.amount,
                    ),
                  };
                }
                break;
              }
              case CombatEventType.Renew: {
                const renewEvent: CombatRenewEvent =
                  eventInstance.event as CombatRenewEvent;
                if (typeof renewEvent.characterID === "undefined") {
                  throw new Error("No renew event character ID");
                }
                if (definableExists(WorldCharacter, renewEvent.characterID)) {
                  const worldCharacter: WorldCharacter = getDefinable(
                    WorldCharacter,
                    renewEvent.characterID,
                  );
                  worldCharacter.isRenewing = true;
                }
                break;
              }
              case CombatEventType.UseAbility: {
                const useAbilityEvent: CombatUseAbilityEvent =
                  eventInstance.event as CombatUseAbilityEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  useAbilityEvent.abilityID,
                );
                if (typeof useAbilityEvent.caster.characterID === "undefined") {
                  throw new Error("No use ability event caster character ID");
                }
                if (
                  definableExists(
                    WorldCharacter,
                    useAbilityEvent.caster.characterID,
                  )
                ) {
                  const worldCharacter: WorldCharacter = getDefinable(
                    WorldCharacter,
                    useAbilityEvent.caster.characterID,
                  );
                  switch (worldCharacter.player.character.class.resourcePool) {
                    case ResourcePool.MP: {
                      if (worldCharacter.resources.mp === null) {
                        throw new Error(
                          "WorldCharacter has no MP but is trying to use an ability that costs MP.",
                        );
                      }
                      worldCharacter.resources = {
                        ...worldCharacter.resources,
                        mp: worldCharacter.resources.mp - ability.mpCost,
                      };
                      break;
                    }
                  }
                }
                break;
              }
            }
            playCombatEventSFX(eventInstance.event);
            eventInstance.isProcessed = true;
          }
        }
      }
    }
  }
  if (state.values.battleState !== null) {
    if (state.values.battleState.values.round !== null) {
      if (state.values.serverTime !== null) {
        const elapsedServerTime: number =
          state.values.serverTime -
          state.values.battleState.values.round.serverTime;
        for (const eventInstance of state.values.battleState.values.round
          .eventInstances) {
          if (
            elapsedServerTime >= eventInstance.event.startedAt &&
            eventInstance.isProcessed === false
          ) {
            switch (eventInstance.event.type) {
              case CombatEventType.BleedStart: {
                const bleedStartEvent: CombatBleedStartEvent =
                  eventInstance.event as CombatBleedStartEvent;
                if (typeof bleedStartEvent.target.battlerID === "undefined") {
                  throw new Error("No bleed start event target battler ID");
                }
                if (
                  definableExists(Battler, bleedStartEvent.target.battlerID)
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    bleedStartEvent.target.battlerID,
                  );
                  battler.bleed = { order: bleedStartEvent.target.order };
                }
                break;
              }
              case CombatEventType.Damage: {
                const damageEvent: CombatDamageEvent =
                  eventInstance.event as CombatDamageEvent;
                if (typeof damageEvent.target.battlerID === "undefined") {
                  throw new Error("No damage event target battler ID");
                }
                if (
                  definableExists(Battler, damageEvent.target.battlerID) &&
                  state.values.battleState.values.friendlyBattlerIDs.includes(
                    damageEvent.target.battlerID,
                  )
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    damageEvent.target.battlerID,
                  );
                  battler.resources.hp = Math.max(
                    0,
                    battler.resources.hp - damageEvent.amount,
                  );
                }
                break;
              }
              case CombatEventType.Death: {
                const deathEvent: CombatDeathEvent =
                  eventInstance.event as CombatDeathEvent;
                if (typeof deathEvent.target.battlerID === "undefined") {
                  throw new Error("No death event target battler ID");
                }
                if (definableExists(Battler, deathEvent.target.battlerID)) {
                  const battler: Battler = getDefinable(
                    Battler,
                    deathEvent.target.battlerID,
                  );
                  battler.isAlive = false;
                }
                break;
              }
              case CombatEventType.Defeat: {
                playMusic();
                break;
              }
              case CombatEventType.Heal: {
                const healEvent: CombatHealEvent =
                  eventInstance.event as CombatHealEvent;
                if (typeof healEvent.target.battlerID === "undefined") {
                  throw new Error("No heal event target battler ID");
                }
                if (
                  definableExists(Battler, healEvent.target.battlerID) &&
                  state.values.battleState.values.friendlyBattlerIDs.includes(
                    healEvent.target.battlerID,
                  )
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    healEvent.target.battlerID,
                  );
                  battler.resources.hp = Math.min(
                    battler.resources.maxHP,
                    battler.resources.hp + healEvent.amount,
                  );
                }
                break;
              }
              case CombatEventType.InstakillFinish: {
                const instakillFinishEvent: CombatInstakillFinishEvent =
                  eventInstance.event as CombatInstakillFinishEvent;
                if (
                  typeof instakillFinishEvent.target.battlerID === "undefined"
                ) {
                  throw new Error(
                    "No instakill finish event target battler ID",
                  );
                }
                if (
                  definableExists(
                    Battler,
                    instakillFinishEvent.target.battlerID,
                  ) &&
                  state.values.battleState.values.friendlyBattlerIDs.includes(
                    instakillFinishEvent.target.battlerID,
                  )
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    instakillFinishEvent.target.battlerID,
                  );
                  battler.resources.hp = 0;
                }
                break;
              }
              case CombatEventType.PoisonStart: {
                const poisonStartEvent: CombatPoisonStartEvent =
                  eventInstance.event as CombatPoisonStartEvent;
                if (typeof poisonStartEvent.target.battlerID === "undefined") {
                  throw new Error("No poison start event target battler ID");
                }
                if (
                  definableExists(Battler, poisonStartEvent.target.battlerID)
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    poisonStartEvent.target.battlerID,
                  );
                  battler.poison = { order: poisonStartEvent.target.order };
                }
                break;
              }
              case CombatEventType.Rejuvenate: {
                const rejuvenateEvent: CombatRejuvenateEvent =
                  eventInstance.event as CombatRejuvenateEvent;
                if (typeof rejuvenateEvent.target.battlerID === "undefined") {
                  throw new Error("No rejuvenate event target battler ID");
                }
                if (
                  definableExists(Battler, rejuvenateEvent.target.battlerID) &&
                  state.values.battleState.values.friendlyBattlerIDs.includes(
                    rejuvenateEvent.target.battlerID,
                  )
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    rejuvenateEvent.target.battlerID,
                  );
                  if (battler.resources.mp === null) {
                    throw new Error(
                      "Battler has no MP but is trying to be rejuvenated.",
                    );
                  }
                  if (battler.resources.maxMP === null) {
                    throw new Error(
                      "Battler has no max MP but is trying to be rejuvenated.",
                    );
                  }
                  battler.resources.mp = Math.min(
                    battler.resources.maxMP,
                    battler.resources.mp + rejuvenateEvent.amount,
                  );
                }
                break;
              }
              case CombatEventType.UseAbility: {
                const useAbilityEvent: CombatUseAbilityEvent =
                  eventInstance.event as CombatUseAbilityEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  useAbilityEvent.abilityID,
                );
                if (typeof useAbilityEvent.caster.battlerID === "undefined") {
                  throw new Error("No use ability event caster battler ID");
                }
                if (
                  definableExists(Battler, useAbilityEvent.caster.battlerID) &&
                  state.values.battleState.values.friendlyBattlerIDs.includes(
                    useAbilityEvent.caster.battlerID,
                  )
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    useAbilityEvent.caster.battlerID,
                  );
                  switch (getBattlerResourcePool(battler.id)) {
                    case ResourcePool.MP: {
                      if (battler.resources.mp === null) {
                        throw new Error(
                          "Battler has no MP but is trying to use an ability that costs MP.",
                        );
                      }
                      battler.resources.mp -= ability.mpCost;
                      break;
                    }
                    case ResourcePool.Will: {
                      if (battler.resources.will === null) {
                        throw new Error(
                          "Battler has no Will but is trying to use an ability that costs Will.",
                        );
                      }
                      battler.resources.will -= ability.willCost;
                      break;
                    }
                    default: {
                      throw new Error("resourcePool is not valid");
                    }
                  }
                }
                break;
              }
            }
            playCombatEventSFX(eventInstance.event);
            eventInstance.isProcessed = true;
          }
          if (
            state.values.battleState.values.round.isFinal &&
            state.values.battleState.values.isFadingOutMusic === false &&
            elapsedServerTime >=
              state.values.battleState.values.round.duration - musicFadeDuration
          ) {
            if (state.values.musicTrackID === null) {
              throw new Error("Music track ID is null.");
            }
            const musicTrack: MusicTrack = getDefinable(
              MusicTrack,
              state.values.musicTrackID,
            );
            fadeOutAudioSourceVolume(musicTrack.audioPath, {
              duration: musicFadeDuration,
            });
            state.values.battleState.setValues({
              isFadingOutMusic: true,
            });
          }
        }
      }
    }
  }
  if (
    state.values.isInitialUpdateReceived &&
    (state.values.serverTimeRequestedAt === null ||
      currentTime - state.values.serverTimeRequestedAt >=
        serverTimeUpdateInterval)
  ) {
    state.setValues({
      serverTimeRequestedAt: currentTime,
    });
    emitToSocketioServer<ServerTimeRequest>({
      data: {},
      event: "server-time",
    });
  }
};
