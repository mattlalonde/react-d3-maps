import React from 'react';
import { storiesOf } from '@storybook/react';

import { LegendPresentation } from './LegendPresentation';
import { scaleSequential, interpolateBlues } from 'd3';

const colourScale = scaleSequential(interpolateBlues).domain([1000, 0]);

const stories = storiesOf('Legend Presentaton', module);

stories.add("default", () => (
    <svg width={ 50 } height={ 400 } viewBox={`0 0 50 400`}>
        <LegendPresentation barWidth={10} barHeight={380} colourScale={colourScale} fontSize={10} fontFamily={"sans-serif"}></LegendPresentation>
    </svg>
    
));