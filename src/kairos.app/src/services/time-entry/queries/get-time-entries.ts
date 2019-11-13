export const getTimeEntriesQuery = `query ($year: Int!) {
  timeEntries(year: $year) {
    id
    when
    type
    job {
      id
      name
    }
  }
}`;
