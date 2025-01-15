import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useStorage } from '../../../shared/src/services/storage/factory';
import type { Prompt } from '../../../shared/src/types';

export function PromptDetailsScreen({ route, navigation }) {
  const { prompt }: { prompt: Prompt } = route.params;
  const [isDeleting, setIsDeleting] = useState(false);
  const storage = useStorage();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await storage.deletePrompt(prompt.id);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      alert('Failed to delete prompt. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `${prompt.title}\n\n${prompt.content}`,
        title: prompt.title,
      });
    } catch (error) {
      console.error('Failed to share prompt:', error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{prompt.title}</Text>
        <Text style={styles.category}>{prompt.category}</Text>
        <Text style={styles.date}>
          Created: {prompt.createdAt.toLocaleDateString()}
        </Text>
        <Text style={styles.promptContent}>{prompt.content}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  promptContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
