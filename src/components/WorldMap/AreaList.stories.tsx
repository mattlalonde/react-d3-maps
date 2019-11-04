import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import mapData from '../../data/countries-110m.json';
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { feature } from 'topojson-client';

import { AreaList, ICountData } from './AreaList';

let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;
let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
mapFeatures.features = mapFeatures.features.filter((val, idx) => val.id != '010'); // remove antarctica
let mapPresentationData = mapFeatures.features;

let areaCounts = new Map<string, number>();
areaCounts.set('076', 10); // brazil
areaCounts.set('170', 110); // columbia

const allAreaCounts = new Array<ICountData>();

mapPresentationData.forEach(feature => {
    const featureId = feature.id as string;

    allAreaCounts.push({
        id: feature.id as string,
        displayName: feature.properties.name,
        count: areaCounts.has(featureId) ? areaCounts.get(featureId) : 0
    });
});

const stories = storiesOf('Area List', module);
stories.addDecorator(withKnobs);

stories.add("default", () => {
    return (
        <div style={{ width: "500px", height: "500px", border: "solid 1px #ddd", position: "relative"}}>
            <AreaList allAreaCounts={allAreaCounts}></AreaList>
        </div>
    );
   
});