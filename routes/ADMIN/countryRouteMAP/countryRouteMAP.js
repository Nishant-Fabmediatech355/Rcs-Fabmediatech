import express from 'express';
import { CreateCountryRouteMap, DeleteCountryRouteMap,  GetAllCountryRouteMap,  UpdateCountryRouteMap } from '../../../controllers/ADMIN/countryRouteMAP/countryRouteMAP.js';

const countryRouteMAP = express.Router();

// Routes for CreateCustoemrRouteMap
countryRouteMAP.post('/create-countryroutemap',CreateCountryRouteMap);
// countryRouteMAP.get('/getone-countryroutemap',GetOneCountryRouteMapByCountryId)
countryRouteMAP.get('/getall-countryroutemap',GetAllCountryRouteMap);
countryRouteMAP.patch('/update-countryroutemap',UpdateCountryRouteMap)
// countryRouteMAP.delete('/delete-countryroutemap',DeleteCountryRouteMapByCountryId);
countryRouteMAP.delete('/delete-countryroutemap',DeleteCountryRouteMap);

export default countryRouteMAP