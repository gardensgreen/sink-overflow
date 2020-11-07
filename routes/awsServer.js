const cloudinary = require('cloudinary').v2;
require('dotenv').config();
var file='/Users/jain44/Desktop/sinkOverflow/sink-overflow/public/Logo-02.svg';

// cloudinary.openUploadWidget({ cloud_name: 'sinkoverflow', upload_preset: 'sinkoverflow'}, 
//   function (error, result) { console.log(error, result) });
 
 cloudinary.uploader.unsigned_upload(file, "sinkoverflow", 
  { cloud_name: "sinkoverflow" }, 
   function (error, result) { console.log(result, error) });

const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const files = document.querySelector("[type=file]").files;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    formData.append("file", file);
    formData.append("upload_preset", "docs_upload_example_us_preset");

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        document.getElementById("data").innerHTML += data;
      });
  }
});
  
  //  cloudinary.uploader.upload(file, 
  // { resource_type: "media", 
  //   eager: [
  //     { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
  //     { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
  //   eager_async: true,
  //   eager_notification_url: "https://mysite.example.com/notify_endpoint" },
  // function(error, result) {console.log(result, error)});
// Get the timestamp in seconds
// var timestamp = Math.round((new Date).getTime()/1000);

// // Show the timestamp
// console.log('Timestamp:',timestamp);

// // Get the signature using the Node.js SDK method api_sign_request
// var signature = cloudinary.utils.api_sign_request({
//     timestamp: timestamp,}, process.env.API_SECRET);

// // Show the signature
// console.log('Signature:', signature);

// // ====================================================================================================

// // Having got the timestamp and signature of the parameters to sign, we can now build the curl command.  

// // URL of the file to upload
// var file='https://upload.wikimedia.org/wikipedia/commons/b/b1/VAN_CAT.png';

// // Build the curl command
// var curl_command = 'curl -d "file=' + file + 
//    '&api_key=878285479738192' + 
//    '&timestamp=' + timestamp +
//    '&signature=' + signature +
//    '" -X POST http://api.cloudinary.com/v1_1/carl/image/upload';

// // Show the curl command
// console.log('curl command:', curl_command);