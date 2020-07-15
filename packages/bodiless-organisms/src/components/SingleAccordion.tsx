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

import React, {
  ComponentType,
  useState,
  createContext,
  useContext,
} from 'react';
import { flow } from 'lodash';
import {
  withDesign,
  designable,
  Div,
  H2,
  StylableProps,
  addProps,
} from '@bodiless/fclasses';
import type {
  DesignableComponentsProps
} from '@bodiless/fclasses';
import {
  asEditable,
} from '@bodiless/components';
import { withNode } from '@bodiless/core';

export type SingleAccordionComponents = {
  Wrapper: ComponentType<StylableProps>,
  TitleWrapper: ComponentType<StylableProps>,
  Title: ComponentType<StylableProps>,
  BodyWrapper: ComponentType<StylableProps>,
  Body: ComponentType<StylableProps>,
};
const singleAccordionComponentStart:SingleAccordionComponents = {
  Wrapper: Div,
  TitleWrapper: Div,
  Title: H2,
  BodyWrapper: Div,
  Body: Div,
};

enum ACCORDION_STATE {
  EXPANDED,
  COLLAPSED,
}

type Props = {
  state: ACCORDION_STATE,
  toggle: Function,
  expandedStyle: string | null,
} & DesignableComponentsProps<SingleAccordionComponents>;

const SingleAccordionBase = ({
  components, state, expandedStyle = null, toggle, ...rest
}: Props) => {
  const {
    Wrapper,
    TitleWrapper,
    Title,
    BodyWrapper,
    Body,
  } = components;

  return (
    <Wrapper className={[state]} {...rest}>
      <TitleWrapper
        onClick={toggle}
        className={[
          'flex',
          'justify-between',
          'select-none',
          (state === ACCORDION_STATE.EXPANDED && expandedStyle) || '',
        ]}
      >
        <Title />
        <span className="material-icons cursor-pointer select-none" data-accordion-element="accordion-icon" data-accordion-icon={state === ACCORDION_STATE.COLLAPSED ? 'expand' : 'collapse'}>
          {state === ACCORDION_STATE.COLLAPSED ? 'add' : 'remove'}
        </span>
      </TitleWrapper>
      <BodyWrapper className={state === ACCORDION_STATE.COLLAPSED ? 'hidden' : 'block'}>
        <Body />
      </BodyWrapper>
    </Wrapper>
  );
};

const createSingleAccordionProvider = () => {
  const SingleAccordionContext = createContext({
    accordionState: ACCORDION_STATE.EXPANDED,
    setAccordionState: () => {},
  });
  const withSingleAccordionProvider = Component => {
    const WithSingleAccordionProvider = props => {
      const { expanded } = props;
      const initialState = expanded ? ACCORDION_STATE.EXPANDED : ACCORDION_STATE.COLLAPSED;
      const [accordionState, setAccordionState] = useState(initialState);
      const providerValue = {
        accordionState,
        setAccordionState,
      };
      const props$1 = {
        ...props,
        state: accordionState,
        toggle: () => setAccordionState(accordionState === ACCORDION_STATE.EXPANDED ? ACCORDION_STATE.COLLAPSED : ACCORDION_STATE.EXPANDED),
      };
      return (
        <SingleAccordionContext.Provider value={providerValue}>
          <Component {...props$1} />
        </SingleAccordionContext.Provider>
      );
    };
    WithSingleAccordionProvider.displayName = 'WithSingleAccordionProvider';
    return WithSingleAccordionProvider;
  };
  return {
    withAccordionContext: withSingleAccordionProvider,
    useAccordionContext: () => useContext(SingleAccordionContext),
  };
};

const createSingleAccordion = () => {
  const { withAccordionContext, useAccordionContext } = createSingleAccordionProvider();
  return {
    Accordion: flow(
      designable(singleAccordionComponentStart),
      withAccordionContext,
    )(SingleAccordionBase),
    isExpanded: () => useAccordionContext().accordionState === ACCORDION_STATE.EXPANDED,
    isCollapsed: () => useAccordionContext().accordionState === ACCORDION_STATE.COLLAPSED,
  };
};

const asSingleAccordion = withDesign({
  Title: asEditable('title', 'SingleAccordion Title Text'),
  Body: asEditable('body', 'SingleAccordion Body Text'),
});

const asTestableAccordion = withDesign({
  Wrapper: addProps({ 'data-accordion-element': 'accordion' }),
  TitleWrapper: addProps({ 'data-accordion-element': 'accordion-title-wrapper' }),
  Title: addProps({ 'data-accordion-element': 'accordion-title' }),
  BodyWrapper: addProps({ 'data-accordion-element': 'accordion-body-wrapper' }),
  Body: addProps({ 'data-accordion-element': 'accordion-body' }),
});

const { Accordion: SingleAccordionClean } = createSingleAccordion();

const SingleAccordion = flow(
  asSingleAccordion,
  withNode,
)(SingleAccordionClean);

const TestableSingleAccordion = flow(
  asTestableAccordion,
  withNode,
)(SingleAccordionClean);

export default SingleAccordion;
export {
  createSingleAccordion,
  SingleAccordionBase,
  SingleAccordion,
  SingleAccordionClean,
  TestableSingleAccordion,
  asSingleAccordion,
  asTestableAccordion,
};
