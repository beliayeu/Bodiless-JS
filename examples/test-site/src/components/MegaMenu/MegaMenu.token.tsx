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

import { flow } from 'lodash';
import { asToutHorizontal } from '@bodiless/organisms';
import { withDesign, addClasses } from '@bodiless/fclasses';

import { asToutWithPaddings, asToutDefaultStyle } from '../Tout/token';

import {
  asSimpleSubMenu,
  withBaseMenuStyles,
  withBaseSubMenuStyles,
} from './SimpleMenu.token';

/**
 * Touts Sub Menu Styles
 * ===========================================
 */
const withMenuToutStyles = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);

const withToutStyles = withDesign({
  Item: addClasses('w-1/3'),
});

const asToutsSubMenu = flow(
  withToutStyles,
  withBaseSubMenuStyles,
);

/**
 * Columns Sub Menu Styles
 * ===========================================
 */
const withColumnHoverEffect = withDesign({
  Wrapper: withDesign({
    WrapperItem: addClasses('hover:bg-teal-600'),
  }),
  Item: addClasses('hover:bg-teal-500'),
});

const withColumnStyles = flow(
  withDesign({
    Item: addClasses('pr-2 pl-5'),
  }),
  withColumnHoverEffect,
);

const asColumnSubMenu = flow(
  withDesign({
    Item: withColumnStyles,
  }),
  withBaseSubMenuStyles,
);

/**
 * Mega Menu Sub Menu Styles
 * ===========================================
 */

const asMegaMenuSubListStyles = withDesign({
  List: asSimpleSubMenu,
  Touts: asToutsSubMenu,
  Columns: asColumnSubMenu,
});

/**
 * Mega Menu Styles
 * ===========================================
 */
const withMegaMenuStyles = flow(
  withDesign({
    Item: asMegaMenuSubListStyles,
  }),
  withBaseMenuStyles,
);

export default withMegaMenuStyles;
export {
  withMenuToutStyles,
};
