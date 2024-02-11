export type Task = {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  active: boolean;
};
