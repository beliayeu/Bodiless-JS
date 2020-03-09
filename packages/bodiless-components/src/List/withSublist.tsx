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

import React, { ComponentType as CT, FC, PropsWithChildren, Fragment } from 'react';
import { withDesign, replaceWith, designable } from '@bodiless/fclasses';
import { flow } from 'lodash';
import List from './index';
import { withToggleButton, withToggleTo } from '../Toggle';
import {
  FinalProps as ListProps,
  ListDesignableComponents,
  UseItemWithSublist,
} from './types';

/**
 * Takes a sublist component and return=s a HOC to add a toggled version
 * of it to a list item.
 *
 * @param Item The item to which the toggle should be added.
 */

const withSublistToggle = (useItemWithSublist: UseItemWithSublist) => (
  (Item: CT<ListProps>) => {
    const ItemWithoutSublist: FC<ListProps> = ({ wrap, nodeKey, ...rest }) => (
      <Item {...rest} />
    );
    const ItemWithSublist = useItemWithSublist(Item);
    return withToggleTo(ItemWithoutSublist)(ItemWithSublist);
  }
);

type SublistListDesignableComponents = {
  Sublist: CT<any>,
}

const SublistComponentsStart: SublistListDesignableComponents = {
  Sublist: List,
}

/**
 * Takes a sublist component and returns a HOC which, when applied to a list,
 * adds a toggled version of the sublist to each item in the list.
 *
 * @param Sublist The sublist component to add to each item.
 */
const withSublist = (useItemWithSublist: UseItemWithSublist) => withDesign<ListDesignableComponents>({
  ItemMenuOptionsProvider: withToggleButton({ icon: 'playlist_add' }),
  Item: flow(
    withSublistToggle(useItemWithSublist),
    designable(SublistComponentsStart),
  ),
});

export default withSublist;