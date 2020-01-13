## React Maps

Repository to build maps using React and D3. 


## Available maps

### `Topology Count Map`

Map to show counts for each region in a given topology from topojson


##### Fetures

- Click the burger icon to show list of areas in the map
- Area list can be sorted alphabetically or by count
- Click area in list to zoom map
- Click reset icon to reset map and zoom out


##### Objects

`Colour` 

Enum of easy to use colours for the map

Available values:

- Red
- Blue
- Green
- Grey



`IAreaCountData`

Value object in the area count Map

| Property               | Type              | Notes                                                |
|------------------------|-------------------|------------------------------------------------------|
| count                  | number            | count associated with the area                       |
| overrideDisplayName?   | string            | override display name associted with id in topology  |
| overrideZoomToAreaId?  | string \| number  | override area to zoom when item is clicked           |

##### Options

| Option                 | Type                                   | Default Value     | Notes     |
|------------------------|----------------------------------------|-------------------|-----------|
| width                  | number                                 |                   |
| height                 | number                                 |                   |
| mapData                | `Topology<Objects<GeoJsonProperties>>` | empty array       | a topojson topology
| mapDataObjectProperty? | string                                 | 'countries'       | name of property containing GeometryCollection
| featureNameProperty?   | string                                 | 'name'            | name of property to identify feature name
| areaCounts?            | `Map<string \| number, IAreaCountData>`| empty map         | map of id's and it's associated count
| mapColour?             | Colour                                 |                   | overrides mapColourFrom and mapColourTo
| mapColourFrom?         | string                                 | #ffffff           |
| mapColourTo?           | string                                 | #9fc5e8           | Same as Colour.Blue
| removeAreaIds?         | `Set<string \| number>`                | []                | id's of areas not to show on the map
| fontFamily?            | string                                 | Arial             |
| fontColour?            | string                                 | #444444           | 
| listFontSize?          | number                                 | 12                |
| headerFontSize?        | number                                 | 16                |


## Available scripts

In the project directory, you can run:


### `npm run storybook`

This will show all the components and maps in storybook


## Notes

The TopologyCountMap is built to be used with any topojson Topology object. 
Examples can be found at the topojson github page such as the world maps https://github.com/topojson/world-atlas.


### Missing regions from provided Topology file

If an item in the areaCounts map is provided but is not contained in the Topology file it will be displayed in the pop out list as 'unknown'.
The display name can be overridden by providing a value for overrideDisplayName in the associated IAreaCountData value.

### Missing regions in countries-110m.json

A good topology file to use to display a world map is the countries-110m.json due to it's small file size (108KB), however
some regions are missing from the file such as Hong Kong. If you include Hong Kong in the areaCounts map it will still 
be displayed in the pop out list however clicking on the item in the list will not zoom into the correct area as there is no defined region.

If you would like to zoom into a region that is available you can provide a value for overrideZoomToAreaId in the assicated IAreaCountData value.
So, for example, you can make the map zoom into the whole United Kingdom when clicking on either England, Wales, Scotland or Northern Ireland if they
are defined seperately in the list.



### Creating your own Topologies

The all-countries.json topojson file in the data folder aims to include some of the missing regions from the countries-110m.json file such as hong kong. It also includes chinese translations for the country names. It was created using the foloowing steps which you can use to create custom topologies.


First download the natural earth data from https://www.naturalearthdata.com/downloads/10m-cultural-vectors/ . For all coutries download the Admin 0 - Countries file.


Go to https://mapshaper.org/ and upload the previously downloaded natural earth file. You can then open the console and manipulate the file using any mapshaper commands from https://github.com/mbloch/mapshaper/wiki/Command-Reference.

The foloowing commands were used to create the all-coutries file:


remove any tiny islands
`mapshaper --filter-islands min-area=100km2`


remove any remaining regions with no vectors
`mapshaper --clean`


remove unwanted fields from the data
`mapshaper --filter-fields fields=NAME,NAME_ZH,ISO_N3`


Then click simplify and ensure 'prevent shape removal' is selected. Move the slider to simplify the data (2% was used for the all-countries file). Then click 'Repair' to fix any line intersections.


You can now export a file and include any output options you want from the mapshaper commands, such as creating an id field.




