/** @type {import('next').NextConfig} */


module.exports = {
    i18n: {
        locales: ["es"],
        defaultLocale: "es",
    },
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[]",
    },
    async redirects() {
        return [
            {
                source: '/es',
                destination: '/',
                permanent: true,
            },
        ]
    },
}
