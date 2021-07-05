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

import { flow } from 'lodash';
import {
  createSingleAccordion,
  SingleAccordionClean,
  asTestableAccordion,
} from '@bodiless/organisms';
import {
  withNode, withContextActivator, ifEditable,
} from '@bodiless/core';
import { withDesign, addClassesIf, addClasses } from '@bodiless/fclasses';
import asSingleAccordionDefaultStyle from './token';
import { withEditorSimple, withEditorBasic } from '../Editors';

const asSingleAccordion = flow(
  withNode,
  withDesign({
    Title: flow(
      withEditorSimple('title', 'Accordion Title'),
      // The following is a hack to prevent accordion expanding/contracting while editing
      // the title. It mimics previous behavior where the click was eaten by the editor.
      // Now editors do not add a context activator if they have no buttons, so we have
      // to put one here.
      // @TODO: Refactor accordions: https://github.com/johnsonandjohnson/Bodiless-JS/issues/390
      ifEditable(withContextActivator('onClick')),
    ),
    Body: withEditorBasic(
      'body',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
    ),
  }),
  asSingleAccordionDefaultStyle,
  asTestableAccordion,
);

const SingleAccordion = asSingleAccordion(SingleAccordionClean);

const { Accordion: TestCleanAccordion, isExpanded, isCollapsed } = createSingleAccordion();

const asTestSingleAccordionDefaultStyle = flow(
  withDesign({
    TitleWrapper: flow(
      addClassesIf(isExpanded)('bg-blue-700'),
      addClassesIf(isCollapsed)('bg-red-700'),
    ),
  }),
);

const TestSingleAccordion = flow(
  asSingleAccordion,
  asTestSingleAccordionDefaultStyle,
)(TestCleanAccordion);

export default SingleAccordion;
export { TestSingleAccordion };
