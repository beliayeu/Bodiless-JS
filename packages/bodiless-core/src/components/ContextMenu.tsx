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

import React, { FC, useState } from 'react';
import { getUI as getFormUI } from '../contextMenuForm';
import {
  IContextMenuProps as IProps, UI, ContextMenuFormProps, TMenuOption,
} from '../Types/ContextMenuTypes';
import ContextMenuItem from './ContextMenuItem';
import StructuredChildren from '../ContextMenu/StructuredChildren';

const defaultUI = {
  Toolbar: 'div',
};

export const getUI = (ui: UI = {}) => ({
  ...defaultUI,
  ...getFormUI(),
  ...ui,
});

const createChildrenFromOptions = (options: TMenuOption[]) => options.map(
  option => {
    const Component = option.Component || ContextMenuItem;
    return (
      <Component
        option={option}
        group={option.group || option.name}
        name={option.name}
        key={option.name}
        aria-label={option.name}
      />
    );
  },
);

// @TODO: This should come from the ui.
const Group: FC<any> = ({ children }) => <>{children}</>;

const ContextMenu: FC<IProps> = (props) => {
  if (typeof window === 'undefined') return null;

  const [renderForm, setRenderForm] = useState<(props:ContextMenuFormProps) => JSX.Element>();
  const {
    options,
    ui,
    renderInTooltip = true,
    children,
  } = props;
  const { Toolbar } = getUI(ui);

  const childProps = {
    ui,
    setParentRenderForm: renderInTooltip ? undefined : setRenderForm,
  };
  const childrenFromOptions = createChildrenFromOptions(options);

  if (renderForm) {
    const formProps: ContextMenuFormProps = {
      closeForm: () => setRenderForm(undefined),
      ui,
      'aria-label': 'Context Submenu Form',
    };
    return renderForm(formProps);
  }
  const finalChildren = children
    ? [...React.Children.toArray(children).filter(React.isValidElement), ...childrenFromOptions]
    : childrenFromOptions;

  if (finalChildren.length > 0) {
    return (
      <Toolbar onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <StructuredChildren components={{ Group }} {...childProps}>
          {finalChildren}
        </StructuredChildren>
      </Toolbar>
    );
  }

  return null;
};

export default ContextMenu;
