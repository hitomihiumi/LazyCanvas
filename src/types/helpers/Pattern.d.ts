import { LazyCanvas } from '../../';
import { PatternType } from '../types';

export interface IPattern {
    type: PatternType;
    src: string | LazyCanvas;
}
