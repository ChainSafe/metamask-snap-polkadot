import React, {useEffect, useState} from "react";
import {Paper, Table, TableContainer, TableCell,
    TableRow, TableHead, TableBody} from '@material-ui/core/';
import {getAllTransactions} from "../../services/transactions";

export const TransactionTable = () => {

    const [transactions, setTransactions] = useState();

    function createData(id: string, from: string, to: string, amount: number, token: string) {
        return { id, from, to, amount, token };
      }
    const rows = [
        createData('21341', "0XDC25EF3F5B8A...", "0XDC25EF3F5B8A...", 0.34, "ETH"),
        createData('67893', "0XDC25EF3F5B8A...", "0XDC25EF3F5B8A...", 0.11, "ETH"),
        createData('34673', "0XDC25EF3F5B8A...", "0XDC25EF3F5B8A...", 0.09, "ETH"),
        createData('08763', "0XDC25EF3F5B8A...", "0XDC25EF3F5B8A...", 0.46, "ETH"),
        createData('12309', "0XDC25EF3F5B8A...", "0XDC25EF3F5B8A...", 1.39, "ETH"),
      ];
    
    

    useEffect(()=>{
        
        (async () => {
            setTransactions(await getAllTransactions());
            console.log(transactions);
        })();
    },[])

    return (
        <TableContainer className="transtaction-table" component={Paper}>
            <Table 
            aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Transaction id</TableCell>
                    <TableCell align="right">from adress</TableCell>
                    <TableCell align="right">to adress</TableCell>
                    <TableCell align="right">amount</TableCell>
                    <TableCell align="right">token</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map(row => (
                    <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                        {row.id}
                    </TableCell>
                    <TableCell align="right">{row.from}</TableCell>
                    <TableCell align="right">{row.to}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.token}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}