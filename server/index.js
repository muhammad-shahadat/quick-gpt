import "dotenv/config"
import app from "./src/app.js";
import { connectDB } from "./src/configs/db.js";




const port = process.env.PORT || 4000;

(async () => {

   try {

      await connectDB();
      app.listen(port, () =>{  
         console.log(`server is running at http://localhost:${port}`);

      })
      
   } catch (error) {
      console.error(`Server start error: ${error.message}`);
      
   }

})()

