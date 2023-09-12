/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const replacePath = (path) => (path === `/` ? path : path.replace(/\/$/, ``))

async function getResults({ graphql, reporter }) {
  const graphqlResult = await graphql(/* GraphQL */ `
    {
      allMdx(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          internal {
            contentFilePath
          }
          fields {
            slug
            source
          }
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, graphqlResult.errors)
    return {}
  }
  return graphqlResult.data
}

/**
 * This function creates all the individual pages in this site
 */
const createIndividualPage = async ({ pages, gatsbyUtilities }) =>
  Promise.all(
    pages.map((page, index) => {
      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      gatsbyUtilities.actions.createPage({
        // Use the WordPress uri as the Gatsby page path
        // This is a good idea so that internal links and menus work
        path: replacePath(page.fields.slug),

        // use the blog post template as the page component
        component: `${path.resolve(path.join(__dirname, `src/templates/PageTemplate.tsx`))}?__contentFilePath=${
          page.internal.contentFilePath
        }`,

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          // we need to add the post id here
          // so our blog post template knows which blog post
          // the current page is (when you open it in a browser)
          id: page.id,

          // We also use the next and previous id's to query them and add links!
          // previousPostId: previousPostId,
          // nextPostId: nextPostId,
        },
      })
    })
  )

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */

exports.createPages = async (gatsbyUtilities) => {
  // Query our posts from the GraphQL server
  const results = await getResults(gatsbyUtilities)
  const pages = results.allMdx.nodes.filter((val) => val.fields.source.includes('page'))

  // If there are pages, create page for them
  if (pages.length) {
    await createIndividualPage({ pages, gatsbyUtilities })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
    }
    type MdxFrontmatter {
      title: String
      description: String
      blurb: String
      date(formatString: String): String
      isHome: Boolean
      image: File @fileByRelativePath
      imageAlt: String
    }
  `)
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: replacePath(slug),
    })
  }
}
