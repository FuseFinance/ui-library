export interface IHttpErrorData {
  message?: string;
  [key: string]: any;
}

export interface IHttpSdk {
  get<T>(_url: string, _headers?: Record<string, string>): Promise<T>;
  post<T>(_url: string, _body?: Record<string, any>, _headers?: Record<string, string>): Promise<T>;
  put<T>(_url: string, _body?: Record<string, any>, _headers?: Record<string, string>): Promise<T>;
  patch<T>(
    _url: string,
    _body?: Record<string, any>,
    _headers?: Record<string, string>,
  ): Promise<T>;
  delete<T>(_url: string, _headers?: Record<string, string>): Promise<T>;
}
