export interface ATProtoUser {
  did: string
  handle: string
  displayName?: string
  description?: string
  avatar?: string
}

export interface ATProtoPost {
  uri: string
  cid: string
  author: ATProtoUser
  text: string
  createdAt: string
  indexedAt: string
}

export interface ATProtoPrompt {
  text: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  visibility: 'public' | 'private'
  record: {
    text: string
    langs: string[]
    labels?: string[]
    $type: 'app.bsky.feed.post'
  }
}
