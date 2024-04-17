import { createSprite, playAudioSource } from "pixel-pigeon";
import { musicVolumeChannelID } from "./volumeChannels";

export const run = (): void => {
  console.log("run");
  playAudioSource("song", {
    volumeChannelID: musicVolumeChannelID,
  });
  createSprite({
    animationID: (): string => "idle-down",
    animations: [
      {
        frames: [
          {
            height: 32,
            sourceHeight: 32,
            sourceWidth: 32,
            sourceX: 32,
            sourceY: 0,
            width: 32,
          },
        ],
        id: "idle-down",
      },
      {
        frames: [
          {
            height: 32,
            sourceHeight: 32,
            sourceWidth: 32,
            sourceX: 32,
            sourceY: 32,
            width: 32,
          },
        ],
        id: "idle-left",
      },
      {
        frames: [
          {
            height: 32,
            sourceHeight: 32,
            sourceWidth: 32,
            sourceX: 32,
            sourceY: 64,
            width: 32,
          },
        ],
        id: "idle-right",
      },
      {
        frames: [
          {
            height: 32,
            sourceHeight: 32,
            sourceWidth: 32,
            sourceX: 32,
            sourceY: 96,
            width: 32,
          },
        ],
        id: "idle-up",
      },
    ],
    coordinates: {
      x: 32,
      y: 32,
    },
    imagePath: "pigeon",
  });
};
