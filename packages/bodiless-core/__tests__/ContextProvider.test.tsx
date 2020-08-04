/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

import React, { useMemo, useEffect, FC, useState } from 'react';
import { shallow, mount } from 'enzyme';
import { observer } from 'mobx-react-lite';
import PageContextProvider, { withMenuOptions, useRegisterMenuOptions } from '../src/PageContextProvider';
import { useEditContext } from '../src/hooks';
import { PageEditContextInterface } from '../src/PageEditContext/types';
import { useApi } from '../src/PageEditContext';
import { TMenuOption } from '../src/Types/ContextMenuTypes';
import { log } from 'console';
import { attempt } from 'lodash';

const menuRendered = jest.fn();
const Menu = observer(() => {
  menuRendered();
  const items = useApi().contextMenuOptions.map(
    option => <span id={option.name} key={option.name}>{option.name}</span>,
  );
  return (
    <>
      {items}
    </>
  );
});

describe('withMenuOptions', () => {
  type Props = {
    foo: string;
  };

  // A menu option getter creator which uses values from
  // both props and context to define menu options.
  const useGetMenuOptions = (
    { foo }: Props,
    { id }: PageEditContextInterface,
  ) => () => [
    {
      name: foo,
      icon: id,
      isActive: () => true,
      handler: () => undefined,
    },
  ];

  const WrappedComponent = ({ foo }: Props) => <span>{foo}</span>;

  const Test = withMenuOptions({ useGetMenuOptions })(WrappedComponent);

  it('passes props and context correctly to the getMenuOptions creator', () => {
    const ShowContextId = () => <span>{useEditContext().id}</span>;
    const originalId = shallow(<ShowContextId />).prop('children');
    const foo = Math.random().toString();
    const wrapper = shallow(<Test foo={foo} />);
    const options = wrapper.prop('getMenuOptions')();
    expect(options.length).toBe(1);
    expect(options[0].name).toBe(foo);
    expect(options[0].icon).toBe(originalId);
  });

  it('passes props correctly to the wrapped component', () => {
    const foo = Math.random().toString();
    const wrapper = shallow(<Test foo={foo} />);
    const wrapped = wrapper.find(WrappedComponent);
    expect(wrapped.prop('foo')).toBe(foo);
  });
});

