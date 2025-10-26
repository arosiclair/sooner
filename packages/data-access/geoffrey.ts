
import {Collection, Db, MongoClient} from "mongodb";

if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL is not defined')
if (!process.env.MONGODB_NAME) throw new Error('MONGODB_NAME is not defined')

let geoffrey: Db | undefined;

(async function connect () {
  const numRetries = 10;
  const delaySecs = 60;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  let client: MongoClient | undefined;

  for (let i = 0; i < numRetries; i++) {
    console.log('[geoffrey] attempting connection...');
    try {
      client = new MongoClient(process.env.MONGODB_URL ?? '');
      break
    } catch (error) {
      console.warn('[geoffrey] failed to connect', error)
      console.log(`[geoffrey] waiting ${delaySecs} seconds before retrying...`)
      await delay(delaySecs * 1000)
    }
  }

  if (!client) {
    throw new Error(`[geoffrey] failed to connect after ${numRetries} retries`);
  }

  geoffrey = client.db(process.env.MONGODB_NAME);
  console.log('[geoffrey] connected successfully');
})()

const getUsers = () => geoffrey?.collection('users') as Collection
const getSessions = () => geoffrey?.collection('sessions') as Collection
const getLists = () => geoffrey?.collection('lists') as Collection
const getResetRequests = () => geoffrey?.collection('resetRequests') as Collection
const getPushSubcriptions = () => geoffrey?.collection('pushSubscriptions') as Collection
const getFavicons = () => geoffrey?.collection('favicons') as Collection
const getFaviconOverrides = () => geoffrey?.collection('faviconOverrides') as Collection

export default {
  getUsers,
  getSessions,
  getLists,
  getResetRequests,
  getPushSubcriptions,
  getFavicons,
  getFaviconOverrides
}