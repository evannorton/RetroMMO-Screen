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
import { BattleCharacter } from "../../classes/BattleCharacter";
import { BattleStateSchema, WorldStateSchema, state } from "../../state";
import { Battler } from "../../classes/Battler";
import { ItemInstance } from "../../classes/ItemInstance";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { NPC } from "../../classes/NPC";
import { Party } from "../../classes/Party";
import { Player } from "../../classes/Player";
import { Quest } from "../../classes/Quest";
import { QuestGiverQuest } from "../../classes/QuestGiver";
import { State, listenToSocketioEvent, removeHUDElements } from "pixel-pigeon";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../../classes/WorldCharacter";
import { addWorldCharacterMarker } from "../addWorldCharacterMarker";
import { canWorldCharacterTurnInQuest } from "../canWorldCharacterTurnInQuest";
import { clearWorldCharacterMarker } from "../clearWorldCharacterMarker";
import { closeWorldMenus } from "../world-menus/closeWorldMenus";
import { createBattleState } from "../state/createBattleState";
import { createBattleUI } from "../ui/battle/createBattleUI";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { createWorldState } from "../state/createWorldState";
import { definableExists, getDefinable, getDefinables } from "definables";
import { emotesWorldMenu } from "../../world-menus/emotesWorldMenu";
import { exitBattlers } from "../exitBattlers";
import { exitWorldCharacters } from "../exitWorldCharacters";
import { getBattleState } from "../state/getBattleState";
import { getWorldState } from "../state/getWorldState";
import { inventoryWorldMenu } from "../../world-menus/inventoryWorldMenu";
import { listenForBattleUpdates } from "./listenForBattleUpdates";
import { listenForMainMenuUpdates } from "./main-menu/listenForMainMenuUpdates";
import { listenForWorldUpdates } from "./listenForWorldUpdates";
import { loadBattleCharacterUpdate } from "../load-updates/loadBattleCharacterUpdate";
import { loadBattleSubmittedAbilityUpdate } from "../load-updates/loadBattleSubmittedAbilityUpdate";
import { loadBattleSubmittedItemUpdate } from "../load-updates/loadBattleSubmittedItemUpdate";
import { loadBattlerUpdate } from "../load-updates/loadBattlerUpdate";
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
  listenForBattleUpdates();
  listenForMainMenuUpdates();
  listenForWorldUpdates();
  listenToSocketioEvent<AddPlayerUpdate>({
    event: "add-player",
    onMessage: (update: AddPlayerUpdate): void => {
      new Player({
        id: update.playerID,
        userID: update.userID,
        username: update.username,
      });
    },
  });
  listenToSocketioEvent<EndPlayerBattleUpdate>({
    event: "end-player-battle",
    onMessage: (update: EndPlayerBattleUpdate): void => {
      if (typeof update.character !== "undefined") {
        const battleState: State<BattleStateSchema> = getBattleState();
        removeHUDElements(battleState.values.hudElementReferences);
        const worldState: State<WorldStateSchema> = createWorldState({
          agility: update.character.agility,
          bagItemInstanceIDs: update.character.bagItemInstances.map(
            (bagItemInstance: ItemInstanceUpdate): string =>
              bagItemInstance.itemInstanceID,
          ),
          bodyItemInstanceID: update.character.bodyItemInstance?.itemInstanceID,
          boostItemInstanceIDs: update.character.boostItemInstances.map(
            (boostItemInstance: ItemInstanceUpdate): string =>
              boostItemInstance.itemInstanceID,
          ),
          clothesDyeItemInstanceID:
            update.character.clothesDyeItemInstance?.itemInstanceID,
          defense: update.character.defense,
          experienceUntilLevel: update.character.experienceUntilLevel,
          hairDyeItemInstanceID:
            update.character.hairDyeItemInstance?.itemInstanceID,
          headItemInstanceID: update.character.headItemInstance?.itemInstanceID,
          intelligence: update.character.intelligence,
          inventoryGold: update.character.inventoryGold,
          luck: update.character.luck,
          mainHandItemInstanceID:
            update.character.mainHandItemInstance?.itemInstanceID,
          maskItemInstanceID: update.character.maskItemInstance?.itemInstanceID,
          offHandItemInstanceID:
            update.character.offHandItemInstance?.itemInstanceID,
          outfitItemInstanceID:
            update.character.outfitItemInstance?.itemInstanceID,
          strength: update.character.strength,
          timePlayed: update.character.timePlayed,
          wisdom: update.character.wisdom,
          worldCharacterID: update.character.characterID,
        });
        state.setValues({
          battleState: null,
          worldState,
        });
        for (const battleCharacter of getDefinables(BattleCharacter).values()) {
          battleCharacter.player.battleCharacterID = null;
          battleCharacter.remove();
        }
        for (const battler of getDefinables(Battler).values()) {
          battler.remove();
        }
        for (const worldCharacterUpdate of update.character.characters) {
          loadWorldCharacterUpdate(worldCharacterUpdate);
          const worldCharacterUpdatePlayer: Player = getDefinable(
            Player,
            worldCharacterUpdate.playerID,
          );
          worldCharacterUpdatePlayer.worldCharacterID =
            worldCharacterUpdate.characterID;
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
        selectWorldCharacter(update.character.characterID);
        if (state.values.selectedPlayerID !== null) {
          selectedPlayerWorldMenu.open({});
        }
      }
      for (const playerUpdate of update.players) {
        const player: Player = getDefinable(Player, playerUpdate.playerID);
        player.character.level = playerUpdate.level;
        player.battleCharacterID = null;
      }
      if (typeof update.world !== "undefined") {
        for (const worldCharacterUpdate of update.world.characters) {
          loadWorldCharacterUpdate(worldCharacterUpdate);
          const worldCharacterUpdatePlayer: Player = getDefinable(
            Player,
            worldCharacterUpdate.playerID,
          );
          worldCharacterUpdatePlayer.worldCharacterID =
            worldCharacterUpdate.characterID;
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
      if (typeof update.characterID !== "undefined") {
        player.worldCharacterID = update.characterID;
      }
      if (typeof update.world !== "undefined") {
        loadWorldCharacterUpdate(update.world.character);
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
              (itemInstanceUpdate: ItemInstanceUpdate): string =>
                itemInstanceUpdate.itemInstanceID,
            ),
            bodyItemInstanceID:
              update.character.bodyItemInstance?.itemInstanceID,
            boostItemInstanceIDs: update.character.boostItemInstances.map(
              (itemInstanceUpdate: ItemInstanceUpdate): string =>
                itemInstanceUpdate.itemInstanceID,
            ),
            clothesDyeItemInstanceID:
              update.character.clothesDyeItemInstance?.itemInstanceID,
            defense: update.character.defense,
            experienceUntilLevel: update.character.experienceUntilLevel,
            hairDyeItemInstanceID:
              update.character.hairDyeItemInstance?.itemInstanceID,
            headItemInstanceID:
              update.character.headItemInstance?.itemInstanceID,
            intelligence: update.character.intelligence,
            inventoryGold: update.character.inventoryGold,
            luck: update.character.luck,
            mainHandItemInstanceID:
              update.character.mainHandItemInstance?.itemInstanceID,
            maskItemInstanceID:
              update.character.maskItemInstance?.itemInstanceID,
            offHandItemInstanceID:
              update.character.offHandItemInstance?.itemInstanceID,
            outfitItemInstanceID:
              update.character.outfitItemInstance?.itemInstanceID,
            strength: update.character.strength,
            timePlayed: update.character.timePlayed,
            wisdom: update.character.wisdom,
            worldCharacterID: update.character.characterID,
          }),
        });
        for (const worldCharacterUpdate of update.character.characters) {
          loadWorldCharacterUpdate(worldCharacterUpdate);
          const worldCharacterUpdatePlayer: Player = getDefinable(
            Player,
            worldCharacterUpdate.playerID,
          );
          worldCharacterUpdatePlayer.worldCharacterID =
            worldCharacterUpdate.characterID;
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
        selectWorldCharacter(update.character.characterID);
      }
    },
  });
  listenToSocketioEvent<ExitPlayerUpdate>({
    event: "exit-player",
    onMessage: (update: ExitPlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.playerID);
      if (state.values.selectedPlayerID === update.playerID) {
        selectedPlayerWorldMenu.close();
      }
      if (player.hasWorldCharacter()) {
        exitWorldCharacters([player.worldCharacterID]);
        player.character = null;
        player.worldCharacterID = null;
        player.battleCharacterID = null;
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
      for (const battleCharacter of getDefinables(BattleCharacter).values()) {
        battleCharacter.remove();
      }
      for (const battler of getDefinables(Battler).values()) {
        battler.remove();
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
          battleCharacterID:
            update.mainState === MainState.Battle
              ? playerUpdate.characterID
              : undefined,
          character:
            typeof playerUpdate.character !== "undefined"
              ? {
                  classID: playerUpdate.character.classID,
                  level: playerUpdate.character.level,
                  partyID: playerUpdate.character.partyID,
                }
              : undefined,
          id: playerUpdate.playerID,
          userID: playerUpdate.userID,
          username: playerUpdate.username,
          worldCharacterID:
            update.mainState === MainState.World
              ? playerUpdate.characterID
              : undefined,
        });
      }
      for (const partyUpdate of update.parties) {
        loadPartyUpdate(partyUpdate);
      }
      if (state.values.battleState !== null) {
        removeHUDElements(state.values.battleState.values.hudElementReferences);
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
          if (typeof update.battle === "undefined") {
            throw new Error(
              "Initial update in World MainState is missing battle.",
            );
          }
          for (const battleCharacterUpdate of update.battle.characters) {
            loadBattleCharacterUpdate(battleCharacterUpdate);
          }
          for (const battlerUpdate of update.battle.battlers) {
            loadBattlerUpdate(battlerUpdate);
          }
          for (const itemInstanceUpdate of update.battle.itemInstances) {
            loadItemInstanceUpdate(itemInstanceUpdate);
          }
          for (const battleSubmittedAbilityUpdate of update.battle
            .submittedAbilities) {
            loadBattleSubmittedAbilityUpdate(battleSubmittedAbilityUpdate);
          }
          for (const battleSubmittedItemUpdate of update.battle
            .submittedItems) {
            loadBattleSubmittedItemUpdate(battleSubmittedItemUpdate);
          }
          state.setValues({
            battleState: createBattleState({
              battlerID: update.battle.battlerID,
              enemyBattlerIDs: update.battle.enemyBattlerIDs,
              friendlyBattlerIDs: update.battle.friendlyBattlerIDs,
              hudElementReferences: createBattleUI({
                enemyBattlerIDs: update.battle.enemyBattlerIDs,
                friendlyBattlerIDs: update.battle.friendlyBattlerIDs,
              }),
              itemInstanceIDs: update.battle.itemInstances.map(
                (itemInstanceUpdate: ItemInstanceUpdate): string =>
                  itemInstanceUpdate.itemInstanceID,
              ),
              reachableID: update.battle.reachableID,
            }),
          });
          break;
        case MainState.MainMenu: {
          if (typeof update.mainMenu === "undefined") {
            throw new Error(
              "Initial update in MainMenu MainState is missing mainMenu.",
            );
          }
          const mainMenuCharacterIDs: string[] = [];
          for (const mainMenuCharacterUpdate of update.mainMenu.characters) {
            mainMenuCharacterIDs.push(
              new MainMenuCharacter({
                classID: mainMenuCharacterUpdate.classID,
                clothesDyeItemID: mainMenuCharacterUpdate.clothesDyeItemID,
                figureID: mainMenuCharacterUpdate.figureID,
                hairDyeItemID: mainMenuCharacterUpdate.hairDyeItemID,
                id: mainMenuCharacterUpdate.characterID,
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
              (itemInstanceUpdate: ItemInstanceUpdate): string =>
                itemInstanceUpdate.itemInstanceID,
            ),
            bodyItemInstanceID: update.world.bodyItemInstance?.itemInstanceID,
            boostItemInstanceIDs: update.world.boostItemInstances.map(
              (itemInstanceUpdate: ItemInstanceUpdate): string =>
                itemInstanceUpdate.itemInstanceID,
            ),
            clothesDyeItemInstanceID:
              update.world.clothesDyeItemInstance?.itemInstanceID,
            defense: update.world.defense,
            experienceUntilLevel: update.world.experienceUntilLevel,
            hairDyeItemInstanceID:
              update.world.hairDyeItemInstance?.itemInstanceID,
            headItemInstanceID: update.world.headItemInstance?.itemInstanceID,
            intelligence: update.world.intelligence,
            inventoryGold: update.world.inventoryGold,
            luck: update.world.luck,
            mainHandItemInstanceID:
              update.world.mainHandItemInstance?.itemInstanceID,
            maskItemInstanceID: update.world.maskItemInstance?.itemInstanceID,
            offHandItemInstanceID:
              update.world.offHandItemInstance?.itemInstanceID,
            outfitItemInstanceID:
              update.world.outfitItemInstance?.itemInstanceID,
            strength: update.world.strength,
            timePlayed: update.world.timePlayed,
            wisdom: update.world.wisdom,
            worldCharacterID: update.world.characterID,
          });
          state.setValues({
            worldState,
          });
          for (const worldCharacterUpdate of update.world.characters) {
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
          selectWorldCharacter(update.world.characterID);
          break;
        }
      }
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
          partyUpdate.partyID,
        )
          ? getDefinable(Party, partyUpdate.partyID).playerIDs
          : [];
        loadPartyUpdate(partyUpdate);
        const party: Party = getDefinable(Party, partyUpdate.partyID);
        for (const player of party.players) {
          player.character.partyID = partyUpdate.partyID;
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
        for (const worldPartyCharacterUpdate of update.world.characters) {
          loadWorldPartyCharacterUpdate(worldPartyCharacterUpdate);
        }
      }
    },
  });
  listenToSocketioEvent<RemovePlayerUpdate>({
    event: "remove-player",
    onMessage: (update: RemovePlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.playerID);
      if (state.values.selectedPlayerID === update.playerID) {
        selectedPlayerWorldMenu.close();
      }
      if (player.hasWorldCharacter()) {
        exitWorldCharacters([player.worldCharacterID]);
      } else if (player.hasBattleCharacter()) {
        exitBattlers([player.battleCharacter.battlerID]);
      }
      player.remove();
    },
  });
  listenToSocketioEvent<RenamePlayerUpdate>({
    event: "rename-player",
    onMessage: (update: RenamePlayerUpdate): void => {
      const player: Player = getDefinable(Player, update.playerID);
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
        const player: Player = getDefinable(Player, playerUpdate.playerID);
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
        for (const worldCharacterUpdate of worldUpdate.characters) {
          const partyWorldCharacter: WorldCharacter = getDefinable(
            WorldCharacter,
            worldCharacterUpdate.characterID,
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