describe('ContextProvider', () => {
  const activatorFired = jest.fn();
  const Activator: FC = ({ children }) => {
    const context = useEditContext();
    // return (
    //   <div id="activate" onClick={() => context.activate()}>
    //     {children}
    //   </div>
    // );
    useEffect(() => {
      context.activate();
      activatorFired();
    }, []);
    return <>{children}</>;
  };


  const foobarRendered = jest.fn();
  const FooBar: FC<any> = props => {
    foobarRendered();
    const { children, foo, bar } = props;
    const options$: TMenuOption[] = [];
    if (foo) {
      options$.push({
        name: 'foo',
        label: foo,
      });
    }
    if (bar) {
      options$.push({
        name: 'bar',
        label: bar,
      });
    }
    const options = useMemo(() => options$, [foo, bar]);
    return (
      <PageContextProvider
        getMenuOptions={() => options}
        name="FooBar"
      >
        {children}
      </PageContextProvider>
    );
  };

  const bazRendered = jest.fn();
  const Baz: FC<any> = ({ children }) => {
    bazRendered();
    const options$ = [{
      name: 'baz',
    }];
    const options = useMemo(() => options$, []);
    return (
      <PageContextProvider getMenuOptions={() => options} name="FooBar">
        {children}
      </PageContextProvider>
    );
  };

  const ListenerTest = (props: any) => (
    <>
      <FooBar {...props}>
        <Activator />
      </FooBar>
      <Menu />
    </>
  );

  beforeEach(() => {
    // useApi().resetStore();
    foobarRendered.mockClear();
    activatorFired.mockClear();
    menuRendered.mockClear();
  });

  it('Re-renders a listener when options change', () => {
    const wrapper = mount(<ListenerTest foo="fiddle" />);
    expect(foobarRendered).toHaveBeenCalledTimes(1);
    expect(menuRendered).toHaveBeenCalledTimes(2);
    expect(activatorFired).toHaveBeenCalledTimes(1);
    wrapper.setProps({ foo: 'fuddle' });
    expect(foobarRendered).toHaveBeenCalledTimes(2);
    expect(menuRendered).toHaveBeenCalledTimes(3);
    expect(activatorFired).toHaveBeenCalledTimes(1);
    // We must unmount our test component, or it will
    wrapper.unmount();
  });

  it('Does not re-render a listener when options do not change', () => {
    const wrapper = mount(<ListenerTest foo="fiddle" />);
    expect(foobarRendered).toHaveBeenCalledTimes(1);
    expect(menuRendered).toHaveBeenCalledTimes(2);
    expect(activatorFired).toHaveBeenCalledTimes(1);
    wrapper.setProps({ foo: 'fiddle', unusedProp: 'baz' });
    expect(foobarRendered).toHaveBeenCalledTimes(2);
    expect(activatorFired).toHaveBeenCalledTimes(1);
    expect(menuRendered).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it.only('test effect', () => {
    const ToggleBOnEffect: any = ({ withB, setShowB }) => {
      useEffect(() => {
        if (withB) setShowB(true);
      });
      return null;
    }
    const RenderAorB: any = ({ showB }) => (
      <span>{showB ? 'A' : 'B'}</span>
    );

    const Wrapper: any = ({ withB }) => {
      const [showB, setShowB] = useState<boolean>(false);
      return (
        <>
          <RenderAorB showB={showB} />
          <ToggleBOnEffect withB={withB} setShowB={setShowB} />
        </>
      );
    };
    const wrapper = mount(<Wrapper />);
    console.log(wrapper.debug());
    wrapper.setProps ({ withB: true });
    wrapper.update();
    console.log(wrapper.debug());
  });

  it('removes options when a provider is removed', () => {
    const Test = ({ hasBaz }: any) => (
      hasBaz
        ? <Baz><ListenerTest foo /></Baz>
        : <ListenerTest foo />
    );
    const wrapper = mount(<Test hasBaz />);
    wrapper.find('div#activate').simulate('click');
    expect(wrapper.text()).toBe('bazfoo');
    wrapper.setProps({ hasBaz: false });
    wrapper.find('div#activate').simulate('click');
    wrapper.update();
    console.log(wrapper.debug());
    expect(wrapper.text()).toBe('foo');
  });

  it('adds correct value prop and children to the context provider', () => {
    const option = {
      name: Math.random().toString(),
      icon: 'icon',
    };
    const getMenuOptions = () => [option];
    const name = Math.random().toString();
    const id = Math.random().toString();
    const children = Math.random().toString();
    const wrapper = shallow(
      <PageContextProvider getMenuOptions={getMenuOptions} name={name} id={id}>
        {children}
      </PageContextProvider>,
    );
    const value = wrapper.prop('value');
    expect(value.getMenuOptions().length).toBe(1);
    expect(value.getMenuOptions()[0].name).toBe(option.name);
    expect(value.name).toBe(name);
    expect(value.id).toBe(id);
    expect(wrapper.html()).toBe(children);
  });

  it('adds a new id if one is not provided', () => {
    const getMenuOptions = () => [];
    const ShowContextId = () => <span>{useEditContext().id}</span>;
    const originalId = shallow(<ShowContextId />).prop('children');
    const wrapper = shallow(
      <PageContextProvider getMenuOptions={getMenuOptions}>
        foo
      </PageContextProvider>,
    );
    const newId = wrapper.prop('value').id;
    expect(newId).not.toBe(originalId);
  });

  it('creates an id that persists across re-renders', () => {
    const ShowContextId = () => <span>{useEditContext().id}</span>;
    // Need to use mount in order for persistence hooks to function correctly
    // See https://github.com/airbnb/enzyme/issues/1938
    const wrapper = mount(
      <PageContextProvider getMenuOptions={() => []}>
        <ShowContextId />
      </PageContextProvider>,
    );
    const firstId = wrapper.find('span').text();
    wrapper.setProps({ name: 'foo' });
    const secondId = wrapper.find('span').text();
    expect(firstId).toBe(secondId);
  });
});

describe('useRegisterMenuOptions', () => {
  it('registers root menu options correctly', () => {
    const fooOptions = [{
      name: 'foo',
    }];
    const barOptions = [{
      name: 'bar',
    }];
    const bazOptions = [{
      name: 'baz',
    }];
    const FooBar: FC = () => {
      useRegisterMenuOptions({ getMenuOptions: () => fooOptions, name: 'Foo' });
      useRegisterMenuOptions({ getMenuOptions: () => barOptions, name: 'Bar' });
      return null;
    };
    const Baz: FC = () => {
      useRegisterMenuOptions({ getMenuOptions: () => bazOptions, name: 'Baz' });
      return null;
    };
    const Test: FC = () => (
      <>
        <FooBar />
        <Baz />
        <Menu />
      </>
    );
    const wrapper = mount(<Test />);
    expect(wrapper.find('span#foo').text()).toBe('foo');
    expect(wrapper.find('span#bar').text()).toBe('bar');
    expect(wrapper.find('span#baz').text()).toBe('baz');
    expect(wrapper.text()).toBe('foobarbaz');
  });
});

describe.skip('react', () => {
  it('runs effects in depth order', () => {
    const A = ({ children }: any) => {
      console.log('render a');
      useEffect(() => console.log('effect a'));
      return <>{children}</>;
    };
    const B = ({ children }: any) => {
      console.log('render b');
      useEffect(() => console.log('b'));
      return <>{children}</>;
    };
    mount(<A><B /></A>);
  });


})
