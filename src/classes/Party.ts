import { Character } from "./Character";
import { Definable, getDefinable } from "../definables";

export interface PartyOptions {
  characterIDs: string[];
  id: string;
}
export class Party extends Definable {
  private _characterIDs: string[];

  public constructor(options: PartyOptions) {
    super(options.id);
    this._characterIDs = options.characterIDs;
  }

  public get characters(): Character[] {
    return this._characterIDs.map(
      (characterID: string): Character => getDefinable(Character, characterID),
    );
  }

  public set characters(characters: Character[]) {
    this._characterIDs = characters.map(
      (character: Character): string => character.id,
    );
  }
}
