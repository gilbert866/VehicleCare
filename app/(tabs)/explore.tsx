import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppBar from '../../components/AppBar/AppBar';
import Colors from '../../constants/colors';

const ExploreScreen = () => {
    return (
        <View style={styles.container}>
            <AppBar title="Explore" />
            <View style={styles.body}>
                <Text style={styles.text}>Explore nearby repair shops and services.</Text>
            </View>
        </View>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    body: {
        padding: 20,
    },
    text: {
        fontSize: 18,
        color: Colors.TEXT,
    },
});
