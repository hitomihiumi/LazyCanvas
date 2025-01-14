import { LazyCanvas } from '../../';
import { PatternType } from '../enum';

export interface IPattern {
    type: PatternType;
    src: string | LazyCanvas;
}
