export function ajax(props){
  let {url, cbSuccess} = props;
fetch(url)
.then(res => res.ok ? res.json() : Promise.reject(res))
.then(json => cbSuccess(json))
.catch(err =>{
  let message = err.statusText || "Ocurrió un error al acceder a la API";
  document.getElementById("posts").innerHTML = `
  <div class="error">
    <p> Error ${err.status}: ${message}</p>`;
    document.querySelector(".loader").style.display = "none";
    console.log(err);
});
}