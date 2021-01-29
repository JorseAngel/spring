
import api from "../helpers/harni_api.js";
import {ajax} from "../helpers/ajax.js";
import {PostCard} from "./PostCard.js";
import {PostCardDetail} from "./PostCardDetail.js";
import { Swipper } from "../showcase/swipper/swipper.js";
import { MySwiper } from "../showcase/swipper/mySwiper.js";
import { Carrusel } from "../showcase/carrusel/carrusel.js";
import { d,$,lS,sS } from "./DomFunction.js";
import { ImageSlider } from "../showcase/imageSlider/imageSlider.js";
import { MyImageSlider } from "../showcase/imageSlider/myImageSlider.js";


export async function Router(){
  
    //El State
    const state = {
      data: {} ,
      //menuPage: "FooterPage",
      visorSize: "" ,//2,
      activePage: "" , // 1,
      cacheSize: "" , // 5,
      cacheInicio: "" , // 0,
      cacheFinal: "" , //: 1,  //cacheInicio + (  visorSize - 1)  //     
    }
    //Actualizar el State de forma reactiva
    const setState = obj => {
      for (let key in obj) {
        if (state.hasOwnProperty(key)) {
          state[key] = obj[key];
        }
      }
    }
//Obtenemos una copia inmutable del State
  const getState = () => JSON.parse(JSON.stringify(state)); // de poco ingeniero   pero es inmutable 
   // const getState = () => {... state }; por babel. Aqui vale para array si object NO
   //const getState = () => Object.assign({}, state); // Mutable
  // const getState = () => Object.create(state); // es mutable

  if(!localStorage.getItem("showcaseType")){
        localStorage.setItem("showcaseType", "showcaseshmJM"); 
  }
   let {hash} = location;
   
  $("changeshowcase").addEventListener("click",(e)=>{
       switch (e.target.id ) {
            case 'showcaseshmJM': 
              localStorage.setItem("showcaseType", "showcaseshmJM");
              renderShowcase();        
              break;         
            case 'showcaseshmCarrusel': 
                localStorage.setItem("showcaseType", "showcaseshmCarrusel");
                renderShowcase();
                break;
            case 'showcaseshmJesadri': 
                localStorage.setItem("showcaseType", "showcaseshmJesadri");
                renderShowcase();
                break;
            case 'showcaseshmSwipper':
                  localStorage.setItem("showcaseType", "showcaseshmSwipper");
                  renderShowcase();
                  break;  
            case 'sizeVisorI' :
              let visorSize =  localStorage.getItem("visorSize");
              let activePage =   localStorage.getItem("activePage");
              visorSize--;
              if (visorSize > 0){
                  let  url = api.API_HARNINA + activePage  + "&size=" +visorSize;
                  callApiRest(url);   
                  localStorage.setItem("visorSize",visorSize); 
                   // if  (activePage < getState().data.totalelements/visorSize  or getState().data.pageable.pageSize)                 else {localStorage.setItem("activePage",1);}
           
              }
              

              break;    
        }
   });
  $("main").addEventListener("click",(e)=>{
     switch (e.target.id ) {
            case 'cardDetail': 
              renderShowcase();
              break;         
            case 'seeMobil': 
            case 'carrusel': 
              renderDetail(e.target.dataset.valor);      
              break; 
      }  
   });
  $("div_menu_page").addEventListener("click",(e)=>{
       let uri = api.API_HARNINA;

        const pageActive= e.target.innerHTML;
        if(pageActive>0){
          callApiRest(uri+(pageActive - 1));        }
 
     switch (e.target.id ) {
      case 'botonInicio':
          callApiRest(uri+document.getElementById("botonInicio").dataset.valor + "&size=6");
          break;
      case 'botonEnd':
          callApiRest(uri+document.getElementById("botonEnd").dataset.valor+ "&size=6");
          break;
     case 'botonNext':
         callApiRest(uri+document.getElementById("botonNext").dataset.valor+ "&size=6");
          break;

     case 'botonPrev':
         callApiRest(uri+document.getElementById("botonPrev").dataset.valor+ "&size=6");
          break;

      case 'firstPage': 
        callApiRest(uri);
         break;
      case 'previousPage': 
        callApiRest(uri+document.getElementById("previousPage").dataset.valor+ "&size=6");
        break;
      case 'nextPage': 

      // El marron
            // 1. Comprobar que no haya agotado los de cache
          // Si quedan: avanzar
               // Si hay suficientes pillarlos
               //  No hay suficentes llamar a la API o BBDD
           // Si no quedan llamar a la API o BBDD



/*
         callApiRest(uri+ document.getElementById("nextPage").dataset.valor+ "&size=6");
*/
      

     
        break;
      case 'endPage': 
        callApiRest(uri+document.getElementById("endPage").dataset.valor+ "&size=6");
        break;  
     }  
   });

const renderShowcase = function(){
   document.getElementById("div_menu_page").style.display ="block";
   document.getElementById("changeshowcase").style.display ="block";
   let html;
  switch (localStorage.getItem("showcaseType")) {   
      
          case '':                          
          case 'showcaseshmJM': 
              document.getElementById('showcaseshmJM').checked = true;
             document.getElementById("main").innerHTML = render(PostCard);
              break;
          case 'showcaseshmCarrusel': 
            document.getElementById('showcaseshmCarrusel').checked = true;
            renderShowcaseShmCarrusel();
            break;
          case 'showcaseshmJesadri':
              document.getElementById('showcaseshmJesadri').checked = true;
              html = "<div class='bodyImg' id='bodyImg'><div class='slider-container'>";
              html += render(ImageSlider);
              html +=  "<button class='arrow left-arrow' id='left'><i class='fas fa-arrow-left'></i></button><button class='arrow right-arrow' id='right'><i class='fas fa-arrow-right'></i></button> </div></div>";
              document.getElementById("main").innerHTML = html ;      

              MyImageSlider();       
             break;                        
           case 'showcaseshmSwipper': 
               document.getElementById('showcaseshmSwipper').checked = true;
               html = "<div class='swiper-container'> <div class='swiper-wrapper'>";      
               html += render(Swipper);
               html += "</div>";
               html += "<div class='swiper-pagination'></div>  <div class='swiper-scrollbar'></div></div>" ;
              document.getElementById("main").innerHTML=html;  

              MySwiper();
               break;
   }
                  
}
const render = function(showcase){
   let html = "";
   setState({visorSize: lS.getItem("visorSize"),activePage : lS.getItem("activePage")});
 
  let inicio = (getState().activePage * getState().visorSize) - getState().visorSize;  
  let final =  inicio +  (getState().visorSize - 1);

  setState({cacheInicio : inicio, cacheFinal:final});
  console.log(getState().cacheInicio,",",getState().cacheFinal);

  const data = getState().data;
   console.log("/",data);     

  let activeData = [];
     
 for(let i = getState().cacheInicio; i<= getState().cacheFinal; i++){
          activeData.push(data.content[i]);
 }
 console.log("cache:", activeData);
 activeData.forEach(post => {       
            html += showcase(post);
 }); 
    return html;   
}
const renderShowcaseShmCarrusel = function(){
    let html = "";
     document.getElementById("main").innerHTML= "";   
    let $giran = document.createElement("div");
    $giran.id = "giran";
    document.getElementById("main").appendChild($giran);
    $giran  = document.getElementById("giran");
    const data = getState().data;
    let i = 0;
    data.content.forEach(post => {
          $giran.appendChild(Carrusel(post, i, data.content.length));       
           i++;        
     });      

}

const renderDetail = async function(id){
   document.querySelector(".loader").style.display = "block";
              await  ajax({
                                    url:"http://localhost:8085/storerest/" + id,
                                      cbSuccess : (post)=>{
                                        console.log(post);
                                        let html = PostCardDetail(post);
                                        document.getElementById("main").innerHTML=html;
                                      }
                        })
        document.getElementById("div_menu_page").style.display ="none";
        document.getElementById("changeshowcase").style.display ="none";
        document.querySelector(".loader").style.display = "none";
}
const renderMenuPage = function(){
    const posts =  getState().data;
       console.log(posts);
       document.getElementById("currentPage").innerHTML = posts.pageable.pageNumber + 1;
       if  (posts.first){
             document.getElementById("firstPage").style.display = "none";
             document.getElementById("previousPage").style.display = "none";
       }else {
           document.getElementById("previousPage").dataset.valor = posts.pageable.pageNumber - 1;
          document.getElementById("firstPage").style.display = "block";
          document.getElementById("previousPage").style.display = "block";
      }
      if  (posts.last) {
          document.getElementById("nextPage").style.display = "none";
          document.getElementById("endPage").style.display = "none";
      }else {         
          document.getElementById("nextPage").dataset.valor = posts.pageable.pageNumber + 1;
           document.getElementById("endPage").dataset.valor = posts.totalPages - 1;
          document.getElementById("nextPage").style.display = "block";
          document.getElementById("endPage").style.display = "block";
       }                  
}
const  callApiRest = async function(uri){  
   await  ajax({
              url:uri,
              cbSuccess : (posts)=>{             
                setState({
                     data: posts 
                  });               
              
               //  if(getState().menuPage == "FooterPage"){renderMenuPage();}              
               
                 renderShowcase();              
              }
        });
 document.querySelector(".loader").style.display = "none"; 
}
 if(!hash || hash == "#/"){     
     callApiRest(api.API_HARNINA);      
 }else if(hash.includes("#/post/")){ 
          console.log("/post/",getState());          
        const post = hash.split("/");
        await  ajax({
                       url:"http://localhost:8085/storerest/" + post[2],
                        cbSuccess : (post)=>{
                           console.log(post);
                           let html = PostCardDetail(post);
                           document.getElementById("main").innerHTML=html;
                        }
          })
        document.getElementById("div_menu_page").style.display ="none";
        document.getElementById("changeshowcase").style.display ="none";
        document.querySelector(".loader").style.display = "none";
    }else if(hash.includes("#/render")){ 
      console.log("/render",getState());    
         renderShowcase();       
          }
}

