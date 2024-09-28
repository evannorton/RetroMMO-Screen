import "./input";
import "./volumeChannels";
import { handleError } from "./functions/handleError";
import { initialize, onError, onRun, onTick } from "pixel-pigeon";
import { run } from "./run";
import { tick } from "./tick";

onError(handleError);
onRun(run);
onTick(tick);
initialize();
