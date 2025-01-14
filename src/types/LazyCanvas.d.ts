import { Canvas, SKRSContext2D } from "@napi-rs/canvas";
import { LayersManager } from "../structures/managers/LayersManager";
import { RenderManager } from "../structures/managers/RenderManager";
import { FontsManager } from "../structures/managers/FontsManager";
import { Export } from "./enum";

export interface ILazyCanvas {
    width: number;
    height: number;
    canvas: Canvas;
    ctx: SKRSContext2D;
    layers: LayersManager;
    render: RenderManager;
    fonts: FontsManager;
    exportType: Export;
}
