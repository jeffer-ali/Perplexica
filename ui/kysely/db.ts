import { FetchDriver } from "./fetch-driver";
import superjson from 'superjson';
import { DB } from "./types";
import { Kysely, PostgresQueryCompiler, PostgresAdapter, PostgresIntrospector } from "kysely";
import getHost from '@/lib/utils/getHost';

//something that can handle sending/recieving Date and bigint etc.
const transformer = {
  serialize: (value: any) => {
    return superjson.stringify(value)
  },
  deserialize: (str: string) => {
    return superjson.parse(str)
  },
};

const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createIntrospector: (db: any) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
    createDriver: () => {
      return new FetchDriver({
        transformer: transformer,
        url: `${getHost()}/api/db`,
        init: {
          headers: {
            Authorization: "Basic YWRtaW46YWR",
          },
        },
      });
    },
  },
});

export default db