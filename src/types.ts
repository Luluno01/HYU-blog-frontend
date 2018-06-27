export interface BlogBrief {
  title: string
  id: number
  author: string
  uid: number
  avatar: string
  subtitle: string
}

export interface Header { header: string }

export interface Divider {
  divider: boolean
  inset: boolean
}

export type BlogList = (BlogBrief | Header | Divider)[]