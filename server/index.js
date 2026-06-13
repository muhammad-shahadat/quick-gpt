import "dotenv/config"

import app from "./src/app.js";
import { connectDB } from "./src/configs/db.js";
import { seedPlans } from "./src/configs/seeds/planSeed.js";




const port = process.env.PORT || 4000;

(async () => {

    try {

        await connectDB();
        // ২. কানেক্ট হওয়ার পরেই সিডার চেক করবে এবং ডেটা না থাকলে ইনসার্ট করবে
        await seedPlans();
        app.listen(port, () => {
            console.log(`server is running at http://localhost:${port}`);

        })

    } catch (error) {
        console.error(`Server start error: ${error.message}`);

    }

})()

