import React, { useState, useMemo } from 'react';
import { feature } from "topojson-client";
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';
import { MapPresentation } from './MapPresentation';
import { AreaList, ICountData } from './AreaList';
import { interpolationFunc, Colour } from './MapColourHelper';
import { scaleSequential, geoMercator, geoPath } from 'd3';
import styled from 'styled-components';

interface IWorldMapProps {
  worldData: Topology<Objects<GeoJsonProperties>>;
  areaCounts?: Map<string, number>;
  mapColour: Colour;
  removeAreaIds?: Array<string>;
}

const defaultValues = {
  mapData: new Array<Feature<Geometry, GeoJsonProperties>>(),
  areaCounts: new Map<string, number>(),
  mapColour: Colour.Blue,
  removeAreaIds: ['010']
};

const CountryDisplay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255,255,255,0.8);
  max-width: 400px;
  padding: 10px;
  border-radius: 4px;
  border: solid 1px #ddd;
`;

export const WorldMap: React.FunctionComponent<IWorldMapProps> = (props) => {

  const { worldData, areaCounts, mapColour, removeAreaIds } = { ...defaultValues,  ...props };

  const [zoomToCountry, setZoomToCountry] = useState(undefined);

  const maxCount = useMemo(() => areaCounts && areaCounts.size > 0 ? Math.max(...Array.from(areaCounts.values())) : 0, [areaCounts]);
  const presentationData = useMemo(() => {
    const data = worldData as unknown as Topology<Objects<GeoJsonProperties>>;
    let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;
    
    if(removeAreaIds && removeAreaIds.length) {
      mapFeatures.features = mapFeatures.features.filter(value => {
        return removeAreaIds.indexOf(value.id as string) === -1;
      });
    }

    return mapFeatures;
  }, [worldData, removeAreaIds]);

  const mapWidth = 800;
  const mapHeight = 500;

  const colourScale = useMemo(() => scaleSequential(interpolationFunc(mapColour)).domain([0, maxCount]), [mapColour, maxCount]);
  const projection = useMemo(() => geoMercator().scale(100), []);
  const path = useMemo(() => geoPath().projection(projection.fitSize([mapWidth, mapHeight], presentationData)), [projection, mapWidth, mapHeight, presentationData]);

  const allAreaCounts = useMemo(() => {
    return presentationData.features.map(feature => {
      const featureId = feature.id as string;

      return {
          id: feature.id as string,
          displayName: feature.properties.name,
          count: areaCounts.has(featureId) ? areaCounts.get(featureId) : 0
      } as ICountData;
  });
  }, [presentationData, areaCounts]);

  const zoomedCountry: ICountData | null  = useMemo(() => {
    if(zoomToCountry) {
      return allAreaCounts.filter(count => count.id === zoomToCountry)[0];
    }
    return null;
  }, [allAreaCounts, zoomToCountry]);
  

  return (
    <div style={{width: `${mapWidth}px`, height: `${mapHeight}px`, position: 'relative'}}>
      <MapPresentation mapData={presentationData.features} zoomToCountryId={zoomToCountry} areaCounts={areaCounts} height={mapHeight} width={mapWidth} colourScale={colourScale} geoPath={path}></MapPresentation>
      <AreaList allAreaCounts={allAreaCounts} onSelect={(countryId) => setZoomToCountry(countryId)}></AreaList>
      {zoomedCountry && 
        <CountryDisplay>
            <span className="country">{`${zoomedCountry.displayName}: ${zoomedCountry.count}`}</span>
        </CountryDisplay>
      }
    </div>
  );
}
