import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { StorageFactory, StorageType } from '../shared/src/services/storage/factory';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreatePromptScreen } from './src/screens/CreatePromptScreen';
import { PromptDetailsScreen } from './src/screens/PromptDetailsScreen';

// Initialize storage
StorageFactory.getInstance().initializeStorage(StorageType.HYBRID);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      // Add any initialization logic here
      setIsLoading(false);
    }
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'PrompterAI',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="CreatePrompt" 
          component={CreatePromptScreen}
          options={{
            title: 'Create Prompt',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="PromptDetails" 
          component={PromptDetailsScreen}
          options={{
            title: 'Prompt Details',
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
