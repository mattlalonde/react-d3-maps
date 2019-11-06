import React, { useState } from 'react';
import { feature } from "topojson-client";
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';
import { MapPresentation } from './MapPresentation';
import { AreaList, ICountData } from './AreaList';
import { interpolationFunc, Colour } from './MapColourHelper';
import { scaleSequential, geoMercator, geoPath } from 'd3';

interface IWorldMapProps {
  worldData: Topology<Objects<GeoJsonProperties>>;
  areaCounts?: Map<string, number>;
}

const defaultValues = {
  mapData: new Array<Feature<Geometry, GeoJsonProperties>>(),
  areaCounts: new Map<string, number>()
};

export const WorldMap: React.FunctionComponent<IWorldMapProps> = (props) => {

  const { worldData, areaCounts } = { ...defaultValues,  ...props };

  const [zoomToCountry, setZoomToCountry] = useState(undefined);

  const data = worldData as unknown as Topology<Objects<GeoJsonProperties>>;
  let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
  mapFeatures.features = mapFeatures.features.filter((val, idx) => val.id != '010'); // remove antarctica
  let mapPresentationData = mapFeatures.features;

  const maxCount: number = areaCounts && areaCounts.size > 0 ? Math.max(...Array.from(areaCounts.values())) : 0;
  const minCount: number = 0;

  const mapWidth = 800;
  const mapHeight = 500;

  const colourScale = scaleSequential(interpolationFunc(Colour.Blue)).domain([minCount, maxCount]);
  const projection = geoMercator().scale(100);
  const path = geoPath().projection(projection.fitSize([mapWidth, mapHeight], mapFeatures));

  const allAreaCounts = new Array<ICountData>();

  mapPresentationData.forEach(feature => {
      const featureId = feature.id as string;

      allAreaCounts.push({
          id: feature.id as string,
          displayName: feature.properties.name,
          count: areaCounts.has(featureId) ? areaCounts.get(featureId) : 0
      });
  });

  return (
    <div style={{width: `${mapWidth}px`, height: `${mapHeight}px`, position: 'relative'}}>
      <MapPresentation mapData={mapPresentationData} zoomToCountryId={zoomToCountry} areaCounts={areaCounts} height={mapHeight} width={mapWidth} colourScale={colourScale} geoPath={path}></MapPresentation>
      <AreaList allAreaCounts={allAreaCounts} onSelect={(countryId) => setZoomToCountry(countryId)}></AreaList>
    </div>
  );
}
