/**
 * React Subcomponent for displaying the void's UI
 *
 * This subcomponent renders all the void's content
 */
import React from "react";
import { CorruptibleText } from "../../ui/React/CorruptibleText";
import { Button, Typography } from "@mui/material";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Augmentations } from "src/Augmentation/Augmentations";
import { AugmentationName } from "@enums";

const TheVoid = () => {
  const shouldShowSpolierPage = true;
  interface voidRandomItem {
  name: string;
  chance: number;
} 
  const allItems = [
    { name: "Money", type: "money", amount: 2e6, chance: 0.4 },
    { name: "Augmentation", type: "aug", augsType: AugmentationName.NullishDopamine, chance: 0.2 },
    { name: "Augmentation", type: "aug", augsType: AugmentationName.QuantumManipulation, chance: 0.1 },
    { name: "Nothing", type: "nothing", amount: 1, chance: 0.3 },
  ];
  function spinChances(): voidRandomItem | undefined {
    const total = allItems.reduce((sum, item) => sum + item.chance, 0);
  const rand = Math.random() * total;

  let cumulative = 0;
  for (const item of allItems) {
    cumulative += item.chance;
    if (rand < cumulative) {
      return item;
    }
  }
  }
  const SpoilerContainer = () => {
    const msg = "This is an example message showing the use of the alert.";
    return (
      <>
        <Typography>You have the following contents avaliable:</Typography>
        <Button onClick={() => spinChances()} disabled={false}>
          Test button
        </Button>
        <Typography>
          {allItems.map((item, index) => (
            <Typography key={index}>
              {item.name} - Type: {item.type} - Chance: {item.chance}
            </Typography>
          ))}
        </Typography>
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
