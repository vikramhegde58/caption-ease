/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            issuer: {and: [/\.(js|ts|md)x?$/]},
            type: 'asset/resource'
        })
        return config
    }
}

export default nextConfig
