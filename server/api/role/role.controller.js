import { wrapAsync } from "../../services";
import { tableNames } from '../../../config/constant';

let db; 
export const initDbConnection = (dbConnection) => { db = dbConnection };
export const index = wrapAsync(async (req, res) => {
  let result = db(`${tableNames.MASTER_ROLE}`)
    .select('*')

  return result;
})