import {
  AddPlayerUpdate,
  EndPlayerBattleUpdate,
  EnterPlayerUpdate,
  ExitPlayerUpdate,
  InitialUpdate,
  ItemInstanceUpdate,
  MainState,
  MarkerType,
  PartyChangesUpdate,
  RemovePlayerUpdate,
  RenamePlayerUpdate,
  TurnInQuestUpdate,
  TurnInQuestWorldUpdate,
} from "retrommo-types";
import { ItemInstance } from "../../classes/ItemInstance";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { NPC } from "../../classes/NPC";
import { Party } from "../../classes/Party";
import { Player } from "../../classes/Player";
import { Quest } from "../../classes/Quest";
import { QuestGiverQuest } from "../../classes/QuestGiver";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../../classes/WorldCharacter";
import { WorldStateSchema, state } from "../../state";
import { addWorldCharacterMarker } from "../addWorldCharacterMarker";
import { canWorldCharacterTurnInQuest } from "../canWorldCharacterTurnInQuest";
import { clearWorldCharacterMarker } from "../clearWorldCharacterMarker";
import { closeWorldMenus } from "../world-menus/closeWorldMenus";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { createWorldState } from "../state/createWorldState";
import { definableExists, getDefinable, getDefinables } from "definables";
import { emotesWorldMenu } from "../../world-menus/emotesWorldMenu";
import { exitWorldCharacters } from "../exitWorldCharacters";
import { getWorldState } from "../state/getWorldState";
import { inventoryWorldMenu } from "../../world-menus/inventoryWorldMenu";
import { listenForMainMenuUpdates } from "./main-menu/listenForMainMenuUpdates";
import { listenForWorldUpdates } from "./listenForWorldUpdates";
import { loadItemInstanceUpdate } from "../load-updates/loadItemInstanceUpdate";
import { loadPartyUpdate } from "../load-updates/loadPartyUpdate";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyCharacterUpdate } from "../load-updates/loadWorldPartyCharacterUpdate";
import { npcDialogueWorldMenu } from "../../world-menus/npcDialogueWorldMenu";
import { questLogWorldMenu } from "../../world-menus/questLogWorldMenu";
import { resetParty } from "../resetParty";
import { selectWorldCharacter } from "../selectWorldCharacter";
import { selectedPlayerWorldMenu } from "../../world-menus/selectedPlayerWorldMenu";
import { spellbookWorldMenu } from "../../world-menus/spellbookWorldMenu";
import { statsWorldMenu } from "../../world-menus/statsWorldMenu";

