import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity,ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';

const CoordinateList = ({ pastCoordinates, pinCoordinate }) => {
  const tableHead = ['Coordinate', 'Latitude', 'Longitude'];
 // Muodostetaan taulukon data
  const tableData = pastCoordinates.map((coordinate, index) => [
    (index + 1).toString(),
    coordinate.latitude.toFixed(6),
    coordinate.longitude.toFixed(6),
  ]);
 // Funktio painaessa riviä
  const handleRowPress = (coordinate) => {
    pinCoordinate(coordinate); 
  };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Past Coordinates</Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        {tableData.map((rowData, index) => (
          <TouchableOpacity key={index} onPress={() => handleRowPress(pastCoordinates[index])}>
            <Row
              data={rowData}
              style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
              textStyle={styles.text}
            />
          </TouchableOpacity>
        ))}
      </Table>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  rowEven: { height: 40, backgroundColor: '#FFF1C1' },
  rowOdd: { height: 40, backgroundColor: '#F7F6E7' },
  text: { textAlign: 'center' },
});

export default CoordinateList;
