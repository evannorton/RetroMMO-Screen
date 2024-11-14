import { Definable, getDefinable } from "definables";
import { WorldCharacter } from "./WorldCharacter";

export interface PartyOptions {
  id: string;
}
export class Party extends Definable {
  private _worldCharacterIDs: readonly string[] = [];

  public constructor(options: PartyOptions) {
    super(options.id);
  }

  public get worldCharacterIDs(): readonly string[] {
    return this._worldCharacterIDs;
  }

  public get worldCharacters(): readonly WorldCharacter[] {
    return this._worldCharacterIDs.map(
      (worldCharacterID: string): WorldCharacter =>
        getDefinable(WorldCharacter, worldCharacterID),
    );
  }

  public set worldCharacters(worldCharacters: readonly WorldCharacter[]) {
    this._worldCharacterIDs = worldCharacters.map(
      (worldCharacter: WorldCharacter): string => worldCharacter.id,
    );
  }
}
