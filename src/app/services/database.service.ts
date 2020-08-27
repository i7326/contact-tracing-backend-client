import { Service } from "typedi";
import { Db } from 'mongodb';

@Service()
export class DataBaseService {
  private _dataBase: DataBase;

  public set DataBase(value) {
    this._dataBase = value
  }

  public get DataBase(): DataBase {
    return this._dataBase;
  }
}
export type DataBase = Db | undefined;