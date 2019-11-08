import React from 'react';
import { storiesOf } from '@storybook/react';

import { LegendPresentation } from './LegendPresentation';
import { scaleSequential } from 'd3';
import { Colour, colourInterpolateFunc } from './MapColourHelper';


const colourScale = scaleSequential(colourInterpolateFunc(Colour.Green)).domain([0, 1000]);

const stories = storiesOf('Legend Presentaton', module);

stories.add("default", () => (
    <svg width={ 50 } height={ 400 } viewBox={`0 0 50 400`}>
        <LegendPresentation barWidth={10} barHeight={380} colourScale={colourScale} fontSize={10} fontFamily={"sans-serif"}></LegendPresentation>
    </svg>
    
));