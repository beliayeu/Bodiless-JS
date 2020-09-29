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

import { flowRight } from 'lodash';
import { ifReadOnly } from '@bodiless/core';
import { asBodilessYoutube, withYoutubePlayerSettings } from '@bodiless/components';
import { Embed } from '@bodiless/organisms';
import {
  Iframe,
  Div,
  withDesign,
  replaceWith,
  addClasses,
} from '@bodiless/fclasses';

import { withPlaceholder } from '../Iframe';
import { asResponsive16By9Embed } from '../Elements.token';

const Wrapper = addClasses('absolute w-full h-full inset-0')(Div);
const asBodilessYoutubeWithWrapper = asBodilessYoutube(
  undefined,
  undefined,
  undefined,
  Wrapper,
);

const asResponsiveYoutube = withDesign({
  Item: flowRight(
    withPlaceholder,
    replaceWith(asBodilessYoutubeWithWrapper(Iframe)),
  ),
});

const asReponsive16By9Youtube = flowRight(
  asResponsive16By9Embed,
  asResponsiveYoutube,
);

const Reponsive16By9Youtube = asReponsive16By9Youtube(Embed);

const withAutoPlay = withDesign({
  Item: ifReadOnly(
    withYoutubePlayerSettings({
      autoplay: true,
      mute: true,
    }),
  ),
});

const Reponsive16By9AutoPlayYoutube = flowRight(
  withAutoPlay,
  asReponsive16By9Youtube,
)(Embed);

export {
  asResponsiveYoutube,
  Reponsive16By9Youtube,
  Reponsive16By9AutoPlayYoutube,
};
