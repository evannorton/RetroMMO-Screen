import { listenToSocketioEvent } from "pixel-pigeon";

export const listenForUpdate = <Update>(
  eventName: string,
  callback: (update: Update) => void,
): void => {
  listenToSocketioEvent({
    event: eventName,
    onMessage: (update: unknown): void => {
      callback(update as Update);
    },
  });
};
