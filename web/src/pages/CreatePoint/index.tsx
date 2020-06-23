import React,{useEffect, useState,ChangeEvent, FormEvent} from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import {Link,useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import {Map,TileLayer,Marker} from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'
import Swal from 'sweetalert2'
import Dropzone from '../../Components/Dropzone'

interface Item  {
    id:number;
    title:string;
    img_url:string;

}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}




const CreatePoint = () => {
    
    const history = useHistory();
    const [items,setItems]=useState<Item[]>([]);
    const [ufs,setUfs]=useState<string[]>([]);
    const[selectedUf,setSelectedUf]=useState('0');
    const[cities,setCities]=useState<string[]>([]);
    const[selectedItems,setSelectedItems]=useState<number[]>([]);
    const[selectedCity,setSelectedCity]=useState('0');
    const[selectedPosition,setSelectedPosition]=useState<[number,number]>([0,0]);
    const[initialPosition,setInitialPosition]=useState<[number,number]>([0,0]);
    const [selectedFile,SetSelectedFile] = useState<File>();
    const [formData,setFormdata]=useState({
        name:'',
        email:'',
        whatsapp:''
    })



    useEffect(()=>{
        api.get('items').then(response=>{
            console.log(response)
            setItems(response.data);
        })
    },[])



    useEffect(()=>{
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{

            const ufInitials= response.data.map(uf=>uf.sigla)
            setUfs(ufInitials);
        })
    },[]);



    useEffect(()=>{
        if(selectedUf==='0'){
            return;
        };
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response=>{

            const cityName= response.data.map(city=>city.nome)
            setCities(cityName);

      })},[selectedUf]);


    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude,longitude}= position.coords

            setInitialPosition([latitude,longitude]);
        })
    },[]);

    function handleSelectedUf(event:ChangeEvent<HTMLSelectElement> ){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event:ChangeEvent<HTMLSelectElement> ){
        const city = event.target.value;
        setSelectedCity(city);
    }    
    function handleMap(event: LeafletMouseEvent){
       setSelectedPosition([
           event.latlng.lat,event.latlng.lng
       ])
    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        const {name,value}= event.target;

        setFormdata({...formData,[name]:value})
    }

    function handleSelectItems(id:number){

        const alreadySelected = selectedItems.findIndex(item=> item === id);

        if (alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item=> item !== id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems,id]);
        }

   
    }

    async function handleSubmit(event:FormEvent){
        
        event.preventDefault();

        const {name,email,whatsapp}= formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude,longitute] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();
        
            data.append('name',name);
            data.append('email',email);
            data.append('whatsapp',whatsapp);
            data.append('uf',uf);
            data.append('city',city);
            data.append('latitude',String(latitude));
            data.append('longitute',String(longitute));
            data.append('items',items.join(','));
            
            if(selectedFile){
                data.append('image',selectedFile)
            }
        
        await api.post('points',data);
        
        Swal.fire(
            'Sucesso',
            'Seu endereço foi cadastrado',
            'success'
          );
        history.push('/');
    }
    
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/'>
                <FiArrowLeft/>
                Voltar para página principal
            </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>
                <Dropzone onFileUploaded={SetSelectedFile}/>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input onChange={handleInputChange}type="text" name='name'id='name'/>
                    </div>
                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input onChange={handleInputChange}type="email" name='email'id='email'/>
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">WhatsApp</label>
                        <input onChange={handleInputChange}type="text" name='whatsapp'id='whatsapp'/>
                    </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition}zoom={15} onClick={handleMap}>
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select  value ={selectedUf}onChange={handleSelectedUf}name="uf" id="uf">
                                <option value="0" >Selecione uma UF</option>
                                {ufs.map(uf=>(
                                    <option  key ={uf}value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select value={selectedCity} onChange={handleSelectedCity} name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city=>(
                                    <option  key ={city}value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>Selecione um ou mais ítens a baixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item=>{
                            return(
                        <li key={item.id} onClick={()=>handleSelectItems(item.id)}className={selectedItems.includes(item.id)?'selected':''}>
                            <img src={item.img_url} alt={item.title}/>
                            <span>{item.title}</span>
                        </li>
                            ); 
                        })}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>

        </div>
    );
}
export default CreatePoint;

//1:28:36
