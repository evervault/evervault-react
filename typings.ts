/** @format */
import React from 'react';

interface IDecryptChildrenProps {
  loading: boolean;
  error: object;
  decrypted: any;
}

export interface IDataProps {
  data: any;
}

export interface IDecryptProps extends IDataProps {
  children?: (props: IDecryptChildrenProps) => React.ReactNode;
}

export interface IWithEvervaultParams {
  appId: string;
  useEvervaultContext: boolean;
  authUrl?: string;
  apiUrl?: string;
}

export interface IWithEvervaultState {
  evervault: object;
}

export interface IEvervaultForms {
  children: (args: {
    handleChange: (e: IChildChangeEvent) => void;
    values: object;
  }) => React.ReactNode;
  handleSubmit: (values: object) => any;
  fieldsToEncrypt: Array<string>;
  initialValues?: object;
}

export interface IChangeEventTarget {
  name: string;
  value: any;
}

export interface IChildChangeEvent<E = object, C = any>
  extends React.BaseSyntheticEvent<E, C, IChangeEventTarget> {}
