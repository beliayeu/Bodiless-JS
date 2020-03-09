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
import { flow } from 'lodash';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  List, Editable, asEditableList, withSublist, withDesignSublist, Link, asBasicSublist,
} from '@bodiless/components';
import {
  withDesign, replaceWith, addClasses, stylable,
} from '@bodiless/fclasses';
import Layout from '../../../components/Layout';

/**
 * We provide a simple, editable title.
 */
const SimpleTitle = (props: any) => (
  <span {...props}><Editable nodeKey="text" placeholder="Item" /></span>
);

const LinkTitle = (props: any) => (
  <Link nodeKey="link" {...props}><Editable nodeKey="text" placeholder="Item" /></Link>
);

/**
 * This is an editable list using our simple editable title.
 */
const EditableList = flow(
  asEditableList,
  withDesign({
    Title: replaceWith(SimpleTitle),
    Wrapper: flow(stylable, addClasses('pl-10')),
    Item: flow(stylable, addClasses('text-red')),
  }),
)(List);

/**
 * This is an editable list using our simple editable title.
 */
const EditableLinkList = flow(
  asEditableList,
  withDesign({ Title: replaceWith(LinkTitle), Wrapper: flow(stylable, addClasses('pl-10')) }),
)(List);

/**
 * Reduces the padding of the list.  We apply it to the inner list
 * to demonstrate how to style a particular sublist.
 */
const withLessPadding = withDesign({
  Wrapper: addClasses('pl-4').removeClasses('pl-10'),
});

const InnerList = withLessPadding(EditableList);
const MiddleList = flow(
  withSublist(asBasicSublist),
  withDesign({
    Item: withDesign({
      Sublist: replaceWith(InnerList),
    }),
  }),
)(EditableList);
const OuterList = flow(
  withSublist(asBasicSublist),
  withDesign({
    Item: withDesign({
      Sublist: replaceWith(MiddleList),
    }),
  }),
)(EditableList);

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Editable List Demo</h1>
      <p className="pt-4">
        The following are editable lists. Click on each item to display
        a menu with available operations. The list allows up to 3 levels
        of sublists.
        The innermost list has reduced padding. The list on the left contains editable
        items with red text.  The one on the right contains editable links.
      </p>
      <div className="flex pt-4">
        <OuterList nodeKey="list1" className="w-1/2" />
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
