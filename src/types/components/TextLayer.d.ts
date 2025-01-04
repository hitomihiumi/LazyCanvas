import { ColorType, FontWeight, TextAlign, TextBaseline, TextDirection, ScaleType } from "../types";
import { IBaseLayer, IBaseLayerProps } from "./BaseLayer";

export interface ITextLayer extends IBaseLayer {
    props: ITextLayerProps;
}

export interface ITextLayerProps extends IBaseLayerProps {
    text: string;
    font: {
        family: string;
        size: number;
        weight: FontWeight;
    };
    multiline: {
        enabled: boolean;
        width: ScaleType;
        height: ScaleType;
        spacing?: number;
    };
    color: ColorType;
    align: TextAlign;
    baseline: TextBaseline;
    direction: TextDirection;
}
