import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, number, text } from '@storybook/addon-knobs';

import mapData from '../../data/countries-110m.json';

import { TopologyCountMap } from './TopologyCountMap';
import { Topology, Objects } from 'topojson-specification';
import { GeoJsonProperties, FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import { Colour } from './MapColourHelper';

let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;

let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
mapFeatures.features = mapFeatures.features.filter((val, idx) => val.id !== '010'); // remove antarctica
let mapPresentationData = mapFeatures.features;

let areaCounts = new Map<string, number>();
mapPresentationData.forEach((feature, idx) => {
  if(idx % 2 === 0){
    areaCounts.set(feature.id as string, Math.floor(Math.random() * 1000));
  }
});

const stories = storiesOf('World Map', module);
stories.addDecorator(withKnobs);

  stories.add('default', () => <TopologyCountMap width={800} height={500} worldData={data} areaCounts={areaCounts}></TopologyCountMap>);

  stories.add('colours', () => {
    const label = 'Map Colours';
    const options: { [label: string]: Colour | undefined } = {};
    options['None Selected'] = undefined;
    options['Blue'] = Colour.Blue;
    options['Green'] = Colour.Green;
    options['Grey'] = Colour.Grey;
    options['Red'] = Colour.Red;

    const defaultValue = undefined;
    const colour = select(label, options, defaultValue);

    const mapColourFrom = text('Map Colour From', '');
    const mapColourTo = text('Map Colour To', '');
  
    return (<TopologyCountMap width={800} height={500} worldData={data} areaCounts={areaCounts} mapColour={colour} mapColourFrom={mapColourFrom} mapColourTo={mapColourTo}></TopologyCountMap>);
  });

  stories.add('dimensions', () => {
    const width = number('Width', 800);
    const height = number('Height', 500);

    return (<TopologyCountMap width={width} height={height} worldData={data} areaCounts={areaCounts}></TopologyCountMap>);
  });