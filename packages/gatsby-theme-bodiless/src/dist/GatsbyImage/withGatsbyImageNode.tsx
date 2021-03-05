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
import type {
  WithNodeProps,
  ContentNodeProxyContext,
} from '@bodiless/core';
import type { ImageData as BaseImageData } from '@bodiless/components';
import type { GatsbyImageData } from './asGatsbyImage';
import GatsbyImagePresets from './GatsbyImagePresets';

// taking image data and making src as optional
type ImageData = Omit<BaseImageData, 'src'> & { src?: string; };

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
      getData: (data: ImageData, context: ContentNodeProxyContext) => {
        let defaultContent;
        if (context.defaultContent !== undefined) {
          defaultContent = context.defaultContent as GatsbyImageData;
        }
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
      setData: (data: ImageData, context: ContentNodeProxyContext) => {
        let defaultContent;
        if (context.defaultContent !== undefined) {
          defaultContent = context.defaultContent as GatsbyImageData;
        }
        return {
          ...data,
          preset,
          gatsbyImg: undefined,
          // when node data src is equal to default content src
          // then we strip src so that do not save compiled data
          src: defaultContent && defaultContent.src === data.src ? undefined : data.src,
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
