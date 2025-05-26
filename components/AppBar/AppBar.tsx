import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Colors} from '@/constants/Colors';

interface AppBarProps {
    title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: Colors.light.PRIMARY,
        paddingHorizontal: 16,
    },
    title: {
        color: Colors.light.WHITE,
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default AppBar;
