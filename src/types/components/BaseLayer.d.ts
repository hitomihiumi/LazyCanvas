import { Centring, ColorType, LayerType, ScaleType } from "../types";

export interface IBaseLayer {
    id: string;
    type: LayerType;
    renderPosition: number;
    props: IBaseLayerProps;
}

export interface IBaseLayerProps {
    x: ScaleType;
    y: ScaleType;
    centring: Centring;
    filter: string;
    opacity: number;
    filled: boolean;
    fillStyle: ColorType;
    shadow: {
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    stroke: {
        width: number;
        cap: CanvasLineCap;
        join: CanvasLineJoin;
        dashOffset: number;
        dash: number[];
        miterLimit: number;
    };
    transform: Transform;
}

export interface Transform {
    rotate: number;
    scale: {
        x: number;
        y: number;
    };
    translate: {
        x: number;
        y: number;
    };
    matrix: DOMMatrix2DInit;
}
