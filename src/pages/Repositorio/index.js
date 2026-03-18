import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { 
  Container, 
  Carregando, 
  Owner, 
  BackButton, 
  IssuesList, 
  PageActions, 
  FilterList
} from "./style";

import { FaArrowLeft } from 'react-icons/fa';

import api from "../../services/api";


export default function Repositorio() {

  const { repositorio } = useParams();

  const [repositorioData, setRepositorioData] = useState({});
  const [issuesData, setIssuesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters] = useState([
    { state: 'all', label: 'Todas', active: true },
    { state: 'open', label: 'Abertas', active: false },
    { state: 'closed', label: 'Fechadas', active: false }
  ]);

  const [filterIndex, setFilterIndex] = useState(0);


  /*
  Função responsável por carregar os dados principais do repositório
  */
  useEffect(() => {

    async function loadRepository(){

      const nomerepo = decodeURIComponent(repositorio);

      const response = await api.get(`/repos/${nomerepo}`);

      setRepositorioData(response.data);

      setLoading(false);

    }

    loadRepository();

  }, [repositorio]);


  /*
  Hook que executa a busca das issues sempre que:
  - repositório muda
  - página muda
  - filtro muda
  */
  useEffect(() => {

    loadIssues();

  }, [repositorio, page, filterIndex]);


  /*
  Busca as issues aplicando:
  - paginação
  - filtro de estado (open/closed/all)
  */
  async function loadIssues(){

    const nomerepo = decodeURIComponent(repositorio);

    const response = await api.get(
      `/repos/${nomerepo}/issues`,
      {
        params:{
          state: filters[filterIndex].state,
          per_page: 5,
          page: page
        }
      }
    );

    setIssuesData(response.data);

  }


  /*
  Controla a navegação entre páginas
  Impede valores menores que 1
  */
  function handlePage(action){

    setPage(prevPage =>

      action === 'back'
        ? Math.max(prevPage - 1 , 1)
        : prevPage + 1

    );

  }


  /*
  Atualiza o filtro ativo e reseta a paginação
  */
  function handleFilter(index){

    setFilterIndex(index);

    setPage(1);

  }


  if(loading){
    return(

      <Carregando>
        <h1>Carregando...</h1>
      </Carregando>

    );
  }


  return(   

    <Container>

      <BackButton to="/">
        <FaArrowLeft 
          color='#000'
          size={30}
        />
      </BackButton>


      <Owner>

        <img
          src={repositorioData.owner?.avatar_url}
          alt={repositorioData.owner?.login}
        />

        <h1>
          {repositorioData.name}
        </h1>

        <p>
          {repositorioData.description}
        </p>

      </Owner>


      <FilterList active={filterIndex}>

        {filters.map((filter,index)=>(

          <button
            type="button"
            key={filter.label}
            onClick={()=>handleFilter(index)}
          >
            {filter.label}
          </button>

        ))}

      </FilterList>


      <IssuesList>

        {issuesData.map(issue => (

          <li key={issue.id}>

            <img 
              src={issue.user.avatar_url} 
              alt={issue.user.login}
            />

            <div>

              <strong>

                <a 
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {issue.title}
                </a>

                {issue.labels.map(label => (

                  <span key={label.id}>
                    {label.name}
                  </span>

                ))}

              </strong>

              <p>
                {issue.user.login}
              </p>

            </div>

          </li>

        ))}

      </IssuesList>


      <PageActions>

        <button
          type="button"
          onClick={()=>handlePage('back')}
          disabled={page < 2}
        >
          Voltar
        </button>


        <button
          type="button"
          onClick={()=>handlePage('next')}
          disabled={issuesData.length < 5}
        >
          Próxima
        </button>

      </PageActions>


    </Container>

  );

}