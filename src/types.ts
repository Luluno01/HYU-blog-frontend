import Blog from './Lib/sdk/Blog'

export interface Header { header: string }

export interface Divider {
  divider: boolean
  inset: boolean
}

export type BlogList = (Blog | Header | Divider)[]