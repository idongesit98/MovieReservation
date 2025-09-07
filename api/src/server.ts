import app, {initApp} from "./app";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

(async () => {
    await initApp();
    app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
})();