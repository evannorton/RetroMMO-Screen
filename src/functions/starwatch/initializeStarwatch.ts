import { Battler } from "../../classes/Battler";
import { Constants, RefreshStarwatchBearerRequest } from "retrommo-types";
import { Player } from "../../classes/Player";
import {
  Position,
  User,
  initialize,
  onAuthStateChanged,
  onAuthorizationExpiringSoon,
  onErrorLog,
  onFlush,
  removeGauge,
  setGauge,
} from "starwatch-sdk";
import { StateSchema, state } from "../../state";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { emitToSocketioServer, getEnvironmentVariable } from "pixel-pigeon";
import { getBattleState } from "../state/getBattleState";
import { getConstants } from "../getConstants";
import { getDefinable } from "definables";
import { getStarwatchLevel } from "./getStarwatchLevel";
import { getWorldState } from "../state/getWorldState";

export const initializeStarwatch = (): void => {
  const starwatchUserID: string | null = state.values.starwatchUserID;
  if (starwatchUserID === null) {
    throw new Error("StarWatch user ID is null");
  }
  const starwatchBearer: StateSchema["starwatchBearer"] | null =
    state.values.starwatchBearer;
  const starwatchAppKey: unknown = getEnvironmentVariable("STARWATCH_APP_KEY");
  const starwatchServerURL: unknown = getEnvironmentVariable(
    "STARWATCH_SERVER_URL",
  );
  const starwatchFederated: unknown = getEnvironmentVariable(
    "STARWATCH_FEDERATED_AUTH",
  );
  const starwatchLogs: unknown = getEnvironmentVariable("STARWATCH_LOGS");
  if (
    ((starwatchFederated === "true" && starwatchBearer !== null) ||
      (starwatchFederated !== "true" &&
        typeof starwatchAppKey === "string" &&
        starwatchAppKey.length > 0)) &&
    typeof starwatchServerURL === "string" &&
    typeof starwatchLogs === "string" &&
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
          gauge: "hp",
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
          gauge: "hp",
          userID: starwatchUserID,
          value: (battler.resources.hp / battler.resources.maxHP) * 100,
        });
      } else {
        removeGauge({
          gauge: "hp",
          userID: starwatchUserID,
        });
      }
      if (state.values.playerID !== null) {
        const player: Player = getDefinable(Player, state.values.playerID);
        if (player.hasCharacter()) {
          setGauge({
            gauge: "level",
            userID: starwatchUserID,
            value: player.character.level,
          });
          setGauge({
            gauge: "class",
            userID: starwatchUserID,
            value: player.character.classID,
          });
        } else {
          removeGauge({
            gauge: "level",
            userID: starwatchUserID,
          });
          removeGauge({
            gauge: "class",
            userID: starwatchUserID,
          });
        }
      }
    });
    const getUsers = (): User[] => {
      let position: Position | undefined;
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
      }
      return [
        {
          level: getStarwatchLevel(),
          position: position ?? {
            x: 0,
            y: 0,
            z: 0,
          },
          userID: starwatchUserID,
        },
      ];
    };
    if (starwatchBearer !== null) {
      initialize({
        authType: "federated",
        authorization: {
          bearer: starwatchBearer.token,
          expiresAtSeconds: starwatchBearer.expiresAtSeconds,
        },
        gameServerID: "retrommo",
        getUsers,
        serverURL: starwatchServerURL,
      });
      onAuthorizationExpiringSoon((): void => {
        emitToSocketioServer<RefreshStarwatchBearerRequest>({
          data: {},
          event: "refresh-starwatch-bearer",
        });
      });
    } else if (typeof starwatchAppKey === "string") {
      initialize({
        appKey: starwatchAppKey,
        authType: "open",
        gameServerID: "retrommo",
        getUsers,
        serverURL: starwatchServerURL,
      });
    }
    state.setValues({
      isStarwatchInitialized: true,
    });
  }
};
