import Constants from 'expo-constants';

const localhost = 'http://127.0.0.1:4000/manager';

const ENV = {
  dev: {
    api: {
      manager: localhost,
    },
  },
  staging: {
    api: {
      manager: 'http://121.36.108.137:4000/manager',
    },
  },
  prod: {
    api: {
      manager: 'http://121.36.108.137:4000/manager',
    },
  },
};

const getEnvVars = () => {
  console.log(Constants.expoConfig, Constants.manifest);
  const env = Constants.expoConfig?.extra?.environment || 'dev';
  if (env.indexOf('staging') !== -1) return ENV.staging;
  if (env.indexOf('prod') !== -1) return ENV.prod;

  return ENV.dev;
};

const Environment = getEnvVars();

export default Environment;
