import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useStorage } from '../../../shared/src/services/storage/factory';
import type { Prompt } from '../../../shared/src/types';

export function HomeScreen({ navigation }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const storage = useStorage();

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    try {
      const loadedPrompts = await storage.getPrompts();
      setPrompts(loadedPrompts);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderPrompt({ item }: { item: Prompt }) {
    return (
      <TouchableOpacity
        style={styles.promptCard}
        onPress={() => navigation.navigate('PromptDetails', { prompt: item })}
      >
        <Text style={styles.promptTitle}>{item.title}</Text>
        <Text style={styles.promptCategory}>{item.category}</Text>
        <Text numberOfLines={2} style={styles.promptContent}>
          {item.content}
        </Text>
      </TouchableOpacity>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading prompts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreatePrompt')}
      >
        <Text style={styles.createButtonText}>Create New Prompt</Text>
      </TouchableOpacity>
      <FlatList
        data={prompts}
        renderItem={renderPrompt}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  list: {
    flex: 1,
  },
  promptCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promptCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  promptContent: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
