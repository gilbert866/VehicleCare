import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Colors} from '@/constants/Colors';

interface SearchBarProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search nearby services...' }) => {
    return (
        <View style={styles.container}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
    <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#888"
    value={value}
    onChangeText={onChange}
    returnKeyType="search"
        />
        </View>
);
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.light.WHITE,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.TEXT,
    },
});
