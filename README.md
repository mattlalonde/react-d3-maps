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

##### Options

| Option          | Type                                   | Default Value     | Notes     |
|-----------------|----------------------------------------|-------------------|-----------|
| width           | number                                 |                   |
| height          | number                                 |                   |
| mapData         | `Topology<Objects<GeoJsonProperties>>` | empty array       | a topojson topology
| areaCounts?     | `Map<string, number>`                  | empty map         | map of string id's and it's associated count
| mapColour?      | Colour                                 |                   | overrides mapColourFrom and mapColourTo
| mapColourFrom?  | string                                 | #ffffff           |
| mapColourTo?    | string                                 | #9fc5e8           | Same as Colour.Blue
| removeAreaIds?  | `Array<string>`                        | ['010']           | 010 is id for antarctica in countries-110m.json topology
| fontFamily?     | string                                 | Arial             |
| fontColour?     | string                                 | #444444           | 
| listFontSize?   | number                                 | 12                |
| headerFontSize? | number                                 | 16                |


## Available scripts

In the project directory, you can run:

### `npm run storybook`

This will show all the components and maps in storybook

