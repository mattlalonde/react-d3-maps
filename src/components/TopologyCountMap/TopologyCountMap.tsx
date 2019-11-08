import React, { useState, useMemo } from 'react';
import { feature } from "topojson-client";
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';
import { MapPresentation } from './MapPresentation';
import { AreaList, ICountData } from './AreaList';
import { Colour, colourInterpolateFunc } from './MapColourHelper';
import { scaleSequential, geoMercator, geoPath } from 'd3';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

interface IWorldMapProps {
  width: number;
  height: number;
  worldData: Topology<Objects<GeoJsonProperties>>;
  areaCounts?: Map<string, number>;
  mapColour?: Colour;
  mapColourFrom?: string;
  mapColourTo?: string;
  removeAreaIds?: Array<string>;
  fontFamily?: string;
  fontColour?: string;
  listFontSize?: number;
  headerFontSize?: number;
}

const defaultValues = {
  mapData: new Array<Feature<Geometry, GeoJsonProperties>>(),
  areaCounts: new Map<string, number>(),
  removeAreaIds: ['010'],
  fontFamily: 'Arial',
  fontColour: '#444444',
  listFontSize: 12,
  headerFontSize: 16
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

export const TopologyCountMap: React.FunctionComponent<IWorldMapProps> = (props) => {

  const { width, height, worldData, areaCounts, removeAreaIds, mapColour, mapColourFrom, mapColourTo, fontFamily, fontColour, listFontSize, headerFontSize } = { ...defaultValues, ...props };

  const [zoomToCountry, setZoomToCountry] = useState('');

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

  const colourScale = useMemo(() => scaleSequential(colourInterpolateFunc(mapColour, mapColourFrom, mapColourTo)).domain([0, maxCount]), [mapColour, mapColourFrom, mapColourTo, maxCount]);
  const projection = useMemo(() => geoMercator().scale(100), []);
  const path = useMemo(() => geoPath().projection(projection.fitSize([width, height], presentationData)), [projection, width, height, presentationData]);

  const allAreaCounts = useMemo(() => {
    return presentationData.features.map(feature => {
      const featureId = feature.id as string;

      return {
          id: feature.id as string,
          displayName: feature && feature.properties ? feature.properties.name : '',
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

  const mapAnimationProps = useSpring({width: width, height: height, position: 'relative'});
  

  return (
    <animated.div style={mapAnimationProps}>
      <MapPresentation mapData={presentationData.features} zoomToCountryId={zoomToCountry} areaCounts={areaCounts} height={height} width={width} colourScale={colourScale} geoPath={path}></MapPresentation>
      <AreaList parentHeight={height} allAreaCounts={allAreaCounts} fontColour={fontColour} fontSize={listFontSize} onSelect={(countryId) => setZoomToCountry(countryId || '')}></AreaList>
      {zoomedCountry && 
        <CountryDisplay style={{fontSize: headerFontSize}}>
            <span style={{fontFamily: fontFamily, color: fontColour}}>{`${zoomedCountry.displayName}: ${zoomedCountry.count}`}</span>
        </CountryDisplay>
      }
    </animated.div>
  );
}
