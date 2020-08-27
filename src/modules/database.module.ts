import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { MongoClient } from 'mongodb';
import { Container } from 'typedi';
import { DataBaseService } from '../app/services';
import { get } from 'config';


export const DatabaseModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const database: {
      host: string,
      port: number,
      name: string
    } = get("database");
    MongoClient.connect( `mongodb://${database.host}:${database.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) return console.log(err);
      Container.get(DataBaseService).DataBase = client.db(database.name);
    });
  }
};
