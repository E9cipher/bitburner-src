/**
 * React Subcomponent for displaying the void's UI
 *
 * This subcomponent renders all the void's content
 */
import React from "react";
import { CorruptibleText } from "../../ui/React/CorruptibleText";
import { Typography } from "@mui/material";

const TheVoid = () => {
    return (
        <Typography>
            <CorruptibleText content={"You stand... nowhere? You have a strange feeling from this place, as it emits pure nothing"} spoiler={false} />
        </Typography>
    )
}

export { TheVoid };