import React from 'react'
import Typography from '@mui/material/Typography'
import { TreeView } from '@mui/x-tree-view/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItemLink from './TreeItemLink'
import { MobileMenu, MobileMenuItem } from '../../types'
import { Box, IconButton } from '@mui/material'

interface SideNavProps {
  heading?: string
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  content: MobileMenu
  showHeading: boolean
  theme?: 'white' | 'none'
}

const SideNav: React.FC<SideNavProps> = ({
  heading = '',
  headingType = 'h2',
  showHeading = true,
  content = { items: [] },
  theme = 'none',
}) => {
  const navHeading = showHeading ? (
    <Typography
      sx={{
        mb: 3,
      }}
      component={headingType}
      variant="sideMenu"
    >
      {heading}
    </Typography>
  ) : (
    ''
  )

  const renderTree = (nodes: MobileMenu | MobileMenuItem, key: string, level: number) => {
    const nextLevel = level + 1
    const currentKey = `${level}${key}`
    const nodesItem = nodes as MobileMenuItem
    const nodesMenu = nodes as MobileMenu

    return (
      <TreeItemLink key={currentKey} nodeId={`${currentKey}`} to={nodesItem.url} label={nodesItem.title}>
        {nodesMenu.items && Array.isArray(nodesMenu.items)
          ? nodesMenu.items.map((node, nodekey) => {
              return renderTree(node, `${level}${nodekey}`, nextLevel)
            })
          : null}
      </TreeItemLink>
    )
  }

  const contentItem = (node: MobileMenuItem[]) => {
    const level = 0
    return (node || []).map((item, key) => {
      return renderTree(item, `${key}`, level)
    })
  }

  return (
    <Box
      sx={{
        mt: showHeading ? 4 : 0,
        backgroundColor: theme === 'white' ? 'white' : undefined,
      }}
    >
      {navHeading}
      <TreeView
        aria-label="Side Navigation"
        defaultCollapseIcon={
          <IconButton
            size="medium"
            sx={{ mr: 1 }}
            onClick={(e) => {
              // e.preventDefault()
              // e.stopPropagation()
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        defaultExpandIcon={
          <IconButton
            size="medium"
            sx={{ mr: 1 }}
            onClick={(e) => {
              // e.preventDefault()
              // e.stopPropagation()
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        }
      >
        {content ? contentItem(content.items) : null}
      </TreeView>
    </Box>
  )
}

export default SideNav
