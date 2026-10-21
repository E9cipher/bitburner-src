/**
 * React Component for left side of the gang member accordion, contains the
 * description of the task that member is currently doing.
 */
import React from "react";
import { IGangMemberTasks } from "../GangMemberTasks";
import { GangMember } from "../GangMember";
import Typography from "@mui/material/Typography";

interface IProps {
  member: GangMember;
}

export function TaskDescription(props: IProps): React.ReactElement {
  const task = IGangMemberTasks[props.member.taskName];
  const desc = task ? task.desc : IGangMemberTasks.Unassigned.desc;

  return <Typography dangerouslySetInnerHTML={{ __html: desc }} />;
}
