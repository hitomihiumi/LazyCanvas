import { IBaseLayer, IBaseLayerProps } from "./BaseLayer";
import { ScaleType } from "../";

export interface IImageLayer extends IBaseLayer {
    props: IImageLayerProps;
}

export interface IImageLayerProps extends IBaseLayerProps {
    src: string;
    size: {
        width: ScaleType;
        height: ScaleType;
        radius: ScaleType;
    }
}
