/**
 * Copyright © 2019 Johnson & Johnson
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

import { ComponentType as CT} from 'react';
import { withDesign, designable } from '@bodiless/fclasses';
import { flowRight } from 'lodash';
import { withToggleButton, withToggleFromDesign } from '../Toggle';
import {
  FinalProps as ListProps,
  ListDesignableComponents,
} from './types';
import asBasicSublist from './asBasicSublist';

type SublistListDesignableComponents = {
  ItemWithSublist: CT<any>,
  ItemWithoutSublist: CT<any>,
}

const withSublistComponentsStart = Item => {
  return designable({
    ItemWithSublist: Item,
    ItemWithoutSublist: Item,
  })(Item);
}

/**
 * Takes a sublist component and returns a HOC which, when applied to a list,
 * adds a toggled version of the sublist to each item in the list.
 *
 * @param Sublist The sublist component to add to each item.
 */
const withSublist = (Sublist: CT<ListProps>) => withDesign<ListDesignableComponents>({
  ItemMenuOptionsProvider: withToggleButton({ icon: 'playlist_add' }),
  Item: flowRight(
    asBasicSublist(Sublist),
    withSublistComponentsStart,
    withToggleFromDesign('ItemWithoutSublist')('ItemWithSublist'),
  ),
});

export default withSublist;