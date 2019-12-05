import React from 'react';
import { storiesOf } from '@storybook/react';

import { Legend } from './Legend';
import { scaleSequential } from 'd3';
import { colourInterpolateFunc } from '../../utils/MapColourHelper';
import { Colour } from '../../utils/Colours';


const colourScale = scaleSequential(colourInterpolateFunc(Colour.Green)).domain([0, 1000]);

const stories = storiesOf('Legend Presentaton', module);

stories.add("default", () => (
    <svg width={ 50 } height={ 400 } viewBox={`0 0 50 400`}>
        <Legend barWidth={10} barHeight={380} colourScale={colourScale} fontSize={10} fontFamily={"sans-serif"}></Legend>
    </svg>
    
));