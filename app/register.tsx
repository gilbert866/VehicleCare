import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/common';

export default function VehicleRegistrationScreen() {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vehicle Registration</Text>
            <TextInput
                style={styles.input}
                placeholder="Make"
                value={make}
                onChangeText={setMake}
            />
            <TextInput
                style={styles.input}
                placeholder="Model"
                value={model}
                onChangeText={setModel}
            />
            <TextInput
                style={styles.input}
                placeholder="Year"
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={() => {/* handle registration */}}>
                <Text style={styles.buttonText}>Register Vehicle</Text>
            </TouchableOpacity>
        </View>
    );
}
