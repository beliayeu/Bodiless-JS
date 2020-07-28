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

import React, { Component } from 'react';
import { pick } from 'lodash';
import { observer } from "mobx-react";
import {
  DefaultContentNode,
  NodeProvider,
  getNotifyContext,
} from '@bodiless/core';
import GatsbyMobxStore, { DataSource } from './GatsbyMobxStore';
import { v1 } from 'uuid';

type State = {
  store: GatsbyMobxStore,
  hasError: boolean,
};

const STORE_ERROR_NOTIFICATION_ID = 'STORE_ERROR_NOTIFICATION_ID';

export type Props = {
  data: any,
  pageContext: {
    slug: string
  }
};

@observer
class GatsbyNodeProvider extends Component<Props, State> implements DataSource {
  constructor(props: Props) {
    super(props);
    this.state = {
      store: new GatsbyMobxStore(this),
      hasError: false,
    };
  }

  static id = v1();

  static contextType = getNotifyContext();

  private hasStoreError = false;

  // eslint-disable-next-line react/state-in-constructor
  state: State;

  // React hook inserts props into mobx store.
  static getDerivedStateFromProps(props: Props, state: State) {
    const { data } = props;
    const { store } = state;
    store.updateData(data);
    return null;
  }

  // Prevent unnecessary renders when the Gatsby JSON Store updates.
  // Mobx will take care of updating components whose data have changed.
  shouldComponentUpdate() {
    return this.state.hasError !== this.state.store.hasError;
  }

  componentDidUpdate() {
    const { store } = this.state;
    const notifications = store && store.hasError ? [{
      id: STORE_ERROR_NOTIFICATION_ID,
      message: 'There is an error with saving data',
    }] : [];
    this.context.notify(GatsbyNodeProvider.id, notifications);
  }

  get slug() {
    const { pageContext: { slug } } = this.props;
    return slug;
  }

  // Create ContentNode instance for consumption by React components.
  getRootNode(collection = 'Page') {
    const { store } = this.state;
    const actions = pick(store, ['setNode', 'deleteNode']);
    const getters = pick(store, ['getNode', 'getKeys']);

    const node = new DefaultContentNode(actions, getters, collection);
    return node;
  }

  render() {
    this.state.hasError = this.state.store.hasError;
    const { children } = this.props;
    return (
      <NodeProvider node={this.getRootNode('Site')} collection="site">
        <NodeProvider node={this.getRootNode('Page')} collection="_default">
          {children}
        </NodeProvider>
      </NodeProvider>
    );
  }
}

export default GatsbyNodeProvider;
