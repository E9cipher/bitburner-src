import { Settings } from "../Settings/Settings";
import { isValidRFAHostname, isValidRFAPort } from "../Settings/SettingsUtils";
import { Remote } from "./Remote";

let server: Remote | undefined;

export function canCreateNewRFAConnection(): boolean {
  return isValidRFAHostname(Settings.RFAAddress).success && isValidRFAPort(Settings.RFAPort).success;
}

export function newRFAConnection(): void {
  closeRFAConnection();
  if (!canCreateNewRFAConnection()) {
    return;
  }
  server = new Remote(Settings.RFAAddress, Settings.RFAPort);
  server.startConnection();
}

export function closeRFAConnection(): void {
  if (!server) {
    return;
  }
  server.stopConnection();
}

export function isRFAConnectionLive(): boolean {
  return server !== undefined && server.connection !== undefined && server.connection.readyState === 1;
}

export function getRFAConnectionStatus(): "Online" | "Offline" | "Reconnecting" | "Connecting" {
  if (isRFAConnectionLive()) {
    return "Online";
  }
  if (server?.reconnecting) {
    return "Reconnecting";
  }
  if (server?.connection?.readyState === 0) {
    return "Connecting";
  }
  return "Offline";
}
