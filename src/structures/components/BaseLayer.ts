import { IBaseLayer, IBaseLayerProps, Transform } from "../../types/components/BaseLayer";
import { Centring, LayerType, ScaleType } from "../../types/types";
import { generateID, isColor, parseColor } from "../../utils/utils";
import { LazyError } from "../../utils/LazyUtil";
import { Gradient } from "../helpers/Gradient";

export class BaseLayer<T extends IBaseLayerProps> {
    id: string;
    type: LayerType;
    renderPosition: number;
    props: T;

    constructor(type?: LayerType, props?: T) {
        this.id = generateID(type ? type : LayerType.Base);
        this.type = type ? type : LayerType.Base;
        this.renderPosition = 1;
        this.props = props ? props : {} as T;
        if (!this.props.x) this.props.x = 0;
        if (!this.props.y) this.props.y = 0;
        if (!this.props.opacity) this.props.opacity = 1;
        if (!this.props.centring) this.props.centring = Centring.Center;
        if (!this.props.transform) this.props.transform = {} as Transform
    }

    /**
     * @description Position of the layer in the 2D plane. You can use `numbers`, `percentages`, `px`, `vw`, `vh`, `vmin`, `vmax`.
     * @param x {ScaleType} - The `x` position of the layer
     * @param y {ScaleType} - The `y` position of the layer
     */
    setPosition(x: ScaleType, y: ScaleType) {
        this.props.x = x;
        this.props.y = y;
        return this;
    }

    /**
     * @description Opacity of the layer. The value must be between `0` and `1`.
     * @param opacity {number} - The `opacity` of the layer
     */
    setOpacity(opacity: number) {
        this.props.opacity = opacity;
        return this;
    }

    /**
     * @description Sets the `id` of the layer.
     * @param id {string} - The `id` of the layer
     */
    setID(id: string) {
        this.id = id;
        return this;
    }

    /**
     * @description Sets shadow of layer.
     * @param color {string} - The `color` of the filter
     * @param blur {number} - The `blur` of the filter
     * @param offsetX {number} - The `offsetX` of the filter
     * @param offsetY {number} - The `offsetY` of the filter
     */
    setShadow(color: string, blur?: number, offsetX?: number, offsetY?: number) {
        if (!color) throw new LazyError('The color of the shadow must be provided');
        if (!isColor(color)) throw new LazyError('The color of the shadow must be a valid color');
        let parse = parseColor(color);
        if (parse instanceof Gradient) {
            throw new LazyError('The color of the shadow must be a valid color');
        } else {
            this.props.shadow = {
                color: parse,
                blur: blur || 0,
                offsetX: offsetX || 0,
                offsetY: offsetY || 0,
            };
        }
        return this;
    }

    /**
     * @description Matrix of the layer in the 2D plane.
     * @param matrix {DOMMatrix2DInit} - The `matrix` of the layer
     */
    setMatrix(matrix: DOMMatrix2DInit) {
        this.props.transform = { ...this.props.transform, matrix };
        return this;
    }

    /**
     * @description Scale of the layer in the x and y direction by the given amount from their current position.
     * @param x {number} - The `x` scale of the layer
     * @param y {number} - The `y` scale of the layer
     */
    setScale(x: number, y: number) {
        this.props.transform = { ...this.props.transform, scale: { x, y } };
        return this;
    }

    /**
     * @description Rotate of the layer in the clockwise direction by the given amount from its current position.
     * @param rotate {number} - The `rotate` of the layer
     */
    setRotate(rotate: number) {
        this.props.transform = { ...this.props.transform, rotate };
        return this;
    }

    /**
     * @description Translate of the layer in the x and y direction by the given amount from their current position.
     * @param x {number} - The `x` translation of the layer
     * @param y {number} - The `y` translation of the layer
     */
    setTranslate(x: number, y: number) {
        this.props.transform = { ...this.props.transform, translate: { x, y } };
        return this;
    }

    /**
     * @description The **`CanvasRenderingContext2D`**. filter property of the Canvas 2D API provides filter effects such as blurring and grayscaling.
     * It is similar to the CSS [`filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) property and accepts the same values.
     * @param filter {string} - The `filter` of the layer. Not support multiple filters.
     */
    setFilter(filter: string) {
        this.props.filter = filter;
        return this;
    }

    /**
     * @description Sets type of centring of the layer.
     * @param centring {Centring} - The `centring` of the layer
     */
    setCentring(centring: Centring) {
        this.props.centring = centring;
        return this;
    }

    /**
     * @returns {IBaseLayer}
     */
    toJSON(): IBaseLayer {
        return {
            id: this.id,
            type: this.type,
            renderPosition: this.renderPosition,
            props: this.props,
        };
    }
}
