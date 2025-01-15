import { BskyAgent } from '@atproto/api'

export class ATProtoClient {
  private agent: BskyAgent
  private static instance: ATProtoClient

  private constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
    })
  }

  public static getInstance(): ATProtoClient {
    if (!ATProtoClient.instance) {
      ATProtoClient.instance = new ATProtoClient()
    }
    return ATProtoClient.instance
  }

  public async login(identifier: string, password: string): Promise<boolean> {
    try {
      await this.agent.login({
        identifier,
        password,
      })
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  public async createPost(text: string): Promise<void> {
    try {
      await this.agent.post({
        text,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to create post:', error)
      throw error
    }
  }

  public async getProfile(handle: string) {
    try {
      const response = await this.agent.getProfile({ actor: handle })
      return response.data
    } catch (error) {
      console.error('Failed to get profile:', error)
      throw error
    }
  }

  public getAgent(): BskyAgent {
    return this.agent
  }
}

export const atProtoClient = ATProtoClient.getInstance()
