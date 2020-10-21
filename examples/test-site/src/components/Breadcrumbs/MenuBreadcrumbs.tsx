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

import React, { HTMLProps } from 'react';
import { flow } from 'lodash';
import { withSidecarNodes, asReadOnly} from '@bodiless/core';
import { asEditable, asBodilessLink } from '@bodiless/components'; 
import {
  addClasses,
  withDesign,
  replaceWith,
  A,
  Span,
} from '@bodiless/fclasses';
import {
  asSimpleMenuBase,
  asSimpleMenuBreadcrumbs,
} from '@bodiless/organisms';

import { withArrowSeparator } from './MenuBreadcrumbs.token';
import { EditorSimple } from '../Editors';

const withMenuBreadcrumbSchema = withDesign({
  Separator: replaceWith(Span),
  BreadcrumbLink: flow(
    replaceWith(
      withSidecarNodes(
        asBodilessLink(),
      )(A)
    ),
    asReadOnly,
  ),
  BreadcrumbTitle: flow(
    replaceWith(EditorSimple),
    asReadOnly,
  ),
});

const withMenuBreadcrumbsStyles = flow(
  withDesign({
    Separator: flow(
      addClasses('mx-1'),
    ),
    BreadcrumbWrapper: addClasses('inline-flex'),
  }),
  withArrowSeparator,
);

const MenuBreadcrumbs = flow(
  asSimpleMenuBase(),
  asSimpleMenuBreadcrumbs({
    linkNodeKey: 'title$link',
    titleNodeKey: 'title$text',
  }),
  withMenuBreadcrumbSchema,
  withMenuBreadcrumbsStyles,
)('ul');

export {
  MenuBreadcrumbs,
};
