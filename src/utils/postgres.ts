import {get_fecha, get_hora} from "@/utils/functions";

export const query_insert = (body: object, tabla: string) => {
  const llaves_body = Object.keys(body);
  const values_body = Object.values(body);

  llaves_body.push("date_update")
  llaves_body.push("time_update")
  values_body.push(get_fecha())
  values_body.push(get_hora())

  let query = `INSERT into ${tabla} ( `;
  let values = "( ";

  for (let i = 0; i < llaves_body.length; i++) {
    if (llaves_body[i] !== "token_acceso" && values_body[i] !== "") {
      query += ` "${llaves_body[i].replaceAll("'", "")}"${i !== llaves_body.length - 1 ? "," : " )"} `;
      values += llaves_body[i] === "password" ? ` PGP_SYM_ENCRYPT('${values_body[i]}', 'AES_KEY')${i !== llaves_body.length - 1 ? "," : " )"} ` : ` '${values_body[i]}'${i !== llaves_body.length - 1 ? "," : " )"} `;
    }
  }

  query += `Values ${values}  RETURNING * ;`;

  return query;
};

export const query_insert_multiple = (bodys: Array<object>, tabla: string) => {
  let query = `INSERT into ${tabla} ( `;

  bodys.forEach((body: object, index) => {
    const llaves_body = Object.keys(body);
    const values_body = Object.values(body);

    llaves_body.push("date_update")
    llaves_body.push("time_update")
    values_body.push(get_fecha())
    values_body.push(get_hora())

    let values = "( ";

    for (let i = 0; i < llaves_body.length; i++) {
      if (llaves_body[i] !== "token_acceso" && values_body[i] !== "") {
        query += index === 0 ? `${llaves_body[i]}${i !== llaves_body.length - 1 ? "," : " ) "}` : "";
        values += llaves_body[i] === "password" ? ` PGP_SYM_ENCRYPT('${values_body[i]}', 'AES_KEY')${i !== llaves_body.length - 1 ? "," : " )"} ` : ` '${values_body[i]}'${i !== llaves_body.length - 1 ? "," : " )"} `;
      }
    }

    query += `${index === 0 ? "Values" : ","} ${values} `;
  })

  return query += " RETURNING * ;";
};

export const query_update = (body: object, where: object, table: string) => {
  const llaves_body = Object.keys(body);
  const values_body = Object.values(body);

  const llaves_where = Object.keys(where);
  const values_where = Object.values(where);

  llaves_body.push("date_update")
  llaves_body.push("time_update")
  values_body.push(get_fecha())
  values_body.push(get_hora())

  let query = `UPDATE ${table}
               SET `;
  let query_where = " Where ";

  for (let i = 0; i < llaves_body.length; i++) query += values_body[i] !== "" ? llaves_body[i] === "password" ? `  "${llaves_body[i].replaceAll("'", "")}" = PGP_SYM_ENCRYPT('${values_body[i]}', 'AES_KEY')${i !== llaves_body.length - 1 ? "," : " )"} ` : ` "${llaves_body[i].replaceAll("'", "")}" = '${values_body[i]}'${i !== llaves_body.length - 1 ? "," : ""} ` : ``
  for (let i = 0; i < llaves_where.length; i++) query_where += ` ${llaves_where[i]} = '${values_where[i]}'${i !== llaves_where.length - 1 ? "," : " RETURNING * ;"} `

  query += query_where;

  return query.replace(/'data_null'/g, "null");
};

export const query_update_multiple = (bodys: Array<object>, rows: Array<string>, where: object, table: string) => {
  let query = `UPDATE ${table}
               SET `

  const bodys_id = bodys.map((item: any) => item.id)
  let bodys_update: Array<{ name: string, value: any }> = []

  for (let i = 0; i < rows.length; i++) bodys_update = [...bodys_update, {name: rows[i], value: bodys.map((item: any) => item[rows[i]])}]


  for (let i = 0; i < rows.length; i++) {
    query += ` ${bodys_update[i].name} = CASE `
    for (let j = 0; j < bodys_id.length; j++) query += ` WHEN id = ${bodys_id[j]} THEN '${bodys_update[i].value[j]}' `
    query += `ELSE ${bodys_update[i].name} END ${i !== rows.length - 1 ? "," : ""} `
  }

  const llaves_where = Object.keys(where);
  const values_where = Object.values(where);

  query += ` WHERE `

  for (let i = 0; i < llaves_where.length; i++) query += ` ${llaves_where[i]} = '${values_where[i]}'${i !== llaves_where.length - 1 ? "," : " RETURNING * ;"} `;

  return query.replace(/'data_null'/g, "null");
}