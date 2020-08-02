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

import React, { ConsumerProps, FC } from 'react';
import { Observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import {
  DefinesLocalEditContext,
  PageEditContextInterface,
  PageEditStoreInterface,
  TMenuOptionGetter,
  TPageOverlayStore,
} from './types';
import { TMenuOption } from '../Types/ContextMenuTypes';
import { TOverlaySettings } from '../Types/PageOverlayTypes';
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from '../SessionStorage';

/**
 * @private
 * Helper function to cravel the context trail, invoking a callback on each context
 * and accumulating the results.
 * @param accumulator The accumulated results.
 * @param callback The callback which returns the results for each context.
 * @param context The context on which to execute the callback.
 */
const reduceRecursively = <T extends any>(
  accumulator: T[],
  callback: (c: PageEditContextInterface) => T[],
  context?: PageEditContextInterface,
): T[] => {
  if (!context) return [];
  const newItems = callback(context);
  const newAccumulator = [...newItems, ...accumulator];
  return context.parent
    ? reduceRecursively(newAccumulator, callback, context.parent)
    : newAccumulator;
};

const defaultOverlaySettings: TOverlaySettings = {
  isActive: false,
  hasCloseButton: false,
  hasSpinner: true,
  message: '',
  maxTimeoutInSeconds: null,
  onClose: () => {},
};

/**
 * @private
 *
 * Holds the current UI state for the editor.
 */
class PageEditStore implements PageEditStoreInterface {
  @observable activeContext: PageEditContextInterface | undefined = undefined;

  @observable isEdit = getFromSessionStorage('isEdit', false);

  @observable isPositionToggled = getFromSessionStorage('isPositionToggled', false);

  @observable pageOverlay: TPageOverlayStore = {
    data: {
      ...defaultOverlaySettings,
    },
    timeoutId: 0,
  };

  @observable areLocalTooltipsDisabled = false;

  @observable
  optionMap = new Map<string, Map<string, TMenuOption>>();

  @action
  setActiveContext(context?: PageEditContextInterface) {
    if (context) this.activeContext = context;

    // Travel the context trail, updating options for each context.
    const keys: string[] = [];
    for (let c = this.activeContext; c; c = c.parent) {
      keys.push(...this.updateMenuOptions([c!, ...c!.peerContexts]));
    }

    // Delete options for any context which is not in the trail
    const keySet = new Set(keys);
    this.optionMap.forEach(($, key) => {
      if (!keySet.has(key)) this.optionMap.delete(key);
    });
  }

  @action
  updateMenuOptions(contexts: PageEditContextInterface[]) {
    const contextKeys: string[] = [];
    contexts.forEach(context => {
      contextKeys.push(context.id);
      if (!this.optionMap.has(context.id)) {
        // We create a shallow map for each context bc we expect the
        // items to be memoized, so we need only compare references.
        this.optionMap.set(context.id, observable.map({}, { deep: false }));
      }
      const map = this.optionMap.get(context.id);
      const keys = new Set();
      // Update all items in the map
      context.getMenuOptions().forEach(op => {
        map!.set(op.name, op);
        keys.add(op.name);
      });
      // Delete any items which are no longer present.
      map!.forEach(($, key) => {
        if (!keys.has(key)) map!.delete(key);
      });
    });
    return contextKeys;
  }

  @computed get contextMenuOptions(): TMenuOption[] {
    const options: TMenuOption[] = [];
    this.optionMap.forEach((contextMap, contextName) => {
      contextMap.forEach(option => {
        options.push({
          ...option,
          group: option.group || contextName,
        });
      });
    });
    return options;
  }

  @action toggleEdit(on? : boolean) {
    if (on === undefined) {
      this.isEdit = !this.isEdit;
    } else {
      this.isEdit = Boolean(on);
    }

    saveToSessionStorage('isEdit', this.isEdit);
  }

  @action togglePosition(on? : boolean) {
    if (on === undefined) {
      this.isPositionToggled = !this.isPositionToggled;
    } else {
      this.isPositionToggled = Boolean(on);
    }

    saveToSessionStorage('isPositionToggled', this.isPositionToggled);
  }

  @action toggleLocalTooltipsDisabled(isDisabled?: boolean) {
    if (isDisabled === undefined) {
      this.areLocalTooltipsDisabled = !this.areLocalTooltipsDisabled;
    } else {
      this.areLocalTooltipsDisabled = isDisabled;
    }
  }

  @computed get contextTrail() {
    return reduceRecursively<string>([], context => [context.id], this.activeContext);
  }
}

const defaultStore = new PageEditStore();

/**
 * A Page Edit Context represents a particular state of the page editor, usually
 * defined by what element of the page is "active" or "focused". Currently, the
 * only bit of state tracked in the context are context menu options (along with
 * whether a context is "active", which can be used to highlight the component
 * which registered the context.
 * - Contexts are nested (so that a parent context is "active" when any of
 * its child contexts are active).
 * - Contexts are established using the React context API - and each PageEditContext
 * instance is a "value".
 * - The PageEditContext instance also contains a reference to the page edit store,
 * which tracks editor UI state (eg the currently active context).
 * - The react context container (created by React.createContext) of which the
 * PageEditContext instance is a value is available as a static property of the class via:
 *    - PageEditContext.context (the context object, suitable for use as a component contextType).
 *    - PageEditContext.Consumer (an observable version of PageEditContext.context.Consumer).
 *    - PageEditContext.Provider (equivalent to PageEditContext.context.Provider).
 * Singleton store.
 */
class PageEditContext implements PageEditContextInterface {
  readonly id: string = 'root';

  readonly name: string = 'root';

  readonly getMenuOptions: TMenuOptionGetter = () => [];

  readonly parent: PageEditContextInterface | undefined;

  private store: PageEditStoreInterface = defaultStore;

  hasLocalMenu = false;

  // When called with no argument this creates a new store and react context.
  constructor(values?: DefinesLocalEditContext, parent?: PageEditContextInterface) {
    if (values) {
      this.id = values.id;
      this.name = values.name;
      if (values.getMenuOptions) this.getMenuOptions = values.getMenuOptions;
    }
    if (parent) {
      this.parent = parent;
    }
  }

  peerContexts: PageEditContextInterface[] = [];

  registerPeer(values: DefinesLocalEditContext) {
    const context = new PageEditContext(values, this.parent);
    // Ensure that the same context is not registered more than once.
    const existsAt = this.peerContexts.findIndex(c => c.id === context.id);
    if (existsAt >= 0) this.peerContexts.splice(existsAt, 1, context);
    else this.peerContexts.push(context);
  }

  get allMenuOptions() {
    // Sets the group for each option to
    const ownOptions = this.getMenuOptions
      // Add the id of this context as the "group" of each option.
      ? this.getMenuOptions().map(
        (op): TMenuOption => ({ context: this.id, group: this.id, ...op }),
      )
      : [];
    return this.peerContexts.reduce(
      (finalOptions, peerContext) => [...finalOptions, ...peerContext.allMenuOptions],
      ownOptions,
    );
  }

  static context = React.createContext<PageEditContextInterface>(new PageEditContext());

  // Make our context consumer observable.
  // See https://github.com/mobxjs/mobx-react/issues/471.
  // eslint-disable-next-line react/prop-types
  static Consumer: FC<ConsumerProps<PageEditContextInterface>> = ({ children }) => (
    <PageEditContext.context.Consumer>
      {value => <Observer>{() => children(value)}</Observer>}
    </PageEditContext.context.Consumer>
  );

  static Provider = PageEditContext.context.Provider;

  // Create a new context value with this as its parent.
  spawn(values: DefinesLocalEditContext): PageEditContextInterface {
    return new PageEditContext(values, this);
  }

  // Make this the "current" context.
  activate() {
    this.store.setActiveContext(this);
  }

  updateMenuOptions() {
    this.store.updateMenuOptions([this, ...this.peerContexts]);
  }

  // Tests whether this context is "active" - i.e. whether it or one of its descendants is the
  // "current" context.
  get isActive() {
    return !this.parent || this.store.contextTrail.includes(this.id);
  }

  get isInnermost() {
    return Boolean(
      this.store.activeContext && this.store.activeContext.id === this.id,
    );
  }

  get isInnermostLocalMenu() {
    const getId = (context: PageEditContextInterface):string => {
      if (context.hasLocalMenu) return context.id;
      if (context.parent) return getId(context.parent);
      return '';
    };
    return Boolean(
      this.hasLocalMenu
      && this.store.activeContext
      && getId(this.store.activeContext) === this.id,
    );
  }

  get isEdit() {
    return this.store.isEdit;
  }

  toggleEdit(on?: boolean) {
    this.store.toggleEdit(on);
  }

  get isPositionToggled() {
    return this.store.isPositionToggled;
  }

  togglePosition(on?: boolean) {
    this.store.togglePosition(on);
  }

  get contextMenuOptions() {
    return this.store.contextMenuOptions;
  }

  get pageOverlay() {
    return this.store.pageOverlay;
  }

  showPageOverlay(passedSettings: TOverlaySettings | undefined) {
    clearTimeout(this.store.pageOverlay.timeoutId);
    const settings = {
      ...defaultOverlaySettings,
      isActive: true,
      ...passedSettings,
    };
    this.store.pageOverlay.data = settings;

    if (settings.maxTimeoutInSeconds) {
      this.store.pageOverlay.timeoutId = window.setTimeout(() => {
        this.showError({
          message: `The application encountered an issue.
Please try your operation again if it was not successful.`,
        });
      }, settings.maxTimeoutInSeconds * 1000);
    }
  }

  hidePageOverlay() {
    this.showPageOverlay({
      isActive: false,
    });
  }

  showError(passedSettings: TOverlaySettings | undefined) {
    const settings = {
      message: 'An error has occurred.',
      hasCloseButton: true,
      hasSpinner: false,
      ...passedSettings,
    };
    this.showPageOverlay(settings);
  }

  get areLocalTooltipsDisabled() {
    return this.store.areLocalTooltipsDisabled || !this.store.isEdit;
  }

  toggleLocalTooltipsDisabled(isDisabled?: boolean) {
    this.store.toggleLocalTooltipsDisabled(isDisabled);
  }
}

export default PageEditContext;

export const useApi = () => ({
  contextMenuOptions: defaultStore.contextMenuOptions,
});
