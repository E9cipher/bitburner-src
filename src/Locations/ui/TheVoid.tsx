/**
 * React Subcomponent for displaying the void's UI
 *
 * This subcomponent renders all the void's content
 */
import React from "react";
import { CorruptibleText } from "../../ui/React/CorruptibleText";
import { Button, Typography } from "@mui/material";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

const TheVoid = () => {
  const shouldShowSpolierPage = true;
  const SpoilerContainer = () => {
    const msg = "This is an example message showing the use of the alert.";
    return (
      <>
        <Typography>You have the following contents avaliable:</Typography>
        <Button onClick={() => dialogBoxCreate(msg)} disabled={false}>
          Test button
        </Button>
      </>
    );
  };

  return (
    <>
      {shouldShowSpolierPage ? (
        <SpoilerContainer />
      ) : (
        <Typography>
          <CorruptibleText
            content={"You stand... nowhere? You have a strange feeling from this place, as it emits pure nothing"}
            spoiler={false}
          />
        </Typography>
      )}
    </>
  );
};

export { TheVoid };
