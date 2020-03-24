import React, {useState} from "react";
import {Container, Button, Typography, Grid, Paper, Table, TableContainer, TableCell, TableRow, TableHead, TableBody, Hidden, TextField} from '@material-ui/core/';
import {Transfer} from "../../components/Transfer";
export const Dashboard = () => {
    const [connected, setConnected]=useState<boolean>(false);

    // TEMP
    function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
        return { name, calories, fat, carbs, protein };
      }
    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
      ];

    return (
        // TODO - breakpoints
        <Container maxWidth="md" >
            
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2">
                        Metamask - Polkadot Snap
                    </Typography>
                </Grid>
                <Hidden xsUp={connected}>
                    <Grid item xs={12}>
                        <Button onClick={() => setConnected(true)} color="primary">Connect</Button>
                    </Grid>
                </Hidden>
                <Hidden xsUp={!connected}>
                    <Grid container xs={12}>
                        <Grid item xs={6}>
                            <Paper>
                                <Typography variant="h4">TRANSFER</Typography>
                                <Typography variant="h6">TO ADRESS</Typography>
                                <TextField></TextField>
                                <Typography variant="h6">AMOUNT</Typography>
                                <TextField></TextField>
                                <Button>SEND</Button>
                            </Paper>
                        </Grid>
                        <Grid container direction="column" alignItems="center" item xs={6}>
                            <Paper>
                                <Button color="secondary">Export private key</Button>
                            </Paper>
                            <Paper>
                                <Typography variant="h4">SIGN CUSTOM MESSAGE</Typography>
                                <TextField></TextField>
                            </Paper>
                        
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Grid container direction="column" alignItems="center">
                                <Typography variant="h6">PUBLIC ADRESS</Typography>
                                <Typography variant="h6">0XDC25EF3F5B8A186998338A2ADA83795FBA2﻿D695E</Typography>
                            </Grid>
                            <Grid container justify="space-between">
                                <Typography variant="h6">ACCOUNT TRANSACTIONS</Typography>
                                <Typography variant="h6">ACCOUNT BALANCE: 22.14334590087</Typography>
                            </Grid>
                            {/* DEMO TABLE - TODO COMPONENT */}
                            <TableContainer component={Paper}>
                                <Table 
                                // className={classes.table} 
                                aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Dessert (100g serving)</TableCell>
                                        <TableCell align="right">Calories</TableCell>
                                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Hidden>
                
            </Grid>
        </Container>
    );
}