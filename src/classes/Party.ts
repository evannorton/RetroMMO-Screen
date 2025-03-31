import { Definable, getDefinable } from "definables";
import { Player } from "./Player";

export interface PartyOptions {
  readonly id: string;
}
export class Party extends Definable {
  private _playerIDs: readonly string[] = [];

  public constructor(options: PartyOptions) {
    super(options.id);
  }

  public get playerIDs(): readonly string[] {
    return this._playerIDs;
  }

  public get players(): readonly Player[] {
    return this._playerIDs.map(
      (playerID: string): Player => getDefinable(Player, playerID),
    );
  }

  public set playerIDs(players: readonly string[]) {
    this._playerIDs = players.map((playerID: string): string => playerID);
  }
}
