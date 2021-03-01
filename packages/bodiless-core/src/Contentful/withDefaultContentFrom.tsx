import { ContentNode } from 'src';

import withDefaultContent from './withDefaultContent';

export type Options<D> = {
  sourceNode: ContentNode<D>,
};
export type UseOptions<P, D> = (props: P) => Options<D>;

const buildContent = (node: ContentNode<any>): { [path: string]: any } => ({
  [node.path.join('$')]: node.data,
  ...node.childKeys.reduce((entries, key) => buildContent(node.child(key)), {}),
});

const withDefaultContentFrom = <P extends object, D extends object>(
  useOptions: UseOptions<P, D>,
) => {
  const useContent = (props: P) => {
    const options = useOptions(props);
    const { sourceNode } = options;
    return buildContent(sourceNode);
  };
  return withDefaultContent(useContent);
};

export default withDefaultContentFrom;
