import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';

import { MapPresentation } from './MapPresentation';
import mapData from '../../data/countries-110m.json';
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { feature } from 'topojson-client';
import { scaleSequential, interpolateBlues, geoMercator, geoPath } from 'd3';

let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;
let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
let mapPresentationData = mapFeatures.features.filter((val, idx) => val.id != '010'); // remove antarctica

let areaCounts = new Map<string, number>();
areaCounts.set('076', 55); // brazil
areaCounts.set('170', 110); // columbia

const maxCount: number = Math.max(...Array.from(areaCounts.values())); // times 2 so the colour doesn't get too dark
const minCount: number = 0;//Math.min(...Array.from(areaCounts.values()));

const mapWidth = 800;
const mapHeight = 450;

const colourScale = scaleSequential(interpolateBlues).domain([minCount, maxCount]);
const projection = geoMercator().scale(100).translate([ mapWidth / 2, (mapHeight / 2) ]);
const path = geoPath().projection(projection);



const stories = storiesOf('Map Presentaton', module);

stories.addDecorator(withKnobs);

stories.add('empty map', () => <MapPresentation mapData={mapPresentationData} width={mapWidth} height={mapHeight} colourScale={colourScale} geoPath={path}></MapPresentation>);
stories.add('countries displaying counts', () => <MapPresentation mapData={mapPresentationData} width={mapWidth} height={mapHeight} areaCounts={areaCounts} colourScale={colourScale} geoPath={path}></MapPresentation>);
stories.add('zoom into country', () => {

  const label = 'Countries';
  const options: { [label: string]: string | undefined } = {};
  options['None'] = undefined;
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
  
  return (<MapPresentation mapData={mapPresentationData} width={mapWidth} height={mapHeight} zoomToCountryId={country || ""} colourScale={colourScale} geoPath={path}></MapPresentation>);
});

