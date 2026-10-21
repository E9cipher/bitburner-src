/**
 * React Component for the first part of a gang member details.
 * Contains skills and exp.
 */
import React from "react";
import { useGang } from "./Context";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

import { formatMultiplier, formatRespect, formatWanted } from "../../ui/formatNumber";
import { GangMember } from "../GangMember";
import { Settings } from "../../Settings/Settings";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { StatsRow } from "../../ui/React/StatsRow";
import { useStyles } from "../../ui/React/CharacterOverview";
import { getKeyFromReactElements } from "../../utils/StringHelperFunctions";

interface IProps {
  member: GangMember;
}

export function GangMemberStats(props: IProps): React.ReactElement {
  const { classes } = useStyles();

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.ascensionPoints.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.ascensionPoints.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.ascensionPoints.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.ascensionPoints.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.ascensionPoints.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.ascensionPoints.cha_asc_points),
  };

  const gang = useGang();
  const data = [
    [`Money:`, <MoneyRate key="money" money={5 * props.member.calculateMoneyGain(gang)} />],
    [`Respect:`, `${formatRespect(5 * props.member.calculateRespectGain(gang))} / sec`],
    [`Wanted Level:`, `${formatWanted(5 * props.member.calculateWantedLevelGain(gang))} / sec`],
    [`Total Respect:`, `${formatRespect(props.member.earnedRespect)}`],
  ];

  return (
    <>
      <Tooltip
        title={
          <Typography>
            Hk: x{formatMultiplier(props.member.statsMults.hack_mult * asc.hack)}(x
            {formatMultiplier(props.member.statsMults.hack_mult)} Eq, x{formatMultiplier(asc.hack)} Asc)
            <br />
            St: x{formatMultiplier(props.member.statsMults.str_mult * asc.str)}
            (x{formatMultiplier(props.member.statsMults.str_mult)} Eq, x{formatMultiplier(asc.str)} Asc)
            <br />
            Df: x{formatMultiplier(props.member.statsMults.def_mult * asc.def)}
            (x{formatMultiplier(props.member.statsMults.def_mult)} Eq, x{formatMultiplier(asc.def)} Asc)
            <br />
            Dx: x{formatMultiplier(props.member.statsMults.dex_mult * asc.dex)}
            (x{formatMultiplier(props.member.statsMults.dex_mult)} Eq, x{formatMultiplier(asc.dex)} Asc)
            <br />
            Ag: x{formatMultiplier(props.member.statsMults.agi_mult * asc.agi)}
            (x{formatMultiplier(props.member.statsMults.agi_mult)} Eq, x{formatMultiplier(asc.agi)} Asc)
            <br />
            Ch: x{formatMultiplier(props.member.statsMults.cha_mult * asc.cha)}
            (x{formatMultiplier(props.member.statsMults.cha_mult)} Eq, x{formatMultiplier(asc.cha)} Asc)
          </Typography>
        }
      >
        <Table sx={{ display: "table", mb: 1, width: "100%" }}>
          <TableBody>
            <StatsRow
              name="Hacking"
              color={Settings.theme.hack}
              data={{ level: props.member.stats.hack, exp: props.member.statsExp.hack_exp }}
            />
            <StatsRow
              name="Strength"
              color={Settings.theme.combat}
              data={{ level: props.member.stats.str, exp: props.member.statsExp.str_exp }}
            />
            <StatsRow
              name="Defense"
              color={Settings.theme.combat}
              data={{ level: props.member.stats.def, exp: props.member.statsExp.def_exp }}
            />
            <StatsRow
              name="Dexterity"
              color={Settings.theme.combat}
              data={{ level: props.member.stats.dex, exp: props.member.statsExp.dex_exp }}
            />
            <StatsRow
              name="Agility"
              color={Settings.theme.combat}
              data={{ level: props.member.stats.agi, exp: props.member.statsExp.agi_exp }}
            />
            <StatsRow
              name="Charisma"
              color={Settings.theme.cha}
              data={{ level: props.member.stats.cha, exp: props.member.statsExp.cha_exp }}
            />
            <TableRow>
              <TableCell classes={{ root: classes.cellNone }}>
                <br />
              </TableCell>
            </TableRow>
            {data.map(([a, b]) => (
              <TableRow key={getKeyFromReactElements(a, b)}>
                <TableCell classes={{ root: classes.cellNone }}>
                  <Typography>{a}</Typography>
                </TableCell>
                <TableCell align="right" classes={{ root: classes.cellNone }}>
                  <Typography>{b}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Tooltip>
    </>
  );
}
