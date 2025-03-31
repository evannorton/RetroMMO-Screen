import { Bank } from "../../classes/Bank";
import { Chest } from "../../classes/Chest";
import {
  Direction,
  ItemInstanceUpdate,
  MarkerType,
  VanitySlot,
  WorldAcceptQuestUpdate,
  WorldBankGoldUpdate,
  WorldBankItemsUpdate,
  WorldBonkUpdate,
  WorldBuyShopItemUpdate,
  WorldClearMarkerUpdate,
  WorldCloseBankUpdate,
  WorldCombatUpdate,
  WorldDestroyBoostUpdate,
  WorldEmoteUpdate,
  WorldEnterCharactersUpdate,
  WorldEquipmentUpdate,
  WorldExitCharactersUpdate,
  WorldExitToMainMenuUpdate,
  WorldMarkerUpdate,
  WorldMoveCharactersUpdate,
  WorldOpenBankUpdate,
  WorldOpenChestUpdate,
  WorldPartyChangesUpdate,
  WorldPianoKeyUpdate,
  WorldPositionUpdate,
  WorldSelectQuestUpdate,
  WorldSellShopItemUpdate,
  WorldStartBattleUpdate,
  WorldTradeCompleteUpdate,
  WorldTradeUpdate,
  WorldTurnCharactersUpdate,
  WorldTurnNPCUpdate,
  WorldVanityUpdate,
} from "retrommo-types";
import { ItemInstance } from "../../classes/ItemInstance";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { NPC } from "../../classes/NPC";
import { Party } from "../../classes/Party";
import { Player } from "../../classes/Player";
import { Quest } from "../../classes/Quest";
import { QuestGiverQuest } from "../../classes/QuestGiver";
import {
  State,
  exitLevel,
  getCurrentTime,
  goToLevel,
  listenToSocketioEvent,
  lockCameraToEntity,
  playAudioSource,
} from "pixel-pigeon";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../../classes/WorldCharacter";
import { WorldStateSchema, state } from "../../state";
import { addWorldCharacterEmote } from "../addWorldCharacterEmote";
import { addWorldCharacterMarker } from "../addWorldCharacterMarker";
import { clearWorldCharacterMarker } from "../clearWorldCharacterMarker";
import { closeWorldMenus } from "../world-menus/closeWorldMenus";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { definableExists, getDefinable, getDefinables } from "definables";
import { exitWorldCharacters } from "../exitWorldCharacters";
import { getWorldState } from "../state/getWorldState";
import { inventoryWorldMenu } from "../../world-menus/inventoryWorldMenu";
import { loadItemInstanceUpdate } from "../load-updates/loadItemInstanceUpdate";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyCharacterUpdate } from "../load-updates/loadWorldPartyCharacterUpdate";
import { loadWorldPartyUpdate } from "../load-updates/loadWorldPartyUpdate";
import { npcDialogueWorldMenu } from "../../world-menus/npcDialogueWorldMenu";
import { resetParty } from "../resetParty";
import { selectedPlayerWorldMenu } from "../../world-menus/selectedPlayerWorldMenu";
import { sfxVolumeChannelID } from "../../volumeChannels";
import { spellbookWorldMenu } from "../../world-menus/spellbookWorldMenu";
import { statsWorldMenu } from "../../world-menus/statsWorldMenu";
import { updateWorldCharacterOrder } from "../updateWorldCharacterOrder";

