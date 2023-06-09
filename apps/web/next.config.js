/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Ensures no server modules are included on the client.
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /lib\/server/,
        })
      );
    }

    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.module = {
      ...config.module,
      // view thoughts 007 - mongodb-optional-dependencies
      exprContextCritical: false,
    };

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        // view thoughts 007 - mongodb-optional-dependencies
        kerberos: false,
        '@mongodb-js/zstd': false,
        '@aws-sdk/credential-providers': false,
        snappy: false,
        'mongodb-client-encryption': false,
        aws4: false,
      },
    };

    return config;
  },
  compiler: {
    relay: require('./relay.config'),
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
