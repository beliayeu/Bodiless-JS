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

import React from 'react';
import { graphql } from 'gatsby';
import {
  NodeViewer,
} from '@bodiless/components';
import { Page } from '@bodiless/gatsby-theme-bodiless';

import Layout from '../../../components/Layout';
import { FlowContainerDefault } from '../../../components/FlowContainer';
import { EditorBasic, EditorFullFeatured, EditorSimple } from '../../../components/Editors';

const RichTextPage = (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold py-5">Rich Text Example Page</h1>
      <div className="flex flex-col w-full py-5">
        <h3 className="p-5 font-bold">Simple Rich Text:</h3>
        <div className="p-5 pt-0">
          <EditorFullFeatured className="border-solid border-4 border-gray-600 p-5" nodeKey="fullRTE" placeholder="Type something here..." />
        </div>
      </div>
      
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
export default RichTextPage;
