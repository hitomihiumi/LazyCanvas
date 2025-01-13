import { Gradient } from "../structures/helpers/Gradient";
import { Pattern } from "../structures/helpers/Pattern";
import { MorphLayer } from "../structures/components/MorphLayer";
import { ImageLayer } from "../structures/components/ImageLayer";
import { TextLayer } from "../structures/components/TextLayer";
import { Group } from "../structures/components/Group";

export type ScaleType = string | number;

export type ColorType = string | Gradient | Pattern;

export type AnyLayer = MorphLayer | ImageLayer | TextLayer | Group;
