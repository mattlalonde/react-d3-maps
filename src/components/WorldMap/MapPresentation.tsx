import React from 'react';
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { geoPath, geoMercator, scaleSequential, interpolateBlues, zoom } from "d3";
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';

interface IMapPresentationProps {
    width: number;
    height: number;
    mapData?: Array<Feature<Geometry, GeoJsonProperties>> | null;
    areaCounts?: Map<string, number> | null;
    zoomToCountryId?: string | null;
}

const StyledPath = styled.path`
  &:hover {
    stroke: #aaaaaa;
  }
`;

const StyledContainer = styled.div`
  border: solid 1px #ddd;
`;

export const MapPresentation: React.FunctionComponent<IMapPresentationProps> = (props) => {

    const areaCounts = props.areaCounts || new Map<string, number>();
    const mapData = props.mapData || [];

    const maxCount: number = Math.max(...Array.from(areaCounts.values())) * 2; // times 2 so the colour doesn't get too dark
    const minCount: number = 0;//Math.min(...Array.from(areaCounts.values()));

    const colour = scaleSequential(interpolateBlues).domain([minCount, maxCount]);
    const projection = geoMercator().scale(100).translate([ props.width / 2, (props.height / 2) ]);
    const path = geoPath().projection(projection);

    let translateX = 0;
    let translateY = 0;
    let scale = 1;
    let strokeWidth = 0.5;

    if(props.zoomToCountryId) {
      // get a specific country
      const country = mapData.filter(item => item.id == props.zoomToCountryId);
      const bounds = path.bounds(country[0]);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;

      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / props.width, dy / props.height)));
      translateX = props.width / 2 - scale * x;
      translateY = props.height / 2 - scale * y;
      strokeWidth = 0.5 / scale;
    }
    const groupAnimation = useSpring({ transform: `translate(${translateX}, ${translateY}) scale(${scale})` });


    return (
        <StyledContainer>
            {props.mapData ? (
              <svg width={ props.width } height={ props.height } viewBox={`0 0 ${props.width} ${props.height}`}>
                <animated.g className="paths" transform={groupAnimation.transform}>
                  {
                    props.mapData.map((d,i) => (
                        <StyledPath
                          key={ `path-${ i }` }
                          d={ path(d) as string }
                          className="country"
                          fill={ areaCounts.has(d.id as string) ? colour(areaCounts.get(d.id as string) as number) : `rgba(255,255,255,255)` }
                          stroke={ props.zoomToCountryId && props.zoomToCountryId == d.id ? "#000000" : "#DDDDDD"}
                          strokeWidth={ props.zoomToCountryId && props.zoomToCountryId == d.id ? strokeWidth * 2 : strokeWidth }
                        />
                      )
                    )
                  }
                </animated.g>
              </svg>
            ) : (
              <></>
            )}
          </StyledContainer>
      )
}