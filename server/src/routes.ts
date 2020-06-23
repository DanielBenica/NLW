import express, { response } from 'express'
import pointsController from './controllers/pointsController'
import itemsController from './controllers/itemsController'
import multer from 'multer'
import multerConfig from './config/multer'
//15:26

const PointsController = new pointsController();
const ItemsController = new itemsController();
const upload = multer(multerConfig);

const routes = express.Router();

routes.get('/items', ItemsController.index);

routes.get('/points/', PointsController.index)

routes.post('/points',upload.single('image') ,PointsController.create);

routes.get('/points/:id', PointsController.show)

export default routes;

