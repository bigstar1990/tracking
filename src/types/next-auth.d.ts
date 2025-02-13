import { UserDocument } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: UserDocument;
  }
  type AdapterUser = UserDocument;
  type User = UserDocument;
}
