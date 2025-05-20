import { Constants, Direction, ServerTimeRequest } from "retrommo-types";
import { PianoNote } from "./types/PianoNote";
import { WorldCharacter } from "./classes/WorldCharacter";
import {
  emitToSocketioServer,
  getCurrentTime,
  playAudioSource,
  removeEntity,
  setEntityPosition,
} from "pixel-pigeon";
import { getConstants } from "./functions/getConstants";
import { getDefinables } from "definables";
import { getPianoKeyAudioPath } from "./functions/getPianoKeyAudioPath";
import { handleWorldCharacterClick } from "./functions/handleWorldCharacterClick";
import { serverTimeUpdateInterval } from "./constants";
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
