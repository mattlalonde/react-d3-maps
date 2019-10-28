import React from 'react';
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { geoPath, geoMercator, scaleSequential, interpolateBlues } from "d3";

interface IMapPresentationProps {
    width: number;
    height: number;
    mapData?: Array<Feature<Geometry, GeoJsonProperties>> | null;
    areaCounts?: Map<string, number> | null;
}



export const MapPresentation: React.FunctionComponent<IMapPresentationProps> = (props) => {

    const areaCounts = props.areaCounts || new Map<string, number>();

    const maxCount: number = Math.max(...Array.from(areaCounts.values())) * 2; // times 2 so the colour doesn't get too dark
    const minCount: number = 0;//Math.min(...Array.from(areaCounts.values()));

    const colour = scaleSequential(interpolateBlues).domain([minCount, maxCount]);
    const projection = geoMercator().scale(100).translate([ props.width / 2, (props.height / 2) ]);

    return (
        <div>
            {props.mapData ? (
              <svg width={ props.width } height={ props.height } viewBox={`0 0 ${props.width} ${props.height}`}>
                <g className="paths">
                  {
                    props.mapData.map((d,i) => (
                        <path
                          key={ `path-${ i }` }
                          d={ geoPath().projection(projection)(d) as string }
                          className="country"
                          fill={ areaCounts.has(d.id as string) ? colour(areaCounts.get(d.id as string) as number) : `rgba(255,255,255,255)` }
                          stroke="#AAAAAA"
                          strokeWidth={ 0.5 }
                        />
                      )
                    )
                  }
                </g>
              </svg>
            ) : (
              <></>
            )}
          </div>
      )
}