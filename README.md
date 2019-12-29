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
..* Red
..* Blue
..* Green
..* Grey



`IAreaCountData`
Value object in the area count Map

| Property               | Type              | Notes                                                |
|------------------------|-------------------|------------------------------------------------------|
| count                  | number            | count associated with the area                       |
| overrideDisplayName?   | string            | override display name associted with id in topology  |
| overrideZoomToAreaId?  | string or number  | override area to zoom when item is clicked           |

##### Options

| Option          | Type                                   | Default Value     | Notes     |
|-----------------|----------------------------------------|-------------------|-----------|
| width           | number                                 |                   |
| height          | number                                 |                   |
| mapData         | `Topology<Objects<GeoJsonProperties>>` | empty array       | a topojson topology
| areaCounts?     | `Map<string or number, IAreaCountData>` | empty map         | map of id's and it's associated count
| mapColour?      | Colour                                 |                   | overrides mapColourFrom and mapColourTo
| mapColourFrom?  | string                                 | #ffffff           |
| mapColourTo?    | string                                 | #9fc5e8           | Same as Colour.Blue
| removeAreaIds?  | `Set<string or number>`                 | []                | id's of areas not to show on the map
| fontFamily?     | string                                 | Arial             |
| fontColour?     | string                                 | #444444           | 
| listFontSize?   | number                                 | 12                |
| headerFontSize? | number                                 | 16                |


## Available scripts

In the project directory, you can run:

### `npm run storybook`

This will show all the components and maps in storybook

