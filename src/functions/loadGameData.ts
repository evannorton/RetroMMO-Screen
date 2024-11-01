import { BodyCosmetic } from "../classes/BodyCosmetic";
import {
  BodyCosmeticDefinition,
  ClassDefinition,
  ClothesColorDefinition,
  ClothesDyeDefinition,
  CombinationLockDefinition,
  Constants,
  Definition,
  FigureDefinition,
  HairColorDefinition,
  HairDyeDefinition,
  HeadCosmeticDefinition,
  ItemDefinition,
  MaskDefinition,
  NPCDefinition,
  OutfitDefinition,
  SkinColorDefinition,
  TilemapDefinition,
  TilemapTileDefinition,
  TilemapTilesetDefinition,
  TilesetDefinition,
  TilesetTileAnimationFrameDefinition,
  TilesetTileDefinition,
} from "retrommo-types";
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
import { Figure } from "../classes/Figure";
import { HairColor } from "../classes/HairColor";
import { HairDye } from "../classes/HairDye";
import { HeadCosmetic } from "../classes/HeadCosmetic";
import { Item } from "../classes/Item";
import { Mask } from "../classes/Mask";
import { NPC } from "../classes/NPC";
import { Outfit } from "../classes/Outfit";
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
        case "Ability":
          break;
        case "AudioSource":
          break;
        case "Bank":
          break;
        case "BattleImpactAnimation":
          break;
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
        case "Chest":
          break;
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
        case "Emote":
          break;
        case "Enterable":
          break;
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
        case "Landscape":
          break;
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
        case "Monster":
          break;
        case "MusicTrack":
          break;
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
        case "Picture":
          break;
        case "Reachable":
          break;
        case "Rectangle":
          break;
        case "ResourceBar":
          break;
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
                  });
                });
              },
            );
          };
          addTiles("below");
          layers.push({
            id: "combination-locks",
            tiles: [],
          });
          layers.push({
            id: "npcs",
            tiles: [],
          });
          layers.push({
            id: "characters",
            tiles: [],
          });
          layers.push({
            id: "npc-indicators",
            tiles: [],
          });
          addTiles("above");
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
                  tile.npcIndex ?? tile.combinationLockIndex;
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
                    isCollidable: tile.collision,
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
