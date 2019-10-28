import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { MapPresentation } from './MapPresentation';
import mapData from '../../data/countries-110m.json';
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { feature } from 'topojson-client';

let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;
let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
let mapPresentationData = mapFeatures.features.filter((val, idx) => val.id != '010');

let areaCountMap = new Map<string, number>();
areaCountMap.set('076', 55); // brazil
areaCountMap.set('170', 110); // columbia

storiesOf('Presentaton', module)
  .add('empty map', () => <MapPresentation mapData={mapPresentationData} width={800} height={450}></MapPresentation>)
  .add('countries displaying counts', () => <MapPresentation mapData={mapPresentationData} width={800} height={450} areaCounts={areaCountMap}></MapPresentation>);

