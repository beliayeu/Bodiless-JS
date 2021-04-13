/**
 * Copyright © 2021 Johnson & Johnson
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

import React, { ComponentType } from 'react';
import { useListContext, ListContext } from '@bodiless/components';
import { withDesign, withFinalDesign } from '@bodiless/fclasses';
import { useCarouselSetState } from './hooks';
import useBodilessListItemIndex from './useBodilessListItemIndex';

const withMoveToNewSlideOnAdd$ = (Component: ComponentType) => (props: any) => {
  const listContext = useListContext();
  const { addItem } = listContext;
  const carouselItemIndex = useBodilessListItemIndex();
  const setCarouselState = useCarouselSetState();
  const listContext$ = {
    ...listContext,
    addItem: () => {
      if (addItem !== undefined) addItem();
      setCarouselState({ currentSlide: carouselItemIndex + 1 });
    },
  };
  return (
    <ListContext.Provider value={listContext$}>
      <Component {...props} />
    </ListContext.Provider>
  );
};

const withMoveToNewSlideOnAdd = withDesign({
  Slider: withFinalDesign({
    Item: withMoveToNewSlideOnAdd$,
  }),
});

export default withMoveToNewSlideOnAdd;
