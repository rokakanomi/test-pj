import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncSchedulesJob {
  // TODO: 各サービスのスケジュールを定期的に同期するバッチ処理
  async handle() {
    // 各APIクライアントを呼び出して統一フォーマットで同期
  }
}
