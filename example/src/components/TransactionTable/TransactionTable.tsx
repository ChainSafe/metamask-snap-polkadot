import React, {useEffect, useState} from "react";
import {Paper, Table, TableContainer, TableCell,
    TableRow, TableHead, TableBody} from '@material-ui/core/';
import {getAllTransactions} from "../../services/transactions";
import {shortAddress} from "../../services/format";

interface Transaction {
    type: string;
    id: string;
    attributes: {
        "block_id": number;
        value: number,
        fee: number,
        sender: {
            type: string;
            attributes: {
                address: string;
            }
        };
        destination: {
            attributes: {
                address: string;
            }
        }
    }
}

export const TransactionTable = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(()=>{
        
        (async () => {
            setTransactions(await getAllTransactions("Dc6ouAsLFYLF7kCfAbW6j6kVN1FvoKcyAuTr1NCKmU2c8mk"));
            console.log(transactions);
        })();
    });

    return (
        <TableContainer className="transtaction-table" component={Paper}>
            <Table 
            aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Transaction id</TableCell>
                    <TableCell align="center">Block</TableCell>
                    <TableCell align="center">Sender</TableCell>
                    <TableCell align="center">Destination</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Fee</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {transactions.map(tx => (
                    <TableRow key={tx.id}>
                    <TableCell  align="left" component="th" scope="row">
                        {tx.id}
                    </TableCell>
                    <TableCell  align="center" component="th" scope="row">
                        {tx.attributes.block_id}
                    </TableCell>
                    <TableCell align="center">{shortAddress(tx.attributes.sender.attributes.address)}</TableCell>
                    <TableCell align="center">{shortAddress(tx.attributes.destination.attributes.address)}</TableCell>
                    <TableCell align="center">{tx.attributes.value} KSM</TableCell>
                    <TableCell align="center">{tx.attributes.fee} KSM</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}