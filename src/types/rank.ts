export interface RankUser {
  accountId: number;
  username: string;
  points: number;
}

export type RankListResponse = RankUser[]; 