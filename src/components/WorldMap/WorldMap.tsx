import React, { Component } from 'react';
import { json } from 'd3';
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import mapData from '../../data/countries-110m.json';
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';

interface IWorldMapProps {}

interface IWorldMapState {
    worldData: Array<Feature<Geometry, GeoJsonProperties>>;
}

class WorldMap extends Component<IWorldMapProps, IWorldMapState> {
    constructor(props: IWorldMapProps) {
      super(props);
    }

    projection = () => {
      return geoMercator()
        .scale(100)
        .translate([ 800 / 2, (450 / 2) + 80 ]);
    }

    componentDidMount = () => {
      let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;

      let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;

      this.setState({
          worldData: mapFeatures.features
        });
    }

    render() {
      const data = this.state ? this.state.worldData : null;
      //debugger;
      return (
        <div>
            {data ? (
              <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
                <g className="countries">
                  {
                    data.filter((val, idx) => val.id != '010').map((d,i) => (
                        <path
                          key={ `path-${ i }` }
                          d={ geoPath().projection(this.projection())(d) as string }
                          className="country"
                          fill={ `rgba(255,255,255,255)` }
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
  }
  
  export default WorldMap