import { assign } from 'lodash';

export class Context {
  private _headers: any = {};
  private _user: any = {};
  private _body: any = {};
  private _data: any = {};
  private _params: any = {};

  get data() {
    return this._data;
  }

  get user() {
    return this._user;
  }

  get body() {
    return this._body;
  }

  get headers() {
    return this._headers;
  }

  get params() {
    return this._params;
  }

  set user(value) {
    this._user = value;
  }

  constructor({ headers, user, body, params }: {
    headers?: any;
    params?: any;
    user?: any;
    body?: any;
  }) {
    assign(this, { _headers: headers, _user: user, _body: body, _params: params })
  }

  addData(value) {
    assign(this._data, value)
  }

  update(key: string, value: any) {
    if(!this[`_${key}`]) this[`_${key}`] = {};
    assign(this[`_${key}`], value);
  }

  remove(key: string, value: string) {
    delete this[`_${key}`][value];
  }

};
