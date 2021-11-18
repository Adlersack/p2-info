//global variables

var rss_o = {};

window.onload = function(){
    let entry = document.getElementsByClassName("entry text");

    console.log("eksde")
    console.log(rss_o[0]['content']);

    entry.innerHTML = rss_o[0]['content'];
}

async function GET(url){
    let response = await fetch(url);

    console.log(response.status);
    console.log(response.statusText);

    if(response.ok){
        rss_o = await response.text();

        console.log(rss_o);
    }
}
