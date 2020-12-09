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

/* tslint:disable:max-line-length */
import { flow } from 'lodash';
import {
  asBlock,
  asMark,
  withKey,
  withButton,
  asInline,
  withId,
  asVoid,
  withHtmlElement,
  withHtmlElementToSlateNodeMapper,
} from '../RichTextItemSetters';

const withLinkDeserializer = flow(
  withHtmlElement((element: HTMLElement) => element.nodeName === 'A'),
  withHtmlElementToSlateNodeMapper((element: HTMLElement) => ({
    type: 'Link',
    data: { slatenode: { href: element.getAttribute('href') } },
  })),
);

const withHeader2Deserializer = flow(
  withHtmlElement((element: HTMLElement) => element.nodeName === 'H2'),
  withHtmlElementToSlateNodeMapper(() => ({ type: 'H2' })),
);

export const withBoldMeta = flow(asMark, withKey('mod+b'), withButton('format_bold'));
export const withSuperScriptMeta = flow(asMark, withKey('mod+s'), withButton('format_size'));
export const withItalicMeta = flow(asMark, withKey('mod+i'), withButton('format_italic'));
export const withLinkMeta = flow(withLinkDeserializer, asInline, withKey('mod+k'), withButton('link'));
export const withStrikeThroughMeta = flow(asMark, withKey('mod+s'), withButton('format_strikethrough'));
export const withUnderlineMeta = flow(asMark, withKey('mod+u'), withButton('format_underlined'));
export const withAlignLeftMeta = flow(asBlock, withButton('format_align_left'));
export const withAlignRightMeta = flow(asBlock, withButton('format_align_right'));
export const withAlignCenterMeta = flow(asBlock, withButton('format_align_center'));
export const withAlignJustifyMeta = flow(asBlock, withButton('format_align_justify'));
export const withHeader1Meta = flow(asBlock, withKey('mod+1'), withButton('looks_one'));
export const withHeader2Meta = flow(withHeader2Deserializer, asBlock, withKey('mod+2'), withButton('looks_two'));
export const withHeader3Meta = flow(asBlock, withKey('mod+3'), withButton('looks_3'));
export const withImageMeta = flow(asVoid, asMark, withId('image'), withButton('image'));