export const listenForWorldUpdates = (): void => {
  listenToSocketioEvent<WorldAcceptQuestUpdate>({
    event: "world/accept-quest",
    onMessage: (update: WorldAcceptQuestUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const isLeader: boolean =
        worldCharacter.player.character.party.playerIDs[0] ===
        worldCharacter.id;
      if (npcDialogueWorldMenu.isOpen() === false) {
        closeWorldMenus();
        npcDialogueWorldMenu.open({
          isLeader,
          npcID: update.npcID,
        });
      }
      const npc: NPC = getDefinable(NPC, update.npcID);
      npcDialogueWorldMenu.state.setValues({
        questCompletion: null,
        selectedQuestIndex: npc.questGiver.quests.findIndex(
          (questGiverQuest: QuestGiverQuest): boolean =>
            questGiverQuest.questID === update.questID,
        ),
      });
      const quest: Quest = getDefinable(Quest, update.questID);
      for (const partyPlayer of worldCharacter.player.character.party.players) {
        const questInstance: WorldCharacterQuestInstance | undefined =
          partyPlayer.worldCharacter.questInstances[update.questID];
        if (typeof questInstance === "undefined") {
          partyPlayer.worldCharacter.questInstances[update.questID] = {
            isCompleted: false,
            isStarted: false,
            monsterKills: quest.hasMonster() ? 0 : undefined,
          };
        }
        const updatedQuestInstance: WorldCharacterQuestInstance | undefined =
          partyPlayer.worldCharacter.questInstances[update.questID];
        if (typeof updatedQuestInstance === "undefined") {
          throw new Error("No updated quest instance.");
        }
        if (updatedQuestInstance.isStarted === false) {
          updatedQuestInstance.isStarted = true;
        }
      }
    },
  });
  listenToSocketioEvent<WorldBankGoldUpdate>({
    event: "world/bank-gold",
    onMessage: (update: WorldBankGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        inventoryGold: update.inventoryGold,
      });
    },
  });
  listenToSocketioEvent<WorldBankItemsUpdate>({
    event: "world/bank-items",
    onMessage: (update: WorldBankItemsUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
        const bagItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          bagItemInstanceID,
        );
        bagItemInstance.remove();
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      worldState.setValues({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
        ),
      });
    },
  });
  listenToSocketioEvent<WorldBonkUpdate>({
    event: "world/bonk",
    onMessage: (): void => {
      playAudioSource("sfx/bonk", {
        volumeChannelID: sfxVolumeChannelID,
      });
    },
  });
  listenToSocketioEvent<WorldBuyShopItemUpdate>({
    event: "world/buy-shop-item",
    onMessage: (update: WorldBuyShopItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        bagItemInstanceIDs: [
          ...worldState.values.bagItemInstanceIDs,
          update.itemInstance.id,
        ],
        inventoryGold: update.gold,
      });
      new ItemInstance({
        id: update.itemInstance.id,
        itemID: update.itemInstance.itemID,
      });
    },
  });
  listenToSocketioEvent<WorldMarkerUpdate>({
    event: "world/clear-marker",
    onMessage: (update: WorldClearMarkerUpdate): void => {
      clearWorldCharacterMarker(update.worldCharacterID);
    },
  });
  listenToSocketioEvent<WorldCloseBankUpdate>({
    event: "world/close-bank",
    onMessage: (update: WorldCloseBankUpdate): void => {
      const bank: Bank = getDefinable(Bank, update.bankID);
      bank.isOpen = false;
      bank.toggledAt = getCurrentTime();
    },
  });
  listenToSocketioEvent<WorldCombatUpdate>({
    event: "world/combat",
    onMessage: (update: WorldCombatUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
        const bagItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          bagItemInstanceID,
        );
        bagItemInstance.remove();
      }
      for (const boostItemInstanceID of worldState.values
        .boostItemInstanceIDs) {
        const boostItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          boostItemInstanceID,
        );
        boostItemInstance.remove();
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      for (const boostItemInstanceUpdate of update.boostItemInstances) {
        loadItemInstanceUpdate(boostItemInstanceUpdate);
      }
      worldState.setValues({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
        ),
        boostItemInstanceIDs: update.boostItemInstances.map(
          (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
        ),
      });
      for (const worldCombatCharacter of update.worldCombatCharacters) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldCombatCharacter.worldCharacterID,
        );
        worldCharacter.isRenewing = worldCombatCharacter.isRenewing;
        worldCharacter.resources = {
          hp: worldCombatCharacter.resources.hp,
          maxHP: worldCombatCharacter.resources.maxHP,
          maxMP: worldCombatCharacter.resources.maxMP ?? null,
          mp: worldCombatCharacter.resources.mp ?? null,
        };
      }
      if (
        spellbookWorldMenu.isOpen() &&
        spellbookWorldMenu.state.values.isAwaitingWorldCombat
      ) {
        spellbookWorldMenu.close();
      }
      if (
        inventoryWorldMenu.isOpen() &&
        inventoryWorldMenu.state.values.isAwaitingWorldCombat
      ) {
        inventoryWorldMenu.close();
      }
    },
  });
  listenToSocketioEvent<WorldDestroyBoostUpdate>({
    event: "world/destroy-boost",
    onMessage: (update: WorldDestroyBoostUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        boostItemInstanceIDs: worldState.values.boostItemInstanceIDs.filter(
          (boostItemInstanceID: string): boolean =>
            boostItemInstanceID !== update.itemInstanceID,
        ),
      });
      getDefinable(ItemInstance, update.itemInstanceID).remove();
      if (statsWorldMenu.isOpen()) {
        statsWorldMenu.state.setValues({
          selectedBoostIndex: null,
        });
      }
    },
  });
  listenToSocketioEvent<WorldEmoteUpdate>({
    event: "world/emote",
    onMessage: (update: WorldEmoteUpdate): void => {
      addWorldCharacterEmote(
        update.worldCharacterID,
        update.emoteID,
        getCurrentTime(),
      );
    },
  });
  listenToSocketioEvent<WorldEnterCharactersUpdate>({
    event: "world/enter-characters",
    onMessage: (update: WorldEnterCharactersUpdate): void => {
      for (const worldCharacterUpdate of update.worldCharacters) {
        const worldCharacterUpdatePlayer: Player = getDefinable(
          Player,
          worldCharacterUpdate.playerID,
        );
        worldCharacterUpdatePlayer.worldCharacterID = worldCharacterUpdate.id;
        loadWorldCharacterUpdate(worldCharacterUpdate);
        if (state.values.selectedPlayerID === worldCharacterUpdate.playerID) {
          addWorldCharacterMarker(worldCharacterUpdate.id, MarkerType.Selected);
        }
      }
      for (const worldPartyUpdate of update.parties) {
        loadWorldPartyUpdate(worldPartyUpdate);
      }
    },
  });
  listenToSocketioEvent<WorldEquipmentUpdate>({
    event: "world/equipment",
    onMessage: (update: WorldEquipmentUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
        const bagItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          bagItemInstanceID,
        );
        bagItemInstance.remove();
      }
      if (worldState.values.bodyItemInstanceID !== null) {
        const bodyItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          worldState.values.bodyItemInstanceID,
        );
        bodyItemInstance.remove();
      }
      if (worldState.values.headItemInstanceID !== null) {
        const headItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          worldState.values.headItemInstanceID,
        );
        headItemInstance.remove();
      }
      if (worldState.values.mainHandItemInstanceID !== null) {
        const mainHandItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          worldState.values.mainHandItemInstanceID,
        );
        mainHandItemInstance.remove();
      }
      if (worldState.values.offHandItemInstanceID !== null) {
        const offHandItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          worldState.values.offHandItemInstanceID,
        );
        offHandItemInstance.remove();
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      if (typeof update.bodyItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.bodyItemInstance);
      }
      if (typeof update.headItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.headItemInstance);
      }
      if (typeof update.mainHandItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.mainHandItemInstance);
      }
      if (typeof update.offHandItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.offHandItemInstance);
      }
      worldState.setValues({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
        ),
        bodyItemInstanceID: update.bodyItemInstance?.id ?? null,
        headItemInstanceID: update.headItemInstance?.id ?? null,
        mainHandItemInstanceID: update.mainHandItemInstance?.id ?? null,
        offHandItemInstanceID: update.offHandItemInstance?.id ?? null,
      });
      if (inventoryWorldMenu.isOpen()) {
        inventoryWorldMenu.state.setValues({
          selectedBagItemIndex: null,
          selectedEquipmentSlot: null,
        });
      }
    },
  });
  listenToSocketioEvent<WorldExitCharactersUpdate>({
    event: "world/exit-characters",
    onMessage: (update: WorldExitCharactersUpdate): void => {
      exitWorldCharacters(update.worldCharacterIDs);
    },
  });
  listenToSocketioEvent<WorldExitToMainMenuUpdate>({
    event: "world/exit-to-main-menu",
    onMessage: (update: WorldExitToMainMenuUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const selfWorldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      selfWorldCharacter.player.character = null;
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        worldCharacter.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
      }
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      const mainMenuCharacterIDs: string[] = [];
      for (const mainMenuCharacterUpdate of update.mainMenuCharacters) {
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
        selectedPlayerID: null,
        worldState: null,
      });
      exitLevel();
      closeWorldMenus();
    },
  });
  listenToSocketioEvent<WorldMoveCharactersUpdate>({
    event: "world/inn",
    onMessage: (): void => {
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        getWorldState().values.worldCharacterID,
      );
      worldCharacter.player.character.party.players.forEach(
        (partyPlayer: Player): void => {
          partyPlayer.worldCharacter.resources = {
            hp: partyPlayer.worldCharacter.resources.maxHP,
            maxHP: partyPlayer.worldCharacter.resources.maxHP,
            maxMP: partyPlayer.worldCharacter.resources.maxMP ?? null,
            mp: partyPlayer.worldCharacter.resources.maxMP ?? null,
          };
        },
      );
    },
  });
  listenToSocketioEvent<WorldMoveCharactersUpdate>({
    event: "world/move-characters",
    onMessage: (update: WorldMoveCharactersUpdate): void => {
      for (const worldMoveCharacterUpdate of update.worldCharacters) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldMoveCharacterUpdate.worldCharacterID,
        );
        worldCharacter.resources =
          typeof worldMoveCharacterUpdate.resources !== "undefined"
            ? {
                hp: worldMoveCharacterUpdate.resources.hp,
                maxHP: worldMoveCharacterUpdate.resources.maxHP,
                maxMP: worldMoveCharacterUpdate.resources.maxMP ?? null,
                mp: worldMoveCharacterUpdate.resources.mp ?? null,
              }
            : null;
        worldCharacter.direction = worldMoveCharacterUpdate.direction;
        worldCharacter.isRenewing = worldMoveCharacterUpdate.isRenewing ?? null;
        worldCharacter.step = worldMoveCharacterUpdate.step;
        updateWorldCharacterOrder(
          worldCharacter.id,
          worldMoveCharacterUpdate.order,
        );
        switch (worldCharacter.direction) {
          case Direction.Down:
            worldCharacter.position = {
              x: worldCharacter.position.x,
              y: worldCharacter.position.y + 1,
            };
            break;
          case Direction.Left:
            worldCharacter.position = {
              x: worldCharacter.position.x - 1,
              y: worldCharacter.position.y,
            };
            break;
          case Direction.Right:
            worldCharacter.position = {
              x: worldCharacter.position.x + 1,
              y: worldCharacter.position.y,
            };
            break;
          case Direction.Up:
            worldCharacter.position = {
              x: worldCharacter.position.x,
              y: worldCharacter.position.y - 1,
            };
            break;
        }
        worldCharacter.movedAt = getCurrentTime();
      }
      for (const clearedMarkerWorldCharacterID of update.clearedMarkerWorldCharacterIDs) {
        const clearedMarkerWorldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          clearedMarkerWorldCharacterID,
        );
        if (clearedMarkerWorldCharacter.hasMarker()) {
          clearWorldCharacterMarker(clearedMarkerWorldCharacterID);
        }
      }
    },
  });
  listenToSocketioEvent<WorldOpenBankUpdate>({
    event: "world/open-bank",
    onMessage: (update: WorldOpenBankUpdate): void => {
      const bank: Bank = getDefinable(Bank, update.bankID);
      bank.isOpen = true;
      bank.toggledAt = getCurrentTime();
    },
  });
  listenToSocketioEvent<WorldOpenChestUpdate>({
    event: "world/open-chest",
    onMessage: (update: WorldOpenChestUpdate): void => {
      getDefinable(
        WorldCharacter,
        getWorldState().values.worldCharacterID,
      ).player.character.party.players.forEach((partyPlayer: Player): void => {
        if (
          partyPlayer.worldCharacter.openedChestIDs.includes(update.chestID) ===
          false
        ) {
          partyPlayer.worldCharacter.openedChestIDs = [
            ...partyPlayer.worldCharacter.openedChestIDs,
            update.chestID,
          ];
        }
      });
      getDefinable(Chest, update.chestID).openedAt = getCurrentTime();
    },
  });
  listenToSocketioEvent<WorldPartyChangesUpdate>({
    event: "world/party-change",
    onMessage: (update: WorldPartyChangesUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const worldPartyUpdate of update.parties) {
        const party: Party = definableExists(Party, worldPartyUpdate.id)
          ? getDefinable(Party, worldPartyUpdate.id)
          : new Party({ id: worldPartyUpdate.id });
        const oldPartyPlayerIDs: readonly string[] = party.playerIDs;
        party.playerIDs = worldPartyUpdate.playerIDs;
        party.players.forEach(
          (partyPlayer: Player, partyPlayerIndex: number): void => {
            partyPlayer.character.partyID = party.id;
            const partyWorldCharacterJoined: boolean =
              oldPartyPlayerIDs.includes(partyPlayer.id) === false;
            const partyWorldCharacterIsSelf: boolean =
              partyPlayer.worldCharacterID ===
              worldState.values.worldCharacterID;
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
                  if (worldCharacter.hasMarker()) {
                    clearWorldCharacterMarker(worldCharacter.id);
                  }
                },
              );
            } else if (party.playerIDs.length > oldPartyPlayerIDs.length) {
              if (partyPlayer.worldCharacter.hasMarker()) {
                clearWorldCharacterMarker(partyPlayer.worldCharacter.id);
              }
            }
          },
        );
        resetParty(party.id);
      }
      for (const partyIDToRemove of update.partyIDsToRemove) {
        getDefinable(Party, partyIDToRemove).remove();
      }
      for (const worldPartyCharacterUpdate of update.worldCharacters) {
        loadWorldPartyCharacterUpdate(worldPartyCharacterUpdate);
      }
    },
  });
  listenToSocketioEvent<WorldMarkerUpdate>({
    event: "world/marker",
    onMessage: (update: WorldMarkerUpdate): void => {
      addWorldCharacterMarker(update.worldCharacterID, update.type);
    },
  });
  listenToSocketioEvent<WorldPianoKeyUpdate>({
    event: "world/piano-key",
    onMessage: (update: WorldPianoKeyUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const offset: number = update.sinceLastKey ?? 0;
      let noteTime: number | undefined;
      if (update.pianoSessionID !== worldState.values.pianoSessionID) {
        noteTime = getCurrentTime() + 1000;
      } else {
        if (worldState.values.lastPianoNoteAt === null) {
          throw new Error("lastPianoNoteAt is null");
        }
        noteTime = worldState.values.lastPianoNoteAt + offset;
      }
      worldState.setValues({
        lastPianoNoteAt: noteTime,
        pianoNotes: [
          ...worldState.values.pianoNotes,
          {
            index: update.index,
            playAt: noteTime,
            type: update.type,
          },
        ],
        pianoSessionID: update.pianoSessionID,
      });
    },
  });
  listenToSocketioEvent<WorldPositionUpdate>({
    event: "world/position",
    onMessage: (update: WorldPositionUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        worldCharacter.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
      }
      for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
        const bagItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          bagItemInstanceID,
        );
        bagItemInstance.remove();
      }
      goToLevel(update.tilemapID);
      for (const worldCharacterUpdate of update.worldCharacters) {
        const worldCharacterUpdatePlayer: Player = getDefinable(
          Player,
          worldCharacterUpdate.playerID,
        );
        worldCharacterUpdatePlayer.worldCharacterID = worldCharacterUpdate.id;
        loadWorldCharacterUpdate(worldCharacterUpdate);
        if (state.values.selectedPlayerID === worldCharacterUpdate.playerID) {
          addWorldCharacterMarker(worldCharacterUpdate.id, MarkerType.Selected);
        }
      }
      for (const worldPartyUpdate of update.parties) {
        loadWorldPartyUpdate(worldPartyUpdate);
      }
      for (const worldNPCUpdate of update.npcs) {
        loadWorldNPCUpdate(worldNPCUpdate);
      }
      for (const worldBagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(worldBagItemInstanceUpdate);
      }
      worldState.setValues({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
        ),
      });
      lockCameraToEntity(
        getDefinable(WorldCharacter, getWorldState().values.worldCharacterID)
          .entityID,
      );
      if (update.didTeleport === true) {
        playAudioSource("sfx/teleport", {
          volumeChannelID: sfxVolumeChannelID,
        });
      }
    },
  });
  listenToSocketioEvent<WorldSelectQuestUpdate>({
    event: "world/select-quest",
    onMessage: (update: WorldSelectQuestUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const isLeader: boolean =
        worldCharacter.player.character.party.playerIDs[0] ===
        worldCharacter.playerID;
      if (npcDialogueWorldMenu.isOpen() === false) {
        closeWorldMenus();
        npcDialogueWorldMenu.open({
          isLeader,
          npcID: update.npcID,
        });
      }
      const npc: NPC = getDefinable(NPC, update.npcID);
      npcDialogueWorldMenu.state.setValues({
        questCompletion: null,
        selectedQuestIndex:
          typeof update.questID !== "undefined"
            ? npc.questGiver.quests.findIndex(
                (questGiverQuest: QuestGiverQuest): boolean =>
                  questGiverQuest.questID === update.questID,
              )
            : null,
      });
    },
  });
  listenToSocketioEvent<WorldSellShopItemUpdate>({
    event: "world/sell-shop-item",
    onMessage: (update: WorldSellShopItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        bagItemInstanceIDs: worldState.values.bagItemInstanceIDs.filter(
          (bagItemInstanceID: string): boolean =>
            bagItemInstanceID !== update.itemInstanceID,
        ),
        inventoryGold: update.gold,
      });
      getDefinable(ItemInstance, update.itemInstanceID).remove();
    },
  });
  listenToSocketioEvent<WorldStartBattleUpdate>({
    event: "world/start-battle",
    onMessage: (): void => {
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        worldCharacter.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
      }
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      state.setValues({
        battleState: createBattleState(),
        worldState: null,
      });
      exitLevel();
      if (selectedPlayerWorldMenu.isOpen()) {
        selectedPlayerWorldMenu.state.setValues({
          isBattleStarting: true,
        });
      }
      closeWorldMenus();
    },
  });
  listenToSocketioEvent<WorldTradeUpdate>({
    event: "world/trade",
    onMessage: (): void => {
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        if (worldCharacter.hasMarker()) {
          clearWorldCharacterMarker(worldCharacter.id);
        }
      }
    },
  });
  listenToSocketioEvent<WorldTradeCompleteUpdate>({
    event: "world/trade-complete",
    onMessage: (update: WorldTradeCompleteUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
        const bagItemInstance: ItemInstance = getDefinable(
          ItemInstance,
          bagItemInstanceID,
        );
        bagItemInstance.remove();
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      worldState.setValues({
        bagItemInstanceIDs: update.bagItemInstances.map(
          (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
        ),
        inventoryGold: update.gold,
      });
    },
  });
  listenToSocketioEvent<WorldTurnCharactersUpdate>({
    event: "world/turn-characters",
    onMessage: (update: WorldTurnCharactersUpdate): void => {
      for (const turn of update.turns) {
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          turn.worldCharacterID,
        );
        worldCharacter.direction = turn.direction;
      }
    },
  });
  listenToSocketioEvent<WorldTurnNPCUpdate>({
    event: "world/turn-npc",
    onMessage: (update: WorldTurnNPCUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const isLeader: boolean =
        worldCharacter.player.character.party.playerIDs[0] ===
        worldCharacter.playerID;
      const npc: NPC = getDefinable(NPC, update.npcID);
      npc.direction = update.direction;
      if (update.wasInteracted === true) {
        if (npc.hasDialogue() || npc.hasQuestGiver()) {
          closeWorldMenus();
          npcDialogueWorldMenu.open({
            isLeader,
            npcID: npc.id,
          });
        }
      }
    },
  });
  listenToSocketioEvent<WorldVanityUpdate>({
    event: "world/vanity",
    onMessage: (update: WorldVanityUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      if (typeof update.items !== "undefined") {
        for (const bagItemInstanceID of worldState.values.bagItemInstanceIDs) {
          const bagItemInstance: ItemInstance = getDefinable(
            ItemInstance,
            bagItemInstanceID,
          );
          bagItemInstance.remove();
        }
        if (worldState.values.clothesDyeItemInstanceID !== null) {
          const clothesDyeItemInstance: ItemInstance = getDefinable(
            ItemInstance,
            worldState.values.clothesDyeItemInstanceID,
          );
          clothesDyeItemInstance.remove();
        }
        if (worldState.values.hairDyeItemInstanceID !== null) {
          const hairDyeItemInstance: ItemInstance = getDefinable(
            ItemInstance,
            worldState.values.hairDyeItemInstanceID,
          );
          hairDyeItemInstance.remove();
        }
        if (worldState.values.maskItemInstanceID !== null) {
          const maskItemInstance: ItemInstance = getDefinable(
            ItemInstance,
            worldState.values.maskItemInstanceID,
          );
          maskItemInstance.remove();
        }
        if (worldState.values.outfitItemInstanceID !== null) {
          const outfitItemInstance: ItemInstance = getDefinable(
            ItemInstance,
            worldState.values.outfitItemInstanceID,
          );
          outfitItemInstance.remove();
        }
        for (const bagItemInstanceUpdate of update.items.bagItemInstances) {
          loadItemInstanceUpdate(bagItemInstanceUpdate);
        }
        if (typeof update.items.clothesDyeItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.items.clothesDyeItemInstance);
        }
        if (typeof update.items.hairDyeItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.items.hairDyeItemInstance);
        }
        if (typeof update.items.maskItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.items.maskItemInstance);
        }
        if (typeof update.items.outfitItemInstance !== "undefined") {
          loadItemInstanceUpdate(update.items.outfitItemInstance);
        }
        worldState.setValues({
          bagItemInstanceIDs: update.items.bagItemInstances.map(
            (bagItemInstance: ItemInstanceUpdate): string => bagItemInstance.id,
          ),
          clothesDyeItemInstanceID:
            update.items.clothesDyeItemInstance?.id ?? null,
          hairDyeItemInstanceID: update.items.hairDyeItemInstance?.id ?? null,
          maskItemInstanceID: update.items.maskItemInstance?.id ?? null,
          outfitItemInstanceID: update.items.outfitItemInstance?.id ?? null,
          worldCharacterID: update.worldCharacterID,
        });
        if (inventoryWorldMenu.isOpen()) {
          inventoryWorldMenu.state.setValues({
            selectedBagItemIndex: null,
            selectedVanitySlot: null,
          });
        }
      }
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        update.worldCharacterID,
      );
      switch (update.slot) {
        case VanitySlot.ClothesDye:
          worldCharacter.clothesDyeItemID = update.vanityItemID ?? null;
          break;
        case VanitySlot.HairDye:
          worldCharacter.hairDyeItemID = update.vanityItemID ?? null;
          break;
        case VanitySlot.Mask:
          worldCharacter.maskItemID = update.vanityItemID ?? null;
          break;
        case VanitySlot.Outfit:
          worldCharacter.outfitItemID = update.vanityItemID ?? null;
          break;
      }
    },
  });
};
