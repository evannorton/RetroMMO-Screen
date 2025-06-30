import { BattleType } from "retrommo-types";
import { MusicTrack } from "../classes/MusicTrack";
import { Reachable } from "../classes/Reachable";
import { getDefinable } from "definables";
import { musicVolumeChannelID } from "../volumeChannels";
import { playAudioSource, stopAudioSource } from "pixel-pigeon";
import { state } from "../state";

export const playMusic = (): void => {
  if (state.values.musicTrackID !== null) {
    const musicTrack: MusicTrack = getDefinable(
      MusicTrack,
      state.values.musicTrackID,
    );
    stopAudioSource(musicTrack.audioPath);
  }
  if (state.values.battleState !== null) {
    const reachable: Reachable = getDefinable(
      Reachable,
      state.values.battleState.values.reachableID,
    );
    let musicTrackID: string | null = null;
    switch (state.values.battleState.values.type) {
      case BattleType.Boss:
      case BattleType.Encounter:
        musicTrackID = reachable.pveMusicTrackID;
        break;
      case BattleType.Duel:
        musicTrackID = "square-up-adventurer-showdown";
        break;
    }
    const musicTrack: MusicTrack = getDefinable(MusicTrack, musicTrackID);
    if (musicTrack.hasLoopPoint() === false) {
      throw new Error("Battle music must have a loop point");
    }
    playAudioSource(musicTrack.audioPath, {
      loopPoint: musicTrack.loopPoint,
      volumeChannelID: musicVolumeChannelID,
    });
    state.setValues({
      musicTrackID,
    });
  }
};
