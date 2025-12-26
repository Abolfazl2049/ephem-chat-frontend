import { useMyUser } from "@/features/user";

class Enclave {
  id: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.expiresAt = init.expiresAt;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
  }
}

class Dispatch {
  id: string;
  content: string;
  enclaveId: string;
  createdAt: string;
  senderName: string;
  constructor(init: Record<string, any>, userName?: string) {
    this.id = init.id;
    this.content = init.content;
    this.enclaveId = init.enclaveId;
    this.createdAt = init.createdAt;
    this.senderName = init.User?.name || userName;
  }
}

export { Enclave, Dispatch };
