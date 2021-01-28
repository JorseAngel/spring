export function FooterPageButton(cacheSize){

  const $menu = document.createElement("footer");
  $menu.classList.add("footer");

var init = function() {
   const visorSize  = localStorage.getItem("visorSize");
   const activePage = localStorage.getItem("activePage");
    Pagination.Init(document.getElementById('pagination'), {       
        size: Math.ceil(cacheSize/visorSize), // pages size= rowsTotal / rowsPage
        activePage:  activePage, // selected page
        step: 1   // pages before and after current
    });
};
init();
}
const Pagination = {
    code: '',
    
    Init: function(menu, data) {
        Pagination.Constructor(data);
        Pagination.Create(menu);
        Pagination.Start();
    },
    Constructor: function(data) {
        data = data || {};
        Pagination.sizeStatic = data.size || 30;
        Pagination.size = data.size || 30;
        Pagination.activePage = data.activePage || 1; 
        Pagination.step = data.step || 3;
    },
   Create: function(menu) {

        var html = [
            '<div id="div_menu_page"><a>&#129092;</a>', // Inicio
            '<a>&#9668;</a>', // previous button
            '<span></span>',  // pagination container
            '<a>&#9658;</a>',  // next button
            '<a>&#129094;</a></div>'  // End
        ];

        menu.innerHTML = html.join('');
        Pagination.menu = menu.getElementsByTagName('span')[0];
        Pagination.Buttons(menu);
    },
   Buttons: function(menu) {
        var nav = menu.getElementsByTagName('a');
        nav[0].id = "botonInicio";
         nav[0].dataset.valor = 0;
        nav[0].addEventListener('click', Pagination.Inicio, false);
        nav[1].id = "botonPrev";
        nav[1].dataset.valor = 0;
        nav[1].addEventListener('click', Pagination.Prev, false);
        nav[2].id = "botonNext";
        nav[2].dataset.valor = 1;
        nav[2].addEventListener('click', Pagination.Next, false);
        nav[3].id = "botonEnd";
        nav[3].dataset.valor = Pagination.size - 1;
        nav[3].addEventListener('click', Pagination.End, false);
    },
   Start: function() {
        if (Pagination.activePage == 1) {
            document.getElementById('botonInicio').style.display ="none";
            document.getElementById('botonPrev').style.display ="none";
        }else {
            document.getElementById('botonInicio').style.display ="";
            document.getElementById('botonPrev').style.display ="";
        }
        if (Pagination.activePage == Pagination.sizeStatic ) {
            document.getElementById('botonNext').style.display ="none";
            document.getElementById('botonEnd').style.display ="none";
        }else {
            document.getElementById('botonNext').style.display ="";
            document.getElementById('botonEnd').style.display ="";
        }        
        
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (Pagination.activePage < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (Pagination.activePage > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(Pagination.activePage - Pagination.step, Pagination.activePage + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },
  
    Add: function(s, f) {
        for (var i = s; i < f; i++) {
            Pagination.code += '<a>' + i + '</a>';
        }
    },
    // add last page with separator
    Last: function() {
        Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
    },

    // add first page with separator
    First: function() {
        Pagination.code += '<a>1</a><i>...</i>';
    },


    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function(evt) {
       // alert(evt.currentTarget.innerHTML );
        Pagination.activePage = +this.innerHTML;
        Pagination.Start();
    },
    
    // inicio PAge
    Inicio: function(){
        Pagination.size = Pagination.sizeStatic;
        Pagination.activePage = 1;
        Pagination.Start();
    },

    // previous page
    Prev: function() {    
       document.getElementById("botonPrev").dataset.valor = Pagination.page -2;    
        Pagination.activePage--;
        if (Pagination.activePage < 1) {
            Pagination.activePage = 1;
        }
        Pagination.Start();
    },
      // end
    End: function(){
        Pagination.size = Pagination.sizeStatic;
        Pagination.activePage = Pagination.sizeStatic;
        Pagination.Start();
    },  

    // next page
    Next: function() {
       document.getElementById("botonNext").dataset.valor = Pagination.activePage;
        Pagination.activePage++;       
        if (Pagination.activePage > Pagination.size) {
          // ojo
            Pagination.activePage = Pagination.size;
        }
        localStorage.setItem("activePage", Pagination.activePage);
        Pagination.Start();
    },


    // binding pages
    Bind: function() {
        var a = Pagination.menu.getElementsByTagName('a');
        
        for (var i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.activePage) a[i].className = 'current';
            
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },

    // write pagination
    Finish: function() {
        Pagination.menu.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

     
    getActivePage: function(){        
      return Pagination.activePage;
    }
};