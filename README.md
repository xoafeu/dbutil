# XOAF.EU/DB-Util

DB Util is dinamic SQL generator that lets you build SQL commands from code.

# Install and init
  - npm i --save @xoafeu/dbutil
  - initialize the db pool once (eg Context.js):

```javascript
import { pool, Executor } from "@xoaf/dbutil";

export let executor;

export function init() {
    executor = new Executor(pool.initPostGrePool({
        "host": "db",
        "port": 5432,
    	"database": "config",
    	"user": "config",
    	"password": "password"
    }), true); //use true to log all sql queries and stacktrace to stdout
}
```

## Examples

### Query for a list
```javascript

import { DataAdapter } from "@xoaf/dbutil";
import { executor } from "./Context";

const dataAdapter = new DataAdapter("employee", "id");

export function findEmployees(filters: { name: string }): Promise<[]> {
    let connection = await executor.openConnection(); //connections are pooled by default
    let queryBuilder = dataAdapter.findAll();
    queryBuilder.join("employer", "employee.employer = employer.id", "employer", "LEFT");

    //queryBuilder.get("id", "employee"); not needed, id field is implicit in all find operation
    queryBuilder.get("name", "employeee");
    queryBuilder.get("id", "employer", "employerId");
    queryBuilder.get("name", "employer", "employerName");

    if (!!filters.name) {
        queryBuilder.filter("name", filters.name, "employee");
    }

    return await executor.query(connection, queryBuilder);
}
```

### Query for a single
```javascript

import { DataAdapter } from "@xoaf/dbutil";
import { executor } from "./Context";

const dataAdapter = new DataAdapter("employee", "id");

export function findEmployee(id: number): Promise<Object> {
    let connection = await executor.openConnection();
    let queryBuilder = dataAdapter.findOne(id);
    queryBuilder.join("employer", "employee.employer = employer.id", "employer", "LEFT");

    //queryBuilder.get("id", "employee"); not needed, id field is implicit in all find operation
    queryBuilder.get("name", "employeee");
    queryBuilder.get("id", "employer", "employerId");
    queryBuilder.get("name", "employer", "employerName");

    return dataAdapter.returnFirstResult(await executor.query(connection, queryBuilder));
}
```


### Insert new record
```javascript

import { DataAdapter } from "@xoaf/dbutil";
import { executor } from "./Context";

const dataAdapter = new DataAdapter("employee", "id");

export function createEmployee(name: string): Promise<Object> {
    let connection = await executor.openConnection();

    let queryBuilder = dataAdapter.insert();
    queryBuilder.set("name", name);

    let result = await executor.query(connection, queryBuilder, true); //true keeps connection open
    let id = result[0]["id"];

    return this.findEmployee(connection, id);
}
```
