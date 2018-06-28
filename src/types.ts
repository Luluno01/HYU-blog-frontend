export interface BlogBrief {
  title: string
  id: number
  author: string
  uid: number
  avatar: string
  time: Date
}

export interface Header { header: string }

export interface Divider {
  divider: boolean
  inset: boolean
}

export type BlogList = (BlogBrief | Header | Divider)[]