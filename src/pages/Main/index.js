import React, {useState, useCallback, useEffect}from "react";
import{ FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import {Container, Form, List, SubmitButton, DeleteButton} from "./style";
import { Link } from "react-router-dom";
import api from "../../services/api";

 export default function Main() {

  const [newRepo, setNewRepo] = useState(``);
  const [repositorios, setRepositorios] = useState(()=>{
  const repoStorage = localStorage.getItem('repos');
   if(repoStorage){
  return JSON.parse(repoStorage);
  }
  return [];
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
//salvar
useEffect(()=>{
  localStorage.setItem('repos',JSON.stringify(repositorios))
}
,[repositorios]);


  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    async function submit(){
      setLoading(true);
      setAlert(false);
     try{  
     if(newRepo ===''){
      throw new Error('Você presisa indicar um repositório!')
     }

    const response = await api.get(`/repos/${newRepo}`);
    const hasrepo = repositorios.find(repo => repo.name === newRepo)
    if(hasrepo){
      throw new Error("Repositório duplicado!")
    }
    const data = {
      name: response.data.full_name,
      
    }
    setRepositorios([...repositorios, data]);
    setNewRepo(``);   

  }catch(error){
    setAlert(true)
  }finally{
    setLoading(false);
  }
}
    submit();
}
,[newRepo, repositorios]);

     function handleinputChange(e){
       setNewRepo(e.target.value);
       setAlert(null);
  }

    const handleDelete =useCallback((repo)=>{
    const find = repositorios.filter(r => r.name !== repo)
    setRepositorios(find)
  },[repositorios]);

  return (
    //componentes de renderização de tela
    <Container>
        <FaGithub size={25}/>
         <h1>Meus repositórios</h1>
         <Form onSubmit={handleSubmit} error={alert}>
             <input type="text" 
             placeholder="meus repositórios" 
             value={newRepo} 
             onChange={(handleinputChange) 
             }/>
              <SubmitButton loading={loading ? 1 : 0}>
               {
                loading ? (
                <FaSpinner color="#fff" size={14} />
                 ) : (
                <FaPlus color="#fff" size={14} />
               )}
              </SubmitButton>
          </Form>
          <List>
          
            {repositorios.map(repo => (
              <li key={repo.name}>
                <DeleteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash size={20} />
                </DeleteButton>
                <span>{repo.name}</span>
                <Link to={`/repositorio/${encodeURIComponent (repo.name)}`}>
                  <FaBars size={20}/>
                </Link>
              </li>
            ))}
          
         </List>
    </Container>
  );
}