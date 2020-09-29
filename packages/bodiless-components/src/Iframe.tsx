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

import React, { ComponentType, HTMLProps } from 'react';

import {
  asBodilessComponent,
  ifEditable,
  useMenuOptionUI,
} from '@bodiless/core';
import type {
  BodilessOptions,
  WithNodeKeyProps,
  WithNodeProps,
  EditButtonOptions,
} from '@bodiless/core';
import { addProps } from '@bodiless/fclasses';

import { flowRight } from 'lodash';
import withFormSnippet from './withFormSnippet';

// Type of the data used by this component.
export type Data = {
  src: string;
  height: string;
};

export type Props = HTMLProps<HTMLIFrameElement>;

// Options used to create an edit button.
const options: BodilessOptions<Props, Data> = {
  icon: 'settings',
  label: 'Settings',
  name: 'Edit',
  global: false,
  local: true,
  Wrapper: 'div',
  useCompoundForm: () => true,
};

const withoutPointerEvents = addProps({
  style: {
    pointerEvents: 'none',
  },
});

const withHeightSnippet = withFormSnippet({
  nodeKeys: 'height',
  defaultData: { height: '' },
  snippetOptions: {
    renderForm: () => {
      const { ComponentFormLabel, ComponentFormText } = useMenuOptionUI();
      return (
        <React.Fragment key="height">
          <ComponentFormLabel htmlFor="height">Height</ComponentFormLabel>
          <ComponentFormText field="height" />
        </React.Fragment>
      );
    },
  },
});

const withSrcSnippet = withFormSnippet({
  nodeKeys: 'src',
  defaultData: { src: '' },
  snippetOptions: {
    renderForm: () => {
      const { ComponentFormLabel, ComponentFormText } = useMenuOptionUI();
      return (
        <React.Fragment key="src">
          <ComponentFormLabel htmlFor="src">Src</ComponentFormLabel>
          <ComponentFormText field="src" />
        </React.Fragment>
      );
    },
  },
});

// modification of AsBodiless type from @bodiless/core
// so that allow passing Wrapper as a parameter
type HOC<P, Q> = (Component: ComponentType<P>|string) => ComponentType<Q>;
export type AsIframeBodiless<P, D> = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: D,
  useOverrides?: ((props: P, options: EditButtonOptions<P, D>) => Partial<EditButtonOptions<P, D>>),
  Wrapper?: ComponentType<any> | string,
) => HOC<P, P & Partial<WithNodeProps>>;

const asBaseBodilessIframe: AsIframeBodiless<Props, Data> = (
  nodeKeys?,
  defaultData?,
  useOverrides?,
  Wrapper?,
) => flowRight(
  ifEditable(withoutPointerEvents),
  asBodilessComponent({
    ...options,
    ...(Wrapper ? { Wrapper } : {}),
  })(nodeKeys, defaultData, useOverrides),
);

const asBodilessIframe: AsIframeBodiless<Props, Data> = (
  nodeKeys?,
  defaultData?,
  useOverrides?,
  Wrapper?: ComponentType<any> | string,
) => flowRight(
  asBaseBodilessIframe(nodeKeys, defaultData, useOverrides, Wrapper),
  withHeightSnippet,
  withSrcSnippet,
);

export default asBodilessIframe;
export {
  asBaseBodilessIframe,
  withHeightSnippet,
  withSrcSnippet,
};