export const listenForUpdates = (): void => {
  listenToSocketioEvent<AddPlayerUpdate>({
    event: "add-player",
    onMessage: (update: AddPlayerUpdate): void => {
      new Player({
        id: update.id,
        userID: update.userID,
        username: update.username,
      });
    },
  });
  listenToSocketioEvent<EndPlayerBattleUpdate>({
    event: "end-player-battle",
    onMessage: (update: EndPlayerBattleUpdate): void => {
      if (typeof update.character !== "undefined") {
        const worldState: State<WorldStateSchema> = createWorldState({
          agility: update.character.agility,
          bagItemInstanceIDs: update.character.bagItemInstances.map(
            (bagItemInstance: ItemInstanceUpdate): string => bagItemInstance.id,
          ),
          bodyItemInstanceID: update.character.bodyItemInstance?.id,
          boostItemInstanceIDs: update.character.boostItemInstances.map(
            (boostItemInstance: ItemInstanceUpdate): string =>
              boostItemInstance.id,
          ),
          clothesDyeItemInstanceID: update.character.clothesDyeItemInstance?.id,
          defense: update.character.defense,
          experienceUntilLevel: update.character.experienceUntilLevel,
          hairDyeItemInstanceID: update.character.hairDyeItemInstance?.id,
          headItemInstanceID: update.character.headItemInstance?.id,
          intelligence: update.character.intelligence,
          inventoryGold: update.character.inventoryGold,
          luck: update.character.luck,
          mainHandItemInstanceID: update.character.mainHandItemInstance?.id,
          maskItemInstanceID: update.character.maskItemInstance?.id,
          offHandItemInstanceID: update.character.offHandItemInstance?.id,
          outfitItemInstanceID: update.character.outfitItemInstance?.id,
          strength: update.character.strength,
          timePlayed: update.character.timePlayed,
          wisdom: update.character.wisdom,
          worldCharacterID: update.character.worldCharacterID,
        });
        state.setValues({
          battleState: null,
          worldState,
        });
        for (const worldCharacterUpdate of update.character.worldCharacters) {
          loadWorldCharacterUpdate(worldCharacterUpdate);
          const worldCharacterUpdatePlayer: Player = getDefinable(
            Player,
            worldCharacterUpdate.playerID,
          );
          worldCharacterUpdatePlayer.worldCharacterID = worldCharacterUpdate.id;
        }
        for (const worldPartyUpdate of update.character.parties) {
          loadPartyUpdate(worldPartyUpdate);
        }
        for (const worldNPCUpdate of update.character.npcs) {
          loadWorldNPCUpdate(worldNPCUpdate);
        }
        for (const bagItemInstanceUpdate of update.character.bagItemInstances) {
          loadItemInstanceUpdate(bagItemInstanceUpdate);
        }
        for (const boostItemInstanceUpdate of update.character
          .boostItemInstances) {
          loadItemInstanceUpdate(boostItemInstanceUpdate);
        }
        if (typeof update.character.bodyItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.bodyItemInstance);
        }
        if (typeof update.character.headItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.headItemInstance);
        }
        if (typeof update.character.mainHandItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.mainHandItemInstance);
        }
        if (typeof update.character.offHandItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.offHandItemInstance);
        }
        if (typeof update.character.clothesDyeItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.clothesDyeItemInstance);
        }
        if (typeof update.character.hairDyeItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.hairDyeItemInstance);
        }
        if (typeof update.character.maskItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.maskItemInstance);
        }
        if (typeof update.character.outfitItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.outfitItemInstance);
        }
        selectWorldCharacter(update.character.worldCharacterID);
        if (state.values.selectedPlayerID !== null) {
          selectedPlayerWorldMenu.open({});
        }
      }
      for (const playerUpdate of update.players) {
        const player: Player = getDefinable(Player, playerUpdate.id);
        player.character.level = playerUpdate.level;
      }
      if (typeof update.world !== "undefined") {
        for (const worldCharacterUpdate of update.world.worldCharacters) {
          loadWorldCharacterUpdate(worldCharacterUpdate);
          const worldCharacterUpdatePlayer: Player = getDefinable(
            Player,
            worldCharacterUpdate.playerID,
          );
          worldCharacterUpdatePlayer.worldCharacterID = worldCharacterUpdate.id;
          if (state.values.selectedPlayerID === worldCharacterUpdatePlayer.id) {
            addWorldCharacterMarker(
              worldCharacterUpdatePlayer.worldCharacterID,
              MarkerType.Selected,
            );
          }
        }
        for (const worldPartyUpdate of update.world.parties) {
          loadPartyUpdate(worldPartyUpdate);
        }
      }
    },
  });
  listenToSocketioEvent<EnterPlayerUpdate>({
    event: "enter-player",
    onMessage: (update: EnterPlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.playerID);
      player.character = {
        classID: update.classID,
        level: update.level,
        partyID: update.partyID,
      };
      const party: Party = new Party({
        id: update.partyID,
      });
      party.playerIDs = [update.playerID];
      if (typeof update.worldCharacterID !== "undefined") {
        player.worldCharacterID = update.worldCharacterID;
      }
      if (typeof update.world !== "undefined") {
        loadWorldCharacterUpdate(update.world.worldCharacter);
      }
      if (typeof update.character !== "undefined") {
        getDefinables(MainMenuCharacter).forEach(
          (mainMenuCharacter: MainMenuCharacter): void => {
            mainMenuCharacter.remove();
          },
        );
        state.setValues({
          mainMenuState: null,
          worldState: createWorldState({
            agility: update.character.agility,
            bagItemInstanceIDs: update.character.bagItemInstances.map(
              (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
            ),
            bodyItemInstanceID: update.character.bodyItemInstance?.id,
            boostItemInstanceIDs: update.character.boostItemInstances.map(
              (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
            ),
            clothesDyeItemInstanceID:
              update.character.clothesDyeItemInstance?.id,
            defense: update.character.defense,
            experienceUntilLevel: update.character.experienceUntilLevel,
            hairDyeItemInstanceID: update.character.hairDyeItemInstance?.id,
            headItemInstanceID: update.character.headItemInstance?.id,
            intelligence: update.character.intelligence,
            inventoryGold: update.character.inventoryGold,
            luck: update.character.luck,
            mainHandItemInstanceID: update.character.mainHandItemInstance?.id,
            maskItemInstanceID: update.character.maskItemInstance?.id,
            offHandItemInstanceID: update.character.offHandItemInstance?.id,
            outfitItemInstanceID: update.character.outfitItemInstance?.id,
            strength: update.character.strength,
            timePlayed: update.character.timePlayed,
            wisdom: update.character.wisdom,
            worldCharacterID: update.character.worldCharacterID,
          }),
        });
        for (const worldCharacterUpdate of update.character.worldCharacters) {
          loadWorldCharacterUpdate(worldCharacterUpdate);
          const worldCharacterUpdatePlayer: Player = getDefinable(
            Player,
            worldCharacterUpdate.playerID,
          );
          worldCharacterUpdatePlayer.worldCharacterID = worldCharacterUpdate.id;
        }
        for (const worldPartyUpdate of update.character.parties) {
          loadPartyUpdate(worldPartyUpdate);
        }
        for (const worldNPCUpdate of update.character.npcs) {
          loadWorldNPCUpdate(worldNPCUpdate);
        }
        for (const bagItemInstanceUpdate of update.character.bagItemInstances) {
          loadItemInstanceUpdate(bagItemInstanceUpdate);
        }
        for (const boostItemInstanceUpdate of update.character
          .boostItemInstances) {
          loadItemInstanceUpdate(boostItemInstanceUpdate);
        }
        if (typeof update.character.bodyItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.bodyItemInstance);
        }
        if (typeof update.character.headItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.headItemInstance);
        }
        if (typeof update.character.mainHandItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.mainHandItemInstance);
        }
        if (typeof update.character.offHandItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.offHandItemInstance);
        }
        if (typeof update.character.clothesDyeItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.clothesDyeItemInstance);
        }
        if (typeof update.character.hairDyeItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.hairDyeItemInstance);
        }
        if (typeof update.character.maskItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.maskItemInstance);
        }
        if (typeof update.character.outfitItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.character.outfitItemInstance);
        }
        selectWorldCharacter(update.character.worldCharacterID);
      }
    },
  });
  listenToSocketioEvent<ExitPlayerUpdate>({
    event: "exit-player",
    onMessage: (update: ExitPlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.id);
      if (player.hasWorldCharacter()) {
        exitWorldCharacters([player.worldCharacterID]);
        player.character = null;
      }
      if (state.values.selectedPlayerID === update.id) {
        selectedPlayerWorldMenu.close();
      }
    },
  });
  listenToSocketioEvent<InitialUpdate>({
    event: "initial-update",
    onMessage: (update: InitialUpdate): void => {
      for (const mainMenuCharacter of getDefinables(
        MainMenuCharacter,
      ).values()) {
        mainMenuCharacter.remove();
      }
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        worldCharacter.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
      }
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      for (const player of getDefinables(Player).values()) {
        player.remove();
      }
      for (const playerUpdate of update.players) {
        new Player({
          character:
            typeof playerUpdate.character !== "undefined"
              ? {
                  classID: playerUpdate.character.classID,
                  level: playerUpdate.character.level,
                  partyID: playerUpdate.character.partyID,
                }
              : undefined,
          id: playerUpdate.id,
          userID: playerUpdate.userID,
          username: playerUpdate.username,
          worldCharacterID: playerUpdate.worldCharacterID,
        });
      }
      for (const partyUpdate of update.parties) {
        loadPartyUpdate(partyUpdate);
      }
      state.setValues({
        battleState: null,
        isSubscribed: update.isSubscribed,
        mainMenuState: null,
        selectedPlayerID: null,
        worldState: null,
      });
      switch (update.mainState) {
        case MainState.Battle:
          state.setValues({
            battleState: createBattleState(),
          });
          break;
        case MainState.MainMenu: {
          if (typeof update.mainMenu === "undefined") {
            throw new Error(
              "Initial update in MainMenu MainState is missing mainMenu.",
            );
          }
          const mainMenuCharacterIDs: string[] = [];
          for (const mainMenuCharacterUpdate of update.mainMenu
            .mainMenuCharacters) {
            mainMenuCharacterIDs.push(
              new MainMenuCharacter({
                classID: mainMenuCharacterUpdate.classID,
                clothesDyeItemID: mainMenuCharacterUpdate.clothesDyeItemID,
                figureID: mainMenuCharacterUpdate.figureID,
                hairDyeItemID: mainMenuCharacterUpdate.hairDyeItemID,
                id: mainMenuCharacterUpdate.id,
                level: mainMenuCharacterUpdate.level,
                maskItemID: mainMenuCharacterUpdate.maskItemID,
                outfitItemID: mainMenuCharacterUpdate.outfitItemID,
                skinColorID: mainMenuCharacterUpdate.skinColorID,
              }).id,
            );
          }
          state.setValues({
            mainMenuState: createMainMenuState({ mainMenuCharacterIDs }),
          });
          break;
        }
        case MainState.World: {
          if (typeof update.world === "undefined") {
            throw new Error(
              "Initial update in World MainState is missing world.",
            );
          }
          const worldState: State<WorldStateSchema> = createWorldState({
            agility: update.world.agility,
            bagItemInstanceIDs: update.world.bagItemInstances.map(
              (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
            ),
            bodyItemInstanceID: update.world.bodyItemInstance?.id,
            boostItemInstanceIDs: update.world.boostItemInstances.map(
              (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
            ),
            clothesDyeItemInstanceID: update.world.clothesDyeItemInstance?.id,
            defense: update.world.defense,
            experienceUntilLevel: update.world.experienceUntilLevel,
            hairDyeItemInstanceID: update.world.hairDyeItemInstance?.id,
            headItemInstanceID: update.world.headItemInstance?.id,
            intelligence: update.world.intelligence,
            inventoryGold: update.world.inventoryGold,
            luck: update.world.luck,
            mainHandItemInstanceID: update.world.mainHandItemInstance?.id,
            maskItemInstanceID: update.world.maskItemInstance?.id,
            offHandItemInstanceID: update.world.offHandItemInstance?.id,
            outfitItemInstanceID: update.world.outfitItemInstance?.id,
            strength: update.world.strength,
            timePlayed: update.world.timePlayed,
            wisdom: update.world.wisdom,
            worldCharacterID: update.world.worldCharacterID,
          });
          state.setValues({
            worldState,
          });
          for (const worldCharacterUpdate of update.world.worldCharacters) {
            loadWorldCharacterUpdate(worldCharacterUpdate);
          }
          for (const npcUpdate of update.world.npcs) {
            loadWorldNPCUpdate(npcUpdate);
          }
          for (const bagItemInstanceUpdate of update.world.bagItemInstances) {
            loadItemInstanceUpdate(bagItemInstanceUpdate);
          }
          for (const boostItemInstanceUpdate of update.world
            .boostItemInstances) {
            loadItemInstanceUpdate(boostItemInstanceUpdate);
          }
          if (typeof update.world.bodyItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.bodyItemInstance);
          }
          if (typeof update.world.headItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.headItemInstance);
          }
          if (typeof update.world.mainHandItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.mainHandItemInstance);
          }
          if (typeof update.world.offHandItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.offHandItemInstance);
          }
          if (typeof update.world.clothesDyeItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.clothesDyeItemInstance);
          }
          if (typeof update.world.hairDyeItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.hairDyeItemInstance);
          }
          if (typeof update.world.maskItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.maskItemInstance);
          }
          if (typeof update.world.outfitItemInstance !== "undefined") {
            loadItemInstanceUpdate(update.world.outfitItemInstance);
          }
          selectWorldCharacter(update.world.worldCharacterID);
          break;
        }
      }
      listenForMainMenuUpdates();
      listenForWorldUpdates();
      listenToSocketioEvent({
        event: "legacy/open-emotes",
        onMessage: (): void => {
          if (emotesWorldMenu.isOpen() === false) {
            closeWorldMenus();
            emotesWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-stats",
        onMessage: (): void => {
          if (statsWorldMenu.isOpen() === false) {
            closeWorldMenus();
            statsWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-quest-log",
        onMessage: (): void => {
          if (questLogWorldMenu.isOpen() === false) {
            closeWorldMenus();
            questLogWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-spellbook",
        onMessage: (): void => {
          if (spellbookWorldMenu.isOpen() === false) {
            closeWorldMenus();
            spellbookWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-inventory",
        onMessage: (): void => {
          if (inventoryWorldMenu.isOpen() === false) {
            closeWorldMenus();
            inventoryWorldMenu.open({});
          }
        },
      });
    },
  });
  listenToSocketioEvent<PartyChangesUpdate>({
    event: "party-change",
    onMessage: (update: PartyChangesUpdate): void => {
      for (const partyUpdate of update.parties) {
        const oldPartyPlayerIDs: readonly string[] = definableExists(
          Party,
          partyUpdate.id,
        )
          ? getDefinable(Party, partyUpdate.id).playerIDs
          : [];
        loadPartyUpdate(partyUpdate);
        const party: Party = getDefinable(Party, partyUpdate.id);
        for (const player of party.players) {
          player.character.partyID = partyUpdate.id;
        }
        if (typeof update.world !== "undefined") {
          const worldState: State<WorldStateSchema> = getWorldState();
          party.players.forEach(
            (partyPlayer: Player, partyPlayerIndex: number): void => {
              const partyWorldCharacterJoined: boolean =
                oldPartyPlayerIDs.includes(partyPlayer.id) === false;
              const partyWorldCharacterIsSelf: boolean =
                partyPlayer.worldCharacterID ===
                worldState.values.worldCharacterID;
              if (
                (partyWorldCharacterIsSelf &&
                  selectedPlayerWorldMenu.isOpen()) ||
                state.values.selectedPlayerID === partyPlayer.id
              ) {
                selectedPlayerWorldMenu.close();
              }
              // If self is joining a party
              if (
                partyPlayerIndex > 0 &&
                partyWorldCharacterJoined &&
                partyWorldCharacterIsSelf
              ) {
                worldState.setValues({
                  pianoSessionID: null,
                });
                getDefinables(WorldCharacter).forEach(
                  (worldCharacter: WorldCharacter): void => {
                    if (worldCharacter.hasMarkerEntity()) {
                      clearWorldCharacterMarker(worldCharacter.id);
                    }
                  },
                );
              } else if (party.playerIDs.length > oldPartyPlayerIDs.length) {
                if (partyPlayer.worldCharacter.hasMarkerEntity()) {
                  clearWorldCharacterMarker(partyPlayer.worldCharacter.id);
                }
              }
            },
          );
          resetParty(party.id);
        }
      }
      for (const partyIDToRemove of update.partyIDsToRemove) {
        getDefinable(Party, partyIDToRemove).remove();
      }
      if (typeof update.world !== "undefined") {
        for (const worldPartyCharacterUpdate of update.world.worldCharacters) {
          loadWorldPartyCharacterUpdate(worldPartyCharacterUpdate);
        }
      }
    },
  });
  listenToSocketioEvent<RemovePlayerUpdate>({
    event: "remove-player",
    onMessage: (update: RemovePlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.id);
      if (state.values.selectedPlayerID === update.id) {
        selectedPlayerWorldMenu.close();
      }
      if (
        state.values.worldState !== null &&
        typeof update.worldCharacterID !== "undefined"
      ) {
        exitWorldCharacters([update.worldCharacterID]);
      }
      player.remove();
    },
  });
  listenToSocketioEvent<RenamePlayerUpdate>({
    event: "rename-player",
    onMessage: (update: RenamePlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.id);
      player.username = update.username;
    },
  });
  listenToSocketioEvent<TurnInQuestUpdate>({
    event: "turn-in-quest",
    onMessage: (update: TurnInQuestUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const previousLevel: number = worldCharacter.player.character.level;
      for (const playerUpdate of update.players) {
        const player: Player = getDefinable(Player, playerUpdate.id);
        player.character = {
          classID: player.character.classID,
          level: playerUpdate.level,
          partyID: player.character.partyID,
        };
      }
      const didLevelUp: boolean =
        worldCharacter.player.character.level !== previousLevel;
      if (typeof update.world !== "undefined") {
        const worldUpdate: TurnInQuestWorldUpdate = update.world;
        const isLeader: boolean =
          worldCharacter.player.character.party.playerIDs[0] ===
          worldCharacter.playerID;
        if (npcDialogueWorldMenu.isOpen() === false) {
          closeWorldMenus();
          npcDialogueWorldMenu.open({
            isLeader,
            npcID: worldUpdate.npcID,
          });
        }
        for (const worldCharacterUpdate of worldUpdate.worldCharacters) {
          const partyWorldCharacter: WorldCharacter = getDefinable(
            WorldCharacter,
            worldCharacterUpdate.worldCharacterID,
          );
          partyWorldCharacter.resources = {
            hp: worldCharacterUpdate.resources.hp,
            maxHP: worldCharacterUpdate.resources.maxHP,
            maxMP: worldCharacterUpdate.resources.maxMP ?? null,
            mp: worldCharacterUpdate.resources.mp ?? null,
          };
        }
        const npc: NPC = getDefinable(NPC, worldUpdate.npcID);
        npcDialogueWorldMenu.state.setValues({
          selectedQuestIndex:
            typeof worldUpdate.questID !== "undefined"
              ? npc.questGiver.quests.findIndex(
                  (questGiverQuest: QuestGiverQuest): boolean =>
                    questGiverQuest.questID === worldUpdate.questID,
                )
              : null,
        });
        const quest: Quest = getDefinable(Quest, worldUpdate.questID);
        for (const partyPlayer of worldCharacter.player.character.party
          .players) {
          const questInstance: WorldCharacterQuestInstance | undefined =
            partyPlayer.worldCharacter.questInstances[worldUpdate.questID];
          if (typeof questInstance !== "undefined") {
            if (
              canWorldCharacterTurnInQuest(
                partyPlayer.worldCharacterID,
                quest.id,
              )
            ) {
              if (questInstance.isCompleted === false) {
                npcDialogueWorldMenu.state.setValues({
                  questCompletion: {
                    didLevelUp,
                    questID: quest.id,
                  },
                  selectedQuestIndex: null,
                });
                questInstance.isCompleted = true;
              }
            }
          }
        }
        worldState.setValues({
          experienceUntilLevel: worldUpdate.experienceUntilLevel,
        });
      }
    },
  });
};
