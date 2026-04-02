import { MockAdapter } from "@/lib/adapters/mockAdapter";

export class CodexAdapter extends MockAdapter {
  override async getTasks(filter?: Parameters<MockAdapter["getTasks"]>[0]) {
    return super.getTasks(filter);
  }
}
