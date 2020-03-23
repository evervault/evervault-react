/** @format */

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
}

export interface IWithEvervaultState {
  evervault: object;
}

export interface IEvervaultForms {
  children: ({ handleChange: Function, values: object }) => React.ReactNode;
  handleSubmit: (values: object) => any;
  fieldsToEncrypt: Array<string>;
  initialValues?: object;
}
