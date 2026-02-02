import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// @ts-ignore - The dependency is linked locally via metro/package.json
import { ComponentRegistry } from '@vendor/ui-library';

export const UnifiedTestScreen = () => {
  // Mock Backend Response (SDUI)
  // This simulates what the app would receive from /api/page-config
  const backendResponse = [
    { 
      id: '1', 
      component: 'UnifiedCard', 
      props: { 
        title: 'Mobile SDUI Works!', 
        description: 'This card is rendered natively from the same shared code!'
      } 
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Unified SDUI Test</Text>
      <Text style={styles.subHeader}>Native Rendering from Registry</Text>
      
      <View style={styles.cardContainer}>
        {backendResponse.map((item) => {
          const VariableComponent = ComponentRegistry[item.component];
          
          if (!VariableComponent) {
            return (
              <Text key={item.id} style={styles.errorText}>
                Component "{item.component}" not found.
              </Text>
            );
          }
          
          return <VariableComponent key={item.id} {...item.props} />;
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  cardContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16,
  }
});
