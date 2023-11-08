export interface Purchase {
  id: number,
  id_user: number,
  status: string,
  time_update: string,
  date_update: string,
  total: number
  username: string
  date_time_update?: string
}