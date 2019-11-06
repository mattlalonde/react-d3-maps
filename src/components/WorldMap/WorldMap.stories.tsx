import React from 'react';
import { storiesOf } from '@storybook/react';

import mapData from '../../data/countries-110m.json';

import { WorldMap } from './WorldMap';
import { Topology, Objects } from 'topojson-specification';
import { GeoJsonProperties, FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';

let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;

let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
mapFeatures.features = mapFeatures.features.filter((val, idx) => val.id != '010'); // remove antarctica
let mapPresentationData = mapFeatures.features;

let areaCounts = new Map<string, number>();
mapPresentationData.forEach((feature, idx) => {
  if(idx % 2 === 0){
    areaCounts.set(feature.id as string, Math.floor(Math.random() * 1000));
  }
});

storiesOf('World Map', module)
  .add('default', () => <WorldMap worldData={data} areaCounts={areaCounts}></WorldMap>);