export const definables: Map<string, Map<string, Definable>> = new Map();
(
  window as unknown as {
    gameDefinables: Map<string, Map<string, Definable>>;
  }
).gameDefinables = definables;
const validIDCharacters: string[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "/",
];

export const getToken = (): string => {
  const pieces: string[] = [];
  for (let i: number = 0; i < 20; i++) {
    pieces.push(
      validIDCharacters[
        Math.floor(Math.random() * validIDCharacters.length)
      ] as string,
    );
  }
  return pieces.join("");
};
export abstract class Definable {
  protected readonly _id: string;

  public constructor(id?: string) {
    this._id = id ?? getToken();
    if (
      this._id
        .split("")
        .some(
          (character: string): boolean =>
            validIDCharacters.includes(character) === false,
        )
    ) {
      throw new Error(
        `${this.constructor.name} "${this._id}" has an invalid id.`,
      );
    }
    if (definables.has(this.constructor.name) === false) {
      definables.set(this.constructor.name, new Map());
    }
    const list: Map<string, Definable> | undefined = definables.get(
      this.constructor.name,
    );
    if (list) {
      if (list.has(this._id)) {
        throw new Error(
          `${this.constructor.name} "${this._id}" already exists.`,
        );
      }
      list.set(this._id, this);
    }
  }

  public get id(): string {
    return this._id;
  }

  public remove(): void {
    const definablesMap: Map<string, Definable> | undefined = definables.get(
      this.constructor.name,
    );
    if (typeof definablesMap === "undefined") {
      throw new Error(
        `An attempt was made to remove ${this.constructor.name} "${this._id}" with no existing definables map.`,
      );
    }
    definablesMap.delete(this._id);
  }

  protected getAccessorErrorMessage(property: string): string {
    return `Could not access ${this.constructor.name} "${this._id}" ${property}.`;
  }
}
export const getDefinables = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
): Map<string, T> => {
  const retrievedDefinables: Map<string, T> = new Map();
  definables
    .get(prototype.name)
    ?.forEach((definable: Definable, id: string): void => {
      if (definable instanceof prototype) {
        retrievedDefinables.set(id, definable);
      }
    });
  return retrievedDefinables;
};
export const getDefinable = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
  id: string,
): T => {
  const definable: T | undefined = getDefinables(prototype).get(id);
  if (typeof definable === "undefined") {
    throw new Error(`${prototype.name} "${id}" does not exist.`);
  }
  return definable;
};
