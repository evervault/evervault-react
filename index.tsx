/** @format */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import evervault from '@evervault/sdk';

import {
  IWithEvervaultParams,
  IWithEvervaultState,
  IDataProps,
  IDecryptProps,
  IEvervaultForms,
  IChildChangeEvent,
} from './typings';

export const EvervaultContext = React.createContext(undefined);
export const EvervaultProvider = EvervaultContext.Provider;
export const EvervaultConsumer = EvervaultContext.Consumer;

export function useEvervault() {
  const evervault = React.useContext(EvervaultContext);
  if (!evervault) {
    throw new Error('No context found for evervault');
  }
  if (typeof useContext !== 'function') {
    throw new Error(
      'You must use React >= 16.8 in order to use useEvervault()'
    );
  }
  return evervault;
}

export function withEvervault(
  WrappedComponent: typeof React.Component,
  params: IWithEvervaultParams
): React.ReactNode {
  const { appId, authUrl, apiUrl, useEvervaultContext } = params;
  return class extends React.Component<{}, IWithEvervaultState> {
    constructor(props: object) {
      super(props);
      evervault.init(appId, { auth: authUrl, api: apiUrl });
      evervault.checkAuth();
      this.state = {
        evervault,
      };
    }

    render() {
      if (useEvervaultContext) {
        return (
          <EvervaultProvider value={this.state.evervault}>
            <WrappedComponent />
          </EvervaultProvider>
        );
      }
      return <WrappedComponent evervault={this.state.evervault} />;
    }
  };
}

function DataDecrypt(props: IDataProps): JSX.Element {
  const { data } = props;
  const [decrypted, setDecrypted] = React.useState(undefined);

  React.useEffect(() => {
    let ignore = false;
    evervault.decrypt(data).then((decryptedData: any) => {
      if (!ignore) {
        setDecrypted(decryptedData);
      }
    });
    return () => {
      ignore = true;
    };
  }, [data]);

  return <>{decrypted}</>;
}

export function Decrypt(props: IDecryptProps): React.ReactNode {
  const { children, data } = props;
  if (!Boolean(children) && Boolean(data)) {
    return <DataDecrypt data={data} />;
  }
  const [decryptState, setDecryptState] = React.useState({
    loading: true,
    decrypted: undefined,
    error: undefined,
  });

  React.useEffect(() => {
    let ignore = false;

    evervault
      .decrypt(data)
      .then((decryptedData: any) => {
        if (!ignore) {
          setDecryptState({
            loading: false,
            decrypted: decryptedData,
            error: undefined,
          });
        }
      })
      .catch((err: object) => {
        if (!ignore) {
          setDecryptState({
            loading: false,
            decrypted: undefined,
            error: 'An error occurred while decrypting your data',
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return children({ ...decryptState });
}

Decrypt.propTypes = {
  children: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export function withEvervaultDecrypt(
  WrappedComponent: typeof React.Component,
  data: any
): React.ReactNode {
  return class extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = {
        loading: true,
        decrypted: undefined,
        error: undefined,
      };
    }

    componentDidMount() {
      evervault
        .decrypt(data)
        .then((decryptedData: any) => {
          this.setState({
            loading: false,
            decrypted: decryptedData,
            error: undefined,
          });
        })
        .catch((err: object) => {
          this.setState({
            loading: false,
            decrypted: undefined,
            error: 'An error occurred while decrypting your data',
          });
        });
    }

    render() {
      return <WrappedComponent {...this.state} />;
    }
  };
}

export function EvervaultForm(props: IEvervaultForms): React.ReactNode {
  const { children, initialValues = {}, handleSubmit, fieldsToEncrypt } = props;
  const [formState, setFormState] = React.useState<any | undefined>(
    initialValues
  );

  const handleChange = (e: IChildChangeEvent): void => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const wrappedOnSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    let _fieldsToEncrypt = fieldsToEncrypt;
    if (!Boolean(_fieldsToEncrypt)) {
      _fieldsToEncrypt = Object.keys(formState);
    }
    if (_fieldsToEncrypt.length < 1) {
      handleSubmit(formState);
    }

    let submissionObject = Object.assign({}, formState);
    for (let i = 0; i < _fieldsToEncrypt.length; i++) {
      if (formState[_fieldsToEncrypt[i]]) {
        submissionObject[_fieldsToEncrypt[i]] = await evervault.encrypt(
          formState[_fieldsToEncrypt[i]]
        );
      }
    }

    return handleSubmit(submissionObject);
  };

  return (
    <form onSubmit={wrappedOnSubmit}>
      {children({ values: { ...formState }, handleChange })}
    </form>
  );
}

EvervaultForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  fieldsToEncrypt: PropTypes.array,
  initialValues: PropTypes.object,
};
