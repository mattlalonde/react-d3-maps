import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';

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

const stories = storiesOf('Presentaton', module);

stories.addDecorator(withKnobs);

stories.add('empty map', () => <MapPresentation mapData={mapPresentationData} width={800} height={450}></MapPresentation>);
stories.add('countries displaying counts', () => <MapPresentation mapData={mapPresentationData} width={800} height={450} areaCounts={areaCountMap}></MapPresentation>);
stories.add('zoom into country', () => {

  const label = 'Countries';
  const options: { [label: string]: string | null } = {};
  options['None'] = null;
  mapPresentationData.sort((a, b) => {
    if(a.properties && b.properties) {
      if(a.properties.name < b.properties.name) { return -1; }
      if(a.properties.name > b.properties.name) { return 1; }
    }
    return 0;
  }).forEach(item => {
    if(item.properties) {
      options[item.properties.name] = item.id as string;
    }
  });
  const defaultValue = null;
  const country = select(label, options, defaultValue);
  
  return (<MapPresentation mapData={mapPresentationData} width={800} height={450} zoomToCountryId={country}></MapPresentation>);
});

