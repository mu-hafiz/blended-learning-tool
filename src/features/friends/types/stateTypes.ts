import { type User } from "@models/tables";

export type Friend = {
  friend: User;
  date: string;
}

export type Incoming = {
  sender: User;
  ignored: boolean;
}

export type FriendsOutletContext = {
  friendsList: Friend[];
  incomingRequests: Incoming[];
  outgoingRequests: User[];
  combinedUserIds: string[];
  ignoredUsers: User[];
}