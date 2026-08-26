import { Battler } from "../../classes/Battler";
import { Constants } from "retrommo-types";
import { Player } from "../../classes/Player";
import {
  Position,
  User,
  initialize,
  onAuthStateChanged,
  onErrorLog,
  onFlush,
  removeGauge,
  setGauge,
} from "starwatch-sdk";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { getBattleState } from "../state/getBattleState";
import { getConstants } from "../getConstants";
import { getDefinable } from "definables";
import { getEnvironmentVariable } from "pixel-pigeon";
import { getWorldState } from "../state/getWorldState";
import { state } from "../../state";

export const initializeStarwatch = (): void => {
  const starwatchUserID: string | null = state.values.starwatchUserID;
  if (starwatchUserID === null) {
    throw new Error("StarWatch user ID is null");
  }
  const starwatchAppKey: unknown = getEnvironmentVariable("STARWATCH_APP_KEY");
  const starwatchServerURL: unknown = getEnvironmentVariable(
    "STARWATCH_SERVER_URL",
  );
  const starwatchLogs: unknown = getEnvironmentVariable("STARWATCH_LOGS");
  if (
    typeof starwatchAppKey === "string" &&
    typeof starwatchServerURL === "string" &&
    typeof starwatchLogs === "string" &&
    starwatchAppKey.length > 0 &&
    starwatchServerURL.length > 0 &&
    starwatchLogs.length > 0
  ) {
    const constants: Constants = getConstants();
    if (starwatchLogs === "true") {
      onErrorLog((log: string): void => {
        console.error("StarWatch error", log);
      });
      onAuthStateChanged((isAuthed: boolean): void => {
        if (isAuthed) {
          console.log("StarWatch authenticated");
        } else {
          console.log("StarWatch unauthenticated");
        }
      });
    }
    onFlush((): void => {
      if (state.values.worldState !== null) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          getWorldState().values.worldCharacterID,
        );
        setGauge({
          gaugeName: "hp",
          userID: starwatchUserID,
          value:
            (worldCharacter.resources.hp / worldCharacter.resources.maxHP) *
            100,
        });
      } else if (state.values.battleState !== null) {
        const battler: Battler = getDefinable(
          Battler,
          getBattleState().values.battlerID,
        );
        setGauge({
          gaugeName: "hp",
          userID: starwatchUserID,
          value: (battler.resources.hp / battler.resources.maxHP) * 100,
        });
      } else {
        removeGauge({
          gaugeName: "hp",
          userID: starwatchUserID,
        });
      }
      if (state.values.playerID !== null) {
        const player: Player = getDefinable(Player, state.values.playerID);
        if (player.hasCharacter()) {
          setGauge({
            gaugeName: "level",
            userID: starwatchUserID,
            value: player.character.level,
          });
          setGauge({
            gaugeName: "class",
            userID: starwatchUserID,
            value: player.character.classID,
          });
        } else {
          removeGauge({
            gaugeName: "level",
            userID: starwatchUserID,
          });
          removeGauge({
            gaugeName: "class",
            userID: starwatchUserID,
          });
        }
      }
    });
    initialize({
      appKey: starwatchAppKey,
      gameServerID: "retrommo",
      getUsers: (): User[] => {
        let position: Position | undefined;
        let tilemapID: string | undefined;
        if (state.values.worldState !== null) {
          const worldCharacter: WorldCharacter = getDefinable(
            WorldCharacter,
            state.values.worldState.values.worldCharacterID,
          );
          position = {
            x: worldCharacter.position.x,
            y: 0,
            z: worldCharacter.position.y,
          };
          tilemapID = worldCharacter.tilemapID;
        } else if (state.values.battleState !== null) {
          const battler: Battler = getDefinable(
            Battler,
            state.values.battleState.values.battlerID,
          );
          position = {
            x: battler.battleCharacter.position.x * constants["tile-size"],
            y: 0,
            z: battler.battleCharacter.position.y * constants["tile-size"],
          };
          tilemapID = battler.battleCharacter.tilemapID;
        }
        return [
          {
            levelName: tilemapID ?? "main-menu",
            position: position ?? {
              x: 0,
              y: 0,
              z: 0,
            },
            userID: starwatchUserID,
          },
        ];
      },
      serverURL: starwatchServerURL,
    });
    state.setValues({
      isStarwatchInitialized: true,
    });
  }
};
