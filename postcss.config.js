import autoprefixer from 'autoprefixer';
import postcssPxToRem from 'postcss-pxtorem';

export default ({ env }) => {
  const isProd = env === 'production';
  const plugins = [];

  if (isProd) {
    plugins.push(
      postcssPxToRem({
        propList: ['*'],
        mediaQuery: true
      }),
      autoprefixer()
    );
  }

  return {
    plugins
  };
};
