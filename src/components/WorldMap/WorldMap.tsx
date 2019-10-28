import React, { Component } from 'react';
import { feature } from "topojson-client"
import mapData from '../../data/countries-110m.json';
import { Topology, Objects } from 'topojson-specification';
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';
import { MapPresentation } from './MapPresentation';

interface IWorldMapProps {}

interface IWorldMapState {
    worldData: Array<Feature<Geometry, GeoJsonProperties>>;
}

class WorldMap extends Component<IWorldMapProps, IWorldMapState> {
    constructor(props: IWorldMapProps) {
      super(props);
    }

    componentDidMount = () => {
      let data = mapData as unknown as Topology<Objects<GeoJsonProperties>>;

      let mapFeatures: FeatureCollection<Geometry, GeoJsonProperties> = feature(data, data.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>;

      this.setState({
          worldData: mapFeatures.features.filter((val, idx) => val.id != '010')
        });
    }

    render() {
      const data = this.state ? this.state.worldData : null;
      return (
        <div>
          <MapPresentation mapData={data} />
        </div>
      )
    }
  }
  
  export default WorldMap