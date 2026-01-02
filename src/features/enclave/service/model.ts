class Enclave {
  id: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  logs: EnclaveLog[];
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.expiresAt = init.expiresAt;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
    this.logs = init.logs || [];
  }
}

class EnclaveLog {
  createdAt: string;
  description: string;
  constructor(init: Record<string, any>) {
    this.createdAt = init.createdAt;
    this.description = init.description;
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

export { Enclave, Dispatch, EnclaveLog };
