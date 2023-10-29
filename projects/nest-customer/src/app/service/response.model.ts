export interface IResponse {
  code?: string;
  message?: string;
  response?: any;
  params?: string[];
}

export class Response implements IResponse {
  constructor(public code?: string, public message?: string, public response?: string, public params?: string[]) {}
}
