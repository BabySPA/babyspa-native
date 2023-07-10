import { ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    extra: {
      environment: 'staging',
    },
  };
};
