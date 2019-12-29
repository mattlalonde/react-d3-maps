import React from 'react';
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { ScaleSequential, GeoPath } from "d3";
import { useSpring, animated } from 'react-spring';
import { Legend } from '../Legend/Legend';
import {StyledContainer, StyledPath } from './MapPresentationStyles';
import { IAreaCountData } from '../TopologyCountMap/TopologyCountMap';

interface IMapPresentationProps {
    width: number;
    height: number;
    mapData?: Array<Feature<Geometry, GeoJsonProperties>>;
    areaCounts?: Map<string | number, IAreaCountData>;
    zoomToId?: string;
    colourScale: ScaleSequential<string>;
    geoPath: GeoPath;
}

const defaultValues = {
    mapData: new Array<Feature<Geometry, GeoJsonProperties>>(),
    areaCounts: new Map<string | number, IAreaCountData>()
};

const getColour = (scale: ScaleSequential<string>, areaCounts: Map<string | number, IAreaCountData>, id: string) => {
  if(areaCounts.has(id)) {
    const countData = areaCounts.get(id);

    if(countData) {
      return scale(countData.count);
    }
  }

  return scale(0);
}

export const MapPresentation: React.FunctionComponent<IMapPresentationProps> = (props) => {

    const { width, height, mapData, areaCounts, zoomToId, colourScale, geoPath } = { ...defaultValues, ...props };

    let translateX = 0;
    let translateY = 0;
    let scale = 1;
    let strokeWidth = 0.5;

    if(zoomToId) {
      // get a specific country
      const country = mapData.filter(item => item.id === zoomToId);

      if(country.length > 0) {
        const bounds = geoPath.bounds(country[0]);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = (bounds[0][0] + bounds[1][0]) / 2;
        const y = (bounds[0][1] + bounds[1][1]) / 2;
  
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
        translateX = width / 2 - scale * x;
        translateY = height / 2 - scale * y;
        strokeWidth = 0.5 / scale;
      }
    }

    const svgAnimation = useSpring({ width: width, height: height, viewBox: `0 0 ${width} ${height}`, transform: `translate(${translateX}, ${translateY}) scale(${scale})`});

    /*
      NOTE: There is a bug in react-spring https://github.com/react-spring/react-spring/issues/641

      This means we can't animate the viewbox until v9.0 of react-spring but the effect is still usable
    */
    return (
        <StyledContainer>
            {mapData && (
              <animated.svg width={ svgAnimation.width } height={ svgAnimation.height } viewBox={`0 0 ${width} ${height}`}>
                <animated.g className="paths" transform={svgAnimation.transform}>
                  {
                    mapData.map((d,i) => (
                        <StyledPath
                          key={ `path-${ i }` }
                          d={ geoPath(d) as string }
                          className="country"
                          fill={ getColour(colourScale, areaCounts, d.id as string) }
                          stroke={ zoomToId && zoomToId === d.id ? "#000000" : "#BBBBBB"}
                          strokeWidth={ zoomToId && zoomToId === d.id ? strokeWidth * 2 : strokeWidth }
                        />
                      )
                    )
                  }
                </animated.g>
                {areaCounts && areaCounts.size && 
                  <g transform={`translate(10, ${(height - (height / 3)) - 20})`}>
                    <Legend colourScale={colourScale} barHeight={height / 3}></Legend>
                  </g>
                }
                
              </animated.svg>
            )}
          </StyledContainer>
      )
}