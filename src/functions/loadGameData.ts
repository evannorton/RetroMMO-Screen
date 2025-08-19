import { Ability } from "../classes/Ability";
import {
  AbilityDefinition,
  BankDefinition,
  BattleImpactAnimationDefinition,
  BodyCosmeticDefinition,
  BoostDefinition,
  ChestDefinition,
  ClassDefinition,
  ClothesColorDefinition,
  ClothesDyeDefinition,
  CombinationLockDefinition,
  Constants,
  Definition,
  EmoteDefinition,
  EncounterDefinition,
  EquipmentPieceDefinition,
  FigureDefinition,
  HairColorDefinition,
  HairDyeDefinition,
  HeadCosmeticDefinition,
  ItemDefinition,
  LandscapeDefinition,
  MaskDefinition,
  MonsterDefinition,
  MusicTrackDefinition,
  NPCDefinition,
  OutfitDefinition,
  PianoDefinition,
  QuestDefinition,
  QuestGiverDefinition,
  ReachableDefinition,
  ShopDefinition,
  SkinColorDefinition,
  TilemapDefinition,
  TilemapTileDefinition,
  TilemapTilesetDefinition,
  TilesetDefinition,
  TilesetTileAnimationFrameDefinition,
  TilesetTileDefinition,
} from "retrommo-types";
import { Bank } from "../classes/Bank";
import { BattleImpactAnimation } from "../classes/BattleImpactAnimation";
import { BodyCosmetic } from "../classes/BodyCosmetic";
import { Boost } from "../classes/Boost";
import { Chest } from "../classes/Chest";
import { Class } from "../classes/Class";
import { ClothesColor } from "../classes/ClothesColor";
import { ClothesDye } from "../classes/ClothesDye";
import { CombinationLock } from "../classes/CombinationLock";
import {
  CreateLevelOptionsLayer,
  CreateTilesetOptionsTile,
  CreateTilesetOptionsTileAnimationFrame,
  createLevel,
  createTileset,
  makeHTTPRequest,
} from "pixel-pigeon";
import { Emote } from "../classes/Emote";
import { Encounter } from "../classes/Encounter";
import { EquipmentPiece } from "../classes/EquipmentPiece";
import { Figure } from "../classes/Figure";
import { HairColor } from "../classes/HairColor";
import { HairDye } from "../classes/HairDye";
import { HeadCosmetic } from "../classes/HeadCosmetic";
import { Item } from "../classes/Item";
import { Landscape } from "../classes/Landscape";
import { Mask } from "../classes/Mask";
import { Monster } from "../classes/Monster";
import { MusicTrack } from "../classes/MusicTrack";
import { NPC } from "../classes/NPC";
import { Outfit } from "../classes/Outfit";
import { Piano } from "../classes/Piano";
import { Quest } from "../classes/Quest";
import { QuestGiver } from "../classes/QuestGiver";
import { Reachable } from "../classes/Reachable";
import { Shop } from "../classes/Shop";
import { SkinColor } from "../classes/SkinColor";
import { getDefinables } from "definables";
import { state } from "../state";

