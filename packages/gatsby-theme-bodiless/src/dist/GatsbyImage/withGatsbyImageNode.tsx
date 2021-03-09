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

/* eslint-disable no-underscore-dangle */

import React, { ComponentType as CT } from 'react';
import {
  NodeProvider,
  useNode,
} from '@bodiless/core';
import type { WithNodeProps } from '@bodiless/core';
import type { ImageData as BaseImageData } from '@bodiless/components';
import type { GatsbyImageData } from './asGatsbyImage';
import GatsbyImagePresets from './GatsbyImagePresets';

// taking image data and making src as optional
type ImageData = Omit<BaseImageData, 'src'> & { src?: string; } & {
  /**
   * @todo move to bodiless/core
   */
  _defaultContentNodePath?: string,
};

type DefaultContentProxyContext = {
  defaultContent?: GatsbyImageData,
};

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
    const childNode = node.child<ImageData>(nodeKey);
    const gatsbyImgNode = childNode.proxy({
      getData: (data: ImageData, context: DefaultContentProxyContext) => {
        const { defaultContent } = context;
        return {
          ...data,
          // when there is node data, but node data src does not exist
          // then take src and gatsbyImg from default content
          ...(
            data.src === undefined && defaultContent && defaultContent.src !== undefined ? {
              src: defaultContent.src,
              gatsbyImg: defaultContent.gatsbyImg,
            } : {}
          ),
        };
      },
      setData: (data: ImageData, context: DefaultContentProxyContext) => {
        const { defaultContent } = context;
        let defaultNodeData;
        /**
         * @todo try encapsulating the logic into core
         */
        if (data._defaultContentNodePath !== undefined) {
          defaultNodeData = node.peer<GatsbyImageData>(data._defaultContentNodePath).data;
        }
        const isSrcEqualToDefault = (defaultContent && defaultContent.src === data.src)
         || (defaultNodeData && defaultNodeData.src === data.src);
        return {
          ...data,
          preset,
          gatsbyImg: undefined,
          // when node data src is equal to default content src
          // then we strip src so that do not save compiled data
          src: isSrcEqualToDefault ? undefined : data.src,
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
