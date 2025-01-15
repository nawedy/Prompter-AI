import { atProtoClient } from './client'
import type { ATProtoPrompt } from './types'
import { BskyAgent } from '@atproto/api'

export class PromptService {
  private agent: BskyAgent

  constructor() {
    this.agent = atProtoClient.getAgent()
  }

  async createPrompt(prompt: Omit<ATProtoPrompt, 'uri' | 'cid' | 'indexedAt'>): Promise<void> {
    try {
      await this.agent.post({
        text: prompt.text,
        facets: [],
        labels: {
          $type: 'com.atproto.label.defs#selfLabels',
          values: [
            { val: 'prompt' },
            ...prompt.tags.map(tag => ({ val: tag }))
          ]
        },
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to create prompt:', error)
      throw error
    }
  }

  async getPrompts(limit: number = 50): Promise<ATProtoPrompt[]> {
    try {
      const response = await this.agent.getAuthorFeed({
        actor: this.agent.session?.did as string,
        limit,
        filter: 'posts_with_replies',
      })

      return response.data.feed
        .filter(item => 
          item.post.labels?.some(label => label.val === 'prompt')
        )
        .map(item => ({
          text: item.post.record.text,
          category: item.post.labels?.find(l => l.val.startsWith('category:'))?.val.split(':')[1] || 'general',
          tags: item.post.labels
            ?.filter(l => l.val !== 'prompt' && !l.val.startsWith('category:'))
            .map(l => l.val) || [],
          createdAt: item.post.record.createdAt,
          updatedAt: item.post.indexedAt,
          visibility: 'public',
          record: item.post.record,
        }))
    } catch (error) {
      console.error('Failed to get prompts:', error)
      throw error
    }
  }

  async deletePrompt(uri: string): Promise<void> {
    try {
      await this.agent.deletePost(uri)
    } catch (error) {
      console.error('Failed to delete prompt:', error)
      throw error
    }
  }
}
