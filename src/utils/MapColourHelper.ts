import { interpolateRgb } from 'd3-interpolate';
import { Colour } from './Colours';

export const colourInterpolateFunc = (colour?: Colour, from?: string, to?: string) => {
    if(colour) {
        switch(colour) {
            case Colour.Red:
                return interpolateRgb.gamma(2.2)("#FFFFFF", "#f97c7c");
            case Colour.Blue:
                return interpolateRgb.gamma(2.2)("#FFFFFF", "#9fc5e8");
            case Colour.Green:
                return interpolateRgb.gamma(2.2)("#FFFFFF", "#78d878");
            case Colour.Grey:
                return interpolateRgb.gamma(2.2)("#FFFFFF", "#aaaaaa");
                
        }
    }
    return interpolateRgb.gamma(2.2)(from || "#FFFFFF", to || "#9fc5e8");
}