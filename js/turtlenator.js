let initModalCreateLittleMinion = (result) => {
    let modal = document.getElementById('modalCreateTool');
    let btn = document.getElementById("btn-create-tool");
    btn.onclick = function() {
        TS.query("SELECT * WHERE { ?s a rset:ToolState. ?s rdfs:label ?label.} ORDER BY ASC(?label)", fillStatus);
        modal.style.display = "block";
    }
    $("#btn-modal-create-tool-close").click(function() {
        modal.style.display = "none";
    });
    $("#btn-modalCreateTool").on('click', () => {
        createToolTTL();
        copyToClipboard('#hiddenclipboard');
    });
};

let fillStatus = (response) => {
    $("#sel-status").html("");
    $("#sel-status").append(new Option("", -1));
    let values = response.results.bindings;
    for (item in values) {
        let uri = values[item].s.value;
        let label = values[item].label.value;
        let opt = $(new Option(label, uri));
        opt.attr("uri", uri).attr("label", label);
        $("#sel-status").append(opt);
    }
};

$("#btn-entitysearch").click(function() {
    TS.queryWikidataEntity($("#inp-wikidatastr").val(), fillWikidataEntity);
});

let fillWikidataEntity = (response) => {
    $("#inp-wikidata").val("");
    let eid = Object.keys(response.entities)[0];
    $("#inp-wikidata").val(response.entities[eid].id + " | " + response.entities[eid].labels.en.value).attr("uri", "wd:" + response.entities[eid].id);
    $("#inp-wikidata").css("background-color", "LIGHTGREEN");
};

let copyToClipboard = (element) => {
    var text = $("#hiddenclipboard").clone().find('br').prepend('\r\n').end().val();
    element = $('<textarea>').appendTo('body').val(text).select();
    document.execCommand('copy');
    element.remove();
};

let createToolTTL = () => {
    // check input fields
    let valide = true;
    if ($("#inp-wikidata").val().includes("null")) {
        valide = false;
        console.log(false, "wikidata");
    }
    if ($("#inp-name").val().length === 0) {
        valide = false;
        console.log(false, "name");
    }
    if ($("#inp-description").val().length === 0) {
        valide = false;
        console.log(false, "description");
    }
    if ($("#inp-author").val().length === 0) {
        valide = false;
        console.log(false, "author");
    }
    if ($("#inp-git").val().length === 0) {
        valide = false;
        console.log(false, "git");
    }
    if ($("#sel-status option:selected").val() === "-1") {
        valide = false;
        console.log(false, "status");
    }
    if ($("#sel-active option:selected").val() === "-1") {
        valide = false;
        console.log(false, "consumeslod");
    }

    if (valide == false) {
        $("#alertdiv").show();
        $("#successdiv").hide();
        $("#hiddenclipboard").val("");
    } else {
        $("#alertdiv").hide();
        $("#successdiv").show();
        // create triples
        let ttl = "";
        ttl += "@prefix rset: <http://rsetools.squirrel.link#> .\r\n";
        ttl += "@prefix wd: <http://www.wikidata.org/entity/> .\r\n";
        ttl += "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\r\n\r\n";
        let current_datetime = new Date()
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        ttl += "# " + $('#inp-name').val() + "\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " a " + "rset:Tool " + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " a " + "rset:LittleMinion " + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:name " + "'" + $('#inp-name').val() + "'" + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:wikidataid " + "'" + $("#inp-wikidata").attr("uri").replace("wd:", "") + "'" + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:description " + "'" + $('#inp-description').val() + "'" + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:author " + "'" + $('#inp-author').val() + "'" + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:gitrepository " + "<" + $('#inp-git').val() + ">" + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:dateOfEntry " + "'" + formatted_date + "'" + ".\r\n";
        if ($("#inp-link1").val().includes("http")) {
            ttl += $("#inp-wikidata").attr("uri") + " rset:link " + "<" + $('#inp-link1').val() + ">" + ".\r\n";
        }
        if ($("#inp-link2").val().includes("http")) {
            ttl += $("#inp-wikidata").attr("uri") + " rset:link " + "<" + $('#inp-link2').val() + ">" + ".\r\n";
        }
        if ($("#inp-link3").val().includes("http")) {
            ttl += $("#inp-wikidata").attr("uri") + " rset:link " + "<" + $('#inp-link3').val() + ">" + ".\r\n";
        }
        ttl += $("#inp-wikidata").attr("uri") + " rset:toolState " + "" + $("#sel-status option:selected").val() + "" + ".\r\n";
        ttl += $("#inp-wikidata").attr("uri") + " rset:active " + "'" + $("#sel-active option:selected").val() + "'" + ".\r\n";
        $("#hiddenclipboard").val(ttl);
    }
};

// INIT
initModalCreateLittleMinion();
$("#alertdiv").hide();
$("#successdiv").hide();
$("#hiddenclipboard").hide();
