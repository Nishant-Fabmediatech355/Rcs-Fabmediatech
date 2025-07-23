import express from 'express';
import { CreateCountry, DeleteCountry, GetAllCountry,   GetOneCountry,  UpdateCountry} from '../../../controllers/ADMIN/manageCountry/managecountry.js';
 const countryRouter = express.Router();

// Routes for Country
countryRouter.post('/create-country',CreateCountry);
countryRouter.get('/get-all-country',GetAllCountry);
countryRouter.get('/get-one-country',GetOneCountry);
countryRouter.patch('/update-country',UpdateCountry);
countryRouter.delete('/delete-country',DeleteCountry);




export default countryRouter;