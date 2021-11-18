'use strict'

function formatEntryDate(date){
    let nDate = new Date(date[0], date[1], date[2], date[3], date[4], date[5]);
    let dateStr = "";

    if(date.length == 0) return "-";

    dateStr += "Am ";

    console.log(nDate.getDay());

    switch(nDate.getDay()){
        case 0:
            dateStr += "Sonntag";
            break;
        case 1:
            dateStr += "Montag";
            break;
        case 2:
            dateStr += "Dienstag";
            break;
        case 3:
            dateStr += "Mittwoch";
            break;
        case 4:
            dateStr += "Donnerstag";
            break;
        case 5:
            dateStr += "Freitag";
            break;
        case 6:
            dateStr += "Samstag";
            break;
    }

    dateStr += " dem " + nDate.getDate() + "." + nDate.getMonth() + "." + nDate.getFullYear() + ", um " +
               String(nDate.getHours()).padStart(2, '0') + ":" + String(nDate.getMinutes()).padStart(2, '0') + " Uhr veröffentlicht";

    return dateStr;

    console.log(nDate.getDay())
    console.log(nDate.getUTCDay())
    console.log(nDate.getFullYear())

}

class Column {
    constructor (el_spl, template_spl, url_spl) {
        this.el_s = el_spl;
        this.template_s = template_spl;
        this.url = url_spl;
     }

    render_px (id_spl = "") {
        // Daten anfordern
        let path_s = this.url + id_spl;
        let requester_o = new APPUTIL.Requester();
        requester_o.GET(path_s)
        .then (result_spl => {
            for(let key in result_spl){
                result_spl[key]['published'] = formatEntryDate(result_spl[key]['published']);
            }
                
            
              this.doRender_p(result_spl);
        })
        .catch (error_opl => {
           console.log(error_opl)
        });
     }
     doRender_p (data_opl) {
        let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_opl);
        let el_o = document.getElementsByClassName(this.el_s)[0];

        if (el_o != null) {
            el_o.innerHTML = markup_s;
         }
     }

}

class Detail {
    constructor (el_spl, template_spl) {
        this.el_s = el_spl;
        this.template_s = template_spl;
     }

    render_px (id_spl = "") {
        // Daten anfordern
        let path_s = "/fbinfo/" + id_spl;
        let requester_o = new APPUTIL.Requester();
        requester_o.GET(path_s)
        .then (result_spl => {
            for(let key in result_spl){
                result_spl[key]['created'] = formatEntryDate(result_spl[key]['created']);
                result_spl[key]['published'] = formatEntryDate(result_spl[key]['published']);
            }

              this.doRender_p(result_spl);
        })
        .catch (error_opl => {
           console.log(error_opl)
        });
     }
     doRender_p (data_opl) {
        let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_opl);
        let el_o = document.getElementsByClassName(this.el_s)[0];

        if (el_o != null) {
            el_o.innerHTML = markup_s;
         }
     }

}

function save(){}

function dateNow(){
    var today = new Date();
    var arr = [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()]

    return arr;
}

async function validate(){
    let req = new APPUTIL.Requester();
    let form = document.querySelector(".detail");
    let dataId = document.querySelector("#selectedId");
    let defData = {"title": "",
                "created": [],
                "published": [],
                "status": "",
                "content": ""
    }

    if(form.querySelector("#status") != null && dataId.dataset.id == ""){
        if(form.querySelector("#title").value != ""   &&
           form.querySelector("#content").value != "" &&
           form.querySelector("#status").value != ""){
            if(dataId.dataset.id == ""){
                let title = form.querySelector("#title");
                let content = form.querySelector("#content");
                let status = form.querySelector("#status");

                defData['title'] = title.value;
                defData['created'] = dateNow();

                console.log(status.options[status.selectedIndex].text.toLowerCase())

                if(status.options[status.selectedIndex].text.toLowerCase() == "veroeffentlicht"){
                    
                    defData['published'] = dateNow();
                } else defData['published'] = [];

                defData['content'] = content.value;
                defData['status'] = status.options[status.selectedIndex].text;

                console.log(defData);

                await req.POST("/fbinfo", defData);
                listMode();
            } 
        }
    } else if(form.querySelector("#title").value != "" &&
              form.querySelector("#content").value != ""){
                let title = form.querySelector("#title");
                let content = form.querySelector("#content");
                let status = form.querySelector("#status");

                if(status != null){
                    if(status.options[status.selectedIndex].text.toLowerCase() == "veroeffentlicht"){
                        defData['published'] = dateNow();
                    } else defData['published'] = [];

                    defData['status'] = status.options[status.selectedIndex].text;
                }

                defData['title'] = title.value;
                defData['content'] = content.value;

                await req.PUT("/fbinfo/" + dataId.dataset.id, defData);
                listMode();
        }
}

async function del(){
    var dataId = document.querySelector("#selectedId");
    var req = new APPUTIL.Requester();

    if(dataId.dataset.id == ""){
        alert("Keine Zeile wurde ausgewählt!");
    } else if(await req.DELETE("/fbinfo/" + dataId.dataset.id)) listMode();
   
}

function add(){
    var det = new Detail("fb-info", "detail.tpl.html");
    
    det.render_px();
}

function update(){
    
}

function edit(){
    var dataId = document.querySelector("#selectedId");
    var det = new Detail("fb-info", "detail.tpl.html");
    
    if(dataId.dataset.id == ""){
        alert("Keine Zeile wurde ausgewählt!");
    } else det.render_px(dataId.dataset.id);
}

function entryMode(){
    var ent = new Column("fb-info", "index.tpl.html", "/publishedFBInfos");

    ent.render_px();
}

function selectRow(event){
    
    if(event.target.tagName.toLowerCase() == "td"){
        let rows = document.querySelectorAll("[data-va]");
        let dataId = document.querySelector("#selectedId");

        for(var i = 0; i < rows.length; i++){
            if (rows[i].dataset.va == dataId.dataset.id){
                rows[i].classList.toggle("selected");
                break;
            }
        }
        
        event.target.parentNode.classList.toggle("selected");
        dataId.dataset.id = event.target.parentNode.dataset.va;
    }
}

function listMode(){
    var lis = new Detail("fb-info", "list.tpl.html");

    lis.render_px();
}

window.onload = function(){
    var col1 = new Column("fb-info", "index.tpl.html", "/publishedFBInfos");
    var col2 = new Column("hn-info", "dfhdfh.tpl.html", "/publishedHNInfos");
    var body_o = document.getElementsByTagName('body')[0];

    body_o.addEventListener('click', openEntry, false);
    body_o.addEventListener('click', setInfoterminal, false);
    body_o.addEventListener('click', selectRow, false);
    body_o.addEventListener('mousemove', function(){idleTime = 0}, false);

    APPUTIL.createTemplateManager_px();

    setTimeout(function(){
        col1.render_px();
        col2.render_px();
    }, 2);
}