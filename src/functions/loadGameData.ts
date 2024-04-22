import { BodyCosmetic } from "../classes/BodyCosmetic";
import {
  BodyCosmeticDefinition,
  ClassDefinition,
  Definition,
  HeadCosmeticDefinition,
  ItemDefinition,
} from "retrommo-types";
import { Class } from "../classes/Class";
import { HeadCosmetic } from "../classes/HeadCosmetic";
import { Item } from "../classes/Items";
import { makeHTTPRequest } from "pixel-pigeon";
import { state } from "../state";

export const loadGameData = async (): Promise<void> => {
  if (state.values.serverURL === null) {
    throw new Error("Attempted to load game data with no server URL.");
  }
  const gameData: Response = await makeHTTPRequest({
    url: `${state.values.serverURL}/game-data.json`,
  });
  const data: Record<
    string,
    Record<string, Definition>
  > = (await gameData.json()) as Record<string, Record<string, Definition>>;
  for (const className in data) {
    for (const id in data[className]) {
      switch (className) {
        case "Ability":
          // new Ability();
          break;
        case "AudioSource":
          // new AudioSource();
          break;
        case "Bank":
          // new Bank();
          break;
        case "BattleImpactAnimation":
          // new BattleImpactAnimation();
          break;
        case "BodyCosmetic": {
          const definition: BodyCosmeticDefinition = data[className][
            id
          ] as BodyCosmeticDefinition;
          new BodyCosmetic({
            definition,
            id,
          });
          break;
        }
        case "Chest":
          // new Chest();
          break;
        case "Class": {
          const definition: ClassDefinition = data[className][
            id
          ] as ClassDefinition;
          new Class({
            definition,
            id,
          });
          break;
        }
        case "ClothesColor":
          // new ClothesColor();
          break;
        case "ClothesDye":
          // new ClothesDye();
          break;
        case "CombinationLock":
          // new CombinationLock();
          break;
        case "Emote":
          // new Emote();
          break;
        case "Enterable":
          // new Enterable();
          break;
        case "Figure":
          // new Figure();
          break;
        case "HairColor":
          // new HairColor();
          break;
        case "HairDye":
          // new HairDye();
          break;
        case "HeadCosmetic": {
          const definition: HeadCosmeticDefinition = data[className][
            id
          ] as HeadCosmeticDefinition;
          new HeadCosmetic({
            definition,
            id,
          });
          break;
        }
        case "ImageSource":
          // new ImageSource();
          break;
        case "Item": {
          const definition: ItemDefinition = data[className][
            id
          ] as ItemDefinition;
          new Item({
            definition,
            id,
          });
          break;
        }
        case "Label":
          // new Label();
          break;
        case "Landscape":
          // new Landscape();
          break;
        case "Mask":
          // new Mask();
          break;
        case "Monster":
          // new Monster();
          break;
        case "MusicTrack":
          // new MusicTrack();
          break;
        case "NPC":
          // new NPC();
          break;
        case "Noise":
          // new Noise();
          break;
        case "Outfit":
          // new Outfit();
          break;
        case "Panel":
          // new Panel();
          break;
        case "Picture":
          // new Picture();
          break;
        case "Reachable":
          // new Reachable();
          break;
        case "Rectangle":
          // new Rectangle();
          break;
        case "ResourceBar":
          // new ResourceBar();
          break;
        case "SkinColor":
          // new SkinColor();
          break;
        case "Switch":
          // new Switch();
          break;
        case "Tilemap":
          // new Tilemap();
          break;
        case "TilemapTile":
          // new TilemapTile();
          break;
        case "TilemapTileset":
          // new TilemapTileset();
          break;
        case "Tileset":
          // new Tileset();
          break;
        case "TilesetTileAnimationFrame":
          // new TilesetTileAnimationFrame();
          break;
        case "TilesetTile":
          // new TilesetTile();
          break;
        case "Transport":
          // new Transport();
          break;
        default:
          throw new Error(`Unknown class name: ${className}`);
      }
    }
  }
};
