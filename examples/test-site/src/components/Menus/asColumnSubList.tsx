/**
 * Copyright © 2020 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file
 * This file demostrates creation of a multi-column "Mega Menu"
 */
// TODO: Refactor to use rc-menu menu groups rather than embedded sublist.

import React, { ComponentType } from 'react';
import { flow, pick } from 'lodash';
import {
  asBasicSublist,
} from '@bodiless/components';
import {
  addClasses,
} from '@bodiless/fclasses';

// TODO: THis is hackery to get rid of unwanted rc-menu props. Find a better way.
const sublistPropsToKeep = [
  'children',
  'unwrap',
  'nodeKey',
  'design',
];

/**
 * HOC to remove all but the specified props.
 */
const pickProps = (propsToPick?: string[]) => (
  <P extends object>(Component: ComponentType<P>) => (props: P) => {
    const newProps = propsToPick ? pick(props, propsToPick) : props;
    return <Component {...newProps as P} />;
  }
);

// The sublist that will go in each column.
/*const asColumnSubList = flow(
  pickProps(sublistPropsToKeep),
  asBasicSublist,
  addClasses('inline-block'),
);*/

const asColumnSubList = asBasicSublist;

export default asColumnSubList;