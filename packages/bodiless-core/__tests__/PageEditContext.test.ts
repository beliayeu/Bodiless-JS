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

import { autorun, observable } from 'mobx';
import PageEditContext, { useApi } from '../src/PageEditContext';
import { PageEditContextInterface } from '../src/PageEditContext/types';
import { TMenuOption } from '../src/Types/ContextMenuTypes';

const spawn = (parent: PageEditContextInterface) => {
  const id = Math.random().toString();
  return parent.spawn({
    id,
    name: id,
    getMenuOptions: () => [
      {
        name: id,
        icon: 'foo',
      },
    ],
  });
};

const createContextTree: () => { [key: string]: PageEditContextInterface } = () => {
  const root = new PageEditContext();
  const parent1 = spawn(root);
  const child11 = spawn(parent1);
  const child12 = spawn(parent1);
  const parent2 = spawn(root);
  const child21 = spawn(parent2);
  return {
    root,
    parent1,
    parent2,
    child11,
    child12,
    child21,
  };
};

describe('PageEditContext', () => {
  it('activates only itself and all ancestors', () => {
    const tree = createContextTree();
    tree.child11.activate();
    expect(tree.root.isActive).toBeTruthy();
    expect(tree.parent1.isActive).toBeTruthy();
    expect(tree.child11.isActive).toBeTruthy();
    expect(tree.child12.isActive).toBeFalsy();
    expect(tree.parent2.isActive).toBeFalsy();
    expect(tree.child21.isActive).toBeFalsy();
    expect(tree.root.isInnermost).toBeFalsy();
    expect(tree.parent1.isInnermost).toBeFalsy();
    expect(tree.child11.isInnermost).toBeTruthy();
    expect(tree.child12.isInnermost).toBeFalsy();
    expect(tree.parent2.isInnermost).toBeFalsy();
    expect(tree.child21.isInnermost).toBeFalsy();
  });

  it('sets the correct menu options', () => {
    const tree = createContextTree();
    const expectOptionNamesToBe = (expected: string[]) => {
      // We test getting the menu options from anywhere in the context tree.
      Object.keys(tree).forEach(key => {
        expect(tree[key].contextMenuOptions.length).toBe(expected.length);
        tree[key].contextMenuOptions.forEach((option: any, index: any) => expect(
          option.name,
        ).toBe(expected[index]));
      });
    };
    tree.child21.activate();
    expectOptionNamesToBe([tree.parent2.id, tree.child21.id]);
    tree.child12.activate();
    expectOptionNamesToBe([tree.parent1.id, tree.child12.id]);
    tree.parent1.activate();
    expectOptionNamesToBe([tree.parent1.id]);
  });

  it('toggles edit mode correctly', () => {
    const tree = createContextTree();
    tree.parent1.toggleEdit(true);
    Object.keys(tree).forEach(key => expect(tree[key].isEdit).toBeTruthy());
    tree.parent2.toggleEdit();
    Object.keys(tree).forEach(key => expect(tree[key].isEdit).toBeFalsy());
    tree.root.toggleEdit();
    Object.keys(tree).forEach(key => expect(tree[key].isEdit).toBeTruthy());
    tree.child21.toggleEdit(false);
    Object.keys(tree).forEach(key => expect(tree[key].isEdit).toBeFalsy());
  });
});

describe.skip('mobx', () => {
  it('does not react on nested map', () => {
    const outer = observable.map({});
    const inner = observable.map({}, { deep: false });
    const foo = { a: 'b' };
    const bar = { c: 'd' };
    const baz = { e: 'f' };
    inner.set('foo', foo);
    inner.set('bar', bar);
    outer.set('inner', inner);
    const reaction = jest.fn();
    const disposer = autorun(() => {
      outer.get('inner').keys();
      reaction();
    });
    expect(reaction).toHaveBeenCalledTimes(1);
    inner.set('bar', baz);
    expect(reaction).toHaveBeenCalledTimes(1);
    disposer();
  });

  it('works as i expect', () => {
    const map = observable.map({}, { deep: false });
    const map1 = observable.map();
    const reaction = jest.fn();
    const disposer = autorun(() => {
      map.get('foo');
      reaction();
    });
    // Reaction triggered once when created
    let times = 1;
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction not triggered when another observable is altered
    map1.set('foo', 'bar');
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction not triggered when a different element of map is altered
    map.set('baz', 'bing');
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction triggered when observed element is created
    times += 1;
    map.set('foo', 'bar');
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction not triggered when a different element of map is altered
    map.set('baz', 'bing');
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction triggered when observed element is updated
    times += 1;
    const blap = {
      blip: 'blop',
    };
    map.set('foo', blap);
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction not triggered when observed element is updated with same value
    const blapple = blap;
    map.set('foo', blapple);
    expect(reaction).toHaveBeenCalledTimes(times);
    // Reaction triggered when observed element is updated with new object with same props
    times += 1;
    const blobble = { ...blap };
    map.set('foo', blobble);
    expect(reaction).toHaveBeenCalledTimes(times);
    disposer();
  });
});

describe.only('Update menu options', () => {
  const parentOptions = [{
    name: 'parent',
  }];
  const parentContext = new PageEditContext({
    // Note we need to return a reference to the same object here, or
    // the context menu will re-render even if the options don't change.
    getMenuOptions: () => parentOptions,
    name: 'Parent',
    id: 'Parent',
  });
  const peerOptions = [{
    name: 'peer',
  }];
  const peerContext = new PageEditContext({
    // Note we need to return a reference to the same object here, or
    // the context menu will re-render even if the options don't change.
    getMenuOptions: () => peerOptions,
    name: 'Peer',
    id: 'Peer',
  });

  const originalOptions: TMenuOption[] = [{
    name: 'foo',
  }];

  const createContext = (options?: TMenuOption[]) => {
    const context = new PageEditContext({
      getMenuOptions: () => (options || originalOptions),
      name: 'Foo',
      id: 'Foo',
    }, parentContext);
    context.registerPeer(peerContext);
    return context;
  }

  const context = createContext();
  const listener = jest.fn();
  let disposer: Function;

  beforeAll(() => {
    disposer = autorun(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      useApi().currentMenuOptions;
      listener();
    });
    listener.mockClear();
    context.activate();
  });

  afterAll(() => {
    disposer();
  });

  it('Notifies when context is activated for the first time', () => {
    expect(listener).toHaveBeenCalledTimes(1);
    context.activate();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('Does not notify when context updates with no change', () => {
    listener.mockClear();
    context.updateMenuOptions();
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('Does not notify when new context with same menu options activates', () => {
    listener.mockClear();
    const newContext = createContext();
    newContext.activate();
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('Does not notify when new context with same menu options updates', () => {
    listener.mockClear();
    const newContext = createContext();
    newContext.updateMenuOptions();
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('Notifies when menu options change', () => {
    listener.mockClear();
    const newOptions = [{ ...originalOptions[0] }];
    const newContext = createContext(newOptions);
    newContext.updateMenuOptions();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
