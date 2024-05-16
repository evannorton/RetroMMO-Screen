import "./input";
import "./volumeChannels";
import { initialize, onRun, onTick } from "pixel-pigeon";
import { run } from "./run";
import { tick } from "./tick";

onRun(run);
onTick(tick);
initialize();
