import { Centring, ColorType, LayerType, SaveFormat, ScaleType, TextAlign, IBaseLayerProps, Transform } from "../types";
import { Gradient } from "../structures/helpers/Gradient";
import { Canvas, SKRSContext2D } from "@napi-rs/canvas";
import { LazyError } from "./LazyUtil";
import * as fs from "fs";
import * as jimp from "jimp";
import { Pattern } from "../structures/helpers/Pattern";

export function generateID(type: string) {
    return `${type}-${Math.random().toString(36).substr(2, 9)}`;
}

let percentReg = /^(\d+)%$/;
let pxReg = /^(\d+)px$/;
let canvasReg = /^(vw|vh|vmin|vmax)$/;

let hexReg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
let rgbReg = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
let rgbaReg = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(0|0?\.\d+|1(\.0)?)\)$/;
let hslReg = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/;
let hslaReg = /^hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*(0|0?\.\d+|1(\.0)?)\)$/;

export function isColor(v: ColorType) {
    return typeof (v === 'string' && (hexReg.test(v) || rgbReg.test(v) || rgbaReg.test(v) || hslReg.test(v) || hslaReg.test(v))) || v instanceof Gradient || v instanceof Pattern;
}

function tooShort(v: string) {
    return v.length < 2 ? `0${v}` : v;
}

