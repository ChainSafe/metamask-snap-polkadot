import React, {useEffect, useState} from "react";
import {getLatestBlock} from "../../services/block";
import {Box, Card, CardContent, CardHeader, Divider, Grid, Typography} from "@material-ui/core";
import {BlockInfo} from "../../../../src/rpc/substrate/getBlock";

export const LatestBlock = () => {

    let [latestBlock, setLatestBlock] = useState<BlockInfo>({hash: "", number: ""});

    useEffect(() => {
        (async () => setLatestBlock(await getLatestBlock()))();
    }, []);

    // useEffect(() => {
    //     // fetch balance every 3 second
    //     const interval = setInterval(async () => {
    //         setLatestBlock(await getLatestBlock())
    //     }, 5000);
    //     return function cleanup() {
    //         if (interval) {
    //             clearInterval(interval)
    //         }
    //     };
    // }, []);

    return (
        <Card>
            <CardHeader title="Latest block"/>
            <CardContent>
                <Grid container alignItems="center">
                    <Grid item md={6} xs={12}>
                        <Typography variant="h6">Block number:</Typography>
                        <Typography variant="subtitle2">{latestBlock.number}</Typography>
                        <Divider light/>
                        <Box m={"0.5rem"}/>
                        <Typography variant="h6">Hash:</Typography>
                        <Typography variant="subtitle2">{latestBlock.hash}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};