export const loadGameData = async (): Promise<void> => {
  if (state.values.serverURL === null) {
    throw new Error("Attempted to load game data with no server URL.");
  }
  const constantsReponse: Response = await makeHTTPRequest({
    url: `${state.values.serverURL}/constants.json`,
  });
  const constants: Constants = (await constantsReponse.json()) as Constants;
  const gameDataResponse: Response = await makeHTTPRequest({
    url: `${state.values.serverURL}/game-data.json`,
  });
  const gameData: Record<
    string,
    Record<string, Definition>
  > = (await gameDataResponse.json()) as Record<
    string,
    Record<string, Definition>
  >;
  for (const className in gameData) {
    for (const id in gameData[className]) {
      const getTileXAtIndex = (index: number, width: number): number =>
        index % width;
      const getTileYAtIndex = (index: number, width: number): number =>
        Math.floor(index / width);
      switch (className) {
        case "Ability": {
          const definition: AbilityDefinition = (
            gameData[className] as Record<string, AbilityDefinition>
          )[id] as AbilityDefinition;
          new Ability({
            definition,
            id,
          });
          break;
        }
        case "AudioSource":
          break;
        case "Bank": {
          const definition: BankDefinition = (
            gameData[className] as Record<string, BankDefinition>
          )[id] as BankDefinition;
          new Bank({
            definition,
            id,
          });
          break;
        }
        case "BattleImpactAnimation": {
          const definition: BattleImpactAnimationDefinition = (
            gameData[className] as Record<
              string,
              BattleImpactAnimationDefinition
            >
          )[id] as BattleImpactAnimationDefinition;
          new BattleImpactAnimation({
            definition,
            id,
          });
          break;
        }
        case "BodyCosmetic": {
          const definition: BodyCosmeticDefinition = (
            gameData[className] as Record<string, BodyCosmeticDefinition>
          )[id] as BodyCosmeticDefinition;
          new BodyCosmetic({
            definition,
            id,
          });
          break;
        }
        case "Boost": {
          const definition: BoostDefinition = (
            gameData[className] as Record<string, BoostDefinition>
          )[id] as BoostDefinition;
          new Boost({
            definition,
            id,
          });
          break;
        }
        case "Chest": {
          const definition: ChestDefinition = (
            gameData[className] as Record<string, ChestDefinition>
          )[id] as ChestDefinition;
          new Chest({
            definition,
            id,
          });
          break;
        }
        case "Class": {
          const definition: ClassDefinition = (
            gameData[className] as Record<string, ClassDefinition>
          )[id] as ClassDefinition;
          new Class({
            definition,
            id,
          });
          break;
        }
        case "ClothesColor": {
          const definition: ClothesColorDefinition = (
            gameData[className] as Record<string, ClothesColorDefinition>
          )[id] as ClothesColorDefinition;
          new ClothesColor({
            definition,
            id,
          });
          break;
        }
        case "ClothesDye": {
          const definition: ClothesDyeDefinition = (
            gameData[className] as Record<string, ClothesDyeDefinition>
          )[id] as ClothesDyeDefinition;
          new ClothesDye({
            definition,
            id,
          });
          break;
        }
        case "CombinationLock": {
          const definition: CombinationLockDefinition = (
            gameData[className] as Record<string, CombinationLockDefinition>
          )[id] as CombinationLockDefinition;
          new CombinationLock({
            definition,
            id,
          });
          break;
        }
        case "Emote": {
          const definition: EmoteDefinition = (
            gameData[className] as Record<string, EmoteDefinition>
          )[id] as EmoteDefinition;
          new Emote({
            definition,
            id,
          });
          break;
        }
        case "Encounter": {
          const definition: EncounterDefinition = (
            gameData[className] as Record<string, EncounterDefinition>
          )[id] as EncounterDefinition;
          new Encounter({
            definition,
            id,
          });
          break;
        }
        case "Enterable":
          break;
        case "EquipmentPiece": {
          const definition: EquipmentPieceDefinition = (
            gameData[className] as Record<string, EquipmentPieceDefinition>
          )[id] as EquipmentPieceDefinition;
          new EquipmentPiece({
            definition,
            id,
          });
          break;
        }
        case "Figure": {
          const definition: FigureDefinition = (
            gameData[className] as Record<string, FigureDefinition>
          )[id] as FigureDefinition;
          new Figure({
            definition,
            id,
          });
          break;
        }
        case "HairColor": {
          const definition: HairColorDefinition = (
            gameData[className] as Record<string, HairColorDefinition>
          )[id] as HairColorDefinition;
          new HairColor({
            definition,
            id,
          });
          break;
        }
        case "HairDye": {
          const definition: HairDyeDefinition = (
            gameData[className] as Record<string, HairDyeDefinition>
          )[id] as HairDyeDefinition;
          new HairDye({
            definition,
            id,
          });
          break;
        }
        case "HeadCosmetic": {
          const definition: HeadCosmeticDefinition = (
            gameData[className] as Record<string, HeadCosmeticDefinition>
          )[id] as HeadCosmeticDefinition;
          new HeadCosmetic({
            definition,
            id,
          });
          break;
        }
        case "ImageSource":
          break;
        case "Item": {
          const definition: ItemDefinition = (
            gameData[className] as Record<string, ItemDefinition>
          )[id] as ItemDefinition;
          new Item({
            definition,
            id,
          });
          break;
        }
        case "Label":
          break;
        case "Landscape": {
          const definition: LandscapeDefinition = (
            gameData[className] as Record<string, LandscapeDefinition>
          )[id] as LandscapeDefinition;
          new Landscape({
            definition,
            id,
          });
          break;
        }
        case "Mask": {
          const definition: MaskDefinition = (
            gameData[className] as Record<string, MaskDefinition>
          )[id] as MaskDefinition;
          new Mask({
            definition,
            id,
          });
          break;
        }
        case "Monster": {
          const definition: MonsterDefinition = (
            gameData[className] as Record<string, MonsterDefinition>
          )[id] as MonsterDefinition;
          new Monster({
            definition,
            id,
          });
          break;
        }
        case "MusicTrack": {
          const definition: MusicTrackDefinition = (
            gameData[className] as Record<string, MusicTrackDefinition>
          )[id] as MusicTrackDefinition;
          new MusicTrack({
            definition,
            id,
          });
          break;
        }
        case "NPC": {
          const definition: NPCDefinition = (
            gameData[className] as Record<string, NPCDefinition>
          )[id] as NPCDefinition;
          new NPC({
            definition,
            id,
          });
          break;
        }
        case "Noise":
          break;
        case "Outfit": {
          const definition: OutfitDefinition = (
            gameData[className] as Record<string, OutfitDefinition>
          )[id] as OutfitDefinition;
          new Outfit({
            definition,
            id,
          });
          break;
        }
        case "Panel":
          break;
        case "Piano": {
          const definition: PianoDefinition = (
            gameData[className] as Record<string, PianoDefinition>
          )[id] as PianoDefinition;
          new Piano({
            definition,
            id,
          });
          break;
        }
        case "Picture":
          break;
        case "Quest": {
          const definition: QuestDefinition = (
            gameData[className] as Record<string, QuestDefinition>
          )[id] as QuestDefinition;
          new Quest({
            definition,
            id,
          });
          break;
        }
        case "QuestGiver": {
          const definition: QuestGiverDefinition = (
            gameData[className] as Record<string, QuestGiverDefinition>
          )[id] as QuestGiverDefinition;
          new QuestGiver({
            definition,
            id,
          });
          break;
        }
        case "Reachable": {
          const definition: ReachableDefinition = (
            gameData[className] as Record<string, ReachableDefinition>
          )[id] as ReachableDefinition;
          new Reachable({
            definition,
            id,
          });
          break;
        }
        case "Rectangle":
          break;
        case "ResourceBar":
          break;
        case "Shop": {
          const definition: ShopDefinition = (
            gameData[className] as Record<string, ShopDefinition>
          )[id] as ShopDefinition;
          new Shop({
            definition,
            id,
          });
          break;
        }
        case "SkinColor": {
          const definition: SkinColorDefinition = (
            gameData[className] as Record<string, SkinColorDefinition>
          )[id] as SkinColorDefinition;
          new SkinColor({
            definition,
            id,
          });
          break;
        }
        case "Switch":
          break;
        case "Tilemap": {
          const definition: TilemapDefinition = (
            gameData[className] as Record<string, TilemapDefinition>
          )[id] as TilemapDefinition;
          const getTilemapTilesetDefinitionAtIndex = (
            index: number,
          ): TilemapTilesetDefinition => {
            for (let i: number = definition.tilesets.length - 1; i >= 0; i--) {
              const tileset: TilemapTilesetDefinition = definition.tilesets[
                i
              ] as TilemapTilesetDefinition;
              if (tileset.firstTileID <= index) {
                return tileset;
              }
            }
            throw new Error(
              `Tilemap "${id}" does not have TilemapTilesetDefinition at index ${index}.`,
            );
          };
          const layers: CreateLevelOptionsLayer[] = [];
          layers.push({
            id: "npc-extenders",
            tiles: [],
          });
          const addTiles = (zLayer: string): void => {
            definition.tiles.forEach(
              (row: readonly TilemapTileDefinition[], x: number): void => {
                row.forEach((tile: TilemapTileDefinition, y: number): void => {
                  (zLayer === "below"
                    ? tile.belowIndices
                    : tile.aboveIndices
                  ).forEach((index: number, layerIndex: number): void => {
                    const tilesetDefinition: TilemapTilesetDefinition =
                      getTilemapTilesetDefinitionAtIndex(index);
                    const tileset: TilesetDefinition = (
                      gameData.Tileset as Record<string, TilesetDefinition>
                    )[tilesetDefinition.tileset] as TilesetDefinition;
                    const tilesetX: number = getTileXAtIndex(
                      index - tilesetDefinition.firstTileID,
                      tileset.width,
                    );
                    const tilesetY: number = getTileYAtIndex(
                      index - tilesetDefinition.firstTileID,
                      tileset.width,
                    );
                    const layerID: string = `${zLayer}-${layerIndex}`;
                    let layer: CreateLevelOptionsLayer | undefined =
                      layers.find(
                        (layerInLoop: CreateLevelOptionsLayer): boolean =>
                          layerInLoop.id === layerID,
                      );
                    if (!layer) {
                      layer = {
                        id: layerID,
                        tiles: [],
                      };
                      layers.push(layer);
                    }
                    layer.tiles.push({
                      tilesetID: tilesetDefinition.tileset,
                      tilesetX,
                      tilesetY,
                      x: x * constants["tile-size"],
                      y: y * constants["tile-size"],
                    });
                    const tilesetTile: TilesetTileDefinition | undefined =
                      tileset.tiles[tilesetX]?.[tilesetY];
                    if (typeof tilesetTile !== "undefined") {
                      if (tilesetTile.extendsNPC === true) {
                        state.setValues({
                          initialNPCExtenderPositions: [
                            ...state.values.initialNPCExtenderPositions,
                            {
                              levelID: id,
                              position: {
                                x,
                                y,
                              },
                            },
                          ],
                        });
                      }
                    }
                  });
                });
              },
            );
          };
          addTiles("below");
          layers.push({
            id: "banks",
            tiles: [],
          });
          layers.push({
            id: "chests",
            tiles: [],
          });
          layers.push({
            id: "combination-locks",
            tiles: [],
          });
          layers.push({
            id: "npcs",
            tiles: [],
          });
          layers.push({
            id: "pianos",
            tiles: [],
          });
          layers.push({
            id: "characters",
            tiles: [],
          });
          layers.push({
            id: "enterables",
            tiles: [],
          });
          layers.push({
            id: "npc-indicators",
            tiles: [],
          });
          layers.push({
            id: "emotes",
            tiles: [],
          });
          addTiles("above");
          layers.push({
            id: "markers",
            tiles: [],
          });
          createLevel({
            height: definition.height * constants["tile-size"],
            id,
            layers,
            tileSize: constants["tile-size"],
            width: definition.width * constants["tile-size"],
          });
          definition.tiles.forEach(
            (row: readonly TilemapTileDefinition[], x: number): void => {
              row.forEach((tile: TilemapTileDefinition, y: number): void => {
                const index: number | undefined =
                  tile.bankIndex ??
                  tile.chestIndex ??
                  tile.combinationLockIndex ??
                  tile.enterableIndex ??
                  tile.npcIndex ??
                  tile.pianoIndex;
                if (typeof index === "undefined") {
                  return;
                }
                const tilesetDefinition: TilemapTilesetDefinition =
                  getTilemapTilesetDefinitionAtIndex(index);
                const tileset: TilesetDefinition = (
                  gameData.Tileset as Record<string, TilesetDefinition>
                )[tilesetDefinition.tileset] as TilesetDefinition;
                const tilesetX: number = getTileXAtIndex(
                  index - tilesetDefinition.firstTileID,
                  tileset.width,
                );
                const tilesetY: number = getTileYAtIndex(
                  index - tilesetDefinition.firstTileID,
                  tileset.width,
                );
                const tilesetTile: TilesetTileDefinition | undefined =
                  tileset.tiles[tilesetX]?.[tilesetY];
                if (typeof tilesetTile !== "undefined") {
                  if (typeof tilesetTile.bankID !== "undefined") {
                    state.setValues({
                      initialBankTilePositions: [
                        ...state.values.initialBankTilePositions,
                        {
                          bankID: tilesetTile.bankID,
                          levelID: id,
                          position: {
                            x,
                            y,
                          },
                        },
                      ],
                    });
                  }
                  if (typeof tilesetTile.chestID !== "undefined") {
                    state.setValues({
                      initialChestTilePositions: [
                        ...state.values.initialChestTilePositions,
                        {
                          chestID: tilesetTile.chestID,
                          levelID: id,
                          position: {
                            x,
                            y,
                          },
                        },
                      ],
                    });
                  }
                  if (typeof tilesetTile.combinationLockID !== "undefined") {
                    state.setValues({
                      initialCombinationLockTilePositions: [
                        ...state.values.initialCombinationLockTilePositions,
                        {
                          combinationLockID: tilesetTile.combinationLockID,
                          levelID: id,
                          position: {
                            x,
                            y,
                          },
                        },
                      ],
                    });
                  }
                  if (typeof tilesetTile.enterableID !== "undefined") {
                    state.setValues({
                      initialEnterableTilePositions: [
                        ...state.values.initialEnterableTilePositions,
                        {
                          enterableID: tilesetTile.enterableID,
                          levelID: id,
                          position: {
                            x,
                            y,
                          },
                        },
                      ],
                    });
                  }
                  if (typeof tilesetTile.npcID !== "undefined") {
                    state.setValues({
                      initialNPCTilePositions: [
                        ...state.values.initialNPCTilePositions,
                        {
                          levelID: id,
                          npcID: tilesetTile.npcID,
                          position: {
                            x,
                            y,
                          },
                        },
                      ],
                    });
                  }
                  if (typeof tilesetTile.pianoID !== "undefined") {
                    state.setValues({
                      initialPianoTilePositions: [
                        ...state.values.initialPianoTilePositions,
                        {
                          levelID: id,
                          pianoID: tilesetTile.pianoID,
                          position: {
                            x,
                            y,
                          },
                        },
                      ],
                    });
                  }
                }
              });
            },
          );
          break;
        }
        case "Tileset": {
          const definition: TilesetDefinition = (
            gameData[className] as Record<string, TilesetDefinition>
          )[id] as TilesetDefinition;
          const tiles: CreateTilesetOptionsTile[] = [];
          definition.tiles.forEach(
            (row: readonly TilesetTileDefinition[], tilesetX: number): void => {
              row.forEach(
                (tile: TilesetTileDefinition, tilesetY: number): void => {
                  const animationFrames: CreateTilesetOptionsTileAnimationFrame[] =
                    [];
                  tile.animationFrames.forEach(
                    (
                      animationFrame: TilesetTileAnimationFrameDefinition,
                    ): void => {
                      const animationTilesetX: number = getTileXAtIndex(
                        animationFrame.index,
                        definition.width,
                      );
                      const animationTilesetY: number = getTileYAtIndex(
                        animationFrame.index,
                        definition.width,
                      );
                      animationFrames.push({
                        duration: animationFrame.duration,
                        tilesetX: animationTilesetX,
                        tilesetY: animationTilesetY,
                      });
                    },
                  );
                  tiles.push({
                    animationFrames,
                    isCollidable: false,
                    tilesetX,
                    tilesetY,
                  });
                },
              );
            },
          );
          createTileset({
            height: definition.height * constants["tile-size"],
            id,
            imagePath: `tilesets/${id}`,
            tileSize: constants["tile-size"],
            tiles,
            width: definition.width * constants["tile-size"],
          });
          break;
        }
        case "Transport":
          break;
        default:
          throw new Error(`Unknown class name: ${className}`);
      }
    }
  }
  const defaultClothesDye: [string, ClothesDye] | undefined = Array.from(
    getDefinables(ClothesDye),
  ).find(
    (clothesDye: [string, ClothesDye]): boolean => clothesDye[1].isDefault,
  );
  if (typeof defaultClothesDye === "undefined") {
    throw new Error("Default clothes dye is undefined");
  }
  const defaultHairDye: [string, HairDye] | undefined = Array.from(
    getDefinables(HairDye),
  ).find((hairDye: [string, HairDye]): boolean => hairDye[1].isDefault);
  if (typeof defaultHairDye === "undefined") {
    throw new Error("Default hair dye is undefined");
  }
  const defaultMask: [string, Mask] | undefined = Array.from(
    getDefinables(Mask),
  ).find((mask: [string, Mask]): boolean => mask[1].isDefault);
  if (typeof defaultMask === "undefined") {
    throw new Error("Default mask is undefined");
  }
  const defaultOutfit: [string, Outfit] | undefined = Array.from(
    getDefinables(Outfit),
  ).find((outfit: [string, Outfit]): boolean => outfit[1].isDefault);
  if (typeof defaultOutfit === "undefined") {
    throw new Error("Default outfit is undefined");
  }
  state.setValues({
    constants,
    defaultClothesDyeID: defaultClothesDye[1].id,
    defaultHairDyeID: defaultHairDye[1].id,
    defaultMaskID: defaultMask[1].id,
    defaultOutfitID: defaultOutfit[1].id,
  });
  for (const classObject of getDefinables(Class).values()) {
    classObject.populateCharacterCustomizeOptions();
  }
};
