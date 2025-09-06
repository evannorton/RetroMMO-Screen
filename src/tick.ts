import { Ability } from "./classes/Ability";
import {
  BattleBleedStartEvent,
  BattleDamageEvent,
  BattleDeathEvent,
  BattleEventType,
  BattleHealEvent,
  BattleInstakillFinishEvent,
  BattlePoisonStartEvent,
  BattleRejuvenateEvent,
  BattleUseAbilityEvent,
  BattleUseItemEvent,
  BattlerType,
  Constants,
  Direction,
  ResourcePool,
  ServerTimeRequest,
} from "retrommo-types";
import { Battler } from "./classes/Battler";
import { Item } from "./classes/Item";
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
              case BattleEventType.BleedStart: {
                const bleedStartEvent: BattleBleedStartEvent =
                  eventInstance.event as BattleBleedStartEvent;
                if (
                  definableExists(Battler, bleedStartEvent.target.battlerID)
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    bleedStartEvent.target.battlerID,
                  );
                  battler.bleed = { order: bleedStartEvent.target.order };
                }
                playAudioSource("sfx/actions/impact/bleed-tick", {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.Damage: {
                const damageEvent: BattleDamageEvent =
                  eventInstance.event as BattleDamageEvent;
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
                if (damageEvent.isPoison === true) {
                  playAudioSource("sfx/actions/impact/poison-tick", {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                } else if (damageEvent.isBleed === true) {
                  playAudioSource("sfx/actions/impact/bleed-tick", {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                } else if (damageEvent.isCrit === true) {
                  if (typeof damageEvent.abilityID === "undefined") {
                    throw new Error("No damage event ability ID");
                  }
                  const ability: Ability = getDefinable(
                    Ability,
                    damageEvent.abilityID,
                  );
                  playAudioSource(ability.impactCritAudioPath, {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                } else if (damageEvent.isInstakill === true) {
                  if (typeof damageEvent.abilityID === "undefined") {
                    throw new Error("No damage event ability ID");
                  }
                  const ability: Ability = getDefinable(
                    Ability,
                    damageEvent.abilityID,
                  );
                  playAudioSource(ability.impactInstakillAudioPath, {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                } else {
                  if (typeof damageEvent.abilityID === "undefined") {
                    throw new Error("No damage event ability ID");
                  }
                  const ability: Ability = getDefinable(
                    Ability,
                    damageEvent.abilityID,
                  );
                  playAudioSource(ability.impactAudioPath, {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                }
                break;
              }
              case BattleEventType.Death: {
                const deathEvent: BattleDeathEvent =
                  eventInstance.event as BattleDeathEvent;
                if (definableExists(Battler, deathEvent.target.battlerID)) {
                  const battler: Battler = getDefinable(
                    Battler,
                    deathEvent.target.battlerID,
                  );
                  battler.isAlive = false;
                  switch (battler.type) {
                    case BattlerType.Monster:
                      playAudioSource(battler.monster.deathAudioPath, {
                        volumeChannelID: sfxVolumeChannelID,
                      });
                      break;
                    case BattlerType.Player:
                      playAudioSource("sfx/actions/death/player", {
                        volumeChannelID: sfxVolumeChannelID,
                      });
                      break;
                  }
                }
                break;
              }
              case BattleEventType.Defeat: {
                playMusic();
                break;
              }
              case BattleEventType.FleeFailure:
                playAudioSource("sfx/fail", {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              case BattleEventType.FleeSuccess:
                playAudioSource("sfx/actions/flee", {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              case BattleEventType.FriendlyTargetFailure: {
                playAudioSource("sfx/fail", {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.Heal: {
                const healEvent: BattleHealEvent =
                  eventInstance.event as BattleHealEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  healEvent.abilityID,
                );
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
                playAudioSource(ability.impactAudioPath, {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.InstakillFinish: {
                const instakillFinishEvent: BattleInstakillFinishEvent =
                  eventInstance.event as BattleInstakillFinishEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  instakillFinishEvent.abilityID,
                );
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
                playAudioSource(ability.impactInstakillAudioPath, {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.Miss: {
                playAudioSource("sfx/actions/miss", {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.PoisonStart: {
                const poisonStartEvent: BattlePoisonStartEvent =
                  eventInstance.event as BattlePoisonStartEvent;
                if (
                  definableExists(Battler, poisonStartEvent.target.battlerID)
                ) {
                  const battler: Battler = getDefinable(
                    Battler,
                    poisonStartEvent.target.battlerID,
                  );
                  battler.poison = { order: poisonStartEvent.target.order };
                }
                playAudioSource("sfx/actions/impact/poison-tick", {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.Rejuvenate: {
                const rejuvenateEvent: BattleRejuvenateEvent =
                  eventInstance.event as BattleRejuvenateEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  rejuvenateEvent.abilityID,
                );
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
                playAudioSource(ability.impactAudioPath, {
                  volumeChannelID: sfxVolumeChannelID,
                });
                break;
              }
              case BattleEventType.UseAbility: {
                const useAbilityEvent: BattleUseAbilityEvent =
                  eventInstance.event as BattleUseAbilityEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  useAbilityEvent.abilityID,
                );
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
                if (ability.hasChargeAudioPath()) {
                  playAudioSource(ability.chargeAudioPath, {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                }
                break;
              }
              case BattleEventType.UseItem: {
                const useItemEvent: BattleUseItemEvent =
                  eventInstance.event as BattleUseItemEvent;
                const item: Item = getDefinable(Item, useItemEvent.itemID);
                if (item.ability.hasChargeAudioPath()) {
                  playAudioSource(item.ability.chargeAudioPath, {
                    volumeChannelID: sfxVolumeChannelID,
                  });
                }
                break;
              }
            }
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
