import { connectDB } from "@/lib/mongodb";
import { IOrderProps, order2shipment } from "@/utils/order";

const {
  // MODE,
  DB_SYNC_ENABLED,
  DB_SYNC_START_DATE,
  DB_SYNC_START_TIME,
  DB_SYNC_END_DATE,
  DB_SYNC_END_TIME,
  DB_SYNC_START_PAGE,
  DB_SYNC_RESULT_PER_PAGE,
  CHECKOUT_CHAMP_USERNAME,
  CHECKOUT_CHAMP_PASSWORD,
} = process.env;

const raw = "";
const now = new Date();
const estNow = now.toLocaleString("en-US", {
  timeZone: "America/New_York",
});
const END_DATE =
  DB_SYNC_END_DATE ||
  now.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
  });
const END_TIME =
  DB_SYNC_END_TIME ||
  now.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
  });

const START_DATE = DB_SYNC_START_DATE || "01/01/2025";
const START_TIME = DB_SYNC_START_TIME || "00:00:00";

const RESULTS_PER_PAGE = Number(DB_SYNC_RESULT_PER_PAGE) || 200;

// console.log("START_DATE:", START_DATE);
// console.log("START_TIME:", START_TIME);
// console.log("END_DATE:", END_DATE);
// console.log("END_TIME:", END_TIME);
// console.log("RESULTS_PER_PAGE:", RESULTS_PER_PAGE);
// console.log("PASSWORD:", CHECKOUT_CHAMP_PASSWORD);

const requestOptions = {
  method: "POST",
  body: raw,
  redirect: "follow" as RequestRedirect,
};

let page = Number(DB_SYNC_START_PAGE) || 1;

// Define the task you want to run
const task = async () => {
  try {
    console.log(`Page: ${page}`);
    // console.log("CHECKOUT_URL: ", CHECKOUT_URL);

    const CHECKOUT_URL = `https://api.checkoutchamp.com/order/query/?loginId=${encodeURIComponent(
      CHECKOUT_CHAMP_USERNAME || ""
    )}&password=${encodeURIComponent(
      CHECKOUT_CHAMP_PASSWORD || ""
    )}&startDate=${encodeURIComponent(
      START_DATE
    )}&startTime=${encodeURIComponent(START_TIME)}&endDate=${encodeURIComponent(
      END_DATE
    )}&endTime=${encodeURIComponent(
      END_TIME
    )}&resultsPerPage=${RESULTS_PER_PAGE}&sortBy=dateCreated&sortDir=1&page=${page}&orderType=NEW_SALE&orderStatus=COMPLETE`;

    // console.log(CHECKOUT_URL);

    // const CHECKOUT_URL = `https://api.checkoutchamp.com/order/query/?loginId=${CHECKOUT_CHAMP_USERNAME}&password=${CHECKOUT_CHAMP_PASSWORD}&startDate=${START_DATE}&startTime=${START_TIME}&endDate=${END_DATE}&endTime=${END_TIME}&resultsPerPage=${RESULTS_PER_PAGE}&sortBy=dateCreated&sortDir=1&page=${page}&orderType=NEW_SALE&orderStatus=COMPLETE`;

    let totalResults = 9999999999;
    await fetch(CHECKOUT_URL, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result.result === "ERROR") {
          console.log(result?.message || "Error while loding orders from API");
          return;
        }
        const orders: IOrderProps[] = result.message.data;

        for (const order of orders) {
          await order2shipment(order);
        }

        totalResults = result.message.totalResults;
      })
      // .catch((error) => console.log("error", error));
      .catch(() => {});

    if (RESULTS_PER_PAGE * page >= totalResults) {
      console.log(`Sync Ended: ${totalResults} in total`);
      return true;
    }

    return false;
  } catch (error) {
    console.log((error as Error).message || "Failed to load orders");
  }
};

const syncDB = async () => {
  await connectDB();

  console.log(
    `${estNow}: Searching new orders from ${START_DATE} ${START_TIME} to ${END_DATE} ${END_TIME}`
  );

  page = 1;
  while (true) {
    const result = await task();
    if (result) break;

    page++;
  }
};

if (DB_SYNC_ENABLED && DB_SYNC_ENABLED === "true") {
  // Schedule the task to run every 5 minute
  console.log(
    `${estNow}: Searching new orders from ${START_DATE} ${START_TIME} to ${END_DATE} ${END_TIME}`
  );
  syncDB();
}
