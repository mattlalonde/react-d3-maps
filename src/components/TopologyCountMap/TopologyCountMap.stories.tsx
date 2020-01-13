import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, number, text } from '@storybook/addon-knobs';

import basicWorldMapData from '../../data/countries-110m.json';
import detailedWorldMapData from '../../data/all-countries.json';

import { TopologyCountMap, IAreaCountData } from './TopologyCountMap';
import { Topology, Objects } from 'topojson-specification';
import { GeoJsonProperties, FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import { Colour } from '../../utils/Colours';


/******* Basic map features and area counts ********/
let basicWorldData = basicWorldMapData as unknown as Topology<Objects<GeoJsonProperties>>;

let basicMapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(basicWorldData, basicWorldData.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
basicMapFeatures.features = basicMapFeatures.features.filter((val, idx) => val.id !== '010'); // remove antarctica
let basicMapPresentationData = basicMapFeatures.features;

let basicMapAreaCounts = new Map<string | number, IAreaCountData>();
basicMapPresentationData.forEach((feature, idx) => {
  if(idx % 2 === 0){
    basicMapAreaCounts.set(feature.id as string, { count: Math.floor(Math.random() * 1000) });
  }
});

/******* Detailed map features and area counts *********/
let detailedWorldData = detailedWorldMapData as unknown as Topology<Objects<GeoJsonProperties>>;

let detailedMapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(detailedWorldData, detailedWorldData.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
detailedMapFeatures.features = detailedMapFeatures.features.filter((val, idx) => val.id !== 10); // remove antarctica
let detailedMapPresentationData = detailedMapFeatures.features;

let detailedMapAreaCounts = new Map<string | number, IAreaCountData>();
detailedMapPresentationData.forEach((feature, idx) => {
  if(idx % 2 === 0){
    detailedMapAreaCounts.set(feature.id as string, { count: Math.floor(Math.random() * 1000) });
  }
});



const stories = storiesOf('World Map', module);
stories.addDecorator(withKnobs);

  stories.add('default', () => <TopologyCountMap width={800} height={500} mapData={basicWorldData} areaCounts={basicMapAreaCounts}></TopologyCountMap>);

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
    const removeAreaIds = new Set<string | number>();
    removeAreaIds.add('010');

    const mapColourFrom = text('Map Colour From', '');
    const mapColourTo = text('Map Colour To', '');
  
    return (<TopologyCountMap width={800} height={500} mapData={basicWorldData} areaCounts={basicMapAreaCounts} removeAreaIds={removeAreaIds} mapColour={colour} mapColourFrom={mapColourFrom} mapColourTo={mapColourTo}></TopologyCountMap>);
  });

  stories.add('dimensions', () => {
    const width = number('Width', 800);
    const height = number('Height', 500);
    const removeAreaIds = new Set<string | number>();
    removeAreaIds.add('010');

    return (<TopologyCountMap width={width} height={height} mapData={basicWorldData} areaCounts={basicMapAreaCounts} removeAreaIds={removeAreaIds}></TopologyCountMap>);
  });

  stories.add('area not in topology (Hong Kong)', () => {
    const removeAreaIds = new Set<string | number>();
    removeAreaIds.add('010');
    const newCounts = new Map<string | number, IAreaCountData>(basicMapAreaCounts);
    newCounts.set('344', {
      count: 1035,
      overrideDisplayName: 'Hong Kong',
      overrideZoomToAreaId: '156'
    }); //add hong kong

    const width = number('Width', 800);
    const height = number('Height', 500);

    return (<TopologyCountMap width={width} height={height} mapData={basicWorldData} areaCounts={newCounts} removeAreaIds={removeAreaIds}></TopologyCountMap>);
  });

  stories.add('detailed map (can zoom on Hong Kong)', () => {
    const removeAreaIds = new Set<string | number>();
    removeAreaIds.add('010');

    const width = number('Width', 800);
    const height = number('Height', 500);

    return (<TopologyCountMap width={width} height={height} mapData={detailedWorldData} areaCounts={detailedMapAreaCounts} removeAreaIds={removeAreaIds}  featureNameProperty={'NAME'}></TopologyCountMap>);
  });

  stories.add('chinese language', () => {
    const removeAreaIds = new Set<string | number>();
    removeAreaIds.add('010');

    const width = number('Width', 800);
    const height = number('Height', 500);

    return (<TopologyCountMap width={width} height={height} mapData={detailedWorldData} areaCounts={detailedMapAreaCounts} removeAreaIds={removeAreaIds}  featureNameProperty={'NAME_ZH'}></TopologyCountMap>);
  });