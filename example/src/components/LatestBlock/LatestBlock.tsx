import {useEffect, useState} from "react";
import {getBalance} from "../../services/account";
import {getLatestBlock} from "../../services/block";

export const LatestBlock = () => {
    let [latestBlock, setLatestBlock] = useState("");

    useEffect(() => {
        // fetch balance every 3 second
        const interval = setInterval(async () => {
            setLatestBlock(await getLatestBlock())
        }, 3000);
        return function cleanup() {
            if (interval) {
                clearInterval(interval)
            }
        };
    }, []);
}