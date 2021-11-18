var timer;
var idleTime = 0;
var isActive = false;

function setInfoterminal(event_opl){
    if ((event_opl.target.tagName.toLowerCase() == 'button'       ) &&
        (event_opl.target.id                    == "fb-info")       ||
        (event_opl.target.id                    == "hn-info")){
            var body_o = document.getElementsByTagName('body')[0];
            var fb = document.getElementsByClassName("wrapper")[0];
            var obj = event_opl.target.id;


            if (isActive == true){
                fb.style = 'grid-template-areas: "header header" "switch switch" "fb-info hn-info"; grid-template-columns: 1fr 1fr;';
                clearTimeout(timer);
                return isActive = false
            }

            isActive = true;

            fb.style = 'grid-template-areas: "header header" "switch switch" "' + obj + ' ' + obj + '"; grid-template-columns: 100%;';

            timer = setInterval(function(){
                idleTime++;

                //console.log(idleTime);
                
                if(idleTime > 4){
                    fb.style = 'grid-template-areas: "header header" "switch switch" "fb-info hn-info"; grid-template-columns: 1fr 1fr;';
                    clearTimeout(timer);
                    isActive = false;
                }
            }, 1000);
        }
}

function openEntry(event_opl) {
        if(event_opl.target.tagName.toLowerCase() == "span"){
            var obj = event_opl.target;
            var entryText = document.querySelectorAll(".content");

            for(var i = 0; i < entryText.length; i++){
                if(obj.dataset.id == entryText[i].dataset.id &&
                   obj.dataset.set == entryText[i].dataset.set){
                    if(obj.innerHTML.charCodeAt(0) == 5125){
                        obj.innerHTML = "&#5121";
                        entryText[i].style.display = "inherit";
                        break;
                    } else {
                        obj.innerHTML = "&#5125";
                        entryText[i].style.display = "none";
                        break;
                    }
                }              
            }
        }
}

async function GET(url){
    let response = await fetch(url);

    console.log(response.status);
    console.log(response.statusText);

    if(response.ok && url == "/publishedHNInfos"){
        let entry = document.getElementsByClassName("hn-info")[0].getElementsByClassName("entry");
        let i = 0;
        rss = await response.json();

        console.log("eksde")
        //console.log(rss_o[0]['published']);
        console.log(entry[0].getElementsByTagName("h1")[0].innerHTML);

        for (rss_o in rss){
            entry[i].getElementsByTagName("h1")[0].innerHTML = rss[rss_o]['title'];
            entry[i].getElementsByTagName("h5")[0].innerHTML = formatEntryDate(rss[rss_o]['published'])
            entry[i].lastElementChild.innerHTML = rss[rss_o]['content'];
            i++;
        }

        console.log(rss_o);
    } else if(response.ok && url == "/publishedFBInfos"){
        console.log(response.json());
    }
}

async function DELETE(url, id){
    if(url.substr(0, 7) == "/fbinfo"){

        let response = await fetch(url + "/" + id, {
            method: "DELETE"
        })
    }
}

async function POST(url, data){
    if(url.substr(0, 7) == "/fbinfo"){
        let content = document.getElementById("content").value;
        
        console.log(content);

        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'text/plain'
            },
            body: content
        });

        console.log(response.text());
    }
}

function eksde(e){
    e.preventDefault();
    console.log(":))))))))")

    return false;
}

function openMenu(event_opl){
    let side = document.getElementsByClassName("sidebar")[0];

    side.style.width = "100px";
}

function closeMenu(){
    let side = document.getElementsByClassName("sidebar")[0];

    side.style.width = "0";
}

/*
window.onload = function(){
    //var validate = new Bouncer('form');
    let oReq = new XMLHttpRequest();
    var body_o = document.getElementsByTagName('body')[0];
    var req = new APPUTIL.Requester();

    body_o.addEventListener('click', openEntry, false);
    body_o.addEventListener('click', setInfoterminal, false);
    body_o.addEventListener('mousemove', function(){idleTime = 0}, false);

    document.addEventListener('bouncerFormInvalid', function (event) {
        console.log(event.detail.errors);
        console.log(event.detail.errors[0].offsetTop);
        window.scrollTo(0, event.detail.errors[0].offsetTop);
    }, false);
    
    document.addEventListener('bouncerFormValid', function () {
        alert('Form submitted successfully!');
    }, false);

    var daten = req.GET("/publishedHNInfos");

    GET("/publishedHNInfos");
    GET("/fbinfo/f505b7d1-87be-4cd7-b1e5-8944424a42e7");
    GET("/publishedFBInfos");
    DELETE("/fbinfo", "ed2fff2d-4036-4c06-bbac-be1351fbabbc");
    
    
    oReq.open("GET", "/api");
    oReq.send(null);

    if (oReq.readyState === oReq.DONE) {
        if (oReq.status === 200) {
            console.log(oReq.response);
            console.log(oReq.responseText);
        }
    }
    */