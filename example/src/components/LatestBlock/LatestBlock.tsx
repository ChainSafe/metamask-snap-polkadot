import React, {useEffect, useState} from "react";
import {getLatestBlock} from "../../services/block";
import { Card, CardContent, CardHeader, Grid} from "@material-ui/core";

export const LatestBlock = () => {
    let [latestBlock, setLatestBlock] = useState("");

    useEffect(() => {
        (async () => setLatestBlock(await getLatestBlock()))();
    });

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
                        <pre>{latestBlock}</pre>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};