import { UserProfileData } from "./user-profile-data";

  export interface Chat {
    id: string;
    lastMessage?: string;
    lastMessageDate?: Date;
    userIds: string[];
    users: UserProfileData[];

    // not saved, only for display
    chatPic?: string;
    chatName?: string;
  }

  export interface Message {
    text: string;
    senderId: string;
    sentDate: Date;
  }

  