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

import { ComponentType } from 'react';
import { Node, Editor, Operation } from 'slate';
import Immutable from 'immutable';
import type { EditableProps } from 'slate-react/dist/components/editable';
import type { DesignableComponents } from '@bodiless/fclasses';
import type { UI } from './RichTextContext';

export enum RichTextItemType {
  block = 'BLOCK',
  inline = 'INLINE',
  mark = 'MARK',
}

export type DataJSON = object;

export type FormProps = {
  data: DataJSON;
  setData(Data: DataJSON): void;
  closeForm(): void;
  unwrap(): void;
};

export type Value = Node[];

export type NodeEditForm = ComponentType<FormProps>;

export type EditorOnChange = (value: Node[]) => void;

export type EditorContext = {
  editorProps: EditableProps;
} | null;

export type ToggleProps = {
  editor: Editor;
};

export type EditorButtonProps = {
  children?: any;
  className?: string;
};

export type CustomComponentProps = {
  componentData: DataJSON;
  setComponentData(Data: DataJSON): void;
  unwrap(): void;
  children: any;
};

export type Change = {
  operations: Immutable.List<Operation>;
  value: Value;
};

export type RichTextComponent = ComponentType<any> & {
  isVoid?: boolean,
  type: RichTextItemType,
  id: string,
  keyboardKey?: string,
  globalButton?: {
    icon: string,
  },
  hoverButton?: {
    icon: string,
  };
  isAtomicBlock?: boolean,
};

export type RichTextComponents = {
  [key:string]: RichTextComponent,
};

export type RichTextProps = {
  components: DesignableComponents,
  ui?: UI,
  initialValue?: Value,
  nodeKey?: string,
  value?: Value;
  onChange: (value: Value) => void;
} & EditableProps;
