import { type User } from "@models/tables";

export type Friend = {
  friend: User;
  date: string;
}

export type FriendsOutletContext = {
  friendsList: Friend[];
  incomingRequests: User[];
  outgoingRequests: User[];
}