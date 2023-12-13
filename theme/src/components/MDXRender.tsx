import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Box, Divider, Stack, Grid, Typography, useTheme, Alert } from '@mui/material'
import 'prismjs/themes/prism-dark.css'
import Button from './RSLinkButton'
import { RSLink } from './RSLink'
import { StoryCard } from './StoryCard'
import Hero from '../components/Hero'
import { YoutubeEmbed } from '../components/YoutubeEmbed'
import HomepageCard, { HomepageCardContent, HomepageCardHighlight, HomepageCardStat } from '../components/homepageCards'
import MDXErrorBoundary from './MDXErrorBoundary'
import { ErrorLiquidText, ErrorUnclosed } from './MDXErrors'
import { RSStaticImage } from './StaticImage'

const MDXRender: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme()

  const shortcodes: Record<string, any> = {
    HomepageCard,
    HomepageCardContent,
    HomepageCardHighlight,
    HomepageCardStat,
    Button,
    Hero,
    RSStaticImage,
    Link: RSLink,
    ErrorLiquidText,
    ErrorUnclosed,
    Youtube: YoutubeEmbed,
    Box,
    StoryCard,
    Stack,
    Grid,
    Alert,
  }

  const hStyles = {
    mt: 8,
    mb: 6,
    '&:hover': {
      '& .header-link-icon': {
        display: 'block',
      },
    },
  }

  return (
    <MDXErrorBoundary>
      <MDXProvider
        components={{
          ...shortcodes,
          h1: ({ children }) => (
            <Typography variant="h1" sx={hStyles}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h2" sx={hStyles}>
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h3" sx={hStyles}>
              {children}
            </Typography>
          ),
          h4: ({ children }) => (
            <Typography variant="h4" sx={hStyles}>
              {children}
            </Typography>
          ),
          h5: ({ children }) => (
            <Typography variant="h5" sx={hStyles}>
              {children}
            </Typography>
          ),
          h6: ({ children }) => (
            <Typography variant="h6" sx={hStyles}>
              {children}
            </Typography>
          ),
          // Add a custom component for the 'comment' tag so we ignore comments
          comment: ({ children }) => <React.Fragment>{/* Ignore comments */}</React.Fragment>,
          img: ({ src, alt, ...rest }) => {
            return (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex', // Make this a flex container
                  alignItems: 'center', // Center children vertically
                  justifyContent: 'center', // Center children horizontally
                }}
              >
                <RSStaticImage src={src} alt={alt} />
              </Box>
            )
          },
          a: (props) => {
            const { className, href } = props

            // For internal targets the MDX plugin renders a little SVG button. we need to leave that alone
            if (className && className.indexOf('header-link-icon') >= 0) {
              return <a id={props.href} {...props} />
            }

            return <RSLink to={href} {...(props as any)} />
          },
          p: ({ children }) => (
            <Typography
              paragraph
              sx={{
                mt: 4,
              }}
            >
              {children}
            </Typography>
          ),
          hr: () => (
            <Divider
              sx={{
                border: '2px solid #B4CE00',
                backgroundColor: '#B4CE00',
                color: '#B4CE00',
              }}
            />
          ),
          li: ({ children }) => (
            <Typography
              component="li"
              sx={{
                mt: 1,
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Typography
              component={'blockquote'}
              sx={{
                maxWidth: theme.breakpoints.values.xl,
                mt: 4,
                '&,& p': {
                  color: theme.palette.info.main,
                  fontFamily: '"JetBrains Mono", "Courier New", sans-serif',
                  // px: 2,
                  fontSize: '1.95rem',
                  //   margin: [0, 'auto'],
                },
              }}
            >
              {children}
            </Typography>
          ),
          '*': ({ children }) => (
            <Typography
              component="span"
              sx={{
                mt: 1,
              }}
            >
              {children}
            </Typography>
          ),
        }}
      >
        {children}
      </MDXProvider>
    </MDXErrorBoundary>
  )
}

export default MDXRender
