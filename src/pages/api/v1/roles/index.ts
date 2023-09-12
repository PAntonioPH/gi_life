import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {message} from "@/utils/functions";

const roles = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method} = req

  let response

  switch (method) {
    case "GET":
      try {
        response = await conn.query("SELECT * FROM roles;")

        return res.status(200).json(message("Roles consultados", response.rows))
      }
      catch (e) {
        return res.status(500).json(message("Error, al consultar los roles"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default roles