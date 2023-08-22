import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { formatBalance } from '@polkadot/util';
import type { Transaction } from '@chainsafe/metamask-polkadot-types';
import { shortAddress } from '../../services/format';

export interface TransactionTableProps {
  txs: Transaction[];
}

export const TransactionTable = (props: TransactionTableProps): React.JSX.Element => {
  return (
    <TableContainer className="transtaction-table" component={Paper}>
      <Table aria-label="simple table">
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
          {props.txs.map((tx) => (
            <TableRow key={tx.hash}>
              <TableCell align="left" component="th" scope="row">
                {tx.hash}
              </TableCell>
              <TableCell align="center" component="th" scope="row">
                {tx.block}
              </TableCell>
              <TableCell align="center">{shortAddress(tx.sender)}</TableCell>
              <TableCell align="center">{shortAddress(tx.destination)}</TableCell>
              <TableCell align="center">
                {formatBalance(tx.amount, {
                  decimals: 12,
                  withSi: true,
                  withUnit: 'KSM'
                })}
              </TableCell>
              <TableCell align="center">
                {formatBalance(tx.fee, {
                  decimals: 12,
                  withSi: true,
                  withUnit: 'KSM'
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
