import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import WorldMap from './WorldMap';

storiesOf('Task', module)
  .add('default', () => <WorldMap></WorldMap>);