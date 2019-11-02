import { interpolateRgb } from 'd3-interpolate';

export enum Colour {
    Red,
    Blue,
    Green,
    Grey
}

export const interpolationFunc = (colour: Colour) => {
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

export const interpolateColours = (a: string, b: string) => {
    return interpolateRgb.gamma(2.2)(a, b);
}