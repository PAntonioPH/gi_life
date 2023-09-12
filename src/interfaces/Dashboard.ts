export interface Dashboard {
  visitsDay: Array<{ visits: number, date: string }>,
  pageViews: Array<{ tittle: string, views: string }>,
  startDashboard: string
}