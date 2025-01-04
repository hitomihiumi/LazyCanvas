import { IRenderManager } from "../../types/managers/RenderManager";
import { LazyCanvas } from "../LazyCanvas";
import { Export } from "../../types/types";
import { SKRSContext2D } from "@napi-rs/canvas";
import { Group } from "../components/Group";

export class RenderManager implements IRenderManager {
    lazyCanvas: LazyCanvas;

    constructor(lazyCanvas: LazyCanvas) {
        this.lazyCanvas = lazyCanvas;
    }

    /**
     * This will render all the layers and return the rendered canvas buffer or ctx.
     * @returns {Promise<Buffer | SKRSContext2D | undefined>}
     */
    public async render(): Promise<Buffer | SKRSContext2D | undefined> {

        await Promise.all(Array.from(this.lazyCanvas.layers.values()).map(async (layer) => {
            if (layer instanceof Group) {
                await Promise.all(layer.components.map(async (component) => {
                    await component.draw(this.lazyCanvas.ctx, this.lazyCanvas.canvas);
                }));
            } else {
                await layer.draw(this.lazyCanvas.ctx, this.lazyCanvas.canvas);
                //this.lazyCanvas.ctx.shadowColor = 'transparent';
            }
        }));

        switch (this.lazyCanvas.exportType) {
            case Export.Buffer:
                return this.lazyCanvas.canvas.toBuffer('image/png');
            case Export.CTX:
                return this.lazyCanvas.ctx;
            case Export.SVG:
                // @ts-ignore
                return this.lazyCanvas.canvas.getContent().toString('utf8');
            default:
                return this.lazyCanvas.canvas.toBuffer('image/png');
        }
    }
}
