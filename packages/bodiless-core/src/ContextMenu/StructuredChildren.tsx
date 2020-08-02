import React, {
  FC, ReactElement, ReactNode, ComponentType,
} from 'react';
import { flow } from 'lodash';

export type ContextMenuGroupProps = {
  name: string,
  label?: string,
  group?: string,
};
export const Group: FC<ContextMenuGroupProps> = ({ label, children }) => (
  <div>
    {label && <h3>{label}</h3>}
    <div>{children}</div>
    <hr />
  </div>
);

export const Item: FC<ContextMenuGroupProps> = ({ label }) => (
  <button type="button">{label}</button>
);

type GroupTree = {
  [name: string]: {
    element: ReactElement,
    members: GroupTree,
  }
};

export const asElementArray = (children: ReactNode): ReactElement[] => React.Children
  .toArray(children)
  .filter(React.isValidElement);

export const addMissingGroups = (GroupComponent: ComponentType<ContextMenuGroupProps>) => (
  (elements: ReactElement[]): ReactElement[] => elements.reduce(
    (acc: ReactElement[], el: ReactElement) => {
      if (el.props.group && !acc.find(el$ => el$.props.name === el.props.group)) {
        return [...acc, <GroupComponent name={el.props.group} />];
      }
      return acc;
    },
    elements,
  )
);

export const buildGroupTree = (elements: ReactElement[], groupName: string = '_default'): GroupTree => elements
  .filter(el => (el.props.group || '_default') === groupName)
  .reduce((acc, child) => ({
    ...acc,
    [child.props.name]: {
      element: child,
      members: buildGroupTree(elements, child.props.name),
    },
  }), {});

export const cloneChildren = (props: any = {}) => (tree: GroupTree): ReactElement[] => Object
  .getOwnPropertyNames(tree)
  .reduce((acc: ReactElement[], name: string) => {
    const entry = tree[name];
    const newElement = React.cloneElement(entry.element, {
      ...props,
      key: entry.element.props.name,
      children: cloneChildren(props)(entry.members),
    });
    return [...acc, newElement];
  }, []);

const buildChildren = (
  GroupComponent: ComponentType<ContextMenuGroupProps> = Group,
  props: any = {},
) => flow(
  asElementArray,
  addMissingGroups(GroupComponent),
  buildGroupTree,
  cloneChildren(props),
);

type GroupedChildrenProps = {
  components: {
    Group: ComponentType<ContextMenuGroupProps>,
  },
  [prop: string]: any,
};

const StructuredChildren: FC<GroupedChildrenProps> = ({ components, children, ...rest }) => {
  const newChildren = buildChildren(components.Group || Group, rest)(children);
  return <>{newChildren}</>;
};

export default StructuredChildren;
