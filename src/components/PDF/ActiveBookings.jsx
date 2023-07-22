import React from 'react';
import { format, parseISO } from 'date-fns';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const ActiveBookings = ({bookings}) => {

  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        marginTop: "20px",
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        padding: '0px 10px 0 10px',
        fontSize: '12px'
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '10px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '900',
      color: '#047857',
    },
    date: {
      fontSize: '14px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1px solid #000',
      borderLeft: '1px solid #000'
    },
    tableHeader: {
      backgroundColor: '#047857',
      color: '#fff',
      fontWeight: 'bold',
    },
    tableHeaderCell: {
        width: '40%',
        padding: '12px',
        borderRightColor: "#000",
        borderRightWidth: 1,
    },
    tableHeaderCellHour: {
      width: '20%',
      padding: '12px',
      borderRightColor: "#000",
      borderRightWidth: 1,
  },
    tableCell: {
      padding: '12px',
      borderRight: '1px solid #000',
      display: 'grid',
      alignItems: 'center',
      width: '25%',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    },
    tableCellHour: {
      padding: '12px',
      borderRight: '1px solid #000',
      display: 'grid',
      alignItems: 'center',
      width: '12.5%',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    },
    text: {
      overflowWrap: 'break-word',
      wordBreak: 'break-normal'
    }
  });

  return (
    <>
      <Document>
        <Page>  
          <View style={styles.titleContainer}>
                <Text style={styles.title}>Citas Pendientes</Text>
                <Text style={styles.date}>
  {bookings.length > 0 ? format(parseISO(bookings[0].dateHour), 'dd/MM/yyyy') : 'Sin fecha'}
</Text>        </View>
          <View style={styles.container}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableHeaderCell, styles.tableHeader]}>
                    <Text>Documento</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.tableHeader]}>
                    <Text>Nombre</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.tableHeader]}>
                    <Text>Apellido</Text>
                  </View>
    
                  <View style={[styles.tableHeaderCell, styles.tableHeader]}>
                    <Text>Motivo</Text>
                  </View>
                  <View style={[styles.tableHeaderCellHour, styles.tableHeader]}>
                    <Text>Hora</Text>
                  </View>
                </View>
                {bookings.map((booking) => (
                <View style={styles.tableRow} key={booking._id}>
                  <View style={styles.tableCell}>
                    <Text>{booking.Type}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{booking.userName}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{booking.userlastName}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{booking.Motive}</Text>
                  </View>
                  <View style={styles.tableCellHour}>
                  <Text>{format(parseISO(booking.dateHour), 'HH:mm')}</Text>                  </View>
                </View>
                ))}
              </View>
            </View>
        </Page>
      </Document>
    </>
  );
};

export default ActiveBookings;
