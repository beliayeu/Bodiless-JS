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
import { withDesign } from '@bodiless/fclasses';
import { ToutClean } from '@bodiless/organisms';
// ToDo: consider if we want to have asToutHorizontal here
import {
  asEditableImage,
  asEditableLink,
  asToutHorizontal,
  asToutDefaultStyle
} from '../../../Tout/token';
import {
  asEditorBasic,
  asEditorSimple,
} from '../../../Editors';
import asEditableImageWithContent from '../../asEditableImageWithContent';
import asSimpleEditorWithContent from '../../asSimpleEditorWithContent';
import asContentfulTout from '../../asContenfulTout';
import withCTAContent from '../../withCTAContent';
import titleContent from './title';
import bodyContent from './body';
import imageContent from './image';
import ctaContent from './cta';

// ToDo: a key should be injected to withContentfulContextMenu in order to have ability
// to revert subcomponent by subcomponent
// ToDo: there is a concern that reverting link text reverts the href value as well
const WantToLearnMore = flow(
  withDesign({
    Image: asEditableImageWithContent('image', imageContent),
    Title: asSimpleEditorWithContent('title', titleContent),
    // ToDo: bug. page refresh is required in order to get reverted changes.
    Body: asSimpleEditorWithContent('body', bodyContent),
    //Link: withCTAContent(ctaContent),
  }),
  asContentfulTout,
  asToutDefaultStyle,
  asToutHorizontal,
)(ToutClean);

export default WantToLearnMore;
