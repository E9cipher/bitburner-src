import { Player } from "@player";
import React, { useEffect } from "react";
import { Exploit } from "../../Exploits/Exploit";
import { Page } from "../../ui/Router";
import { Router } from "../../ui/GameRoot";
export function TheVoid(): React.ReactElement {
    useEffect(() => {
        Player.giveExploit(Exploit.TheVoid);
        const baseDelay = 5000; // 5s
        setTimeout(() => Router.toPage(Page.City), (baseDelay + (baseDelay * Math.random()))); // baseDelay plus up to another baseDelay of random extra time
    }, []);
    /* <Typography>
            <CorruptibleText content={"You stand before what seems to be... nothing? A shiver runs down your spine and transports you back to where you belong."} spoiler={false} />
        </Typography> */
    return <></>;
}