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

import { Editor, Transforms } from 'slate';
import { DataJSON } from '../../Type';


const isInlineActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })
  return !!match
};

export const hasInline = (format: string, editor: Editor) => isInlineActive(editor, format);

export const getInline = (value: Value, inlineType: string) => value.inlines
  .filter(inline => Boolean(inline && inline.type === inlineType))
  .first();
export const createInline = (inlineType: string, data: DataJSON) => ({
  data,
  type: inlineType,
});
export const hasMultiBlocks = (value: Value) => value.blocks.size > 1;
export const removeInline = (editor: Editor, inlineType: string) => (
  editor.unwrapInline(inlineType).focus()
);
export const removeInlineByNode = (editor: Editor, node: Inline) => {
  editor.moveToRangeOfNode(node);
  editor.unwrapInline(node.type).focus();
};

export const wrapInline = (
  editor: Editor,
  inlineType: string,
  data: DataJSON,
) => {
  editor.wrapInline(createInline(inlineType, data));
};

export type UpdateInlineOptions = {
  editor: Editor;
  componentData: DataJSON;
  node: Inline;
};

export type InsertInlineOptions = {
  editor: Editor;
  value: Value;
  inlineType: string;
};
export type createToggleInlineOptions = {
  editor: Editor;
  value: Value;
};

export const updateInline = ({
  editor,
  componentData,
  node,
}: UpdateInlineOptions) => {
  const { value } = editor;
  const { selection, fragment } = value;
  const { text } = fragment;
  if (selection.isCollapsed) {
    editor.moveFocusBackward(text.length);
  }

  editor.moveToRangeOfNode(node).setInlines({
    type: node.type,
    data: { ...componentData, openModal: false },
  });

  return editor;
};

export const insertInline = ({
  editor,
  value,
  inlineType,
}: InsertInlineOptions) => {
  const { selection } = value;
  if (hasInline(value, inlineType)) {
    removeInline(editor, inlineType);
  } else if (selection.isExpanded) {
    wrapInline(editor, inlineType, { openModal: true });
  } else if (hasMultiBlocks(value)) {
    // eslint-disable-next-line no-console
    console.info('[SlateJS][ImagePlugin] has multiple blocks on selection');
  } else if (selection.isCollapsed && !hasInline(value, inlineType)) {
    // eslint-disable-next-line no-console
    console.info(
      '[SlateJS][ImagePlugin] selection collapsed, w/o links on selection',
    );
  }

  return editor;
};

export const toggleInline = ({
  editor,
  blockType,
}: any) => {
  const isActive = isBlockActive(editor, blockType)

  Transforms.unwrapNodes(editor, {
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : blockType,
  })
};

export const createToggleInline = (inlineType: string) => (
  { editor }:createToggleInlineOptions,
) => (
  toggleInline({
    editor,
    inlineType,
  })
);
