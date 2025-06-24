const less = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const { i18n } = require('./next-i18next.config')

module.exports = less(withCss({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    importLoaders: 0,
    modifyVars: {
      primaryColor: '#0372FC',
      warningColor: '#EADF92',
      fontFamily: 'Gotham Pro, sans-serif'
    }
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style\/css.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }

    const splitChunks =
        config.optimization && config.optimization.splitChunks;
    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups;
      const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
          test: preactModules,
        });
        cacheGroups.commons.name = "framework";
      } else {
        cacheGroups.preact = {
          name: "commons",
          chunks: "all",
          test: preactModules,
        };
      }
    }

    config.module.rules.push({
      test: /\.(woff|woff2|ttf|eot)$/,
      use: {
        loader: 'url-loader',
      },
    })

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    })
    return config
  },
}))

module.exports.i18n = i18n;
