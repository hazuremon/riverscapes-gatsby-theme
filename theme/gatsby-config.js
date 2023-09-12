/* eslint-disable @typescript-eslint/no-var-requires */
const path = require(`path`)

module.exports = ({ contentPath, manifest }) => {
  const srcRoot = path.resolve(path.join(__dirname))
  if (!contentPath) throw new Error('contentPath is required')
  if (!manifest) throw new Error('manifest is required')
  console.log('Content Paths', { contentPath, srcRoot })
  return {
    plugins: [
      `gatsby-plugin-image`,
      `gatsby-plugin-mdx-source-name`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `images`,
          ignore: [`**/\.*`],
          path: `${srcRoot}/src/images`,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `page`,
          ignore: [`**/\.*`],
          path: contentPath,
        },
      },
      {
        resolve: `gatsby-plugin-mdx`,
        options: {
          gatsbyRemarkPlugins: [
            {
              resolve: `gatsby-remark-images`,
              options: {
                maxWidth: 992,
              },
            },
            {
              resolve: `gatsby-remark-responsive-iframe`,
              options: {
                wrapperStyle: `margin-bottom: 1.0725rem`,
              },
            },
            {
              resolve: `gatsby-remark-autolink-headers`,
              options: {
                className: `header-link-icon`,
              },
            },
            `gatsby-remark-prismjs`,
          ],
        },
      },
      `gatsby-transformer-sharp`,
      {
        resolve: `gatsby-plugin-sharp`,
        options: {
          defaults: {
            formats: [`auto`, `webp`],
            placeholder: `dominantColor`,
            quality: 50,
            breakpoints: [750, 1080, 1366, 1920],
            backgroundColor: `transparent`,
            tracedSVGOptions: {},
            blurredOptions: {},
            jpgOptions: {},
            pngOptions: {},
            webpOptions: {},
            avifOptions: {},
          },
        },
      },
      {
        resolve: `gatsby-plugin-manifest`,
        options: {
          name: manifest.name,
          short_name: manifest.short_name,
          start_url: manifest.start_url || '/',
          background_color: `#ffffff`,
          // This will impact how browsers show your PWA/website
          // https://css-tricks.com/meta-theme-color-and-trickery/
          // theme_color: `#663399`,
          display: `minimal-ui`,
          icon: manifest.iconUrl || `${srcRoot}/src/images/favicon/data-exchange-icon-64x64.png`, // This path is relative to the root of the site.
        },
      },
    ],
  }
}
