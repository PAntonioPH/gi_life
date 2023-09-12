import type {NextApiRequest, NextApiResponse} from 'next'
import {conn} from "@/utils/database";
import {message} from "@/utils/functions";

const ping = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await conn.query("SELECT NOW()")

  return res.status(200).json(message("Pong", response.rows[0].now))
}

export default ping