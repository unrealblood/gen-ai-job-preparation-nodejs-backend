import { app } from "./src/app";

app.listen(5000, (error) => {
    if(error) {
        console.log(error);
        return;
    }

    console.log("Server is up and running on port number: 5000");
});