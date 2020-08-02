import React, { FC } from 'react';
import ContextMenuItem from '../components/ContextMenuItem';
import type { IContextMenuItemProps } from '../Types/ContextMenuTypes';

const ContextSubMenu: FC<IContextMenuItemProps> = props => {
  const { option, children, ...rest } = props;

  const handler = () => () => (<>{children}</>);
  const newOption = { ...option, handler };
  return <ContextMenuItem option={newOption} {...rest} />;
};

export default ContextSubMenu;
