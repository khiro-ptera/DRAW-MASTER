function makeCard(type, ...children) { // helper function to create card elements from Eloquent Javascript
    let node = document.createElement(type);
    for (let child of children) {
        if (typeof child != "string") node.appendChild(child);
        else node.appendChild(document.createTextNode(child));
    }
    node.setAttribute("id", type);
    return node;
}

function deal() {

    const dealBtn = document.getElementById('start-deal');

    // currently broken
    dealBtn.addEventListener('click', function() {
        evt.preventDefault();
        console.log("deal!");
        const n = parseInt(document.getElementById('num').value);
        console.log(n);
        let deck = [];
        cards.forEach(element => {
            deck.push(cards.name)
        });
    });

    /*const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {myFunction(this);}
    xhttp.open("GET", "cd_catalog.xml");
    xhttp.send();*/
}

document.addEventListener('DOMContentLoaded', deal);