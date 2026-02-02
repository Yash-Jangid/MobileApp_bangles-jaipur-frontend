import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderProps } from '../../types/sdui';

export const Header: React.FC<HeaderProps> = ({ logo, variant = 'Simple' }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>{logo || 'LOGO'}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.iconButton}>
                    <Text>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Text>🛒</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        padding: 8,
    },
});
