import express, { response } from 'express';
import routes from './routes'
import path from 'path'
import cors from 'cors'


const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

//rota é o endereço completo

//Get: buscar uma ou mais informaçoes do back
//Post: criar uma nova informaçao no back
//Put: atualizar uma informação ja existente no back
//Delete: deletar uma info do back


//request params: paramentros na propria rota que identificam recursos
//Query param: parametros que vem na propria rota que sao geralmente opcionais utilizados para filtros
//Body: parametros para criação e att de informações



app.use('/uploads',express.static(path.resolve(__dirname,'..','upload')))


app.listen(3333);