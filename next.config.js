import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
    // @imgly/background-removal dynamically imports onnxruntime-web at runtime.
    // These are browser-only packages — ignore them at build time.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^onnxruntime-web(\/.*)?$/,
      })
    )

    config.resolve.fallback = { fs: false }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
