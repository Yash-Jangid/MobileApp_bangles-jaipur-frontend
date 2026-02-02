import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import apiService from '../services/ApiService';

const ApiDebugTest: React.FC = () => {
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCategoriesApi = async () => {
    setLoading(true);
    setDebugResult(null);
    
    try {
      console.log('=== Starting API Debug Test ===');
      
      // Test the simplified method (matches Postman exactly)
      console.log('=== Testing Simplified Method ===');
      const simpleResult = await apiService.getCategoriesSimple();
      console.log('Simplified method result:', simpleResult);
      
      // Test the debug method
      console.log('=== Testing Debug Method ===');
      const debugResult = await apiService.debugGetCategories();
      console.log('Debug method result:', debugResult);
      
      // Also test the regular method
      console.log('=== Testing Regular Method ===');
      const regularResult = await apiService.getCategories();
      console.log('Regular method result:', regularResult);
      
      // Use the simplified result for display
      setDebugResult(simpleResult);
      
    } catch (error) {
      console.error('Debug test error:', error);
      setDebugResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        rawError: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Debug Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testCategoriesApi}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test Categories API'}
        </Text>
      </TouchableOpacity>

      {debugResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Debug Result:</Text>
          <Text style={styles.resultText}>
            Success: {debugResult.success ? 'Yes' : 'No'}
          </Text>
          {debugResult.status && (
            <Text style={styles.resultText}>
              Status: {debugResult.status} {debugResult.statusText}
            </Text>
          )}
          {debugResult.error && (
            <Text style={styles.errorText}>
              Error: {debugResult.error}
            </Text>
          )}
          {debugResult.data && (
            <Text style={styles.resultText}>
              Data: {JSON.stringify(debugResult.data, null, 2)}
            </Text>
          )}
          {debugResult.rawText && (
            <Text style={styles.resultText}>
              Raw Response: {debugResult.rawText.substring(0, 500)}...
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 5,
    color: 'red',
    fontFamily: 'monospace',
  },
});

export default ApiDebugTest;
