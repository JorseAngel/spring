
import api from "../helpers/harni_api.js";
import {ajax} from "../helpers/ajax.js";
import {PostCard} from "./PostCard.js";
import {PostCardDetail} from "./PostCardDetail.js";

export async function Router(){

  var APP = APP || {}
  sessionStorage.setItem("showcaseType", "showcaseshmJM"); 
   let {hash} = location;

 document.getElementById("div_menu_page").addEventListener("click", (e)=>{
    let uri = api.API_HARNINA;
     switch (e.target.id ) {
      case 'firstPage': 
        callApiRest(uri);
         break;
      case 'previousPage': 
        callApiRest(uri+document.getElementById("previousPage").dataset.valor);
        break;
      case 'nextPage': 
         callApiRest(uri+ document.getElementById("nextPage").dataset.valor);
        break;
      case 'endPage': 
        callApiRest(uri+document.getElementById("endPage").dataset.valor);
        break;     
     }    
  });
 document.getElementById("changeshowcase").addEventListener("click", (e)=>{
    let uri = api.API_HARNINA;
     switch (e.target.id ) {
      case 'showcaseshmJM': 
         sessionStorage.setItem("showcaseType", "showcaseshmJM");
         renderShowcase();        
         break;         
      case 'showcaseshmCarrusel': 
           sessionStorage.setItem("showcaseType", "showcaseshmCarrusel");
            renderShowcase();
           break;
      case 'showcaseshmJesadri': 
              sessionStorage.setItem("showcaseType", "showcaseshmJesadri");
             renderShowcase();
              break;
      case 'showcaseshmExamen':
             sessionStorage.setItem("showcaseType", "showcaseshmExamen");
             renderShowcase();
             break;
     }    
  });

const menuPage = function(){
    const posts = APP.data;
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
const renderShowcaseShmJM = function(){
       let html = "";
      APP.data.content.forEach(post => {
            html += PostCard(post);
        }); 
       document.getElementById("main").innerHTML=html;   
}
const renderShowcaseShmCarrusel = function(){
       let html = "Hola Carrusel";      
       document.getElementById("main").innerHTML=html;   
}
const renderShowcaseShmJesadri = function(){
       let html = "Hola Jesadri";      
       document.getElementById("main").innerHTML=html;   
}
const renderShowcaseShmExamen = function(){
       let html = "Hola Examen";      
       APP.data.content.forEach(post => {
            html += swipper(post);
        }); 
       document.getElementById("main").innerHTML=html;   
}
const renderShowcase = function(){
  
  switch (sessionStorage.getItem("showcaseType")) {     
         case '': 
                         renderShowcaseShmJM();
                          break;                   
          case 'showcaseshmJM': 
                         renderShowcaseShmJM();
                          break;
          case 'showcaseshmCarrusel': 
                          renderShowcaseShmCarrusel();
                            break;
                   
          case 'showcaseshmJesadri':
                           renderShowcaseShmJesadri();
                            break;
                        
           case 'showcaseshmExamen': 
                          renderShowcaseShmExamen();
                            break;
                        }
                  
}
const  callApiRest = async function(uri){  
   await  ajax({
              url:uri,
              cbSuccess : (posts)=>{
                 APP.data =  posts;
                 document.getElementById("changeshowcase").style.display ="block";
                 document.getElementById("div_menu_page").style.display ="block";
                 menuPage();
                 renderShowcase();              
              }
        });
 document.querySelector(".loader").style.display = "none";
}
 if(!hash || hash === "#/"){
     callApiRest(api.API_HARNINA);
 }else if(hash.includes("#/post/")){       
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
    }
}
