import React from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import type { BlockInfo } from '@chainsafe/metamask-polkadot-types';

export const LatestBlock = (props: { block: BlockInfo }): React.JSX.Element => {
  return (
    <Card style={{ margin: '1rem 0' }}>
      <CardHeader title="Latest block" />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h6">Block number:</Typography>
            <Typography variant="subtitle2">{props.block.number}</Typography>
            <Divider light />
            <Box style={{ margin: '0.5rem' }} />
            <Typography variant="h6">Hash:</Typography>
            <Typography variant="subtitle2">{props.block.hash}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
