// api key 6QP6KZF7WfD01Oz9HV3SxiZ5hIg8ws9N 
// var xhr = fetch("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=6QP6KZF7WfD01Oz9HV3SxiZ5hIg8ws9N&limit=1");
// xhr.done(data =>{ 
//     console.log("success got data", data); 
// });
// var x = loadJSON("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=6QP6KZF7WfD01Oz9HV3SxiZ5hIg8ws9N&limit=1", () => {
//     console.log(x);
// }, () => {});
async function go_button() {
    document.getElementById("h4").innerHTML = "";
    var query = document.getElementById("boxx").value;
    if(query == "") {
        return;
    }
    query = query.replace(' ', '+');
    console.log(query);
    var api_key = "6QP6KZF7WfD01Oz9HV3SxiZ5hIg8ws9N";
    var api_url = `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${api_key}&limit=1`;
    var response = await fetch(api_url);
    var json = await response.json();
    console.log(json);
    gif_object = json.data[0].images.downsized_medium;
    console.log(gif_object);
    document.getElementById("gif_output").src = gif_object.url;
}
function key_up_handler(e) {
    if(e.key == "Enter"){
        go_button();
    }
}
document.getElementById("input_btn").addEventListener("click", go_button);
document.addEventListener("keyup", key_up_handler, false);
document.getElementById("random_btn").addEventListener("click", async () => {
    var api_url = "https://random-word-api.herokuapp.com/word?number=1";
    var response = await fetch(api_url);
    var json = await response.json();
    var word = json[0];
    console.log(word);
    try {
        var giphy_api_key = "6QP6KZF7WfD01Oz9HV3SxiZ5hIg8ws9N";
        var giphy_api_url = `http://api.giphy.com/v1/gifs/search?q=${word}&api_key=${giphy_api_key}&limit=1`;
        var giphy_response = await fetch(giphy_api_url);
        var giphy_json = await giphy_response.json();
        console.log(giphy_json);
        gif_object = giphy_json.data[0].images.downsized_medium;
        console.log(gif_object);
        document.getElementById("gif_output").src = gif_object.url;
        document.getElementById("h4").innerHTML = word;
    }
    catch {
         document.getElementById("h4").innerHTML = `Giphy couldn't find a GIF for the random word "${word}", please click again`;
    }
});