export function parseHex(v: string) {
    if (hexReg.test(v)) {
        return v;
    } else if (rgbReg.test(v)) {
        let match = v.match(rgbReg) as RegExpMatchArray;
        let r = parseInt(match[1]);
        let g = parseInt(match[2]);
        let b = parseInt(match[3]);
        return `#${tooShort(r.toString(16))}${tooShort(g.toString(16))}${tooShort(b.toString(16))}`;
    } else if (rgbaReg.test(v)) {
        let match = v.match(rgbaReg) as RegExpMatchArray;
        let r = parseInt(match[1]);
        let g = parseInt(match[2]);
        let b = parseInt(match[3]);
        let a = parseFloat(match[4]);
        return `#${tooShort(r.toString(16))}${tooShort(g.toString(16))}${tooShort(b.toString(16))}:${a}`;
    } else if (hslReg.test(v)) {
        let match = v.match(hslReg) as RegExpMatchArray;
        let h = parseInt(match[1]);
        let s = parseInt(match[2]);
        let l = parseInt(match[3]);
        l /= 100;
        const b = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - b * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    } else if (hslaReg.test(v)) {
        let match = v.match(hslaReg) as RegExpMatchArray;
        let h = parseInt(match[1]);
        let s = parseInt(match[2]);
        let l = parseInt(match[3]);
        let a = parseFloat(match[4]);
        l /= 100;
        const b = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - b * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}:${a}`;
    } else {
        return '#000000';
    }
}

export function parseColor(v: ColorType) {
    if (typeof v === 'string') {
        return parseHex(v);
    } else if (v instanceof Gradient || v instanceof Pattern) {
        return v;
    } else {
        return '#000000';
    }
}

export function parseToNormal(v: ScaleType, canvas: Canvas, layer: { width: number, height: number } = { width: 0, height: 0 }, options: { vertical?: boolean, layer?: boolean } = { vertical: false, layer: false }) {
    if (typeof v === 'number') {
        return v;
    } else if (percentReg.test(v)) {
        return parseFloat(v) * (options.layer ? (options.vertical ? layer.width : layer.height) : (options.vertical ? canvas.width : canvas.height));
    } else if (pxReg.test(v)) {
        return parseFloat(v);
    } else if (canvasReg.test(v)) {
        if (v === 'vw') {
            return (options.layer ? layer.width : canvas.width);
        } else if (v === 'vh') {
            return (options.layer ? layer.height : canvas.height);
        } else if (v === 'vmin') {
            return (options.layer ? Math.max(layer.width, layer.height) : Math.min(canvas.width, canvas.height));
        } else if (v === 'vmax') {
            return (options.layer ? Math.max(layer.width, layer.height) : Math.max(canvas.width, canvas.height));
        }
    }
    return 0;
}

export function drawShadow(ctx: SKRSContext2D, shadow: any) {
    if (shadow) {
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur || 0;
        ctx.shadowOffsetX = shadow.offsetX || 0;
        ctx.shadowOffsetY = shadow.offsetY || 0;
    }
}

export function opacity(ctx: SKRSContext2D, opacity: number) {
    if (opacity < 1) {
        ctx.globalAlpha = opacity;
    }
}

export function filters(ctx: SKRSContext2D, filters: string) {
    if (filters) {
        ctx.filter = filters;
    }
}

export async function parseFillStyle(ctx: SKRSContext2D, color: ColorType) {
    if (color instanceof Gradient || color instanceof Pattern) {
        return color.draw(ctx);
    } else {
        return color;
    }
}

export function transform(ctx: SKRSContext2D, transform: Transform, layer: { width: number, height: number, x: number, y: number, type: LayerType } = { width: 0, height: 0, x: 0, y: 0, type: LayerType.Morph }, extra: { text: string, textAlign: TextAlign, fontSize: number, multiline: boolean} = { text: '', textAlign: TextAlign.Left, fontSize: 0, multiline: false }) {
    if (transform) {
        if (transform.translate) {
            ctx.translate(transform.translate.x, transform.translate.y);
        }
        if (transform.rotate) {
            switch (layer.type) {
                case LayerType.Image:
                case LayerType.Morph:
                    ctx.translate(layer.x + (layer.width / 2), layer.y + (layer.height / 2));
                    ctx.rotate((Math.PI/180) * transform.rotate);
                    ctx.translate(-(layer.x + (layer.width / 2)), -(layer.y + (layer.height / 2)));
                    break;
                case LayerType.Text:
                    if (extra.multiline) {
                        ctx.translate(layer.x + (layer.width / 2), layer.y + (layer.height / 2));
                        ctx.rotate((Math.PI/180) * transform.rotate);
                        ctx.translate(-(layer.x + (layer.width / 2)), -(layer.y + (layer.height / 2)));
                    } else {
                        if (extra.textAlign === TextAlign.Center) {
                            ctx.translate(layer.x, layer.y);
                            ctx.rotate((Math.PI/180) * transform.rotate);
                            ctx.translate(-layer.x, -layer.y);
                        } else if (extra.textAlign === TextAlign.Left || extra.textAlign === TextAlign.Start) {
                            ctx.translate(layer.x + (extra.fontSize * extra.text.length) / 2, layer.y);
                            ctx.rotate((Math.PI/180) * transform.rotate);
                            ctx.translate(-(layer.x + (extra.fontSize * extra.text.length) / 2), -layer.y);
                        } else if (extra.textAlign === TextAlign.Right || extra.textAlign === TextAlign.End) {
                            ctx.translate(layer.x - (extra.fontSize * extra.text.length) / 2, layer.y);
                            ctx.rotate((Math.PI/180) * transform.rotate);
                            ctx.translate(-(layer.x - (extra.fontSize * extra.text.length) / 2), -layer.y);
                        }
                    }
                    break;
            }
        }
        if (transform.scale) {
            ctx.scale(transform.scale.x, transform.scale.y);
        }
        if (transform.matrix) {
            if (!transform.matrix.a || !transform.matrix.b || !transform.matrix.c || !transform.matrix.d || !transform.matrix.e || !transform.matrix.f) throw new LazyError('The matrix transformation must be a valid matrix');
            ctx.transform(transform.matrix.a, transform.matrix.b, transform.matrix.c, transform.matrix.d, transform.matrix.e, transform.matrix.f);
        }
    }
}

export async function saveFile(buffer: any, extension: SaveFormat, name: string) {
    if (!buffer) throw new LazyError('Buffer must be provided');
    if (!extension) throw new LazyError('Extension must be provided');

    fs.writeFileSync(`${name === undefined ? generateRandomName() : name }.${extension}`, buffer);
}

export function generateRandomName() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function drawFill(ctx: SKRSContext2D, props: IBaseLayerProps) {
    let fillStyle = await parseFillStyle(ctx, props.fillStyle);
    if (props.filled) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    } else {
        ctx.strokeStyle = fillStyle;
        ctx.lineWidth = props.stroke?.width || 1;
        ctx.lineCap = props.stroke?.cap || 'butt';
        ctx.lineJoin = props.stroke?.join || 'miter';
        ctx.miterLimit = props.stroke?.miterLimit || 10;
        ctx.lineDashOffset = props.stroke?.dashOffset || 0;
        ctx.setLineDash(props.stroke?.dash || []);
        ctx.stroke();
    }
}

export function isImageUrlValid(src: string) {
    try {
        jimp.read(src);
        return true;
    } catch (error) {
        return false;
    }
}

export function centring(centring: Centring, type: LayerType, width: number, height: number, x: number, y: number) {
    if (centring === Centring.Center) {
        switch (type) {
            case LayerType.Image:
            case LayerType.Morph:
                x -= width / 2;
                y -= height / 2;
                break;
        }
        return { x, y };
    } else {
        return { x, y };
    }
}
