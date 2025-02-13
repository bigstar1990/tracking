import cron from "node-cron";
import Shipment from "@/models/Shipment";
import { connectDB } from "@/lib/mongodb";
import { IOrderProps, order2shipment } from "@/utils/order";

const {
  MODE,
  DB_SYNC_ENABLED,
  DB_SYNC_RESULT_PER_PAGE,
  DB_SYNC_START_DATE,
  DB_SYNC_START_TIME,
  CRON_JOB_ORDER,
  CHECKOUT_CHAMP_USERNAME,
  CHECKOUT_CHAMP_PASSWORD,
} = process.env;

// Define the task you want to run
const task = async () => {
  try {
    console.log("Order Job starts");
    await connectDB();

    const raw = "";
    const latestShipment = await Shipment.findOne().sort({
      orderCreatedAt: -1,
    });

    const now = new Date();
    const estNow = now.toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    const END_DATE = now.toLocaleDateString("en-US", {
      timeZone: "America/New_York",
    });
    const END_TIME = now.toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
    });

    const START_DATE = latestShipment
      ? latestShipment.orderCreatedAt.toLocaleDateString("en-US", {
          timeZone: "America/New_York",
        })
      : DB_SYNC_START_DATE;
    const START_TIME = latestShipment
      ? latestShipment.orderCreatedAt.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
        })
      : DB_SYNC_START_TIME;

    const RESULTS_PER_PAGE = Number(DB_SYNC_RESULT_PER_PAGE) || 200;

    if (MODE !== "production") console.log(`Now: ${now}`);
    console.log(
      `${estNow}: Searching new orders from ${START_DATE} ${START_TIME} to ${END_DATE} ${END_TIME}`
    );

    const requestOptions = {
      method: "POST",
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

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
    )}&resultsPerPage=${RESULTS_PER_PAGE}&sortBy=dateCreated&sortDir=1&orderType=NEW_SALE&orderStatus=COMPLETE`;

    if (MODE !== "production") console.log("CHECKOUT_URL: ", CHECKOUT_URL);

    await fetch(CHECKOUT_URL, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result.result === "ERROR") {
          console.log(result?.message || "Error while loding orders from API");
          return;
        }
        const orders: IOrderProps[] = result.message.data;

        if (MODE !== "production") console.log(`Start saving shipments`);
        for (const order of orders) {
          await order2shipment(order);
        }
        if (MODE !== "production") console.log(`End saving shipments`);
      })
      // .catch((error) => console.log("error", error));
      .catch(() => {});
    if (MODE !== "production") console.log(`End job`);
  } catch (error) {
    console.log((error as Error).message || "Failed to load orders");
  }
};

if (!DB_SYNC_ENABLED || DB_SYNC_ENABLED !== "true") {
  // Schedule the task to run every 5 minute
  console.log("New orders job is about to start.");
  cron.schedule(CRON_JOB_ORDER || "*/5 * * * *", task);
}
