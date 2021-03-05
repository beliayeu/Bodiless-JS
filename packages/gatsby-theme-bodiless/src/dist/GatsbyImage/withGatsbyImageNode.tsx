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

import React, { ComponentType as CT } from 'react';
import {
  NodeProvider,
  useNode,
} from '@bodiless/core';
import type { WithNodeProps } from '@bodiless/core';
import GatsbyImagePresets from './GatsbyImagePresets';

const withGatsbyImageNode = (
  preset: GatsbyImagePresets,
) => <P extends object>(Component: CT<P> | string) => {
  const WithGatsbyImageNode = ({
    nodeKey,
    nodeCollection,
    ...rest
  }: P & WithNodeProps) => {
    if (!nodeKey) return <Component {...rest as P} />;
    const { node } = useNode(nodeCollection);
    const childNode = node.child(nodeKey);
    const gatsbyImgNode = childNode.proxy({
      getData: (data: any, context: any) => {
        let defaultContent = undefined;
        if (context.defaultContent !== undefined) defaultContent = context.defaultContent;
        return {
          ...data,
          // merge default content
          ...(
            data.src === undefined && defaultContent ? {
              src: defaultContent.src,
              gatsbyImg: defaultContent.gatsbyImg,
            } : {}
          )
        };
      },
      setData: (data: any, context: any) => {
        let defaultContent = undefined;
        if (context.defaultContent !== undefined) defaultContent = context.defaultContent;
        return {
          ...data,
          preset,
          gatsbyImg: undefined,
          src: defaultContent !== undefined && defaultContent.src === data.src ? undefined : data.src,
        };
      },
    });
    return (
      <NodeProvider node={gatsbyImgNode} collection={nodeCollection}>
        <Component {...rest as P} />
      </NodeProvider>
    );
  };
  return WithGatsbyImageNode;
};

export default withGatsbyImageNode;
