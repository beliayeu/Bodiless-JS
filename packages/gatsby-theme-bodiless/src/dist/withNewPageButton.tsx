/**
 * Copyright © 2020 Johnson & Johnson
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

/* eslint-disable no-alert */
import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  contextMenuForm,
  useMenuOptionUI,
  useEditContext,
  withMenuOptions,
  ContextSubMenu,
} from '@bodiless/core';
import { AxiosPromise } from 'axios';
import { ComponentFormSpinner } from '@bodiless/ui';
import BackendClient from './BackendClient';
import handle from './ResponseHandler';
import verifyPage from './PageVerification';
import { useGatsbyPageContext } from './GatsbyPageProvider';
import NewPageURLField, { getPathValue } from './NewPageURLField';

type Client = {
  savePage: (path: string, template?: string) => AxiosPromise<any>;
};

const DEFAULT_PAGE_TEMPLATE = '_default';

enum NewPageState {
  Init,
  Pending,
  Complete,
  Errored,
}

type PageStatus = {
  status: NewPageState;
  newPagePath?: string;
  errorMessage?: string;
};

type NewPageProps = PageStatus;

const createPage = async ({ path, client, template } : any) => {
  // Create the page.
  const result = await handle(client.savePage(path, template));
  // If the page was created successfully:
  if (result.response) {
    // Verify the creation of the page.
    const isPageVerified = await verifyPage(path);
    if (!isPageVerified) {
      const errorMessage = `Unable to verify page creation.
        It is likely that your new page was created but is not yet available.
        Click ok to visit the new page; if it does not load, wait a while and reload.`;
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.resolve(path);
  }
  if (result.message) {
    return Promise.reject(new Error(result.message));
  }
  return Promise.reject(new Error('An internal error occurred. Please try again later.'));
};

const NewPageComp = (props : NewPageProps) => {
  const {
    status, errorMessage, newPagePath,
  } = props;
  const {
    ComponentFormLabel,
    ComponentFormDescription,
    ComponentFormText,
    ComponentFormWarning,
    ComponentFormTitle,
    ComponentFormLink,
  } = useMenuOptionUI();
  const formTitle = 'Add a Blank Page';
  const { subPageTemplate } = useGatsbyPageContext();
  const template = subPageTemplate || DEFAULT_PAGE_TEMPLATE;
  switch (status) {
    case NewPageState.Init: {
      return (
        <>
          <ComponentFormTitle>{formTitle}</ComponentFormTitle>
          <ComponentFormLabel>Template</ComponentFormLabel>
          <ComponentFormText
            field="template"
            disabled
            initialValue={template}
          />
          <NewPageURLField
            validateOnChange
            validateOnBlur
          />
        </>
      );
    }
    case NewPageState.Pending:
      return (
        <>
          <ComponentFormTitle>Creating Page</ComponentFormTitle>
          <ComponentFormSpinner />
        </>
      );
    case NewPageState.Complete:
      return (
        <>
          <ComponentFormTitle>Operation Complete</ComponentFormTitle>
          <ComponentFormDescription>
            <ComponentFormLink href={newPagePath} id="new-page-link">{`Click here to visit the new page: ${newPagePath}`}</ComponentFormLink>
          </ComponentFormDescription>
        </>
      );
    case NewPageState.Errored:
      return (
        <>
          <ComponentFormTitle>{formTitle}</ComponentFormTitle>
          <ComponentFormWarning>{errorMessage}</ComponentFormWarning>
        </>
      );
    default: return (<></>);
  }
};

const formPageAdd = (client: Client) => contextMenuForm({
  submitValues: ({ keepOpen }: any) => keepOpen,
  hasSubmit: ({ keepOpen }: any) => keepOpen,
})(({ formState, formApi } : any) => {
  const { ComponentFormText } = useMenuOptionUI();
  const {
    submits, invalid, values,
  } = formState;
  const [state, setState] = useState<PageStatus>({
    status: NewPageState.Init,
  });
  const context = useEditContext();
  const { template } = values;
  const path = getPathValue(values);
  useEffect(() => {
    // If the form is submitted and valid then lets try to creat a page.
    if (submits && path && invalid === false) {
      context.showPageOverlay({ hasSpinner: false });
      setState({ status: NewPageState.Pending });
      // Create the page.
      createPage({ path, client, template })
        .then((newPagePath: string) => {
          if (newPagePath) {
            setState({ status: NewPageState.Complete, newPagePath });
          }
        })
        .catch((err: Error) => {
          setState({ status: NewPageState.Errored, errorMessage: err.message });
        })
        .finally(() => {
          context.hidePageOverlay();
          formApi.setValue('keepOpen', false);
        });
    }
  }, [submits]);
  const { status, errorMessage, newPagePath } = state;
  return (
    <>
      <ComponentFormText type="hidden" field="keepOpen" initialValue />
      <NewPageComp
        status={status}
        errorMessage={errorMessage}
        newPagePath={newPagePath}
      />
    </>
  );
});

const defaultClient = new BackendClient();

const useMenuOptions = () => {
  const context = useEditContext();

  const menuOptions = [
    {
      name: 'page',
      label: 'Page',
      isHidden: useCallback(() => !context.isEdit, []),
      icon: 'note_add',
      Component: ContextSubMenu,
    },
    {
      name: 'newpage',
      icon: 'check_box_outline_blank',
      label: 'Blank',
      isHidden: useCallback(() => !context.isEdit, []),
      handler: () => formPageAdd(defaultClient),
      group: 'page',
    },
  ];
  return menuOptions;
};

const withNewPageButton = withMenuOptions({
  useMenuOptions,
  name: 'NewPage',
  peer: true,
});

export default withNewPageButton;
