import "./input";
import "./volumeChannels";
import { initialize, onRun } from "pixel-pigeon";
import { run } from "./run";

onRun(run);
initialize();
