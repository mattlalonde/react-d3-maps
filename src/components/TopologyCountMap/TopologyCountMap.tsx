import React, { useState, useMemo } from 'react';
import { feature } from "topojson-client";
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';
import { MapPresentation } from '../MapPresentation/MapPresentation';
import { PopOutAreaList, IAreaListCountDataItem } from '../PopOutAreaList/PopOutAreaList';
import { colourInterpolateFunc } from '../../utils/MapColourHelper';
import { Colour } from '../../utils/Colours';
import { scaleSequential, geoMercator, geoPath } from 'd3';
import { useSpring, animated } from 'react-spring';
import { CountryDisplay } from './TopologyCountMapStyles';

export interface IAreaCountData {
  count: number;
  overrideDisplayName?: string;
  overrideZoomToAreaId?: string | number;
}

export interface ITopologyCountMapProps {
  width: number;
  height: number;
  mapData: Topology<Objects<GeoJsonProperties>>;
  mapDataObjectProperty?: string;
  featureNameProperty?: string;
  areaCounts?: Map<string | number, IAreaCountData>;
  mapColour?: Colour;
  mapColourFrom?: string;
  mapColourTo?: string;
  removeAreaIds?: Set<string | number>;
  fontFamily?: string;
  fontColour?: string;
  listFontSize?: number;
  headerFontSize?: number;
}

const defaultValues = {
  mapData: new Array<Feature<Geometry, GeoJsonProperties>>(),
  mapDataObjectProperty: 'countries',
  featureNameProperty: 'name',
  areaCounts: new Map<string | number, IAreaCountData>(),
  removeAreaIds: new Set<string | number>(),
  fontFamily: 'Arial',
  fontColour: '#444444',
  listFontSize: 12,
  headerFontSize: 16
};

export const TopologyCountMap: React.FunctionComponent<ITopologyCountMapProps> = (props) => {

  const { width, height, mapData, mapDataObjectProperty, featureNameProperty, areaCounts, removeAreaIds, mapColour, mapColourFrom, mapColourTo, fontFamily, fontColour, listFontSize, headerFontSize } = { ...defaultValues, ...props };

  const [selectedListItem, setSelectedListItem] = useState<IAreaListCountDataItem>();

  const maxCount = useMemo(() => {
    if(areaCounts && areaCounts.size > 0) {
      const values = [];

      for(let value of areaCounts.values()) {
        values.push(value.count);
      }

      return Math.max(...values);
    }
    return 0;
  }, [areaCounts]);
  const presentationData = useMemo(() => {
    const data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;
    let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects[mapDataObjectProperty]) as FeatureCollection<Geometry, GeoJsonProperties>;
    
    if(removeAreaIds && removeAreaIds.size > 0) {
      mapFeatures.features = mapFeatures.features.filter((value: Feature<Geometry, GeoJsonProperties>) => {
        if(value.id) {
          return !removeAreaIds.has(value.id);
        }
        return false;
      });
    }

    return mapFeatures;
  }, [mapData, removeAreaIds, mapDataObjectProperty]);

  const colourScale = useMemo(() => {
    // if maxCount is zero we just want to show a white colour for all areas
    if(maxCount === 0) {
      return scaleSequential(colourInterpolateFunc(undefined, '#ffffff', '#ffffff')).domain([0, maxCount]);
    }

    return scaleSequential(colourInterpolateFunc(mapColour, mapColourFrom, mapColourTo)).domain([0, maxCount]);
  }, [mapColour, mapColourFrom, mapColourTo, maxCount]);
  const projection = useMemo(() => geoMercator().scale(100), []);
  const path = useMemo(() => geoPath().projection(projection.fitSize([width, height], presentationData)), [projection, width, height, presentationData]);

  const areaListCountData = useMemo(() => {
    const ids: Set<string | number> = new Set<string | number>();
    const counts: IAreaListCountDataItem[] = presentationData.features.map(feature => {
      const featureId = feature.id as string;
      ids.add(featureId);
      const item = areaCounts.get(featureId);
      let displayName = feature && feature.properties ? feature.properties[featureNameProperty] : '';
      let count = 0;
      let overrideZoomToId;

      if(item) {
        displayName = item.overrideDisplayName || displayName
        count = item.count;
        overrideZoomToId = item.overrideZoomToAreaId;
      }

      return {
          id: feature.id as string,
          displayName: displayName,
          count: count,
          overrideZoomToId: overrideZoomToId
      } as IAreaListCountDataItem;
    });

    for(let key of areaCounts.keys()) {
      if(!ids.has(key)) {
        const item = areaCounts.get(key);
        let displayName = 'unknown';
        let count = 0;
        let overrideZoomToId;

        if(item) {
          displayName = item.overrideDisplayName || displayName
          count = item.count;
          overrideZoomToId = item.overrideZoomToAreaId;
        }

        counts.push({
          id: key,
          displayName: displayName,
          count: count,
          overrideZoomToId: overrideZoomToId
        } as IAreaListCountDataItem);
      }
    }

    return counts;
  }, [presentationData, areaCounts, featureNameProperty]);

  const zoomedArea: IAreaListCountDataItem | null  = useMemo(() => {
    if(selectedListItem) {
      return areaListCountData.filter(count => count.id === selectedListItem.id)[0];
    }
    return null;
  }, [areaListCountData, selectedListItem]);

  const mapAnimationProps = useSpring({width: width, height: height, position: 'relative'});
  

  return (
    <animated.div style={mapAnimationProps}>
      <MapPresentation mapData={presentationData.features} zoomToId={selectedListItem ? selectedListItem.overrideZoomToId || selectedListItem.id : ''} areaCounts={areaCounts} height={height} width={width} colourScale={colourScale} geoPath={path}></MapPresentation>
      <PopOutAreaList parentHeight={height} allAreaCounts={areaListCountData} fontColour={fontColour} fontSize={listFontSize} onSelect={(selectedListItem) => setSelectedListItem(selectedListItem)}></PopOutAreaList>
      {zoomedArea && 
        <CountryDisplay style={{fontSize: headerFontSize}}>
            <span style={{fontFamily: fontFamily, color: fontColour}}>{`${zoomedArea.displayName}: ${zoomedArea.count}`}</span>
        </CountryDisplay>
      }
    </animated.div>
  );
}
